---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-06T13:35:00+08:00'
excerpt: In this article, we will learn how to use an LDR with ESP32 using MicroPython programming language. LDR stands for Light Dependent Resistor. It is a type of electronic component that changes resistance according to the light intensity.
tags:
  - ESP32 LDR
  - Light Dependent Resistor
  - MicroPython automatic light
  - Micropython intruder alarm
  - MicroPython LDR
series:
  - MicroPython TechNotes
title: '026 - MicroPython TechNotes: Light Dependent Resistor (LDR)'
url: /2021/04/06/026-micropython-technotes-light-dependent-resistor-ldr/
---

## **Introduction**

![](/images/026-LDR-blog.png)

In this article, we will learn how to use an LDR with ESP32 using MicroPython programming language. LDR stands for Light Dependent Resistor. It is a type of electronic component that changes resistance according to the light intensity.

## **Pinout**

1. **G** – for the ground.
2. **V** – for the supply voltage.
3. **S** – for the signal pin.

## **Bill Of Materials**

1. An ESP32 development board to serve as the brain for the experiment.
2. Gorillacell ESP32 shield to extend ESP32 pins to pin headers for easy circuit connection.
3. A 3-pin female-female dupont jumper wires to attach the LDR module to the ESP32 shield.
4. An LDR sensor module itself.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont jumper wires to the LDR module by following a color coding which is black for the ground, red for the VCC, and yellow for the signal pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers such as black to black, red to red, and yellow to yellow. For this, I choose GPIO 32 to serve as analog input pin from the LDR module.
4. Next, power the ESP32 shield with an external power supply with a type-C USB cable and make sure that the power switch is set to the ON state.
5. Lastly, connect the ESP32 to the computer using a micro-USB cable.

## **Software Instruction**

For this experiment, I prepared 3 examples.

Copy and paste it to your Thonny IDE.

Please feel free to modify it according to your needs.

Happy tinkering.

## **Video Demonstration**

{{< youtube R0irhLDL4Tc >}}

## **Call To Action**
For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, basics of reading an LDR module:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC

LDR = ADC(Pin(32, Pin.IN))
LDR.atten(ADC.ATTN_11DB)

# The following line of codes can be tested using the REPL:
#print(LDR.read())

```

### 2. Example # 2, automatic lights using an LDR:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from time import sleep_ms

LDR = ADC(Pin(32, Pin.IN))
LDR.atten(ADC.ATTN_11DB)
led = Pin(2, Pin.OUT)

while True:  
   ldr_value = LDR.read()  
   if ldr_value < 2400:  
     # Its dark  
     led.on()  
   elif ldr_value > 2500:  
     # Its bright  
     led.off()  
   sleep_ms(50)  

```

### 3. Example # 3, Intruder Detection Security System:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from time import sleep_ms

LDR = ADC(Pin(32, Pin.IN))
LDR.atten(ADC.ATTN_11DB)

laser = Pin(25, Pin.OUT)
laser.on()

led = Pin(2, Pin.OUT)

isAlert = False
print(LDR.read())

while True:
    if LDR.read() < 3000:
        isAlert = True
    else:
        isAlert = False
        
    if isAlert:
        led.value(not led.value())
        sleep_ms(100)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[gorillacell.kr](http://gorillacell.kr/)

