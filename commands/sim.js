const axios = require('axios');

module.exports = {
  name: 'sim',
  description: 'simsimi fun tag',
  author: 'markdevs (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
if (!prompt) {
          sendMessage(senderId, { text: 'please provide a text to talk simsimifun' }, pageAccessToken);
        return;
    }

    try {
      const apiUrl = `https://apis-markdevs69v2.onrender.com/api/simv2/get/${encodedURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.reply;
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
