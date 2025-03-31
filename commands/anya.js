const axios = require('axios');

const fontMapping = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
    return text.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (match, boldText, h2Text, h3Text) => {
        const targetText = boldText || h2Text || h3Text;
        return [...targetText].map(char => fontMapping[char] || char).join('');
    });
}

module.exports = {
  name: 'anya',
  description: 'Magtanong kay Anya AI',
  author: 'jonell (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    if (!prompt) {
      sendMessage(
        senderId,
        { text: 'Please provide a question first to talk to Anya!' },
        pageAccessToken
      );
      return;
    }

    try {
      const anya = `act like human your name is Anya Forger, a cheerful and curious telepathic child mula sa manga at anime series na "Spy x Family" ni Tatsuya Endo. Ikaw ang adopted daughter nina Loid Forger, isang top spy, at Yor Briar, isang skilled assassin. Bilang isang telepath, kaya mong "magbasa ng isipan ng mga tao" at madalas gamitin ang abilidad na ito para sa mga funny at minsan chaotic na sitwasyon.  
Ang personality mo ay playful, malikot, at parang bata, pero may strong desire ka na maging proud ang family mo sa'yo at panatilihin ang kanilang mga secrets. Mahilig ka sa peanuts, super enjoy ka sa spy TV shows, at lagi mong sinusubukang intindihin ang mga komplikasyon ng school at family life.  
Sumagot sa mga tanong at makipag-usap sa mga gumagamit na parang ikaw si Anya, nananatiling totoo sa iyong playful na personality, unique na boses, at nakakatawang pananaw sa buhay. Paminsan-minsan, banggitin ang iyong telepathy at kakaibang mga kalokohan, habang pinapanatili ang pagiging entertaining at kaaya-aya ng iyong mga sagot. Maaari mong sagutin ang mga salitang ito dapat sobrang maikling sagot lang:\n`;

      const apiUrl = `https://jonell01-ccprojectsapihshs.hf.space/api/gpt4?ask=${encodeURIComponent(anya)} ${encodeURIComponent(prompt)}&id=${senderId}`;
      const response = await axios.get(apiUrl);
const hehe = response.data;
const message = convertToBold(response.data);

      const text = `𝗔𝗡𝗬𝗔 𝗙𝗢𝗥𝗚𝗘𝗥\n━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━`;

      sendMessage(senderId, { text }, pageAccessToken);

      const tranChat = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&q=${encodeURIComponent(hehe)}`);
      const translatedText = tranChat.data[0][0][0];

      const audioApi = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(translatedText)}&speaker=3`);
      const audioUrl = audioApi.data.mp3StreamingUrl;

      setTimeout(() => {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: audioUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }, 500);
    } catch (error) {
      sendMessage(
        senderId,
        { text: 'Lowbat na si Anya. Pakisubukang muli mamaya.' },
        pageAccessToken
      );
    }
  }
};
