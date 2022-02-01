import React from 'react'

import Row from 'react-bootstrap/Row'


type PaginatorProps = {
    limit: number,
    page: number,
    total: number,
    setPage: (i:number) => void
}

export default function Paginator(props: PaginatorProps) {

    const renderPages = (i:number) => {
        return (
            <div 
                className='p-3 pointer'
                onClick={() => props.setPage(i)}
            >
                { props.page === i ? <h5>{i}</h5> : i }
            
            </div>
        )
    }

    const createPagesNumbers = () => {
        const pagesNumber = Math.ceil(props.total/props.limit);
        let numbers = [];
        for(let i = 1; i <= pagesNumber; i++){
            numbers.push(i);
        }
        return (
            <Row className='justify-content-center'>
                {numbers.map(renderPages)}
            </Row>
        )
    }

    return (
        <div className='mt-3'>
            { createPagesNumbers() }
        </div>
    )
}