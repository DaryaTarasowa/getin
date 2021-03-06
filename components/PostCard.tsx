import React from 'react'

import Card from 'react-bootstrap/Card'

import { PostProps } from './Post'

export type PostCardProps = {
    post: PostProps,
    img: string
}

export default function PostCard(props: PostCardProps) {

    return (
        <Card style={{ width: '20rem' }} className='mt-3'>
            <Card.Img variant='top' src={props.img} />
            <Card.Body className='overflow-auto' style={{ height: '16rem'}}>
                <Card.Title>{ props.post.title }</Card.Title>
                <Card.Text>
                    { props.post.body }
                </Card.Text>
            </Card.Body>
        </Card>
    )
}