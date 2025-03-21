const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'voila',
  description: 'Ask AI to get accurate, instant answers.',
  author: 'Cliff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
if (!prompt) {
         await sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
await sendMessage(senderId, { text: '🔍 Searching Please Wait....' }, pageAccessToken);
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/voila?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
       await sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
