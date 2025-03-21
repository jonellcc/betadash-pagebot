const axios = require("axios");

module.exports = {
  name: "retro-wave",
  description: "Generate a retro wave styled image",
  usage: "retro-wave <text1> | <text2> | <text3> | <background> | <style>",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const input = args.join(" ");
      const [text1, text2, text3, background, style] = input.split(" | ");

      if (!text1 || !text2 || !text3 || !background || !style) {
        return sendMessage(senderId, {
          text: "Invalid Usage: Use retro-wave <text1> | <text2> | <text3> | <background> | <style>\n- background: 1 to 5\n- style: 1 to 4"
        }, pageAccessToken);
      }

      const bg = parseInt(background);
      const st = parseInt(style);
      if (isNaN(bg) || isNaN(st) || bg < 1 || bg > 5 || st < 1 || st > 4) {
        return sendMessage(senderId, {
          text: "Invalid background or style value. Background should be 1-5, Style should be 1-4."
        }, pageAccessToken);
      }

      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/retro-wave?text1=${text1}&text2=${text2}&text3=${text3}&background=${bg}&style=${st}`;

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
      await sendMessage(senderId, { text: `Error: ${JSON.stringify(error, null, 2)}` }, pageAccessToken);
    }
  }
};
