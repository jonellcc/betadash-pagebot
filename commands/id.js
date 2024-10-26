module.exports = {
  name: "id",
  description: "Check your user ID while on a page bot",
  async execute(senderId, event, sendMessage, pageAccessToken) {
    if (!senderId || !sendMessage || !pageAccessToken) {
      return;
    }

    const uid = `Your ID: ${senderId}`;
    try {
      sendMessage(senderId, { text: uid }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, {text: error}, pageAccessToken);
    }
    return;
  }
};
