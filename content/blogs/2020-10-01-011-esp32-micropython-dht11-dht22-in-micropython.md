---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-10-01T19:55:00+08:00'
tags:
  - dht11 micropython
  - DHT22 micropython
  - esp32 micropython
  - ESP8266 MicroPython
  - MicroPython tutorials
series:
  - ESP32 MicroPython
title: '011 - ESP32 MicroPython: DHT11, DHT22 in MicroPython'
url: /2020/10/01/011-esp32-micropython-dht11-dht22-in-micropython/
---

## **Introduction**

In this tutorial, we will learn to use the DHT22 in MicroPython. DHT11 should be compatible with slight modification.

## **Circuit Diagram**

![](/images/dht_mp.png)

## **Hardware Instruction**

1. Connect the OLED VCC pin to 3V3 supply pin of ESP32.  
2. Connect the OLED GND pin to ESP32 GND pin.  
3. Connect the OLED SCL pin to ESP32 GPIO D22 pin (SCL dedicated pin).  
4. Connect the OLED SDA pin to ESP32 GPIO D21 pin (SDA dedicated pin).  
5. Connect the DHT VCC pin to 3V3 supply pin of ESP32.  
6. Connect the DHT GND pin to ESP32 GND pin.  
7. Connect the DHT Signal pin to ESP32 GPIO D23 pin.

## **Video Demonstration**

{{< youtube USXOmXakEYQ >}}

## **Call To Action**

If you have any question regarding this tutorial, please do not hesitate to write your inquiry in the comment box provided.

If you enjoy this tutorial, please consider supporting me by Subscribing. [Click this to Subscribe to TechToTinker Youtube channel.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you.

## **Source Code**

### **Example 1, Display DHT readings in OLED display:**

```py { lineNos="true" wrap="true" }

# Display DHT22 readings in 0.96 OLED display
# Date: October 1, 2020

# Import the machine module to access the pins
import machine
# Import the time module for the intervals
import time

# OLED display initializations
import ssd1306
scl = machine.Pin(22, machine.Pin.OUT, machine.Pin.PULL_UP)
sda = machine.Pin(21, machine.Pin.OUT, machine.Pin.PULL_UP)
i2c = machine.I2C(scl=scl, sda=sda, freq=400000)
oled = ssd1306.SSD1306_I2C(128, 64, i2c, addr=0x3C)

# DHT sensor initializations
import dht
d = dht.DHT22(machine.Pin(23))
# If you will use DHT11, change it to:
# d = dht.DHT11(machine.Pin(23))

# Simple function for displaying the 
# humidity and temperature readings
# in the OLED display
def display_reads():
	# Get the DHT readings
    d.measure()
    t = d.temperature()
    h = d.humidity()
    
    # Clear the screen by populating the screen with black
    oled.fill(0)
    # Display the temperature
    oled.text('Temperature *C:', 10, 10)
    oled.text(str(t), 90, 20)
    # Display the humidity
    oled.text('Humidity %:', 10, 40)
    oled.text(str(h), 90, 50)
    # Update the screen display
    oled.show()
    
    # Or you may use the REPL
    print('Temperature:', t, '*C', ' ', 'Humidity', h, '%')


INTERVAL = 2000			# Sets the interval to 2 seconds
start = time.ticks_ms() # Records the current time
display_reads()			# Initial display	

# This is the main loop
while True:
	# This if statements will be true every
    # INTERVAL milliseconds, for this example,
    # it will trigger every 2 seconds since 
    # DHT22 samples every 2 seconds interval
    if time.ticks_ms() - start >= INTERVAL:
    	# Update the display
        display_reads()		
        # Record the new start time
        start = time.ticks_ms()

```

