const axios = require('axios');

module.exports = {
  name: 'genfrom',
  description: 'multi downloader GenfromDL',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args.length) {
      sendMessage(senderId, { text: "Please provide a URL." }, pageAccessToken);
      return;
    }

    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/genfrom-dl?url=${encodeURIComponent(args.join(" "))}`;

    try {
      sendMessage(senderId, { text: `Downloading please wait...` }, pageAccessToken);

      const response = await axios.get(apiUrl);
      const data = response.data.data.data[0];
      const title = data.title;
      const thumbnail = data.thumbnail;
      const videoUrl = data.links.find(link => link[1] === '240p' || link[1] === 'Link')[3];

      const ya = await axios.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(videoUrl)}`);
      const sht = ya.data.url;

      sendMessage(senderId, {
        attachment: {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": title,
                "image_url": thumbnail,
                "subtitle": "",
                "default_action": {
                  "type": "web_url",
                  "url": args.join(" "),
                  "webview_height_ratio": "compact"
                },
                "buttons": [
                  {
                    "type": "web_url",
                    "url": sht,
                    "title": "Watch Video 🤫"
                  }
                ]
              }
            ]
          }
        }
      }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: `[ ❌ ] Error fetching video data.` }, pageAccessToken);
    }
  }
};
