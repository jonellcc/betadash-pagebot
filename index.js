const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
const VERIFY_TOKEN = 'shipazu';
const pageid = "61567757543707";
const PAGE_ACCESS_TOKEN = "EAAVaXRD3OroBOykIvMUSZAq2YtwDTNoZBKxj4ipxTXnJBAFACyGambKZCU6ZBKPZAQexjuPbwpc4ZCc6gvIjZBT1Gz3UTjjnOGmvxilikIjohqKS9sQkzTnKLYKSAV2dgVZAtTxZCCkrFqG5ytr1IeDnZC3cjBdZCkwoZAHDUv7kZA9rbP6hhtm1s21vUXIeZA6RwryGDlsAZDZD";

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
        } else if (event.get_started) {
          getStarted((message) => sendMessage(event.sender.id, message));
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
        text: "Hello, I'm Yazbot and I am your assistant. Type 'help' for available commands"
      };
      sendMessage(senderId, welcomeMessage, pageAccessToken);
    } else {
      sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
    }
  } else {
    console.error('Invalid postback event data');
  }
}

function sendMessage(senderId, message, event, pageAccessToken, isTyping) {
  const sendTypingIndicator = async (isTyping) => {
    const senderAction = isTyping ? "typing_on" : "typing_off";
    const form = {
      recipient: {
        id: senderId,
      },
      sender_action: senderAction,
    };

    try {
      return await Graph(form);
    } catch (err) {
      return err;
    }
  };

  const Graph = (form) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `https://graph.facebook.com/v20.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
          form
        )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response ? err.response.data : err.message);
        });
    });
  };

  if (!message || (!message.text && !message.attachment)) {
    return;
  }

  sendTypingIndicator(isTyping);

  const payload = {
    recipient: { id: senderId },
    message: message.text ? { text: message.text } : { attachment: message.attachment }
  };

  request({
    url: 'https://graph.facebook.com/v21.0/me/messages',
    qs: { access_token: pageAccessToken },
    method: 'POST',
    json: payload,
  }, (error, response, body) => {
    if (error) {
      console.error('Error sending message');
    } else if (response.body.error) {
      console.error(response.body.error);
    }
  });

  const additionalMessage = {
    recipient: {
      id: senderId
    },
    message: message
  };

  const requestOptions = {
    method: 'POST',
    uri: `https://graph.facebook.com/v11.0/me/messages?access_token=${pageAccessToken}`,
    json: additionalMessage
  };

  request(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Message sent successfully');
    } else {
      console.error('Failed to send message:', error || body.error);
    }
  });

  sendTypingIndicator(false);
}

async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.message) {
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
      await command.execute(senderId, args, pageAccessToken, sendMessage, pageid);
    } catch (error) {
      sendMessage(senderId, { text: 'There was an error executing that command.' });
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

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      { commands: [{ locale: 'default', commands: commandsPayload }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log(response.data.result === 'success' ? 'Commands loaded!' : 'Failed to load commands');
  } catch (error) {
    console.error();
  }
}

loadCommands();

async function publishPost(message, pageAccesToken) {
  return await new Promise(async (resolve, reject) => {
    const res = await axios.post(`https://graph.facebook.com/v21.0/me/feed`, 
    { message, pageAccesToken }, 
    { params: { pageAccesToken }, headers: { "Content-Type": "application/json" } });
    if (!res) reject();
    resolve(res.data);
  });
}

async function post() {
  console.log("Auto 1 Hour Post Enabled");
  const autoPost = cron.schedule(`0 */5 * * *`, async () => {
    const { content, author } = (await axios.get(`https://api.realinspire.tech/v1/quotes/random`)).data[0];
    await publishPost(`💭 Remember...
${content}
-${author}
`, PAGE_ACCESS_TOKEN);
    console.log("Triggered autopost.");
  }, { scheduled: true, timezone: "Asia/Manila" });
  autoPost.start();
}

post();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});