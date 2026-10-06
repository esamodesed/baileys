# @rey2nd/baileys

> Baileys Wrapper by **rey2nd.dev** — WhatsApp + Telegram + API

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

## 🤖 Telegram Bot

\`\`\`javascript
const { createTelegramBot } = require('@rey2nd/baileys');
const bot = createTelegramBot('YOUR_TOKEN');
bot.start();
\`\`\`

## 👤 Author

**Rey Mahesa** — [rey2nd.dev](https://rey-official.netlify.app)

## 📄 License

MIT
