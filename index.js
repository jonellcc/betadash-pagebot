const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
const instagramLinkRegex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
const youtubeLinkRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const spotifyLinkRegex = /^https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+$/;
const soundcloudRegex = /^https?:\/\/soundcloud\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)(?:\/([a-zA-Z0-9-]+))?(?:\?.*)?$/;
const capcutLinkRegex = /https:\/\/www\.capcut\.com\/t\/[A-Za-z0-9]+/;
const redditVideoRegex = /https:\/\/www\.reddit\.com\/r\/[A-Za-z0-9_]+\/comments\/[A-Za-z0-9]+\/[A-Za-z0-9_]+\/?/;
const snapchatRegex = /https?:\/\/(www\.)?snapchat\.com\/spotlight\/[A-Za-z0-9_-]+/i;

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json'
};

let likeCounter = {};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

const VERIFY_TOKEN = 'shipazu';
const pageid = "493920247130641";
const admin = ["8786755161388846", "8376765705775283", "8552967284765085"];
const PAGE_ACCESS_TOKEN = "EAAOGSnFGWtcBO5WloVZCKNkw8Q8ZAxE5qFJNTdQt4litcUENTKwabpewHQVtd1iNB7JOXvAcwLlN25iGD2PFpP0hXYfwovSRdFMBaLCmZBhb4gCeVOzzX7vuIlA7Mc09VUPDZCo8nDCE9D3UGyZCL9ukspPSFQquxZBxaZBh9uKOCAJZBnHgT1O5lVbdeAZBCI1956wZDZD";

const commandList = [];
const descriptions = [];
const userMessages = {};
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
        } else if (event, PAGE_ACCESS_TOKEN) {
         handlePayload(event, PAGE_ACCESS_TOKEN);
} else if (event.response_feedback?.feedback) {
          handleResponseFeedback(event);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

async function handlePayload(event, pageAccessToken) {
  const payload = event.postback.payload;
  const senderId = event.sender.id;
  if (payload === 'GET_STARTED_PAYLOAD') {
    await sendMessage(senderId, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: "Hello, I'm 𝗕𝗲𝗹𝘂𝗴𝗮! I'm your friendly AI assistant, here to help with any questions, tasks, or just about anything else you need. I'm constantly learning and improving, so please bear with me if ever I make any mistakes. I'm excited to work with you and make your day a little brighter. What's on your mind today?\n\nUse the 'Help' button to show a list of commands. 𝗕𝗲𝗹𝘂𝗴𝗮 is for educational and fun purposes, so now you can explore all the commands. Like/Follow for more.",
          buttons: [
            {
              type: 'web_url',
              url: "https://www.facebook.com/61567757543707",
              title: "Like/Follow"
            },
            {
              type: 'postback',
              title: "Help",
              payload: "HELP_PAYLOAD"
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
        }
      ]
    }, pageAccessToken);
  }
}

async function initializeMessengerProfile() {
  const url = `https://graph.facebook.com/v22.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;
  const payload = {
    get_started: { payload: "GET_STARTED_PAYLOAD" },
    greeting: [
      {
        locale: "default",
        text: "Hello, {{user_first_name}}! I'm 𝗕𝗲𝗹𝘂𝗴𝗮! Your friendly AI assistant, here to help with questions, tasks, and more."
      }
    ]
  };

  await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function processEvent(event) {
  if (event.postback && event.postback.payload) {
    await handlePayload(event.postback.payload);
  }
}

initializeMessengerProfile();


/** function handleLongTask(senderId) {
    typingIndicator(senderId, true);

    const maxTimeout = 30000;
    let isResponseSent = false;

    simulateApiCall()
        .then(response => {
            if (!isResponseSent) {
                isResponseSent = true;
                clearTimeout(timeout);
                typingIndicator(senderId, false);
            }
        })
        .catch(error => {
            if (!isResponseSent) {
                isResponseSent = true;
                clearTimeout(timeout);
                typingIndicator(senderId, false);
            }
        });

    const timeout = setTimeout(() => {
        if (!isResponseSent) {
            isResponseSent = true;
            typingIndicator(senderId, false);
        sendMessage(senderId, { text: 'The request took too long to process and has been timed out.'}, pageAccessToken);
        }
    }, maxTimeout);
}

function simulateApiCall() {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 35000);
        setTimeout(() => {
            if (delay < 30000) {
                resolve('Simulated API data');
            } else {
                reject('Simulated timeout error');
            }
        }, delay);
    });
} **/

function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
}

async function sendMessage(senderId, message, pageAccessToken) {
    if (!message || (!message.text && !message.attachment)) {
        console.error();
        return;
    }

    try {
        await axios.post('https://graph.facebook.com/v22.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'mark_seen'
        }, {
            params: { access_token: pageAccessToken }
        });

        await axios.post('https://graph.facebook.com/v22.0/me/messages', {
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

        await axios.post('https://graph.facebook.com/v22.0/me/messages', messagePayload, {
            params: { access_token: pageAccessToken }
        });

        await axios.post('https://graph.facebook.com/v22.0/me/messages', {
            recipient: { id: senderId },
            sender_action: 'typing_off'
        }, {
            params: { access_token: pageAccessToken }
        });
    } catch (error) {
        console.error();
    }
}

async function handleResponseFeedback(event) {
  const feedback = event.response_feedback.feedback;
  const messageID = event.response_feedback.mid;
  const id = event.sender.id;

  const messageTex = feedback === 'Good response'
    ? `User ${id} gave positive feedback for message ${messageID}`
    : `User ${id} gave negative feedback for message ${messageID}`;

  sendMessage("8269473539829237", { text: messageTex }, pageAccessToken);
}

const isValidUrl = (url) => {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/; 
  return regex.test(url);
};

async function getImage(mid) {
  if (!mid) return;

  try {
    const { data } = await axios.get(`https://graph.facebook.com/v22.0/${mid}/attachments`, {
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
      const { data } = await axios.get(`https://graph.facebook.com/v22.0/${mid}/attachments`, {
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

async function getMessage(mid) {
  return await new Promise(async (resolve, reject) => {
    if (!mid) resolve(null);
    await axios.get(`https://graph.facebook.com/v22.0/${mid}?fields=message&access_token=${PAGE_ACCESS_TOKEN}`).then(data => {
      resolve(data.data.message);
    }).catch(err => {
      reject(err);
    });
  });
}


async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.message || !event.sender.id)  {
    return;
  }

  
const image = event.message.attachments &&
  (event.message.attachments[0]?.type === 'image');
const video = event.message.attachments &&
           (event.message.attachments[0]?.type === 'video');
const gif = event.message.attachments &&
           (event.message.attachments[0]?.type === 'gif');

const events = event;
   const senderId = event.sender.id;
  const messageText = event.message.text;
const haha = "More shoti";
const messageId = event.message.mid;
const If = "aidetect";
const j = "humanize";
const x = "👍";


if (event.policy_enforcement) {
    const reason = event.policy_enforcement.reason || "Unknown reason";
    const action = event.policy_enforcement.action || "Unknown action";

    if (admin.length > 0) {
        const nya = `🚨 Policy Enforcement Alert 🚨\n\nAction: ${action}\nReason: ${reason}\n\nPlease check the bot settings!`;
        sendMessage("7913024942132935", { text: nya }, pageAccessToken);
    }
}


let content = "";

if (event.message && event.message.reply_to) {
content = await getMessage(event.message.reply_to.mid);
}
const combinedContent = content ? `${messageText} ${content}` : messageText;

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
  'pussy', 'dick', 'nude', 'xnxx', 'pornhub', 'hot', 'clothes', 'sugar', 'fuck', 'fucked', 'step',
  'shit', 'bitch', 'hentai', 'sex', 'boobs', 'cute girl undressed', 'undressed', 
  'naked', 'underwear', 'sexy', 'panty', 'fuckers', 'fck', 'fucking', 'vagina', 'intercourse', 
  'penis', 'gae', 'panties', 'fellatio', 'blow job', 'blow', 'skin', 'segs', 'porn', 'loli', 'kantutan','lulu', 'kayat', 'bilat',
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
    { text: '🚫 Your prompt contains inappropriate content. Please try again with a different prompt.',
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

if (messageText && messageText.includes("imgur")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply to an image to upload in imgur" }, pageAccessToken);
      return;
    }     
        const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const h = {
            text: `Here is the Imgur link for the image you provided:\n\n${imgurLink}`
        };
        sendMessage(senderId, h, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.includes("removebg")) {
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


if (messageText && messageText.includes("recognize")) {
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


if (messageText && messageText.includes("faceswap")) {
  try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply with two image to combine face" }, pageAccessToken);
      return;
    }     
    const imgurApiUrl1 = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(yawa1)}`;
    const imgurResponse1 = await axios.get(imgurApiUrl1, { headers });
    const imgurLink1 = imgurResponse1.data.uploaded.image;

    const imgurApiUrl2 = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(yawa2)}`;
    const imgurResponse2 = await axios.get(imgurApiUrl2, { headers });
    const imgurLink2 = imgurResponse2.data.uploaded.image;

    const bg = `https://kaiz-apis.gleeze.com/api/faceswap?swapUrl=${encodeURIComponent(imgurLink1)}&baseUrl=${encodeURIComponent(imgurLink2)}`;
    await sendMessage(senderId, { attachment: { type: 'image', payload: { url: bg } } }, pageAccessToken);
  } catch (error) {
    sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}

if (messageText && messageText.includes("Get started")) {
  try {
    const kumag = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "Hello, I'm BELUGA! Your friendly AI assistant, here to help with questions, tasks, and more. I'm constantly learning and improving, so please bear with me if ever I make any mistakes. I'm excited to work with you and make your day a little brighter.\n\nType 'help' below to see available commands",
      buttons: [
        {
          type: "web_url",
          url: "https://www.facebook.com/profile.php?id=61567757543707",
          title: "LIKE/FOLLOW"
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

if (messageText && messageText.includes("remini")) {
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


if (messageText && messageText.includes("upscale")) {
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


if (messageText && messageText.includes("imgbb")) {
    try { 
       if (!imageUrl) {
      sendMessage(senderId, { text: "Please reply by image to get the imgbb url" }, pageAccessToken);
      return;
    }
       const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const rec = `https://betadash-api-swordslush.vercel.app/imgbb?url=${encodeURIComponent(imgurLink)}`;
     const ap = await axios.get(rec);
     const yawa = ap.data.imageUrl;
await sendMessage(senderId, { text: yawa}, pageAccessToken);
    } catch (error) {
     sendMessage(senderId, { text: error.message}, pageAccessToken);
        }
      return;
}


if (messageText && messageText.includes("tinyurl")) {
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


 if (messageText && messageText.includes("zombie")) {
    try {
if (!imageUrl) {
      sendMessage(senderId, { text: "Reply a photo to to generate canvas zombie face" }, pageAccessToken);
      return;
    }     
    const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
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

/** if (messageText && messageText.includes("gdrive")) {
    try {
        const rec = `https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(imageUrl)}`;
     const ap = await axios.get(rec);
     const ugh = ap.data;
      await sendMessage(senderId, { text: ugh }, pageAccessToken);
    } catch (error) {
     }
    return;
  } **/

if (messageText && messageText.includes("aidetect")) {
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


if (messageText && messageText.includes("humanize")) {
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
      await command.execute(senderId, args, pageAccessToken, sendMessage, admin, events, splitMessageIntoChunks);
    } catch (error) {
      const kupall = {
     text: "❌ There was an error processing that command\n\nType 'Help' to see more useful commands",
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
&& !snapchatRegex.test(messageText) && haha !== messageText && If !== messageText && j !== messageText && x !== messageText) {
   try {
  let text;
    if (imageUrl) {
const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(combinedContent)}&uid=${senderId}&&imageUrl=${imgurLink}`;
const s = [ "✦", "✧", "✦", "⟡"];
  const sy = s[Math.floor(Math.random() * s.length)];
        const response = await axios.get(apiUrl, { headers });
       const cg = convertToBold(response.data.response);
        text = `${sy} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛 𝟭.𝟱\n━━━━━━━━━━━━━━\n${cg}\n━━━━━━━━━━━━━━`;
      } else {
     const s = ["✦", "✧", "✦", "⟡"];
  const sy = s[Math.floor(Math.random() * s.length)];
        const api = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(combinedContent)}&uid=${senderId}`;
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
      sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    sendMessage(senderId, { text }, pageAccessToken);
  }
} catch (error) {
  }
} else if (instagramLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Instagram, please wait...' }, pageAccessToken);
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
  } else if (facebookLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Facebook, please wait...' }, pageAccessToken);
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
  } else if (regEx_tiktok.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Tiktok, please wait...' },  pageAccessToken);
      const response = await axios.post(`https://www.tikwm.com/api/`, { url: messageText }, { headers });
      const data = response.data.data;
      const shotiUrl = data.play;
      const avatar = data.author.avatar;
      const username = data.author.nickname;
      const unique_id = data.author.unique_id;

const headResponse = await axios.head(shotiUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        sendMessage(senderId, {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `The Tiktok video exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: shotiUrl,
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
              url: shotiUrl,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
    }
  } else if (youtubeLinkRegex.test(messageText)) {
    try {
      sendMessage(senderId, { text: 'Downloading Youtube, please wait...' }, pageAccessToken);
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

  sendMessage(
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
                  subtitle: `${album_artist} ${release_date}`,
                  default_action: {
                    type: "web_url",
                    url: cover_image,
                    webview_height_ratio: "tall"
                  }
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
      const capct = `https://kaiz-apis.gleeze.com/api/capcutdl?url=${encodeURIComponent(messageText)}`;
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
    sendMessage(senderId, { text: "An error occurred while processing the video. Please try again later." }, pageAccessToken);
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
