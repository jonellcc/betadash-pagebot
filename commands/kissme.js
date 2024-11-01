const axios = require("axios");

module.exports = {
  name: "kissme",
  description: "Generate a canvas kiss each other",
  usage: "kissme one two",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two] = input.split(" ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use kissme <uid1> <uid2>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/kiss2?one=${one}&two=${two}`;

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
