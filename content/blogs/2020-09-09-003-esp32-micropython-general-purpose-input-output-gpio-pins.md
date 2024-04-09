---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-09-09T08:48:00+08:00'
series:
  - ESP32 MicroPython
title: '003 - ESP32 MicroPython: General Purpose Input Output | GPIO Pins'
url: /2020/09/09/003-esp32-micropython-general-purpose-input-output-gpio-pins/
---

## **Video Demonstration**

{{< youtube 9J4YWvHMWf4 >}}

## **Call To Action**

If you like this tutorial and you find it useful, please Share it to your friends. Please consider also supporting me by Subscribing. [Click this to Subscribe to TechToTinker Youtube channel.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

## **Source Code**

### **Example 1:**

```py { lineNos="true" wrap="true" }
import machine
import time
led = machine.Pin(2, machine.Pin.OUT)
counter = 0
while (counter < 5):
    led.on()
    time.sleep(0.5)
    led.off()
    time.sleep(0.5)
    counter += 1
print('Blinking LED is complete')

```

### **Example 2:**

```py { lineNos="true" wrap="true" }
import machine
import time
led = machine.Pin(2, machine.Pin.OUT)
def blink_led_ntimes(num, t_on, t_off, msg):
    counter = 0
    while (counter < num):
        led.on()
        time.sleep(t_on)
        led.off()
        time.sleep(t_off)
        counter += 1
    print(msg)

```

### **Example 3:**

```py { lineNos="true" wrap="true" }
import machine
led = machine.Pin(2, machine.Pin.OUT)
sw = machine.Pin(0, machine.Pin.IN)
while True:
    if (sw.value() == 0):
        led.on()
    else:
        led.off()

```

