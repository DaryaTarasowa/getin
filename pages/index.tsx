import type { NextPage } from 'next'
import Link from 'next/link'


import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import { Container, Row, Col } from 'react-bootstrap'

import Post, { PostInTableProps } from '../components/Post'

const Home: NextPage = () => {

    const [posts, setPosts] = useState<PostInTableProps[]>([]);
    const [rendered, setRendered] = useState<PostInTableProps[]>([]);

    const loadPosts = () => {
        axios.get<PostInTableProps[]>('https://jsonplaceholder.typicode.com/posts')
            .then(response => {
                if(response.data?.length){
                    response.data.forEach((post) => {
                        post.selected = false;
                    })
                }
                setPosts( response.data );
            });
    }

    const renderPosts = (postsArray: PostInTableProps[] = posts) => {
        let postsToRender = postsArray.sort((a, b) => {return a.id - b.id});
        postsToRender.length = 16;
        setRendered(postsToRender);
    }

    useEffect(() => {
        loadPosts();
    },[])

    useEffect(() => {
        renderPosts();
    },[posts])

    const toggleSelection = (e: Event, selected:PostInTableProps):void =>{
        let newPost = selected;
        newPost.selected = !newPost.selected;
        renderPosts([...rendered.filter((post) => post.id !== selected.id), newPost]);
    }

    const deletePost = (postId:number) => {
        let newRendered = (rendered.filter((post) => post.id !== postId));
        setRendered(newRendered);
    }

    let renderPost = (post: PostInTableProps) => {
        return <Row>
            <Post 
                id={post.id}
                key={`post.${post.id}`}
                title={post.title}
                body={post.body}
                userId={post.userId}
                selected={post.selected}
                onToggleSelection={(e) => toggleSelection(e, post)}
                onDeletePost={deletePost}
            />
            </Row>
    }

    const constructSelected = () => {
        let result = "/";
        let selected = rendered.filter((post) => post.selected === true);
        if(selected.length){
            result = '/postDetails';
            for(let post of selected){
                result+= '/' + post.id;
            }
        }
        return result;
    }

    return (
        <Container className="mt-5">
            <Container fluid>
                <Row>
                    <Col className="col col-sm-1"><h4>Select</h4></Col>
                    <Col><h4>Post title</h4></Col>
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
