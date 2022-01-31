import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'


import PostCard from '../../components/PostCard'
import { PostProps } from '../../components/Post'

import { Container, Row, Col, Button } from 'react-bootstrap'

const PostDetails = () => {
    const router = useRouter()
    const { ids } = router.query

    const [posts, setPosts] = useState<PostProps[]>([])

    const handleLoad = () => {
        let postsToLoad: PostProps[] = [];
        axios.get<PostProps[]>('https://jsonplaceholder.typicode.com/posts')
            .then(response => {
                const data = response.data;
                if(data?.length && ids?.length){
                    for(let id of ids){
                        const post = data.find((post) => post.id === parseInt(id))
                        if(post){
                            postsToLoad.push(post);
                        }
                    }
                }
                setPosts(postsToLoad);
            });
    }

    useEffect(handleLoad, [ids]);

    const renderPostCard = (post: PostProps) => {
        return (
            <Col key={`post_card${post.id}`}>
                <PostCard post={post} img={`https://loremflickr.com/640/360/galaxy?random=${post.id}`}/>
            </Col>
        )
    }

    return (
        <Container className="mt-2">
            <Row>
                { posts.map(renderPostCard) }
            </Row>
            <Row className="justify-content-center mt-3">
                <Link href="/" passHref>
                    <Button variant="primary">Go Back</Button>
                </Link>
            </Row>
        </Container>
    )
}

export default PostDetails