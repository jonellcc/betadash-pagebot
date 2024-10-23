module.exports = {
  name: 'eval',
  description: 'test code',
  usage: '<eval> <code>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks, admin) {
const OWNER_ID = ["8786755161388846", "8376765705775283", "8552967284765085"];

    if (!OWNER_ID.includes(senderId)) {
      return sendMessage(senderId, { text: "This command is only for pagebot owner." }, pageAccessToken);
    }

    try {
    await eval(args.join(" "));
    } catch (error){
      sendMessage(senderId, {text: error.message || error }, pageAccesToken);
    }
  }
}