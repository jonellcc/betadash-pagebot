const axios = require("axios");

module.exports = {
  name: "mems",
  description: "Generate a canvas mems",
  usage: "mems one two",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two] = input.split(" | ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use mems <text1> <text2>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/mems?text1=${one}&text2=${two}`;

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
