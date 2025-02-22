const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { sendMessage } = require("../kupal");

module.exports = {
    name: 'hastebin',
    description: 'Send bot specified file',
    usage: 'hastebin <filename>',
    author: 'Cliff',
    async execute(senderId, args, pageAccessToken, pageid, splitMessageIntoChunks, admin, event) {
const kupal = ["8505900689447357", "8269473539829237", "7913024942132935"];

   if (!kupal.some(kupal_ka => kupal_ka === senderId)) {
    sendMessage(senderId, { text: "This command is only for    pagebot owner." }, pageAccessToken);
  return;
}

        if (!args || !Array.isArray(args) || args.length === 0) {
            await sendMessage(senderId, { text: 'Please provide a file name to send' }, pageAccessToken);
            return;
        }

        const fileName = args[0];
        const allowedExtensions = ['js', 'json', 'txt', 'py', 'lua', 'html', 'css', 'sql', 'php', 'java', 'md', 'sh'];
        let filePath;

        allowedExtensions.forEach(ext => {
            if (fileName.endsWith(`.${ext}`)) {
                filePath = path.resolve(__dirname, fileName);
            }
        });

        if (!filePath || !fs.existsSync(filePath)) {
            await sendMessage(senderId, { text: `File not found: ${fileName}` }, pageAccessToken);
            return;
        }

        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const response = await axios.get(`https://betadash-api-swordslush.vercel.app/hastebin?upload=${encodeURIComponent(fileContent)}`);
            const responseMessage = `𝗨𝗣𝗟𝗢𝗔𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬:\n\nѕкᴀʏʀᴀ: ${response.data.skyra}\n\nʀᴀᴡ: ${response.data.raw}`;

            await sendMessage(senderId, { text: responseMessage }, pageAccessToken);
        } catch (error) {
            await sendMessage(senderId, { text: error.message }, pageAccessToken);
        }
    }
};
