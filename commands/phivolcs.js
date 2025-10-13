/** const axios = require('axios');

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
}; **/


const axios = require('axios');
let autoSend = false;
let lastEarthquakeId = null;
let interval = null;

module.exports = {
  name: 'philvolcs',
  description: 'Toggle auto earthquake updates from PHILVOLCS Official.',
  usage: 'phivolcs on | off',
  category: 'tools',
  author: 'Kyu',
  async execute(senderId, sendMessage, args, pageAccessToken) {
    const option = (args[0] || '').toLowerCase();
    if (!option || !['on', 'off'].includes(option)) {
      return sendMessage(senderId, {
        text: '⚙️ 𝗨𝘀𝗮𝗴𝗲: 𝗽𝗵𝗶𝗹𝘃𝗼𝗹𝗰𝘀 𝗼𝗻 | 𝗽𝗵𝗶𝗹𝘃𝗼𝗹𝗰𝘀 𝗼𝗳𝗳\n\n🌋 "on" → auto send every new earthquake detected.\n🌋 "off" → stop updates.'
      }, pageAccessToken);
    }
    if (option === 'on') {
      if (autoSend) {
        return sendMessage(senderId, { text: '🌋 𝗘𝗮𝗿𝘁𝗵𝗾𝘂𝗮𝗸𝗲 𝗮𝘂𝘁𝗼-𝘂𝗽𝗱𝗮𝘁𝗲 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗼𝗻.' }, pageAccessToken);
      }
      autoSend = true;
      sendMessage(senderId, { text: '✅ 𝗘𝗮𝗿𝘁𝗵𝗾𝘂𝗮𝗸𝗲 𝗮𝘂𝘁𝗼-𝘂𝗽𝗱𝗮𝘁𝗲 𝗮𝗰𝘁𝗶𝘃𝗮𝘁𝗲𝗱.\n📡 I’ll send new PHIVOLCS alerts automatically.' }, pageAccessToken);
      interval = setInterval(async () => {
        if (!autoSend) return;
        try {
          const { data } = await axios.get('https://betadash-api-swordslush-production.up.railway.app/phivolcs?info=latest');
          if (!data || !data.info || data.info.length === 0) return;
          const info = data.info[0].details;
          const currentId = info.timestamp;
          if (currentId !== lastEarthquakeId) {
            lastEarthquakeId = currentId;
            const message =
`🌋 𝗣𝗵𝗶𝗹𝗩𝗢𝗟𝗖𝗦 𝗨𝗣𝗗𝗔𝗧𝗘𝗗
━━━━━━━━━━━━━
📅 ${info.dateTime}
📍 ${info.location}
💥 Magnitude: ${info.magnitude}
🌎 Origin: ${info.origin}
━━━━━━━━━━━━━
🕓 Updated: ${new Date(info.timestamp).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`;
            await sendMessage(senderId, { text: message }, pageAccessToken);
            if (info.mapImageUrl) {
              await sendMessage(senderId, {
                attachment: {
                  type: 'image',
                  payload: { url: info.mapImageUrl }
                }
              }, pageAccessToken);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, 60 * 1000);
    } else if (option === 'off') {
      autoSend = false;
      lastEarthquakeId = null;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      return sendMessage(senderId, {
        text: '🛑 𝗘𝗮𝗿𝘁𝗵𝗾𝘂𝗮𝗸𝗲 𝗮𝘂𝘁𝗼-𝘂𝗽𝗱𝗮𝘁𝗲 𝘁𝘂𝗿𝗻𝗲𝗱 𝗼𝗳𝗳.'
      }, pageAccessToken);
    }
  }
};

