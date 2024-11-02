const axios = require('axios');
const { sendMessage } = require("../kupal");


module.exports = {
  name: 'shy',
  description: 'Generate canvas shy girl',
  usage: 'shy <userid>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken) {
const kupal = ["8505900689447357", "8269473539829237", "7913024942132935"];

   if (!kupal.some(kupal_ka => kupal_ka === senderId)) {
    sendMessage(senderId, { text: "This command is only for    pagebot owner." }, pageAccessToken);
  return;
}
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a userid to generate canvas' }, pageAccessToken);
      return;
    }

    const uid = args.join(' ');

    try {
      const apiUrl = `https://apiv2.kenliejugarap.com/shy?url=https://api-canvass.vercel.app/profile?uid=${uid}`;

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