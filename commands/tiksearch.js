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
      const quickReplies = response.data.data.map((video, index) => ({
        content_type: "text",
        title: `Watch ${index + 1}`,
        payload: `WATCH_VIDEO_${index}`,
      }));

      const elements = response.data.data.map(video => ({
        title: video.title,
        image_url: video.cover,
        default_action: {
          type: "web_url",
          url: video.video,
          webview_height_ratio: "tall"
        },
        buttons: [
          {
            type: 'web_url',
            url: video.video,
            title: 'Download'
          }
        ]
      }));

      await sendMessage(senderId, {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: elements
          }
        },
        quick_replies: quickReplies
      }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, { text: "Failed to fetch TikTok videos." }, pageAccessToken);
    }
  },

  async handleQuickReply(senderId, payload, pageAccessToken, sendMessage, searchQuery) {
    if (payload.startsWith("WATCH_VIDEO_")) {
      const videoIndex = parseInt(payload.replace("WATCH_VIDEO_", ""), 10);
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/tiksearchv2?search=${encodeURIComponent(searchQuery)}&count=10`;

      try {
        const response = await axios.get(apiUrl);
        const videos = response.data.data;

        if (videoIndex >= 0 && videoIndex < videos.length) {
          const videoUrl = videos[videoIndex].video;

          await sendMessage(senderId, {
            attachment: {
              type: 'video',
              payload: {
                url: videoUrl,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        }
      } catch (error) {
        await sendMessage(senderId, { text: "Failed to retrieve the video." }, pageAccessToken);
      }
    }
  }
};

