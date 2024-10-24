const axios = require("axios");

module.exports = {
  name: "gemini",
  description: "Interact with Google Gemini for image recognition and text queries.",
  author: "Cliffvincent",
  async execute(senderId, sendMessage, args, pageAccessToken, splitMessageIntoChunks, event) {
    const queryPrompt = args.join(" ");

    if (!queryPrompt) {
      return sendMessage(senderId, { text: `Please enter your question!\n\nExample: gemini what is love?` }, pageAccessToken);
    }

    try {
      let imageUrl = "";

      if (event.message?.reply_to?.mid) {
        imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
      } 

      else if (event.message?.attachments && event.message.attachments[0]?.type === 'image') {
        imageUrl = event.message.attachments[0].payload.url;
      }

      const apiUrl = `https://joshweb.click/gemini`;
      const response = await handleImageRecognition(apiUrl, queryPrompt, imageUrl);
      const result = response.gemini;

      sendLongMessage(senderId, result, pageAccessToken);

    } catch (error) {
      sendMessage(senderId, { text: `Error: ${error.message || "Something went wrong."}` }, pageAccessToken);
    }
  }
};

async function handleImageRecognition(apiUrl, prompt, imageUrl) {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt,
      url: imageUrl || ""
    }
  });

  return data;
}

async function getRepliedImage(mid, pageAccessToken) {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    return "";
  }
}

function sendLongMessage(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;
  const delayBetweenMessages = 1000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    sendMessage(senderId, { text: messages[0] }, pageAccessToken);

    messages.slice(1).forEach((message, index) => {
      setTimeout(() => sendMessage(senderId, { text: message }, pageAccessToken), (index + 1) * delayBetweenMessages);
    });
  } else {
    sendMessage(senderId, { text }, pageAccessToken);
  }
}
