const axios = require('axios');

module.exports = {
  name: 'yaz',
  description: 'Ask a question to GPT-4-TURBO',
  author: 'Cliff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      sendMessage(senderId, { text: '🔍 Searching Please Wait....' }, pageAccessToken);
      const apiUrl = `https://betadash-api-swordslush.vercel.app/gpt-4-turbo-2024-04-09?ask=${encodeURIComponent(prompt)}`;
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

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
