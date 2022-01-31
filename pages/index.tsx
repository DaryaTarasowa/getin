import type { NextPage } from 'next'
import Link from 'next/link'


import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import { Container, Row, Col } from 'react-bootstrap'

import Post, { PostInTableProps } from '../components/Post'

const fetchPosts = axios.get<PostInTableProps[]>('https://jsonplaceholder.typicode.com/posts');
    


const Home: NextPage = () => {
    
    const id_desc = (a: PostInTableProps, b: PostInTableProps) => { return a?.id - b?.id };
    const id_asc = (a: PostInTableProps, b: PostInTableProps) => { return b?.id - a?.id };
    const title_asc = (a: PostInTableProps, b: PostInTableProps) => (a?.title < b?.title) ? 1 : ((b?.title < a?.title) ? -1 : 0)
    const title_desc = (a: PostInTableProps, b: PostInTableProps) => (a?.title > b?.title) ? 1 : ((b?.title > a?.title) ? -1 : 0)


    const [posts, setPosts] = useState<PostInTableProps[]>([]);
    const [rendered, setRendered] = useState<PostInTableProps[]>([]);
    const [sortBy, setSortBy] = useState<string>("id_desc");


    const loadPosts = () => {
        fetchPosts.then(
            response => {
                if(response.data?.length){
                    response.data.forEach((post) => {
                        post.selected = false;
                    })
                }
                setPosts(response.data);
            }
        );
    }

    const renderPosts = (postsArray: PostInTableProps[] = posts) => {
        let postsToRender: PostInTableProps[] = postsArray;
        switch(sortBy){
            case "id_desc": postsToRender.sort(id_desc); break;
            case "id_asc": postsToRender.sort(id_asc); break;
            case "title_asc": postsToRender.sort(title_asc); break;
            case "title_desc": postsToRender.sort(title_desc); break;
            default: postsToRender.sort();
        }
        console.log(postsToRender[0]?.title);
        setRendered(postsToRender.slice(0,16));
    }

    useEffect(() => {
        loadPosts();
    },[])

    useEffect(() => {
        renderPosts();
    }, [posts, sortBy])

    const toggleSelection = (e: Event, selected:PostInTableProps):void =>{
        let newPost = selected;
        newPost.selected = !newPost.selected;
        renderPosts([...rendered.filter((post) => post.id !== selected.id), newPost]);
    }

    const deletePost = (postId:number) => {
        const newRendered = (rendered.filter((post) => post.id !== postId));
        setRendered(newRendered);
        const newPosts = (posts.filter((post) => post.id !== postId));
        setPosts(newPosts);
    }

    let renderPost = (post: PostInTableProps) => {
        return (
            <Post 
                id={post.id}
                key={`post${post.id}`}
                title={post.title}
                body={post.body}
                userId={post.userId}
                selected={post.selected}
                onToggleSelection={(e) => toggleSelection(e, post)}
                onDeletePost={deletePost}
            />
        )
    }

    const constructSelected = () => {
        const selected = rendered.filter((post) => post.selected === true);
        let result = "/";
        if(selected.length){
            result = '/postDetails';
            for(let post of selected){
                result+= '/' + post.id;
            }
        }
        return result;
    }

    let allSelected = rendered.filter((post) => post.selected === true).length === rendered.length && rendered.length > 0

    const selectAll = () => {
        let new_rendered = rendered.map((post) => {
            post.selected = !allSelected;
            return post;
        });
        setRendered(new_rendered);
    }

    return (
        <Container className="mt-5">
            <Container fluid>
                <Row>
                    <Col className="col col-sm-2">
                        <h4>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={selectAll}
                                style={{marginRight: "10px"}}
                            />
                            Select
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            Post title
                            { sortBy !== "title_desc" &&
                                <span onClick={() => setSortBy("title_desc")}  style={{cursor:"pointer"}}>
                                    &#9652;
                                </span>
                            }
                            { sortBy !== "title_asc" && 
                                <span onClick={() => setSortBy("title_asc")}  style={{cursor:"pointer"}}>
                                    &#9662;
                                </span>
                            }
                        </h4>
                    </Col>
                    <Col className="col col-sm-2"><h4>Actions</h4></Col>
                </Row>
                <hr></hr>
                { rendered.map(renderPost) }

                <hr></hr>

                <Row className="justify-content-center">
                    <Link href={constructSelected()} passHref>
                        <Button variant="primary">Show selected</Button>
                    </Link>
                </Row>
            
            </Container>
        
        </Container>
    )
}

export default Home
