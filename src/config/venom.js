const venom = require("venom-bot");

let client = null;
let qrCodeBase64 = null;
let venomStarted = false;

const CHROMIUM_PATH = "/usr/bin/chromium-browser";
// Função para atualizar o status
function setStatus(status) {
  currentStatus = status;
}

const getStatus = () => currentStatus;

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
        setStatus(status); // Atualiza o status conforme o Venom retorna
      },
      {
        executablePath: CHROMIUM_PATH,
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
      setStatus("Conectado ao WhatsApp!");
    })
    .catch((error) => {
      console.error("❌ Erro ao iniciar Venom-Bot:", error);
      venomStarted = false;
      setStatus("Erro ao conectar...");
    });
}

// Reinicia o Venom-Bot
async function restartVenom() {
  console.log("🔄 Reiniciando Venom-Bot...");

  try {
    // Verifica se o cliente existe e está conectado antes de tentar desconectar
    if (client && client.logout) {
      await client.logout(); // Desconecta
      console.log("🔴 WhatsApp desconectado com sucesso!");
    }

    // Após desconectar, reinicia o Venom-Bot
    await initializeVenom();
    console.log("✅ Venom-Bot reiniciado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao reiniciar o Venom-Bot:", error);
  }
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
  getStatus,
};
