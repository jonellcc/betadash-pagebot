const axios = require('axios');

module.exports = {
  name: 'shoti',
  description: 'Get a Shoti video',
  author: 'Cliff & John liby',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiKey = 'shipazu';
    const apiUrl = `https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=${apiKey}`;

    try {
      sendMessage(senderId, { text: 'Sending shawty please wait...' }, pageAccessToken);

      const response = await axios.get(apiUrl);
      const shotiUrl = response.data.shotiurl;
const kupal = {
    text: `𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${response.data.username}\n𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${response.data.nickname}\n𝗥𝗲𝗴𝗶𝗼𝗻: ${response.data.region}\nSending video wait a seconds....`,
};

 if (shotiUrl) {
sendMessage(senderId, kupal, pageAccessToken);
  sendMessage(senderId, {
     attachment: {
          type: 'video',
          payload: {
            url: shotiUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Sorry, no Shoti video found.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
