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
      const res = await axios.get(`https://sim2-0.onrender.com/sim2.5?prompt=${prompt}&uid=${senderId}`);
      
      const response = await axios.get(res);
      const respond = response.data.reply;

     await sendMessage(senderId, { text: respond }, pageAccessToken);

    } catch (error) {
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
