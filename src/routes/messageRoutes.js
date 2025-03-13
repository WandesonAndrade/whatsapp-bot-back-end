const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/status", messageController.getStatus);
router.get("/qr", messageController.getQRCode);
router.post("/send-message", messageController.sendMessage);
router.get("/disconnect", messageController.disconnectWhatsApp);
router.get("/restart", messageController.restartBot);

module.exports = router;
