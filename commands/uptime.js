const os = require('os');
const fs = require('fs').promises;
const pidusage = require('pidusage');

let fontEnabled = true;

function formatFont(text) { 
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (fontEnabled && char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }
  return formattedText;
}

module.exports = {
  name: "uptime",
  description: "Get bot uptime and system information",
  author: "Cliff",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const startTime = await module.exports.getStartTimestamp();
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const usage = await pidusage(process.pid);

    const osInfo = {
      platform: os.platform(),
      architecture: os.arch(),
      homedir: os.homedir(),
      hostname: os.hostname(),
      release: os.release(),
      freeMemory: os.freemem(),
    };

    const uptimeMessage = module.exports.getUptime(uptimeSeconds);
    const timeStart = Date.now();
    const returnResult = formatFont(`Server Running for ${uptimeMessage}\n\n❖ CPU Usage: ${usage.cpu.toFixed(1)}%\n❖ RAM Usage: ${module.exports.byte2mb(usage.memory)}\n❖ Cores: ${os.cpus().length}\n❖ Ping: ${Date.now() - timeStart}ms\n❖ OS Platform: ${osInfo.platform}\n❖ CPU Architecture: ${osInfo.architecture}`);

    await module.exports.saveStartTimestamp(startTime); 
    sendMessage(senderId, { text: returnResult }, pageAccessToken);
  },

  byte2mb(bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
  },

  async getStartTimestamp() {
    try {
      const startTimeStr = await fs.readFile('time.txt', 'utf8');
      return parseInt(startTimeStr);
    } catch (error) {
      return Date.now();
    }
  },

  async saveStartTimestamp(timestamp) {
    try {
      await fs.writeFile('time.txt', timestamp.toString());
    } catch (error) {
      console.error('Error saving start timestamp:', error);
    }
  },

  getUptime(uptime) {
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    return `${months} Month(s), ${remainingDays} day(s), ${hours} hour(s), ${mins} minute(s), ${seconds} second(s)`;
  }
};