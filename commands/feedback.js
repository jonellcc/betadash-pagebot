module.exports = {
  name: 'feedback',
  description: 'Collects user feedback on Pagebotcommand usefullness',
  usage: 'feedback',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {

sendMessage(senderId, {
  attachment: {
    type: "template",
    payload: {
      template_type: "customer_feedback",
      title: "Rate your experience with PageBot",
      subtitle: "Let us know how Belugabot is performing by answering two questions", 
      button_title: "Rate Experience", 
      feedback_screens: [
        {
          questions: [
            {
              id: "rate_experience", 
              type: "csat",
              title: "How would you rate your experience with Belugabot command responses?", 
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
  }
};
