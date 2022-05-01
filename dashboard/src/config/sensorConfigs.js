import chartColors from "../components/Sensor/chartColors";

export const Patient = {
  details: {
    id: "Patient 1",
    name: "Name: Subhashis Jha Mohanty",
    dob: "Date of Admission: 19-12-2021",
    gender: "Gender: Female",
    age: "Age: 34",
    comorbidity: "Co-mobidity: Diabetes, High Blood Pressure",
  },

  ambTempChart: {
    color: {
      bgColor: chartColors.lightpurple,
      borderColor: chartColors.purple,
    },
    chartLabel: "Ambient Temperature Sensor",
    xlabelString: "Today's Time",
    ylabelString: "Ambient Temperature",
  },

  bodyTempChart: {
    color: {
      bgColor: chartColors.lightorange,
      borderColor: chartColors.orange,
    },
    chartLabel: "Body Temperature Sensor",
    xlabelString: "Today's Time",
    ylabelString: "Body Temperature",
  },

  spo2Chart: {
    color: {
      bgColor: chartColors.lightblue,
      borderColor: chartColors.blue,
    },
    chartLabel: "Blood-Pulse Oximeter Sensor",
    xlabelString: "Today's Time",
    ylabelString: "Oximeter",
  },

  hrChart: {
    color: {
      bgColor: chartColors.lightred,
      borderColor: chartColors.red,
    },
    chartLabel: "Heart-rate Monitor Sensor",
    xlabelString: "Today's Time",
    ylabelString: "Heartrate",
  },

  ecgChart: {
    color: {
      bgColor: chartColors.green,
      borderColor: chartColors.green,
    },
    chartLabel: "ECG Sensor",
    xlabelString: "Today's Time",
    ylabelString: "ECG",
  },
};
