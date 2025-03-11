const express = require("express");
const venom = require("venom-bot");
const cors = require("cors");

const app = express();
app.use(express.json());

// Habilita CORS apenas para o frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const port = 3000;
let qrCodeBase64 = null; // Variável global para armazenar o QR Code

// Endpoint para obter o QR Code
// Rota para gerar e retornar o QR code em base64
app.get("/qr", (req, res) => {
  venom
    .create("sessionName", (base64Qr, asciiQR, attempts, urlCode) => {
      // Retorna o QR code em base64 para o front-end
      res.json({ qr: base64Qr });
    })
    .catch((erro) => {
      console.log(erro);
      res.status(500).json({ error: "Erro ao gerar QR code" });
    });
});

// Função para iniciar a API do WhatsApp
const start = (client) => {
  client.onStateChange((state) => {
    console.log("Estado do cliente:", state);
    if (state === "CONNECTED") {
      qrCodeBase64 = null; // Remove o QR Code após conexão
    }
  });

  client.onQRCode((qr) => {
    console.log("QR Code atualizado!");
    qrCodeBase64 = qr; // Armazena o QR Code em base64
  });

  // Endpoint para enviar mensagem
  app.post("/send-message", async (req, res) => {
    try {
      const { number, message } = req.body;

      if (!number || !message) {
        return res
          .status(400)
          .json({ error: "Número e mensagem são obrigatórios" });
      }

      await client.sendText(number + "@c.us", message);
      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao enviar mensagem", details: error.message });
    }
  });

  // Inicia o servidor na porta definida
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });
};

// Cria a sessão do Venom-Bot e inicia a API após estar pronto
venom
  .create({
    session: "api-whatsapp",
    headless: "new",
    browserArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  })
  .then((client) => start(client))
  .catch((error) => {
    console.error("Erro ao iniciar Venom-Bot:", error);
  });
