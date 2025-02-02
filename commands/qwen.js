const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}


module.exports = {
  name: 'qwen',
  description: 'Ask a question to Qwen AI',
  author: 'yazky (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a question first.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://yt-video-production.up.railway.app/qwen?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          const formattedMessage = `֎ | 𝗤𝘄𝗲𝗻𝟮.𝟱-𝟳𝟮𝗕\n━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━`;
          sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
        }
      } else {
        const formattedMessages = `֎ | 𝗤𝘄𝗲𝗻𝟮.𝟱-𝟳𝟮𝗕\n━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━`;
        sendMessage(senderId, { text: formattedMessages }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};

const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}


module.exports = {
  name: 'qwen',
  description: 'Ask a question to Qwen AI',
  author: 'yazky (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a question first.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://yt-video-production.up.railway.app/qwen?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          const formattedMessage = `֎ | 𝗤𝘄𝗲𝗻𝟮.𝟱-𝟳𝟮𝗕\n━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━`;
          sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
        }
      } else {
        const formattedMessages = `֎ | 𝗤𝘄𝗲𝗻𝟮.𝟱-𝟳𝟮𝗕\n━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━`;
        sendMessage(senderId, { text: formattedMessages }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};

