const as = require('axios');

function s(m, c) {
  const r = [];
  for (let i = 0; i < m.length; i += c) {
    r.push(m.slice(i, i + c));
  }
  return r;
}

module.exports = {
  name: 'phi',
  description: 'Ask a question to Phi AI',
  author: 'yazky (rest api)',
  async execute(senderId: s, args: a, pageAccessToken: p, sendMessage: m) {

    const q = a.join(' ');

    if (!q) {
      m(s, { text: 'Please provide a question first.' }, p);
      return;
    }

    try {
      const u = `https://yt-video-production.up.railway.app/phi?ask=${encodeURIComponent(q)}`;
      const r = await as.get(u);
      const t = r.data.response;

      const l = 2000;
      if (t.length > l) {
        const c = s(t, l);
        for (const x of c) {
          const f = `🗨️ MICROSOFT/ᎮᏂᎥ-4\n━━━━━━━━━━━━\n${x}\n━━━━━ ✕ ━━━━━`;
          m(s, { text: f }, p);
        }
      } else {
        const f = `🗨️ MICROSOFT/ᎮᏂᎥ-4\n━━━━━━━━━━━━━\n${t}\n━━━━━ ✕ ━━━━━`;
        m(s, { text: f }, p);
      }
    } catch (e) {
      m(s, { text: e.message }, p);
    }
  }
};