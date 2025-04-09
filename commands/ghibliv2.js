const axios = require('axios');

module.exports = {
  name: 'ghibliv2',
  description: 'ghibli image generator',
  usage: 'ghibliv2 <prompt>',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/ghibliv2?prompt=${encodeURIComponent(prompt)}`;
      const lhd = apiUrl.data.imageUrl;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: lhd } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
