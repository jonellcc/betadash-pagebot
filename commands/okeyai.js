const as = require('axios');

function si(m, c) {
  const r = [];
  for (let i = 0; i < m.length; i += c) {
    r.push(m.slice(i, i + c));
  }
  return r;
}

const fontMapping = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
  'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
  'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
  'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
  'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
  'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
  'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  1: "𝟭", 2: "𝟮", 3: "𝟯", 4: "𝟰", 5: "𝟱", 6: "𝟲", 7: "𝟳", 8: "𝟴", 9: "𝟵", 0: "𝟬"
};

function convertToBold(text) {
  return text.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (match, boldText, h2Text, h3Text) => {
    const targetText = boldText || h2Text || h3Text;
    return [...targetText].map(char => fontMapping[char] || char).join('');
  });
}

module.exports = {
  name: 'okeyai',
  description: 'A cutting-edge AI that sees, hears, understands, and adapts in real time ',
  author: 'ozosOkechukwu playground',
    async execute(senderId, args, pageAccessToken, sendMessage) {

const s = senderId;
const a = args;
const p = pageAccessToken;
const m = sendMessage;

    const q = a.join('+');

    if (!q) {
      await m(s, { text: 'Please provide a question first.' }, p);
      return;
    }

    try {
      const u = `https://api.okeymeta.com.ng/api/ssailm/model/okeyai3.0-vanguard/okeyai?input=${q}`;
      const r = await as.get(u);
      const t = r.data.response;

      const l = 2000;
      if (t.length > l) {
        const c = si(t, l);
        for (const x of c) {
          const f = `∞ | 𝗢𝗸𝗲𝘆𝗠𝗲𝘁𝗮\n━━━━━━━━━━━\n${convertToBold(x)}\n━━━━━ ✕ ━━━━━`;
         await m(s, { text: f }, p);
        }
      } else {
        const f = `∞ | 𝗢𝗸𝗲𝘆𝗠𝗲𝘁𝗮\n━━━━━━━━━━━━\n${convertToBold(t)}\n━━━━━ ✕ ━━━━━`;
       await m(s, { text: f }, p);
      }
    } catch (e) {
      await m(s, { text: e.message }, p);
    }
  }
};
