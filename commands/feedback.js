module.exports = {
  name: 'feedback',
  description: 'Collects user feedback on the usefulness of PageBot commands',
  usage: 'feedback',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, {
      attachment: {
        type: "template",
        payload: {
          template_type: "customer_feedback",
          title: "Rate your experience with Beluga",
          subtitle: "Let us know if Beluga commands are useful and effective by answering a few questions", 
          button_title: "Rate Experience", 
          feedback_screens: [
            {
              questions: [
                {
                  id: "rate_usefulness", 
                  type: "csat",
                  title: "How useful do you find Beluga command responses?", 
                  score_label: "neg_pos", 
                  score_option: "five_stars", 
                  follow_up: {
                    type: "free_form",
                    placeholder: "Provide additional feedback on the command issues or improvements"
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
