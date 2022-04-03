const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", function open() {
  ws.send("Some Data");
});

ws.on("message", function message(data) {
  console.log("Received: %s", data);
});
