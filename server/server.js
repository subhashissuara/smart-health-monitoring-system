require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const http = require("http");
const WebSocket = require("ws");
var helmet = require("helmet");
var morgan = require("morgan");
var fs = require("fs");
var path = require("path");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

var logStream = fs.createWriteStream(path.join(__dirname, "logs/access.log"), { flags: "a" });

// Connect DB
connectDB();

const app = express();

app.use(morgan("dev", { stream: logStream }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

app.use("/api/authenticate", require("./routes/authenticate"));
app.use("/api/authorize", require("./routes/authorize"));

// Error Handler
app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

DASHBOARDS = [];

wss.on("connection", function connection(ws) {
  console.log("New Device Connected!");

  ws.on("message", (data) => {
    // console.log(data);

    var jsonData = {};
    try {
      jsonData = JSON.parse(data);
      ws.deviceId = jsonData.deviceId;
    } catch (error) {
      console.log(`Parse Error: ${error}`);
    }

    if (jsonData.type === "DASHBOARD") {
      DASHBOARDS.push(ws);
    }

    if (jsonData.type === "IOT_DEVICE") {
      if (DASHBOARDS.length > 0) {
        for (let i = 0; i < DASHBOARDS.length; i++) {
          DASHBOARDS[i].send(JSON.stringify(jsonData.sensorData));
        }
      }
    }
  });

  ws.on("close", () => {
    console.log(`${ws.deviceId} Disconnected!`);
  });
});

const PORT = process.env.PORT || 5000;

const serverListener = server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  serverListener.close(() => process.exit(1));
});
