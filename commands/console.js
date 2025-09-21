module.exports = {
  name: "console",
  description: "Get all captured console logs",
  author: "Cliff (rest api)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const text = getConsoleText();
    let logs = [];

const origLog = console.log;
const origError = console.error;
const origWarn = console.warn;

console.log = function (...args) {
  logs.push(args.join(" "));
  origLog.apply(console, args);
};
console.error = function (...args) {
  logs.push("[ERROR] " + args.join(" "));
  origError.apply(console, args);
};
console.warn = function (...args) {
  logs.push("[WARN] " + args.join(" "));
  origWarn.apply(console, args);
};

function getConsoleText() {
  return logs.length > 0 ? logs.join("\n") : "No logs captured yet.";
}
    
    await sendMessage(
      senderId,
      { text: "🖥 | Console Logs:\n\n" + text },
      pageAccessToken
    );
  },
};
