const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'webpilot',
  description: 'Webpilot search engine',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');

    if (!query) {
      await sendMessage(senderId, { text: 'Please provide a text you want to search' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/webpilot?search=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      const resultMessage = `𝗪𝗲𝗯𝗽𝗶𝗹𝗼𝘁\n━━━━━━━━━━━━\n${response.data.response}\n━━━━━ ✕ ━━━━━`;
      const maxMessageLength = 2000;

      if (resultMessage.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(resultMessage, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: resultMessage }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};
