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
     await sendMessage(senderId, { text: 'Please provide a valid API URL with an endpoint.' }, pageAccessToken);
      return;
    }

    try {
      const response = await axios.get(u, { headers: { Accept: "application/json" } });

      if (typeof response.data !== "object") {
        await sendMessage(senderId, { text: "Invalid JSON response" }, pageAccessToken);
        return;
      }

      const jh = JSON.stringify(response.data, null, 2);

     const sheshh = `𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲:\n\n${jh}`;
      
   const maxMessageLength = 2000;
      if (sheshh.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(sheshh, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
     await sendMessage(senderId, { text: sheshh }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: "Error: " + error.message }, pageAccessToken);
    }
  }
};
     
