const axios = require('axios');

module.exports = {
  name: 'hug',
  description: 'Generate canvas Hug',
  usage: '<hug>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid) {
    try {
      const apiUrl = `https://api-canvass.vercel.app/hug2?one=${senderId}&two=${pageid}`;

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
