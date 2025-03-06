const express = require("express");
const cors = require("cors");
const app = express();

// Habilitar CORS para todas as origens
app.use(cors());

// Ou, habilitar CORS para uma origem específica
// app.use(cors({ origin: 'http://localhost:5173' }));

app.post("/send-message", (req, res) => {
  // Lógica do seu endpoint
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
