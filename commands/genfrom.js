const _0xa = require('axios');

module.exports = {
  name: 'genfrom',
  description: 'multi downloader GenfromDL',
  author: 'yazky',
  async execute(senderId, args, pageAccessToken, sendMessage) {

    const _0xl2 = senderId;
    const _0xl3 = args;
    const _0xl4 = pageAccessToken;
    const _0xl5 = sendMessage;
    const _one = _0xa;

    if (!_0xl3.length) {
      _0xl5(_0xl2, { text: "Please provide a URL." }, _0xl4);
      return;
    }

    const _0xl6 = `https://betadash-api-swordslush-production.up.railway.app/genfrom-dl?url=${encodeURIComponent(_0xl3.join(" "))}`;

    try {
      _0xl5(_0xl2, { text: `Downloading please wait...` }, _0xl4);

      const _0xl7 = await _one.get(_0xl6);
      const _0xl8 = _0xl7.data.data.data[0];
      const _0xl9 = _0xl8.title;
      const _0xla = _0xl8.thumbnail;
      const _0xlb = _0xl8.links.find(_0xlc => _0xlc[1] === '240p' || _0xlc[1] === 'Link')[3];
      const { views: _0xld, duration: _0xle, date: _0xlf } = _0xl8;

      const _0xlg = await _one.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(_0xlb)}`);
      const _0xlh = _0xlg.data.url;

      const _0xli = await _one.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(_0xlb)}`);
      const _0xlj = _0xli.data.url;

      await _0xl5(_0xl2, {
        attachment: {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": _0xl9,
                "image_url": _0xlj,
                "subtitle": `Views: ${_0xld}\nDuration: ${_0xle}\nDate: ${_0xlf}`,
                "default_action": {
                  "type": "web_url",
                  "url": _0xlh,
                  "webview_height_ratio": "tall"
                },
                "buttons": [
                  {
                    "type": "web_url",
                    "url": _0xlh,
                    "title": "Watch Video 🤫"
                  }
                ]
              }
            ]
          }
        }
      }, _0xl4);
    } catch (_0xlm) {
      _0xl5(_0xl2, { text: `[ ❌ ] Error fetching video data.` }, _0xl4);
    }
  }
};

