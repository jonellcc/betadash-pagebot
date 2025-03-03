const axios = require('axios');

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

module.exports = {
  name: 'lepton',
  description: 'Lepton search',
  author: 'yazky (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');

    if (!query) {
      await sendMessage(senderId, { text: 'Please provide a question first.' }, pageAccessToken);
      return;
    }

    try {
      const url = `https://betadash-api-swordslush.vercel.app/lepton?search=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      const data = response.data;

      const answer = data.ANSWERS;
      const sources = data.SOURCES;
      const relatedQuestions = data.RELATED.QUESTIONS;

      let message = `󰦅 | 𝗟𝗲𝗽𝘁𝗼𝗻 𝗦𝗲𝗮𝗿𝗰𝗵\n━━━━━━━━━━━━\n${answer}\n\n𝗦𝗢𝗨𝗥𝗖𝗘:\n`;

      sources.forEach((source) => {
        message += `𝗧𝗶𝘁𝗹𝗲: ${source.title}\n𝗟𝗶𝗻𝗸: ${source.url}\n𝗦𝗻𝗶𝗽𝗽𝗲𝘁: ${source.snippet}\n\n`;
      });

      message += `━━━━━ ✕ ━━━━━`;

      const quickReplies = relatedQuestions.map(question => ({
        content_type: "text",
        title: question,
        payload: `${module.exports.name.toUpperCase()} ${question.toUpperCase()}`
      }));

      if (message.length > 2000) {
        const chunks = chunkArray(message, 2000);
        for (let i = 0; i < chunks.length; i++) {
          if (i === chunks.length - 1) {
            await sendMessage(senderId, { text: chunks[i], quick_replies: quickReplies }, pageAccessToken);
          } else {
            await sendMessage(senderId, { text: chunks[i] }, pageAccessToken);
          }
        }
      } else {
        await sendMessage(senderId, { text: message, quick_replies: quickReplies }, pageAccessToken);
      }

    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
