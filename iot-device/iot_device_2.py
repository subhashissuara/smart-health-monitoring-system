import time
import json
import websocket
from smbus2 import SMBus
from mlx90614 import MLX90614

# HOST = "ws://192.168.29.239:8082"
HOST = "ws://52.172.44.216:5000"

bus = SMBus(1)
mlx90614_sensor = MLX90614(bus, address=0x5A)

def sendData(timestamp = '', sensorValues = {}):
    data = {
        "deviceId": "IOT_DEVICE_2",
        "type": "IOT_DEVICE",
        "sensorData": {
			"deviceId": "IOT_DEVICE_2",
            "sensorType": "IOT_DEVICE",
            "timestamp": timestamp,
            "sensorValues": sensorValues,
        },
    }
    return json.dumps(data)

def main(ws):
    try:
        while True:
            amb_temp = mlx90614_sensor.get_amb_temp()
            body_temp = mlx90614_sensor.get_obj_temp()

            sensorValues = {
                "amb_temp": amb_temp,
                "body_temp": body_temp,
            }

            ws.send(sendData(int(time.time() * 1000), sensorValues))

            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        bus.close()

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("\nConnection Closed\n")

def on_open(ws):
    main(ws)

if __name__ == "__main__":
    try:
        print(f"Connecting to Server at {HOST}...")
        ws = websocket.WebSocketApp(HOST,
                                    on_message=on_message,
                                    on_error=on_error,
                                    on_close=on_close)
        ws.on_open = on_open
        print("Connected!")
        print("Sending Sensor Data...")
        ws.run_forever()
    except Exception as e:
        print(e)
        print("Sleep for 10 seconds...")
        time.sleep(10)
        pass
