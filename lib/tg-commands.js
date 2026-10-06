/**
 * @rey2nd/baileys — Telegram Command Handler
 */

const { LINKS } = require('./banner');

const QUOTES = [
  'Talk is cheap. Show me the code.',
  'Dream. Build. Break. Repeat. — rey2nd',
  'Simplicity is the soul of efficiency.',
  'Yang penting jalan. — rey2nd',
  'Bug bukan error, itu fitur undocumented.'
];

const JOKES = [
  'Kenapa programmer suka kopi? Karena java-nya butuh di-brew!',
  'Ada 10 tipe orang: yang ngerti binary, dan yang gak.',
  'Programmer itu kayak penyihir — ngomong sama mesin, mesin nurut.'
];

const FACTS = [
  'JavaScript dibuat cuma dalam 10 hari loh!',
  'Nama "Bug" berasal dari ngengat di komputer tahun 1947.',
  'Google memproses 8.5 miliar pencarian per hari.'
];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ============ MAIN MENU BUTTON ============ */
function mainMenuButtons() {
  return [
    [{ text: '📋 Lihat Projects', callback_data: 'menu_projects', style: 'primary' }],
    [{ text: '👤 Info Owner', callback_data: 'menu_owner', style: 'primary' }],
    [{ text: '🎨 Demo Warna', callback_data: 'menu_color', style: 'primary' }],
    [{ text: '✅ Setuju', callback_data: 'agree', style: 'success' }],
    [{ text: '❌ Batal', callback_data: 'cancel', style: 'danger' }]
  ];
}

async function showMainMenu(bot, chatId, from) {
  await bot.sendButton(chatId,
    `👋 *Halo ${bot.bold(from)}!*\n\n` +
    `📋 *Menu Utama*\n` +
    `━━━━━━━━━━━━━━━━━━\n\n` +
    `Pilih opsi di bawah ya:`,
    mainMenuButtons()
  );
}

/* ============ COMMAND HANDLER ============ */
async function handleTelegramCommand(bot, msg, text) {
  const cmd = text.toLowerCase().trim().split(/\s+/)[0];
  const args = text.split(/\s+/).slice(1);
  const chatId = msg.chat.id;
  const from = msg.from?.first_name || 'User';

  switch (cmd) {

    case '/start':
    case '/menu':
    case '/help':
      await showMainMenu(bot, chatId, from);
      return true;

    case '/ping':
      await bot.send(chatId, `🏓 *Pong!*\n\n⚡ Bot aktif!`);
      return true;

    case '/info':
      await bot.send(chatId,
        `📦 *@rey2nd/baileys*\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `• Version: ${bot.code('v1.0.5')}\n` +
        `• Author: ${bot.bold('Rey Mahesa')}\n` +
        `• Powered: ${bot.bold('rey2nd.dev')}\n` +
        `• Support: WhatsApp + Telegram + API\n\n` +
        `✨ _THANKS YOU FOR USE MY BAIL_ ✨`
      );
      return true;

    case '/owner':
      await bot.send(chatId,
        `👤 *Owner Bot*\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `• Nama: ${bot.bold('Rey Mahesa')}\n` +
        `• Alias: ${bot.code('ry (TEMPEST)')}\n` +
        `• GitHub: ${bot.link('@esamodesed', LINKS.github)}\n` +
        `• Web: ${bot.link('rey2nd.dev', LINKS.web)}`
      );
      return true;

    case '/projects':
      await bot.sendButton(chatId,
        `🚀 *Projects rey2nd*\n\nPilih project:`,
        [
          [{ text: '📱 iQC', url: 'https://rey2nd-iqc.netlify.app', style: 'primary' }],
          [{ text: '🔐 ENC', url: 'https://rey2nd-enc.netlify.app', style: 'primary' }],
          [{ text: '🚀 Deploy', url: 'https://reynd-deploy.netlify.app', style: 'primary' }],
          [{ text: '🌐 Portfolio', url: 'https://rey-official.netlify.app', style: 'success' }]
        ]
      );
      return true;

    case '/live':
      await bot.sendButton(chatId,
        `🌐 *Live Demos rey2nd*`,
        [
          [{ text: '📱 iQC', url: 'https://rey2nd-iqc.netlify.app', style: 'primary' }],
          [{ text: '🔐 ENC', url: 'https://rey2nd-enc.netlify.app', style: 'primary' }],
          [{ text: '🚀 Deploy', url: 'https://reynd-deploy.netlify.app', style: 'primary' }],
          [{ text: '🌐 Portfolio', url: 'https://rey-official.netlify.app', style: 'success' }]
        ]
      );
      return true;

    case '/quote':
      await bot.send(chatId, `💭 _${bot._esc(pickRandom(QUOTES))}_`);
      return true;

    case '/joke':
      await bot.send(chatId, `😂 ${bot._esc(pickRandom(JOKES))}`);
      return true;

    case '/fact':
      await bot.send(chatId, `🎯 ${bot._esc(pickRandom(FACTS))}`);
      return true;

    case '/dice': {
      const r = Math.floor(Math.random() * 6) + 1;
      const f = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      await bot.send(chatId, `🎲 Dadu: ${f[r-1]} (${bot.bold(r)})`);
      return true;
    }

    case '/coin': {
      const r = Math.random() < 0.5 ? '👑 KEPALA' : '🪙 EKOR';
      await bot.send(chatId, `🪙 Hasil: ${bot.bold(r)}`);
      return true;
    }

    case '/github':
      await bot.send(chatId,
        `🐙 *GitHub rey2nd*\n\n` +
        `${bot.link('github.com/esamodesed/baileys', LINKS.github)}\n\n` +
        `_Fork, star, kontribusi — welcome!_`
      );
      return true;

    case '/color':
      await bot.sendButton(chatId,
        `🎨 *Demo Button Berwarna*\n\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `• ${bot.bold('Primary')} = Biru 🔵\n` +
        `• ${bot.bold('Success')} = Hijau 🟢\n` +
        `• ${bot.bold('Danger')} = Merah 🔴\n\n` +
        `Klik tombol di bawah:`,
        [
          [{ text: '🔵 Primary Button', callback_data: 'demo_primary', style: 'primary' }],
          [{ text: '🟢 Success Button', callback_data: 'demo_success', style: 'success' }],
          [{ text: '🔴 Danger Button', callback_data: 'demo_danger', style: 'danger' }]
        ]
      );
      return true;

    default:
      return false;
  }
}

/* ============ CALLBACK HANDLER ============ */
async function handleTelegramCallback(bot, callback) {
  const chatId = callback.message.chat.id;
  const data = callback.data;
  const msgId = callback.message.message_id;

  // Wajib: kasih response biar loading berhenti
  await bot.answerCallback(callback.id, '✓');

  switch (data) {

    case 'menu_projects':
      await bot.editMessage(chatId, msgId,
        `🚀 *Projects rey2nd*\n\nPilih project:`,
        {
          keyboard: {
            inline_keyboard: [
              [{ text: '📱 iQC', url: 'https://rey2nd-iqc.netlify.app', style: 'primary' }],
              [{ text: '🔐 ENC', url: 'https://rey2nd-enc.netlify.app', style: 'primary' }],
              [{ text: '🚀 Deploy', url: 'https://reynd-deploy.netlify.app', style: 'primary' }],
              [{ text: '↩️ Kembali', callback_data: 'menu_main', style: 'danger' }]
            ]
          }
        }
      );
      break;

    case 'menu_owner':
      await bot.editMessage(chatId, msgId,
        `👤 *Owner Bot*\n\n` +
        `• Nama: ${bot.bold('Rey Mahesa')}\n` +
        `• Alias: ${bot.code('ry (TEMPEST)')}\n` +
        `• GitHub: ${bot.link('@esamodesed', LINKS.github)}`,
        {
          keyboard: {
            inline_keyboard: [
              [{ text: '↩️ Kembali', callback_data: 'menu_main', style: 'danger' }]
            ]
          }
        }
      );
      break;

    case 'menu_color':
      await bot.editMessage(chatId, msgId,
        `🎨 *Demo Button Berwarna*\n\nKlik tombol:`,
        {
          keyboard: {
            inline_keyboard: [
              [{ text: '🔵 Primary', callback_data: 'demo_primary', style: 'primary' }],
              [{ text: '🟢 Success', callback_data: 'demo_success', style: 'success' }],
              [{ text: '🔴 Danger', callback_data: 'demo_danger', style: 'danger' }],
              [{ text: '↩️ Kembali', callback_data: 'menu_main', style: 'primary' }]
            ]
          }
        }
      );
      break;

    case 'demo_primary':
      await bot.answerCallback(callback.id, '🔵 Primary!');
      break;

    case 'demo_success':
      await bot.answerCallback(callback.id, '🟢 Success!');
      break;

    case 'demo_danger':
      await bot.answerCallback(callback.id, '🔴 Danger!');
      break;

    case 'agree':
      await bot.editMessage(chatId, msgId,
        `✅ *Terima kasih!*\n\n` +
        `Kamu setuju. ✨`,
        { keyboard: { inline_keyboard: [] } }
      );
      break;

    case 'cancel':
      await bot.editMessage(chatId, msgId,
        `❌ *Dibatalkan.*`,
        { keyboard: { inline_keyboard: [] } }
      );
      break;

    case 'menu_main':
      await bot.editMessage(chatId, msgId,
        `📋 *Menu Utama*\n\nPilih opsi:`,
        { keyboard: { inline_keyboard: mainMenuButtons() } }
      );
      break;
  }
}

module.exports = { handleTelegramCommand, handleTelegramCallback };
