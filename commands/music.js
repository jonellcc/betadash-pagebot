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
      sendMessage(senderId, { text: `🔍 | Searching music: ${query}` }, pageAccessToken);
      const apiUrl = `https://dlvc.vercel.app/yt-audio?search=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl, { headers });
      const { downloadUrl, title, time, thumbnail, views } = response.data;

      if (!downloadUrl) {
        sendMessage(senderId, { text: `Sorry, no download link found for "${query}"` }, pageAccessToken);
        return;
      }

      const head = await axios.head(downloadUrl, { headers });
      const length = parseInt(head.headers['content-length'], 10);
      const size = length / (1024 * 1024);


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
            subtitle: views,
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


      if (size <= 25) {
        sendMessage(
          senderId,
          {
            attachment: {
              type: 'audio',
              payload: {
                url: downloadUrl,
                is_reusable: true,
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
              type: 'template',
              payload: {
                template_type: 'button',
                text: `Error: The video exceeds the 25 MB limit and cannot be sent.\n\n𝗧𝗶𝘁𝗹𝗲: ${title}\n𝗨𝗿𝗹: ${downloadUrl}`,
                buttons: [
                  {
                    type: 'web_url',
                    url: downloadUrl,
                    title: 'Watch Video',
                  },
                ],
              },
            },
          },
          pageAccessToken
        );
      }
    } catch (error) {
      sendMessage(
        senderId,
        { text: 'Music not found please try again ' },
        pageAccessToken
      );
    }
  },
};