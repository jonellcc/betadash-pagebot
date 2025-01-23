const axios = require("axios");

module.exports = {
  name: 'freepik',
  description: 'Generate images from Freepik',
  usage: 'freepik <search>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      await sendMessage(senderId, { text: "֎ | Generating, please wait...." }, pageAccessToken);

      const apiUrl = `https://betadash-api-swordslush.vercel.app/freepik?search=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const images = response.data.images.slice(0, 5);

      const attachments = images.map((url) => ({
        media_type: "image",
        url: url,
      }));

      await sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "media",
              elements: attachments,
            },
          },
        },
        pageAccessToken
      );
    } catch (error) {
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  },
};
