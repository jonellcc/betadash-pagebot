const axios = require("axios");

module.exports = {
  name: "blowjob",
  description: "Generate a canvas fuck",
  usage: "blowjob one two",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [one, two] = input.split(" ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use blowjob <uid1> <uid2>" }, pageAccessToken);
      }

      const apiUrl = `https://apiv2.kenliejugarap.com/blowjob?pic1=https://api-canvass.vercel.app/profile?uid=${one}&pic2=https://api-canvass.vercel.app/profile?uid=${two}`;

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
