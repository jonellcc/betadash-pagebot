const axios = require('axios');

module.exports = {
  name: 'flux',
  description: 'Generate images via prompt',
  usage: 'flux <prompt>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://www.samirxpikachu.run.place/ArcticFL?prompt=${encodeURIComponent(prompt)}--styles+3`;

    const fetchImage = () => {
      return axios.get(apiUrl)
        .then(response => response.data)
        .catch(() => null); 
    };

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: Image generation took too long.')), 30000)
    );

    try {
      const imageResponse = await Promise.race([fetchImage(), timeout]);

      if (imageResponse) {
        await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
