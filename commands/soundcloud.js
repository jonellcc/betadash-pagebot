const axios = require('axios');

module.exports = {
  name: 'soundcloud',
  description: 'Soundcloud Search',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join("+");

    if (!query) {
      return sendMessage(senderId, { text: "Please provide a search first." }, pageAccessToken);
    }

    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/SoundCloud?search=${query}`;

    try {
      sendMessage(senderId, { text: "[ 🔍 ] Searching SoundCloud...\n\nPlease wait a moment..." }, pageAccessToken);

      const response = await axios.get(apiUrl);
      const { results } = response.data;

      if (!results || results.length === 0) {
        return sendMessage(senderId, { text: "No results found." }, pageAccessToken);
      }

      const elements = results.map(track => ({
        title: track.title,
        subtitle: `${track.artist} • ${track.plays} plays • ${track.duration} • Uploaded ${track.uploaded} ago`,
        image_url: track.thumbnail,
        default_action: {
          type: "web_url",
          url: track.url,
          webview_height_ratio: "compact"
        },
        buttons: [
          {
            type: 'web_url',
            url: track.url,
            title: 'Listen on SoundCloud'
          }
        ]
      }));

      const message = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: elements.slice(0, 10)
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
