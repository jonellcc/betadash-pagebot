const axios = require("axios");

module.exports = {
  name: "fuck",
  description: "Generate a canvas fuck",
  usage: "fuck one two",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken, sendMessage) {


    try {
      const input = args.join(" ");
      const [one, two] = input.split(" | ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use fuck <uid1> | <uid2>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/fuck?one=${one}&two=${two}`;

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
