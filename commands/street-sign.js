const axios = require('axios');

module.exports = {
  name: 'street-sign',
  description: 'street-sign canvas',
  usage: 'street-sign <text>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a text' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/street-sign?text=${encodeURIComponent(prompt)}`;
const fuck = await axios.get(apiUrl);
const dh = fuck.data.response;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
