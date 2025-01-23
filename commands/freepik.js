const axios = require("axios");

module.exports = {
  name: 'freepik',
  description: 'Generate images from freepik',
  usage: 'freepik <prompt>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt to generate an image' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      await sendMessage(senderId, { text: "֎ | Generating Please Wait...."}, pageAccessToken);
      const apiUrl = `https://betadash-api-swordslush.vercel.app/freepik?search=${encodeURIComponent(prompt)}`;

      const response = await axios.get(apiUrl);
      const images = response.data.images;

      if (images.length > 0) {
        const selectedImages = images.slice(0, 5);

        for (const img of selectedImages) {
          await sendMessage(senderId, { attachment: { type: 'image', payload: { url: img } } }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: 'No images found.' }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
