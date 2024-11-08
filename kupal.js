const axios = require('axios');

async function typingIndicator(senderId, pageAccessToken) {
  try {
    await axios.post(`https://graph.facebook.com/v13.0/me/messages`, {
      recipient: { id: senderId },
      sender_action: 'typing_on',
    }, {
      params: { access_token: pageAccessToken },
    });

    await axios.post(`https://graph.facebook.com/v13.0/me/messages`, {
      recipient: { id: senderId },
      sender_action: 'typing_off',
    }, {
      params: { access_token: pageAccessToken },
    });

  } catch (error) {
  }
}

async function sendMessage(senderId, message, pageAccessToken, mid = null) {
  if (!message || (!message.text && !message.attachment)) {
    console.error('Error: Message must provide valid text or attachment.');
    return;
  }

  const payload = {
    recipient: { id: senderId },
    message: {}
  };

  if (message.text) {
    payload.message.text = message.text;
  }

  if (message.attachment) {
    payload.message.attachment = message.attachment;
  }

  if (message.quick_replies) {
    payload.message.quick_replies = message.quick_replies;
  }

  await typingIndicator(senderId, pageAccessToken);

  try {
    const response = await axios.post(`https://graph.facebook.com/v13.0/me/messages`, payload, {
      params: { access_token: pageAccessToken },
    });
    if (response.data.error) {
    } else {
    }
  } catch (error) {
  }
}

module.exports = { sendMessage, typingIndicator };
