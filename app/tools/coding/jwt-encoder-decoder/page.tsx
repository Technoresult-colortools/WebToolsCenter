import { Metadata } from 'next';
import JwtEncoderClient from './JwtEncoderClient';

export const metadata: Metadata = {
    title: 'JWT (JSON Web Token) Explained | WebToolsCenter',
    description: 'Understand the structure of JSON Web Tokens (JWT), how they work, and how to securely encode and decode them for authentication and secure data transfer.',
    keywords: 'JWT, JSON Web Token, JWT authentication, JWT encoding, JWT decoding, secure token, web token, digital signature, user authentication, base64 encoded token, token verification',
};

  
export default function JWTEncoderDecoder() {
  return <JwtEncoderClient />;
}