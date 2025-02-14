const axios = require('axios');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports = {
  name: 'music',
  description: 'Get an MP3 download link for a song from YouTube',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Please provide the name of the music you want to search' }, pageAccessToken);
      return;
    }

    try {
      const videoSearchUrl = `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`;
      const videoResponse = await axios.get(videoSearchUrl, { headers });
      const videoData = videoResponse.data[0];

      if (!videoData) {
        sendMessage(senderId, { text: 'Video not found. Please try another search.' }, pageAccessToken);
        return;
      }

      const videoUrl = videoData.url;

      const youtubeTrackUrl = `https://yt-video-production.up.railway.app/ytdl?url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(youtubeTrackUrl, { headers });
      const { audio, title, thumbnail, duration } = response.data;

      if (!audio) {
        sendMessage(senderId, { text: `Sorry, no download link found for "${query}"` }, pageAccessToken);
        return;
      }

      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `Duration: ${duration.label} (${duration.seconds}s)`,
                  default_action: {
                    type: 'web_url',
                    url: thumbnail,
                    webview_height_ratio: 'tall',
                  },
                  buttons: [
                     {
                     type: 'web_url',
                     title: 'Download Mp3',
                     url: audio,
                     webview_height_ratio: 'compact',
                   },
              ],
            },
         ],
      },
    },
  },
  pageAccessToken
);

      const headResponse = await axios.head(audio, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        await sendMessage(
          senderId,
          {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'Error: The audio file exceeds the 25 MB limit and cannot be sent.',
                buttons: [
                  {
                    type: 'web_url',
                    url: audio,
                    title: 'Download URL',
                  },
                ],
              },
            },
          },
          pageAccessToken
        );
      } else {
        sendMessage(
          senderId,
          {
            attachment: {
              type: 'audio',
              payload: {
                url: audio,
                is_reusable: true,
              },
            },
          },
          pageAccessToken
        );
      }
    } catch (error) {
      sendMessage(senderId, { text: "The google audio Url cannot be sent:\n" +  error.message }, pageAccessToken);
    }
  },
};
