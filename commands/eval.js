module.exports = {
  name: 'eval',
  description: 'test code',
  usage: '<eval> <code>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks, admin, cose) {
if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a code you want to test' }, pageAccessToken);
      return;
    }

    try {
    await eval(args.join(" "));
    } catch (error){
      sendMessage(senderId, {text: error.message || error }, pageAccesToken);
    }
  }
}