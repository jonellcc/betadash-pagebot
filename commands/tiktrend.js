const axios = require('axios');

module.exports = {
  name: 'tiktrend',
  description: 'Tiktok trend Philippines',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiUrl = `https://betadash-search-download.vercel.app/tiktrend`;

    try {
      const response = await axios.get(apiUrl);
      const videos = response.data.data.slice(0, 5);

      for (const video of videos) {
        const videoUrl = `https://www.tikwm.com/video/media/hdplay/${video.video_id}.mp4`;
        const message = {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
              is_reusable: true
            }
          },
          quick_replies: [
            {
              content_type: "text",
              title: "Help",
              payload: "HELP"
            },
            {
              content_type: "text",
              title: "Feedback",
              payload: "FEEDBACK"
            }
          ]
        };
        sendMessage(senderId, message, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
