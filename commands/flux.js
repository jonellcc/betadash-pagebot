const axios = require("axios");

module.exports = {
  name: 'flux',
  description: 'Generate images via prompt',
  usage: 'flux <prompt>',
  author: 'Cliff', 
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
       sendMessage(senderId, { text: "֎ | Generating Please Wait...."}, pageAccessToken);
      const apiUrl = `https://betadash-api-swordslush.vercel.app/flux?prompt=${encodeURIComponent(prompt)}`;

const response = await axios.get(apiUrl);
const yep = response.data.imageUrl;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: yep } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};