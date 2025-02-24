const axios = require('axios');

module.exports = {
  name: 'tiksearch',
  description: 'Fetch a TikTok video based on a search term.',
  author: 'Cliff',
  
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchTerm = args.join(' ');

    if (!searchTerm) {
      return sendMessage(senderId, { text: '❌ Please provide a search' }, pageAccessToken);
    }

    const apiUrl = `https://betadash-search-download.vercel.app/tiksearch?search=${encodeURIComponent(searchTerm)}`;

    try {
      sendMessage(senderId, { text: `[ 🔍 ] Searching for: '${searchTerm}', please wait...` }, pageAccessToken);

      const response = await axios.get(apiUrl, { headers });
      const videoUrl = response.data.url;

      if (videoUrl) {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
              is_reusable: false
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: '⚠️ No video found '}, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: error.message}, pageAccessToken);
    }
  }
};
