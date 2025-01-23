const axios = require("axios");

module.exports = {
  name: "hack",
  description: "Generate a canvas hack Facebook",
  usage: "hack one two",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two] = input.split(" | ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use hack <name> | <uid>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/hack?name=${one}&uid=${two}`;

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
