const axios = require('axios');

module.exports = {
  name: 'tiksearch',
  description: 'Tiktok search',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
  const searchQuery = args.join(' ');

 if (!searchQuery) {
      await sendMessage(senderId, { text: 'Please provide a search query.' }, pageAccessToken);
      return;
    }

    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/tiksearchv2?search=${encodeURIComponent(searchQuery)}&count=10`;

    try {
      const response = await axios.get(apiUrl);
      const elements = response.data.data.map(item => ({
        title: searchQuery,
        subtitle: item.title,
        image_url: item.cover,
        default_action: {
          type: 'web_url',
          url: item.video,
          webview_height_ratio: 'tall'
        },
        buttons: [
          {
            type: 'web_url',
            url: item.video,
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
          type: 'template',
          payload: {
            template_type: 'media',
            elements: [
              {
                media_type: 'video',
                url: 'https://www.facebook.com/beluga.xyz/videos/2070790143388193/?app=fbl'
              }
            ]
          }
        }
      }, pageAccessToken);
    }
  }
};
