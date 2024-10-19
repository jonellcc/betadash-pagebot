const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

const commands = {
  gpt4: {
    name: 'gpt4',
    description: 'Ask a question to GPT-4',
    author: 'Cliff (rest api)',
    execute: (senderId, args, pageAccessToken, sendMessage) => {
      const prompt = args.join(' ');
      if (!prompt) {
        sendMessage(senderId, { text: 'Please provide a question first' }, pageAccessToken);
        return;
      }

      sendMessage(senderId, { text: '🔍 Searching, please wait....' }, pageAccessToken);

      const apiUrl = `https://betadash-api-swordslush.vercel.app/gpt-4-32k?ask=${encodeURIComponent(prompt)}`;

      axios.get(apiUrl)
        .then(response => {
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
        })
        .catch(error => {
          sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
          console.error('Error:', error);
        });
    }
  },

  help: {
    name: 'help',
    description: 'Displays the available commands',
    author: 'System',
    execute: (senderId, args, pageAccessToken, sendMessage) => {
      const commandList = Object.keys(commands).map(commandName => commands[commandName].name).join(', ');
      sendMessage(senderId, { text: `Available commands: ${commandList}` }, pageAccessToken);
    }
  },

  // Add more commands here as needed...
};

// Helper function to split messages into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

// Handle incoming messages
const handleMessage = (event, pageAccessToken) => {
  const senderId = event.sender.id;

  if (!event.message || !event.message.text) {
    sendMessage(senderId, { text: 'Invalid message format.' }, pageAccessToken);
    return;
  }

  const messageText = event.message.text;
  const args = messageText.split(' ');
  const commandName = args.shift().toLowerCase();

  if (commands[commandName]) {
    const command = commands[commandName];
    command.execute(senderId, args, pageAccessToken, sendMessage);
  } else {
    sendMessage(senderId, { text: `Invalid command '${commandName}', use 'help' to see available commands.` }, pageAccessToken);
  }
};

// Message sending function
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

  axios.post(`https://graph.facebook.com/v21.0/me/messages?access_token=${pageAccessToken}`, payload)
    .then(response => {
      if (response.data.error) {
        console.error('Error response:', response.data.error);
      }
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
};

const VERIFY_TOKEN = 'shipazu';
const PAGE_ACCESS_TOKEN = 'EAANTypknxAUBO3dfC9InqVvZBbLkWcNm7Qf2p6PdO0zb7eDIp05e4WfeIGWtAqVXNDk5amsJdmuV6ga9ZCHcnIKXjyVsVMZCsOds11eHdh1uAPEjZAZAfdNNMFn6tOQsoRhbZAnRmV3qPHH9pteYxeFiS9AJXt4NGnDZAZCGNZATGkWug4IIEfkKWlMEWkUznZAGBX';

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
