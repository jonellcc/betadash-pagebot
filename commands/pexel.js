const axios = require('axios');

module.exports = {
  name: 'pexel',
  description: 'Generate images via prompt',
  usage: 'pixel <prompt>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/image?search=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.images && response.data.images.length > 0) {
        const randomImage = response.data.images[Math.floor(Math.random() * response.data.images.length)];

        await sendMessage(senderId, { 
          attachment: { 
            type: 'image', 
            payload: { url: randomImage } 
          } 
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'No images found for the given prompt.' }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
