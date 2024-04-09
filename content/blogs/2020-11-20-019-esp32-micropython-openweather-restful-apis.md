---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-11-20T20:42:00+08:00'
excerpt: In the previous tutorial, I demonstrate using the RESTful APIs to communicate with Thingspeak server sending DHT sensor data. Now in this aticle, I will demonstrate the opposite which is requesting data from a server. This time, communicating with another server which is the OpenWeather. The receive data will be displayed on the OLED display.
tags:
  - http get micropython
  - micropython esp32 tutorials
  - open weather
  - openweather micropython
  - openweather rest api
  - openweather restful api
series:
  - ESP32 MicroPython
title: '019 - ESP32 MicroPython: OpenWeather | RESTful APIs'
url: /2020/11/20/019-esp32-micropython-openweather-restful-apis/
---

## **Introduction**

![](/images/019-esp32-openweather-techtotinker.png)

In the previous tutorial, I demonstrate using the RESTful APIs to communicate with Thingspeak server sending DHT sensor data. Now in this aticle, I will demonstrate the opposite which is requesting data from a server. This time, communicating with another server which is the OpenWeather. The receive data will be displayed on the OLED display.

We will use urequests MicroPython library to simplify our code for every HTTP request.

## **Bill Of Materials**

1. ESP32 development board or any microcontroller with MicroPython firmware.
2. 0.96 OLED display.

## **Hardware Instruction**

1. Connect the OLED VCC pin to ESP32 3.3V pin.
2. Connect the OLED GND pin to ESP32 GND pin.
3. Connect the OLED SCL pin to ESP32 pin 22.
4. Connect the OLED SDA pin to ESP32 pin 21.
5. Save ssd1306.py to ESP32 MicroPython root directory. Refer to tutorial #10 for more details.
6. Copy and paste the source code provided below and save to your computer. Or you might want to save it to ESP32 MicroPython root directory with a name of main.py in order to run it automatically after reset.
7. Enjoy.

## **Video Demonstration**

{{< youtube Tr70dILTjgo >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

```py { lineNos="true" wrap="true" }
# **************************************# 
# Author: George Bantique               #  
#         TechToTinker Youtube Channel  # 
#         TechToTinker.blogspot.com     # 
#         tech.to.tinker@gmail.com      # 
# Date: Nov.20, 2020                    # 
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
led = machine.Pin(2,machine.Pin.OUT)

scl = machine.Pin(22, machine.Pin.OUT, machine.Pin.PULL_UP)
sda = machine.Pin(21, machine.Pin.OUT, machine.Pin.PULL_UP)
i2c = machine.I2C(scl=scl, sda=sda, freq=400000)
oled = ssd1306.SSD1306_I2C(128, 64, i2c, addr=0x3C)
def print_text(msg, x, y, clr):
    if clr:
        oled.fill(0)
    oled.text(msg, x, y)
    oled.show()

# ************************************** 
# Configure the ESP32 wifi as STAtion 
sta = network.WLAN(network.STA_IF) 
if not sta.isconnected():  
  print('connecting to network...')  
  sta.active(True)  
  #sta.connect('your wifi ssid', 'your wifi password')  
  sta.connect('your wifi ssid', 'your wifi password')  
  while not sta.isconnected(): 
    pass  
print('network config:', sta.ifconfig()) 

# **************************************
# Global variables and constants:
#api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
#https://api.openweathermap.org/data/2.5/weather?q=manila&appid=3c2034495c602ddfa627774642a672b0

BASE_URL = "https://api.openweathermap.org/data/2.5/weather?"
API_KEY = "your api key" 
CITY_NAME = "your city here" 
URL = BASE_URL + "q=" + CITY_NAME + "&appid=" + API_KEY

UPDATE_INTERVAL_ms = 5000 # in ms time unit
last_update = time.ticks_ms()

# **************************************
# Main loop:
while True:
    if time.ticks_ms() - last_update >= UPDATE_INTERVAL_m
        # send a weather data request
        response = urequests.get(URL)

        # check status code of the request 
        if response.status_code == 200: 
            # get the json format of data
            data = response.json() 

            # get the main dict block
            # it contains the weather data
            main = data['main'] 

            # get the temperature and subtract
            # 273.15 to get temp in Celcius
            # originally temp is in Kelvin
            temperature = main['temp'] - 273.15 

            # get the humidity in %
            humidity = main['humidity'] 

            # get the pressure in hPA
            pressure = main['pressure'] 

            # weather report 
            report = data['weather'] 

            ## OLED display
            print_text('**OpenWeather**', 3, 5, 1)
            print_text('City:{}' .format(CITY_NAME), 3, 15, 0)
            print_text('Temp:{} oC' .format(temperature), 3, 25, 0)
            print_text('Humi:{} %' .format(humidity), 3, 35, 0)
            print_text('Pres:{} hPa' .format(pressure), 3, 45, 0)
            print_text('"{}."' .format(report[0]['description']), 3, 55, 0)

            ## debug messages
            print('')
            print('**OpenWeather**')
            print('City:{}' .format(CITY_NAME))
            print('Temperature:{} oC' .format(temperature)) 
            print('Humidity:{} %' .format(humidity)) 
            print('Pressure:{} hPa' .format(pressure)) 
            print('Weather Report:{}.' .format(report[0]['description'])) 
        else: 
            # show error message 
            print_text('Error in HTTP request.', 3, 20, 1)
            print('Error in HTTP request.')

        led.value(not led.value())
        last_update = time.ticks_ms()
```

