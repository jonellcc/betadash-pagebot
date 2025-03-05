const axios = require('axios');

const model = {
  1: "tulu3",
  2: "OLMo",
  3: "Llama3",
  4: "olmoe",
  5: "tulu"
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  name: 'allenai',
  description: 'Ask a question to Allen AI',
  author: 'Cliff (REST API)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length === 0) {
      sendMessage(senderId, { text: '𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚖𝚘𝚍𝚎𝚕 𝚊𝚗𝚍 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.' }, pageAccessToken);
      return;
    }

    const modelNumber = parseInt(args[0]);
    if (isNaN(modelNumber) || !model[modelNumber]) {
      sendMessage(senderId, { text: '𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚖𝚘𝚍𝚎𝚕 𝚘𝚗𝚕𝚢 𝟷-𝟻' }, pageAccessToken);
      return;
    }

    const prompt = args.slice(1).join(' ');
    if (!prompt) {
      sendMessage(senderId, { 
        text: `𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚏𝚒𝚛𝚜𝚝\n\n𝙼𝚘𝚍𝚎𝚕𝚜:\n1. ${model[1]}\n2. ${model[2]}\n3. ${model[3]}\n4. ${model[4]}\n5. ${model[5]}\n\nExample usage: allenai 1 hi`
      }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/allenai?ask=${encodeURIComponent(prompt)}&model=${model[modelNumber]}`;
      const response = await axios.get(apiUrl);
      const text = response.data.response;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: JSON.stringify(error, null, 2) }, pageAccessToken);
    }
  }
};
