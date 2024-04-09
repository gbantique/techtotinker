---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-09-15T15:16:00+08:00'
tags:
  - esp32 servo
  - micropython servo
series:
  - ESP32 MicroPython
title: '006 - ESP32 MicroPython: How to control servo motor with MicroPython'
url: /2020/09/15/006-esp32-micropython-how-to-control-servo-motor-with-micropython/
---

## **Circuit Diagram**

![](/images/pwm_servo.png)

 **Links to SG90 datasheet:**  
http://www.ee.ic.ac.uk/pcheung/teaching/DE1\_EE/stores/sg90\_datasheet.pdf

**Links to Arduino map() function:**  
https://www.arduino.cc/reference/en/language/functions/math/map/

**Some formulas use:**

freq = 1 / Period  
freq = 1 / 20ms  
freq = 50Hz

1ms / 20ms = 0.05 = 5% duty cycle  
2ms / 20ms = 0.10 = 10% duty cycle

To get the equivalent pwm duty values:  
0.05 \* 1024 = 51.2  
0.10 \* 1024 = 102.4  
these pwm duty values does not work for me, it gives very inaccurate result angle.

What works for me are a duty values of **<u>20 to 120</u>** or equivalent to **2% to 12% duty cycle.**

## **Video Demonstration**

{{< youtube wWnDKsClpwQ >}}

## **Call To Action**

If you found this tutorial as helpful, please consider supporting my Youtube channel by Suscribing to TechToTinker Youtube channel. [Click this to Subscribe.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

## **Source Code**

```py { lineNos="true" wrap="true" }
# Load the machine module for GPIO and PWM
# Control servo motor with MicroPython
# Author: George Bantique, TechToTinker
# Date: September 15, 2020

import machine
# Load the time module for the delays
import time

# Create a regular p23 GPIO object
p23 = machine.Pin(23, machine.Pin.OUT)

# Create another object named pwm by
# attaching the pwm driver to the pin
pwm = machine.PWM(p23)

# Set the pulse every 20ms
pwm.freq(50)

# Set initial duty to 0
# to turn off the pulse
pwm.duty(0)

# Creates a function for mapping the 0 to 180 degrees
# to 20 to 120 pwm duty values
def map(x, in_min, in_max, out_min, out_max):
    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

# Creates another function for turning 
# the servo according to input angle
def servo(pin, angle):
    pin.duty(map(angle, 0, 180, 20, 120))


# To rotate the servo motor to 0 degrees
servo(pwm, 0)

# To rotate the servo motor to 90 degrees
servo(pwm, 90)

# To rotate the servo motor to 180 degrees
servo(pwm, 180)

# To rotate the servo from 0 to 180 degrees
# by 10 degrees increment
for i in range(0, 181, 10):
    servo(pwm, i)
    time.sleep(0.5)
    
# To rotate the servo from 180 to 0 degrees
# by 10 degrees decrement
for i in range(180, -1, -10):
    servo(pwm, i)
    time.sleep(0.5)

```

