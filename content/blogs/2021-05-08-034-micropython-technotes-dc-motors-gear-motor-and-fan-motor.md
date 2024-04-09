---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-05-08T08:21:00+08:00'
excerpt: In this article, we will talk about the DC motors with ESP32 using MicroPython.
tags:
  - how to use dc motor in micropython
  - Micropython dc motor
  - Micropython esp32
  - micropython fan motor
series:
  - MicroPython TechNotes
title: '034 - MicroPython TechNotes: DC Motors | Gear Motor and Fan Motor'
url: /2021/05/08/034-micropython-technotes-dc-motors-gear-motor-and-fan-motor/
---

## **Introduction**

![](/images/034-2BMicroPython-2BTechNotes-2BDC-2BMotors.png)

In this article, we will talk about the DC motors with ESP32 using MicroPython.

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **INA** – for the motor terminal pin A.
4. **INB** – for the motor terminal pin B.

## **Bill Of Materials**

1. ESP32 development board.
2. ESP32 shield.
3. 3-pin female-female dupont wires.
4. DC Motors: Gear Motor and Fan Motor modules.

## **Hardware Instruction**

1. Attach the ESP32 board on top of the ESP32 shield and make sure that the USB port are on the same side.
2. Attach the dupont wires to the modules by following the color coding which is black for the ground, red for the VCC, and yellow and the following colors for the signal pins.
3. Attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers that is black to black, red to red, yellow and the following colors to the yellow pin headers.
4. Power the ESP32 shield with an external power supply through a type-C USB cable and make sure that the slide switch is set to ON state.
5. Connect the ESP32 to the computer by attaching a micro-USB cable.

## **Software Instruction**

1. Copy the sample source code below and paste it to your Thonny IDE.
2. Run it then modify according to your needs.
3. Enjoy and happy learning.

## **Video Demonstration**

{{< youtube a84WPeX88OY >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics of controlling a DC motor:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

class GORILLACELL_DCMOTORS:
    def __init__(self, pinA, pinB):
        self.pinA = Pin(pinA, Pin.OUT)
        self.pinB = Pin(pinB, Pin.OUT)

    def rotate(self, direction='cw'):
        if direction=='cw':
            self.pinA.value(1)
            self.pinB.value(0)
        else: # ccw
            self.pinA.value(0)
            self.pinB.value(1)
            
    def stop(self):
        self.pinA.value(0)
        self.pinB.value(0)

fan = GORILLACELL_DCMOTORS(25, 26)
gear = GORILLACELL_DCMOTORS(16, 17)

```

### 2. Example # 2, PWM control of DC motor:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import PWM

def map(x, in_min, in_max, out_min, out_max): 
    return int((x - in_min) * (out_max - out_min) /
               (in_max - in_min) + out_min)

class GORILLACELL_DCMOTORS:
    def __init__(self, pinA, pinB):
        self.pinA = PWM(Pin(pinA, Pin.OUT))
        self.pinB = PWM(Pin(pinB, Pin.OUT))
        self.pinA.freq(500)
        self.pinB.freq(500)
        self.pinA.duty(0)
        self.pinB.duty(0)

    def rotate(self, direction='cw', speed=40):
        if direction=='cw':
            self.pinA.duty(map(speed,0,99,0,1023))
            self.pinB.duty(0)
        else: # ccw
            self.pinA.duty(0)
            self.pinB.duty(map(speed,0,99,0,1023))
            
    def stop(self):
        self.pinA.duty(0)
        self.pinB.duty(0)

fan = GORILLACELL_DCMOTORS(25, 26)
gear = GORILLACELL_DCMOTORS(16, 17)

```

### 3. Example # 3, simple application controlling a DC motor using a potentiometer:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import PWM
from machine import ADC
from time import ticks_ms

def map(x, in_min, in_max, out_min, out_max): 
    return int((x - in_min) * (out_max - out_min) /
               (in_max - in_min) + out_min)

class GORILLACELL_DCMOTORS:
    def __init__(self, pinA, pinB):
        self.pinA = PWM(Pin(pinA, Pin.OUT))
        self.pinB = PWM(Pin(pinB, Pin.OUT))
        self.pinA.freq(500)
        self.pinB.freq(500)
        self.pinA.duty(0)
        self.pinB.duty(0)

    def rotate(self, direction='cw', speed=40):
        if direction=='cw':
            self.pinA.duty(map(speed,0,99,0,1023))
            self.pinB.duty(0)
        else: # ccw
            self.pinA.duty(0)
            self.pinB.duty(map(speed,0,99,0,1023))
            
    def stop(self):
        self.pinA.duty(0)
        self.pinB.duty(0)

fan = GORILLACELL_DCMOTORS(25, 26)
pot = ADC(Pin(32, Pin.IN))
pot.atten(ADC.ATTN_11DB)

t_start = ticks_ms()
pot_new = 0
pot_old = 0

while True:
    # check if 500ms has elapsed
    if ticks_ms() - t_start > 499:
        # Read the potentiometer value
        pot_new = pot.read()
        # Make sure that the value has change
        if pot_new != pot_old:
            fan.rotate('ccw', speed=map(pot_new,0,4095,0,99))
            pot_old = pot_new
            print('ADC Value: ', pot_new)
        t_start = ticks_ms()

```

## **References And Credits**

1. Purchase your copy of Gorillacell ESP32 Development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. Pulse Width Modulation (PWM) reference:
<https://docs.micropython.org/en/latest/esp32/quickref.html>
<https://docs.micropython.org/en/latest/esp8266/tutorial/pwm.html>

3. Analog to Digital Converter (ADC) reference:
<https://docs.micropython.org/en/latest/esp32/quickref.html>
<https://docs.micropython.org/en/latest/esp8266/quickref.html#adc-analog-to-digital-conversion>

