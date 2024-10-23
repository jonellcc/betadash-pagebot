module.exports = {
  name: "id",
  description: "get page user ID",
  author: "cliff",
  usage: "<id>",
  async execute(senderId, args, event, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks, admin, getAttachments) {  
    const userId = event.sender.id;  
    sendMessage(senderId, { text: `YOUR ID: ${userId}` }, pageAccessToken);
  }
};
