---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-12-05T20:40:00+08:00'
excerpt: in this video, we will learn to create a basic setup of MQTT system using the ThingSpeak server and an ESP32 using MicroPython language. MQTT stands for MQ Telemetry Transport. MQ refers to the MQ series, a product develop by IBM to support the MQTT protocol.
tags:
  - esp32 mqtt
  - how to use mqtt
  - micropython mqtt
  - micropython tutorial
  - MicroPython tutorials
  - mqtt esp32
  - mqtt micropython
  - mqtt project
  - mqtt python
  - mqtt thingspeak
  - mqtt tutorial
  - python mqtt
series:
  - ESP32 MicroPython
title: '021 - ESP32 MicroPython: MQTT Part 1: Publish'
url: /2020/12/05/021-esp32-micropython-mqtt-part-1-publish/
---

## **Instruction**

![](/images/021-esp32-mqtt-part-1-techtotinker.png)

Are you interested in Internet of Things? Have you heard of MQTT? If yes, please stay and watch this video. Because in this video, we will learn to create a basic setup of MQTT system using the ThingSpeak server and an ESP32 using MicroPython language.

In tutorial 18, we learned to use the Thingspeak IoT platform to store and diplay DHT sensor readings. We use ESP32 to send data to Thingspeak server by using RESTful API which is through the HTTP Protocol.

Now in this video, we will achieve the same by using the esp32 to send dht sensor data to Thingspeak server but this time using MQTT Protocol.

MQTT stands for MQ Telemetry Transport. MQ refers to the MQ series, a product develop by IBM to support the MQTT protocol.

## **Bill Of Materials**

1. ESP32 development board or any microcontroller with MicroPython firmware installed.
2. DHT22 or any sensor with similar capability.

## **Hardware Instruction**

1. Connect the DHT22 VCC pin to ESP32 3.3V pin.
2. Connect the DHT22 Data pin to ESP32 D23 pin.
3. Connect the DHT22 GND pin to ESP32 GND pin.

## **Video Demonstration**

{{< youtube ugEnE7XSR5I >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1:

```py { lineNos="true" wrap="true" }
# **************************************#
#  MQTT in MicroPython with Thingspeak  #
# **************************************#
# Author: George Bantique               #
#         TechToTinker Youtube Channel  #
#         TechToTinker.blogspot.com     #
#         tech.to.tinker@gmail.com      #
# Date: Dec.5, 2020                    #
# Please feel free to modify the code   #
# according to your needs.              #
# **************************************#

# **************************************#
# Load necessary libraries
import machine
import network
import wifi_credentials
from umqtt.simple import MQTTClient
import dht
import time

# **************************************#
# Objects:
led = machine.Pin(2,machine.Pin.OUT)
d = dht.DHT22(machine.Pin(23))

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
# Global variables and constants:
SERVER = "mqtt.thingspeak.com"
client = MQTTClient("umqtt_client", SERVER)
CHANNEL_ID = "1249898"
WRITE_API_KEY = "PJX6E1D8XLV18Z87"
# topic = "channels/1249898/publish/PJX6E1D8XLV18Z87"
topic = "channels/" + CHANNEL_ID + "/publish/" + WRITE_API_KEY
UPDATE_TIME_INTERVAL = 5000 # in ms unit
last_update = time.ticks_ms()

# **************************************#
# Main loop:
while True:
    if time.ticks_ms() - last_update >= UPDATE_TIME_INTERVAL:
        d.measure()
        t = d.temperature()
        h = d.humidity()
    
        #payload = "field1=" + str(t) + "&field2=" + str(h)
        payload = "field1={}&field2={}" .format(str(t), str(h))

        client.connect()
        client.publish(topic, payload)
        client.disconnect()

        print(payload)
        led.value(not led.value())
        last_update = time.ticks_ms()
```

### 2. wifi\_credentials.py :

```py { lineNos="true" wrap="true" }
ssid = "your wifi ssid"
password = "your wifi password"
```

## **References And Credits**

1. Thingspeak:
[thingspeak.com](http://thingspeak.com/)

2. Mathworks registration page:
<https://www.mathworks.com/mwaccount/register>

