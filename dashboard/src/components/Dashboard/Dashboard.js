import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../NavBar/NavBar";
import { Patient } from "../../config/sensorConfigs";
import Sensor from "../Sensor/Sensor";
import config from "../../config/config.json";

const Dashboard = ({ history }) => {
  const [error, setError] = useState("");
  const [sensorData, setSensorData] = useState({});
  const ws = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    }

    const connectWebSocket = () => {
      ws.current = new WebSocket(config.PRODUCTION_URL_WS);
      const jsonClientType = {
        deviceId: "DASHBOARD",
        type: "DASHBOARD",
      };

      ws.current.onopen = () => {
        console.log("Connected to Server!");
        ws.current.send(JSON.stringify(jsonClientType));
      };

      ws.current.onerror = (error) => {
        console.log(`Error: ${error}`);
      };

      ws.current.onclose = () => {
        console.log("Disconnected from Server!");
        // Implement Reconnecting Method
      };

      ws.current.onmessage = ({ data }) => {
        // console.log(`Message from Server: ${data}`);
        setSensorData(JSON.parse(data));
      };
    };

    const authenticate = async () => {
      const request_config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get(config.PRODUCTION_URL_AUTHORIZE, request_config);
        if (data.data === "ACCESS_GRANTED") {
          connectWebSocket();
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
        setTimeout(() => {
          history.push("/login");
        }, 3000);
      }
    };

    authenticate();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [history]);

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <Navbar history={history} />
      <div className="data">
        <Sensor sensorConfig={Patient} sensorData={sensorData} />
      </div>
    </>
  );
};

export default Dashboard;
