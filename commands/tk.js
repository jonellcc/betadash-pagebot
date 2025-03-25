const axios = require('axios');

module.exports = {
  name: 'tk',
  description: 'Tiktok trend Philippines',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiUrl = `https://betadash-search-download.vercel.app/tiktrend`;

    try {
      sendMessage(senderId, { text: `[ 🔍 ] Finding tiktok trend Philippines\n\nPlease wait a sec...` }, pageAccessToken);

      const response = await axios.get(apiUrl);
      const videos = response.data.data.slice(0, 10); 

      const elements = videos.map(video => ({
        title: video.title,
        subtitle: `Views: ${video.play_count} | Likes: ${video.digg_count}`,
        image_url: video.cover,
        buttons: [
          {
            type: 'web_url',
            url: video.play,
            title: 'Watch Video'
          }
        ]
      }));

      const message = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: elements
          }
        }
      };

      sendMessage(senderId, message, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
