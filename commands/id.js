module.exports = {
  name: "id",
  description: "Check your user ID while on a page bot",
  async execute(senderId, event, sendMessage, pageAccessToken) {
const uid = `Your ID: ${senderId}`;
    sendMessage(senderId, { text: uid}, pageAccessToken);
   return;
  }
}