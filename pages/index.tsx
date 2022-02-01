import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import axios from 'axios'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Post, { PostInTableProps } from '../components/Post'
import Paginator from '../components/Paginator'

const fetchPosts = axios.get<PostInTableProps[]>('https://jsonplaceholder.typicode.com/posts');
    
const Home: NextPage = () => {
    
    const id_desc = (a: PostInTableProps, b: PostInTableProps) => { return a?.id - b?.id };
    const id_asc = (a: PostInTableProps, b: PostInTableProps) => { return b?.id - a?.id };
    const title_asc = (a: PostInTableProps, b: PostInTableProps) => (a?.title < b?.title) ? 1 : ((b?.title < a?.title) ? -1 : 0)
    const title_desc = (a: PostInTableProps, b: PostInTableProps) => (a?.title > b?.title) ? 1 : ((b?.title > a?.title) ? -1 : 0)

    const [posts, setPosts] = useState<PostInTableProps[]>([]);
    const [rendered, setRendered] = useState<PostInTableProps[]>([]);
    const [sortBy, setSortBy] = useState<string>('id_desc');
    const [page, setPage] = useState<number>(1);
    const [pageLimit] = useState<number>(12);

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
            case 'id_desc': postsToRender.sort(id_desc); break;
            case 'id_asc': postsToRender.sort(id_asc); break;
            case 'title_asc': postsToRender.sort(title_asc); break;
            case 'title_desc': postsToRender.sort(title_desc); break;
            default: postsToRender.sort();
        }
        setRendered(postsToRender.slice( (page - 1) * pageLimit, page * pageLimit ));
    }

    useEffect(() => {
        loadPosts();
    },[])

    useEffect(() => {
        renderPosts();
    }, [posts, sortBy, page])

    const toggleSelection = (e: Event, selected: PostInTableProps) :void =>{
        let newPost = selected;
        newPost.selected = !newPost.selected;
        renderPosts([...rendered.filter((post) => post.id !== selected.id), newPost]);
    }

    const deletePost = (postId :number) => {
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

    //Constructing the url for showing selected posts details
    const constructSelected = () => {
        const selected = rendered.filter((post) => post.selected === true);
        let result = '/';
        if(selected?.length){
            result = '/postDetails';
            for(let post of selected){
                result+= '/' + post.id;
            }
        }
        return result;
    }

    //if all rendered are selected, check the mark in the table head
    const allSelected = rendered.filter((post) => post.selected === true)?.length === rendered?.length && rendered?.length > 0

    const toggleAll = () => {
        const new_rendered = rendered.map((post) => {
            post.selected = !allSelected;
            return post;
        });
        setRendered(new_rendered);
    }

    return (
        <Container className='mt-5'>
            <Container fluid>
                <Row className='h4'>
                    <Col className='col col-sm-2'>                        
                        <input
                            type='checkbox'
                            checked={allSelected}
                            onChange={toggleAll}
                            className='mr-2'
                        />
                        Select                        
                    </Col>
                    <Col>                        
                        Post title
                        { sortBy !== 'title_desc' && 
                            <span onClick={() => setSortBy('title_desc')} className='pointer'>
                                &#9662;
                            </span>
                        }
                        { sortBy !== "title_asc" &&
                            <span onClick={() => setSortBy('title_asc')} className='pointer'>
                                &#9652;
                            </span>
                        }
                        
                    </Col>
                    <Col className='col col-sm-2'>
                        Actions
                    </Col>
                </Row>
                <hr></hr>

                <div style={{minHeight: '26rem'}}>
                    { rendered.map(renderPost) }
                </div>
                

                <Row className='justify-content-center'>
                    <Paginator limit={pageLimit} page={page} total={posts.length} setPage={setPage}/>
                </Row>      

                <hr></hr>

                <Row className='justify-content-center'>
                    <Link href={constructSelected()} passHref>
                        <Button variant='primary'>Show selected</Button>
                    </Link>
                </Row>
            
            </Container>
        </Container>
    )
}

export default Home
