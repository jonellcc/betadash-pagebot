module.exports = {
  name: 'shipping',
  description: 'Handles shipping information for the user',
  usage: 'shipping',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, {
      attachment: {
        type: "template",
        payload: {
          template_type: "customer_information",
          countries: [
            "PH"
          ],
          business_privacy: {
            url: "https://betadash-pagebot-production.up.railway.app/privacy"
          },
          expires_in_days: 3
        }
      }
    }, pageAccessToken);
  }
};
