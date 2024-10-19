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
      const apiUrl = `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result && result.lyrics) {
        const lyricsMessage = `Title: ${result.title}\nArtist: ${result.artist}\n\n${result.lyrics}`;

        const maxMessageLength = 2000;
        if (lyricsMessage.length > maxMessageLength) {
          const messages = splitMessageIntoChunks(lyricsMessage, maxMessageLength);
          for (const message of messages) {
            sendMessage(senderId, { text: message }, pageAccessToken);
          }
        } else {
          sendMessage(senderId, { text: lyricsMessage }, pageAccessToken);
        }

        if (result.image) {
          sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: {
                url: result.image,
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

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
