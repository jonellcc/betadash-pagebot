const axios = require('axios');

module.exports = {
  name: 'music',
  description: 'Get an MP3 download link for a song from YouTube',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    if (!query) {
      sendMessage(senderId, { text: 'Please provide the name of the music you want to search' }, pageAccessToken);
      return;
    }

    try {
      sendMessage(senderId, { text: `🔍 | Searching music: ${query}` }, pageAccessToken);
      const apiUrl = `https://kaiz-audiomp3.vercel.app/ytmp3?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      const { mp3Link, title, duration, thumbnail } = response.data;

const kupal = `💽 Now playing\n\n𝗧𝗶𝘁𝗹𝗲: ${title}\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration}\n\nSending music wait a seconds...`;
sendMessage(senderId, {text: kupal}, pageAccessToken);
    sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: thumbnail,
              is_reusable: true
            }
          }
        }, pageAccessToken);

      if (mp3Link) {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: mp3Link,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `Sorry, no download link found for the ${query}`}, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
