import time
import max30100
import json
import websocket

# HOST = "ws://192.168.29.239:8082"
HOST = "ws://52.172.44.216:5000"

mx30 = max30100.MAX30100()
mx30.enable_spo2()

def moving_average(numbers):
    window_size = 4
    i = 0
    while i < len(numbers) - window_size + 1:
        this_window = numbers[i : i + window_size]
        window_average = sum(this_window) / window_size
        i += 1
    try:
        return int((window_average / 100))
    except:
        pass

def display_filter(moving_average_bpm,moving_average_sp02):
    try:
        if(moving_average_bpm < 10):
            moving_average_bpm ='NA'
            moving_average_sp02 = 'NA'
        else:
            if(moving_average_sp02 > 100):
                moving_average_sp02 = 100
        return moving_average_bpm, moving_average_sp02
    except:
        return moving_average_bpm, moving_average_sp02

def sendData(timestamp = '', sensorValues = {}):
    data = {
        "deviceId": "IOT_DEVICE_1",
        "type": "IOT_DEVICE",
        "sensorData": {
			"deviceId": "IOT_DEVICE_1",
            "sensorType": "IOT_DEVICE",
            "timestamp": timestamp,
            "sensorValues": sensorValues,
        },
    }
    return json.dumps(data)

def main(ws):
    try:
        while True:
            mx30.read_sensor()
            bpm = int(mx30.ir / 100)
            spo2 = int(mx30.red / 100)
            
            if mx30.ir != mx30.buffer_ir :
                moving_average_bpm = (moving_average(mx30.buffer_ir))
            if mx30.red != mx30.buffer_red:
                moving_average_sp02 = (moving_average(mx30.buffer_red))
                
            bpm, spo2 = display_filter(moving_average_bpm, moving_average_sp02)
            
            sensorValues = {
                "bpm": bpm,
                "spo2": spo2,
            }

            ws.send(sendData(int(time()*1000), sensorValues))

            time.sleep(1)
    except KeyboardInterrupt:
        pass

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
