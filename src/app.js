const express = require("express");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Rotas do WhatsApp
app.use("/whatsapp", messageRoutes);

module.exports = app;
