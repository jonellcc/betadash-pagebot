const axios = require('axios');

module.exports = {
  name: 'emojimix',  
  description: 'mixes two emojis into one image.',  
  usage: 'emojimix <emoji1> <emoji2>',  
  author: 'cliff',  

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length < 2) {
      await sendMessage(senderId, {
        text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘁𝘄𝗼 𝗲𝗺𝗼𝗷𝗶𝘀 𝘁𝗼 𝗺𝗶𝘅,\n\n 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗲𝗺𝗼𝗷𝗶𝗺𝗶𝘅 😭 🤣'
      }, pageAccessToken);
      return;  
    }

    const [emoji1, emoji2] = args;
    const apiUrl = `https://betadash-uploader.vercel.app/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;

    try {
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  
          }
        }
      }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, {
        text: 'Oops! Something went wrong while generating the emoji mix.'
      }, pageAccessToken);
    }
  }
};
