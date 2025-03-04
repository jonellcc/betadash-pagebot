const axios = require('axios');

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
      const apiUrl = `https://fluxwebui.com/generate/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=43&model=flux&nologo=true&nofeed=true`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
