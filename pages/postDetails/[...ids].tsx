import React, {useEffect, useState} from 'react'

import axios from 'axios'
import { useRouter } from 'next/router'


import PostCard from '../../components/PostCard'
import { PostProps } from '../../components/Post'

import { Container, Row, Col } from 'react-bootstrap'

const PostDetails = () => {
    const router = useRouter()
    const { ids } = router.query
    const [posts, setPosts] = useState<PostProps[]>([])

    const loadById = () => {
        let posts_array: PostProps[] = [];
        axios.get<PostProps[]>('https://jsonplaceholder.typicode.com/posts')
            .then(response => {
                let data = response.data;
                if(data?.length && ids?.length){
                    for(let id of ids){
                        let search = data.find((post) => post.id.toString() === id)
                        if(search){
                            posts_array.push(search);
                        }
                    }
                }
                setPosts(posts_array);
            });
    }

    useEffect(loadById, [ids]);

    const renderPostCard = (post: PostProps) => {
        return  <Col key={`post_card${post.id}`}>
                    <PostCard post={post} img={`https://loremflickr.com/640/360?random=${post.id}`}/>
                </Col>
    }

    return (
        <Container>
            <Row>
            {posts.map(renderPostCard)}
            </Row>
        </Container>
    )
}

export default PostDetails