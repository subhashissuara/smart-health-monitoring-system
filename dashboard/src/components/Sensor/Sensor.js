import React, { useEffect, useState } from "react";
import DataChartAmbTemp from "./DataChartAmbTemp";
import DataChartBodyTemp from "./DataChartBodyTemp";
import DataChartSpO2 from "./DataChartSpO2";
import DataChartHR from "./DataChartHR";
import "./Sensor.css";
import classNames from "classnames";
import config from "../../config/config.json";

const Sensor = ({ sensorConfig, sensorData }) => {
  const [deviceStatus, setDeviceStatus] = useState("Offline");
  const [indicatorClass, setIndicatorClass] = useState(classNames("indicator", "offline"));
  const [sensorLastUpdated, setSensorLastUpdated] = useState("NA");
  const [sensorValues, setSensorValues] = useState({
    amb_temp: "NA",
    body_temp: "NA",
    spo2: "NA",
    bpm: "NA",
  });

  useEffect(() => {
    if (
      sensorData.sensorType &&
      config.DEVICE_IDS.map((elem) => elem.toLowerCase()).includes(sensorData.deviceId.toLowerCase())
    ) {
      setDeviceStatus("Online");
      setIndicatorClass(classNames("indicator", "online"));
      if (sensorData.timestamp) {
        setSensorLastUpdated(
          `${new Date(sensorData.timestamp).toDateString()} at ${new Date(sensorData.timestamp)
            .toLocaleTimeString("en-IN")
            .replace("am", "AM")
            .replace("pm", "PM")}`
        );
      }
    } else {
      setDeviceStatus("Offline");
      setIndicatorClass(classNames("indicator", "offline"));
      setSensorLastUpdated("NA");
    }

    var DataTimeCheck = setInterval(() => {
      if (Date.now() - sensorData.timestamp > 2000) {
        setDeviceStatus("Offline");
        setIndicatorClass(classNames("indicator", "offline"));
        setSensorValues({
          amb_temp: "NA",
          body_temp: "NA",
          spo2: sensorValues.spo2,
          bpm: sensorValues.bpm,
        });
      }
    }, 2000);

    setSensorValues({
      amb_temp: sensorData.sensorValues
        ? sensorData.sensorValues.amb_temp
          ? sensorData.sensorValues.amb_temp
          : sensorValues.amb_temp
        : "NA",
      body_temp: sensorData.sensorValues
        ? sensorData.sensorValues.body_temp
          ? sensorData.sensorValues.body_temp
          : sensorValues.body_temp
        : "NA",
      spo2: sensorData.sensorValues
        ? sensorData.sensorValues.spo2
          ? sensorData.sensorValues.spo2
          : sensorValues.spo2
        : "NA",
      bpm: sensorData.sensorValues
        ? sensorData.sensorValues.bpm
          ? sensorData.sensorValues.bpm
          : sensorValues.bpm
        : "NA",
    });

    return () => {
      clearInterval(DataTimeCheck);
    };
  }, [sensorData, sensorConfig]);

  return (
    <div className="sensor-container">
      <div className="sensor-text">
        <div className="sensor-text-heading">
          <h2>{sensorConfig.details.id}</h2>
        </div>
        <div className="details-container">
          <div className="patient-metadata-container">
            <h3>Patient Details</h3>
            <div className="patient-metadata">
              <p>{sensorConfig.details.name}</p>
              <p>{sensorConfig.details.dob}</p>
              <p>{sensorConfig.details.age}</p>
              <p>{sensorConfig.details.gender}</p>
              <p>{sensorConfig.details.comorbidity}</p>
            </div>
          </div>
          <div className="sensor-details-container">
            <h3>Sensor Details</h3>
            <div className="sensor-details">
              <p>
                Device Status: {deviceStatus}
                <span className={indicatorClass}></span>
              </p>
              <p>Ambient Temperature: {sensorValues.amb_temp}</p>
              <p>Body Temperature: {sensorValues.body_temp}</p>
              <p>SpO2: {sensorValues.spo2}</p>
              <p>Heart Rate: {sensorValues.bpm}</p>
              <p>Sensor Last Updated: {sensorLastUpdated}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="sensor-chart">
        <DataChartAmbTemp
          config={sensorConfig.ambTempChart}
          timestamp={sensorData.timestamp}
          sensorValue={sensorValues.amb_temp !== "NA" ? sensorValues.amb_temp : null}
        />
        <DataChartBodyTemp
          config={sensorConfig.bodyTempChart}
          timestamp={sensorData.timestamp}
          sensorValue={sensorValues.body_temp !== "NA" ? sensorValues.body_temp : null}
        />
        <DataChartSpO2
          config={sensorConfig.spo2Chart}
          timestamp={sensorData.timestamp}
          sensorValue={sensorValues.spo2 !== "NA" ? sensorValues.spo2 : null}
        />
        <DataChartHR
          config={sensorConfig.hrChart}
          timestamp={sensorData.timestamp}
          sensorValue={sensorValues.bpm !== "NA" ? sensorValues.bpm : null}
        />
      </div>
    </div>
  );
};

export default Sensor;
