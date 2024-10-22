const axios = require('axios');

module.exports = {
  name: 'eval',
  description: 'board cancas',
  usage: '<eval> <code>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid) {

    try {
    await eval(args.join(" "));
    } catch (error){
      send(error.message || error);
    }
  }
}