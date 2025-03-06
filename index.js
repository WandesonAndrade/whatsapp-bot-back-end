const express = require("express");
const venom = require("venom-bot");
const cors = require("cors"); // Importando o CORS

const app = express();
app.use(express.json());
app.use(cors()); // Permitindo CORS para todas as origens, ou você pode restringir para uma origem específica
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Permite apenas esse domínio
  })
);

// Função para iniciar a API do WhatsApp
const start = (client) => {
  app.post("/send-message", async (req, res) => {
    try {
      const { number, message } = req.body;

      // Verifica se os campos necessários foram enviados
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

  // Só inicia o servidor depois que o Venom está pronto
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });
};

// Cria a sessão do Venom-Bot e inicia a API após estar pronto
venom
  .create({
    session: "api-whatsapp",
    headless: "new", // Usa o novo modo headless compatível com Chrome 133+
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
