---
author: George Bantique
categories:
  - MicroPython
date: '2021-01-07T18:40:00+08:00'
excerpt: Recently, I created a blog post introducing the new Reyax RYC1001 IoT cloud platform. Unlike its competitors, RYC1001 provides additional database capability on top of its MQTT server. I only use free applications available in the internet for Windows and for android. I played with it and I find it easy to use so I decided to further explore the RYC1001 but this time using actual devices to simulate a home automation.
tags:
  - micropython ryc1001
  - Reyax
  - reyax ryc1001
  - Reyax Technology
title: 'Reyax MQTT with Database: Exploring RYC1001 with MicroPython | Part 2'
url: /2021/01/07/reyax-mqtt-with-database-exploring-ryc1001-with-micropython-part-2/
---

## **Introduction**

![](/images/reyax-techtotinker-part1-1024x576.png)

Recently, I created a blog post introducing the new Reyax RYC1001 IoT cloud platform. Unlike its competitors, RYC1001 provides additional database capability on top of its MQTT server. I only use free applications available in the internet for Windows and for android. I played with it and I find it easy to use so I decided to further explore the RYC1001 but this time using actual devices to simulate a home automation.

One of the ESP32 (ESP32 DOIT board) have a DHT22 temperature and humidity sensor and a relay arrays. This setup will serve as the Internet-of-Things setup in the home.

Another is the ESP32 Heltec board with OLED display with some buttons that will serve as user input. This setup will serve as the Internet-of-Things setup remotely which can be brought anywhere and will function as long as there is a WiFi internet to connect to.

The DHT22 sensor readings will be publish by ESP32 DOIT board through the notification message on a sub-topic /temperature. The sensor readings will be forwarded to ESP32 Heltec board to which in the end will be displayed in the OLED display.

The relay arrays is controlled by publishing the button-controlled state through the command message on a sub-topic /control\_lights. The relays control will then be forwarded to ESP32 DOIT board which will be interpreted as a relay state.

## **Bill Of Materials**

1. 2 pcs of ESP32 development board with MicroPython firmware or any microcontroller capable of MicroPython.
2. A DHT22 sensor or any alternative.
3. 4 channel relay arrays.
4. OLED display
5. Some buttons.
6. External power supply
7. Breadboard
8. Some dupont jumper wires.

## **Hardware Instruction**

**Relay Array:**

1. Connect the ESP32 D5 pin to Relay IN1 pin.
2. Connect the ESP32 D18 pin to Relay IN2 pin.
3. Connect the ESP32 D19 pin to Relay IN3 pin.
4. Connect the ESP32 D21 pin to Relay IN4 pin.
5. Power the relay array with 5V supply voltage.

**DHT22 sensor:**

1. Connect the DHT signal pin to ESP32 D23 pin.
2. Power the DHT22 with 3.3V supply voltage.

**Buttons:**

1. Connect button\_1 signal pin to ESP32 D13 pin.
2. Connect button\_2 signal pin to ESP32 D12 pin.
3. Connect button\_3 signal pin to ESP32 D14 pin.
4. Connect button\_4 signal pin to ESP32 D27 pin.

**OLED:**

1. In ESP32 Heltec board, OLED display is onboard and it is configured as follows: 
    - OLED sda pin to ESP32 D4 pin.
    - OLED scl pin to ESP32 D15 pin.
    - OLED rst pin to ESP32 D16 pin.
2. It will be automatically power by ESP32 with 3.3V voltage supply.

![](/images/reyax-techtotinker-part1-diagram.png)

## **Video Demonstration**

{{< youtube e41bnxZRuuo >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. ESP32 DOIT board:

```py { lineNos="true" wrap="true" }
# **************************************#
# Description:                          #
#   Contains a MicroPython source code  #
# exploring the Reyax RYC1001.          #
# In this ESP32 board connected are     #
# (1) DHT22 - D23 (publish)             #
# (2) 4 channel Relay (subscribe)       #
#     IN1 - D5                          #
#     IN2 - D18                         #
#     IN3 - D19                         #
#     IN4 - D21                         #
# --------------------------------------#
# Author: George Bantique               #  
#         TechToTinker Youtube Channel  # 
#         TechToTinker.blogspot.com     # 
#         tech.to.tinker@gmail.com      # 
# Date: Jan 5, 2021                     #
# --------------------------------------#
# Please feel free to modify the code   # 
# according to your needs.              # 
# **************************************#


# ************************************** 
# Load necessary libraries 
import machine 
import network
import dht
from umqtt.robust import MQTTClient
import ujson as json
import time 

# ************************************** 
# Create objects:
# 1. dht22
d = dht.DHT22(machine.Pin(23)) 
# 2. relays
relay_1 = machine.Pin(5, machine.Pin.OUT)
relay_2 = machine.Pin(18, machine.Pin.OUT)
relay_3 = machine.Pin(19, machine.Pin.OUT)
relay_4 = machine.Pin(21, machine.Pin.OUT)
relay_1.on()
relay_2.on()
relay_3.on()
relay_4.on()
# 3. led
led = machine.Pin(2, machine.Pin.OUT)
# 4. emergency mqtt stop
press = False
def sw_press(pin):
    global press
    press = True
    
estop = machine.Pin(0, machine.Pin.IN, machine.Pin.PULL_UP)
estop.irq(trigger=machine.Pin.IRQ_FALLING, handler=sw_press)

# # ************************************** 
# # Configure the ESP32 wifi as STAtion 
sta = network.WLAN(network.STA_IF) 
if not sta.isconnected():  
  print('connecting to network...')  
  sta.active(True)  
  sta.connect('your wifi ssid', 'your wifi password')  
  while not sta.isconnected():  
    pass  
print('network config:', sta.ifconfig()) 

# **************************************# 
# Callback function, it is the function 
# that will be called when a new msg 
# is received from MQTT broker 
def call_back_function(topic, msg):
    global msg_flag, msg_data
    msg_flag = True
    msg_data = json.loads(msg.decode())
     
# # **************************************
# # Constants and variables:
UPDATE_TIME_INTERVAL = 5000  # in ms 
last_update = time.ticks_ms()
BLINK_TIME_INTERVAL = 1000  # in ms 
last_blink = time.ticks_ms()
msg_data = ""
msg_flag = False
stop_flag = False

CLIENT_ID = b'REYAX_USERNAME0001'
REYAX_URL = b'iot.reyax.com'
REYAX_USERNAME = b'REYAX_USERNAME'
REYAX_PASSWORD = b'REYAX_PASSWORD'

TOPIC_PUB = b'api/request'
TOPIC_SUB = b'api/command/35/5/gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic/control_lights'

client = MQTTClient(client_id = CLIENT_ID,   
            server = REYAX_URL,   
            user = REYAX_USERNAME,   
            password = REYAX_PASSWORD,   
            ssl = False)  
try: 
    client.connect() 
except Exception as e:
    client.disconnect()
    machine.reset()
    
client.set_callback(call_back_function)
client.subscribe(TOPIC_SUB)

# **************************************
# Main loop:
while True:
    if stop_flag == True:
        led.value(not led.value())
        time.sleep(0.1)
    else:            
        client.check_msg() #non-blocking
        # msg_flag will be true when new message is received
        if msg_flag == True:
            msg_flag = False
            # parse the individual values from json data
            light_1 = msg_data['command']['result']['light_1']
            light_2 = msg_data['command']['result']['light_2']
            light_3 = msg_data['command']['result']['light_3']
            light_4 = msg_data['command']['result']['light_4']

            if light_1 == 'ON':
                relay_1.value(0)
            elif light_1 == 'OFF':
                relay_1.value(1)
            if light_2 == 'ON':
                relay_2.value(0)
            elif light_2 == 'OFF':
                relay_2.value(1)     
            if light_3 == 'ON':
                relay_3.value(0)
            elif light_3 == 'OFF':
                relay_3.value(1)
            if light_4 == 'ON':
                relay_4.value(0)
            elif light_4 == 'OFF':
                relay_4.value(1)
        
        # this is for the blink interval
        if time.ticks_ms() - last_blink >= BLINK_TIME_INTERVAL:
            last_blink = time.ticks_ms()
            led.value(not led.value()) 
           
        # this if for the DHT update interval
        if time.ticks_ms() - last_update >= UPDATE_TIME_INTERVAL:
            last_update = time.ticks_ms()
            d.measure() 
            temp = str(d.temperature())
            humi = str(d.humidity())       

            PAYLOAD_PUB = '''{
                                "action": "notification/insert",
                                "deviceId": "gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic",
                                "notification": 
                                {
                                    "notification": "temperature",
                                    "parameters":
                                    {
                                        "temperature":''' + temp + ''',
                                        "humidity":''' + humi + '''
                                    }
                                }
                            }'''
            client.publish(TOPIC_PUB, PAYLOAD_PUB)
        
        # checks the mqtt stop button is press
        # if press, disconnect the mqtt client from the server
        if press == True:
            press = False
            client.disconnect()
            stop_flag = True
            print('MQTT is now disconnected.')

```

### 2. ESP32 Heltec board:

```py { lineNos="true" wrap="true" }
# **************************************#
# Description:                          #
#   Contains a MicroPython source code  #
# exploring the Reyax RYC1001.          #
# In this ESP32 board connected are     #
# (1) OLED (subscribe)                  #
#     scl - 15                          #
#     sda - 4                           #
#     rst - 16                          #
# (2) 4 Buttons (publish)               #
#     button1 - D13                     #
#     button2 - D12                     #
#     button3 - D14                     #
#     button4 - D27                     #
# --------------------------------------#
# Author: George Bantique               #  
#         TechToTinker Youtube Channel  # 
#         TechToTinker.blogspot.com     # 
#         tech.to.tinker@gmail.com      # 
# Date: Jan 5, 2021                     #
# --------------------------------------#
# Please feel free to modify the code   # 
# according to your needs.              # 
# **************************************#


# ************************************** 
# Load necessary libraries 
import machine 
import ssd1306
import network  
from umqtt.robust import MQTTClient
import ujson as json
import time 

# ************************************** 
# Create objects:
# 1. oled object
rst = machine.Pin(16, machine.Pin.OUT)
rst.value(1)
i2c = machine.I2C(scl=machine.Pin(15), sda=machine.Pin(4), freq=400000)
oled = ssd1306.SSD1306_I2C(128, 64, i2c, addr=0x3C)

# 2. button switch object
press = False
irq_pin = 0

def sw_press(pin):
    global press
    press = True
    global irq_pin
    irq_pin = int(str(pin)[4:-1])
    
but13 = machine.Pin(13, machine.Pin.IN, machine.Pin.PULL_UP)
but13.irq(trigger=machine.Pin.IRQ_FALLING, handler=sw_press)
but12 = machine.Pin(12, machine.Pin.IN, machine.Pin.PULL_UP)
but12.irq(trigger=machine.Pin.IRQ_FALLING, handler=sw_press)
but14 = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_UP)
but14.irq(trigger=machine.Pin.IRQ_FALLING, handler=sw_press)
but27 = machine.Pin(27, machine.Pin.IN, machine.Pin.PULL_UP)
but27.irq(trigger=machine.Pin.IRQ_FALLING, handler=sw_press)
estop = machine.Pin(0, machine.Pin.IN, machine.Pin.PULL_UP)
estop.irq(trigger=machine.Pin.IRQ_FALLING, handler=sw_press)

# 3. led switch
led = machine.Pin(25, machine.Pin.OUT)

# # ************************************** 
# # Configure the ESP32 wifi as STAtion 
sta = network.WLAN(network.STA_IF) 
if not sta.isconnected():  
  print('connecting to network...')  
  sta.active(True)  
  sta.connect('your wifi ssid', 'your wifi password')   
  while not sta.isconnected():  
    pass  
print('network config:', sta.ifconfig()) 

# **************************************# 
# Callback function, it is the function 
# that will be called when a new msg 
# is received from MQTT broker 
def call_back_function(topic, msg):
    global msg_flag, msg_data
    msg_flag = True
    msg_data = json.loads(msg.decode())
     
# # **************************************
# # Constants and variables:
UPDATE_TIME_INTERVAL = 5000  # in ms 
last_update = time.ticks_ms()
BLINK_TIME_INTERVAL = 1000  # in ms 
last_blink = time.ticks_ms()
msg_data = ""
msg_flag = False
stop_flag = False
stop_mqtt = False

light_1 = 'OFF'
light_2 = 'OFF'
light_3 = 'OFF'
light_4 = 'OFF'

CLIENT_ID = b'REYAX_USERNAME0002'
REYAX_URL = b'iot.reyax.com'
REYAX_USERNAME = b'REYAX_USERNAME'
REYAX_PASSWORD = b'REYAX_PASSWORD'

TOPIC_PUB = b'api/request'
TOPIC_SUB = b'api/notification/35/5/gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic/temperature'

client = MQTTClient(client_id = CLIENT_ID,   
            server = REYAX_URL,   
            user = REYAX_USERNAME,   
            password = REYAX_PASSWORD,   
            ssl = False)  
try: 
    client.connect() 
except Exception as e:
    client.disconnect()
    machine.reset() 
client.set_callback(call_back_function)
client.subscribe(TOPIC_SUB)

# **************************************
# Main loop:
while True:
    if stop_flag == True:
        if stop_mqtt:
            stop_mqtt = False
            client.disconnect()
            print('MQTT is now disconnected.')
        led.value(not led.value())
        time.sleep(0.1)
    else:
        client.check_msg() #non-blocking
        if msg_flag == True:
            msg_flag = False
            temperature = str(msg_data['notification']['parameters']['temperature'])
            humidity = str(msg_data['notification']['parameters']['humidity'])
            oled.fill(0)
            oled.text('Temperature:',  5,  5)
            oled.text(temperature,     5, 15)
            oled.text('oC',           40, 15)
            oled.text('Humidity:',     5, 30)
            oled.text(humidity,        5, 40)
            oled.text('%',            40, 40)
            oled.show()
            
        # this is for the blink interval
        if time.ticks_ms() - last_blink >= BLINK_TIME_INTERVAL:
            last_blink = time.ticks_ms()
            led.value(not led.value()) 
            
        
        # this if for the DHT update interval
        if time.ticks_ms() - last_update >= UPDATE_TIME_INTERVAL:
            last_update = time.ticks_ms()
                
            if press:
                press = False
                
                if irq_pin == 13:
                    if light_1 == 'ON':
                        light_1 = 'OFF'
                    else:
                        light_1 = 'ON'
                elif irq_pin == 12:
                    if light_2 == 'ON':
                        light_2 = 'OFF'
                    else:
                        light_2 = 'ON'
                elif irq_pin == 14:
                    if light_3 == 'ON':
                        light_3 = 'OFF'
                    else:
                        light_3 = 'ON'
                elif irq_pin == 27:
                    if light_4 == 'ON':
                        light_4 = 'OFF'
                    else:
                        light_4 = 'ON'
                elif irq_pin == 0:
                    stop_flag = True
                    stop_mqtt = True
            
                PAYLOAD_PUB = '''{
                                    "action":"command/insert",
                                    "deviceId":"gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic",
                                    "command":
                                    {
                                        "command":"control_lights",
                                        "parameters":
                                        {
                                            "Control":"Lights"
                                        },
                                        "status":"Done",
                                        "result":
                                        {
                                            "light_1":''' + light_1 + ''',
                                            "light_2":''' + light_2 + ''',
                                            "light_3":''' + light_3 + ''',
                                            "light_4":''' + light_4 + '''
                                        }
                                    }
                                }'''
                client.publish(TOPIC_PUB, PAYLOAD_PUB)
```

## **References And Credits**

1. Reyax RYC1001:
<http://reyax.com/products/ryc1001/>

