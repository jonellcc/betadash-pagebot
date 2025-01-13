const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'lyrics',
  description: 'Search song lyrics',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');

    if (!query) {
      sendMessage(senderId, { text: 'Please provide the song title to get the lyrics.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/lyrics-finder?title=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const { response: lyrics, Title, artist, Thumbnail } = response.data;

      if (lyrics) {
        const lyricsMessage = `𝗧𝗶𝘁𝗹𝗲: ${Title}\n\n${lyrics}`;
        const maxMessageLength = 2000;

        if (lyricsMessage.length > maxMessageLength) {
          const messages = splitMessageIntoChunks(lyricsMessage, maxMessageLength);
          for (const message of messages) {
            await sendMessage(senderId, { text: message }, pageAccessToken);
          }
        } else {
          await sendMessage(senderId, { text: lyricsMessage }, pageAccessToken);
        }
      }

      if (Thumbnail) {
        await sendMessage(
          senderId,
          {
            attachment: {
              type: 'image',
              payload: {
                url: Thumbnail,
                is_reusable: true
              }
            }
          },
          pageAccessToken
        );
      }
    } catch (error) {
      sendMessage(senderId, { text: `Sorry, no lyrics were found for your query: "${query}".` }, pageAccessToken);
    }
  }
};
