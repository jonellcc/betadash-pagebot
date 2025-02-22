 const { sendMessage } = require("../kupal"); 

module.exports = {
  name: 'eval',
  description: 'test code',
  usage: '<eval> <code>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, pageid, splitMessageIntoChunks, events, font) {
const kupal = ["8505900689447357", "8269473539829237", "7913024942132935"];

   if (!kupal.some(kupal_ka => kupal_ka === senderId)) {
    sendMessage(senderId, { text: "This command is only for    pagebot owner." }, pageAccessToken);
  return;
}

if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a code you want to test' }, pageAccessToken);
      return;
    }

    try {
    await eval(args.join(" "));
    } catch (error){
      sendMessage(senderId, {text: error.message || error }, pageAccessToken);
    }
  }
}
