---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-18T20:33:00+08:00'
excerpt: In this article, we will learn how to use an HC-SR04 Ultrasonic Sensor with ESP32 using MicroPython programming language.
tags:
  - esp32 hc-sr04
  - micropython hc-sr04
series:
  - MicroPython TechNotes
title: '029 - MicroPython TechNotes: HC-SR04 Ultrasonic Sensor'
url: /2021/04/18/029-micropython-technotes-hc-sr04-ultrasonic-sensor/
---

## **Introduction**

![](/images/029-HCSR04.png)

In this article, we will learn how to use an HC-SR04 Ultrasonic Sensor with ESP32 using MicroPython programming language.

## **Pinout**

1. GND – for the ground pin.
2. VCC – for the supply voltage.
3. TRIG – for the trigger signal pin.
4. ECHO – for the echo signal pin.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 4-pin female-female dupont jumper wires.
4. HC-SR04 ultrasonic sensor module.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to the ultrasonic sensor and follow the color coding which is black for the ground, red for the VCC, yellow for the TRIG pin, and white for the ECHO pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers that is black to black, red to red, yellow and the following colors to yellow pin headers. For this experiment, I choose GPIO 21 for the TRIG pin and GPIO 22 for the ECHO pin.
4. Next, power the ESP32 shield with an external power supply with a type-C USB cable and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through a micro-USB cable.

## **Software Instruction**

1. Copy the example source code to Thonny IDE.
2. Play with it and adapt according to your needs.
3. Enjoy and happy tinkering.

## **Video Demonstration**

{{< youtube I1HEU5F5QKU >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics of HC-SR04:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import Timer
from hcsr04 import HCSR04

ultrasonic = HCSR04(trigger_pin=21, echo_pin=22, echo_timeout_us=1000000)

def timer0_callback(timer):
    print('Distance: {}cm'.format(ultrasonic.distance_cm()))
    #print('Distance: {}mm'.format(ultrasonic.distance_mm()))
    #print('Distance: {}inch'.format(ultrasonic.distance_cm()/2.54))

timer0 = Timer(0)
timer0.init(period=500, mode=Timer.PERIODIC, callback=timer0_callback)

```

### 2. Example # 2, HC-SR04 intruder alarm application:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com   
 # George Bantique | tech.to.tinker@gmail.com  
 from machine import Pin  
 from hcsr04 import HCSR04  
 from time import sleep_ms  
 ultrasonic = HCSR04(trigger_pin=21, echo_pin=22, echo_timeout_us=1000000)  
 led = Pin(2, Pin.OUT)  
 while True:  
   distance = ultrasonic.distance_cm()  
   print('Distance:', distance, 'cm')  
   if distance <= 10:  
     print('ALERT! Intruder detected.')  
     led.value(not led.value())  
   else:  
     led.value(0)  
   sleep_ms(500)  

```

### 3. hcsr04.py driver library:

```py { lineNos="true" wrap="true" }
import machine, time
from machine import Pin

__version__ = '0.2.0'
__author__ = 'Roberto Sánchez'
__license__ = "Apache License 2.0. https://www.apache.org/licenses/LICENSE-2.0"

class HCSR04:
    """
    Driver to use the untrasonic sensor HC-SR04.
    The sensor range is between 2cm and 4m.
    The timeouts received listening to echo pin are converted to OSError('Out of range')
    """
    # echo_timeout_us is based in chip range limit (400cm)
    def __init__(self, trigger_pin, echo_pin, echo_timeout_us=500*2*30):
        """
        trigger_pin: Output pin to send pulses
        echo_pin: Readonly pin to measure the distance. The pin should be protected with 1k resistor
        echo_timeout_us: Timeout in microseconds to listen to echo pin. 
        By default is based in sensor limit range (4m)
        """
        self.echo_timeout_us = echo_timeout_us
        # Init trigger pin (out)
        self.trigger = Pin(trigger_pin, mode=Pin.OUT, pull=None)
        self.trigger.value(0)

        # Init echo pin (in)
        self.echo = Pin(echo_pin, mode=Pin.IN, pull=None)

    def _send_pulse_and_wait(self):
        """
        Send the pulse to trigger and listen on echo pin.
        We use the method `machine.time_pulse_us()` to get the microseconds until the echo is received.
        """
        self.trigger.value(0) # Stabilize the sensor
        time.sleep_us(5)
        self.trigger.value(1)
        # Send a 10us pulse.
        time.sleep_us(10)
        self.trigger.value(0)
        try:
            pulse_time = machine.time_pulse_us(self.echo, 1, self.echo_timeout_us)
            return pulse_time
        except OSError as ex:
            if ex.args[0] == 110: # 110 = ETIMEDOUT
                raise OSError('Out of range')
            raise ex

    def distance_mm(self):
        """
        Get the distance in milimeters without floating point operations.
        """
        pulse_time = self._send_pulse_and_wait()

        # To calculate the distance we get the pulse_time and divide it by 2 
        # (the pulse walk the distance twice) and by 29.1 becasue
        # the sound speed on air (343.2 m/s), that It's equivalent to
        # 0.34320 mm/us that is 1mm each 2.91us
        # pulse_time // 2 // 2.91 -> pulse_time // 5.82 -> pulse_time * 100 // 582 
        mm = pulse_time * 100 // 582
        return mm

    def distance_cm(self):
        """
        Get the distance in centimeters with floating point operations.
        It returns a float
        """
        pulse_time = self._send_pulse_and_wait()

        # To calculate the distance we get the pulse_time and divide it by 2 
        # (the pulse walk the distance twice) and by 29.1 becasue
        # the sound speed on air (343.2 m/s), that It's equivalent to
        # 0.034320 cm/us that is 1cm each 29.1us
        cms = (pulse_time / 2) / 29.1
        return cms

```

## **References And Credits**

1. Purchase Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. HC-SR04 driver library:
<https://github.com/rsc1975/micropython-hcsr04/blob/master/hcsr04.py>

