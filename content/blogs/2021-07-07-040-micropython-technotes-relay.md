---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-07-07T13:05:00+08:00'
excerpt: In this article, I will discussed about the RELAY with ESP32 using MicroPython.
tags:
  - ESP32
  - ESP8266
  - MicroPython relay
  - Node MCU
series:
  - MicroPython TechNotes
title: '040 - MicroPython TechNotes: Relay'
url: /2021/07/07/040-micropython-technotes-relay/
---

## **Introduction**

![](/images/040-2BMicroPython-2BTechNotes-2BRelay.png)

In this article, I will discussed about the RELAY with ESP32 using MicroPython.

## **Pinout**

1. **G** – for the the ground.
2. **V** – for the supply voltage.
3. **S** – for the control signal pin.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 3-pin F-F Dupont wires.
4. Gorillacell relay module.

## **Hardware Instruction**

1. Connect relay G pin to ESP32 GND pin.
2. Connect relay V pin to ESP32 5V pin.
3. Connect relay S pin to ESP32 GPIO 23 pin.

## **Software Instruction**

1. Copy example program in the source code section.
2. Please feel to modify according to your needs.

## **Video Demonstration**

{{< youtube e2SRPIaOnU0 >}}

## **Call To Action**

If you have any question regarding this video, please write your message in the comment section.

You might also like to support me on my Youtube channel by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Hope you find it useful. Thank you.

Regards,

– George Bantique | tech.to.tinker@gmail.com

## **Source Code**

### 1. Example # 1, exploring the basics:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

relay = Pin(23, Pin.OUT)


# ******************************************************************
# The following should be explored using the REPL:
# ******************************************************************
# # 1. To activate the relay, set signal pin to logic 1
# relay.value(1)

# # 2. To deactivate the relay, set signal pin to logic 0
# relay.value(0)

```

### 2. Example # 2, simple application:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import ticks_ms

relay = Pin(23, Pin.OUT)
sw = Pin(0, Pin.IN)

isActive = False
start = ticks_ms()

while True:
    if ticks_ms()-start>=300:
        if sw.value()==0:
            isActive = not isActive
            relay.value(isActive)
        start=ticks_ms()

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
    [https://gorillacell.kr](https://gorillacell.kr/)

