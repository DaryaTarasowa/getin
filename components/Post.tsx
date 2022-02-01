import React from 'react'
import Link from 'next/link'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


export type PostProps = {
    id: number,
    userId: number,
    title: string,
    body: string,
}

export interface PostInTableProps extends PostProps {
    selected: boolean,
    onToggleSelection: (e: any) => void,
    onDeletePost: (id: number) => void,
}

export default function Post(props: PostInTableProps) {
    return (
        <Row key={`post${props.id}`} className="postRow">
            <Col className='col col-sm-2'>
                <input
                    type='checkbox'
                    checked={props.selected}
                    onChange={props.onToggleSelection}
                />
            </Col>
            <Col 
                className='pointer'
                onClick={props.onToggleSelection}
            >
                { props.title }
            </Col>
            <Col className='col col-sm-2'>
                <Link 
                    href={`/postDetails/${props.id}`}
                    passHref
                >
                    <Button variant='outline-secondary' size='sm'>
                        Show
                    </Button>
                </Link>{' '}
                <Button 
                    variant='outline-danger'
                    size='sm'
                    onClick={() => props.onDeletePost(props.id)}
                >
                    Delete
                </Button>
            </Col>
        </Row>
    )
}