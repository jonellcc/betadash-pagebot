const axios = require('axios');

module.exports = {
  name: 'tiksearch',
  description: 'Tiktok search',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {

    const _0vk5 = senderId;
    const _0vk6 = args;
    const _0vk7 = pageAccessToken;
    const _0vk8 = sendMessage;
    const _0vk9 = _0vk6.join(' ');

    if (!_0vk9) {
      await _0vk8(_0vk5, { text: 'Please provide a search query.' }, _0vk7);
      return;
    }

    const _0vk10 = `https://betadash-api-swordslush-production.up.railway.app/tiksearchv2?search=${encodeURIComponent(_0vk9)}&count=10`;

    try {
      const _0vk11 = await axios.get(_0vk10);
      const _0vk12 = _0vk11.data.data.map(_0vk13 => ({
        title: '',
        subtitle: _0vk13.title,
        image_url: _0vk13.cover,
        default_action: {
          type: 'web_url',
          url: _0vk13.video,
          webview_height_ratio: 'compact'
        },
        buttons: [
          {
            type: 'web_url',
            url: _0vk13.video,
            title: 'Watch Video'
          }
        ]
      }));

      const _0vk14 = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: _0vk12
          }
        }
      };

      await _0vk8(_0vk5, _0vk14, _0vk7);
    } catch (_0vk15) {
      await _0vk8(_0vk5, {
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
      }, _0vk7);
    }
  }
};
