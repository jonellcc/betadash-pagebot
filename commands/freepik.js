const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
        const img = [];
        const filePaths = [];

        for (let i = 0; i < selectedImages.length; i++) {
          const imageBuffer = (
            await axios.get(selectedImages[i], { responseType: "arraybuffer" })
          ).data;
          const filePath = path.join(__dirname, 'cache', `image${i}.jpg`);
          fs.writeFileSync(filePath, imageBuffer);
          img.push(fs.createReadStream(filePath));
          filePaths.push(filePath);
        }

        await sendMessage(senderId, { attachment: { type: 'image', payload: { url: img } } }, pageAccessToken);

        filePaths.forEach(filePath => {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
            }
          });
        });
      } else {
        await sendMessage(senderId, { text: 'No images found.' }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
