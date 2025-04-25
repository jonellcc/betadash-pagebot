const axios = require('axios');

const name = "mistake";

module.exports = {
  name: name,
  description: `${name} canvas`,
  usage: `${name} <userid or image url>`,
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a userid or image URL to generate canvas' }, pageAccessToken);
      return;
    }

    const input = args.join(' ');
    let apiUrl = '';

    if (input.startsWith('https') && (input.endsWith('.webp') || input.endsWith('.png') || input.endsWith('.jpeg') || input.endsWith('.jpg'))) {
      apiUrl = `https://betadash-api-swordslush-production.up.railway.app/one_mistake?image=${encodeURIComponent(input)}`;
    } else {
      apiUrl = `https://betadash-api-swordslush-production.up.railway.app/one_mistake?userid=${input}`;
    }

    try {
      const nya = await axios.get(apiUrl);      

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: nya } } }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
