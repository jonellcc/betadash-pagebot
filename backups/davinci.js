const axios = require('axios');

module.exports = {
  name: 'davinci',
  description: 'Ask a question to davinci Ai',
  author: 'kiff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/davinci?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.message;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
const kupal = `֎ | 𝗗𝗔𝗩𝗜𝗡𝗖𝗜\n━━━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━━━`;
          sendMessage(senderId, { text: kupal}, pageAccessToken);
        }
      } else {
const kupal2 = `֎ | 𝗗𝗔𝗩𝗜𝗡𝗖𝗜\n━━━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━━━`;
        sendMessage(senderId, { text: kupal2 }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'An error while fetching api status: kupal' }, pageAccessToken);
    }
  }
};

