module.exports = {
  name: "console",
  description: "Get all captured console logs",
  author: "Cliff (rest api)",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // If no logs yet

    // console.js
let logs = [];

// Save original console methods
const origLog = console.log;
const origError = console.error;
const origWarn = console.warn;

// Override console methods to capture logs
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

// Helper to return logs
function getConsoleText() {
  return logs.length > 0 ? logs.join("\n") : "No console logs yet.";
}
    const text = getConsoleText();

    await sendMessage(
      senderId,
      { text: "🖥 | Console Logs:\n\n" + text },
      pageAccessToken
    );
  },
};
