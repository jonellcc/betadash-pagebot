const axios = require('axios');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports = {
  name: 'music',
  description: 'Get music info from Shazam API',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Please provide the name of the music you want to search' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: `[ 🔍 ] 𝗳𝗶𝗻𝗱𝗶𝗻𝗴 𝗺𝘂𝘀𝗶𝗰 𝗳𝗼𝗿: '${query}', please wait...` }, pageAccessToken);

    try {
      const shazamUrl = `https://betadash-api-swordslush-production.up.railway.app/shazam?title=${encodeURIComponent(query)}&limit=1`;
      const response = await axios.get(shazamUrl, { headers });
      const data = response.data.results[0];

      if (!data) {
        sendMessage(senderId, { text: 'Not found. Please try another search.' }, pageAccessToken);
        return;
      }

      await sendMessage(
        senderId,
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: data.title,
                  image_url: data.thumbnail,
                  subtitle: `Artist: ${data.artistName}\nAlbum: ${data.albumName}\nGenre: ${data.genreNames.join(', ')}\nRelease: ${data.releaseDate}`,
                  default_action: {
                    type: 'web_url',
                    url: data.appleMusicUrl,
                    webview_height_ratio: 'tall',
                  },
                  buttons: [
                    {
                      type: 'web_url',
                      url: data.appleMusicUrl,
                      title: 'Apple Music',
                    },
                    {
                      type: 'web_url',
                      url: data.previewUrl,
                      title: 'Preview',
                    },
                  ],
                },
              ],
            },
          },
        },
        pageAccessToken
      );
    } catch (error) {
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  },
};
