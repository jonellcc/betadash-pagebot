const axios = require('axios');

module.exports = {
  name: 'tiksearch',
  description: 'Tiktok search',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/tiksearchv2?search=${encodeURIComponent(searchQuery)}&count=10`;

    try {
      const response = await axios.get(apiUrl);
      const videos = response.data.data;

      const elements = videos.map((video, index) => ({
        title: video.title,
        image_url: video.cover,
        default_action: {
          type: "web_url",
          url: video.video,
          webview_height_ratio: "compact"
        },
        buttons: [
          {
            type: 'web_url',
            url: video.video,
            title: 'Watch Video'
          }
      /**    {
            type: 'postback',
            title: `Watch ${index + 1}`,
            payload: `WATCH_VIDEO_${index}`
          } **/
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
