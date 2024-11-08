const axios = require('axios');

module.exports = {
  name: 'cohere',
  description: 'Ask a question to Cohere Ai',
  author: 'kiff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://www.vertearth.cloud/api/cohere?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response.message;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
const kupal = `֎ | COHERE\n━━━━━━━━━━━\n${message}\n━━━━━━━━━━━`;
          sendMessage(senderId, { text: kupal }, pageAccessToken);
        }
      } else {
const kupal2 = `֎ | COHERE\n━━━━━━━━━━━\n${text}\n━━━━━━━━━━━`;
        sendMessage(senderId, { text: kupal2 }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'An error while fetching api status: kupal' }, pageAccessToken);
    }
  }
};

