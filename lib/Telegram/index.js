/**
 * @rey2nd/baileys — Telegram Bot
 * Support: button berwarna (primary/success/danger), format, media, dll
 */

const https = require('https');

class TelegramBot {
  constructor(token, options = {}) {
    this.token = token;
    this.handlers = {};
    this.offset = 0;
    this.running = false;
    this.pollTimeout = options.pollTimeout || 30;
    this.parseMode = options.parseMode || 'MarkdownV2';
  }

  on(event, handler) {
    this.handlers[event] = handler;
    return this;
  }

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

  _esc(text) {
    return String(text).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  }

  /* ============ KIRIM PESAN ============ */
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

  async sendPlain(chatId, text, options = {}) {
    return this._req('sendMessage', {
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      ...options
    });
  }

  /* ============ MEDIA ============ */
  async sendPhoto(chatId, photo, caption = '') {
    return this._req('sendPhoto', {
      chat_id: chatId, photo, caption, parse_mode: this.parseMode
    });
  }

  async sendVideo(chatId, video, caption = '') {
    return this._req('sendVideo', {
      chat_id: chatId, video, caption, parse_mode: this.parseMode
    });
  }

  async sendAudio(chatId, audio, options = {}) {
    return this._req('sendAudio', { chat_id: chatId, audio, ...options });
  }

  async sendDocument(chatId, doc, options = {}) {
    return this._req('sendDocument', { chat_id: chatId, document: doc, ...options });
  }

  async sendSticker(chatId, sticker) {
    return this._req('sendSticker', { chat_id: chatId, sticker });
  }

  async sendLocation(chatId, lat, lng) {
    return this._req('sendLocation', {
      chat_id: chatId, latitude: lat, longitude: lng
    });
  }

  /* ============ BUTTON BERWARNA ============ */
  async sendButton(chatId, text, buttons, options = {}) {
    const keyboard = Array.isArray(buttons[0]) ? buttons : [buttons];
    return this._req('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: options.parseMode || this.parseMode,
      reply_markup: {
        inline_keyboard: keyboard.map(row =>
          row.map(b => {
            const btn = {};
            if (b.text) btn.text = b.text;
            if (b.callback_data) btn.callback_data = b.callback_data;
            if (b.url) btn.url = b.url;
            // ⭐ STYLE BERWARNA — primary / success / danger
            if (b.style) btn.style = b.style;
            return btn;
          })
        )
      },
      ...options
    });
  }

  /* ============ MENU KEYBOARD ============ */
  async sendMenu(chatId, text, menuButtons) {
    return this._req('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: this.parseMode,
      reply_markup: {
        keyboard: menuButtons.map(row => row.map(t => ({ text: t }))),
        resize_keyboard: true,
        one_time_keyboard: false
      }
    });
  }

  /* ============ EDIT & DELETE ============ */
  async editMessage(chatId, messageId, newText, options = {}) {
    return this._req('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: newText,
      parse_mode: options.parseMode || this.parseMode,
      reply_markup: options.keyboard || undefined
    });
  }

  async deleteMessage(chatId, messageId) {
    return this._req('deleteMessage', {
      chat_id: chatId, message_id: messageId
    });
  }

  /* ============ ANSWER CALLBACK ============ */
  async answerCallback(callbackId, text = '') {
    return this._req('answerCallbackQuery', {
      callback_query_id: callbackId,
      text
    });
  }

  /* ============ TYPING ============ */
  async setTyping(chatId, isTyping = true) {
    return this._req('sendChatAction', {
      chat_id: chatId,
      action: isTyping ? 'typing' : 'cancel'
    });
  }

  /* ============ FORMAT HELPERS ============ */
  bold(t) { return `*${this._esc(t)}*`; }
  italic(t) { return `_${this._esc(t)}_`; }
  underline(t) { return `__${this._esc(t)}__`; }
  strike(t) { return `~${this._esc(t)}~`; }
  spoiler(t) { return `||${this._esc(t)}||`; }
  code(t) { return '`' + this._esc(t) + '`'; }
  pre(t, lang = '') { return '```' + lang + '\n' + t + '\n```'; }
  link(text, url) { return `[${this._esc(text)}](${url})`; }

  /* ============ POLLING ============ */
  async start() {
    this.running = true;
    console.log('🤖 Telegram bot started');
    while (this.running) {
      try {
        const updates = await this._req('getUpdates', {
          offset: this.offset,
          timeout: this.pollTimeout,
          allowed_updates: ['message', 'callback_query', 'edited_message']
        });
        if (updates && updates.length) {
          for (const u of updates) {
            this.offset = u.update_id + 1;
            if (u.message && this.handlers.message) this.handlers.message(u.message);
            if (u.edited_message && this.handlers.editedMessage) this.handlers.editedMessage(u.edited_message);
            if (u.callback_query && this.handlers.callback) this.handlers.callback(u.callback_query);
          }
        }
      } catch (e) {
        console.error('TG error:', e.message);
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }

  stop() {
    this.running = false;
    console.log('🛑 Telegram bot stopped');
  }
}

module.exports = { TelegramBot };
