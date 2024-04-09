---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-03-20T21:06:00+08:00'
excerpt: In this article, we will learn on how to read an input device with ESP32 using MicroPython programming language. GorillaCell ESP32 development kit comes with 4 pieces of Button modules with different colors of button caps.
tags:
  - ESP32 button
  - micropython button
series:
  - MicroPython TechNotes
title: '018 - MicroPython TechNotes: Button | Reading an Input'
url: /2021/03/20/018-micropython-technotes-button-reading-an-input/
---

## **Introduction**

![](/images/018-technotes-buttons.png)

In this article, we will learn on how to read an input device with ESP32 using MicroPython programming language. GorillaCell ESP32 development kit comes with 4 pieces of Button modules with different colors of button caps.

## **Pinout**

1. **G** – for the ground pin.
2. **V** – for the VCC or supply voltage.
3. **S** – for the signal pin.

## **Bill Of Materials**

1. **ESP32 development board** flashed with MicroPython firmware. If your ESP32 has no MicroPython firmware, be sure to learn it from: https://techtotinker.blogspot.com/2021/01/001-micropython-technotes-get-started.html . The ESP32 will serve as the brain for this experiment.
2. **ESP32 shield** from GorillaCell ESP32 development kit which will extend the ESP32 pins to the pin headers for easy access and easy connection without confusion.
3. **3-pin female-female dupont wires** which will connects the button modules to the ESP32 shield pin headers.
4. **Button modules** which will serve as an input device.

## **Hardware Instruction**

1. First, attach the ESP32 on top of the ESP32 shield and make sure that both USB ports are on the same side.
2. Next, attach the dupont wires to the button module by following the color coding which is black wires for the ground, red wires for the VCC, and yellow wires for the signal pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the dupont wires to the colors of the pin headers which black to black, red to red, and yellow to yellow. For this experiment I choose GPIO 32 as the input signal pin for the Red button, GPIO 33 for the Green button, and GPIO 34 for the Blue button.
4. Next, power the ESP32 shield with an external power supply with type-C USB cable and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through the micro-USB cable. Our demo circuit should now be ready. Yehey!

## **Software Instruction**

For the button module, I prepared 3 examples you can copy to Thonny for you to try.

Play with it, modify it according to your needs.

Enjoy learning and happy tinkering.

## **Video Demonstration**

{{< youtube WbGduiwDAGc >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, reading an input device:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

button = Pin(32, Pin.IN)
led = Pin(2, Pin.OUT)

# # The following lines of code can be tested in the REPL:
# button.value() # Reads the current value of the button.
# # Return value is 1 when button is press else,
# # the value is 0 when button is release or not press.

```

### 2. Example # 2, multiple input device:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

red_button = Pin(32, Pin.IN)
grn_button = Pin(33, Pin.IN)
blu_button = Pin(34, Pin.IN)
led = Pin(2, Pin.OUT)

while True:
    led.value(not led.value())
    
    if red_button.value()==1:
        print('Red button is press')
    if grn_button.value()==1:
        print('Green button is press')
    if blu_button.value()==1:
        print('Blue button is press')
        
    sleep_ms(200)

```

### 3. Example # 3, simple application of button modules:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

red_button = Pin(32, Pin.IN)
grn_button = Pin(33, Pin.IN)
blu_button = Pin(34, Pin.IN)
led = Pin(2, Pin.OUT)

DEFAULT_COUNTER_VALUE = 0
COUNTER_CHANGE = 1
counter_value = DEFAULT_COUNTER_VALUE
print('counter_value is currently {}.'.format(counter_value)) 

while True:
    led.value(not led.value())
    
    if red_button.value()==1:
        print('Red button is press:')
        counter_value = counter_value + COUNTER_CHANGE
        print('> counter_value incremented to {}.'.format(counter_value))
    if grn_button.value()==1:
        print('Green button is press:')
        counter_value = DEFAULT_COUNTER_VALUE
        print('> counter_value resetted to {}.'.format(counter_value))
    if blu_button.value()==1:
        print('Blue button is press:')
        counter_value = counter_value - COUNTER_CHANGE
        print('> counter_value decremented to {}.'.format(counter_value))
        
    sleep_ms(200)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[gorillacell.kr](http://gorillacell.kr/)

