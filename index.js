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
const pageid = "100849055472459";
const PAGE_ACCESS_TOKEN = 'EAANTypknxAUBO3sH6YgqoekOJ5a3D0Ut4ZBQ4YZAMtrwRnV6RmYd9MDRpIP4WLZAnzC57nmemnyyDX4gJVKr3mt9ZBMB9iqVXlQkMXECwkLMOOZBdOXZC8SqWVP7hnKfTdgWaXDgDazcZBOBQyzHKFur45bGwaFAavPkPeL51NC2olmn0rzRGca4ZCVqGlZAWvzT7';

const commandList = [];
const descriptions = [];
const commands = new Map();

app.get('/webhook', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

function handlePostback(event) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;
  sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` });
}

function sendMessage(senderId, message) {
  if (!message || (!message.text && !message.attachment)) {
    return;
  }

  const payload = {
    recipient: { id: senderId },
    message: message.text ? { text: message.text } : { attachment: message.attachment }
  };

  request({
    url: 'https://graph.facebook.com/v21.0/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: payload,
  }, (error, response, body) => {
    if (error) {
      console.error('Error sending message:', error);
    } else if (response.body.error) {
      console.error('Response error:', response.body.error);
    }
  });
}

async function handleMessage(event) {
  const senderId = event.sender.id;
  const messageText = event.message?.text;

  if (!messageText) {
    sendMessage(senderId, { text: 'Invalid message format.' });
    return;
  }

  const args = messageText.split(' ');
  const commandName = args.shift().toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      await command.execute(senderId, args, PAGE_ACCESS_TOKEN, sendMessage, pageid);
    } catch (error) {
      sendMessage(senderId, { text: 'There was an error executing that command.' });
    }
  } else {
    sendMessage(senderId, {
      text: `Invalid command '${commandName}', please use help to see available commands.`
    });
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
    console.error('Error updating commands:', error);
  }
}

loadCommands();

async function publishPost(message, access_token) {
  return await new Promise(async (resolve, reject) => {
    const res = await axios.post(`https://graph.facebook.com/v21.0/me/feed`, 
    { message, access_token }, 
    { params: { access_token }, headers: { "Content-Type": "application/json" } });
    if (!res) reject();
    resolve(res.data);
  });
}

async function post() {
  console.log("Auto 1 Hour Post Enabled");
  const autoPost = cron.schedule(`0 */3 * * *`, async () => {
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

axios.post(`https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
  {
    get_started: { payload: "GET_STARTED" }
  },
  { headers: { "Content-Type": "application/json" } }
).then(() => {
  console.log('Get Started button set');
}).catch((error) => {
  console.error('Error setting Get Started button:', error);
});

const getStarted = async (send) => send({
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "Hello, I'm Yazbot and I am your assistant. Type 'help' for available commands.",
      buttons: [
        {
          type: "postback",
          title: "Commands",
          payload: "HELP"
        },
        {
          type: "postback",
          title: "About",
          payload: "ABOUT"
        },
        {
          type: "postback",
          title: "Prefix",
          payload: "PREFIX"
        }
      ]
    }
  }
});


async function getUserInfo(senderId, pageAccessToken) {
  try {
    const response = await axios.get(`https://graph.facebook.com/v14.0/${senderId}?access_token=${pageAccessToken}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function sendLevelUpMessage(senderId, pageAccessToken) {
  const userInfo = await getUserInfo(senderId, pageAccessToken);
  if (!userInfo) {
    console.error('User info could not be retrieved.');
    return;
  }

  const { name } = userInfo; // Extract user name
  const currentLvl = getRandomValue(1, 10);  // Random level between 1 and 10
  const currentRank = getRandomValue(1, 5);  // Random rank between 1 and 5
  const currentXP = getRandomValue(50, 200); // Random XP between 50 and 200
  const requiredXP = getRandomValue(500, 10000); // Random required XP

  const apiUrl = `https://api-canvass.vercel.app/rankcard?name=${encodeURIComponent(name)}&userid=${senderId}&currentLvl=${currentLvl}&currentRank=${currentRank}&currentXP=${currentXP}&requiredXP=${requiredXP}`;

  const messagePayload = {
    attachment: {
      type: 'image',
      payload: { url: apiUrl }
    }
  };

  try {
    await sendMessage(senderId, messagePayload, pageAccessToken);
    console.log(`Message sent to user ${senderId} with level ${currentLvl}!`);
  } catch (error) {
    console.error(`Failed to send message: ${error}`);
  }
}

async function sendMessage(recipientId, messagePayload, pageAccessToken) {
  try {
    await axios.post(`https://graph.facebook.com/v14.0/me/messages?access_token=${pageAccessToken}`, {
      recipient: { id: recipientId },
      message: messagePayload,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
