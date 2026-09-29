const { downloadMediaMessage } = require('baileys');

function attachHelpers(sock) {
  sock.sendText = async (jid, text, options = {}) => sock.sendMessage(jid, { text, ...options });

  sock.sendImage = async (jid, image, caption = '', options = {}) => sock.sendMessage(jid, {
    image: typeof image === 'string' ? { url: image } : image, caption, ...options
  });

  sock.sendVideo = async (jid, video, caption = '', options = {}) => sock.sendMessage(jid, {
    video: typeof video === 'string' ? { url: video } : video, caption, ...options
  });

  sock.sendAudio = async (jid, audio, options = {}) => sock.sendMessage(jid, {
    audio: typeof audio === 'string' ? { url: audio } : audio,
    mimetype: 'audio/mp4', ptt: options.ptt || false, ...options
  });

  sock.sendSticker = async (jid, sticker, options = {}) => sock.sendMessage(jid, {
    sticker: typeof sticker === 'string' ? { url: sticker } : sticker, ...options
  });

  sock.sendDoc = async (jid, doc, filename = 'file', options = {}) => sock.sendMessage(jid, {
    document: typeof doc === 'string' ? { url: doc } : doc,
    fileName: filename, mimetype: options.mimetype || 'application/octet-stream', ...options
  });

  sock.sendLocation = async (jid, latitude, longitude, options = {}) => sock.sendMessage(jid, {
    location: { degreesLatitude: latitude, degreesLongitude: longitude }, ...options
  });

  sock.sendContact = async (jid, contacts, options = {}) => {
    const vcard = contacts.map(c =>
      `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL;type=CELL;type=VOICE;waid=${c.number}:+${c.number}\nEND:VCARD`
    ).join('\n');
    return sock.sendMessage(jid, {
      contacts: { displayName: contacts[0].name, contacts: [{ vcard }] }, ...options
    });
  };

  sock.sendReaction = async (jid, key, emoji) => sock.sendMessage(jid, { react: { text: emoji, key } });

  sock.reply = async (jid, text, quoted, options = {}) =>
    sock.sendMessage(jid, { text, ...options }, { quoted });

  sock.sendButton = async (jid, text, buttons, options = {}) => sock.sendMessage(jid, {
    text,
    footer: options.footer || 'rey2nd.dev',
    buttons: buttons.map(b => ({
      buttonId: b.id,
      buttonText: { displayText: b.text },
      type: 1
    })),
    headerType: 1, ...options
  });

  sock.sendList = async (jid, text, buttonText, sections, options = {}) => sock.sendMessage(jid, {
    text, footer: options.footer || 'rey2nd.dev', buttonText, sections, ...options
  });

  sock.markRead = async (jid, key) => sock.readMessages([key]);

  sock.setTyping = async (jid, isTyping = true) =>
    sock.sendPresenceUpdate(isTyping ? 'composing' : 'paused', jid);

  sock.downloadMedia = async (message) => downloadMediaMessage(message, 'buffer', {});

  return sock;
}

module.exports = { attachHelpers };
