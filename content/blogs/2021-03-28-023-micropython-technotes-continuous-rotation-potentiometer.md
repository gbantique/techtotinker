---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-03-28T05:53:00+08:00'
excerpt: In this article, we will tackle on how to use CONTINUOUS ROTATION POTENTIOMETER with ESP32 using MicroPython programming language.
tags:
  - MicroPython tutorials
series:
  - MicroPython TechNotes
title: '023 - MicroPython TechNotes: Continuous Rotation Potentiometer'
url: /2021/03/28/023-micropython-technotes-continuous-rotation-potentiometer/
---

## **Introduction**

![](/images/023-technotes-continuous-rotation-potentiometer.png)

In this article, we will tackle on how to use CONTINUOUS ROTATION POTENTIOMETER with ESP32 using MicroPython programming language.

## **Pinout**

1. **GND** – for the ground.
2. **VCC** – for the supply voltage.
3. **SIG** – for the signal pin.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 3-pin female-female dupont wires.
4. Continuous Rotation Potentiometer module.

## **Hardware Instruction**

1. First, attach the ESP32 dev board on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to the Continuous Rotation Potentiometer module by following the color coding which is black for the ground, red for the VCC, and yellow for the signal pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers which is black to black, red to red, and yellow to yellow.
4. Next, power the ESP32 shield with an external power supply with a type-C USB cable and make sure that the power switch is set to ON state.
5. Lastly, connect ESP32 to the computer with a micro USB cable. Our demo circuit should now be ready.

## **Software Instruction**

I prepared 2 example source code for this demonstration.

Copy and paste it to Thonny IDE.

Modify and adapt it according to your needs, and most of all enjoy learning.

## **Video Demonstration**

{{< youtube LRHXe90JJtQ >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, basics of reading an analog input pin:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from time import sleep_ms

p32 = Pin(32, Pin.IN)
crpot = ADC(p32)
crpot.atten(ADC.ATTN_11DB)

while True:
    print(crpot.read())
    sleep_ms(300)

```

### 2. Example # 2, application of using Continuous Rotation Potentiometer module:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from neopixel import NeoPixel
from time import sleep_ms

p32 = Pin(32, Pin.IN)
crpot = ADC(p32)
crpot.atten(ADC.ATTN_11DB)

NUM_OF_LED = 16
np = NeoPixel(Pin(25), NUM_OF_LED)
np.fill((0,0,0))

def map(x, in_min, in_max, out_min, out_max):
    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

while True:
    crpot_value = crpot.read()
    np.fill((0,0,0))
    np_addr = map(crpot_value, 0, 4095, 0, 15)
    np[np_addr] = (10, 0, 0)
    np.write()
    sleep_ms(300)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit:
[gorillacell.kr](http://gorillacell.kr/)

