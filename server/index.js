const WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (ws) {
  ws.on("message", function (message) {
    console.log("Received: %s", message);
  });

  ws.send("I received the message! Yay, it's working!");
});
