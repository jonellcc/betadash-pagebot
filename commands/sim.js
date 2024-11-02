const axios = require('axios');

module.exports = {
  name: 'sim',
  description: 'simsimi fun tag',
  author: 'markdevs (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');

    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a text to talk to simsimifun' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://apis-markdevs69v2.onrender.com/api/simv2/get/${prompt}`;
      const response = await axios.get(apiUrl);
      const text = response.data.reply;

      // Send the API response text back to the user
      sendMessage(senderId, { text }, pageAccessToken);

    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
