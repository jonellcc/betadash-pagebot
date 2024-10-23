const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

const VERIFY_TOKEN = 'shipazu';
const pageid = "61567757543707";
const admin = ["8786755161388846", "8376765705775283", "8552967284765085"];
const PAGE_ACCESS_TOKEN = "EAAVaXRD3OroBOzAUk3nzG3HtZCIvZAZCDZApssrjsZBi1HfKZB2O4ZBvZBRbnsVHLJJGjjFuZC4Gpcu2QKIsCHyjmNdQNUDid2CZABCgJ2ZC4ZAVNX6lgXnezWfI7sXboGYm9o26yFf0fujeTC6BnUOnkQvPJ8AHV6s31Oh4LjedRE5bquqLN0t9HXgBpngPru6GPA7EJQZDZD";

const commandList = [];
const descriptions = [];
const commands = new Map();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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
          handleMessage(event);
        } else if (event.sender.id) {
          handleMessage(event);
        } else if (event.postback) {
          handlePostback(event);
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
  sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
}


async function getAttachments(mid, pageAccessToken) {
  if (!mid) throw new Error("No message ID provided.");

  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    throw new Error("No image found in the replied message.");
  }
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}


async function sendMessage(senderId, message pageAccesToken) {
  try {
    await axios.post(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      recipient: { id: senderId },
      sender_action: "typing_on"
    });

    const messagePayload = {
      recipient: { id: senderId },
      message: message.text ? { text: message.text } : { attachment: message.attachment }
    };

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

if (!messageText) {
    sendMessage(senderId, { text: 'No message text provided.' });
    return;
  }

  const args = messageText.split(' ');
  const commandName = args.shift().toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      await command.execute(senderId, args, pageAccessToken, sendMessage, getAttachments, pageid, admin);
    } catch (error) {
      sendMessage(senderId, {text: "There was an error executing that command"}, pageAccesToken);
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

function loadCommands() {
  const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

  commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    const description = command.description || 'No description provided.';
    commandList.push(command.name);
    descriptions.push(description);
    console.log(`${command.name} loaded`);
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

const form = {
  get_started: {
    payload: "GET_STARTED_PAYLOAD"
  },
  greeting: [
    {
      locale: "default",
      text: "Hello, I'm Yazbot! Your friendly AI assistant, here to help with questions, tasks, and more. I'm constantly learning and improving. What's on your mind today?"
    }
  ]
};

function setupMessengerProfile(pageAccessToken) {
  const requestBody = {
    get_started: form.get_started,
    greeting: form.greeting
  };

  const requestOptions = {
    method: 'POST',
    uri: `https://graph.facebook.com/v11.0/me/messenger_profile?access_token=${pageAccessToken}`,
    json: requestBody
  };

  request(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Messenger profile setup successful');
    } else {
      console.error();
    }
  });
}

setupMessengerProfile();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});