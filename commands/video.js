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

    sendMessage(senderId, { text: `🔍Searching for '${search}', please wait...` }, pageAccessToken);

    try {
      const videoSearchUrl = `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(search)}`;
        const videoResponse = await axios.get(videoSearchUrl);
        const videoData = videoResponse.data[0];

const videoUrl = videoData.url;

      const { title, time, views, thumbnail, channelName} = videoData;

const kupal = `https://yt-video-production.up.railway.app/ytdl?url=${videoUrl}`;
        const vid = await axios.get(kupal, { headers });
       const videos = vid.data.video;
      const message = `𝗩𝗶𝗲𝘄𝘀: ${videoData.views}\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${time}`;

await sendMessage(
        senderId,
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: message,
                  default_action: {
                    type: 'web_url',
                    url: thumbnail,
                    webview_height_ratio: 'compact',
                  },
                  buttons: [
                     {
                     type: 'web_url',
                     url: videos,
                     title: 'Download Mp4',
                   },
                    {
                     type: 'web_url',
                     url: videoUrl,
                     title: 'Watch on YouTube',
                   },
              ],
            },
         ],
      },
    },
  },
  pageAccessToken
);

      if (videos) {
        const headResponse = await axios.head(videos, { headers });
        const fileSize = parseInt(headResponse.headers['content-length'], 10);

        if (!isNaN(fileSize) && fileSize <= 25 * 1024 * 1024) {
          sendMessage(senderId, {
            attachment: {
              type: 'video',
              payload: {
                url: videos,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        } else {
          sendMessage(senderId, {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: `Error: The video exceeds the 25 MB limit and cannot be sent.`,
                buttons: [
                  {
                    type: 'web_url',
                    url: videos,
                    title: 'Watch Video'
                  }
                ]
              }
            }
          }, pageAccessToken);
        }
      }
    } catch (error) {
      sendMessage(senderId, { text: "The google redirected video Url cannot be sent:\n" + error.message }, pageAccessToken);
    }
  }
};
