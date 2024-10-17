import { NextResponse } from 'next/server';

const TWITTER_API_TOKEN = process.env.TWITTER_API_TOKEN;
const TWITTER_API_URL = 'https://api.twitter.com/2/tweets';

interface MediaItem {
  type: string;
  url?: string;
  preview_image_url?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!TWITTER_API_TOKEN) {
    console.error('Twitter API token is missing');
    return NextResponse.json(
      { 
        error: 'Twitter API token not configured',
        details: 'Please configure a valid Twitter API token'
      },
      { status: 500 }
    );
  }

  try {
    const url = `${TWITTER_API_URL}/${id}?expansions=author_id,attachments.media_keys&user.fields=name,username,profile_image_url&tweet.fields=created_at&media.fields=url,preview_image_url,type`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TWITTER_API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (response.status === 403) {
      const errorData = await response.json();
      console.error('Twitter API authentication error:', errorData);
      
      return NextResponse.json({
        error: 'Twitter API authentication failed',
        details: 'Your Twitter API token does not have the required access level. Please ensure you have Elevated access enabled in your Twitter Developer Portal.',
        errorData
      }, { status: 403 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error:', errorText);
      
      return NextResponse.json({
        error: 'Twitter API request failed',
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('API Route - Received data structure:', JSON.stringify(data, null, 2));

    if (!data.data) {
      return NextResponse.json({
        error: 'Tweet not found',
        details: 'No tweet data in response'
      }, { status: 404 });
    }

    const user = data.includes?.users?.[0];
    if (!user) {
      return NextResponse.json({
        error: 'User data missing',
        details: 'No user data in response'
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

    console.log('API Route - Sending formatted response:', JSON.stringify(formattedResponse, null, 2));
    return NextResponse.json(formattedResponse);

  } catch (error) {
    console.error('API Route - Caught error:', error);
    return NextResponse.json({
      error: 'Failed to fetch tweet data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
