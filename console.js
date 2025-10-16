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


function getLogs() {
  return logs.join("\n");
}

module.exports = { getLogs };
