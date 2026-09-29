const https = require('https');

class TelegramBot {
  constructor(token) {
    this.token = token;
    this.handlers = {};
    this.offset = 0;
    this.running = false;
  }
  on(event, handler) { this.handlers[event] = handler; }
  async _request(method, data) {
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
          try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
          catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
  async send(chatId, text, options = {}) {
    return this._request('sendMessage', { chat_id: chatId, text, ...options });
  }
  async start() {
    this.running = true;
    console.log('🤖 Telegram bot started');
    while (this.running) {
      try {
        const res = await this._request('getUpdates', { offset: this.offset, timeout: 30 });
        if (res.result && res.result.length) {
          for (const update of res.result) {
            this.offset = update.update_id + 1;
            if (update.message && this.handlers.message) {
              this.handlers.message(update.message);
            }
          }
        }
      } catch (e) {
        console.error('Telegram error:', e.message);
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }
  stop() { this.running = false; }
}
module.exports = { TelegramBot };
