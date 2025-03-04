const as = require('axios');

function s(m, c) {
  const r = [];
  for (let i = 0; i < m.length; i += c) {
    r.push(m.slice(i, i + c));
  }
  return r;
}

module.exports = {
  name: 'you',
  description: 'Ask a question to You Ai',
  author: 'yazky (rest api)',
    async execute(senderId, args, pageAccessToken, sendMessage) {

const s = senderId;
const a = args;
const p = pageAccessToken;
const m = sendMessage;

    const q = a.join(' ');

    if (!q) {
      await m(s, { text: '𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚏𝚒𝚛𝚜𝚝.' }, p);
      return;
    }

    try {
      const u = `https://yt-video-production.up.railway.app/you?chat=${encodeURIComponent(q)}`;
      const r = await as.get(u);
      const t = r.data.response;

      const l = 2000;
      if (t.length > l) {
        const c = s(t, l);
        for (const x of c) {
          const f = `󰦐 𝗬𝗢𝗨 𝗔𝗜\n━━━━━━━━━━━━\n${x}\n━━━━━ ✕ ━━━━━`;
         await m(s, { text: f }, p);
        }
      } else {
        const f = `󰦐 𝗬𝗢𝗨 𝗔𝗜\n━━━━━━━━━━━━━\n${t}\n━━━━━ ✕ ━━━━━`;
       await m(s, { text: f }, p);
      }
    } catch (e) {
      await m(s, { text: e.message }, p);
    }
  }
};
