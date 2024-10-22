const axios = require('axios');

module.exports = {
  name: 'tiksearch', 
  description: 'Get a TikTok video',
  author: 'Cliff & John liby',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchTerm = args.join(' '); 
    const apiUrl = `https://betadash-search-download.vercel.app/tiksearch?search=${encodeURIComponent(searchTerm)}`; 

    try {
      sendMessage(senderId, { text: 'Fetching video, please wait...' }, pageAccessToken);

      const response = await axios.get(apiUrl);
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
        sendMessage(senderId, { text: 'Sorry, no video found.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
