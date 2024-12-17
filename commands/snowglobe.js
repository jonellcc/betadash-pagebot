const axios = require('axios');

module.exports = {
  name: 'snowglobe',
  description: 'Generate canvas Christmas ',
  usage: ' Christmas <name>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a name to generate canvas' }, pageAccessToken);
      return;
    }

    const name = args.join(' ');

    try {
      const apiUrl = `https://api-canvass.vercel.app/christmas?name=${encodeURIComponent(name)}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};