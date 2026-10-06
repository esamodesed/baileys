/**
 * @rey2nd/baileys — Startup Banner
 */

const BANNER = `
\x1b[36m
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║    ██████╗ ███████╗██╗   ██╗██████╗ ███╗   ██╗██████╗    ║
║    ██╔══██╗██╔════╝╚██╗ ██╔╝╚════██╗████╗  ██║██╔══██╗   ║
║    ██████╔╝█████╗   ╚████╔╝  █████╔╝██╔██╗ ██║██║  ██║   ║
║    ██╔══██╗██╔══╝    ╚██╔╝   ╚═══██╗██║╚██╗██║██║  ██║   ║
║    ██║  ██║███████╗   ██║   ██████╔╝██║ ╚████║██████╔╝   ║
║    ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═════╝ ╚═╝  ╚═══╝╚═════╝    ║
║                                                          ║
║              🚀  @rey2nd/baileys  🚀                     ║
║                                                          ║
║        ✨  THANKS YOU FOR USE MY BAIL  ✨                ║
║                                                          ║
║    ─────────────────────────────────────────────         ║
║    👤 Author  : Rey Mahesa (rey2nd.dev)                  ║
║    📦 Package : @rey2nd/baileys                          ║
║    📅 Version : v1.0.5                                   ║
║    🔗 GitHub  : github.com/esamodesed/baileys            ║
║    🌐 Web     : rey-official.netlify.app                 ║
║    ─────────────────────────────────────────────         ║
║                                                          ║
║           Dream · Build · Break · Repeat                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
\x1b[0m
`;

const SHORT_BANNER = `
\x1b[36m╔══════════════════════════════════════╗
║  📦 @rey2nd/baileys v1.0.5           ║
║  ✨ THANKS FOR USE MY BAIL ✨        ║
╚══════════════════════════════════════╝\x1b[0m
`;

function showBanner() {
  console.log(BANNER);
  console.log('\x1b[32m✅ Loading @rey2nd/baileys...\x1b[0m\n');
}

function showShortBanner() {
  console.log(SHORT_BANNER);
}

const LINKS = {
  github: 'https://github.com/esamodesed/baileys',
  web: 'https://rey-official.netlify.app',
  npm: 'https://www.npmjs.com/package/@rey2nd/baileys',
  telegram: 'https://t.me/hiformy',
  whatsapp: 'https://wa.me/6288985324385'
};

module.exports = { showBanner, showShortBanner, BANNER, SHORT_BANNER, LINKS };
