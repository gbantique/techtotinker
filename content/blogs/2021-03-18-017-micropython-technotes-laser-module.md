---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-03-18T13:11:00+08:00'
excerpt: In this article, we will learn on how to use a LASER module with ESP32 using MicroPython programming language.
tags:
  - ESP32 LASER
  - Laser display
  - Laser module
  - laser module micropython
series:
  - MicroPython TechNotes
title: '017 - MicroPython TechNotes: LASER Module'
url: /2021/03/18/017-micropython-technotes-laser-module/
---

## **Introduction**

![](/images/017-technotes-LASER.png)

In this article, we will learn on how to use a LASER module with ESP32 using MicroPython programming language.

## **Pinout**

1. **G** – for the ground pin.
2. **V** – for the supply voltage.
3. **S** – for the control signal pin.

## **Bill Of Materials**

1. ESP32 development board with MicroPython firmware that will serve as the main microcontroller.
2. ESP32 shield from Gorillacell ESP32 development kit to extend the pins of ESP32 and to provide easy circuit connection.
3. 3-pin female-female dupont jumper wires.
4. And of course the LASER module itself.

## **Hardware Instruction**

1. First, attach the ESP32 development board on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to the LASER module by following the color coding which black for the ground, red for the VCC, and yellow for the control signal pin.
3. Next, attach the other side of the dupont jumper wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers which is black to black, red to red, and yellow to yellow. For this experiment, I choose GPIO 25 because this ESP32 shield provides 5V on GPIO 25.
4. Next, power the ESP32 shield with an external power supply with type-C USB connector. Make sure that the power switch is set to ON state.
5. Next, connect the ESP32 to the computer through a micro-USB cable. The demo circuit should be ready.

## **Software Instruction**

For this experiment, I prepared 2 example source code. Just copy and paste it in Thonny. Enjoy.

## **Video Demonstration**

{{< youtube yq0LTKFgReo >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, basic and simple control of LASER module:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

laser = Pin(25, Pin.OUT)

# # The following source should be tested using the REPL:
# laser.on()  # Turns ON the laser.
# laser.off() # Turns OFF the laser.

```

#### How the code works:

`from machine import Pin`
Loads or imports the necessary library, in this case the Pin class from the machine module. This is in order to access the pins of ESP32.

`laser = Pin(25, Pin.OUT)`
This line of code creates the object named laser which is connected on GPIO 25 with a pin direction set as an output.

`laser.on()`
This will set the pin to logic HIGH which will turn ON the laser module.

`laser.off()`
This will clear the pin to logic LOW which will turn OFF the laser module.

### 2. Example # 2, SOS using the LASER module:

```py { lineNos="true" wrap="true" }

# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import ticks_ms

laser = Pin(25, Pin.OUT)
switch = Pin(0, Pin.IN, Pin.PULL_UP)

DOTS_INTERVAL = 250
DASH_INTERVAL = 750
LOWS_INTERVAL = 500
BETW_INTERVAL = 700

isSOS = False
startTime = ticks_ms()
steps = 0

while True:
    if isSOS:
        if steps == 1 or steps == 3 or steps == 5:
            laser.on()
            if ticks_ms() - startTime >= DOTS_INTERVAL :
                steps += 1
                startTime = ticks_ms()
        elif steps == 7 or steps == 9 or steps == 11:
            laser.on()
            if ticks_ms() - startTime >= DASH_INTERVAL:
                steps += 1
                startTime = ticks_ms()
        elif steps == 0 or steps == 6 or steps == 12:
            laser.off()
            if ticks_ms() - startTime >= BETW_INTERVAL:
                steps += 1
                startTime = ticks_ms()
        else:
            laser.off()
            if ticks_ms() - startTime >= LOWS_INTERVAL:
                steps += 1
                startTime = ticks_ms()
         
        if steps > 12:
             steps = 0
        
    if switch.value() == 0:
        laser.off()
        #print('press')
        isSOS = not isSOS
        steps = 0
        sleep_ms(300)
```

## **References And Credits**

1. Purchased your Gorillacell ESP32 development kit at:
[gorillacell.kr](http://gorillacell.kr/)

