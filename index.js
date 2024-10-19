const express = require('express');
const fs = require('fs');
const request = require("request");
const path = require("path");

const app = express();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
}


function sendMessage(senderId, message, pageAccessToken) {
  if (!message || (!message.text && !message.attachment)) {
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

  request({
    url: 'https://graph.facebook.com/v21.0/me/messages',
    qs: { access_token: pageAccessToken },
    method: 'POST',
    json: payload,
  }, (error, response, body) => {
    if (error) {
    } else if (response.body.error) {     
    } else {
    }
  });
}


const commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

async function handleMessage(event, pageAccessToken) {
  const senderId = event.sender.id;

  if (!event.message || !event.message.text) {
    sendMessage(senderId, { text: 'Invalid message format.' }, pageAccessToken);
    return;
  }

  const messageText = event.message.text;

  const args = messageText.split(' ');
  const commandName = args.shift().toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      await command.execute(senderId, args, pageAccessToken, sendMessage);
    } catch (error) {
      sendMessage(senderId, { text: 'There was an error executing that command.' }, pageAccessToken);
    }
  } else {
    sendMessage(senderId, { text: `Invalid command '${commandName}' please use help to see the list of available commands` }, pageAccessToken);
  }
}

const VERIFY_TOKEN = 'shipazu';

const PAGE_ACCESS_TOKEN = "EAANTypknxAUBO3sH6YgqoekOJ5a3D0Ut4ZBQ4YZAMtrwRnV6RmYd9MDRpIP4WLZAnzC57nmemnyyDX4gJVKr3mt9ZBMB9iqVXlQkMXECwkLMOOZBdOXZC8SqWVP7hnKfTdgWaXDgDazcZBOBQyzHKFur45bGwaFAavPkPeL51NC2olmn0rzRGca4ZCVqGlZAWvzT7";

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
        } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});