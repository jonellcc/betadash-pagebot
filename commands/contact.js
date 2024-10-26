module.exports = {
  name: 'contact',
  description: 'Admin page bot',
  author: 'Cliff',
  execute(senderId, args, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks, admin, message, event) {
const kupal = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
     text: "Hi there! If you’re experiencing issues with commands or need further assistance, please feel free to reach out. You can contact the admin directly for help. Click the options below to either contact admin  or message us directly on Messenger.",
      buttons: [
        {
          type: "web_url",
          url: "https://www.facebook.com/swordigo.swordslush",
          title: "Contact"
        },
        {
          type: "web_url",
          url: "https://m.me/swordigo.swordslush",
          title: "Message"
        }
      ]
    }
  }
};
    sendMessage(senderId, kupal, pageAccessToken);
  }
};