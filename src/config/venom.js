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
        console.log("🔹 QR Code atualizado! Escaneie para conectar.");
        qrCodeBase64 = base64Qr;
      },
      (status) => {
        console.log("📢 Status do Venom:", status);
      },
      {
        logQR: false,
        headless: "new",
        waitForLoginTimeout: 60000, // Aguarda 60 segundos antes de desistir
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
      console.log("✅ Bot conectado ao WhatsApp!");
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

  try {
    if (client) {
      await client.logout();
      client = null;
    }
  } catch (error) {
    console.error("❌ Erro ao deslogar do Venom-Bot:", error);
  }

  venomStarted = false;
  initializeVenom();
}

// Obtém o QR Code
function getQRCode() {
  return qrCodeBase64;
}

// Verifica se o Venom está conectado corretamente
function isConnected() {
  return client !== null && client.isConnected !== undefined;
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
