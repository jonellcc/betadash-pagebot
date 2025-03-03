const axios = require('axios');

function splitArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
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

      let formattedResponse = `𝗟𝗲𝗽𝘁𝗼𝗻 𝗦𝗲𝗮𝗿𝗰𝗵\n━━━━━━━━━━━━\n`;

      const contexts = JSON.parse(data).contexts;
      const relatedQuestions = JSON.parse(data).relatedQuestions || [];

      contexts.forEach((context, index) => {
        formattedResponse += `SOURCE ${index + 1}:\n`;
        formattedResponse += `Name: ${context.name}\n`;
        formattedResponse += `URL: ${context.url}\n`;
        formattedResponse += `Snippet: ${context.snippet}\n`;
        formattedResponse += `Description: ${context.description || 'No description available.'}\n`;
        formattedResponse += `━━━━━ ✕ ━━━━━\n`;
      });

      const quickReplies = relatedQuestions.map(question => ({
        content_type: "text",
        title: question.question,
        payload: `${module.exports.name} ${question.question}`
      }));

      if (formattedResponse.length > 2000) {
        const chunks = splitArray(formattedResponse, 2000);
        for (const chunk of chunks) {
          await sendMessage(senderId, { text: chunk }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
      }

      await sendMessage(senderId, {
        quick_replies: quickReplies
      }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
