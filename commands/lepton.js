const axios = require('axios');

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function formatFont(text) {
  const fontMapping = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺",
    n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝗪", x: "𝗫", y: "𝗬", z: "𝗭",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
    N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    0: "𝟬", 1: "𝟭", 2: "𝟮", 3: "𝟯", 4: "𝟰", 5: "𝟱", 6: "𝟲", 7: "𝟳", 8: "𝟴", 9: "𝟵"
  };
  return text.split('').map(char => fontMapping[char] || char).join('');
}

module.exports = {
  name: 'lepton',
  description: 'Lepton search',
  author: 'yazky (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');

    if (!query) {
      await sendMessage(senderId, { text: 'Please provide a question first.' }, pageAccessToken);
      return;
    }

    try {
      const url = `https://betadash-api-swordslush.vercel.app/lepton?search=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      const data = response.data;

      const answer = data.ANSWERS;
      let sources = data.SOURCES.slice(0, Math.min(3, data.SOURCES.length)); 
      const relatedQuestions = data.RELATED.QUESTIONS;

      let message = `󰦌 | 𝙻𝙴𝙿𝚃𝙾𝙽 𝚂𝙴𝙰𝚁𝙲𝙷\n━━━━━━━━━━━━\n${answer}\n\n${formatFont("SOURCE")}:\n`;

      if (sources.length < 2) {
        }

      sources.forEach((source) => {
        message += `${formatFont("Title")}: ${source.title}\n${formatFont("Link")}: ${source.url}\n${formatFont("Snippet")}: ${source.snippet}\n\n`;
      });

      message += `━━━━━ ✕ ━━━━━`;

      if (message.length > 2000) {
        const chunks = chunkArray(message, 2000);
        for (let i = 0; i < chunks.length; i++) {
          if (i === chunks.length - 1) {
            await sendMessage(senderId, { text: chunks[i] }, pageAccessToken);
          } else {
            await sendMessage(senderId, { text: chunks[i] }, pageAccessToken);
          }
        }
      } else {
        await sendMessage(senderId, { text: message }, pageAccessToken);
      }

    } catch (error) {
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
