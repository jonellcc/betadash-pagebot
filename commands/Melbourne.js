const axios = require('axios');

module.exports = {
  name: 'melbourne',
  description: 'melbourne canvas',
  usage: 'melbourne <userid>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a userid to generate canvas' }, pageAccessToken);
      return;
    }

    const uid = args.join(' ');

    try {    
      const apiUrl = `https://api-canvass.vercel.app/melbourne?userid=${encodeURIComponent(uid)}`;

const nya = await axios.get(apiUrl);
const res = nya.data.imageUrl;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: "This canvas is automatically face detected if the profile photo of user is no face detected can't generate canvas."}, pageAccessToken);
    }
  }
};

