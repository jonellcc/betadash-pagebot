const axios = require('axios');

module.exports = {
  name: 'spotify',
  description: 'Get a Spotify download link for a song',
  author: 'Cliff (betadash api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Please provide music you want to search' }, pageAccessToken);
      return;
    }

  try {
sendMessage(senderId, { text: `🔍 | Searching music ${query}`}, pageAccessToken);
      const apiUrl = `https://betadash-search-download.vercel.app/spt?search=${encodeURIComponent(query)}&apikey=syugg`;
      const response = await axios.get(apiUrl);

      const spotifyLink = response.data.spotify[0].result;

      if (spotifyLink) {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: spotifyLink,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Sorry, no Spotify download link found for that query.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
