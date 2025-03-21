const axios = require("axios");

module.exports = {
  name: "denim",
  description: "Generate a canvas denim",
  usage: "denim <text> | <color>",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [text, color] = input.split(" | ");

      if (!text || !color) {
        return sendMessage(senderId, { text: "Invalid Usage: Use denim <text> | <color>" }, pageAccessToken);
      }

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/denim?text=${text}&color=${color}`;

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
