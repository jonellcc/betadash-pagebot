const axios = require("axios");

module.exports = {
  name: "hanging-billboard",
  description: "Generate a canvas hanging billboard",
  usage: "hanging-billboard <userid> | <text>",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [userid, text] = input.split(" | ");

      if (!userid || !text) {
        return sendMessage(senderId, { text: "Invalid Usage: Use hanging-billboard <userid> | <text>" }, pageAccessToken);
      }

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/hanging-billboard?userid=${userid}&text=${text}`;

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
