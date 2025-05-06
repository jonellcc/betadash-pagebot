const axios = require("axios");
const config = require("../config.json");

async function getPageIdFromToken(pageAccessToken) {
  try {
    const response = await axios.get(`https://graph.facebook.com/me?fields=id&access_token=${pageAccessToken}`);
    return response.data.id;
  } catch (error) {
    return null;
  }
}

module.exports = {
  name: 'callad',
  description: 'Send feedback or issues to the admin',
  usage: 'callad <message>',
  author: 'cliff',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(
        senderId,
        { text: '❗ Please provide a message to report to the admin.' },
        pageAccessToken
      );
      return;
    }

    const message = args.join(" ");
    const pageid = await getPageIdFromToken(pageAccessToken);
    if (!pageid) {
      await sendMessage(senderId, { text: "❗ Unable to retrieve page ID." }, pageAccessToken);
      return;
    }

    let adminId = null;

    if (
      config.main.PAGE_ACCESS_TOKEN === pageAccessToken &&
      config.main.PAGEID === pageid
    ) {
      adminId = config.main.ADMINS[0]; 
    } else {
      const session = config.sessions.find(
        (s) => s.PAGE_ACCESS_TOKEN === pageAccessToken && s.pageid === pageid
      );
      if (session) {
        adminId = session.adminid;
      }
    }

    if (!adminId) {
      await sendMessage(senderId, { text: "❗ No admin found for this page." }, pageAccessToken);
      return;
    }

    await sendMessage(
      adminId,
      {
        text: `📥 𝗡𝗲𝘄 𝗙𝗲𝗲𝗱𝗯𝗮𝗰𝗸 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱:\n\n👤 𝗙𝗿𝗼𝗺 𝗦𝗲𝗻𝗱𝗲𝗿 𝗜𝗗: ${senderId}\n\n📑 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${message}`
      },
      pageAccessToken
    );

    await sendMessage(
      senderId,
      { text: '✅ Thank you for your feedback! Your message has been sent to the admin.' },
      pageAccessToken
    );
  }
};
