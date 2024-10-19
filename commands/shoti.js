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

      if (shotiUrl) {
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
