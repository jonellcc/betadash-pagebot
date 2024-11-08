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
        const lyricsMessage = `𝗧𝗶𝘁𝗹𝗲: ${title}
𝗔𝗿𝘁𝗶𝘀𝘁: ${artist}

𖢨°•°•——[ 𝗟𝗬𝗥𝗜𝗖𝗦 ]——•°•°𖢨
${lyrics}
𖢨°•°•——[ 𝗟𝗬𝗥𝗜𝗖𝗦 ]——•°•°𖢨`;

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
      sendMessage(senderId, { text: `Sorry, no lyrics were found for your query. ${query}` }, pageAccessToken);
    }
  }
};
