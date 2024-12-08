const axios = require('axios');

module.exports = {
  name: 'openai',
  description: 'Ask a question to openai ai',
  author: 'Cliff(rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/openai?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
const kupal = `🦆 | 𝗗𝗨𝗖𝗞𝗚𝗢\n━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━`;
          sendMessage(senderId, { text: message}, pageAccessToken);
        }
      } else {
const kupal2 = `🦆 | 𝗗𝗨𝗖𝗞𝗚𝗢\n━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━`;
        sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'An error while fetching api status: kupal' }, pageAccessToken);
    }
  }
};

