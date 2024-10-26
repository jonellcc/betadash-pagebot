const { sendMessage } = require('./kupal');

function kupal3(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  // Send a message back to the sender
  sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
}

module.exports = { kupal3 };