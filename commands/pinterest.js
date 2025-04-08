const axios = require('axios');

module.exports = {
  name: 'pinterest',
  description: 'Fetch images from Pinterest',
  author: 'coffee',
  usage: 'pinterest <search term> | <number of images (1-5)>',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length < 1) {
      return await sendMessage(senderId, { text: '📷 | Please use this format:\npinterest search_name | 1-5' }, pageAccessToken);
    }

    const input = args.join(" ");
    const [searchTerm, numImagesRaw] = input.split(" | ");
    let numImages = parseInt(numImagesRaw) || 1;

    numImages = Math.abs(numImages);

    if (numImages > 5) {
      return await sendMessage(senderId, { text: 'The number of images cannot exceed 5. Only 5 number limit will be generated to image.' }, pageAccessToken);
    }

    numImages = Math.min(numImages, 5);
    numImages = Math.max(numImages, 1);

    const apiUrl = `https://betadash-uploader.vercel.app/pinterest?search=${encodeURIComponent(searchTerm)}&count=${numImages}`;

    try {
      const res = await axios.get(apiUrl);
      const images = res.data.data?.slice(0, numImages);

      if (images && images.length > 0) {
        for (const imageUrl of images) {
          await sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: 'No images found for your search.' }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: error.message || 'An error occurred while fetching images.' }, pageAccessToken);
    }
  },
};
