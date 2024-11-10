const axios = require('axios');

module.exports = {
  name: 'bot',
  description: 'Ask a question to yor Ai',
  author: 'kalix (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first to talk yor ai' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://api.y2pheq.me/openchat?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
const kupal = `シ | 𝙾𝙿𝙴𝙽𝙲𝙷𝙰𝚃\n━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━\n𝚄𝚂𝙴 "𝙲𝙻𝙴𝙰𝚁" 𝚃𝙾 𝚁𝙴𝚂𝙴𝚃 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽.`;
          sendMessage(senderId, { text: kupal}, pageAccessToken);
        }
      } else {
const kupal2 = `シ | 𝙾𝙿𝙴𝙽𝙲𝙷𝙰𝚃\n━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━\n𝚄𝚂𝙴 "𝙲𝙻𝙴𝙰𝚁" 𝚃𝙾 𝚁𝙴𝚂𝙴𝚃 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽.`;
        sendMessage(senderId, { text: kupal2 }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'An error while fetching api status: kupal' }, pageAccessToken);
    }
  }
};

