const axios = require("axios");

module.exports = {
  name: "say",
  description: "Text to voice speech messages",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const content = args.join(" ");
    if (!content) {
      sendMessage(senderId, { text: 'Please provide text to convert to speech' }, pageAccessToken);
      return;
    }

    const downloadUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedURIConponent(content)}&tl=tl&client=tw-ob`;

    sendMessage(
      senderId,
      {
        attachment: {
          type: 'audio',
          payload: {
            url: downloadUrl,
            is_reusable: true,
          },
        },
      },
      pageAccessToken
    );
  }
};