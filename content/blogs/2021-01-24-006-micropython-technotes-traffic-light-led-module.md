---
author: George Bantique
categories:
  - ESP32
  - GorillaCell
  - MicroPython
date: '2021-01-24T17:02:00+08:00'
excerpt: In this article, we will learn on how to use the Traffic Light LED module. It is a small model or miniature of the traffic light.
tags:
  - esp32 micropython
  - ESP32 Traffic Light
  - How to use Traffic Light in MicroPython
  - MicroPython Traffic Light LED
  - micropython tutorial
series:
  - MicroPython TechNotes
title: '006 - MicroPython TechNotes: Traffic Light LED Module'
url: /2021/01/24/006-micropython-technotes-traffic-light-led-module/
---

## **Introduction**

![](/images/006-technotes-traffic-light-led-micropython.png)

In this article, we will learn on how to use the Traffic Light LED module. It is a small model or miniature of the traffic light.

## **Pinout**

1. **G** – for the ground.
2. **V** – for the supply voltage.
3. **Green** – for the control signals for green LED.
4. **Yellow** – for the control signals for yellow LED.
5. **Red** – for the control signals for red LED.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorilla Cell ESP32 shield (optional)
3. 5-pin dupont jumper wires.
4. Traffic Light LED module.

## **Hardware Instruction**

1. Attach the ESP32 on top of the ESP32 shield making sure that the pins are properly aligned and both the USB port are on the same side.
2. Attach the dupont jumper wires to Traffic Light LED module by following a color coding which is: 
    - black – for the ground.
    - red – for the VCC.
    - yellow and following colors – for the control signal.
3. Attach the other side of the dupont jumper wires on ESP32 shield by matching the colors of the dupont wires to the pin headers of ESP32 shield pin headers.
4. Power the ESP32 shield with the USB type-C cable.
5. Power ON the shield by sliding the slide switch to ON / BATT.
6. Connect the ESP32 to computer by connecting the micro USB cable.

## **Software Instruction**

1. Open the Thonny Python IDE. If you don’t have this installed, be sure to watch the article tutorial # 1.
2. Press the “Stop” button to let the Thonny Python IDE to connect to ESP32.
3. Create a new Python file by clicking the “New” button.
4. Copy and paste the provided source code below to your Thonny.
5. Press “Run the current script” to execute the code.
6. Enjoy and feel free to modify it according to your liking.

## **Video Demonstration**

{{< youtube IWBFpWScAhU >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Traffic Light LED: Example # 1, simple turn ON and OFF:

```py { lineNos="true" wrap="true" }
from machine import Pin
from time import sleep

g = Pin(23, Pin.OUT)
y = Pin(25, Pin.OUT)
r = Pin(26, Pin.OUT)

# The following code should be 
# tested on the REPL.
g.on()  # Turn ON green LED.
g.off() # Turn OFF green LED.

r.value(1) # Turn ON red LED.
r.value(0) # Turn OFF red LED.

y.value(True)  # Turn ON yellow LED.
y.value(False) # Turn OFF yellow LED.
```

### 2. Traffic Light LED: Example #2, running LED:

```py { lineNos="true" wrap="true" }
from machine import Pin
from time import sleep

g = Pin(23, Pin.OUT)
y = Pin(25, Pin.OUT)
r = Pin(26, Pin.OUT)
led = [r, y, g]

while True:
    for x in range(3):
        led[x].on()
        sleep(0.3)
        led[x].off()

```

### 3. Traffic Light LED: Example #3, single traffic light:

```py { lineNos="true" wrap="true" }
from machine import Pin
from time import sleep

g = Pin(23, Pin.OUT)
y = Pin(25, Pin.OUT)
r = Pin(26, Pin.OUT)

traffic_state = ['SOLID_GRN',
                 'BLINK_GRN',
                 'SOLID_RED',
                 'SOLID_ORN']

while True:
    for x in traffic_state:
        if x == 'SOLID_GRN':
            g.on()
            sleep(6)
            g.off()
        
        if x == 'BLINK_GRN':
            for i in range(4):
                g.on()
                sleep(0.3)
                g.off()
                sleep(0.3)
        
        if x == 'SOLID_RED':
            r.on()
            sleep(7)
            r.off()
            
        if x == 'SOLID_ORN':
            y.on()
            sleep(1)
            y.off()
```

## **References And Credits**

1. [gorillacell.kr/](http://gorillacell.kr/)

