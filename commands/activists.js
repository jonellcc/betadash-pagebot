const axios = require("axios");

module.exports = {
  name: "activists",
  description: "Generate a canvas activists",
  usage: "activists <userid> | <text>",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [userid, text] = input.split(" | ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use activists <text1> | <text2>" }, pageAccessToken);
      }

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/activists?userid=${userid}&text=${text}`;

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
