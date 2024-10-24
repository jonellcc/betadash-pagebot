const axios = require('axios');

module.exports = {
  name: 'qwen',
  description: 'Ask a question to Qwen AI',
  author: 'kiff (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');

    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a question first.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://www.vertearth.cloud/api/Qwen1.572BChat?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          const formattedMessage = `֎ | 𝗤𝘄𝗲𝗻𝟭.𝟱𝟳𝟮𝗕\n━━━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━━━`;
          sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
        }
      } else {
        const formattedMessages = `֎ | 𝗤𝘄𝗲𝗻𝟭.𝟱𝟳𝟮𝗕\n━━━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━━━`;
        sendMessage(senderId, { text: formattedMessages }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'An error occurred while fetching the API: kupal.' }, pageAccessToken);
    }
  }
};
