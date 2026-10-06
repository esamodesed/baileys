const baileys = require('baileys');

const originalMakeWASocket = baileys.default || baileys.makeWASocket;

function makeWASocket(config) {
  const sock = originalMakeWASocket(config);
  return attachHelpers(sock);
}

/* ============ HELPERS WA ============ */
function attachHelpers(sock) {
  sock.sendText = async (jid, text, options = {}) => sock.sendMessage(jid, { text, ...options });
  sock.sendImage = async (jid, image, caption = '', options = {}) => sock.sendMessage(jid, {
    image: typeof image === 'string' ? { url: image } : image, caption, ...options
  });
  sock.sendAudio = async (jid, audio, options = {}) => sock.sendMessage(jid, {
    audio: typeof audio === 'string' ? { url: audio } : audio,
    mimetype: 'audio/mp4', ptt: options.ptt || false, ...options
  });
  sock.reply = async (jid, text, quoted, options = {}) =>
    sock.sendMessage(jid, { text, ...options }, { quoted });
  return sock;
}

/* ============ TELEGRAM BOT ============ */
const https = require('https');

class TelegramBot {
  constructor(token, options = {}) {
    this.token = token;
    this.handlers = {};
    this.offset = 0;
    this.running = false;
    this.parseMode = options.parseMode || 'MarkdownV2';
  }

  on(event, handler) { this.handlers[event] = handler; return this; }

  async _req(method, data = {}) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(data);
      const req = https.request({
        hostname: 'api.telegram.org',
        path: `/bot${this.token}/${method}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, res => {
        let chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(Buffer.concat(chunks).toString());
            if (!parsed.ok) reject(new Error(parsed.description || 'TG error'));
            else resolve(parsed.result);
          } catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  _esc(text) { return String(text).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&'); }

  async send(chatId, text, options = {}) {
    return this._req('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: options.parseMode || this.parseMode,
      disable_web_page_preview: options.noPreview || false,
      reply_markup: options.keyboard || undefined,
      ...options
    });
  }

  async sendPhoto(chatId, photo, caption = '') {
    return this._req('sendPhoto', {
      chat_id: chatId, photo, caption,
      parse_mode: this.parseMode
    });
  }

  async sendButton(chatId, text, buttons) {
    const keyboard = Array.isArray(buttons[0]) ? buttons : [buttons];
    return this._req('sendMessage', {
      chat_id: chatId, text,
      parse_mode: this.parseMode,
      reply_markup: {
        inline_keyboard: keyboard.map(row => row.map(b => ({
          text: b.text,
          url: b.url || undefined,
          callback_data: b.callback_data || undefined
        })))
      }
    });
  }

  bold(t) { return `*${this._esc(t)}*`; }
  italic(t) { return `_${this._esc(t)}_`; }
  code(t) { return '`' + this._esc(t) + '`'; }
  spoiler(t) { return `||${this._esc(t)}||`; }
  link(text, url) { return `[${this._esc(text)}](${url})`; }

  async start() {
    this.running = true;
    console.log('🤖 Telegram bot started');
    while (this.running) {
      try {
        const updates = await this._req('getUpdates', {
          offset: this.offset, timeout: 30,
          allowed_updates: ['message', 'callback_query']
        });
        if (updates && updates.length) {
          for (const u of updates) {
            this.offset = u.update_id + 1;
            if (u.message && this.handlers.message) this.handlers.message(u.message);
            if (u.callback_query && this.handlers.callback) this.handlers.callback(u.callback_query);
          }
        }
      } catch (e) {
        console.error('TG error:', e.message);
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }

  stop() { this.running = false; }
}

/* ============ TELEGRAM COMMANDS ============ */
async function handleTelegramCommand(bot, msg, text) {
  const cmd = text.toLowerCase().trim().split(/\s+/)[0];
  const chatId = msg.chat.id;
  const from = msg.from?.first_name || 'User';

  switch (cmd) {
    case '/start':
    case '/menu':
    case '/help':
      await bot.send(chatId,
        `👋 *Halo ${bot.bold(from)}!*\n\n` +
        `Selamat datang di *@rey2nd/baileys* bot!\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `📋 *MENU:*\n` +
        `• /ping — Test bot\n` +
        `• /info — Info bot\n` +
        `• /projects — List project\n` +
        `• /quote — Quote random\n` +
        `• /joke — Joke random\n` +
        `• /dice — Lempar dadu\n` +
        `• /github — GitHub\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Powered by ${bot.bold('rey2nd.dev')} ✨`
      );
      return true;

    case '/ping':
      await bot.send(chatId, `🏓 *Pong!*`);
      return true;

    case '/info':
      await bot.send(chatId,
        `📦 *@rey2nd/baileys*\n` +
        `• Version: ${bot.code('v1.0.5')}\n` +
        `• Author: ${bot.bold('Rey Mahesa')}\n` +
        `• Powered: ${bot.bold('rey2nd.dev')}\n\n` +
        `✨ _THANKS YOU BRO FOR USE_ ✨`
      );
      return true;

    case '/projects':
      await bot.sendButton(chatId,
        `🚀 *Projects rey2nd*`,
        [
          [{ text: '📱 iQC', url: 'https://rey2nd-iqc.netlify.app' }],
          [{ text: '🔐 ENC', url: 'https://rey2nd-enc.netlify.app' }],
          [{ text: '🚀 Deploy', url: 'https://reynd-deploy.netlify.app' }],
          [{ text: '🌐 Portfolio', url: 'https://rey-official.netlify.app' }]
        ]
      );
      return true;

    case '/quote': {
      const Q = ['Talk is cheap. Show me the code.', 'Dream. Build. Break. Repeat.', 'Yang penting jalan.'];
      await bot.send(chatId, `💭 _${bot._esc(Q[Math.floor(Math.random() * Q.length)])}_`);
      return true;
    }

    case '/joke': {
      const J = ['Kenapa programmer suka kopi? Karena java butuh di-brew!', 'Bug bukan error, itu fitur undocumented.'];
      await bot.send(chatId, `😂 ${bot._esc(J[Math.floor(Math.random() * J.length)])}`);
      return true;
    }

    case '/dice': {
      const r = Math.floor(Math.random() * 6) + 1;
      const f = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      await bot.send(chatId, `🎲 Dadu: ${f[r-1]} (${bot.bold(r)})`);
      return true;
    }

    case '/github':
      await bot.send(chatId,
        `🐙 *GitHub rey2nd*\n\n` +
        `${bot.link('github.com/esamodesed/baileys', 'https://github.com/esamodesed/baileys')}`
      );
      return true;

    default:
      return false;
  }
}

function createTelegramBot(token, options = {}) {
  const bot = new TelegramBot(token, options);
  bot.on('message', async (msg) => {
    const text = msg.text || '';
    if (!text.startsWith('/')) return;
    const handled = await handleTelegramCommand(bot, msg, text);
    if (!handled && options.onCommand) options.onCommand(bot, msg, text);
  });
  return bot;
}

module.exports = {
  ...baileys,
  default: makeWASocket,
  makeWASocket,
  TelegramBot,
  createTelegramBot,
  handleTelegramCommand,
  attachHelpers,
  rey2ndVersion: '1.0.5'
};
