const axios = require("axios");

module.exports = {
  name: "video",
  description: "search video from YouTube",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const search = args.join(" ");
    if (!search) {
      sendMessage(senderId, { text: 'Usage: video <search text>' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: `⏱️ | Searching for '${search}', please wait...` }, pageAccessToken);

    try {
      const response = await axios.get(`https://betadash-search-download.vercel.app/video?search=${encodeURIComponent(search)}`);
      const { downloadUrl: videoUrl, title } = response.data;

  const headResponse = await axios.head(videoUrl);
      const contentLength = headResponse.headers['content-length'];
      const sizeMb = contentLength / (1024 * 1024);

      if (sizeMb > 25) {
        sendMessage(senderId, { text: "Error: The video exceeds the 25 MB limit and cannot be sent." }, pageAccessToken);
        return;
      } 

      const messageText = `Video found\n𝗧𝗶𝘁𝗹𝗲: ${title}\n\nSending video please wait a minutes...`;
      sendMessage(senderId, { text: messageText }, pageAccessToken);

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
      sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};

