const express = require("express");
const venom = require("venom-bot");

const app = express();
app.use(express.json());
const port = 8888;

venom
  .create({
    session: "apizap",
    multidevice: true, 
    headless: "new",
  })
  .then((client) => start(client))
  .catch((error) => console.log("ERROR", error));
  
function start(client) {
  app.post("/send-message", async (req, res) => {
    const { to, message } = req.body;
    client
      .sendText(to + "@c.us", message)
      .then((result) => res.send(result))
      .catch((error) => res.status(500).send(error));
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}