module.exports = {
  name: 'ld',
  description: 'Undefined',
  author: 'CLIFF',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const fs = require('fs');
    const path = require('path');

    const fileName = args[0];

    if (!fileName) {
      return sendMessage(senderId, {
        text: 'Please provide a file name to delete.'
      }, pageAccessToken);
    }

    const filePath = path.join(__dirname, fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return sendMessage(senderId, {
          text: `❎ | Failed to delete ${fileName}.`
        }, pageAccessToken);
      }
      sendMessage(senderId, {
        text: `✅ | ( ${fileName} ) Deleted successfully!`
      }, pageAccessToken);
    });
  }
};