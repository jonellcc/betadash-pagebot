const _0xdg1 = require('axios');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports = {
  name: 'music',
  description: 'Get an MP3 download link for a song from YouTube',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const _0xms3 = args.join(' ');
    if (!_0xms3) {
      sendMessage(senderId, { text: 'Please provide the name of the music you want to search' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: `[ 🔍 ] 𝗳𝗶𝗻𝗱𝗶𝗻𝗴 𝗺𝘂𝘀𝗶𝗰 𝗳𝗼𝗿: '${_0xms3}', please wait...` }, pageAccessToken);

    try {
      const _0xvs4 = `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(_0xms3)}`;
      const _0xkp5 = await _0xdg1.get(_0xvs4, { headers });
      const _0xyd6 = _0xkp5.data[0];

      if (!_0xyd6) {
        sendMessage(senderId, { text: 'Audio not found. Please try another search.' }, pageAccessToken);
        return;
      }

      const _0xur7 = _0xyd6.url;
      const _0xxa8 = `https://yt-video-production.up.railway.app/ytdl?url=${encodeURIComponent(_0xur7)}`;
      const _0xqe9 = await _0xdg1.get(_0xxa8, { headers });
      const { audio: _0xmp10, title: _0xas11, thumbnail: _0xzo12, duration: _0xli13 } = _0xqe9.data;


const shet = await _0xdg1.get(`https://betadash-search-download.vercel.app/spt?search=${encodeURIComponent(_0xms3)}`, { headers });

const { artists, download_url } = shet.data;

      if (!shet) {
        sendMessage(senderId, { text: `Sorry, no download link found for "${_0xms3}"` }, pageAccessToken);
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
                  title: _0xas11,
                  image_url: _0xzo12,
                  subtitle: `Views: ${_0xyd6.views}\nDuration: ${_0xli13.label} (${_0xli13.seconds}s)`,
                  default_action: {
                    type: 'web_url',
                    url: _0xzo12,
                    webview_height_ratio: 'full',
                  },
                  buttons: [
                    {
                      type: 'web_url',
                      url: download_url || _0xmp10,
                      title: 'Download Mp3',
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

      const _0xfs14 = await _0xdg1.head(download_url, { headers });
      const _0xck15 = parseInt(_0xfs14.headers['content-length'], 10);

      if (_0xck15 > 25 * 1024 * 1024) {
        await sendMessage(
          senderId,
          {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'Error: The audio file exceeds the 25 MB limit and cannot be sent.',
                buttons: [
                  {
                    type: 'web_url',
                    url: download_url,
                    title: 'Download URL',
                  },
                ],
              },
            },
          },
          pageAccessToken
        );
      } else {
        sendMessage(
          senderId,
          {
            attachment: {
              type: 'audio',
              payload: {
                url: download_url,
                is_reusable: true,
              },
            },
          },
          pageAccessToken
        );
      }
    } catch (_0xerr16) {
      sendMessage(senderId, { text: "The google audio Url cannot be sent:\n" + _0xerr16.message }, pageAccessToken);
    }
  },
};
