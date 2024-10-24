const axios = require('axios');

module.exports = {
  name: 'jessica',
  description: 'Jessica canvas',
  usage: 'jrssica <text>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a text' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://api-canvass.vercel.app/jessica?text=${encodeURIComponent(prompt)}`;
const fuck = await axios.get(apiUrl);
const dh = fuck.data.response;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};