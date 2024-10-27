const axios = require('axios');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const { PasteClient } = require('pastebin-api');
const { sendMessage } = require("../kupal");

module.exports = {
  name: 'adc',
  description: 'Upload or apply code from Pastebin/BuildToolDev',
  author: 'Cliff Vincent',
  async execute(senderId, args, pageAccessToken, pageid) {
    const PASTEBIN_API_KEY = "R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb";
    const kupal = ["8505900689447357", "8269473539829237", "7913024942132935"];

if (!kupal.some(kupal_ka => kupal_ka === senderId)) {
  sendMessage(senderId, { text: "This command is only for pagebot owner." }, pageAccessToken);
  return;
}

    const filename = args[0];  
    const urlOrText = args[1]; 

    if (!filename || !urlOrText) {
      return sendMessage(senderId, { text: 'Usage: adc <filename> <link or local code>' }, pageAccessToken);
    }

    const isUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const matchedUrl = urlOrText.match(isUrl)?.[0];

    if (!matchedUrl) {
      try {
        const data = await fs.promises.readFile(`${__dirname}/${filename}.js`, 'utf-8');
        const client = new PasteClient(PASTEBIN_API_KEY);

        const link = await client.createPaste({
          code: data,
          expireDate: 'N',
          format: "javascript",
          name: filename,
          publicity: 1
        });

        const rawLink = 'https://pastebin.com/raw/' + link.split('/')[3];
        return sendMessage(senderId, { text: `Uploaded: ${rawLink}` }, pageAccessToken);
      } catch (err) {
        return sendMessage(senderId, { text: `Error: File ${filename}.js not found.` }, pageAccessToken);
      }
    }

    if (matchedUrl.includes('pastebin')) {
      try {
        const { data } = await axios.get(matchedUrl);
        await fs.promises.writeFile(`${__dirname}/${filename}.js`, data, 'utf-8');
        sendMessage(senderId, { text: `Code saved to ${filename}.js` }, pageAccessToken);
      } catch (err) {
        sendMessage(senderId, { text: `Error: Failed to download code from ${matchedUrl}` }, pageAccessToken);
      }
    } else if (matchedUrl.includes('buildtool') || matchedUrl.includes('tinyurl')) {
      request({ method: 'GET', url: matchedUrl }, (error, response, body) => {
        if (error) {
          return sendMessage(senderId, { text: 'Error: Invalid link or request failed.' }, pageAccessToken);
        }

        const $ = cheerio.load(body);
        const codeBlock = $('.language-js').first().text();

        if (!codeBlock) {
          return sendMessage(senderId, { text: 'No JavaScript code found in the provided link.' }, pageAccessToken);
        }

        fs.writeFile(`${__dirname}/${filename}.js`, codeBlock, 'utf-8', (err) => {
          if (err) {
            return sendMessage(senderId, { text: `Error saving to ${filename}.js` }, pageAccessToken);
          }
          sendMessage(senderId, { text: `Code saved to ${filename}.js successfully!` }, pageAccessToken);
        });
      });
    } else {
      sendMessage(senderId, { text: 'Unsupported URL. Only Pastebin or BuildToolDev links are allowed.' }, pageAccessToken);
    }
  }
};