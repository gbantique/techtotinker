---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-10-06T11:46:00+08:00'
excerpt: 'In this article, I will discussed how to use an Analog Touch Sensor module which is interface to ESP32 with MicroPython programming language.

  Analog Touch Sensor module of Gorillacell ESP32 development kit provides a 4 touch sensor input in a single pin.'
tags:
  - analog touch sensor esp32
  - analog touch sensor micropython
  - analog touch sensor tutorial
  - esp32 micropython tutorial
  - touch sensor esp32
  - touch sensor micropython
series:
  - MicroPython TechNotes
title: '048 - MicroPython TechNotes: Analog Touch Sensor'
url: /2021/10/06/048-micropython-technotes-analog-touch-sensor/
---

## **Introduction**

![](/images/048-MicroPython-TechNotes-Analog-Touch-Sensor.jpg)

In this article, I will discussed how to use an Analog Touch Sensor module which is interface to ESP32 with MicroPython programming language.
Analog Touch Sensor module of Gorillacell ESP32 development kit provides a 4 touch sensor input in a single pin. This is achieve because the module provides a different analog value differently for each touch input.

## **Pinout**

This module has 3 pins which are:
1. **G** – for the ground pin.
2. **V** – for the supply voltage.
3. **S** – for the analog touch sensor signal pin.

## **Bill Of Materials**

In order to follow this lesson, you will need the following:
1. An ESP32 development board with Micropython firmware.
2. A Gorillacell ESP32 shield (this is optional, you can use a breadboard instead and just follow the circuit connection).
3. A 3-pin dupont wires.
4. And of course the Analog Touch Sensor itself.
5. You might also need an 8×8 Dot Matrix display with SPI interface for the example # 3.

## **Hardware Instruction**

1. Connect the Analog Touch Sensor G pin to ESP32 GND pin.
2. Connect the Analog Touch Sensor V pin to ESP32 3.3V pin.
3. Connect the Analog Touch Sensor S pin to ESP32 GPIO 32. MicroPython implements ADC inputs on GPIO 32 to GPIO 39 only.

## **Video Demonstration**

{{< youtube 9YR26NDkx0E >}}

## **Call To Action**

If you have any concern regarding this lesson, be sure to write your message in the comment section.
You might also like to consider supporting my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker YT channel.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you,
    – George Bantique | tech.to.tinker@gmail.com

## **Source Code**

### 1. Example # 1, exploring the basics using the REPL:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import ADC

p32 = Pin(32, Pin.IN)
ats = ADC(p32)
ats.atten(ADC.ATTN_11DB)

print(ats.read())

```

### 2. Example # 2, automatic detection of touch sensor key press:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from time import sleep

p32 = Pin(32, Pin.IN)
ats = ADC(p32)
ats.atten(ADC.ATTN_11DB)

while True:
    adc_value = ats.read()
    
    if (adc_value>638) and (adc_value<698):
        print('You pressed # 1.')
    elif (adc_value>1483) and (adc_value<1543):
        print('You pressed # 2.')
    elif (adc_value>2303) and (adc_value<2363):
        print('You pressed # 3.')
    elif (adc_value>3169) and (adc_value<3229):
        print('You pressed # 4.')
        
    sleep(0.3)

```

### 3. Example # 3, control the pixel movement on Dot Matrix Display using the Analog Touch Sensor:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import ADC
from machine import SPI
from time import sleep
from max7219 import Max7219

spi = SPI(1,
          baudrate=10000000,
          polarity=1,
          phase=0,
          sck=Pin(19),
          mosi=Pin(23))
cs = Pin(18, Pin.OUT)
dot = Max7219(8, 8, spi, cs, True)
dot.brightness(15)

p32 = Pin(32, Pin.IN)
ats = ADC(p32)
ats.atten(ADC.ATTN_11DB)

col = 0
row = 0

while True:
    analog_value = ats.read()
    
    if (analog_value>640) and (analog_value<700):
        if col > 0:
            col = col - 1
    elif (analog_value>1470) and (analog_value<1530):
        if col < 7:
            col = col + 1
    elif (analog_value>2310) and (analog_value<2370):
        if row > 0:
            row = row - 1
    elif (analog_value>3170) and (analog_value<3230):
        if row < 7:
            row = row + 1

    dot.fill(0)
    dot.pixel(col, row, 1)
    dot.show()
    
    sleep(0.1)

```

## **References And Credits**
1. Purchase your Gorillacell ESP32 development kits from:
[https://gorillacell.kr/](https://gorillacell.kr/)

