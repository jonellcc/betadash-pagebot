const axios = require("axios");

module.exports = {
  name: 'feedback',
  description: 'Collects user feedback on Pagebot command usefulness',
  usage: 'feedback',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture.width(720).height(720).as(picture_large)&access_token=${pageAccessToken}`);
      const profileUrl = response.data.picture_large.data.url;
      const { name, id } = response.data;

      sendMessage(senderId, {
        attachment: {
          type: "template",
          payload: {
            template_type: "customer_feedback",
            title: `Rate your experience with ${name}`,
            subtitle: `Let us know how ${name}bot is performing by answering all questions`,
            button_title: "Rate Experience",
            feedback_screens: [
              {
                questions: [
                  {
                    id: "rate_experience",
                    type: "csat",
                    title: `How would you rate your experience with ${name}bot command responses?`,
                    score_label: "neg_pos",
                    score_option: "five_stars",
                    follow_up: {
                      type: "free_form",
                      placeholder: "Provide additional feedback about the issues or commands"
                    }
                  }
                ]
              }
            ],
            business_privacy: {
              url: "https://betadash-pagebot-production.up.railway.app/privacy"
            },
            expires_in_days: 3
          }
        }
      }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, {text: error.message}, pageAccessToken);
    }
  }
};
