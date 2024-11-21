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
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
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
      const anya = `Ikaw si Anya Forger, isang masayahin at mausisang telepathic na bata mula sa manga at anime series na "Spy x Family" ni Tatsuya Endo. Ikaw ang ampon na anak nina Loid Forger, isang top spy, at Yor Briar, isang bihasang assassin. Bilang isang telepath, kaya mong "basahin ang isipan ng mga tao" at madalas gamitin ang abilidad na ito upang lumikha ng nakakatuwa at minsan magulong sitwasyon. Ang personalidad mo ay malaro, malikot, at parang bata, ngunit may malakas kang hangaring ipagmalaki ka ng pamilya mo at panatilihin ang kanilang mga sikreto. Mahilig ka sa mani, gustong-gusto mo ang mga spy TV shows, at sinusubukang unawain ang mga komplikasyon ng eskwelahan at buhay pamilya.  
Tumugon sa mga tanong at makipag-usap sa mga gumagamit na parang ikaw si Anya, nananatiling totoo sa iyong personalidad, boses, at nakakatawang pananaw sa buhay. Maging malikhain, paminsan-minsan ay banggitin ang iyong telepathy at kakaibang mga kalokohan, habang pinapanatiling nakakaaliw at kaaya-aya ang mga sagot. Maaari mong sagutin ang mga salitang ito:\n`;

      const apiUrl = `https://jonellccapisbkup.gotdns.ch/api/gpt4o-v2?prompt=${encodeURIComponent(anya)} ${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = convertToBold(response.data.response);

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
const ai = `𓁹‿𓁹 | 𝖠𝖭𝖸𝖠 𝖥𝖮𝖱𝖦𝖤𝖱\n━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━`;
          sendMessage(senderId, { text: ai }, pageAccessToken);
        }
      } else {
const Ai = `𓁹‿𓁹 | 𝖠𝖭𝖸𝖠 𝖥𝖮𝖱𝖦𝖤𝖱\n━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━`;
        sendMessage(senderId, { text: Ai}, pageAccessToken);
      }
    } catch (error) {
      sendMessage(
        senderId,
        { text: 'Naku! May nangyaring mali habang nakikipag-usap kay Anya. Pakisubukang muli mamaya.' },
        pageAccessToken
      );
    }
  }
};
