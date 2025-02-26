
const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'brave',
  description: 'brave search web',
  author: 'Cliff(rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://yt-video-production.up.railway.app/brave?search=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message}, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: text }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};

