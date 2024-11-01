const axios = require('axios');

module.exports = {
  name: 'kaneki',
  description: 'Generate canvas Kaneki',
  usage: 'kaneki <text>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a text' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');

    try {
      const apiUrl = `https://apiv2.kenliejugarap.com/kaneki?text=${text}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
