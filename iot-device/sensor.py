import RPi.GPIO as GPIO
import time
import json
import websocket

GPIO.setmode(GPIO.BOARD)

pinLDR = 7
pinLED = 11

GPIO.setup(pinLED, GPIO.OUT)
GPIO.output(pinLED, GPIO.LOW)

sleepTime = 0.1

def detectLight(pinLDR):
    count = 0

    GPIO.setup(pinLDR, GPIO.OUT)
    GPIO.output(pinLDR, GPIO.LOW)
    time.sleep(sleepTime)

    GPIO.setup(pinLDR, GPIO.IN)

    while (GPIO.input(pinLDR) == GPIO.LOW):
        count += 1

    return count

def sendData(sensorStatus = '', date = '', time = '', sensorValue = ''):
    data = {
        "type": "SENSOR",
        "sensorData": {
            "sensorType": "photoresistor",
            "sensorStatus": sensorStatus,
            "date": date,
            "time": time,
            "sensorValue": sensorValue,
        },
    }
    return json.dumps(data)

def main(ws):
    try:
        while True:
            ldrValue = detectLight(pinLDR)
            # print(f"LDR Value: {ldrValue}")
            if (ldrValue <= 300000):
                ws.send(sendData("light", time.strftime("%d/%m/%Y", time.localtime()), time.strftime("%H:%M:%S", time.localtime()), ldrValue))
                GPIO.output(pinLED, GPIO.HIGH)
            else:
                ws.send(sendData("dark", time.strftime("%d/%m/%Y", time.localtime()), time.strftime("%H:%M:%S", time.localtime()), ldrValue))
                GPIO.output(pinLED, GPIO.LOW)
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        GPIO.cleanup()

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("\nConnection Closed\n")

def on_open(ws):
    main(ws)

if __name__ == "__main__":
    HOST = "ws://192.168.29.239:8082"
    print(f"Connecting to Server at {HOST}...")
    ws = websocket.WebSocketApp(HOST,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    print("Connected!")
    print("Sending Sensor Data...")
    ws.run_forever()
