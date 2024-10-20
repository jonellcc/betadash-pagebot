const axios = require('axios');

module.exports = {
  name: 'punch',
  description: 'Generate canvas boxing',
  usage: '<punch>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid) {
    try {
      const apiUrl = `https://api-canvass.vercel.app/pacquiao?one=${senderId}&two=${pageid}`;

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
