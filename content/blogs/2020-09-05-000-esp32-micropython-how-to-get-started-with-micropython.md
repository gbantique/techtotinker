---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-09-05T14:10:00+08:00'
tags:
  - getting started with micropython
  - how to use micropython esp32
series:
  - ESP32 MicroPython
title: '000 - ESP32 MicroPython: How to Get Started with MicroPython'
url: /2020/09/05/000-esp32-micropython-how-to-get-started-with-micropython/
---

## **Introduction**

In this article you will learn how to get started with MicroPython explorations. We will begin to learn to install first a Thonny Python IDE for developing MicroPython codes for development board of your choice. I will be using an ESP32 development board.

## **Instruction**

1. Download the Thonny Python IDE at:  
[Download Thonny Python](https://thonny.org/)   
This is one of the best, beautiful, and beginner-friendly IDE available. We will also use Thonny Python to erase and flash new firmware to ESP32 with the help of esptool pluggins.

2. Download the MicroPython firmware from:  
[Download Firmware at MicroPython.org](http://micropython.org/)  
Go to download section and look for your development board. Choose the stable bin file for your board.

3. Download the ESP32 USB driver at:  
[Download ESP32 USB driver](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers)

4. Download some references files for your development board like pinouts and schematic diagram.

5. Install Thonny Python

6. Install the ESP32 USB driver

7. Flash a new firmware to ESP32 using the Thonny Python.

## **Video Demonstration**

{{< youtube elBtWZ_fOZU >}}

## **Call To Action**

If you find this tutorial as helpful, please take time to share it so that it can reach more people who might benefited from this.

Please kindly support me by Subscribing to my Youtube channel: [Click this to SUBSCRIBE to TechToTinker](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

[](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)[](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)  

## **Source Code**

### **Example 1, Turn ON or turn OFF the onboard LED**

```py { lineNos="true" wrap="true" }

# Load the 'machine' module to access the hardware
import machine

# Create an 'led' object in pin 2
# and set the pin direction to output
led = machine.Pin(2, machine.Pin.OUT)

# This turns on or turns off the 'led'
led.on()
led.off()

# This is the same as the above code
# but now we are passing a value
led.value(1)
led.value(0)

# This is the same as the above code
# as you already know
#	1 = True
#	0 = False
led.value(True)
led.value(False)

```

### **Example 2, Blink the onboard LED**

```py { lineNos="true" wrap="true" }

# Load the 'machine' module to access the hardware
import machine

# Load the 'time' module which includes the 'sleep' class
import time

# Create an 'led' object in pin 2
# and set the pin direction to output
led = machine.Pin(2, machine.Pin.OUT)

# Create an eternal loop that blinks the LED
# time.sleep(0.5) creates a 0.5 second delay
# or 500 milli seconds
while True:
    led.on()
    time.sleep(0.5)
    led.off()
    time.sleep(0.5)
```

