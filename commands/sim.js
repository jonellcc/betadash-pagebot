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
      const res = await axios.get(`https://markdevs-last-api-s7d0.onrender.com/sim?q=${content}`);
      
      const response = await axios.get(res);
      const respond = response.data.response;

      // Send the API response text back to the user
      sendMessage(senderId, { text: respond }, pageAccessToken);

    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
