const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');
const path = require('path');
const axios = require('axios');
const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
const instagramLinkRegex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json'
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = 'shipazu';
const pageid = "61567757543707";
const admin = ["8786755161388846", "8376765705775283", "8552967284765085"];
const PAGE_ACCESS_TOKEN = "EAAOGSnFGWtcBO7Ftdp0C9fauNZBC3jhG8e1v3p32NAWrdQ9C8L1igMw98lkaZBPLsQr6WFxg5iVtfhyZCM8nZAmgZAaHreq075NIgu7KrgDrJh7HVXiwZCZAOFEtgYkisIlGCxYXct1DixR59h1dXKN0p18o4ZBGziT0MZA58g3NNi8At0Xcmw9hjW5V2EZCMx63nD7QZDZD";

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

const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}


async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.message || !event.sender.id) {
    console.error();
    return;
  }

  const senderId = event.sender.id;
  const messageText = event.message.text;
  let imageUrl = null;
  let jb = "More shoti";
  const dg = event.message.attachments &&
           (event.message.attachments[0]?.type === 'image' || event.message.attachments[0]?.type === 'video' || event.message.attachments[0]?.type === 'sticker' || event.message.attachments[0]?.type === 'audio');

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

  const args = messageText ? messageText.split(' ') : [];

const bannedKeywords = [
  'gay', 'pussy', 'dick', 'nude', 'xnxx', 'pornhub', 'hot', 'clothes', 'sugar', 'fuck', 'fucked', 'step',
  'shit', 'bitch', 'hentai', 'nigg', 'nigga', 'niga', 'sex', 'boobs', 'cute girl undressed', 'undressed', 
  'naked', 'underwear', 'sexy', 'panty', 'fuckers', 'fck', 'fucking', 'vagina', 'intercourse', 
  'penis', 'gae', 'panties', 'fellatio', 'blow job', 'blow', 'skin', 'segs', 'porn', 'loli', 'kantutan','lulu', 'kayat', 'bilat',
  'ahegao', 'dildo', 'vibrator', 'ass', 'asses', 'butt', 'asshole', 'cleavage', 'arse', 'dic', 'puss'
];

function escapeRegex(keyword) {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const containsBannedKeyword = bannedKeywords.some(keyword => {
  const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
  return pattern.test(args);
});

if (containsBannedKeyword) {
  await sendMessage(
    senderId,
    { text: '🚫 Your prompt contains inappropriate content. Please try again with a different prompt.' },
    pageAccessToken
  );
  return;
}

  const commandName = args.shift()?.toLowerCase();

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
      const kupall = {
     text: "❌ There was an error processing that command.
Type 'help' to see more useful commands",
    quick_replies: [
         {
          content_type: "text",
         title: "help",
         payload: "HELP"
        }
      ]
   };
    sendMessage(senderId, kupall, pageAccessToken);
    }
  } else if (!regEx_tiktok.test(messageText) && !facebookLinkRegex.test(messageText) && !instagramLinkRegex.test(messageText) && jb !== messageText && dg !== messageText)  {
    try {
      const apiUrl = `https://rest-api-production-5054.up.railway.app/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}`;
      const response = await axios.get(apiUrl, { headers });
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
    } catch (error) {
      console.error();
    }
  } else if (instagramLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Instagram, please wait...' }, pageAccessToken);
      const apiUrl = `https://betadash-search-download.vercel.app/insta?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const videoUrl = response.data.result[0]._url;

const head = await axios.head(videoUrl, { headers });
      const length = head.headers['content-length'];
      const size = length / (1024 * 1024);

      if (size > 25) {
        sendMessage(senderId, {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `Error: The Instagram video exceeds the 25 MB limit and cannot be sent\n\n𝗨𝗿𝗹: ${videoUrl}`,
            buttons: [
              {
                type: 'web_url',
                url: videoUrl,
                title: 'Watch Video'
              }
            ]
          }
        }
      }, pageAccessToken);
        return;
      } 

      if (videoUrl) {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
      console.error();
    }
  } else if (facebookLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Facebook, please wait...' }, pageAccessToken);
      const apiUrl = `https://betadash-search-download.vercel.app/fbdl?url=${encodeURIComponent(messageText)}`;

      if (apiUrl) {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: apiUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
      console.error();
    }
  } else if (regEx_tiktok.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Tiktok, please wait...' },  pageAccessToken);
      const response = await axios.post(`https://www.tikwm.com/api/`, { url: messageText }, { headers });
      const data = response.data.data;
      const shotiUrl = data.play;

/** const h = await axios.head(videoUrl);
      const lengths = h.headers['content-length'];
      const sizemb = lengths / (1024 * 1024);

  if (sizemb > 25) {
        sendMessage(senderId, {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `Error: The Tiktok video exceeds the 25 MB limit and cannot be sent\n\n𝗨𝗿𝗹: ${shotiUrl}`,
            buttons: [
              {
                type: 'web_url',
                url: shotiUrl,
                title: 'Watch Tiktok'
              }
            ]
          }
        }
      }, pageAccessToken);
        return;
      } **/

      sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: shotiUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    } catch (error) {
      console.error();
    }
  }

if (messageText && messageText.includes("More shoti")) {
  const shotiCommand = commands.get('shoti');
  if (shotiCommand) {
    await shotiCommand.execute(senderId, [], pageAccessToken, sendMessage, pageAccessToken);
  }
  return;
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