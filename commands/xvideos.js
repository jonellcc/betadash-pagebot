const axios = require('axios');

module.exports = {
  name: 'xvideos',
  description: 'Random pinay adult vidoes',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {

const _0xlg = senderId;
const _0xlj = args;
const _0xla = pageAccessToken;
const _0xlt = sendMessage;

    const _0xn = parseInt(_0xlj[0]);
    const _0xp = isNaN(_0xn) || _0xn < 1 ? 1 : _0xn;

    const _0xk = `https://betadash-api-swordslush-production.up.railway.app/xvideos?page=${_0xp}`;

    try {
      const _0xz = await axios.get(_0xk);
      const _0xv = _0xz.data.result;

      const _0xe = await Promise.all(_0xv.map(async (_0xi) => {
        const _0xm = await axios.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(_0xi.image)}`);
        const _0xg = _0xm.data.url;
        const _0xy = await axios.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(_0xi.videoUrl)}`);
        const _0xu = _0xy.data.url;

        return {
          title: _0xi.title,
          image_url: _0xg,
          default_action: {
            type: "web_url",
            url: _0xu,
            webview_height_ratio: "compact"
          },
          buttons: [
            {
              type: 'web_url',
              url: _0xu,
              title: 'Watch Video'
            }
          ]
        };
      }));

      const _0xw = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: _0xe
          }
        }
      };

      await _0xlt(_0xlg, _0xw, _0xla);
    } catch (_0xf) {
      await _0xlt(_0xlg, {
        attachment: {
          type: "template",
          payload: {
            template_type: "media",
            elements: [
              {
                media_type: "video",
                url: "https://www.facebook.com/beluga.xyz/videos/2070790143388193/?app=fbl"
              }
            ]
          }
        }
      }, _0xla);
    }
  }
};
