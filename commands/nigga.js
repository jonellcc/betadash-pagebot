const axios = require('axios');

module.exports = {
  name: 'nigga',
  description: 'Generate canvas rides in the tiger',
  usage: '<nigga>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const apiUrl = `https://api-canvass.vercel.app/tiger?userid=${senderId}`;

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
