const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./kupal');
const axios = require('axios');
const commands = new Map();
const lastImageByUser = new Map();
const lastVideoByUser = new Map();
const admin = ["8505900689447357", "8269473539829237", "7913024942132935"];

const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}


async function kupal(event, pageAccessToken) {
  if (!event || !event.sender || !event.sender.id) return;

  const senderId = event.sender.id;
  let imageUrl = null;
  let videoUrl = null;

  if (event.message && event.message.attachments) {
    const imageAttachment = event.message.attachments.find(att => att.type === 'image');
    const videoAttachment = event.message.attachments.find(att => att.type === 'video');

    if (imageAttachment) {
      imageUrl = imageAttachment.payload.url;
      lastImageByUser.set(senderId, imageUrl);
    }
    if (videoAttachment) {
      videoUrl = videoAttachment.payload.url;
      lastVideoByUser.set(senderId, videoUrl);
    }
  }

  if (event.message && event.message.text) {
    const messageText = event.message.text.trim();
    const words = messageText.split(' ');
    const commandName = words.shift().toLowerCase();
    const args = words;

    if (commandName === 'imgur') {
      const lastImage = lastImageByUser.get(senderId);
      const lastVideo = lastVideoByUser.get(senderId);

      if (lastImage || lastVideo) {
        try {
          const mediaToUpload = lastImage || lastVideo;
          await commands.get('imgur').execute(senderId, args, pageAccessToken, mediaToUpload, admin);

          if (lastImage) lastImageByUser.delete(senderId);
          if (lastVideo) lastVideoByUser.delete(senderId);
        } catch (error) {
          await sendMessage(senderId, { text: 'An error occurred while uploading the media to Imgur.' }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: 'Please send an image or video first and then use the "imgur" command.' }, pageAccessToken);
      }
      return;
    }
  }
}

async function getAttachments(mid, pageAccessToken) {
  if (!mid) throw new Error("No message ID provided.");

  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    throw new Error();
  }
}

module.exports = { kupal };
