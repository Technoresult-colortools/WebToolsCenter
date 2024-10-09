import { NextResponse } from 'next/server';

const TWITTER_API_TOKEN = process.env.TWITTER_API_TOKEN;
const TWITTER_API_URL = 'https://api.twitter.com/2/tweets';

interface User {
  name: string;
  username: string;
  profile_image_url: string;
}

interface MediaItem {
  type: string;
  url: string | undefined;
  preview_image_url?: string; // Added this line to include preview_image_url
}

interface TwitterApiResponse {
  data: {
    text: string;
    created_at: string;
  };
  includes?: {
    users?: User[];
    media?: MediaItem[];
  };
}

interface FetchError {
  message: string;
  name: string;
  stack?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Debug log 1: Check if we have the token
  console.log('Token available:', !!TWITTER_API_TOKEN);
  
  if (!TWITTER_API_TOKEN) {
    console.error('Twitter API token is missing in environment variables');
    return NextResponse.json(
      { error: 'Twitter API token not configured' },
      { status: 500 }
    );
  }

  try {
    // Debug log 2: Log the URL we're fetching
    const url = `${TWITTER_API_URL}/${id}?expansions=author_id,attachments.media_keys&user.fields=name,username,profile_image_url&tweet.fields=created_at&media.fields=url,preview_image_url,type`;
    console.log('Fetching URL:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TWITTER_API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    // Debug log 3: Log the response status
    console.log('Twitter API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error response:', errorText);
      
      return NextResponse.json({
        error: 'Twitter API request failed',
        status: response.status,
        details: errorText
      }, { status: response.status });
    }

    const data: TwitterApiResponse = await response.json();

    // Debug log 4: Log the response data structure
    console.log('Twitter API Response Structure:', {
      hasData: !!data.data,
      hasIncludes: !!data.includes,
      hasUsers: !!(data.includes?.users?.length)
    });

    if (!data.data) {
      return NextResponse.json({
        error: 'Tweet not found or inaccessible',
        details: 'The API response did not contain tweet data'
      }, { status: 404 });
    }

    const user = data.includes?.users?.[0];
    if (!user) {
      return NextResponse.json({
        error: 'User information missing',
        details: 'The API response did not contain user data'
      }, { status: 500 });
    }

    const formattedResponse = {
      text: data.data.text,
      created_at: data.data.created_at,
      user: {
        name: user.name,
        username: user.username,
        profile_image_url: user.profile_image_url,
      },
      media: data.includes?.media?.map((item: MediaItem) => ({
        type: item.type,
        url: item.url || item.preview_image_url,
      })) || [],
    };

    // Debug log 5: Log successful response
    console.log('Successfully formatted response');
    
    return NextResponse.json(formattedResponse);
  } catch (error) {
    const fetchError = error as FetchError; // Cast the error to the specific interface

    // Enhanced error logging
    console.error('Detailed error information:', {
      message: fetchError.message,
      stack: fetchError.stack,
      name: fetchError.name
    });

    return NextResponse.json({
      error: 'Failed to fetch tweet data',
      details: fetchError.message,
      type: fetchError.name
    }, { status: 500 });
  }
}
