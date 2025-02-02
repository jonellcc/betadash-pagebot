const as = require('axios');

function s(m, c) {
  const r = [];
  for (let i = 0; i < m.length; i += c) {
    r.push(m.slice(i, i + c));
  }
  return r;
}

module.exports = {
  name: 'goody',
  description: 'Ask a question to Goody AI',
  author: 'yazky (rest api)',
    async execute(senderId, args, pageAccessToken, sendMessage) {

const s = senderId;
const a = args;
const p = pageAccessToken;
const m = sendMessage;
    const q = a.join(' ');

    if (!q) {
      m(s, { text: 'Please provide a question first.' }, p);
      return;
    }

    try {
      const u = `https://betadash-api-swordslush.vercel.app/goody?ask=${encodeURIComponent(q)}`;
      const r = await as.get(u);
      const t = r.data.response;

      const l = 2000;
      if (t.length > l) {
        const c = s(t, l);
        for (const x of c) {
          const f = `🗨️ GOODY-2\n━━━━━━━━━━━━\n${x}\n━━━━━ ✕ ━━━━━`;
          m(s, { text: f }, p);
        }
      } else {
        const f = `🗨️ GOODY-2\n━━━━━━━━━━━━━\n${t}\n━━━━━ ✕ ━━━━━`;
        m(s, { text: f }, p);
      }
    } catch (e) {
      m(s, { text: e.message }, p);
    }
  }
};
