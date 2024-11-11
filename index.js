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
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json'
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

const VERIFY_TOKEN = 'shipazu';
const pageid = "61567757543707";
const admin = ["8786755161388846", "8376765705775283", "8552967284765085"];
const PAGE_ACCESS_TOKEN = "EAAOGSnFGWtcBO39cZCWtulezE599r3wNa7hcPyHwqyN8EzfVaZAt1etXDwncdZB8MDHxLlY6ZCPdSs7BKhR6ujna8OWI56zJnQQPudShraMvR4PglQjqb5ijCWcdUOhU6SRreFoDYmlCoMqaRryG86CpncRQLI6PjYcgEk9I0dVZBvs6ANP5dV8xnWYUOzdp7uQZDZD";

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
    });     res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});


/** function handleResponseFeedback(event) {
  const feedback = event.response_feedback.feedback;
  const messageId = event.response_feedback.mid;
  const senderId = event.sender.id;

  const messageText = feedback === 'Good response'
    ? `User ${senderId} gave positive feedback for message ${messageId}`
    : `User ${senderId} gave negative feedback for message ${messageId}`;

  sendMessage("7913024942132935", { text: messageText }, pageAccessToken);
} **/


function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  try {
    if (payload === 'GET_STARTED_PAYLOAD') {
      const greetingMessage = {
        greeting: [
          {
            locale: "default",
            text: "Hello, I'm BELUGA! Your friendly AI assistant, here to help with questions, tasks, and more. I'm constantly learning and improving. \n\nType 'help' below 👇 to see available commands."
          }
        ],
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
      };

      sendMessage(senderId, greetingMessage, pageAccessToken);
    } else {
      sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
    }
  } catch (err) {
  }
}

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



async function sendMessage(senderId, message, pageAccessToken) {

if (!message || (!message.text && !message.attachment)) {
console.error();
return;
}


try {
await axios.post('https://graph.facebook.com/v21.0/me/messages', {
recipient: { id: senderId },
sender_action: 'mark_seen'
}, {
params: { access_token: pageAccessToken }
});


await axios.post('https://graph.facebook.com/v21.0/me/messages', {
recipient: { id: senderId },
sender_action: 'typing_on'
}, {
params: { access_token: pageAccessToken }
});

const messagePayload = {
recipient: { id: senderId },
message: {}
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

await axios.post('https://graph.facebook.com/v21.0/me/messages', messagePayload, {
params: { access_token: pageAccessToken }
});

 await axios.post('https://graph.facebook.com/v21.0/me/messages', {
recipient: { id: senderId },
sender_action: 'typing_off'
}, {
params: { access_token: pageAccessToken }
}); 
} catch (error) {
console.error();
}
}



async function getAttachments(mid, pageAccessToken) {
  if (!mid) {
    throw new Error();
  }

  try {
    const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
      params: { access_token: pageAccessToken }
    });

    if (data && data.data.length > 0 && data.data[0].image_data) {
      return data.data[0].image_data.url;
    } else {
      throw new Error();
    }
  } catch (error) {
  }
}


const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
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

   const senderId = event.sender.id;
  const messageText = event.message.text;
const messageId = event.message.mid;
  let jb = "👍";

 let imageUrl = '';

if (event.message && event.message.attachments) {
  const imageAttachment = event.message.attachments.find(att => att.type === 'image') 
    || event.message.attachments.find(att => att.type === 'video');

  if (imageAttachment) {
    imageUrl = imageAttachment.payload.url;
  }
}

  if (event.message && event.message.reply_to && event.message.reply_to.mid) {
    try {
      imageUrl = await getAttachments(event.message.reply_to.mid, pageAccessToken);
    } catch (error) {
      imageUrl = ''; 
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
  return pattern.test(args);
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
        const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const h = {
            text: `Here is the Imgur link for the image you provided:\n\n${imgurLink}`
        };
        sendMessage(senderId, h, pageAccessToken);
    } catch (error) {
     }
    return;
  } 

if (messageText && messageText.includes("removebg")) {
    try {
        const bg = `https://ccprojectapis.ddns.net/api/removebg?url=${encodeURIComponent(imageUrl)}`;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: bg } } }, pageAccessToken);
    } catch (error) {
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
  }
  return;
}

if (messageText && messageText.includes("remini")) {
    try {
        const rem = `https://xnilnew404.onrender.com/xnil/remini?imageUrl=${encodeURIComponent(imageUrl)}&method=enhance`;
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: rem } } }, pageAccessToken);
    } catch (error) {
     }
    return;
  }

if (messageText && messageText.includes("tinyurl")) {
    try {        
      const apiUrl = `https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`;
const fuck = await axios.get(apiUrl);
const dh = fuck.data.url;
await sendMessage(senderId, { text: dh }, pageAccessToken);
    } catch (error) {
     }
    return;
  }

if (messageText && messageText.includes("prompt")) {
    try {
        const kupal = "Give exact prompt of this image";
        const rec = `https://pixtral2.vercel.app/api/pixtral?text=${kupal}&image_url=${encodeURIComponent(imageUrl)}`;
     const ap = await axios.get(rec);
     const ugh = ap.data.response;
      await sendMessage(senderId, { text: ugh }, pageAccessToken);
    } catch (error) {
     }
    return;
  }


/** if (messageText && messageText.includes("zombie")) {
    try {
        const rec = `https://www.samirxpikachu.run.place/zombie?imgurl=${encodeURIComponent(imageUrl)}`;
     await sendMessage(senderId, { 
attachment: { 
    type: 'image', 
    payload: { 
        url: rec,
        is_reusable: true
      } 
     } 
    }, pageAccessToken);
    } catch (error) {
   }
    return;
  }

if (messageText && messageText.includes("gdrive")) {
    try {
        const rec = `https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(imageUrl)}`;
     const ap = await axios.get(rec);
     const ugh = ap.data;
      await sendMessage(senderId, { text: ugh }, pageAccessToken);
    } catch (error) {
     }
    return;
  } **/

  const commandName = args.shift()?.toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      await command.execute(senderId, args, pageAccessToken, sendMessage, event, pageid, admin, messageId, splitMessageIntoChunks);
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
  } else if (!regEx_tiktok.test(messageText) && !facebookLinkRegex.test(messageText) && !instagramLinkRegex.test(messageText) && !youtubeLinkRegex.test(messageText) && !spotifyLinkRegex.test(messageText) && !soundcloudRegex.test(messageText) && !capcutLinkRegex.test(messageText) && jb !== messageText)  {
   try {
  let text;
  if (imageUrl) {
    const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}&file_url=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(apiUrl, { headers });
    text = response.data.message;
  } else {
    const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}`;
    const response = await axios.get(apiUrl, { headers });
    text = response.data.message;
  }

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
      const apiUrl = `https://universaldownloader.zapto.org/download?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const videoUrl = response.data.result;

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
      const yts = `https://apiv2.kenliejugarap.com/video?url=${encodeURIComponent(messageText)}`;
     const yu = await axios.get(yts, { headers });
      const vid = yu.data.response;
      const views = yu.data.views;
      const thumbnail = yu.data.image;
      const title = yu.data.title;

 const kupal = `🎥 Now playing\n\n𝗧𝗶𝘁𝗹𝗲: ${title}`;
      sendMessage(senderId, { text: kupal }, pageAccessToken); 

/**  sendMessage(
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
                  subtitle: views,
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
      const spotifyLink = response.data.result;

      if (spotifyLink) {
        sendMessage(senderId, {
          attachment: {
            type: 'audio',
            payload: {
              url: spotifyLink,
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
      const capct = `https://betadash-search-download.vercel.app/capcutdl?link=${encodeURIComponent(messageText)}`;
     const response = await axios.get(capct, { headers });
      const {title, description, digunakan, video_ori, author_profile, cover} = response.data.result;

const headResponse = await axios.head(video_ori, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

const kupal = `𝗧𝗶𝘁𝗹𝗲: ${title}\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${description}\n𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲-𝗨𝘀𝗲𝗱: ${digunakan}`;
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
                  image_url: cover,
                  subtitle: `Description: ${description} Used: ${digunakan}`,
                  default_action: {
                    type: "web_url",
                    url: cover,
                    webview_height_ratio: "tall"
                 },
                 buttons: [
                {
                  type: "web_url",
                  url: video_ori,
                  title: "Download Video"
                },
                {
                  type: "web_url",
                  url: author_profile,
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
              url: video_ori,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
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
    const dataCmd = await axios.get(`https://graph.facebook.com/v21.0/me/messenger_profile`, {
      params: { fields: 'commands', access_token: PAGE_ACCESS_TOKEN }
    });

    if (dataCmd.data.data[0]?.commands.length === commandsPayload.length) {
      console.log('Commands not changed');
      return;
    }

    const response = await axios.post(
  `https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
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


/** async function persistent_menu() {
  const commandsPayload = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: commandList.map((name, index) => ({
          title: name,
          type: "postback",
          payload: `COMMAND_${name.toUpperCase()}`
        }))
      }
    ]
  };

  try {
    const response = await axios.post(`https://graph.facebook.com/v21.0/me/messenger_profile`, commandsPayload, {
      params: { access_token: PAGE_ACCESS_TOKEN }
    });
    console.log("Commands updated:", response.data);
  } catch (error) {
    console.error("Failed to update commands:", error.response?.data || error.message);
  }
}

persistent_menu(); **/
 loadCommands();
updateMessengerCommands();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 