---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-03-13T20:14:00+08:00'
excerpt: In this article, we will on how to use an RGB LED matrix or 8×8 Neopixel display with MicroPython language.
tags:
  - 8×8 RGB Matrix display
  - Addressable RGB
  - ESP32 Neopixel
  - ESP32 WS2812B
  - MicroPython Neopixel
series:
  - MicroPython TechNotes
title: '016 - MicroPython TechNotes: RGB LED Matrix'
url: /2021/03/13/016-micropython-technotes-rgb-led-matrix/
---

## **Instruction**

![](/images/016-technotes-8x8rgb-led.png)

In this article, we will on how to use an RGB LED matrix or 8×8 Neopixel display with MicroPython language.

## **Pinout**

1. **GND** – for the ground pin.
2. **+5V** – for the supply voltage.
3. **DIN** – for the data input control signal pin.

## **Hardware Instruction**

1. First connect the ESP32 dev board on top of the ESP32 shield and make sure that both USB ports are on the same side.
2. Next, attach the dupont wire to the RGB LED matrix according to the color coding that is black for the ground, red for the +5V, and yellow for the DIN control signal pin.
3. Next, attach the other side of the dupont wire to the ESP32 shield by matching the colors of the dupont wires to the colors of the pin headers in the ESP32 shield. That is black to black, red to red, and yellow to yellow. For this experiment, I used GPIO 23 pin as a control signal pin for the RGB LED matrix.
4. Next, power the ESP32 shield by attaching an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through a micro-USB connector. The demo circuit is now ready.

## **Software Instruction**

MicroPython have a builtin library to drive the RGB LED matrix by importing the neopixel library.

## **Video Demonstration**

{{< youtube xQO2zR4rVSQ >}}

## **Call To Action**

For any concern, write your message in the comment section.

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
from neopixel import NeoPixel

NUM_OF_LED = 64
np = NeoPixel(Pin(23), NUM_OF_LED)

# # The following lines of codes should be tested using the REPL
# # Syntax:
# #    np[] = (, , )
# #    np.write()
# # ------------------------------------------------------------
# # 1. To set the 1st neopixel to red color:
# np[0] = (0, 10, 0)
# np.write()
# 
# # 2. To set the 1st to red color,
# #               9th to green color, and
# #               17th to blue color
# #    which are basically 3 LEDs in the first column
# np[0] = (255, 0, 0)
# np[8] = (0, 255, 0)
# np[16] = (0, 0, 255)
# np.write()
#
# # 3. To turn OFF all neopixel:
# for npixel in range(64):
#     np[npixel] = (0, 0, 0)
#     np.write()

```

### 2. Example # 2, turning each LED one-by-one:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, reset
from neopixel import NeoPixel
from time import sleep_ms

NUM_OF_LED = 64
LED_INTENSITY = 10
np = NeoPixel(Pin(23), NUM_OF_LED)

while True:
    try:
        for npixel in range(NUM_OF_LED):
            np[npixel] = (LED_INTENSITY, 0, 0)
            np.write()
            sleep_ms(100)
            np[npixel] = (0, 0, 0)
            np.write()
    except KeyboardInterrupt:
        print('Keyboard Interrupt')
    finally:
        print('Exiting....')
        reset()

```

### 3. Example # 3, class to handle addressing of matrix by coordinates:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, reset
from neopixel import NeoPixel
from time import sleep_ms

class RGB_Matrix:
    
    def __init__(self, gpio, width, height):
        self.width = width
        self.height = height
        self.neopixel = NeoPixel(Pin(gpio), width*height)
        
    def pixel_set(self, row, col, r=0, g=0, b=0, color=''):
        if color == '': 
            self.neopixel[col + (row*self.width)] = (r, g, b)
            self.neopixel.write()
        else:
            self.neopixel[col + (row*self.width)] = self.color
            self.neopixel.write()
            
    def pixel_clr(self, row, col):
        self.neopixel[col + (row*self.width)] = (0, 0, 0)
        self.neopixel.write()
        
    def clear_all(self):
        self.neopixel.fill((0,0,0))
        self.neopixel.write()


np = RGB_Matrix(23, 8, 8)

```

## **References And Credits**

1. Purchase Gorillacell ESP32 development kit at:
[gorillacell.kr](http://gorillacell.kr/)

