const axios = require('axios');

module.exports = {
  name: 'insta',
  description: 'INSTAGRAM Downloader',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Enter a valid Instagram link' }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: 'Downloading, please wait...' }, pageAccessToken);

      const apiUrl = `https://betadash-search-download.vercel.app/insta?url=${encodeURIComponent(query)}`;

      const response = await axios.get(apiUrl);
      const videoUrl = response.data.result[0]._url;

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
        sendMessage(senderId, { text: "Sorry, I couldn't fetch the video URL." }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
