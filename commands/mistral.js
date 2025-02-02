const as = require('axios');

function s(m, c) {
  const r = [];
  for (let i = 0; i < m.length; i += c) {
    r.push(m.slice(i, i + c));
  }
  return r;
}

module.exports = {
  name: 'mistral',
  description: 'Ask a question to Mistral AI',
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
      const u = `https://kaiz-apis.gleeze.com/api/ministral-8b?q=${encodeURIComponent(q)}&uid=${s}`;
      const r = await as.get(u);
      const t = r.data.content;

      const l = 2000;
      if (t.length > l) {
        const c = s(t, l);
        for (const x of c) {
          const f = `〽️ 𝗠𝗜𝗦𝗧𝗥𝗔𝗟 𝗔𝗜\n━━━━━━━━━━━━\n${x}\n━━━━━ ✕ ━━━━━`;
          m(s, { text: f }, p);
        }
      } else {
        const f = `〽️ 𝗠𝗜𝗦𝗧𝗥𝗔𝗟 𝗔𝗜\n━━━━━━━━━━━━━\n${t}\n━━━━━ ✕ ━━━━━`;
        m(s, { text: f }, p);
      }
    } catch (e) {
      m(s, { text: e.message }, p);
    }
  }
};