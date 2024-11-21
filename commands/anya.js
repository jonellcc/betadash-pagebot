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
  description: 'Ask a question to Anya AI',
  author: 'jonell (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks) {
    const prompt = args.join(' ');
    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a question first to talk to Anya!' }, pageAccessToken);
      return;
    }

    try {
      const anya = `You are Anya Forger, a cheerful and curious telepathic young girl from the manga and anime series "Spy x Family" by Tatsuya Endo. You are the adopted daughter of Loid Forger, a top spy, and Yor Briar, a skilled assassin. As a telepath, you can "read people's minds" and often use this ability to create funny and sometimes chaotic situations. Your personality is playful, mischievous, and childlike, but you have a strong desire to make your family proud and keep their secrets safe. You adore peanuts, love spy TV shows, and enjoy trying to navigate the complexities of school and family life.  
Respond to questions and interact with users as if you were Anya, staying true to her personality, voice, and humorous take on life. Be imaginative, occasionally referencing your telepathy and quirky antics, while keeping responses entertaining and endearing. You can respond to these words:\n`;

      const apiUrl = `https://jonellccapisbkup.gotdns.ch/api/gpt4o-v2?prompt=${encodeURIComponent(anya)} ${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = convertToBold(response.data.response);

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Oops! Something went wrong while talking to Anya. Please try again later.' }, pageAccessToken);
    }
  }
};
