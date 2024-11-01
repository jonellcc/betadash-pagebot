module.exports = {
  name: 'contact',
  description: 'Admin page bot',
  author: 'Cliff',
  execute(senderId, args, pageAccessToken, sendMessage, pageid, splitMessageIntoChunks, admin, message, event) {
    const kupal = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Contact me for issues",
              image_url: "https://i.imgur.com/Tr4sEdl.jpeg",
              subtitle: "Contact us for any assistance.",
              default_action: {
                type: "web_url",
                url: "https://www.facebook.com/swordigo.swordslush",
                webview_height_ratio: "tall"
              },
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
          ]
        }
      }
    };
    sendMessage(senderId, kupal, pageAccessToken);
  }
};

