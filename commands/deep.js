const as = require('axios');

function s(m, c) {
  const r = [];
  for (let i = 0; i < m.length; i += c) {
    r.push(m.slice(i, i + c));
  }
  return r;
}

module.exports = {
  name: 'deep',
  description: 'Ask a question to Deepseek AI',
  author: 'yazky (rest api)',
    async execute(senderId, args, pageAccessToken, sendMessage) {

const s = senderId;
const a = args;
const p = pageAccessToken;
const m = sendMessage;

    const q = a.join(' ');

    if (!q) {
      await m(s, { text: 'Please provide a question first.' }, p);
      return;
    }

    try {
      const u = `https://yt-video-production.up.railway.app/Deepseek-V3?ask=${encodeURIComponent(q)}`;
      const r = await as.get(u);
      const t = r.data.response;

      const l = 2000;
      if (t.length > l) {
        const c = s(t, l);
        for (const x of c) {
          const f = `🐬 𝗗𝗲𝗲𝗽𝘀𝗲𝗲𝗸 𝗩𝟯\n━━━━━━━━━━━━\n${x}\n━━━━━ ✕ ━━━━━`;
         await m(s, { text: f }, p);
        }
      } else {
        const f = `🐬 𝗗𝗲𝗲𝗽𝘀𝗲𝗲𝗸 𝗩𝟯\n━━━━━━━━━━━━━\n${t}\n━━━━━ ✕ ━━━━━`;
       await m(s, { text: f }, p);
      }
    } catch (e) {
      await m(s, { text: e.message }, p);
    }
  }
};

