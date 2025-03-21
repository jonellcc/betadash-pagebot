
const axios = require("axios");

module.exports = {
  name: "theatre",
  description: "Generate a canvas theatre",
  usage: "theatre <userid> | <text> | <text2>",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [userid, text, text2] = input.split(" | ");

      if (!userid || !text || !text2) {
        return sendMessage(senderId, { text: "Invalid Usage: Use theatre <userid> | <text> | <text2>" }, pageAccessToken);
      }

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/theatre?userid=${userid}&text=${text}&text2=${text2}`;

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
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
