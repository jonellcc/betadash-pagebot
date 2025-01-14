const axios = require('axios');

module.exports = {
  name: 'therapist',
  description: 'Ask a question to lotus therapist Ai',
  author: 'Cliff(rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/therapist?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
const kupal = `🐼 | 𝗣𝗔𝗡𝗗𝗔\n━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━`;
          sendMessage(senderId, { text: message}, pageAccessToken);
        }
      } else {
const kupal2 = `🐼 | 𝗣𝗔𝗡𝗗𝗔\n━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━`;
        sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'An error while fetching api status: kupal' }, pageAccessToken);
    }
  }
};


