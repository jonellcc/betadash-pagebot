const { sendMessage } = require("../kupal");

module.exports = {
  name: "id",
  description: "Check your user ID while on a page bot",
  async execute(senderId, event, pageAccessToken) {
    if (!senderId || !sendMessage || !pageAccessToken) {
      return;
    }

    const uid = `Your ID: ${senderId}`;
    sendMessage(senderId, { text: uid }, pageAccessToken);

    return;
  }
};
