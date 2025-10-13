const axios = require('axios');

module.exports = {
  name: 'phivolcs',
  description: 'Send latest earthquake info with image from PHIVOLCS',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const res = await axios.get('https://betadash-api-swordslush-production.up.railway.app/phivolcs?info=latest');
      const data = res.data;

      if (data?.info?.length > 0) {
        const quake = data.info[0].details;

        const text = 
          `🌍 ${data.title}\n\n` +
          `🕒 Date/Time: ${quake.dateTime}\n` +
          `📍 Location: ${quake.location}\n` +
          `📏 Depth: ${quake.depth} km\n` +
          `💥 Magnitude: ${quake.magnitude}\n` +
          `🔁 Origin: ${quake.origin}\n` +
          `🔗 Source: ${quake.sourceUrl}`;

       
        await sendMessage(senderId, { text }, pageAccessToken);

        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: {
              url: quake.mapImageUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: "❌ No recent earthquake data available." }, pageAccessToken);
      }
    } catch (err) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
}; 
