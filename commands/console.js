// command: console.js
const { getLogs } = require("./console");

module.exports = {
  name: "console",
  description: "Get all captured console logs",
  author: "uno",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const textLogs = getLogs();
    if (!textLogs) {
      return sendMessage(senderId, { text: "No logs yet." });
    }

    // If logs are too long, split into chunks
    const chunks = textLogs.match(/[\s\S]{1,1900}/g) || [];
    for (const chunk of chunks) {
      await sendMessage(senderId, { text: chunk });
    }
  },
};
