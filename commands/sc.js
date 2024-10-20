const axios = require('axios');

module.exports = {
  name: 'sc',
  description: 'search SoundCloud audio',
  author: 'Cliff (betadash api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Please provide music you want to search.' }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: `🔍 | Searching music: ${query}` }, pageAccessToken);

      const apiUrl = `https://betadash-search-download.vercel.app/sc?search=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl, { responseType: 'stream' });

      if (response) {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: apiUrl, 
              is_reusable: true
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Sorry, no audio found for that query.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Error processing your request. Please try again.' }, pageAccessToken);
      console.error('Error:', error);
    }
  }
};
