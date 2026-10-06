/**
 * @rey2nd/baileys
 * Baileys Wrapper by rey2nd.dev
 * WhatsApp + Telegram + API
 */

const baileys = require('baileys');
const { TelegramBot } = require('./lib/Telegram');
const { createAPI } = require('./lib/API');
const { showBanner, showShortBanner, LINKS } = require('./lib/banner');
const { handleTelegramCommand, handleTelegramCallback } = require('./lib/tg-commands');

const originalMakeWASocket = baileys.default || baileys.makeWASocket;

/* ============ SHOW BANNER (sekali aja) ============ */
let bannerShown = false;
function showBannerOnce() {
  if (!bannerShown) {
    showBanner();
    bannerShown = true;
  }
}

/* ============ WHATSAPP SOCKET + HELPERS ============ */
function makeWASocket(config) {
  showBannerOnce();
  const sock = originalMakeWASocket(config);
  return attachHelpers(sock);
}

function attachHelpers(sock) {
  sock.sendText = async (jid, text, options = {}) =>
    sock.sendMessage(jid, { text, ...options });

  sock.sendImage = async (jid, image, caption = '', options = {}) =>
    sock.sendMessage(jid, {
      image: typeof image === 'string' ? { url: image } : image,
      caption, ...options
    });

  sock.sendVideo = async (jid, video, caption = '', options = {}) =>
    sock.sendMessage(jid, {
      video: typeof video === 'string' ? { url: video } : video,
      caption, ...options
    });

  sock.sendAudio = async (jid, audio, options = {}) =>
    sock.sendMessage(jid, {
      audio: typeof audio === 'string' ? { url: audio } : audio,
      mimetype: 'audio/mp4',
      ptt: options.ptt || false,
      ...options
    });

  sock.sendSticker = async (jid, sticker, options = {}) =>
    sock.sendMessage(jid, {
      sticker: typeof sticker === 'string' ? { url: sticker } : sticker,
      ...options
    });

  sock.sendDoc = async (jid, doc, filename = 'file', options = {}) =>
    sock.sendMessage(jid, {
      document: typeof doc === 'string' ? { url: doc } : doc,
      fileName: filename,
      mimetype: options.mimetype || 'application/octet-stream',
      ...options
    });

  sock.sendLocation = async (jid, lat, lng, options = {}) =>
    sock.sendMessage(jid, {
      location: { degreesLatitude: lat, degreesLongitude: lng },
      ...options
    });

  sock.sendReaction = async (jid, key, emoji) =>
    sock.sendMessage(jid, { react: { text: emoji, key } });

  sock.reply = async (jid, text, quoted, options = {}) =>
    sock.sendMessage(jid, { text, ...options }, { quoted });

  // Button berwarna untuk WhatsApp
  sock.sendButtonColor = async (jid, text, buttons, options = {}) =>
    sock.sendMessage(jid, {
      text,
      footer: options.footer || 'rey2nd.dev',
      interactiveButtons: buttons.map(b => ({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: b.text,
          id: b.id
        })
      })),
      ...options
    });

  sock.markRead = async (jid, key) => sock.readMessages([key]);
  sock.setTyping = async (jid, isTyping = true) =>
    sock.sendPresenceUpdate(isTyping ? 'composing' : 'paused', jid);

  return sock;
}

/* ============ TELEGRAM BOT ============ */
function createTelegramBot(token, options = {}) {
  showBannerOnce();
  const bot = new TelegramBot(token, options);

  // Auto-handle message
  bot.on('message', async (msg) => {
    const text = msg.text || msg.caption || '';
    if (!text.startsWith('/')) return;
    const handled = await handleTelegramCommand(bot, msg, text);
    if (!handled && options.onCommand) {
      options.onCommand(bot, msg, text);
    }
  });

  // Auto-handle callback (button berwarna)
  bot.on('callback', async (callback) => {
    await handleTelegramCallback(bot, callback);
  });

  return bot;
}

/* ============ EXPORT ============ */
module.exports = {
  ...baileys,
  default: makeWASocket,
  makeWASocket,
  attachHelpers,
  TelegramBot,
  createTelegramBot,
  createAPI,
  handleTelegramCommand,
  handleTelegramCallback,
  showBanner,
  showShortBanner,
  LINKS,
  rey2ndVersion: '1.0.5'
};
