const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'brave',
  description: 'brave search web',
  author: 'Cliff(rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join('+');
    if (!prompt) {
      await sendMessage(senderId, { text: '𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚏𝚒𝚛𝚜𝚝' }, pageAccessToken);
      return;
    }

    try {
await sendMessage(senderId, { text: '🦁 | 𝙱𝚛𝚊𝚟𝚎 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...' }, pageAccessToken);

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/brave?search=${prompt}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
const dk = `[𝗕𝗥𝗔𝗩𝗘] 𝖠𝖨/𝖲𝖤𝖠𝖱𝖢𝖧\n━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━`;
          await sendMessage(senderId, { text: dk }, pageAccessToken);
        }
      } else {
const k = `[𝗕𝗥𝗔𝗩𝗘] 𝖠𝖨/𝖲𝖤𝖠𝖱𝖢𝖧\n━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━`;
        await sendMessage(senderId, { text: k }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};

