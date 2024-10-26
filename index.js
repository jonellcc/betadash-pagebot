const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = 'shipazu';
const pageid = "61567757543707";
const admin = ["8786755161388846", "8376765705775283", "8552967284765085"];
const PAGE_ACCESS_TOKEN = "EAAVaXRD3OroBOZCfTh21aZBMyQvL93sHVvfAWIT7V06ngnzdpAZAp0Xonj8i217EtbKXay4snDZAW6bMA5zn5i3SDVmYxZCQbJfOx76ZCQBkO9ks5oLoArKIpgOLF4gqGbXiPjw9NebTD9PQRJlVfUZCN26YAKiyDZCLG3n4WtMgixFtuhH6uwAGbEAkvytXUZAEwlAZDZD";

const commandList = [];
const descriptions = [];
const commands = new Map();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "page.html"));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, "privacy.html"));
});

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
        } else if (event.sender.id) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
       } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        } else if (GET_STARTED_PAYLOAD) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;
if (senderId && payload) {
    if (payload === 'GET_STARTED_PAYLOAD') {
  const welcomeMessage = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "Hi {{user_first_name}}, welcome to our page!\nThank you for visiting. We hope you enjoy using our page bot. If you encounter any issues with commands, feel free to click below to contact the page owner for assistance.\nWe've received your message and appreciate you reaching out.",
      buttons: [
        {
          type: "web_url",
          url: "https://www.facebook.com/swordigo.swordslush",
          title: "Contact"
        },
        {
          type: "web_url",
          url: "https://m.me/swordigo.swordslush",
          title: "Message"
        }
      ]
    }
  }
};
sendMessage(senderId, welcomeMessage, pageAccessToken);
    } else {
       sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
    }
  } else {
    console.error();
  }
};

async function sendMessage(senderId, message, pageAccessToken) {
  if (!message || (!message.text && !message.attachment)) {
    console.error();
    return;
  }

  try {
    await axios.post(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      recipient: { id: senderId },
      sender_action: "typing_on"
    });

    const messagePayload = {
      recipient: { id: senderId },
      message: message.text ? { text: message.text } : { attachment: message.attachment }
    };

    if (message.text) {
      messagePayload.message.text = message.text;
    }

    if (message.attachment) {
      messagePayload.message.attachment = message.attachment;
    }

    if (message.quick_replies) {
      messagePayload.message.quick_replies = message.quick_replies;
    }

   if (event && event.sender && event.sender.id) {
    messagePayload.senderId = event.sender.id;
  }

    const res = await axios.post(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, messagePayload);

    await axios.post(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      recipient: { id: senderId },
      sender_action: "typing_off"
    });

    return res.data;
  } catch (error) {
    console.error();
  }
}


async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.message || !event.sender.id) {
    console.error();
    return;
  }

  const senderId = event.sender.id;
  const messageText = event.message.text;

  if (event.message && event.message.attachments) {
    const imageAttachment = event.message.attachments.find(att => att.type === 'image');
    if (imageAttachment) {
      imageUrl = imageAttachment.payload.url;
    }
  }

  if (event.message && event.message.reply_to && event.message.reply_to.mid) {
    try {
      imageUrl = await getAttachments(event.message.reply_to.mid, pageAccessToken); 
    } catch (error) {
      console.error();
    }
  }

  const args = messageText.split(' ');
  const commandName = args.shift().toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
     let imageUrl = '';

        if (event.message.reply_to && event.message.reply_to.mid) {
          try {
            imageUrl = await getAttachments(event.message.reply_to.mid, pageAccessToken);
          } catch (error) {
            imageUrl = '';
          }
        } else if (event.message.attachments && event.message.attachments[0]?.type === 'image') {
          imageUrl = event.message.attachments[0].payload.url;
        }
      await command.execute(senderId, args, pageAccessToken, sendMessage, event, imageUrl, pageid, admin, splitMessageIntoChunks);
    } catch (error) {
      sendMessage(senderId, {text: "There was an error executing that command"}, pageAccessToken);
    }
  } else {
    const apiUrl = `https://betadash-api-swordslush.vercel.app/gpt-4-turbo-2024-04-09?ask=${encodeURIComponent(messageText)}`;
    const response = await axios.get(apiUrl);
    const text = response.data.message;

    const maxMessageLength = 2000;
    if (text.length > maxMessageLength) {
      const messages = splitMessageIntoChunks(text, maxMessageLength);
      for (const message of messages) {
        sendMessage(senderId, { text: message }, pageAccessToken);
      }
    } else {
      sendMessage(senderId, { text }, pageAccessToken);
    } 
  }
}


async function getAttachments(mid, pageAccessToken) {
  if (!mid) {
    throw new Error("No message ID provided.");
  }

  try {
    const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
      params: { access_token: pageAccessToken }
    });

    if (data && data.data.length > 0 && data.data[0].image_data) {
      return data.data[0].image_data.url;
    } else {
      throw new Error("No image found in the replied message.");
    }
  } catch (error) {
    throw new Error("Failed to fetch attachments.");
  }
}


function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}



function loadCommands() {
  const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

  commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    const description = command.description || 'No description provided.';
    commandList.push(command.name);
    descriptions.push(description);
    console.log(`Command loaded: ${command.name}`);
  });

  updateMessengerCommands();
}

async function updateMessengerCommands() {
  const commandsPayload = commandList.map((name, index) => ({
    name,
    description: descriptions[index]
  }));

  try {
    const dataCmd = await axios.get(`https://graph.facebook.com/v21.0/me/messenger_profile`, {
      params: { fields: 'commands', access_token: PAGE_ACCESS_TOKEN }
    });

    if (dataCmd.data.data[0]?.commands.length === commandsPayload.length) {
      console.log('Commands not changed');
      return;
    }

    const response = await axios.post(`https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      { commands: [{ locale: 'default', commands: commandsPayload }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log(response.data.result === 'success' ? 'Commands loaded!' : 'Failed to load commands');
  } catch (error) {
    console.error();
  }
}

loadCommands();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

