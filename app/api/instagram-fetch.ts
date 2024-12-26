import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { url } = req.body;

    try {
        const mediaId = url.split('/').slice(-2)[0];
        const response = await axios.get(`https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`);

        const data = response.data;

        res.status(200).json({ data: [data] });
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        res.status(500).json({ message: 'Error fetching Instagram data' });
    }
}
