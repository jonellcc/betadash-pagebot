const axios = require('axios');

module.exports = {
  name: 'lyrics',
  description: 'Fetch song lyrics',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');

 if (!query) {
          sendMessage(senderId, { text: 'please provide music you want to get the lyrics' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/lyrics-finder?title=${encodeURIComponent(query)}`;
      const responsee = await axios.get(apiUrl);
      const { response, Title, artist, Thumbnail } = responsee.data;

      if (response) {
        const lyricsMessage = `𝗧𝗶𝘁𝗹𝗲: ${Title}\n\n${response}`;
          sendMessage(senderId, { text: lyricsMessage }, pageAccessToken);
        }

        if (Thumbnail) {
          sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: {
                url: Thumbnail,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: 'Sorry, no lyrics were found for your query.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: `Sorry, no lyrics were found for your query. ${query}` }, pageAccessToken);
    }
  }
};
