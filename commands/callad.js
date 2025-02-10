module.exports = {
  name: 'callad',
  description: 'Send feedback or issues to the admin',
  usage: 'callad <message>',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const admin = "7913024942132935";

    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(
        senderId,
        { text: '❗ Please provide a message to report to the admin.' },
        pageAccessToken
      );
      return;
    }

    const message = args.join(" ");

      await sendMessage(
        admin,
        {
          text: `📥 𝗡𝗲𝘄 𝗙𝗲𝗲𝗱𝗯𝗮𝗰𝗸 𝗥𝗲𝗰𝗲𝗶𝘃𝗲𝗱:\n\n👤 𝗙𝗿𝗼𝗺 𝗦𝗲𝗻𝗱𝗲𝗿 𝗜𝗗: ${senderId}\n\n📑 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${message}`
        },
        pageAccessToken
      );

    await sendMessage(
      senderId,
      { text: '✅ Thank you for your feedback! Your message has been sent to the admin.' },
      pageAccessToken
    );
  }
};
