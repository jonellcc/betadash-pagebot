const axios = require('axios');

module.exports = {
  name: 'lootedpinay',
  description: '',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let page = parseInt(args[0]);
    if (isNaN(page) || page < 1 || page > 91) {
      page = 1;
    }

    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/lootedpinay?page=${page}`;

    try {
      const response = await axios.get(apiUrl);
      const videos = response.data.result.slice(0, 10);

      const elements = videos.map(video => ({
        title: video.title,
        image_url: video.image,
        default_action: {
          type: "web_url",
          url: video.videoUrl,
          webview_height_ratio: "compact"
        },
        buttons: [
          {
            type: 'web_url',
            url: video.videoUrl,
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
