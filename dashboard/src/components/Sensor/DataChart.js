import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import chartColors from "./chartColors";

var savedData = {};

function DataTimeCheck(timestamp) {
  if (Date.now() - timestamp < 2000) {
    return savedData.sensorValue;
  }
  return null;
}

function onRefresh(chart) {
  chart.config.data.datasets.forEach(function (dataset) {
    dataset.data.push({
      x: savedData.timestamp || Date.now(),
      y: DataTimeCheck(savedData.timestamp),
    });
  });
}

const DataChart = ({ config, sensorData }) => {
  useEffect(() => {
    savedData = sensorData;
  }, [sensorData]);

  return (
    <div className="data-chart">
      <Line
        data={{
          datasets: [
            {
              label: config.chartLabel,
              data: [],
              backgroundColor: chartColors.orange,
              borderColor: chartColors.red,
              borderWidth: 4,
            },
          ],
        }}
        height={300}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: config.xlabelString,
                },
                type: "realtime",
                realtime: {
                  duration: 30000,
                  refresh: 1000,
                  delay: 2000,
                  onRefresh: onRefresh,
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: config.ylabelString,
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                  beginAtZero: true,
                },
              },
            ],
          },
          tooltips: {
            mode: "nearest",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: false,
          },
        }}
      />
    </div>
  );
};

export default DataChart;
