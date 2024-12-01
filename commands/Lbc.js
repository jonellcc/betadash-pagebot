const axios = require('axios');

module.exports = {
  name: 'lbc',
  description: 'Send message to an LBC Express contact number',
  author: 'Cliff', //api by marjhun
  usage: 'lbcexpress <number> <message>',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length < 2) {
      return await sendMessage(senderId, { text: '📩 | Please provide a valid number and message.' }, pageAccessToken);
    }

    const arg = args.join(" ");
    const [number, ...messageParts] = arg.split(" ");
    const message = messageParts.join(" ");

    const philippinesNumberRegex = /^(?:\+63|0)9\d{9}$/;
    if (!philippinesNumberRegex.test(number)) {
      return await sendMessage(senderId, {
        text: '❌ | Invalid LBC Express number. Please use +639XXXXXXXXX or 09XXXXXXXXX format.'
      }, pageAccessToken);
    }

    const payload = {
      number,
      message
    };

    try {
      const response = await axios.post('https://freesmsbykenlieandzerocodes.vercel.app/send-sms', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        await sendMessage(senderId, {
          text: `✅ | Your message to ${number} has been successfully sent via LBC Express.`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: '❌ | Failed to send your message. Please try again later.'
        }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, {
        text: '❌ | An error occurred while processing your request. Please check the details and try again.'
      }, pageAccessToken);
    }
  },
};
