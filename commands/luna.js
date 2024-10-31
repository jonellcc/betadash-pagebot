const axios = require('axios');

module.exports = {
  name: 'luna',
  description: 'Generate canvas Luna message ',
  usage: ' luna <text>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a text to generate canvas' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');

    try {
      const apiUrl = `https://api-canvass.vercel.app/luna?text=${encodeURIComponent(text)}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};