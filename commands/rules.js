module.exports = {
  name: 'rules',
  description: 'Rules for using the page bot',
  usage: 'rules',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const termsAndConditions = `𝗧𝗘𝗥𝗠𝗦 𝗢𝗙 𝗦𝗘𝗥𝗩𝗜𝗖𝗘 & 𝗣𝗥𝗜𝗩𝗔𝗖𝗬 𝗣𝗢𝗟𝗜𝗖𝗬

By using this bot, you agree to:
1. 𝗜𝗻𝘁𝗲𝗿𝗮𝗰𝘁𝗶𝗼𝗻: The bot offers automated responses and logs interactions to improve service.
2. 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗶𝗹𝗶𝘁𝘆: 24/7 operation, but no guaranteed uptime.
3. 𝗗𝗮𝘁𝗮: We collect and store data to enhance functionality and never share it.
4. 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆: Your data is protected.
5. 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗖𝗼𝗺𝗽𝗹𝗶𝗮𝗻𝗰𝗲: Follow Facebook's terms or face access restrictions.
6. 𝗖𝗼𝗻𝘁𝗲𝗻𝘁: Do not share harmful or offensive material.
7. 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻: Verify critical info from official sources.
8. 𝗖𝗼𝗺𝗺𝘂𝗻𝗶𝗰𝗮𝘁𝗶𝗼𝗻: You consent to receive bot messages.
9. 𝗨𝗽𝗱𝗮𝘁𝗲𝘀: Terms may change, and continued use implies acceptance.

Failure to comply may result in access restrictions.`;

    sendMessage(senderId, { text: termsAndConditions }, pageAccessToken);
  }
};
