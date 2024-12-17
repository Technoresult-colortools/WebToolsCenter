import { Metadata } from 'next';
import JwtEncoderClient from './JwtEncoderClient';

export const metadata: Metadata = {
    title: 'JWT (JSON Web Token) Explained | WebToolsCenter',
    description: 'Understand the structure of JSON Web Tokens (JWT), how they work, and how to securely encode and decode them for authentication and secure data transfer.',
    keywords: 'JWT, JSON Web Token, JWT authentication, JWT encoding, JWT decoding, secure token, web token, digital signature, user authentication, base64 encoded token, token verification',
    openGraph: {
        title: 'JWT (JSON Web Token) Explained | Learn and Encode | WebToolsCenter',
        description: 'Learn about JSON Web Tokens (JWT), their structure, and secure methods for encoding and decoding. Enhance your authentication and data security knowledge.',
        type: 'website',
        url: 'https://webtoolscenter.com/tools/coding/jwt-encoder-decoder',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JWT (JSON Web Token) Explained | Encode and Decode Securely',
        description: 'Explore the world of JWTs (JSON Web Tokens). Understand their structure and securely encode or decode them for authentication and data protection.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://webtoolscenter.com/tools/coding/jwt-encoder-decoder',
    },
};

export default function JWTEncoderDecoder() {
    return <JwtEncoderClient />;
}
