const axios = require('axios');

module.exports = {
  name: 'board',
  description: 'board cancas',
  usage: '<board><text>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid) {
   if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a text' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');
    try {
      const apiUrl = `https://api-canvass.vercel.app/board?text=${encodeURIComponent(text)}`;

      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'image',
            payload: { url: apiUrl }
          }
        },
        pageAccessToken
      );
    } catch (error) {
      await sendMessage(
        senderId,
        { text: 'Error: Could not generate the image. Please try again later.' },
        pageAccessToken
      );
    }
  }
};
