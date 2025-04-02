const axios = require('axios');

module.exports = {
  name: 'tiktrend',
  description: 'Tiktok trend Philippines',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiUrl = `https://betadash-search-download.vercel.app/tiktrend`;

    try {
      sendMessage(senderId, { text: `[ 🔍 ] 𝗙𝗶𝗻𝗱𝗶𝗻𝗴 𝘁𝗶𝗸𝘁𝗼𝗸 𝘁𝗿𝗲𝗻𝗱 𝗣𝗵𝗶𝗹𝗶𝗽𝗽𝗶𝗻𝗲𝘀\n\nP𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝗌𝖾𝖼...` }, pageAccessToken);

      const response = await axios.get(apiUrl);
      const videos = response.data.data; 

      const elements = videos.map(video => ({
        title: video.title,
        subtitle: `Views: ${video.play_count}\nLikes: ${video.digg_count}`,
        image_url: video.cover,
        default_action: {
          type: "web_url",
          url: `https://www.tikwm.com/video/media/hdplay/${video.video_id}.mp4`,
          webview_height_ratio: "compact"
        },
        buttons: [
          {
            type: 'web_url',
            url: `https://www.tikwm.com/video/media/hdplay/${video.video_id}.mp4`,
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

      await sendMessage(senderId, message, pageAccessToken);
    } catch (error) {
await sendMessage(senderId, {
  attachment: {
    type: "template",
    payload: {
      template_type: "media",
      elements: [
        {
          media_type: "video",
          url: "https://www.facebook.com/beluga.xyz/videos/2070790143388193/?app=fbl"
        }
      ]
    }
  }
  }, pageAccessToken);
   }
 }
};
