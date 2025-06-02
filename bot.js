const { default: makeWASocket, useSingleFileAuthState, delay } = require("@whiskeysockets/baileys");
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./auth.json');
const admins = ['254705101667@s.whatsapp.net', '254114468030@s.whatsapp.net'];

async function startBot() {
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

    if (admins.includes(sender)) {
      await sock.sendMessage(from, {
        text: "Choose an option 👇",
        buttons: [
          { buttonId: 'owner', buttonText: { displayText: '👑 OWNER' }, type: 1 },
          { buttonId: 'script', buttonText: { displayText: '📦 SCRIPT BUYER' }, type: 1 },
          { buttonId: 'group', buttonText: { displayText: '👥 GRUP MENU' }, type: 1 },
        ],
        headerType: 1,
      });
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message?.buttonsResponseMessage) return;

    const from = msg.key.remoteJid;
    const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;

    if (buttonId === 'owner') {
      await sock.sendMessage(from, { text: "👑 *Owner:* wa.me/254705101667" });
    } else if (buttonId === 'script') {
      await sock.sendMessage(from, { text: "📦 *Buy Script:* wa.me/254114468030" });
    } else if (buttonId === 'group') {
      await sock.sendMessage(from, { text: "👥 *Group Link:* https://chat.whatsapp.com/yourgroupID" });
    }
  });
}

startBot();
