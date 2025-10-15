const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config.json");
const fs = require('fs');
const path = require('path');
const fonts = require('fontstyles');
const axios = require('axios');
const regEx_tiktok = /^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)\/.+$/;
const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
const instagramLinkRegex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
const youtubeLinkRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const spotifyLinkRegex = /^https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+(\?.*)?$/;
const soundcloudRegex = /^https?:\/\/soundcloud\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)(?:\/([a-zA-Z0-9-]+))?(?:\?.*)?$/;
const capcutLinkRegex = /https:\/\/www\.capcut\.com\/t\/[A-Za-z0-9]+/;
const redditVideoRegex = /https:\/\/www\.reddit\.com\/r\/[A-Za-z0-9_]+\/comments\/[A-Za-z0-9]+\/[A-Za-z0-9_]+\/?/;
const snapchatRegex = /https?:\/\/(www\.)?snapchat\.com\/spotlight\/[A-Za-z0-9_-]+/i;

function agent() {
    const chromeVersion = `${Math.floor(Math.random() * 6) + 130}.0.0.0`;
    const oprVersion = `${Math.floor(Math.random() * 5) + 86}.0.0.0`;
    return `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Mobile Safari/537.36 OPR/${oprVersion}`;
}

const headers = {
    'User-Agent': agent()
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const hljs = require('highlight.js');

const themes = [
  "monokai",
  "github-dark-dimmed",
  "github-dark",
  "night-owl"
];

const randomTheme = themes[Math.floor(Math.random() * themes.length)];

app.use('/commands/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'commands', filename);

fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }


      const lines = data.split('\n').length;
      const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');

      const highlightedCode = hljs.highlightAuto(data).value;

      const htmlResponse = `
<html>
  <head>
    <title>${filename}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="canonical" href="https://hastebin.skyra.pw">
        <meta name="url" content="https://hastebin.skyra.pw">
        <meta name="identifier-URL" content="https://hastebin.skyra.pw">
        <meta name="shortlink" content="https://hastebin.skyra.pw">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="keywords" content="haste, bin, skyra, hastebin, paste, pastebin">
        <meta name="subject" content="Hastebin for developers, by developers.">
        <meta name="robots" content="archive,follow,imageindex,index,odp,snippet,translate">
        <meta name="googlebot" content="index,follow">
        <meta name="author" content="Skyra Project, contact@skyra.pw">
        <meta name="owner" content="Skyra Project, contact@skyra.pw">
        <meta name="designer" content="Skyra Project, contact@skyra.pw">
        <meta name="reply-to" content="contact@skyra.pw">
        <meta name="target" content="all">
        <meta name="audience" content="all">
        <meta name="coverage" content="Worldwide">
        <meta name="distribution" content="Global">
        <meta name="rating" content="safe for kids">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="HandheldFriendly" content="True">
        <meta name="apple-mobile-web-app-title" content="Hastebin">
        <meta name="application-name" content="Hastebin">
        <meta name="msapplication-TileColor" content="#282C34">
        <meta name="msapplication-TileImage" content="https://paste.code-solutions.dev/seo/mstile-144x144.png">
        <meta name="msapplication-config" content="https://paste.code-solutions.dev/seo/browserconfig.xml">
        <meta name="revisit-after" content="7 days">
        <meta property="og:email" content="contact@skyra.pw">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta http-equiv="Expires" content="1y">
        <meta http-equiv="Pragma" content="1y">
        <meta http-equiv="Cache-Control" content="1y">
        <meta http-equiv="Page-Enter" content="RevealTrans(Duration=2.0,Transition=2)">
        <meta http-equiv="Page-Exit" content="RevealTrans(Duration=3.0,Transition=12)">
        <link rel="apple-touch-icon" sizes="180x180" href="https:initializeMessengerProfileeMessengerProfileeMessengerProfileode-solutions.dev/seo/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="192x192" href="https://paste.code-solutions.dev/seo/android-chrome-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="https://paste.code-solutions.dev/seo/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="https://paste.code-solutions.dev/seo/favicon-16x16.png">
        <link rel="manifest" href="https://paste.code-solutions.dev/seo/site.webmanifest">
        <link rel="shortcut icon" href="https://paste.code-solutions.dev/seo/favicon.ico">
        <link rel="apple-touch-startup-image" href="https://paste.code-solutions.dev/seo/apple-startup.png">
        <meta name="theme-color" content="#282C34">
        <link rel="mask-icon" href="https://paste.code-solutions.dev/seo/safari-pinned-tab.svg" color="#1e88e5">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${randomTheme}.min.css">
        <script type="module" crossorigin src="https://paste.code-solutions.dev/assets/index.js"></script>
        <style>
          body { font-family: 'Fira Code', monospace; background-color: #282C34; color: #ffffff; }
          #linenos { float: left; padding-right: 10px; text-align: right; color: #888; }
          pre { background: #1e1e1e; padding: 10px; border-radius: 5px; overflow-x: auto; }
          code { font-family: 'Fira Code', monospace; }
        </style>
      </head>
      <body>
<div id="linenos">${lineNumbers}</div>
        <pre class="hljs"><code>${highlightedCode}</code></pre>
        </body>
      </html>`;
      res.send(htmlResponse);
    });
  });
});


const PORT = process.env.PORT || 8080;

/** const VERIFY_TOKEN = config.VERIFY_TOKEN;
const admin = config.ADMINS;
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN; **/ const commandList = [];
const descriptions = [];
const commands = new Map(); 


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "page.html"));
});

app.get('/sessions', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "session.html"));
});



/** 

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

  if (body.object === 'page' && Array.isArray(body.entry)) {
    body.entry.forEach(entry => {
      if (!Array.isArray(entry.messaging)) return;

      entry.messaging.forEach(event => {
        if (event.message) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
        } else if (event.sender.id) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
       } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        } else if (event, PAGE_ACCESS_TOKEN) {
          handlePayload(event, PAGE_ACCESS_TOKEN);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
}); **/


const PAGE_ACCESS_TOKEN = config.main.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = config.main.VERIFY_TOKEN;
const ADMINS = config.main.ADMINS;

let sessions = config.sessions || [];

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

  if (body.object === 'page' && Array.isArray(body.entry)) {
    body.entry.forEach(entry => {
      if (!Array.isArray(entry.messaging)) return;

      const sessionTokens = sessions
        .filter(s => s.pageid === entry.id)
        .map(s => s.PAGE_ACCESS_TOKEN);

      if (!sessionTokens.includes(PAGE_ACCESS_TOKEN)) {
 sessionTokens.push(PAGE_ACCESS_TOKEN);
      }

      entry.messaging.forEach(event => { 
        sessionTokens.forEach(token => {
          if (event?.message) {
            handleMessage(event, token);
          } else if (event.postback && event.postback.payload === "GET_STARTED_PAYLOAD") {
            WelcomeMessage(event, token);
          } else if (event.response_feedback) {
            handleFeedback(event, event.response_feedback, token);
          } else if (event.reaction) {
            handleReaction(event, event.reaction, token);
          } else if (event.sender.id) {
            handleMessage(event, token);
          }
        });
      });
    });     res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.get('/privacy', (req, res) => {
  const pageid = req.query.pageid;
  const filePath = path.join(__dirname, 'privacy', `${pageid}.html`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Privacy policy not found.');
  }
});

app.get('/create', async (req, res) => {
  try {
  const { pageAccessToken, adminid } = req.query;

  if (!pageAccessToken || !adminid) {
    return res.status(400).json({ error: `Missing parameters is required 'pageAccessToken','adminid`, Usage: "/create?pageAccessToken=EAAUGH....&adminid=1080...." });
  }

      if (!pageAccessToken.startsWith("EAA")) {
      return res.status(400).json({ error: 'Invalid pageAccessToken' });
    }

    const response = await axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${pageAccessToken}`);
    const { name, id } = response.data;
    const prof = `https://graph.facebook.com/${id}/picture?height=720&width=720`;
    const existingSession = sessions.find(session => session.pageid === id);
    if (existingSession) {
      return res.status(409).json({ error: 'Session already exists for this pageid' });
    }

      const newSession = {
        name: name,
        profileUrl: prof,
        PAGE_ACCESS_TOKEN: pageAccessToken,
        pageid: id,
        adminid: adminid
      };

      sessions.push(newSession);
      saveConfig();

      res.status(200).json({ message: 'Session added successfully', session: newSession });
    } catch (error) {
      res.status(500).json({ error: 'Invalid pageAccessToken or unable to fetch page details' });
   }
  });

app.get('/delete', (req, res) => {
  const { username, password, pageid } = req.query;

  if (username !== 'yazky' || password !== 'autopagebotvz') {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  if (!pageid) {
    return res.status(400).json({ error: 'Missing required parameter: pageid' });
  }

  const initialLength = sessions.length;
  sessions = sessions.filter(session => session.pageid !== pageid);

  if (sessions.length === initialLength) {
    return res.status(404).json({ error: 'Page ID not found' });
  }

  saveConfig();
  res.status(200).json({ message: 'Session deleted successfully', pageid });
});


  function saveConfig() {
  const updatedConfig = { main: { PAGE_ACCESS_TOKEN, VERIFY_TOKEN, ADMINS }, sessions };
  fs.writeFileSync('./config.json', JSON.stringify(updatedConfig, null, 2));
  }

app.get('/session', (req, res) => {
  const maskedMain = {
    NAME: config.main.Name,
    profileUrl: config.main.profileUrl,
    PAGE_ACCESS_TOKEN: config.main.PAGE_ACCESS_TOKEN
      ? config.main.PAGE_ACCESS_TOKEN.substring(0, 4) + "****************************************************************************************************************************************************************"
      : "****************************************************************************************************************************************************************",
    WEBHOOK: config.main.webhook,
    VERIFY_TOKEN: config.main.VERIFY_TOKEN,
    PAGEID: config.main.PAGEID,
    ADMINS: config.main.ADMINS
  };

  const maskedSessions = sessions.map(session => ({
    NAME: session.name,
    ProfileUrl: session.profileUrl, PAGE_ACCESS_TOKEN: session.PAGE_ACCESS_TOKEN
      ? session.PAGE_ACCESS_TOKEN.substring(0, 4) + "****************************************************************************************************************************************************************"
      : "****************************************************************************************************************************************************************",
    PAGEID: session.pageid,
    ADMINID: session.adminid
  }));

  res.status(200).json({
    main: maskedMain,
    session: maskedSessions
  });
});


async function handlePayload(event, pageAccessToken) {
  const payload = event.postback.payload;
  const senderId = event.sender.id;
sendMessage(senderId, { text: payload }, pageAccessToken);
}

async function profileM() {
  const url = `https://graph.facebook.com/v23.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;
  const response = await axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${PAGE_ACCESS_TOKEN}`);
  const { name, id } = response.data;
  const payload = {
    get_started: { payload: "GET_STARTED_PAYLOAD" },
    greeting: [
      {
        locale: "default",
        text: `Hello, {{user_first_name}}! I'm ${fonts.bold(name)}! Your friendly AI assistant, here to help with questions, tasks, and more.`
      }
    ]
  };

  await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

profileM();

async function sendMessage(senderId, message, pageAccessToken) {
    if (!message || (!message.text && !message.attachment)) {
        console.error();
        return;
    }    

    try {
        await axios.post('https://graph.facebook.com/v23.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'mark_seen'
        }, {
            params: { access_token: pageAccessToken }
        });

        await axios.post('https://graph.facebook.com/v23.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'typing_on'
        }, {
            params: { access_token: pageAccessToken }
        });

        const messagePayload = {
            recipient: { id: senderId },
            messaging_type: "RESPONSE",
            message: {},
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

        await axios.post('https://graph.facebook.com/v23.0/me/messages', messagePayload, {
            params: { access_token: pageAccessToken }
        });

        await axios.post('https://graph.facebook.com/v23.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'typing_off'
        }, {
            params: { access_token: pageAccessToken }
        });
    } catch (error) {
        console.error();
    }
}


async function WelcomeMessage(event, pageAccessToken) {
if (event.postback && event.postback.payload === "GET_STARTED_PAYLOAD") {
    const response = await axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${pageAccessToken}`
    );
    const { name, id } = response.data;

    const kumag = {
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: `𝖧𝖾𝗅𝗅𝗈, 𝖨'𝗆 ${fonts.bold(name.toUpperCase())}! 𝖸𝗈𝗎𝗋 𝖿𝗋𝗂𝖾𝗇𝖽𝗅𝗒 𝖠𝖨 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝗍, 𝗁𝖾𝗋𝖾 𝗍𝗈 𝗁𝖾𝗅𝗉 𝗐𝗂𝗍𝗁 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌, 𝗍𝖺𝗌𝗄𝗌, 𝖺𝗇𝖽 𝗆𝗈𝗋𝖾. 𝖨'𝗆 𝖼𝗈𝗇𝗌𝗍𝖺𝗇𝗍𝗅𝗒 𝗅𝖾𝖺𝗋𝗇𝗂𝗇𝗀 𝖺𝗇𝖽 𝗂𝗆𝗉𝗋𝗈𝗏𝗂𝗇𝗀, 𝗌𝗈 𝗉𝗅𝖾𝖺𝗌𝖾 𝖻𝖾𝖺𝗋 𝗐𝗂𝗍𝗁 𝗆𝖾 𝗂𝖿 𝖾𝗏𝖾𝗋 𝖨 𝗆𝖺𝗄𝖾 𝖺𝗇𝗒 𝗆𝗂𝗌𝗍𝖺𝗄𝖾𝗌. 𝖨'𝗆 𝖾𝗑𝖼𝗂𝗍𝖾𝖽 𝗍𝗈 𝗐𝗈𝗋𝗄 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎 𝖺𝗇𝖽 𝗆𝖺𝗄𝖾 𝗒𝗈𝗎𝗋 𝖽𝖺𝗒 𝖺 𝗅𝗂𝗍𝗍𝗅𝖾 𝖻𝗋𝗂𝗀𝗁𝗍𝖾𝗋.\n\n𝖳𝗒𝗉𝖾 '𝗁𝖾𝗅𝗉' 𝖻𝖾𝗅𝗈𝗐 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌`,
                buttons: [
                    {
                        type: "web_url",
                        url: `https://www.facebook.com/${id}`,
                        title: "𝖫𝖨𝖪𝖤/𝖥𝖮𝖫𝖫𝖮𝖶"
                    }
                ]
            }
        },
        quick_replies: [
            {
                content_type: "text",
                title: "Help",
                payload: "HELP"
            },
            {
                content_type: "text",
                title: "Privacy Policy",
                payload: "PRIVACY_POLICY"
            },
            {
                content_type: "text",
                title: "Feedback",
                payload: "FEEDBACK"
            }
        ]
    };

    await sendMessage(event.sender.id, kumag, pageAccessToken);
  }
}


const isValidUrl = (url) => {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/; 
  return regex.test(url);
};

async function getImage(mid) {
  if (!mid) return;

  try {
    const { data } = await axios.get(`https://graph.facebook.com/v23.0/${mid}/attachments`, {
      params: { access_token: `${PAGE_ACCESS_TOKEN}` }
    });

    if (data && data.data.length > 0) {
      const attachments = data.data.map((attachment) => {
  if (attachment.image_data && isValidUrl(attachment.image_data.url)) return attachment.image_data.url;
  if (attachment.video_data && isValidUrl(attachment.video_data.url)) return attachment.video_data.url;
  if (attachment.animated_image_data && isValidUrl(attachment.animated_image_data.url)) return attachment.animated_image_data.url;
  if (attachment.file_url && isValidUrl(attachment.file_url)) return attachment.file_url;
  return null;
});
      return attachments.filter(Boolean);
    }
  } catch (error) {    
  }
}

async function getAttachments(mid) {
    if (!mid) return;

    try {
      const { data } = await axios.get(`https://graph.facebook.com/v23.0/${mid}/attachments`, {
        params: { access_token: `${PAGE_ACCESS_TOKEN}` }
     });

      if (data && data.data.length > 0) {
        const attachment = data.data[0];

        if (attachment.image_data) return attachment.image_data.url;
        if (attachment.video_data) return attachment.video_data.url;
        if (attachment.animated_image_data) return attachment.animated_image_data.url;
   if (attachment.file_url) return attachment.file_url;    
      }
    } catch (error) {
    }
  }

  function formatFont(text) {
      const fontMapping = {
        A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛",
        I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣",
        Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫",
        Y: "𝗬", Z: "𝗭", a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳",
        g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻",
        o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃",
        w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
      };

      return text
        .split("")
        .map((char) => fontMapping[char] || char)
        .join("");
    }


const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

const fontMapping = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
    return text.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (match, boldText, h2Text, h3Text) => {
        const targetText = boldText || h2Text || h3Text;
        return [...targetText].map(char => fontMapping[char] || char).join('');
    });
}

const font = (text) => [...text].map(c => fontMapping[c] || c).join('');  

async function getMessage(mid) {
  return await new Promise(async (resolve, reject) => {
    if (!mid) resolve(null);
    await axios.get(`https://graph.facebook.com/v22.0/${mid}?fields=message&access_token=${PAGE_ACCESS_TOKEN}`).then(data => {
      resolve(data.data.message);
    }).catch(err => {
    });
  });
}

async function handleFeedback(event, feedback, pageAccessToken) {
    let responseText = feedback.feedback === "Good response"
        ? "𝖳𝗁𝖺𝗇𝗄𝗌 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝖿𝖾𝖾𝖽𝖻𝖺𝖼𝗄! 😊"
        : "𝖲𝗈𝗋𝗋𝗒 𝖺𝖻𝗈𝗎𝗍 𝗍𝗁𝖺𝗍! 𝖶𝖾'𝗅𝗅 𝗍𝗋𝗒 𝗍𝗈 𝗂𝗆𝗉𝗋𝗈𝗏𝖾.";

    await sendMessage(event.sender.id, { text: responseText }, pageAccessToken);
}

async function handleReaction(event, reaction, pageAccessToken) {
    if (reaction.action !== 'react') {
        return;
    }

    const reactionMap = {
        '❤': 'heart',
        '👍': 'like',
        '😆': 'haha',
        '😮': 'wow',
        '😢': 'sad',
        '😡': 'angry',
        '🥰': 'enlove',
        '😭': 'cry'
    };

    const reactionType = reactionMap[reaction.emoji] || 'other';

    const responseText = {
        text: `𝖳𝗁𝖺𝗇𝗄𝗌 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇: ${reaction.emoji} (${reactionType})`
    };

    await sendMessage(event.sender.id, responseText, pageAccessToken);
}



async function handleMessage(event, pageAccessToken) {
    if (!event || !event.sender || !event.message || !event.sender.id) {
        return;
    } 

if (!config.selfListen && event?.message?.is_echo) return;

if (event?.message?.is_echo) {
  event.sender.id = event.recipient.id;
}

const senderId = event.sender.id;
const messageText = event.message.text;
const msgj = messageText || "Describe or answer this";
const payloadData = event.postback?.payload;
const haha = "More shoti";
const messageId = event.message.mid;
const If = "aidetect";
const j = "humanize";
const x = "\uD83D\uDC4D";
const fac = "faceswap";
const khz = "ghibli";
/** const k = "U+1F44D";

const thb = await getAttachments(k); **/
  
let content = "";

if (event.message && event.message.reply_to) {
content = await getMessage(event.message.reply_to.mid);
}
const cleanContent = content.replace(/[✦✧⟡] \| 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛 𝟭\.𝟱|━━━━━━━━━━━━━/g, "").trim();
const combinedContent = cleanContent ? `${msgj} ${msgj}` : msgj;

let imageUrl = '';

if (event.message && event.message.attachments) {
    imageUrl = event.message.attachments[0].payload.url || null;
  }

  if (event.message && event.message.reply_to && event.message.reply_to.mid) {
    try {
      imageUrl = await getAttachments(event.message.reply_to.mid);
    } catch (error) {
      imageUrl = ''; 
    }
  }

let yawa1 = '';
let yawa2 = '';

if (event.message && event.message.attachments) {
  if (event.message.attachments[0]) {
    yawa1 = event.message.attachments[0].payload.url;
  }
  if (event.message.attachments[1]) {
    yawa2 = event.message.attachments[1].payload.url;
  }
}

if (event.message && event.message.reply_to && event.message.reply_to.mid) {
  try {
    const attachmentUrls = await getImage(event.message.reply_to.mid);
    if (attachmentUrls.length > 0) yawa1 = attachmentUrls[0];
    if (attachmentUrls.length > 1) yawa2 = attachmentUrls[1];
  } catch (error) {
  }
}

  const args = messageText ? messageText.split(' ') : [];

const bannedKeywords = [
  'pussy', 'dick', 'nude',  'hot', 'clothes', 'sugar', 'fucked', 'step',
  'shit', 'bitch', 'hentai', 'sex', 'boobs', 'cute girl undressed', 'undressed', 
  'naked', 'underwear', 'sexy', 'panty', 'fuckers', 'fck', 'fucking', 'vagina', 'intercourse', 
  'penis', 'gae', 'panties', 'fellatio', 'blow job', 'blow', 'segs', 'porn', 'loli', 'kantutan','lulu', 'kayat', 'bilat',
  'ahegao', 'dildo', 'vibrator', 'asses', 'butt', 'asshole', 'cleavage', 'arse', 'dic', 'puss'
];

function escapeRegex(keyword) {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const containsBannedKeyword = bannedKeywords.some(keyword => {
  const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
  return pattern.test(commands + args);
});

if (containsBannedKeyword) {
  await sendMessage(
    senderId,
    { text: '🚫 𝖸𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖽𝖾𝗍𝖾𝖼𝗍𝖾𝖽 𝖡𝖺𝖽𝗐𝗈𝗋𝖽𝗌 𝗂𝗍 𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝗌 𝗂𝗇𝖺𝗉𝗉𝗋𝗈𝗉𝗋𝗂𝖺𝗍𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗐𝗂𝗍𝗁 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗉𝗋𝗈𝗆𝗉𝗍',
    quick_replies: [
    {
      content_type: "text",
      title: "Feedback",
      payload: "FEEDBACK"
    },
    {
      content_type: "text",
      title: "Privacy Policy",
      payload: "PRIVACY_POLICY"
    }
   ]
  },
   pageAccessToken
  );
  return;
}






if (messageText && messageText.toLowerCase().startsWith("removebg")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to Remove background image" }, pageAccessToken);
      return;
    }     
        const bg = `https://ccprojectapis.ddns.net/api/removebg?url=${encodeURIComponent(imageUrl)}`;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: bg } } }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


 if (messageText && messageText.toLowerCase().startsWith("recognize")) {
    try {
   if (!imageUrl) {
      sendMessage(senderId, { text: "Reply to a short audio or video" }, pageAccessToken);
      return;
    }     

   const res = await axios.get(`https://yt-video-production.up.railway.app/recognize?fileUrl=${encodeURIComponent(imageUrl)}`
    );

    const metadata = res.data.track.sections.find(section => section.type === "SONG").metadata;
    const album = metadata.find(item => item.title === "Album")?.text || "Unknown Album";
    const label = metadata.find(item => item.title === "Label")?.text || "Unknown Label";
    const released = metadata.find(item => item.title === "Released")?.text || "Unknown Year"; 
    const text = res.data.track.share.subject;
    const images = res.data.track.sections[0].metapages.map((page) => page.image);
    const audioUrl = res.data.track.hub.actions[1].uri;
    const info = `𝗧𝗶𝘁𝗹𝗲: ${res.data.track.title}\n𝗔𝗿𝘁𝗶𝘀𝘁: ${res.data.track.subtitle}\n𝗔𝗹𝗯𝘂𝗺: ${album}\n𝗟𝗮𝗯𝗲𝗹: ${label}\n𝗥𝗲𝗹𝗲𝗮𝘀𝗲𝗱: ${released}`;
    sendMessage(senderId, {text: info}, pageAccessToken);
    await sendMessage(senderId, { attachment: { type: 'audio', payload: { url: audioUrl } } }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.toLowerCase().startsWith("faceswap")) {
  try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply with two image to combine face" }, pageAccessToken);
      return;
    }     
    const imgurApiUrl1 = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(yawa1)}`;
    const imgurResponse1 = await axios.get(imgurApiUrl1, { headers });
    const imgurLink1 = imgurResponse1.data.url;

    const imgurApiUrl2 = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(yawa2)}`;
    const imgurResponse2 = await axios.get(imgurApiUrl2, { headers });
    const imgurLink2 = imgurResponse2.data.url;

    const bg = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/faceswap?targetUrl=${encodeURIComponent(imgurLink1)}&swapUrl=${encodeURIComponent(imgurLink2)}`);
    await sendMessage(senderId, { attachment: { type: 'image', payload: { url: bg.data.result } } }, pageAccessToken);
  } catch (error) {
    sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.toLowerCase().startsWith("Get started")) {
  try {
const response = await axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${pageAccessToken}`);
    const { name, id } = response.data;
    const kumag = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: `𝖧𝖾𝗅𝗅𝗈, 𝖨'𝗆 ${fonts.bold(name.toUpperCase())}! 𝖸𝗈𝗎𝗋 𝖿𝗋𝗂𝖾𝗇𝖽𝗅𝗒 𝖠𝖨 𝖺𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝗍, 𝗁𝖾𝗋𝖾 𝗍𝗈 𝗁𝖾𝗅𝗉 𝗐𝗂𝗍𝗁 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌, 𝗍𝖺𝗌𝗄𝗌, 𝖺𝗇𝖽 𝗆𝗈𝗋𝖾. 𝖨'𝗆 𝖼𝗈𝗇𝗌𝗍𝖺𝗇𝗍𝗅𝗒 𝗅𝖾𝖺𝗋𝗇𝗂𝗇𝗀 𝖺𝗇𝖽 𝗂𝗆𝗉𝗋𝗈𝗏𝗂𝗇𝗀, 𝗌𝗈 𝗉𝗅𝖾𝖺𝗌𝖾 𝖻𝖾𝖺𝗋 𝗐𝗂𝗍𝗁 𝗆𝖾 𝗂𝖿 𝖾𝗏𝖾𝗋 𝖨 𝗆𝖺𝗄𝖾 𝖺𝗇𝗒 𝗆𝗂𝗌𝗍𝖺𝗄𝖾𝗌. 𝖨'𝗆 𝖾𝗑𝖼𝗂𝗍𝖾𝖽 𝗍𝗈 𝗐𝗈𝗋𝗄 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎 𝖺𝗇𝖽 𝗆𝖺𝗄𝖾 𝗒𝗈𝗎𝗋 𝖽𝖺𝗒 𝖺 𝗅𝗂𝗍𝗍𝗅𝖾 𝖻𝗋𝗂𝗀𝗁𝗍𝖾𝗋.\n\n𝖳𝗒𝗉𝖾 '𝗁𝖾𝗅𝗉' 𝖻𝖾𝗅𝗈𝗐 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌`,
      buttons: [
        {
          type: "web_url",
          url: `https://www.facebook.com/${id}`,
          title: "𝖫𝖨𝖪𝖤/𝖥𝖮𝖫𝖫𝖮𝖶"
        }
      ]
    }
  },
  quick_replies: [
    {
      content_type: "text",
      title: "Help",
      payload: "HELP"
    },
    {
      content_type: "text",
      title: "Privacy Policy",
      payload: "PRIVACY_POLICY"
    },
     {
      content_type: "text",
      title: "Feedback",
      payload: "FEEDBACK"
    }
  ]
};
  await sendMessage(senderId, kumag, pageAccessToken);
 } catch (error) {
  sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.toLowerCase().startsWith("remini")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to Enhancing image" }, pageAccessToken);
      return;
    }     
        const rem = `https://xnilnew404.onrender.com/xnil/remini?imageUrl=${encodeURIComponent(imageUrl)}&method=enhance`;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: rem } } }, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.toLowerCase().startsWith("upscale")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to Enhancing image" }, pageAccessToken);
      return;
    }     
        const upsc = `https://yt-video-production.up.railway.app/upscale?imageUrl=${encodeURIComponent(imageUrl)}`;
const en = await axios.get(upsc);
     const ups = en.data.imageUrl;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: ups } } }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.toLowerCase().startsWith("imgbb")) {
    try { 
       if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by image to get the imgbb url" }, pageAccessToken);
      return;
    }
       const imgurApiUrl = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.url;
        const rec = `https://betadash-api-swordslush.vercel.app/imgbb?url=${encodeURIComponent(imgurLink)}`;
     const ap = await axios.get(rec);
     const yawa = ap.data.imageUrl;
await sendMessage(senderId, { text: yawa}, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.toLowerCase().startsWith("imgurl")) {
    try { 
if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by attachment" }, pageAccessToken);
      return;
    }  const imgurApiUrll = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponsie = await axios.get(imgurApiUrll, { headers } );
        const imgurLinkk = imgurResponsie.data.url;
           
      const apiUrll = `https://betadash-uploader.vercel.app/imgur?link=${imgurLinkk}`;
const fuckk = await axios.get(apiUrll);
const dhh = fuckk.data.uploaded.image;
await sendMessage(senderId, { text: dhh }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}



if (messageText && messageText.toLowerCase().startsWith("getlink")) {
    try { 
if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by attachment " }, pageAccessToken);
      return;
    }     

await sendMessage(senderId, { text: `${imageUrl}` }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.toLowerCase().startsWith("tinyurl")) {
    try { 
if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by image to get the shorten url" }, pageAccessToken);
      return;
    }     
      const apiUrl = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;
const fuck = await axios.get(apiUrl);
const dh = fuck.data.url;
await sendMessage(senderId, { text: dh }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.toLowerCase().startsWith("ocr")) {
    try { 
if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by image to get the text" }, pageAccessToken);
      return;
    }     
      const _odjs = `https://betadash-api-swordslush.vercel.app/ocr?url=${encodeURIComponent(imageUrl)}`;
const _pdh = await axios.get(_odjs);
const _0ch = _pdh.data.text;
await sendMessage(senderId, { text: _0ch }, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

 if (messageText && messageText.toLowerCase().startsWith("anime")) {
    try {
     if (!imageUrl) {
     await sendMessage(senderId, { text: "𝖱𝖾𝗉𝗅𝗒 𝖺 𝗉𝗁𝗈𝗍𝗈 𝗍𝗈 𝗍𝗈 𝖼𝗈𝗇𝗏𝖾𝗋𝗍 anime" }, pageAccessToken);
      return;
    }     

  await sendMessage(senderId, {text: "𝖢𝗈𝗇𝗏𝖾𝗋𝗍𝗂𝗇𝗀 𝗍𝗈 anime 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂t 2 minutes"}, pageAccessToken);

   const imgurApiUrl = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;      
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.url;
        const yawa = `http://45.134.39.193:6298/animirror?url=${imgurLink}`;
   const lsn = await axios.get(yawa);
   const img = lsn.data.image_url;

     await sendMessage(senderId, { 
attachment: { 
    type: 'image', 
    payload: { 
        url: img,
        is_reusable: true
      } 
     } 
    }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, {text: error.message}, pageAccessToken);
   }
    return;
  }  

 if (messageText && messageText.startsWith("zombie")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to to generate canvas zombie face" }, pageAccessToken);
      return;
    }     
    const imgurApiUrl = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.url;
const yawa = `https://yt-video-production.up.railway.app/zombie?url=${imgurLink}`;
     await sendMessage(senderId, { 
attachment: { 
    type: 'image', 
    payload: { 
        url: yawa,
        is_reusable: true
      } 
     } 
    }, pageAccessToken);
    } catch (error) {
   }
    return;
  }

  /**

 if (messageText && messageText.includes("gdrive")) {
    try {
        const rec = `https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(imageUrl)}`;
     const ap = await axios.get(rec);
     const ugh = ap.data;
      await sendMessage(senderId, { text: ugh }, pageAccessToken);
    } catch (error) {
     }
    return;
  }  **/

if (messageText && messageText.toLowerCase().startsWith("aidetect")) {
    try {
        if (!content) {
            sendMessage(senderId, { text: "Please reply by message" }, pageAccessToken);
            return;
        }

        let result = await axios.get(`https://betadash-api-swordslush.vercel.app/aidetect?text=${encodeURIComponent(content)}`);
        const { success, data } = result.data;

        if (!success) {
            sendMessage(senderId, { text: "Failed to process the request. Please try again later." }, pageAccessToken);
            return;
        }

        const {
            isHuman,
            additional_feedback,
            textWords,
            aiWords,
            fakePercentage,
            originalParagraph,
            feedback,
            detected_language
        } = data;

        const humanPercentage = (isHuman).toFixed(2);
        const aiPercentage = (100 - isHuman).toFixed(2);

        const certaintyMessage = feedback 
            ? `${feedback} (${humanPercentage}% human, ${aiPercentage}% AI)`
            : `The text is ${humanPercentage}% likely to be written by a human and ${aiPercentage}% likely to be written by an AI.`;

        const response = `${formatFont("Detection Result")}:
- ${formatFont("Detected Language")}: ${detected_language || "N/A"}
- ${formatFont("Human Probability")}: ${humanPercentage}%
- ${formatFont("AI Probability")}: ${aiPercentage}%
- ${formatFont("Text Words")}: ${textWords || 0}
- ${formatFont("AI Words")}: ${aiWords || 0}

${certaintyMessage}

${additional_feedback || ""}`;

        sendMessage(senderId, { text: response }, pageAccessToken);
    } catch (error) {
        sendMessage(senderId, {text: error.message }, pageAccessToken);
    }
    return;
}


if (messageText && messageText.toLowerCase().startsWith("humanize")) {
    try {
        if (!content) {
            sendMessage(senderId, { text: "Please reply by a message first" }, pageAccessToken);
            return;
        }

        const result = await axios.get(`https://betadash-api-swordslush.vercel.app/humanize?text=${encodeURIComponent(content)}`)
            .then((res) => res.data)
            .catch((err) => {
                return null;
            });      

        const kupal = `${formatFont("HUMANIZED TEXT")}:\n━━━━━━━━━━━━━━\n${result.message}\n`;

        sendMessage(senderId, { text: kupal }, pageAccessToken);
    } catch (error) {
        sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
}

  const commandName = args.shift()?.toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      if (typeof args === 'object') {
            await command.execute(senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks);
        } else {
            await command.execute({ senderId, args, pageAccessToken, sendMessage, splitMessageIntoChunks });
        }
    } catch (error) {
      const kupall = {
     text: "❌ 𝖳𝗁𝖾𝗋𝖾 𝗐𝖺𝗌 𝖺𝗇 𝖾𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖺𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽\n\n𝖳𝗒𝗉𝖾 '𝖧𝖾𝗅𝗉' 𝗍𝗈 𝗌𝖾𝖾 𝗆𝗈𝗋𝖾 𝗎𝗌𝖾𝖿𝗎𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌" || error.message || error.response?.data,
    quick_replies: [
         {
          content_type: "text",
         title: "Help",
         payload: "HELP"
        },
        {
          content_type: "text",
         title: "Feedback",
         payload: "FEEDBACK"
        }       
      ]
   };
    sendMessage(senderId, kupall, pageAccessToken);
    }
  } else if (!regEx_tiktok.test(messageText) && !facebookLinkRegex.test(messageText) && !instagramLinkRegex.test(messageText) && !youtubeLinkRegex.test(messageText) && !spotifyLinkRegex.test(messageText) && !soundcloudRegex.test(messageText) && !capcutLinkRegex.test(messageText)
&& !redditVideoRegex.test(messageText)
&& !snapchatRegex.test(messageText) && haha !== messageText && If !== messageText && j !== messageText && x !== messageText && fac !== messageText && khz !== messageText && "quiz" !== messageText && !event.message.is_echo) {
   try {
  let text;
    if (imageUrl) {
const lgg = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;
const ghh = await axios.get(lgg);
const lkj = ghh.data.url;
const jgd = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDcNRWrf0nCVHCDUnYBLjON3pwW4pPitP0',
      {
        contents: [
          {
            parts: [
              { `${encodeURIComponent(combinedContent)}` },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: (await axios.get(lkj, { responseType: 'arraybuffer' })).data.toString('base64')
                }
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

const idd = jgd.data?.candidates?.[0]?.content?.parts?.[0]?.text;    
const s = ["✧", "✦", "⟡"];
  const sy = s[Math.floor(Math.random() * s.length)];
       const cg = convertToBold(idd);
        text = `${sy} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛 𝟭.𝟱\n━━━━━━━━━━━━━━\n${cg}\n━━━━━━━━━━━━━━`;
      } else {
     const s = ["✧", "✦", "⟡"];
  const sy = s[Math.floor(Math.random() * s.length)];
        const api = `https://api-rynxzei.onrender.com/api/gemini?prompt=${encodeURIComponent(combinedContent)}`;
     const response = await axios.get(api);
      const anss = convertToBold(response.data.response);
        text = `${sy} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛 𝟭.𝟱\n━━━━━━━━━━━━━\n${anss}\n━━━━━━━━━━━━━`;
}


/** let text;
  if (imageUrl) {
    const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}&file_url=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(apiUrl, { headers });
    text = response.data.message;
  } else {
    const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}`;
    const response = await axios.get(apiUrl, { headers });
    text = response.data.message;
  } **/


  const maxMessageLength = 2000;
  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
} catch (error) {
  }
} else if (regEx_tiktok.test(messageText)) {
try {
    sendMessage(senderId, { text: '𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖳𝗂𝗄𝗍𝗈𝗄, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...' }, pageAccessToken);

    const url = messageText;
    const dataa  = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(messageText)}&count=12&cursor=0&web=1&hd=1`);

    const { title, play, music, images } = dataa.data.data;

    if (images && images.length > 0) {
      const elements = images.slice(0, 10).map((img, index) => ({
        title: `Image ${index + 1}`,
        image_url: img,
        subtitle: title || "TikTok Image",
        buttons: [
          {
            type: "web_url",
            url: img,
            title: "View Image"
          }
        ]
      }));

      await sendMessage(senderId, {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elements
          }
        }
      }, pageAccessToken);

   if (music) {
    await sendMessage(senderId, {
        attachment: {
              type: 'audio',
              payload: {
                url: `https://tikwm.com${music}`,
                is_reusable: true,
              },
            },
          },
        pageAccessToken);
       }
     } 
      else if (play) {
      const videoUrl = `https://tikwm.com${play}`;
      const headResponse = await axios.head(videoUrl);
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        await sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The Tiktok video exceeds the 25 MB limit and cannot be sent.`,
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
      } else {
        await sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: videoUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    }
  } catch (error) {
    }
  } else if (facebookLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: '𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...' }, pageAccessToken);
      const apiUrl = `https://betadash-search-download.vercel.app/fbdl?url=${encodeURIComponent(messageText)}`;

const headResponse = await axios.head(apiUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The Facebook video exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: apiUrl,
                  title: 'Watch Video'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
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
    }
   } else if (instagramLinkRegex.test(messageText)) {   
    try {
      sendMessage(senderId, { text: '𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖨𝗇𝗌𝗍𝖺𝗀𝗋𝖺𝗆, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...' }, pageAccessToken);
      const apiUrl = `https://yt-video-production.up.railway.app/insta?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const videoUrl = response.data.result[0].url;

const headResponse = await axios.head(videoUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The Instagram video exceeds the 25 MB limit and cannot be sent.`,
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
      } else {
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
    }   
  } else if (youtubeLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: '𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖸𝗈𝗎𝗍𝗎𝖻𝖾, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...' }, pageAccessToken);
      const yts = `https://yt-video-production.up.railway.app/ytdl?url=${encodeURIComponent(messageText)}`;
     const yu = await axios.get(yts, { headers });
      const vid = yu.data.video;
   const duration = `${yu.data.duration.seconds}\t${yu.data.duration.label}`;
      const thumbnail = yu.data.thumbnail;
      const title = yu.data.title;

 const kupal = `🎥 Now playing\n\n𝗧𝗶𝘁𝗹𝗲: ${title}`;
      sendMessage(senderId, { text: kupal }, pageAccessToken); 

/** sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: duration,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                  }
                }
              ]
            }
          }
        },
        pageAccessToken
      ); **/

 const headResponse = await axios.head(vid, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The YouTube video exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: vid,
                  title: 'Watch Video'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: vid,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
  } else if (spotifyLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Spotify, please wait...' }, pageAccessToken);
      const apiUrl = `https://betadash-search-download.vercel.app/spotifydl?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const { track_name, cover_image, artist, album_artist, album, release_date } = response.data.metadata;

const audio = response.data.download.file_url;

  await sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: track_name,
                  image_url: cover_image,
                  subtitle: `${album_artist}`,
                  default_action: {
                    type: "web_url",
                    url: cover_image,
                    webview_height_ratio: "tall"
                  },
                  buttons: [
              {
                type: 'web_url',
                url: audio,
                title: 'Download Music',                     
              }
            ]
          }
        ]
      }
    }
  },
  pageAccessToken
);

      if (audio) {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: audio,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
} else if (soundcloudRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading SoundCloud, please wait...' }, pageAccessToken);
      const sc = `https://betadash-search-download.vercel.app/soundcloud?url=${encodeURIComponent(messageText)}`;

const response = await axios.get(sc, { headers });

const { download, thumbnail, quality, duration, title } = response.data;


      sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `Quality: ${quality} - Duration: ${duration}`,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                  }
                }
              ]
            }
          }
        },
        pageAccessToken
      );

      const headResponse = await axios.head(download, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The audio file exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: download,
                  title: 'Download URL'
                }
              ]
            }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: download,
              is_reusable: true
            }
          }
        }, pageAccessToken);
        }
      } catch (error) {
    }
} else if (capcutLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Capcut, please wait...' }, pageAccessToken);
      const capct = `https://kaiz-apis.gleeze.com/api/capcutdl?url=${encodeURIComponent(messageText)}&apikey=2e58e712-a3ef-42bb-af1a-20baa7edb88e`;
     const response = await axios.get(capct, { headers });
      const {title, url, thumbnail, size, quality} = response.data;

const headResponse = await axios.head(url, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

const kupal = `𝗧𝗶𝘁𝗹𝗲: ${title}`;
sendMessage(senderId, { text: kupal }, pageAccessToken); 

    if (fileSize > 25 * 1024 * 1024) {
          sendMessage(
        senderId,
        {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `Quality: ${quality} Size: ${size}`,
                  default_action: {
                    type: "web_url",
                    url: thumbnail,
                    webview_height_ratio: "tall"
                 },
                 buttons: [
                {
                  type: "web_url",
                  url: url,
                  title: "Download Video"
                },
                {
                  type: "web_url",
                  url: thumbnail,
                  title: "Author Profile"
                }
              ]
            }
          ]
        }
      }
    }, pageAccessToken );
    } else {
        sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: url,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
  } else if (redditVideoRegex.test(messageText)) {
  try {
    sendMessage(senderId, { text: 'Downloading Reddit video, please wait...' }, pageAccessToken);

    const apiURL = `https://betadash-api-swordslush.vercel.app/reddit?url=${encodeURIComponent(messageText)}`;
    const response = await axios.get(apiURL, { headers });
    const { title, videoFormats, audioFormats, thumbnailUrl } = response.data;

    const headerMessage = `𝗧𝗶𝘁𝗹𝗲: ${title}`;
    sendMessage(senderId, { text: headerMessage }, pageAccessToken);
    sendMessage(senderId, {
      attachment: {
        type: "image",
        payload: {
          url: thumbnailUrl,
          is_reusable: true
        }
      }
    }, pageAccessToken);

    const videoButtons = videoFormats.map((format) => ({
      type: "web_url",
      url: format.url,
      title: `Download Video (${format.quality})`
    }));

    if (audioFormats && audioFormats.length > 0) {
      const audioButton = {
        type: "web_url",
        url: audioFormats[0].url,
        title: `Download Audio (${audioFormats[0].label})`
      };
      videoButtons.push(audioButton);
    }

    const largestVideo = videoFormats[videoFormats.length - 1];
    const headResponse = await axios.head(largestVideo.url, { headers });
    const fileSize = parseInt(headResponse.headers['content-length'], 10);

    if (fileSize > 25 * 1024 * 1024) {
      sendMessage(senderId, {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: title,
                image_url: thumbnailUrl,
                subtitle: "Select a format to download:",
                buttons: videoButtons
              }
            ]
          }
        }
      }, pageAccessToken);
    } else {
      sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: videoFormats[0].url,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    }
  } catch (error) {
    sendMessage(senderId, { text: "An error occurred while processing the video. Please try again later." }, pageAccessToken);
  }
} else if (snapchatRegex.test(messageText)) {
  try {
    sendMessage(senderId, { text: 'Downloading Snapchat video, please wait...' }, pageAccessToken);

    const apiURL = `https://betadash-api-swordslush.vercel.app/snapchat?url=${encodeURIComponent(messageText)}`;
    const response = await axios.get(apiURL, { headers });
    const { title, author, mediaUrl, mediaPreviewUrl, thumbnailUrl } = response.data;

    const headerMessage = `𝗧𝗶𝘁𝗹𝗲: ${title}`;
    sendMessage(senderId, { text: headerMessage }, pageAccessToken);

    const headResponse = await axios.head(mediaUrl, { headers });
    const fileSize = parseInt(headResponse.headers['content-length'], 10);

    if (fileSize > 25 * 1024 * 1024) {
      sendMessage(senderId, {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: title,
                image_url: thumbnailUrl,
                subtitle: `Author: ${author}`,
                buttons: [
                  {
                    type: "web_url",
                    url: mediaUrl,
                    title: "Download Video"
                  },
                  {
                    type: "web_url",
                    url: mediaPreviewUrl,
                    title: "Preview Video"
                  }
                ]
              }
            ]
          }
        }
      }, pageAccessToken);
    } else {
      sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: mediaUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    }
  } catch (error) {
    sendMessage(senderId, { text: error.message }, pageAccessToken);
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
} 

async function updateMessengerCommands() {
  const commandsPayload = commandList.map((name, index) => ({
    name,
    description: descriptions[index]
  }));

  try {
    const dataCmd = await axios.get(`https://graph.facebook.com/v22.0/me/messenger_profile`, {
      params: { fields: 'commands', access_token: PAGE_ACCESS_TOKEN }
    });

    if (dataCmd.data.data[0]?.commands.length === commandsPayload.length) {
      console.log('Commands not changed');
      return;
    }

    const response = await axios.post(
  `https://graph.facebook.com/v22.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
  { 
    commands: [
      { 
        locale: 'default', 
        commands: commandsPayload 
      }
    ] 
  },
  { 
    headers: {
      'Content-Type': 'application/json' 
    }
  }
);

console.log(response.data.result === 'success' ? 'Commands loaded!' : 'Failed to load commands'); 
  } catch (error) {
  }
}

loadCommands();
updateMessengerCommands();

app.use((req, res, next) => {
  try {
res.status(404).sendFile(path.join(__dirname, "nya", "404.html"));
  } catch (error) {
res.status(500).sendFile(path.join(__dirname, "nya", "error.html"));
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
