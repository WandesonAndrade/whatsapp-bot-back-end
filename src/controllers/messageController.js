const {
  getClient,
  getQRCode,
  isConnected,
  restartVenom,
  getStatus,
} = require("../config/venom");

// Obtém o status do Venom-Bot
exports.getStatus = (req, res) => {
  res.json({ conectado: isConnected() });
};

// Obtém o QR Code
exports.getQRCode = (req, res) => {
  const qr = getQRCode();
  if (qr) {
    res.json({ qr });
  } else {
    res.status(404).json({ error: "QR Code ainda não gerado" });
  }
};

// Envia mensagem pelo WhatsApp
exports.sendMessage = async (req, res) => {
  try {
    const { number, message } = req.body;
    if (!number || !message) {
      return res
        .status(400)
        .json({ error: "Número e mensagem são obrigatórios" });
    }

    const client = getClient();
    if (!client) {
      return res.status(500).json({ error: "Venom-Bot não está conectado" });
    }

    await client.sendText(number + "@c.us", message);
    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao enviar mensagem", details: error.message });
  }
};

// Desconecta o WhatsApp
exports.disconnectWhatsApp = async (req, res) => {
  try {
    const client = getClient();
    if (!client) {
      return res.status(500).json({ error: "Venom-Bot não está conectado" });
    }

    console.log("Tentando desconectar o WhatsApp...");

    await client.logout(); // Desconecta
    console.log("WhatsApp desconectado com sucesso!");

    res.json({ success: true, message: "WhatsApp desconectado com sucesso!" });
  } catch (error) {
    console.error("Erro ao desconectar:", error);
    res
      .status(500)
      .json({ error: "Erro ao desconectar", details: error.message });
  }
};

// Reinicia o Venom-Bot sem reiniciar o servidor
exports.restartBot = async (req, res) => {
  console.log("Reiniciando o Venom-Bot...");
  restartVenom();
  res.json({ success: true, message: "Venom-Bot reiniciando..." });
};

// Rota para enviar o status atual para o front-end
exports.getBotStatus = (req, res) => {
  res.json({ status: getStatus() });
};
