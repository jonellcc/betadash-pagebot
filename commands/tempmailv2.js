const axios = require('axios');

module.exports = {
  name: 'tempmailv2',
  description: 'Generate temporary email and check inbox',
  usage: '-tempmail gen OR -tempmail inbox <email>',
  author: 'coffee',
  async execute(senderId, args, sendMessage, pageAccessToken) {
    const [cmd, email] = args;
    if (cmd === 'gen') {
      return sendMessage(senderId, { text: `📧 | Temporary Email: ${Math.random().toString(36).slice(2, 10)}@rteet.com` }, pageAccessToken);
    }

    if (cmd === 'inbox' && email?.endsWith('@rteet.com')) {
      const username = email.split('@')[0];
      try {
        const { data: inbox } = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=rteet.com`);
        if (!inbox.length) return sendMessage(senderId, { text: 'Inbox is empty.' }, pageAccessToken);

        const { id, from, subject, date } = inbox[0];
        const { data: { textBody } } = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=rteet.com&id=${id}`);
        return sendMessage(senderId, { text: `📬 | Latest Email:\nFrom: ${from}\nSubject: ${subject}\nDate: ${date}\n\nContent:\n${textBody}` }, pageAccessToken);
      } catch {
        return sendMessage(senderId, { text: 'Error: Unable to fetch inbox or email content.' }, pageAccessToken);
      }
    }

    sendMessage(senderId, { text: 'Invalid usage. Use -tempmail gen or -tempmail inbox <email>' }, pageAccessToken);
  },
};