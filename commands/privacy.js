const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'privacy',
  description: 'Rules for using the page bot',
  usage: 'privacy',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture.width(720).height(720).as(picture_large)&access_token=${pageAccessToken}`
      );

      const profileUrl = response.data.picture_large.data.url;
      const name = response.data.name;
      const pageid = response.data.id;

      const termsAndConditions = `𝗧𝗘𝗥𝗠𝗦 𝗢𝗙 𝗦𝗘𝗥𝗩𝗜𝗖𝗘 & 𝗣𝗥𝗜𝗩𝗔𝗖𝗬 𝗣𝗢𝗟𝗜𝗖𝗬

By using this bot, you agree to:
1. 𝗜𝗻𝘁𝗲𝗿𝗮𝗰𝘁𝗶𝗼𝗻: Automated responses may log interactions to improve service.
2. 𝗗𝗮𝘁𝗮: We collect data to enhance functionality without sharing it.
3. 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆: Your data is protected.
4. 𝗖𝗼𝗺𝗽𝗹𝗶𝗮𝗻𝗰𝗲: Follow Facebook's terms or risk access restrictions.
5. 𝗨𝗽𝗱𝗮𝘁𝗲𝘀: Terms may change, and continued use implies acceptance.

Failure to comply may result in access restrictions.`;

      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="Privacy Policy for ${name}Bot effective October 26, 2024. Learn about how ${name}Bot handles your data, including data processing, third-party services, and user rights.">
          <meta name="keywords" content="${name}Bot, privacy policy, data privacy, user rights, third-party services, data protection">
          <meta name="author" content="Chatbot Community Team">
          <meta name="robots" content="index, follow">
          <title>Privacy Policy - ${name}Bot</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #4c83ff, #1a1a40); color: #333; line-height: 1.8; }
              .container { max-width: 900px; margin: 40px auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); }
              h1 { text-align: center; color: #007bff; font-weight: 600; margin-bottom: 15px; }
              .effective-date { text-align: center; font-weight: 600; color: #555; margin-bottom: 20px; }
              h2 { color: #222; font-size: 22px; margin-top: 20px; }
              p, ul { margin-bottom: 15px; }
              ul { padding-left: 20px; }
              a { color: #007bff; text-decoration: none; font-weight: 600; }
              a:hover { text-decoration: underline; }
              @media (max-width: 768px) {
                  .container { padding: 20px; margin: 20px; }
                  h1 { font-size: 24px; }
                  h2 { font-size: 20px; }
              }
          </style>
      </head>
      <body>
      <div class="container">
          <h1>${name}Bot Privacy Policy</h1>
          <p class="effective-date">Effective Date: October 26, 2024</p>
          <p><strong>Please review this privacy policy thoroughly.</strong> Your privacy is important to us, and we are committed to protecting the data you share while using ${name}Bot.</p>
          <h2>1. Introduction</h2>
          <p>At ${name}Bot, we respect your privacy and manage your personal data responsibly...</p>
          <h2>2. No Data Logging or Storage</h2>
          <p>We do not collect, log, or store any messages or personal data...</p>
          <h2>3. Contact Information</h2>
          <p>If you have questions, contact us at:</p>
          <p><strong>Email:</strong> cliffvincenttorrevillas@gmail.com</p>
      </div> 
      </body>
      </html>`;


      const filePath = path.join(__dirname, 'privacy', `${pageid}.html`);


      fs.mkdirSync(path.dirname(filePath), { recursive: true });

 
      fs.writeFileSync(filePath, html);

      const kupal = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: termsAndConditions,
            buttons: [
              {
                type: 'web_url',
                url: `https://betadash-pagebot-production.up.railway.app/privacy/${pageid}.html`,
                title: 'PRIVACY POLICY'
              }
            ]
          }
        }
      };

      sendMessage(senderId, kupal, pageAccessToken);
    } catch (error) {
      sendMessage(senderId, { text: 'Failed to retrieve privacy policy details. Please try again later.' }, pageAccessToken);
    }
  }
};
