// console.js
let logs = [];

// Save original console methods
const origLog = console.log;
const origError = console.error;
const origWarn = console.warn;

// Override console.log
console.log = function (...args) {
  logs.push(args.join(" "));
  origLog.apply(console, args);
};

// Override console.error
console.error = function (...args) {
  logs.push("[ERROR] " + args.join(" "));
  origError.apply(console, args);
};

// Override console.warn
console.warn = function (...args) {
  logs.push("[WARN] " + args.join(" "));
  origWarn.apply(console, args);
};

// Function to get logs as text
function getLogs() {
  return logs.join("\n");
}

module.exports = { getLogs };
