const axios = require("axios");
const config = require("../config.json");

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

async function getdata(pageAccessToken) {
  const response = await axios.get(`https://graph.facebook.com/me?access_token=${pageAccessToken}`);
  return { pageid: response.data.id };
}

module.exports = {
  name: "bio",
  description: "Change Facebook Page bio",
  author: "Cliff",
  usage: "bio <message>",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const { pageid } = await getdata(pageAccessToken);

    if (!isAuthorized(senderId, pageAccessToken, pageid)) {
      await sendMessage(senderId, { text: "This command is only for pagebot admin." }, pageAccessToken);
      return;
    }

    const newBio = args.join(" ");
    if (!newBio) {
      await sendMessage(senderId, { text: "Please provide a bio message." }, pageAccessToken);
      return;
    }

    try {
      await axios.post(`https://graph.facebook.com/${pageid}`, null, {
        params: {
          about: newBio,
          access_token: pageAccessToken
        }
      });

      await sendMessage(senderId, { text: `✅ Bio updated successfully:\n${newBio}` }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, { text: `❌ Failed to update bio.\n${error.response?.data?.error?.message || error.message}` }, pageAccessToken);
    }
  }
};
