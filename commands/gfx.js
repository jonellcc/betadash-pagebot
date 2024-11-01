const axios = require('axios');

module.exports = {
  name: 'gfx',
  description: 'Generate canvas gfx',
  usage: 'gfx <text>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a text' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');

    try {
      const apiUrl = `https://apiv2.kenliejugarap.com/gfx?text=${text}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};