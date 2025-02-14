export const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }
  
  interface Thumbnail {
    url: string
    width: number
    height: number
  }
  
  export const fetchThumbnails = async (videoId: string): Promise<Thumbnail[]> => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    )
    const data = await response.json()
  
    if (data.items && data.items.length > 0) {
      const thumbnailsData = data.items[0].snippet.thumbnails
  
      return Object.values(thumbnailsData)
      .map((thumb) => {
        const thumbnail = thumb as { url: string; width: number; height: number }
        return {
          url: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height,
        }
      })
        .sort((a, b) => b.width - a.width)
    } else {
      throw new Error('No thumbnail found for this video')
    }
  }