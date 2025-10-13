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

    sendMessage(senderId, { text: `[ 🔍 ] Searching for: '${search}', please wait...` }, pageAccessToken);

    try {
      const apiUrl = `https://api.ccprojectsapis-jonell.gleeze.com/api/ytsearch?title=${encodeURIComponent(search)}`;
      const response = await axios.get(apiUrl);
      const results = response.data.results;

      if (!results || results.length === 0) {
        sendMessage(senderId, { text: "❌ No results found." }, pageAccessToken);
        return;
      }

      const video = results[0]; // first result
      const { title, url: videoUrl, thumbnail, duration, views, author } = video;

      const downloadUrl = `https://yt-video-production.up.railway.app/ytdl?url=${videoUrl}`;
      const vid = await axios.get(downloadUrl, { headers });
      const videoDownload = vid.data.video;

      const message = `👤 Author: ${author}\n👁️ Views: ${views}\n⏱️ Duration: ${duration}`;

      // Send preview with buttons
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
                    url: videoUrl,
                    webview_height_ratio: 'compact',
                  },
                  buttons: [
                    {
                      type: 'web_url',
                      url: videoDownload,
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

      // Check file size before sending
      if (videoDownload) {
        const headResponse = await axios.head(videoDownload, { headers });
        const fileSize = parseInt(headResponse.headers['content-length'], 10);

        if (!isNaN(fileSize) && fileSize <= 25 * 1024 * 1024) {
          // Send video directly
          await sendMessage(senderId, {
            attachment: {
              type: 'video',
              payload: {
                url: videoDownload,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        } else {
          // Too large to send directly
          await sendMessage(senderId, {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: `⚠️ The video exceeds 25MB and cannot be sent directly.`,
                buttons: [
                  {
                    type: 'web_url',
                    url: videoDownload,
                    title: 'Download Video'
                  }
                ]
              }
            }
          }, pageAccessToken);
        }
      }

    } catch (error) {
      sendMessage(senderId, { text: "❌ Error fetching video:\n" + error.message }, pageAccessToken);
    }
  }
};
