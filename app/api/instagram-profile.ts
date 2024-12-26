import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { url } = req.body;

    try {
        const response = await axios.get(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`);

        const data = response.data;

        const profileData = {
            username: data.username,
            fullName: '', // Not available through basic display API
            biography: '', // Not available through basic display API
            followersCount: 0, // Not available through basic display API
            followingCount: 0, // Not available through basic display API
            postsCount: data.media_count
        };

        res.status(200).json(profileData);
    } catch (error) {
        console.error('Error fetching Instagram profile data:', error);
        res.status(500).json({ message: 'Error fetching Instagram profile data' });
    }
}
