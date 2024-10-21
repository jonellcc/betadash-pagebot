const axios = require('axios');

module.exports = {
  name: 'flux',
  description: 'Generate image  from fluxpro dev',
  usage: 'flux <prompt>',
  author: 'Cliff Vincent',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://www.samirxpikachu.run.place/ArcticFL?prompt=${encodeURIComponent(prompt)}--styles+3`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};