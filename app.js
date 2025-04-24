const express = require("express");
const cors = require("cors");
const venom = require("venom-bot");

const app = express();
app.use(express.json());
app.use(cors()); // Habilita CORS para todas as origens

let client;
let qrCode = null;

// Inicializa o Venom apenas uma vez
venom
  .create(
    "apizap",
    (base64Qr) => {
      qrCode = `${base64Qr}`;
      console.log("QR Code gerado:", qrCode);
    },
    undefined,
    {
      multidevice: true,
      browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Caminho do Chrome
    }
  )
  .then((venomClient) => {
    client = venomClient;
    console.log("Venom client initialized");
  })
  .catch((error) => {
    console.error("ERROR initializing Venom:", error);
  });

// Rota para obter o QR Code
app.get("/qr-code", (req, res) => {
  if (!qrCode) {
    return res.status(404).json({ error: "QR Code not generated yet" });
  }
  res.json({ qrCode });
});

// Rota para enviar mensagens
app.post("/send-message", async (req, res) => {
  const { to, message } = req.body;

  if (!client) {
    return res.status(500).json({ error: "Venom client not initialized" });
  }

  try {
    const result = await client.sendText(`${to}@c.us`, message);
    res.json(result);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Inicia o servidor na porta 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});