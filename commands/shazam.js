const axios = require('axios');

module.exports = {
  name: 'shazam',
  description: 'Shazam Search',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args.length) {
      return sendMessage(senderId, { text: "Please provide a song title." }, pageAccessToken);
    }

    const query = args.join("+");
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/shazam?title=${query}&limit=10`;

    try {
     /** sendMessage(senderId, { text: `[ 🔍 ] Searching for "${args.join(" ")}" on Shazam...\n\nPlease wait...` }, pageAccessToken); **/

      const response = await axios.get(apiUrl);
      const { results } = response.data;

      if (!results || results.length === 0) {
        return sendMessage(senderId, { text: `No results found for "${args.join(" ")}".` }, pageAccessToken);
      }

      const elements = results.map(track => ({
        title: track.title,
        subtitle: ` • ${track.artistName}\n • ${track.albumName}\n • Released: ${track.releaseDate}`,
        image_url: track.thumbnail,
        default_action: {
          type: "web_url",
          url: track.appleMusicUrl,
          webview_height_ratio: "tall"
        },
        buttons: [
          {
            type: 'web_url',
            url: track.appleMusicUrl,
            title: 'Listen on Apple Music'
          },
          {
            type: 'web_url',
            url: track.previewUrl,
            title: 'Preview Song'
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
        text: error.message
      }, pageAccessToken);
    }
  }
};
