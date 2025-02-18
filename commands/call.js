
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
            image_url: "https://i.ibb.co/KxVZyQ0j/757b0b2f-49e2-4db1-a070-e0e89031d75d.jpg",
            subtitle: "Talk to owner",
            default_action: {
              type: "web_url",
              url: "https://i.ibb.co/KxVZyQ0j/757b0b2f-49e2-4db1-a070-e0e89031d75d.jpg",
              webview_height_ratio: "compact"
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
