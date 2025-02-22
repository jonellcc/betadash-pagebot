const axios = require('axios');

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'test',
  description: 'API tester',
  author: 'DEVELOPER',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const u = args.join(" ");

    if (!u || !/^https?:\/\//.test(u)) {
      sendMessage(senderId, { text: 'Please provide a valid API URL with an endpoint.' }, pageAccessToken);
      return;
    }

    try {
      const response = await axios.get(u, { headers: { Accept: "application/json" } });

      if (typeof response.data !== "object") {
        sendMessage(senderId, { text: "Invalid JSON response" }, pageAccessToken);
        return;
      }

      const jsonResponse = JSON.stringify(response.data, null, 2);
      const messageChunks = splitMessageIntoChunks(jsonResponse, 2000);

      for (const chunk of messageChunks) {
        sendMessage(senderId, { text: "𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲:\n" + chunk }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: "Error: " + error.message }, pageAccessToken);
    }
  }
};
