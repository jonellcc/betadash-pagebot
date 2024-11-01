const axios = require('axios');

module.exports = {
  name: 'aesthetic',
  description: 'Generate canvas aesthetic',
  usage: 'aesthetic <text>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a text' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');

    try {
      const apiUrl = `https://apiv2.kenliejugarap.com/aesthetic?text=${text}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
