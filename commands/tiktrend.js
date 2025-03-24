const axios = require('axios');

module.exports = {
  name: 'tiktrend',
  description: 'Tiktok trend Philippines',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiUrl = `https://betadash-search-download.vercel.app/tiktrend`;

    try {
      sendMessage(senderId, { text: `[ 🔍 ] 𝗙𝗶𝗻𝗱𝗶𝗻𝗴 𝘁𝗶𝗸𝘁𝗼𝗸 𝘁𝗿𝗲𝗻𝗱 𝗣𝗵𝗶𝗹𝗶𝗽𝗽𝗶𝗻𝗲𝘀\n\n𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝗌𝖾𝖼...` }, pageAccessToken);
      const response = await axios.get(apiUrl);
      const videos = response.data.data.slice(0, 3);

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
