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
      const apiUrl = `https://betadash-search-download.vercel.app/spt?search=${encodeURIComponent(query)}&apikey=syugg`;
      const response = await axios.get(apiUrl);

      const { title, duration, artists, download_url, thumbnail} = response.data;

sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `${artists} ${duration}`,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                  }
                }
              ]
            }
          }
        },
        pageAccessToken
      ); 

      if (download_url) {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: download_url,
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
