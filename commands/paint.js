const axios = require('axios');

module.exports = {
  name: 'paint',
  description: 'Generate canvas paint',
  usage: 'brush <userid>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a userid to generate canvas' }, pageAccessToken);
      return;
    }

    const uid = args.join(' ');

    try {
      const apiUrl = `https://apiv2.kenliejugarap.com/brush?url=https://api-canvass.vercel.app/profile?uid=${uid}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};