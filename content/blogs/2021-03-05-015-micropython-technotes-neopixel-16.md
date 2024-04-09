---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-03-05T20:18:00+08:00'
excerpt: In this article, we will learn about the addressable NeoPixel. Addressable Neopixel contains a WS2812B chip and an RGB LED in one package. With WS2812B, it is possible to make the a chain of RGB LED to be addressable. Meaning to say, it can be controlled individually.
tags:
  - Addressable RGB
  - ESP32 Neopixel
  - ESP32 WS2812B
  - MicroPython Neopixel
series:
  - MicroPython TechNotes
title: '015 - MicroPython TechNotes: Neopixel 16'
url: /2021/03/05/015-micropython-technotes-neopixel-16/
---

## **Introduction**

![](/images/015-technotes-neopixel-16-RGB-LED-ring.png)

In this article, we will learn about the addressable NeoPixel. Addressable Neopixel contains a WS2812B chip and an RGB LED in one package. With WS2812B, it is possible to make the a chain of RGB LED to be addressable. Meaning to say, it can be controlled individually.

## **Bill Of Materials**

1. ESP32 development board.
2. ESP32 shield from Gorillacell ESP32 development kit (optional, you can still make it without this shield. It is just use to simplify the circuit connection).
3. 3-pin female-female dupont jumper wires.
4. Neopixel Ring (16 RGB)

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **DI** – for the Data Input (DI) control signal pin.

## **Hardware Instruction**

1. First, attach the ESP32 dev board on top of the ESP32 shield making sure that pins are aligned and the USB ports are on the same side.
2. Next, attach the dupont wires to the Neopixel ring according to the color coding which is black for the ground, red for the VCC, and yellow for the control signal pin.
3. Next, attach the other side of the dupont to the ESP32 shield by matching the colors of the wires to the colors of the pin headers in the ESP32 shield, that is black to black, red to red, and yellow to yellow.
4. Next, power the ESP32 shield by attaching an external power supply with a type-C USB connector. Make sure that the power switch is set to the ON state.
5. Next, connect the ESP32 to the computer through the micro USB cable. The demo circuit should now be ready.

## **Software Instruction**

MicroPython has a builtin module or driver library for the Neopixel. Just import it in the source code.

## **Video Demonstration**

{{< youtube _w0O-qEeqHg >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, basic exploration of the neopixel:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from neopixel import NeoPixel

NUM_OF_LED = 16
np = NeoPixel(Pin(23), NUM_OF_LED)


# # The following lines of codes should be tested using the REPL
# # Syntax:
# #    np[] = (, , )
# #    np.write()
# # ------------------------------------------------------------
# # 1. To set the 1st neopixel to red color:
# np[0] = (255, 0, 0)
# np.write()
# 
# # 2. To set the 4th neopixel to green color:
# np[3] = (0, 255, 0)
# np.write()
# 
# # 3. To set the 5th and 7th neopixel to blue color:
# np[4] = (0, 0, 255)
# np[6] = (0, 0, 255)
# np.write()
# 
# # 4. To set the 1st to red color,
# #               3rd to green color, and
# #               5th to blue color
# np[0] = (255, 0, 0)
# np[2] = (0, 255, 0)
# np[4] = (0, 0, 255)
# np.write()
# 
# # 5. The value given to each neopixel LED
# #    represents its brightness
# np[0] = (1, 0, 0)
# np.write()
# 
# # 6. To turn OFF all neopixel:
# for npixel in range(16):
#     np[npixel] = (0, 0, 0)
#     np.write()

```

### 2. Example # 2, rotating LED light:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from neopixel import NeoPixel
from time import sleep_ms

NUM_OF_LED = 16
np = NeoPixel(Pin(23), NUM_OF_LED)

while True:
    for npixel in range(NUM_OF_LED):
        np[npixel] = (0, 0, 255)
        np.write()
        sleep_ms(100)
        np[npixel] = (0, 0, 0)
        np.write()

```

### 3. Example # 3, same as Example # 2 but changes LED color each rotation:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from neopixel import NeoPixel
from time import sleep_ms

NUM_OF_LED = 16          # Number of Neopixel LED
LED_ON_VALUE = 255       # 255 is maximum value for the LED brightness
LED_OFF_VALUE = 0        # while 0 to turned it OFF
red_value = LED_ON_VALUE # Start with red
grn_value = 0            # and all others
blu_value = 0            # are turned OFF

# Create the neopixel instantiation named np
np = NeoPixel(Pin(23), NUM_OF_LED)

while True:
    for npixel in range(NUM_OF_LED):
        np[npixel] = (red_value, grn_value, blu_value)
        np.write()
        sleep_ms(100)
        np[npixel] = (0, 0, 0)
        np.write()
        
        # If its the last LED, change color
        if npixel==NUM_OF_LED-1:
            # If its now red, make it green
            if red_value==LED_ON_VALUE:
                red_value = LED_OFF_VALUE
                grn_value = LED_ON_VALUE
            # If its green, make it blue
            elif grn_value==LED_ON_VALUE:
                grn_value = LED_OFF_VALUE
                blu_value = LED_ON_VALUE
            # If its blue, make it red
            elif blu_value==LED_ON_VALUE:
                blu_value = LED_OFF_VALUE
                red_value = LED_ON_VALUE 

```

## **References And Credits**

1. Purchase the Gorillacell ESP32 development kit at:
[gorillacell.kr](http://gorillacell.kr/)

