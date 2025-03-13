const venom = require("venom-bot");

let client = null;
let qrCodeBase64 = null;
let venomStarted = false;

// Inicializa o Venom-Bot
async function initializeVenom() {
  if (venomStarted) return;
  venomStarted = true;

  venom
    .create(
      "api-whatsapp",
      (base64Qr) => {
        console.log("QR Code atualizado!");
        qrCodeBase64 = base64Qr;
      },
      undefined,
      {
        logQR: false,
        headless: "new",
        browserArgs: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
        ],
      }
    )
    .then((bot) => {
      console.log("📲 Bot conectado ao WhatsApp!");
      client = bot;
      qrCodeBase64 = null; // Remove o QR Code após conexão bem-sucedida
    })
    .catch((error) => {
      console.error("❌ Erro ao iniciar Venom-Bot:", error);
      venomStarted = false;
    });
}

// Reinicia o Venom-Bot
async function restartVenom() {
  console.log("🔄 Reiniciando Venom-Bot...");
  if (client) {
    await client.logout();
    client = null;
  }
  venomStarted = false;
  initializeVenom();
}

// Obtém o QR Code
function getQRCode() {
  return qrCodeBase64;
}

// Verifica se o Venom está conectado
function isConnected() {
  return client !== null;
}

// Obtém o cliente Venom
function getClient() {
  return client;
}

module.exports = {
  initializeVenom,
  restartVenom,
  getQRCode,
  isConnected,
  getClient,
};
