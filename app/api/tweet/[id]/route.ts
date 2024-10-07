import { NextResponse } from 'next/server';

const TWITTER_API_TOKEN = process.env.TWITTER_API_TOKEN;
const TWITTER_API_URL = 'https://api.twitter.com/2/tweets';

// Define an interface for the media item
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
    console.error('Twitter API token not configured');
    return NextResponse.json(
      { error: 'Twitter API token not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${TWITTER_API_URL}/${id}?expansions=author_id,attachments.media_keys&user.fields=name,username,profile_image_url&tweet.fields=created_at&media.fields=url,preview_image_url,type`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_API_TOKEN}`,
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error:', errorText);
      throw new Error(`Twitter API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data) {
      throw new Error('Tweet not found or is not accessible');
    }

    const user = data.includes?.users?.[0];
    if (!user) {
      throw new Error('User information not found in response');
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

    return NextResponse.json(formattedResponse);
  } catch (error: unknown) {
    console.error('Error fetching tweet:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch tweet data', details: errorMessage },
      { status: 500 }
    );
  }
}
