const axios = require('axios');

module.exports = {
  name: 'gpt3',
  description: 'Ask a question to GPT-3',
  author: 'Cliff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      sendMessage(senderId, { text: '🔍 Searching Please Wait....' }, pageAccessToken);
      const apiUrl = `https://betadash-api-swordslush.vercel.app/gpt-3?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.message;

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
