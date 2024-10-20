const fs = require('fs');
const path = require('path');

function formatFont(text) {
  const fontMapping = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺",
    n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝗪", x: "𝗫", y: "𝗬", z: "𝗭",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
    N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    0: "𝟬", 1: "𝟭", 2: "𝟮", 3: "𝟯", 4: "𝟰", 5: "𝟱", 6: "𝟲", 7: "𝟳", 8: "𝟴", 9: "𝟵"
  };
  return text.split('').map(char => fontMapping[char] || char).join('');
}

module.exports = {
  name: 'help',
  description: 'Show available commands or details of a specific command',
  author: 'Cliff',
  execute(senderId, args, pageAccessToken, sendMessage) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => file.replace('.js', '') === commandName);

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        const name = command.name ? `➟ Name: ${command.name}\n` : "";
        const author = command.author ? `➟ Author: ${command.author}\n` : "";
        const description = command.description ? `➟ description: ${command.description}\n` : "";
        const commandDetails = `${name}${author}${description}`;

        return sendMessage(senderId, { text: commandDetails }, pageAccessToken);
      } else {
        return sendMessage(senderId, { text: `❌ Command not found: ${formatFont(commandName)}` }, pageAccessToken);
      }
    }

    const totalCommands = commandFiles.length;
    const commands = commandFiles.map((file, index) => {
      const command = require(path.join(commandsDir, file));
      return `\n${index + 1}. ${formatFont(command.name.toUpperCase())}\n`;
    });

    const helpMessage = `🛠️ ${formatFont("Available Commands")}\n\n${commands.join('\n')}\n\n📋 ${formatFont("Total Commands")}: ${totalCommands}`;
    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
