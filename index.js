const app = require("./src/app");
require("dotenv").config();
const { initializeVenom } = require("./src/config/venom");

const port = process.env.PORT || 3000;

// Inicia o servidor primeiro, depois o Venom-Bot
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  initializeVenom();
});
