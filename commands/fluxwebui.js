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
      const apiUrl = `https://betadash-api-swordslush.vercel.app/fluxwebui?prompt=${prompt}`;

      const response = await axios.get(apiUrl, { responseType: "stream" });

      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { 
            url: apiUrl, 
            is_reusable: false 
          } 
        } 
      }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
