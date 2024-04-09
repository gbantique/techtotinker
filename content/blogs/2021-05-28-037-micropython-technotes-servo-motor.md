---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-05-28T19:54:00+08:00'
excerpt: In this article, I will talk about SERVO MOTOR with ESP32 using MicroPython.
tags:
  - esp32 micropython
  - esp32 servo motor micropython
  - ESP8266 MicroPython
  - MicroPython project
  - micropython tutorial
  - Raspberry Pi Pico MicroPython
series:
  - MicroPython TechNotes
title: '037 - MicroPython TechNotes: Servo Motor'
url: /2021/05/28/037-micropython-technotes-servo-motor/
---

## **Introduction**

![](/images/037-2BServo-2BMotor.png)

In this article, I will talk about SERVO MOTOR with ESP32 using MicroPython.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. Servo Motor

## **Pinout**

1. **brown wire** – for the ***ground*** pin.
2. **red wire** – for the servo motor ***supply voltage***.
3. **orange wire** – for the servo motor ***control signal***.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the GorillaCell ESP32 shield and make sure that both USB ports are on the same side.
2. Next, attach the servo motor wires to ESP32 shield by the following color coding:  
    * servo motor brown wire – shield black pin headers.  
    * servo motor red wire – shield red pin headers.  
    * servo motor orange wire – shield yellow pin headers.  
    For this lesson, I choose **GPIO 25** to serve as the control signal pin to the servo motor.
3. Next, power the GorillaCell ESP32 shield with an external 5V power supply with a type-USB connector.
4. Last, connect the ESP32 to the computer through a micro-USB cable.

## **Software Instruction**

For the software part, copy the sample program from the SOURCE CODE section.

You may modify and adapt it according to your needs, and most of all enjoy.

## **Video Demonstration**

{{< youtube l9ss-X5JEKY >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics of controlling a servo motor:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import PWM
from time import sleep_ms

def map(x, in_min, in_max, out_min, out_max):
    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)
    
class GORILLACELL_SERVO:
    def __init__(self, signal_pin):
        self.pwm = PWM(Pin(signal_pin), freq=50, duty=0)

    def rotate(self, angle):
        self.pwm.duty(map(angle, 0, 180, 23, 124))
        

servo = GORILLACELL_SERVO(signal_pin=25)

# The following lines of codes can be tested using the REPL:
# # To rotate the servo motor to 0 degrees
# servo.rotate(0)
# 
# # To rotate the servo motor to 90 degrees
# servo.rotate(90)
# 
# # To rotate the servo motor to 180 degrees
# servo.rotate(180)
# 
# # To rotate the servo from 0 to 180 degrees
# # by 10 degrees increment
# for angle in range(0, 181, 10):
#     servo.rotate(angle)
#     print(angle)
#     sleep_ms(500)
# # To rotate the servo from 180 to 0 degrees
# # by 10 degrees decrement
# for angle in range(180, -1, -10):
#     servo.rotate(angle)
#     print(angle)
#     sleep_ms(500)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. MG90S Timing diagram from:
<https://components101.com/motors/mg90s-metal-gear-servo-motor>

