const axios = require('axios');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

const cooldowns = {};

module.exports = {
  name: 'spamsms',
  description: 'Send spam SMS',
  author: 'Cliff',
  usage: 'spamsms <number> <count> <interval>',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length < 3) {
      return await sendMessage(
        senderId,
        { text: '📩 | Please provide a number, count, and interval' },
        pageAccessToken
      );
    }

    const arg = args.join(' ');
    const [number, countRaw, intervalRaw] = arg.split(' ');

    const philippinesNumberRegex = /^(?:\+63|0)9\d{9}$/;
    if (!philippinesNumberRegex.test(number)) {
      return await sendMessage(
        senderId,
        {
          text: '❌ | Please provide only a valid Philippines number (e.g., +639XXXXXXXXX or 09XXXXXXXXX).',
        },
        pageAccessToken
      );
    }

    let count = parseInt(countRaw, 10) || 1;
    count = Math.abs(count);

    if (count > 30) {
      return await sendMessage(
        senderId,
        { text: 'The number count limit is 30 only.' },
        pageAccessToken
      );
    }

    let interval = parseInt(intervalRaw, 10) || 200;
    interval = Math.abs(interval);

    if (interval > 1000) {
      return await sendMessage(
        senderId,
        { text: 'The interval cannot exceed 1000ms. The limit is only 1000ms.' },
        pageAccessToken
      );
    }

    const now = Date.now();
    const cooldownTime = 20 * 1000;

    if (cooldowns[senderId] && now - cooldowns[senderId] < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - (now - cooldowns[senderId])) / 1000);
      return await sendMessage(
        senderId,
        {
          text: `⏳ Please wait ${remainingTime} second(s) before using this command again.\n\nThis cooldown is to prevent spamming.`,
        },
        pageAccessToken
      );
    }

    const apiUrl = `https://yt-video-production.up.railway.app/spamsms?number=${encodeURIComponent(number)}&count=${count}&interval=${interval}`;

    try {
      const response = await axios.get(apiUrl, { headers });

      if (response.data.status) {
        let message = `📩 | Spam SMS Sent\nTarget: ${response.data.target_number}\nCount: ${response.data.count}\nInterval: ${response.data.interval}ms\n\nResults:\n`;
        response.data.result.forEach((res) => {
          message += `Message #${res.messageNumber}: ${res.result}\n`;
        });

        cooldowns[senderId] = now;

        await sendMessage(
          senderId,
          { text: message },
          pageAccessToken
        );
      } else {
        await sendMessage(
          senderId,
          { text: '❌ | Failed to send SMS.' },
          pageAccessToken
        );
      }
    } catch (error) {
      await sendMessage(
        senderId,
        { text: '❌ | Error: Unable to process the request.' },
        pageAccessToken
      );
    }
  },
};
