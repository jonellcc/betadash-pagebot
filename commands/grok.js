const axios = require('axios');

module.exports = {
  name: 'grok',
  description: 'Ask a question to Grok API',
  author: 'Cliff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first ' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/grok-2?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const { message } = response.data;

      const maxMessageLength = 2000;
      if (message.length > maxMessageLength) {
        const chunks = splitMessageIntoChunks(message, maxMessageLength);
        chunks.forEach(chunk => {
          sendMessage(senderId, { text: chunk }, pageAccessToken);
        });
      } else {
        sendMessage(senderId, { text: message }, pageAccessToken);
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
