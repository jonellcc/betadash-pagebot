const axios = require('axios');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports = {
  name: 'sc',
  description: 'Souncloud search music',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Please provide the name of the music you want to search' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://betadash-search-download.vercel.app/sc?search=${encodeURIComponent(query)}`;

      if (!apiUrl) {
        sendMessage(senderId, { text: `Sorry, no download link found for "${query}"` }, pageAccessToken);
        return;
      }

      const headResponse = await axios.head(apiUrl, { headers });
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
                  url: apiUrl,
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
              url: apiUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }

    } catch (error) {
      sendMessage(
        senderId,
        { text: error.message },
        pageAccessToken
      );
    }
  },
};
