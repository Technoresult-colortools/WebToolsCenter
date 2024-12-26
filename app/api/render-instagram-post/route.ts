import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

interface Comment {
  username: string
  text: string
}

interface PostProps {
  theme: 'light' | 'dark'
  username: string
  isVerified: boolean
  location: string
  postTime: string
  avatarUrl: string
  postImageUrl: string
  postText: string
  likeCount: number
  commentCount: number
  isLikedByViewer: boolean
  hasInstagramStory: boolean
  areCommentsDisplayed: boolean
  imageCount: number
  currentImageIndex: number
  isSomeoneTagged: boolean
  comments: Comment[]
}

export async function POST(req: Request) {
  try {
    const postProps: PostProps = await req.json()
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()

    await page.setViewport({
      width: 375,
      height: 470,
      deviceScaleFactor: 2
    })

    const processText = (text: string) => {
      return text
        .replace(/#[\w]+/g, match => `<span style="color: ${postProps.theme === 'light' ? '#00376b' : '#e0f1ff'}">${match}</span>`)
        .replace(/@[\w]+/g, match => `<span style="color: ${postProps.theme === 'light' ? '#00376b' : '#e0f1ff'}">${match}</span>`)
        .replace(/(https?:\/\/[^\s]+)/g, match => `<a href="${match}" style="color: ${postProps.theme === 'light' ? '#00376b' : '#e0f1ff'}; text-decoration: none;">${match}</a>`)
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              margin: 0; 
              padding: 0; 
              background: transparent;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            .post-container {
              width: 375px;
              background: ${postProps.theme === 'light' ? 'white' : '#000000'};
              color: ${postProps.theme === 'light' ? 'black' : '#ffffff'};
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              position: relative;
            }
            
            .header {
              padding: 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid ${postProps.theme === 'light' ? '#efefef' : '#262626'};
            }
            
            .user-info {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .avatar-container {
              position: relative;
              width: 32px;
              height: 32px;
            }
            
            .avatar {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              overflow: hidden;
              position: relative;
              z-index: 1;
              border: 2px solid ${postProps.theme === 'light' ? 'white' : '#000000'};
            }
            
            .post-image-container {
              position: relative;
              width: 375px;
              height: 375px;
              background: ${postProps.theme === 'light' ? '#fafafa' : '#262626'};
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .post-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .engagement {
              padding: 14px;
            }
            
            .actions {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
            }
            
            .action-icons {
              display: flex;
              gap: 16px;
            }
            
            .story-ring {
              position: absolute;
              inset: -3px;
              border-radius: 50%;
              background: linear-gradient(45deg, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
              padding: 2px;
            }
            
            .watermark {
              position: absolute;
              bottom: 8px;
              right: 8px;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.7);
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
              z-index: 10;
            }
            
            .post-text {
              margin: 8px 0;
              line-height: 1.4;
              font-size: 14px;
            }
            
            .comments {
              margin-top: 8px;
              font-size: 14px;
            }
            
            .comment {
              margin-top: 4px;
            }
            
            .username {
              font-weight: 600;
            }
            
            .post-text a, .comments a {
              color: ${postProps.theme === 'light' ? '#00376b' : '#e0f1ff'};
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div id="instagram-post" class="post-container">
            <div class="header">
              <div class="user-info">
                <div class="avatar-container">
                  ${postProps.hasInstagramStory ? `
                    <div class="story-ring">
                      <div class="story-ring-inner"></div>
                    </div>
                  ` : ''}
                  <div class="avatar">
                    ${postProps.avatarUrl ? 
                      `<img src="${postProps.avatarUrl}" alt="User avatar" style="width: 100%; height: 100%; object-fit: cover;">` :
                      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 100%; height: 100%; padding: 6px;">
                        <path stroke-width="1.5" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle stroke-width="1.5" cx="12" cy="7" r="4"></circle>
                      </svg>`
                    }
                  </div>
                </div>
                <div>
                  <div style="font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 4px;">
                    ${postProps.username}
                    ${postProps.isVerified ? `
                    <svg aria-label="Verified" style="width: 12px; height: 12px;" fill="#0095F6" viewBox="0 0 40 40">
                    <path d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Z" />
                    <path fill="white" d="m28.108 14.86-11.562 11.56-4.95-4.95 1.449-1.449 3.501 3.501 10.113-10.112 1.45 1.45Z" />
                  </svg>
                ` : ''}
                    <span style="color: ${postProps.theme === 'light' ? '#737373' : '#a8a8a8'}; font-size: 12px;">• ${postProps.postTime}</span>
                  </div>
                  ${postProps.location ? `
                    <div style="font-size: 12px; color: ${postProps.theme === 'light' ? '#737373' : '#a8a8a8'};">
                      ${postProps.location}
                    </div>
                  ` : ''}
                </div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
                <circle cx="5" cy="12" r="2"></circle>
              </svg>
            </div>
            
            <div class="post-image-container">
              ${postProps.postImageUrl ? `
                <img 
                  src="${postProps.postImageUrl}" 
                  alt="Post content"
                  class="post-image"
                 
                >
              ` : ''}
              ${postProps.isSomeoneTagged ? `
                <div style="
                  position: absolute; 
                  bottom: 12px; 
                  left: 12px; 
                  background: #333333; 
                  border-radius: 50%; 
                  width: 24px; 
                  height: 24px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                ">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M21.334 23H2.666a1 1 0 0 1-1-1v-1.354a6.279 6.279 0 0 1 6.272-6.272h8.124a6.279 6.279 0 0 1 6.271 6.271V22a1 1 0 0 1-1 1ZM12 13.269a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6Z" />
                  </svg>
                </div>
              ` : ''}

              ${postProps.imageCount > 1 ? `
              <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%);">
                
                  <img
                    src="data:image/png;base64,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"
                    alt="Chevron Right"
                    style="width: 24px; height: 24px;"
                  />
                
              </div>
            
                <div style="
                  position: absolute;
                  bottom: 16px;
                  left: 50%;
                  transform: translateX(-50%);
                  display: flex;
                  gap: 6px; /* Increased spacing for better aesthetics */
                ">
                  ${Array.from({ length: postProps.imageCount }, (_, i) => `
                    <div style="
                      width: 8px;
                      height: 8px;
                      border-radius: 50%;
                      background: ${i === postProps.currentImageIndex
                        ? '#ffffff' /* Active dot color */
                        : (postProps.theme === 'light' ? '#cccccc' : '#666666') /* Inactive dot color */
                      };
                      transform: ${i === postProps.currentImageIndex ? 'scale(1.25)' : 'scale(1)'}; /* Scaling for active dot */
                      opacity: ${i === postProps.currentImageIndex ? '1' : '0.6'}; /* Transparency for inactive dots */
                      transition: all 0.2s ease-in-out; /* Smooth transitions */
                    "></div>
                  `).join('')}
                </div>
              ` : ''}

            </div>
            
            <div class="engagement">
            <div class="actions">
              <div class="action-icons">
                <!-- Updated Heart Icon -->
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="${postProps.isLikedByViewer ? '#ed4956' : 'none'}" 
                  stroke="${postProps.isLikedByViewer ? '#ed4956' : 'currentColor'}" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                
                <!-- Updated Comment Icon -->
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>

                <!-- Updated Share Icon -->
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="2"
                    x1="22"
                    x2="9.218"
                    y1="3"
                    y2="10.083"
                  />
                  <polygon
                    fill="none"
                    points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              
              <div style="font-weight: 600; margin-bottom: 8px;">
                ${postProps.likeCount.toLocaleString()} likes
              </div>
              
              <div class="post-text">
                <span class="username">${postProps.username}</span>
                ${processText(postProps.postText)}
              </div>
              
              ${postProps.areCommentsDisplayed && postProps.comments.length > 0 ? `
                <div class="comments">
                  ${postProps.comments.map((comment: Comment) => `
                    <div class="comment">
                      <span class="username">${comment.username}</span>
                      ${processText(comment.text)}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

          </div>
        </body>
      </html>
    `

    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    })

    await page.waitForSelector('#instagram-post')
    if (postProps.postImageUrl) {
      try {
        await page.waitForSelector(`img[src="${postProps.postImageUrl}"]`, { timeout: 5000 })
      } catch (error) {
        console.warn(`Failed to load image: ${postProps.postImageUrl}`)
      }
    }

    const element = await page.$('#instagram-post')
    if (!element) {
      throw new Error('Instagram post element not found')
    }

    const buffer = await element.screenshot({
      type: 'png',
      omitBackground: true
    })

    await browser.close()

    const exportFormat = 'png';
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const filename = `instagram_post_${randomNumber}_webtoolcenter.${exportFormat}`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Detailed error:', error)
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace available'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

