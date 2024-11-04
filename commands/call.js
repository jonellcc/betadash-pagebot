module.exports = {
  name: 'call',
  description: 'Call',
  usage: 'call',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {

 sendMessage(senderId, {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "Need further assistance? Talk to a owner",
      buttons: [
        {
          type: "phone_number",
          title: "Call Me Baby",
          payload: "+639947713112"
        }
      ]
    }
  }
}, pageAccessToken);
 }
};