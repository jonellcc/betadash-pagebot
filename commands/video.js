const axios = require("axios");
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json'
};

module.exports = {
  name: "video",
  description: "Search video from YouTube",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const search = args.join(" ");
    if (!search) {
      sendMessage(senderId, { text: 'Usage: video <search text>' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: `🔍 Searching for '${search}', please wait...` }, pageAccessToken);

    try {
      const response = await axios.get(`https://betadash-search-download.vercel.app/videov2?search=${encodeURIComponent(search)}`, { headers} );
      const { downloadUrl: videoUrl, title, time, views } = response.data;

/**  const head = await axios.get(videoUrl, { responseType: 'arraybuffer' }, { headers } );
    const size = head.data.byteLength / (1024 * 1024);

      if (size > 25) {
        sendMessage(senderId, {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `Error: The video exceeds the 25 MB limit and cannot be sent\n\n𝗧𝗶𝘁𝗹𝗲: ${title}\n𝗨𝗿𝗹: ${videoUrl}`,
            buttons: [
              {
                type: 'web_url',
                url: videoUrl,
                title: 'Watch Video'
              }
            ]
          }
        }
      }, pageAccessToken);
        return;
      } **/

      const message = `𝗧𝗶𝘁𝗹𝗲: ${title}\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${time}\n𝗩𝗶𝗲𝘄𝘀: ${views}\n\nSending video please wait a sec...`;
      sendMessage(senderId, { text: message }, pageAccessToken);

      sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Error: video Not found' + error }, pageAccessToken);
    }
  }
};
