const axios = require('axios');

module.exports = {
  name: 'lyrics',
  description: 'Fetch song lyrics',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const query = args.join(' ');

if (!query) {
          sendMessage(senderId, { text: 'please provide music you want to get the lyrics' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const { lyrics, title, artist, image } = response.data;

      if (lyrics) {
        const lyricsMessage = `Title: ${title}
Artist: ${artist}

𖢨°•°•——[ LYRICS ]——•°•°𖢨
${lyrics}
𖢨°•°•——[ LYRICS ]——•°•°𖢨`;

        const maxMessageLength = 2000;
        if (lyricsMessage.length > maxMessageLength) {
          const messages = splitMessageIntoChunks(lyricsMessage, maxMessageLength);
          for (const message of messages) {
            sendMessage(senderId, { text: message }, pageAccessToken);
          }
        } else {
          sendMessage(senderId, { text: lyricsMessage }, pageAccessToken);
        }

        if (image) {
          sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: {
                url: image,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: 'Sorry, no lyrics were found for your query.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
