const app = require("./src/app");
const { initializeVenom } = require("./src/config/venom");

const port = 3000;

// Inicia o servidor primeiro, depois o Venom-Bot
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  initializeVenom();
});
