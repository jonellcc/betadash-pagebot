const axios = require("axios");

module.exports = {
  name: "fbcover",
  description: "Generate a Facebook cover photo",
  usage: "fbcover <uid> <name> <firstname> <number> <email> <address>",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [uid, name, firstname, number, email, address] = input.split(" ");

      if (!uid || !name || !firstname || !number || !email || !address) {
        return sendMessage(senderId, { text: "Invalid Usage: Use fbcover <uid> <name> <firstname> <number> <email> <address>." }, pageAccessToken);
      }

      const apiUrl = `https://apiv2.kenliejugarap.com/fbcover?avatar=https://api-canvass.vercel.app/profile?uid=${uid}&fullname=${encodeURIComponent(name)}&firstname=${encodeURIComponent(firstname)}&phone=${encodeURIComponent(number)}&email=${encodeURIComponent(email)}&location=${encodeURIComponent(address)}`;

      await sendMessage(senderId, { text: "Generating your FB cover canvas..." }, pageAccessToken);

      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: apiUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: "Error can`t generate canvas" }, pageAccessToken);
    }
  }
};
