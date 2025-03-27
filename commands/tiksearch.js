const axios = require('axios');

module.exports = {
  name: 'tiksearch',
  description: 'Tiktok search',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage, events) {
    if (events && events.postback && events.postback.payload) {
      const payload = events.postback.payload;

      if (payload.startsWith("WATCH_VIDEO_")) {
        const videoIndex = parseInt(payload.replace("WATCH_VIDEO_", ""), 10);
        const searchQuery = args.join(" ");
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
        return;
      }
    }

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
            title: 'Download'
          },
          {
            type: 'postback',
            title: `Watch ${index + 1}`,
            payload: `WATCH_VIDEO_${index}`
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
      await sendMessage(senderId, { text: "Failed to fetch TikTok videos." }, pageAccessToken);
    }
  }
};
