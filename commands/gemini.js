const axios = require('axios');

async function getAttachments(mid, pageAccessToken) {
  if (!mid) {
    throw new Error("No message ID provided.");
  }

  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    throw new Error("No image found in the replied message.");
  }
}

module.exports = {
  name: 'gemini',
  description: 'Ask a question to gemini pro',
  author: 'Cliff (rest api by nethie)',
  async execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks, event) {
    const prompt = args.join(' ');

    if (!prompt || !args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, {text: '❌ | Please provide a prompt or reply to a photo.'}, pageAccessToken);
      return;
    }

    let imageUrl = '';
    if (event.message && event.message.reply_to && event.message.reply_to.mid) {
      try {
        imageUrl = await getAttachments(event.message.reply_to.mid, pageAccessToken);
      } catch (error) {
        await sendMessage(senderId, {text: '⚠️ | Error fetching image attachment.'}, pageAccessToken);
        return;
      }
    }

    let fileUrl = '';
    if (event.message && event.message.attachments && event.message.attachments[0]?.type === "photo") {
      fileUrl = encodeURIComponent(event.message.attachments[0].url);
    }

    try {
      const apiUrl = `https://rest-api-production-5054.up.railway.app/gemini?prompt=${encodeURIComponent(prompt)}&model=gemini-1.5-flash&uid=${senderId}`;
      const response = await axios.get(apiUrl);
      const text = response.data.message;

      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          const sheshh = `֎ | 𝗚𝗲𝗺𝗶𝗻𝗶-𝗙𝗟𝗔𝗦𝗛\n・━━━━━━━━━━━━━・\n${message}\n・━━━━━━━━━━━━━・\n✶ 𝚄𝚂𝙴 "𝙲𝙻𝙴𝙰𝚁" 𝚃𝙾 𝚁𝙴𝚂𝙴𝚃 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽.`;
          await sendMessage(senderId, { text: sheshh }, pageAccessToken);
        }
      } else {
        const sheshhs = `֎ | 𝗚𝗲𝗺𝗶𝗻𝗶-𝗙𝗟𝗔𝗦𝗛\n・━━━━━━━━━━━━━・\n${text}\n・━━━━━━━━━━━━━・\n✶ 𝚄𝚂𝙴 "𝙲𝙻𝙴𝙰𝚁" 𝚃𝙾 𝚁𝙴𝚂𝙴𝚃 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽.`;
        await sendMessage(senderId, { text: sheshhs }, pageAccessToken);
      }
    } catch (error) {
      await sendMessage(senderId, {text: '⚠️ | Sorry, there was an error processing your request.'}, pageAccessToken);
    }
  }
};
