// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    pid: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { pid } = req.query  
    const result = {
        pid: pid
    } as Data
    res.status(200).json(result)
}
