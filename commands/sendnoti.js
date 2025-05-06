const axios = require("axios");
const config = require("../config.json");

async function getdata(pageAccessToken) {
  const response = await axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${pageAccessToken}`);
  const name = response.data.name;
  const pageid = response.data.id;
  return { name, pageid };
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
    } catch (error) {
    }
  }
}

function isAuthorized(senderId, pageAccessToken, pageid) {
  if (
    config.main.PAGE_ACCESS_TOKEN === pageAccessToken &&
    config.main.ADMINS.includes(senderId) &&
    config.main.PAGEID === pageid
  ) {
    return true;
  }

  const session = config.sessions.find(
    (s) => s.PAGE_ACCESS_TOKEN === pageAccessToken && s.pageid === pageid
  );
  if (session && session.adminid === senderId) {
    return true;
  }

  return false;
}

module.exports = {
  name: "sendnoti",
  description: "send notification to all users",
  author: "Cliff",
  usage: "sendnoti <message>",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const { pageid } = await getdata(pageAccessToken);

    if (!isAuthorized(senderId, pageAccessToken, pageid)) {
      sendMessage(senderId, { text: "You are not authorized to use this command on this page." }, pageAccessToken);
      return;
    }

    const message = args.join(" ");
    if (!message) {
      sendMessage(senderId, { text: "Please provide a text message" }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: "Sending notifications..." }, pageAccessToken);
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
