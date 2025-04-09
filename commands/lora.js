const axios = require('axios');

module.exports = {
  name: 'lora',
  description: 'ghibli image generator',
  usage: 'lora <prompt>',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/ghibliv2?prompt=${encodeURIComponent(prompt)}`;
      const jdh = await axios.get(apiUrl);
      const imageUrl = jdh.data.imageUrl;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
