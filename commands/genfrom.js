const axios = require('axios');

module.exports = {
  name: 'genfrom',
  description: 'multi downloader GenfromDL',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/genfrom-dl?url=${encodeURIComponent(args.join(" "))}`;

if (apiUrl please provide a url

    try {
      sendMessage(senderId, { text: `Downloading please wait...` }, pageAccessToken);

      const response = await axios.get(apiUrl);
      const data = response.data.data.data[0];
      const title = data.title;
      const thumbnail = data.thumbnail;
      const videoUrl = data.links.find(link => link[1] === '240p' || link[1] === 'Link')[3];
     const { views, duration, date } = data;


const nya = await axios.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(videoUrl)}`;
const shit = nya.data.url;

      await sendMessage(senderId, {
        attachment: {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": title,
                "image_url": thumbnail,
                "subtitle": `Views: ${views}\nDuration: ${duration}\nDate: ${date}`,
                "default_action": {
                  "type": "web_url",
                  "url": args.join(" "),
                  "webview_height_ratio": "compact"
                },
                "buttons": [
                  {
                    "type": "web_url",
                    "url": shit,
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
