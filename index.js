const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require("request");
const path = require("path");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

const handlePostback = (event, pageAccessToken) => {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
};

const sendMessage = (senderId, message, pageAccessToken) => {
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
      console.error('Error sending message:', error);
    } else if (response.body.error) {
      console.error('Error response from API:', response.body.error);
    }
  });
};

const commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

const handleMessage = (event, pageAccessToken) => {
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
    command.execute(senderId, args, pageAccessToken, sendMessage)
      .catch(error => {
        sendMessage(senderId, { text: 'There was an error executing that command.' }, pageAccessToken);
        console.error('Error executing command:', error);
      });
  } else {
    sendMessage(senderId, { text: `Invalid command '${commandName}' please use help to see the list of available commands` }, pageAccessToken);
  }
};

const VERIFY_TOKEN = 'shipazu';
const PAGE_ACCESS_TOKEN = "EAANTypknxAUBO3dfC9InqVvZBbLkWcNm7Qf2p6PdO0zb7eDIp05e4WfeIGWtAqVXNDk5amsJdmuV6ga9ZCHcnIKXjyVsVMZCsOds11eHdh1uAPEjZAZAfdNNMFn6tOQsoRhbZAnRmV3qPHH9pteYxeFiS9AJXt4NGnDZAZCGNZATGkWug4IIEfkKWlMEWkUznZAGBX";

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
