const axios = require('axios');

module.exports = {
  name: 'att',
  description: 'Send an attachment (video, image, gif, audio) via URL',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      if (args.length < 2) {
        return sendMessage(senderId, { text: 'Usage: att <type> <url>' }, pageAccessToken);
      }

      const type = args[0].toLowerCase();
      const url = args[1];

      const validTypes = ['video', 'image', 'gif', 'audio'];
      if (!validTypes.includes(type)) {
        return sendMessage(senderId, { text: 'Invalid type. Use: video, image, gif, or audio.' }, pageAccessToken);
      }

      sendMessage(senderId, {
        attachment: {
          type: type === 'gif' ? 'image' : type, // GIFs are treated as images in Messenger
          payload: {
            url: url,
            is_reusable: true
          }
        }
      }, pageAccessToken);

    } catch (error) {
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};
