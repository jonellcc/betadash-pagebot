const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: 'fluxwebui',
  description: 'Generate images via prompt',
  usage: 'fluxwebui <prompt>',
  author: 'Cliff Vincent',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://betadash-api-swordslush.vercel.app/fluxwebui?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, '../backups', `${Date.now()}.png`);

      fs.writeFileSync(imagePath, response.data);
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: imagePath } } }, pageAccessToken);

      setTimeout(() => {
        fs.unlinkSync(imagePath);
      }, 60000);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
