const axios = require("axios");

module.exports = {
  name: "foggy-window",
  description: "Generate a canvas foggy window",
  usage: "foggy-window <text> | <background>",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [text, background] = input.split(" | ");

      if (!text || ! background) {
        return sendMessage(senderId, { text: "Invalid Usage: Use foggy-window <text> | <background>" }, pageAccessToken);
      }

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/denim?text=${text}&background=${background}`;

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
