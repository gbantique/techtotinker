---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-03-22T11:35:00+08:00'
excerpt: In this article, we will learn on how to use switch module with ESP32 using MicroPython programming language.
tags:
  - ESP32 switch
  - micropython reading an input
series:
  - MicroPython TechNotes
title: '019 - MicroPython TechNotes: Switch Module'
url: /2021/03/22/019-micropython-technotes-switch-module/
---

## **Introduction**

![](/images/019-technotes-switch.png)

In this article, we will learn on how to use switch module with ESP32 using MicroPython programming language.

## **Pinout**

1. **G** – for the ground pin.
2. **V** – for the supply voltage.
3. **S** – for the signal pin.

## **Bill Of Materials**

1. **ESP32 development board** which will serve as the brain for this experiment.
2. **ESP32 shield from Gorillacell** which will extend the ESP32 pins to shield’s pin headers for easy circuit connection.
3. **3-pin Female-Female dupont wires** to attach the switch module to ESP32 shield.
4. **Switch module**.

## **Hardware Instruction**

1. First, attach the ESP32 on top of ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to switch module according to color coding which is black for the ground, red for the VCC, and yellow for the signal pin.
3. Next, attach the other end of the dupont wires to ESP32 shield by matching the colors of the wires to the colors of the pin headers. For this experiment, I choose GPIO 32 as the signal pin.
4. Next, power the ESP32 shield with an external power supply with a type-C USB cable.
5. Lastly, connect the ESP32 to the computer through a micro USB cable. Our circuit should now be ready.

## **Software Instruction**

For this, I prepared 2 example source code for you to try. Copy and paste it to Thonny IDE.

Play with it and adapt it according to your needs.

Enjoy.

## **Video Demonstration*

{{< youtube XZqDXWd_W8Q >}}

## **Call To Action**

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

switch = Pin(32, Pin.IN)

# # The following lines of code can be tested in the REPL:
# switch.value() # Reads the current value of the switch.
# # Return value is 1 when switch is set to ON state,
# # the value is 0 when switch is set to OFF state.

```
### 2. Example # 2, simple application for the switch module:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

switch = Pin(32, Pin.IN)
led = Pin(2, Pin.OUT)

while True:
    if switch.value()==1:
        # Switch is set to ON state
        # Lets toggle the state of the LED
        # to create a blinking LED.
        led.value(not led.value())
        sleep_ms(300)
    else:
        # Switch is set to OFF state
        # Lets turn OFF the LED.
        led.value(0)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[gorillacell.kr/](http://gorillacell.kr/)

