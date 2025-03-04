const as = require('axios');

function si(m, c) {
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
      const c = si(t, l);

      for (let i = 0; i < c.length; i++) {
        const x = c[i];

        if (i === 0) {
          const f = `󰦐 | 𝗬𝗢𝗨 𝗔𝗜\n━━━━━━━━━━━\n${x}`;
          await m(s, { text: f }, p);
        } else {
          await m(s, { text: x }, p);
        }
      }

      await m(s, { text: '━━━━━ ✕ ━━━━━' }, p);
    } catch (e) {
      await m(s, { text: e.message }, p);
    }
  }
};
