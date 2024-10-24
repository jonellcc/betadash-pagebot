const axios = require('axios');

module.exports = {
  name: 'maloi',
  description: 'Ask a question to Maloi Ai',
  author: 'Akhiro (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a question first to talk maloi' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://akhiro-tech.vercel.app/api?model=maloi&q=${encodeURIComponent(prompt)}`;
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
      sendMessage(senderId, { text: 'An error while fetching api status: kupal' }, pageAccessToken);
    }
  }
};


