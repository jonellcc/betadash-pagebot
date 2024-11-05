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
      const apiUrl = `https://dlvc.vercel.app/yt-audio?search=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl, { headers });
      const { downloadUrl, title, time, thumbnail, views } = response.data;

      if (!downloadUrl) {
        sendMessage(senderId, { text: `Sorry, no download link found for "${query}"` }, pageAccessToken);
        return;
      }

      sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `Views: ${views} - Duration: ${time}`,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                  }
                }
              ]
            }
          }
        },
        pageAccessToken
      );

      const headResponse = await axios.head(downloadUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `Error: The audio file exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: downloadUrl,
                  title: 'Download URL'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: downloadUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }

    } catch (error) {
      sendMessage(
        senderId,
        { text: 'Music not found. Please try again.' },
        pageAccessToken
      );
    }
  },
};
