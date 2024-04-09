---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-11-30T15:35:00+08:00'
excerpt: In this article, we will learn a more complete usage of RESTful APIs which is bidirectional communication with the server that is both sending and requesting of data.
tags:
  - esp32 micropython
  - ESP8266 MicroPython
  - MicroPython tutorials
  - Raspberry Pi Pico MicroPython
series:
  - ESP32 MicroPython
title: '020 - ESP32 MicroPython: RESTful APIs | Demo READ and WRITE'
url: /2020/11/30/020-esp32-micropython-restful-apis-demo-read-and-write/
---

## **Introduction**

![](/images/020-esp32-REST-API-write-techtotinker.png)

In this article, we will learn a more complete usage of RESTful APIs which is bidirectional communication with the server that is both sending and requesting of data.

In article 018, I demonstrate sending of data to Thingspeak server using the HTTP POST method while in article 019, I demonstrate requesting of data from OpenWeather server using HTTP GET method.

This time, I would like to demonstrate both data writing and data reading to Thingspeak IoT platform using RESTful APIs.

## **Bill Of Materials**

1. ESP32 DOIT board with DHT sensor and an LED with limiting resistor.
2. ESP32 Heltec boad.

## **Hardware Instruction**

1. Connect the ESP32 DOIT board 3.3V pin to DHT22 VCC pin.
2. Connect the ESP32 DOIT board D23 pin to DHT22 DOUT pin.
3. Connect the ESP32 DOIT board GND pin to DHT22 GND pin.
4. Connect the LED anode pin through a limiting resistor to ESP32 DOIT board D22 pin.
5. Connect the LED cathode pin to ESP32 DOIT board GND pin.
6. Leave the Heltec ESP32 development without any connection. The OLED uses the ESP32 pin 15 for SCL and pin 4 for the SDA. **The OLED RST pin should be tied to VCC**. It was connected to ESP32 pin 16.

## **Video Demonstration**

{{< youtube GZh5pF5yKM0 >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### **1. ESP32 DOIT board with DHT22 sensor and LED:**

```py { lineNos="true" wrap="true" }
# **************************************#
# Description:                          #
#   Contains MicroPython code for       #
# sending DHT sensor readings to        #
# Thingspeak server using RESTful APIs  #
# with urequests HTTP POST method.      #
# It also contains an LED that is       #
# dependent to the signal control from  #
# another client. This demonstrates the #
# use of HTTP GET method.               #
# --------------------------------------#
# Author: George Bantique               #  
#         TechToTinker Youtube Channel  # 
#         TechToTinker.blogspot.com     # 
#         tech.to.tinker@gmail.com      # 
# Date: Nov.20, 2020                    #
# --------------------------------------#
# Please feel free to modify the code   # 
# according to your needs.              # 
# **************************************# 

# ************************************** 
# Load necessary libraries 
import machine 
import dht
import network  
import urequests
import ujson as json
import time 

# ************************************** 
# Create objects: 
led = machine.Pin(2,machine.Pin.OUT)
ext_led = machine.Pin(22, machine.Pin.OUT)
d = dht.DHT22(machine.Pin(23)) 

# ************************************** 
# Configure the ESP32 wifi as STAtion 
sta = network.WLAN(network.STA_IF) 
if not sta.isconnected():  
  print('connecting to network...')  
  sta.active(True)  
  sta.connect('your wifi ssid', 'your wifi password')  
  while not sta.isconnected():  
    pass  
print('network config:', sta.ifconfig()) 

# **************************************
# Constants and variables:
HTTP_HEADERS = {'Content-Type': 'application/json'} 
UPDATE_TIME_INTERVAL = 3000  # in ms 
last_update = time.ticks_ms() 

# **************************************
# Main loop:
while True: 
    if time.ticks_ms() - last_update >= UPDATE_TIME_INTERVAL:
        # HTTP GET
        response = urequests.get('https://api.thingspeak.com/channels/1242207/fields/1.json?api_key=CLDDS1LS1Y6A1LHD&results=1')
        # check status code of the request 
        if response.status_code == 200: 
            # get the json format of data
            data = response.json() 
            field1 = str(data['feeds'][0]['field1'])
            print(field1)
            if field1=='1':
                ext_led.value(1)
            else:
                ext_led.value(0)
            
        # HTTP POST
        d.measure() 
        t = d.temperature() 
        h = d.humidity() 
        dht_readings = {'field1':t, 'field2':h} 
        request = urequests.post( 
                  'http://api.thingspeak.com/update?api_key=V365HW2M3NZES7EW', 
                  json = dht_readings, 
                  headers = HTTP_HEADERS ) 
        request.close() 
        print(dht_readings)
         
        led.value(not led.value()) 
        last_update = time.ticks_ms()
```

### **2: ESP32 Heltec board:**

```py { lineNos="true" wrap="true" }
# **************************************#
# Description:                          #
#   Contains MicroPython code for       #
# requesting DHT sensor readings from   #
# Thingspeak server using RESTful APIs  #
# with urequests HTTP GET method.       #
# It also contains a button switch that #
# sent to the server to control the LED #
# of another client. This demonstrates  #
# the use of HTTP POST method.          #
# --------------------------------------#
# Author: George Bantique               #  
#         TechToTinker Youtube Channel  # 
#         TechToTinker.blogspot.com     # 
#         tech.to.tinker@gmail.com      # 
# Date: Nov.20, 2020                    #
# --------------------------------------#
# Please feel free to modify the code   # 
# according to your needs.              # 
# **************************************#

# ************************************** 
# Load necessary libraries 
import machine 
import ssd1306
import network  
import urequests
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
def sw_press(pin):
    global press
    press = True
but = machine.Pin(21, machine.Pin.IN, machine.Pin.PULL_UP)
but.irq(trigger=machine.Pin.IRQ_FALLING, handler=sw_press)

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

# # **************************************
# # Constants and variables:
HTTP_HEADERS = {'Content-Type': 'application/json'} 
UPDATE_TIME_INTERVAL = 3000  # in ms 
last_update = time.ticks_ms()
led_state = '0'

# **************************************
# Main loop:
while True: 
    if time.ticks_ms() - last_update >= UPDATE_TIME_INTERVAL:
        
        # HTTP POST
        if press:
            press = False
            if led_state == '0':
                led_state = '1'
            else:
                led_state = '0'
                
        sw_press = {'field1':led_state} 
        request = urequests.post('http://api.thingspeak.com/update?api_key=F8OG056AW2SEQBW6', 
                  json = sw_press, 
                  headers = HTTP_HEADERS ) 
        request.close() 
        print(sw_press)

        # HTTP GET
        response = urequests.get('https://api.thingspeak.com/channels/1242204/feeds.json?api_key=CM2XQ37C1PWGHCJ9&results=1')
        
        if response.status_code == 200:
            data = response.json()
            # first is store the json response to data variable
            # then parse the fields from feeds list
            # [0] -> converts list to dictionary
            field1 = str(data['feeds'][0]['field1'])
            field2 = str(data['feeds'][0]['field2'])
            oled.fill(0)
            oled.text('RESTful API Demo', 0, 5)
            oled.text('Temp:{} oC' .format(field1), 20, 25)
            oled.text('Humi:{} %' .format(field2), 20, 35)
            oled.show()
            #print('response OK')
        else:
            print('Error in HTTP request')
            oled.fill(0)
            oled.text('Error in HTTP', 10, 5)
            oled.text('request!', 10, 15)
            oled.show()
            #print('response ERR')
        led.value(not led.value()) 
        last_update = time.ticks_ms()
```

