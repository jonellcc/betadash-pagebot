const axios = require('axios');

module.exports = {
  name: 'tikdl',
  description: 'TikTok Downloader',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Enter a valid TikTok link' }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: 'Downloading, please wait...' }, pageAccessToken);

      const apiUrl = `https://betadash-search-download.vercel.app/api/tiktok?link=${encodeURIComponent(query)}`;      

      const response = await axios.get(apiUrl);
      const downloadUrl = response.data.downloadUrls[0];

      if (downloadUrl) {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: downloadUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: "Sorry, I couldn't fetch the video URL." }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
