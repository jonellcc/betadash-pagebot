const axios = require('axios');

module.exports = {
  name: 'uid',
  description: 'Get Uid',
  usage: '<uid>',
  author: 'Cliff',
  async execute(senderId, args, pageAccessToken, sendMessage, pageid) {

    async function getUserInfo(senderId, pageAccessToken) {
      try {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${senderId}?access_token=${pageAccessToken}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
      }
    }

    try {
      const userInfo = await getUserInfo(senderId, pageAccessToken);
      if (!userInfo) {
        throw new Error('User info not found');
      }
 
      const { name, id } = userInfo;

      await sendMessage(senderId, {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: name,
            buttons: [
              {
                type: "web_url",
                url: `https://www.facebook.com/${id}`,
                title: "Contact"
              },
              {
                type: "web_url",
                url: `https://m.me/${id}`,
                title: "Message"
              }
            ]
          }
        }
      }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, { 
        text: 'Error: Could not generate the buttons. Please try again later.' 
      }, pageAccessToken);
    }
  }
};
