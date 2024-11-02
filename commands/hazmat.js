const axios = require('axios');

module.exports = {
  name: 'hazmat',
  description: 'Generate canvas hazmat',
  usage: 'hazmat <userid>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a userid to generate canvas' }, pageAccessToken);
      return;
    }

    const uid = args.join(' ');

    try {
      const apiUrl = `https://apiv2.kenliejugarap.com/hazmat?url=https://api-canvass.vercel.app/profile?uid=${uid}`;

await sendMessage(senderId,
 { 
attachment:
 { 
 type: 'image',
 payload:
     { 
      url: apiUrl,
      is_reusable: true
   }
 } 
}, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};