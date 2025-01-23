const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'blackbox',
  description: 'Ask a question to blackbox convertational',
  author: 'Aughost (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a question first!' }, pageAccessToken);
      return;
    }

    const symbols = ["⎔", "☰", "⿻"];
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const symbol = symbols[randomIndex];

    try {
      sendMessage(senderId, { text: '🔍 Searching, Please Wait....' }, pageAccessToken);

      const apiUrl = `https://yt-video-production.up.railway.app/blackbox?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.Response;


      const formattedResponse = `${symbol} | 𝗕𝗟𝗔𝗖𝗞𝗕𝗢𝗫 𝗔𝗜\n━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━`;

      const maxMessageLength = 2000;
      if (formattedResponse.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(formattedResponse, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
     await  sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
