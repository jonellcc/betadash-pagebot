const axios = require('axios');

module.exports = {
  name: 'poli',
  description: 'Generate image from Pollination',
  usage: 'poli <prompt>',
  author: 'Cliff Vincent',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const image = response.data.response;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
