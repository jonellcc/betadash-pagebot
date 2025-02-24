const axios = require('axios');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json'
};

module.exports = {
  name: 'tiksearch',
  description: 'Fetch a TikTok video based on a search term.',
  author: 'Cliff',
  
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchTerm = args.join(' ').trim();

    if (!searchTerm) {
      return sendMessage(senderId, { text: '❌ Please provide a search' }, pageAccessToken);
    }

    const apiUrl = `https://betadash-search-download.vercel.app/tiksearch?search=${encodeURIComponent(searchTerm)}`;

    try {
      sendMessage(senderId, { text: `🔍 Searching for '${searchTerm}', please wait...` }, pageAccessToken);

      const response = await axios.get(apiUrl, { headers });
      const videoUrl = response.data.url;

      if (videoUrl) {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: '⚠️ No video found '}, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: '🚨 An error occurred while searching. Please try again later.' }, pageAccessToken);
    }
  }
};
