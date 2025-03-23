const axios = require("axios");
const config = require("../config.json");

async function getdata(pageAccessToken) {
  const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture.width(720).height(720).as(picture_large)&access_token=${pageAccessToken}`);
  const profileUrl = response.data.picture_large.data.url;
  const name = response.data.name;
  const pageid = response.data.id;
  return { profileUrl, name, pageid };
}

async function getAllPSIDs(pageAccessToken, pageid) {
  try {
    let psids = [];
    let previous = `https://graph.facebook.com/v22.0/${pageid}/conversations?fields=participants&access_token=${pageAccessToken}`;

    const allAdmins = [
      ...config.main.ADMINS,
      ...config.sessions.map((session) => session.adminid),
    ];

    while (previous) {
      const response = await axios.get(previous);
      const conversations = response.data.data;

      conversations.forEach((convo) => {
        convo.participants.data.forEach((participant) => {
          if (participant.id !== pageid && !allAdmins.includes(participant.id)) {
            psids.push(participant.id);
          }
        });
      });

      previous = response.data.paging?.next || null;
    }

    return psids;
  } catch (error) {
    return [];
  }
}

async function sendNotificationToAllUsers(message, pageAccessToken, pageid) {
  const users = await getAllPSIDs(pageAccessToken, pageid);

  for (const psid of users) {
    try {
      await axios.post(`https://graph.facebook.com/v22.0/me/messages?access_token=${pageAccessToken}`, {
        recipient: { id: psid },
        message: { text: message },
      });
    } catch (error) {}
  }
}

module.exports = {
  name: "sendnoti",
  description: "send notification to all users",
  author: "Cliff",
  usage: "sendnoti <message>",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const allAdmins = [
      ...config.main.ADMINS,
      ...config.sessions.map((session) => session.adminid),
    ];

    if (!allAdmins.includes(senderId)) {
      sendMessage(senderId, { text: "This command is only for pagebot owner." }, pageAccessToken);
      return;
    }

    const message = args.join(" ");
    if (!message) {
      sendMessage(senderId, { text: "Please provide a text message" }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: "Sending notifications..." }, pageAccessToken);
      const { pageid } = await getdata(pageAccessToken);
      await sendNotificationToAllUsers(
        `𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 \n━━━━━━━━━━━━━━\n╭💬-𝗠𝗘𝗦𝗦𝗔𝗚𝗘: \n╰┈➤ ${message}\n━━━━━━━━━━━━━━`,
        pageAccessToken,
        pageid
      );
      sendMessage(senderId, { text: "📢 Notifications sent successfully." }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  },
};

