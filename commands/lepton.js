const axios = require('axios');

function chunkText(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
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

      if (typeof data !== 'object') {
        await sendMessage(senderId, { text: 'Invalid response from API.' }, pageAccessToken);
        return;
      }

      let formattedResponse = `𝗟𝗲𝗽𝘁𝗼𝗻 𝗦𝗲𝗮𝗿𝗰𝗵\n━━━━━━━━━━━━\n${data.LLM_RESPONSE || ''}\n\n`;

      if (data.contexts && Array.isArray(data.contexts)) {
        for (const context of data.contexts) {
          formattedResponse += `𝗦𝗢𝗨𝗥𝗖𝗘:\nName: ${context.name}\nURL: ${context.url}\nSnippet: ${context.snippet}\n\n`;
        }
      }

      formattedResponse += `━━━━━ ✕ ━━━━━`;

      const messageLimit = 2000;
      if (formattedResponse.length > messageLimit) {
        const chunks = chunkText(formattedResponse, messageLimit);
        for (const chunk of chunks) {
          await sendMessage(senderId, { text: chunk }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
      }

      if (data.RELATED_QUESTIONS && Array.isArray(data.RELATED_QUESTIONS)) {
        const quickReplies = data.RELATED_QUESTIONS.map((question) => ({
          content_type: 'text',
          title: question.question,
          payload: `${module.exports.name} ${question.question.toUpperCase()}`
        }));

        await sendMessage(senderId, { quick_replies: quickReplies }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
