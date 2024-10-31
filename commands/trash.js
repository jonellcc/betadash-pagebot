const axios = require('axios');

module.exports = {
  name: 'trash',
  description: 'Generate canvas Trash profile Facebook ',
  usage: 'trash <userid>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a userid to generate canvas' }, pageAccessToken);
      return;
    }

    const uid = args.join(' ');

    try {
      const apiUrl = `https://api-canvass.vercel.app/trash?userid=${encodeURIComponent(uid)}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
