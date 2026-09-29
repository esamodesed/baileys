const baileys = require('baileys');
const { TelegramBot } = require('./lib/Telegram');
const { createAPI } = require('./lib/API');
const { attachHelpers } = require('./lib/helpers');

const originalMakeWASocket = baileys.default || baileys.makeWASocket;

function makeWASocket(config) {
  const sock = originalMakeWASocket(config);
  return attachHelpers(sock);
}

module.exports = {
  ...baileys,
  default: makeWASocket,
  makeWASocket,
  TelegramBot,
  createAPI,
  attachHelpers,
  rey2ndVersion: '1.0.4'
};
