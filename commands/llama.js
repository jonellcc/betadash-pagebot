const axios = require('axios');

module.exports = {
  name: 'llama',
  description: 'Ask a question to Llama 3.1',
  author: 'Cliff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://api.kenliejugarap.com/llama/?question=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};