const axios = require("axios");
const pageid = '493920247130641';
const kupal = ["8505900689447357", "8269473539829237", "7913024942132935"];

async function getAllPSIDs(pageAccessToken) {
  try {
    let psids = [];
    let previous = `https://graph.facebook.com/v22.0/${pageid}/conversations?fields=participants&access_token=${pageAccessToken}`;

    while (previous) {
      const response = await axios.get(previous);
      const conversations = response.data.data;

      conversations.forEach(convo => {
        convo.participants.data.forEach(participant => {
          if (participant.id !== pageid && !kupal.includes(participant.id)) {
            psids.push(participant.id);
          }
        });
      });

      previous = response.data.paging.next || null;
    }

    return psids;
  } catch (error) {
    return [];
  }
}

async function sendNotificationToAllUsers(message, pageAccessToken) {
  const users = await getAllPSIDs(pageAccessToken);

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

module.exports = {
  name: 'sendnoti',
  description: 'send notification to all user',
  author: 'Cliff',
  usage: "sendnoti <message>",
  async execute(senderId, args, pageAccessToken, sendMessage) {

    if (!kupal.some(kupal_ka => kupal_ka === senderId)) {
      sendMessage(senderId, { text: "This command is only for pagebot owner." }, pageAccessToken);
      return;
    }

    const message = args.join(' ');
    if (!message) {
      sendMessage(senderId, { text: 'Please provide a text message' }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: 'Sending notifications...' }, pageAccessToken);
      await sendNotificationToAllUsers(`𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 \n━━━━━━━━━━━━━━\n╭💬-𝗠𝗘𝗦𝗦𝗔𝗚𝗘: \n╰┈➤ ${message}\n━━━━━━━━━━━━━━`, pageAccessToken);
      sendMessage(senderId, { text: '📢 Notifications sent successfully.' }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: error.message}, pageAccessToken);
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
