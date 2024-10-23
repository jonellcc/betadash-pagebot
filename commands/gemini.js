const axios = require("axios");

module.exports = {
  name: "gemini",
  description: "Interact with API for text and image recognition",
  usage: "<gemini> <question> || <gemini> <question> <reply_attachment>",
  async execute(senderId, args, event, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks, admin, getAttachments) {
    const prompt = args.join(" ");
    if (!prompt) {
      return sendMessage(senderId, { text: `Please enter your question!` }, pageAccessToken);
    }

    sendMessage(senderId, { text: "Please wait... 🔎" }, pageAccessToken);

    try {
      const attachments = await getAttachments(event.message.reply_to.mid);
      let url = attachments ? attachments[0].image_data.url : "";

      let apiEndpoint = url
        ? `https://ccprojectapis.ddns.net/api/gemini`
        : `https://ccprojectapis.ddns.net/api/gen`;

      let params = url
        ? { ask: encodeURIComponent(prompt), imgurl: url }
        : { ask: encodeURIComponent(prompt) };

      const gem = await axios.get(apiEndpoint, { params });

      sendMessage(senderId, { text: `💭 | ${gem.data.vision || gem.data.result}` }, pageAccessToken);
    } catch (err) {
      sendMessage(senderId, { text: err.message || err }, pageAccessToken);
    }

    return true;
  }
};
