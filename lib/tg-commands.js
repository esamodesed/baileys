/**
 * @rey2nd/baileys — Telegram Commands (HTML Mode)
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
  'Nama Bug berasal dari ngengat di komputer tahun 1947.',
  'Google memproses 8.5 miliar pencarian per hari.'
];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

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
    `👋 <b>Halo ${bot._esc(from)}!</b>\n\n` +
    `📋 <b>Menu Utama</b>\n` +
    `━━━━━━━━━━━━━━━━━━\n\n` +
    `Pilih opsi di bawah ya:`,
    mainMenuButtons()
  );
}

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
      await bot.send(chatId, `🏓 <b>Pong!</b>\n\n⚡ Bot aktif!`);
      return true;

    case '/info':
      await bot.send(chatId,
        `📦 <b>@rey2nd/baileys</b>\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `• Version: <code>v1.0.6</code>\n` +
        `• Author: <b>Rey Mahesa</b>\n` +
        `• Powered: <b>rey2nd.dev</b>\n` +
        `• Support: WhatsApp + Telegram + API\n\n` +
        `✨ <i>THANKS YOU FOR USE MY BAIL</i> ✨`
      );
      return true;

    case '/owner':
      await bot.send(chatId,
        `👤 <b>Owner Bot</b>\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `• Nama: <b>Rey Mahesa</b>\n` +
        `• Alias: <code>ry (TEMPEST)</code>\n` +
        `• GitHub: <a href="${LINKS.github}">@esamodesed</a>\n` +
        `• Web: <a href="${LINKS.web}">rey2nd.dev</a>`
      );
      return true;

    case '/projects':
      await bot.sendButton(chatId,
        `🚀 <b>Projects rey2nd</b>\n\nPilih project:`,
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
        `🌐 <b>Live Demos rey2nd</b>`,
        [
          [{ text: '📱 iQC', url: 'https://rey2nd-iqc.netlify.app', style: 'primary' }],
          [{ text: '🔐 ENC', url: 'https://rey2nd-enc.netlify.app', style: 'primary' }],
          [{ text: '🚀 Deploy', url: 'https://reynd-deploy.netlify.app', style: 'primary' }],
          [{ text: '🌐 Portfolio', url: 'https://rey-official.netlify.app', style: 'success' }]
        ]
      );
      return true;

    case '/quote':
      await bot.send(chatId, `💭 <i>${bot._esc(pickRandom(QUOTES))}</i>`);
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
      await bot.send(chatId, `🎲 Dadu: ${f[r-1]} (<b>${r}</b>)`);
      return true;
    }

    case '/coin': {
      const r = Math.random() < 0.5 ? '👑 KEPALA' : '🪙 EKOR';
      await bot.send(chatId, `🪙 Hasil: <b>${r}</b>`);
      return true;
    }

    case '/github':
      await bot.send(chatId,
        `🐙 <b>GitHub rey2nd</b>\n\n` +
        `<a href="${LINKS.github}">github.com/esamodesed/baileys</a>\n\n` +
        `<i>Fork, star, kontribusi — welcome!</i>`
      );
      return true;

    case '/color':
      await bot.sendButton(chatId,
        `🎨 <b>Demo Button Berwarna</b>\n\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `• <b>Primary</b> = Biru 🔵\n` +
        `• <b>Success</b> = Hijau 🟢\n` +
        `• <b>Danger</b> = Merah 🔴\n\n` +
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

async function handleTelegramCallback(bot, callback) {
  const chatId = callback.message.chat.id;
  const data = callback.data;
  const msgId = callback.message.message_id;

  await bot.answerCallback(callback.id, '✓');

  switch (data) {
    case 'menu_projects':
      await bot.editMessage(chatId, msgId,
        `🚀 <b>Projects rey2nd</b>\n\nPilih project:`,
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
        `👤 <b>Owner Bot</b>\n\n` +
        `• Nama: <b>Rey Mahesa</b>\n` +
        `• Alias: <code>ry (TEMPEST)</code>\n` +
        `• GitHub: <a href="${LINKS.github}">@esamodesed</a>`,
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
        `🎨 <b>Demo Button Berwarna</b>\n\nKlik tombol:`,
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
        `✅ <b>Terima kasih!</b>\n\nKamu setuju. ✨`,
        { keyboard: { inline_keyboard: [] } }
      );
      break;

    case 'cancel':
      await bot.editMessage(chatId, msgId,
        `❌ <b>Dibatalkan.</b>`,
        { keyboard: { inline_keyboard: [] } }
      );
      break;

    case 'menu_main':
      await bot.editMessage(chatId, msgId,
        `📋 <b>Menu Utama</b>\n\nPilih opsi:`,
        { keyboard: { inline_keyboard: mainMenuButtons() } }
      );
      break;
  }
}

module.exports = { handleTelegramCommand, handleTelegramCallback };
