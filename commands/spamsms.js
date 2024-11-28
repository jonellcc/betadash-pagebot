const axios = require('axios');

module.exports = {
  name: 'spamsms',
  description: 'Send spam SMS',
  author: 'Cliff',
  usage: 'spamsms <number> <count> <interval>',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length < 3) {
      return await sendMessage(senderId, { text: '📩 | Please provide a number, count, and interval' }, pageAccessToken);
    }

    const arg = args.join(" ");
    const [number, countRaw, intervalRaw] = arg.split(" ");

    // Validate Philippines number
    const philippinesNumberRegex = /^(?:\+63|0)9\d{9}$/;
    if (!philippinesNumberRegex.test(number)) {
      return await sendMessage(senderId, { 
        text: '❌ | Please provide only a valid Philippines number (e.g., +639XXXXXXXXX or 09XXXXXXXXX).' 
      }, pageAccessToken);
    }

    const count = Math.min(Math.max(parseInt(countRaw) || 1, 1), 30);

    if (countRaw && count > 30) {
      await sendMessage(senderId, { 
        text: "The number count cannot exceed 30. The limit is set to 30." 
      }, pageAccessToken);
    }

    const interval = Math.max(parseInt(intervalRaw) || 1000, 1000);

    if (intervalRaw && interval > 1000) {
      await sendMessage(senderId, { 
        text: "The interval cannot exceed 1000ms. The limit is set to 1000ms." 
      }, pageAccessToken);
    }

    const apiUrl = `https://yt-video-production.up.railway.app/spamsms?number=${encodeURIComponent(number)}&count=${count}&interval=${interval}`;

    try {
      const { data } = await axios.get(apiUrl);

      if (data.status) {
        let message = `📩 | Spam SMS Sent\nTarget: ${data.target_number}\nCount: ${data.count}\nInterval: ${data.interval}ms\n\nResults:\n`;
        data.result.forEach(res => {
          message += `Message #${res.messageNumber}: ${res.result}\n`;
        });

        await sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: '❌ | Failed to send SMS.' }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, { text: '❌ | Error: Unable to process the request.' }, pageAccessToken);
    }
  },
};
