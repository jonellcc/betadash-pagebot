const axios = require('axios');

module.exports = {
  name: 'tinyurl',
  description: 'tinyurl url shortener',
  usage: 'tinyurl <link>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a link' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(prompt)}`;
const fuck = await axios.get(apiUrl);
const dh = fuck.data.url;

      await sendMessage(senderId, { text: url }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};