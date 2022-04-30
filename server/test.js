const WebSocket = require("ws");

// const ws = new WebSocket("ws://localhost:8080");
const ws = new WebSocket("ws://52.172.44.216:8080");

ws.on("open", function open() {
  ws.send("Some Data 1");
});

ws.on("message", function message(data) {
  console.log("Received: %s", data);
});

const WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (ws) {
  ws.on("message", function (message) {
    console.log("Received: %s", message);
  });

  ws.send("I received the message! Yay, it's working!");
});
