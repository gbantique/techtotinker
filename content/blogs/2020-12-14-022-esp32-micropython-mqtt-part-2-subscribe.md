---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-12-14T19:19:00+08:00'
tags:
  - esp32 mqtt
  - ESP32 MQTT Subscribe
  - micropython mqtt
  - MicroPython MQTT Subscribe
series:
  - ESP32 MicroPython
title: '022 - ESP32 MicroPython: MQTT Part 2: Subscribe'
url: /2020/12/14/022-esp32-micropython-mqtt-part-2-subscribe/
---

## **Introduction**

![](/images/022-esp32-mqtt-part2-techtotinker.png)

In the previous tutorial, I demonstrate the use of MQTT protocol by sending DHT sensor readings to Thingspeak as MQTT broker while the ESP32 serves as MQTT client. The act of MQTT client sending data to MQTT broker is called MQTT publish.

![](/images/022-esp32-mqtt-part2-techtotinker-01-1024x576.png)

Now in this tutorial, I will demonstrate the other direction of MQTT communication which is MQTT subscribe where a client is waiting for a message from a broker. A client that subscribes to a certain topic will receive a data update from the broker when a new publish data is received from a certain publishing client.

![](/images/022-esp32-mqtt-part2-techtotinker-02-1024x576.png)

Now to demonstrate that, I will be needing 3 components which are:
1. A publishing client
2. A broker and
3. A subscribe client

![](/images/022-esp32-mqtt-part2-techtotinker-03-1024x576.png)

## **Bill Of Materials**

1. ESP32 development board.
2. 0.96 OLED display

## **Hardware Instruction**

1. Connect the OLED VCC pin to ESP32 3.3V pin.
2. Connect the OLED GND pin to ESP32 GND pin.
3. Connect the OLED SCL pin to ESP32 D22 pin.
4. Connect the OLED SDA pin to ESP32 D21 pin.

## **Video Demonstration**

{{< youtube rCGhxhhHV5c >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### **1. Basic demonstration of handling MQTT Subscribe message data payload:**

```py { lineNos="true" wrap="true" }
# **************************************#  
#  MQTT in MicroPython with Thingspeak  #  
# **************************************#  
# Author: George Bantique               #  
#         TechToTinker Youtube Channel  #  
#         TechToTinker.blogspot.com     #  
#         tech.to.tinker@gmail.com      #  
# Date: Dec.13, 2020                    #  
# Please feel free to modify the code   #  
# according to your needs.              #  
# **************************************# 

# **************************************#  
# Load necessary libraries  
import machine  
import network  
import wifi_credentials  
from umqtt.robust import MQTTClient  
import ssd1306  
import time  
import os  
import sys 


# **************************************#  
# Objects:  
led = machine.Pin(2,machine.Pin.OUT)  
scl = machine.Pin(22, machine.Pin.OUT, machine.Pin.PULL_UP)  
sda = machine.Pin(21, machine.Pin.OUT, machine.Pin.PULL_UP)  
i2c = machine.I2C(scl=scl, sda=sda, freq=400000)  
oled = ssd1306.SSD1306_I2C(128, 64, i2c, addr=0x3C) 

# **************************************#  
# Configure the ESP32 wifi as STAtion.  
sta = network.WLAN(network.STA_IF)  
if not sta.isconnected():  
  print('connecting to network...')  
  sta.active(True)  
  #sta.connect('wifi ssid', 'wifi password')  
  sta.connect(wifi_credentials.ssid, wifi_credentials.password)  
  while not sta.isconnected():  
    pass  
print('network config:', sta.ifconfig()) 

# **************************************#  
# Callback function, it is the function  
# that will be called when a new msg  
# is received from MQTT broker  
def call_back_function(topic, msg):  
    oled.fill(0)  
    oled.text(msg.decode().strip("'n"), 5, 5)  
    oled.show()  
    print((topic, msg)) 
        
# **************************************#  
# Global variables and constants  
UNIQUE_CLIENT_ID = "ab06f0c1-1319-44bc-9534-04caea40af81"  
THINGSPEAK_URL = b"mqtt.thingspeak.com"   
THINGSPEAK_USERNAME = b'mwa0000020270097'  
THINGSPEAK_MQTT_API_KEY = b'AWP9SRI6ED9ONGBO'  
THINGSPEAK_CHANNEL_ID = b'1250656'  
THINGSPEAK_CHANNEL_READ_API_KEY = b'TVRCWGZKKOVC2MQR'  
TOPIC_SUB = bytes("channels/{:s}/subscribe/fields/field1/{:s}"
                  .format(THINGSPEAK_CHANNEL_ID,
                          THINGSPEAK_CHANNEL_READ_API_KEY),
                  'utf-8')  

# **************************************#  
# MQTT client configuration:  
# 1.Create the MQTT client      
client = MQTTClient(client_id = UNIQUE_CLIENT_ID,   
                    server = THINGSPEAK_URL,   
                    user = THINGSPEAK_USERNAME,   
                    password = THINGSPEAK_MQTT_API_KEY,   
                    ssl = False)  
# 2.Set the callback function  
client.set_callback(call_back_function)  
# 3.Connect to MQTT broker  
try:  
    client.connect()  
except Exception as e:  
    machine.reset  
# 4.Subscribe to a specific topic      
client.subscribe(TOPIC_SUB)  

# **************************************#  
# Main loop  
while True:  
    try:  
        #client.wait_msg() #blocking  
        client.check_msg() #non-blocking  
    except KeyboardInterrupt:  
        print('Ctrl-C pressed...exiting')  
        client.disconnect()  
        sys.exit()
```

### **2. How to use MQTT Subscribe message as command for controlling something:**

```py { lineNos="true" wrap="true" }
# **************************************# 
#  MQTT in MicroPython with Thingspeak  # 
# **************************************# 
# Author: George Bantique               # 
#         TechToTinker Youtube Channel  # 
#         TechToTinker.blogspot.com     # 
#         tech.to.tinker@gmail.com      # 
# Date: Dec.13, 2020                    # 
# Please feel free to modify the code   # 
# according to your needs.              # 
# **************************************# 

# **************************************# 
# Load necessary libraries 
import machine 
import network 
import wifi_credentials 
from umqtt.robust import MQTTClient 
import ssd1306 
import time 
import os 
import sys 

# **************************************# 
# Objects: 
led = machine.Pin(2,machine.Pin.OUT) 
scl = machine.Pin(22, machine.Pin.OUT, machine.Pin.PULL_UP) 
sda = machine.Pin(21, machine.Pin.OUT, machine.Pin.PULL_UP) 
i2c = machine.I2C(scl=scl, sda=sda, freq=400000) 
oled = ssd1306.SSD1306_I2C(128, 64, i2c, addr=0x3C) 

# **************************************# 
# Configure the ESP32 wifi as STAtion. 
sta = network.WLAN(network.STA_IF) 
if not sta.isconnected(): 
  print('connecting to network...') 
  sta.active(True) 
  #sta.connect('wifi ssid', 'wifi password') 
  sta.connect(wifi_credentials.ssid, wifi_credentials.password) 
  while not sta.isconnected(): 
    pass 
print('network config:', sta.ifconfig()) 

# **************************************# 
# Callback function, it is the function 
# that will be called when a new msg 
# is received from MQTT broker 
def call_back_function(topic, msg): 
     global message 
     oled.fill(0) 
     message = msg.decode().strip("'n") 
     oled.text(message, 5, 5) 
     oled.show() 
     print((topic, msg)) 
 
# **************************************# 
# Global variables and constants 
UNIQUE_CLIENT_ID = "ab06f0c1-1319-44bc-9534-04caea40af81" 
THINGSPEAK_URL = b"mqtt.thingspeak.com"  
THINGSPEAK_USERNAME = b'mwa0000020270097' 
THINGSPEAK_MQTT_API_KEY = b'AWP9SRI6ED9ONGBO' 
THINGSPEAK_CHANNEL_ID = b'1250656' 
THINGSPEAK_CHANNEL_READ_API_KEY = b'TVRCWGZKKOVC2MQR' 
TOPIC_SUB = bytes("channels/{:s}/subscribe/fields/field1/{:s}"
                  .format(THINGSPEAK_CHANNEL_ID,
                          THINGSPEAK_CHANNEL_READ_API_KEY),
                  'utf-8') 
message = "" 

# **************************************# 
# MQTT client configuration: 
# 1.Create the MQTT client object    
client = MQTTClient(client_id = UNIQUE_CLIENT_ID,  
                    server = THINGSPEAK_URL,  
                    user = THINGSPEAK_USERNAME,  
                    password = THINGSPEAK_MQTT_API_KEY,  
                    ssl = False) 
# 2.Set the callback function 
client.set_callback(call_back_function) 
# 3.Connect to MQTT broker 
try: 
    client.connect() 
except Exception as e: 
    machine.reset 
# 4.Subscribe to a specific topic     
client.subscribe(TOPIC_SUB) 

# **************************************# 
# Main loop 
while True: 
    try: 
        client.wait_msg() #blocking 
        #client.check_msg() #non-blocking 
         
        if message == 'led ON': 
            led.on() 
            print('led is now ON') 
        elif message == 'led OFF': 
            led.off() 
            print('led is now OFF') 
        elif message == 'oled WHITE': 
            oled.invert(1) 
            print('oled is now black on WHITE') 
        elif message == 'oled BLACK': 
            oled.invert(0) 
            print('oled is now white on BLACK') 
             
    except KeyboardInterrupt: 
        print('Ctrl-C pressed...exiting') 
        client.disconnect() 
        sys.exit()
```

## **References And Credits**

1. Thingspeak:
[thingspeak.com](http://thingspeak.com/)

2. MQTT Box:
<http://workswithweb.com/html/mqttbox/downloads.html>

