const axios = require("axios");

module.exports = {
  name: "fampair",
  description: "Generate a canvas family",
  usage: "fampair one two three",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two, three] = input.split(" ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use fampair <uid1> <uid2> <uid3>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/fampair?mother=${one}& father=${two}&son=${three}`;

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
