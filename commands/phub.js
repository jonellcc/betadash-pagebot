const axios = require("axios");

module.exports = {
  name: "phub",
  description: "Generate a canvas pornhub comment",
  usage: "phub one two",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two, three] = input.split(" ");

      if (!one || !two || !three) {
        return sendMessage(senderId, { text: "Invalid Usage: Use phub <text> <name> <uid>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/phub?text=${one}&name=${two}&id=${three}`;

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
