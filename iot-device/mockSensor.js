const WebSocket = require("ws");

// const ws = new WebSocket("ws://localhost:5000");
const ws = new WebSocket("ws://52.172.44.216:5000");

function LDRValue() {
  return Math.round(Math.random() * 100000);
}

ws.on("open", () => {
  let sensorValue = 0;
  let sensorStatus = (sensorValue) => {
    if (sensorValue < 50000) {
      return "Light";
    } else {
      return "Dark";
    }
  };
  setInterval(() => {
    sensorValue = LDRValue();
    const data = {
      type: "IOT_DEVICE",
      sensorData: {
        deviceId: "IOT_DEVICE_1",
        sensorType: "IOT_DEVICE",
        timestamp: Date.now(),
        sensorValue: sensorValue,
      },
    };
    ws.send(JSON.stringify(data));
  }, 1000);
});

ws.on("message", (data) => {
  console.log(data);
});
