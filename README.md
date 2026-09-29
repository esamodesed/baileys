# @rey2nd/baileys

> Baileys MD Wrapper by **rey2nd.dev** — WhatsApp Bot + Telegram Bot + API

## 📦 Install

\`\`\`bash
npm install @rey2nd/baileys
\`\`\`

## 🚀 WhatsApp Bot

\`\`\`javascript
const makeWASocket = require('@rey2nd/baileys').default;
const { useMultiFileAuthState } = require('@rey2nd/baileys');

(async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({ auth: state });
  sock.ev.on('creds.update', saveCreds);
})();
\`\`\`

## 🎯 Helper Functions

- `sock.sendText(jid, text)`
- `sock.sendImage(jid, url, caption)`
- `sock.sendVideo(jid, url, caption)`
- `sock.sendAudio(jid, url, { ptt })`
- `sock.sendSticker(jid, url)`
- `sock.sendDoc(jid, url, filename)`
- `sock.sendLocation(jid, lat, lng)`
- `sock.sendContact(jid, contacts)`
- `sock.sendReaction(jid, key, emoji)`
- `sock.sendButton(jid, text, buttons)`
- `sock.reply(jid, text, quoted)`
- `sock.setTyping(jid, true)`

## 📱 Telegram Bot

\`\`\`javascript
const { TelegramBot } = require('@rey2nd/baileys');
const bot = new TelegramBot('YOUR_TOKEN');
bot.on('message', msg => {
  if (msg.text === '/ping') bot.send(msg.chat.id, '🏓 Pong!');
});
bot.start();
\`\`\`

## 🌐 REST API

\`\`\`javascript
const { createAPI } = require('@rey2nd/baileys');
const api = createAPI({ port: 3000 });
api.get('/', () => ({ hello: 'rey2nd' }));
api.start();
\`\`\`

## 👤 Author

**Rey Mahesa** — [rey2nd.dev](https://rey-official.netlify.app)

## 📄 License

MIT
