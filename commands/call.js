
module.exports = {
  name: 'call',
  description: 'Call',
  usage: 'call',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
   sendMessage(
  senderId,
  {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Need further assistance?",
            image_url: "https://i.imgur.com/O6uwPoE.jpeg",
            subtitle: "Talk to owner",
            default_action: {
              type: "web_url",
              url: "https://i.imgur.com/O6uwPoE.jpeg",
              webview_height_ratio: "tall"
            },
            buttons: [
              {
                type: "phone_number",
                title: "Call Me Baby",
                payload: "+639947713112"
              },
              {
                type: "web_url",
                url: "https://www.facebook.com/profile.php?id=61567757543707",
                title: "Like/Follow"
              }
            ]
          }
        ]
      }
    }
  }, 
  pageAccessToken
);

  }
};
