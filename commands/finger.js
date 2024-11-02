const axios = require("axios");
const { sendMessage } = require("../kupal");

module.exports = {
  name: "finger",
  description: "Generate a canvas finger",
  usage: "finger one two",
  author: "Cliff (Api-kenlie syugg)",
  async execute(senderId, args, pageAccessToken) {
const kupal = ["8505900689447357", "8269473539829237", "7913024942132935"];

   if (!kupal.some(kupal_ka => kupal_ka === senderId)) {
    sendMessage(senderId, { text: "This command is only for    pagebot owner." }, pageAccessToken);
  return;
}

    try {
      const input = args.join(" ");
      const [one, two] = input.split(" ");

      if (!one || !two) {
        return sendMessage(senderId, { text: "Invalid Usage: Use finger <uid1> <uid2>" }, pageAccessToken);
      }

      const apiUrl = `https://apiv2.kenliejugarap.com/finger?pic1=https://api-canvass.vercel.app/profile?uid=${one}&pic2=https://api-canvass.vercel.app/profile?uid=${two}`;

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
