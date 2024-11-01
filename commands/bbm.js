const axios = require("axios");

module.exports = {
  name: "bbm",
  description: "Generate a canvas bongbong marcos",
  usage: "bbm one two",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two] = input.split(" ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use bbm <text1> <text2>" }, pageAccessToken);
      }

      const apiUrl = `https://api-canvass.vercel.app/bbm?text1=${one}&text2=${two}`;

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
