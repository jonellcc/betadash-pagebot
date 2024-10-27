const { sendMessage} = require("../kupal");

module.exports = {
  name: "delete",
  description: 'delete file',
  author: 'CLIFF',
  async execute(senderId, args, pageAccessToken) {
    const fs = require('fs');
    const path = require('path');
const kupal = ["8505900689447357", "8269473539829237", "7913024942132935"];

   if (!kupal.some(kupal_ka => kupal_ka === senderId)) {
    sendMessage(senderId, { text: "This command is only for pagebot owner." }, pageAccessToken);
  return;
}

    const fileName = args[0];

    if (!fileName) {
      return sendMessage(senderId, {
        text: 'Please provide a file name to delete.'
      }, pageAccessToken);
    }

    const filePath = path.join(__dirname, fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
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