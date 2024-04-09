---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-10-03T20:20:00+08:00'
tags:
  - esp32 hc-sr04
  - esp32 micropython
  - esp32 ultrasonic sensor
  - hc-sr04 ultrasonic sensor micropython
  - Micropython esp32
  - micropython hc-sr04
  - MicroPython tutorials
series:
  - ESP32 MicroPython
title: '012 - ESP32 MicroPython: HC-SR04 Ultrasonic Sensor in MicroPython'
url: /2020/10/03/012-esp32-micropython-hc-sr04-ultrasonic-sensor-in-micropython/
---

## **Introduction**

In this video, we will learn how to use the HC-SR04 ultrasonic sensor in MicroPython. With ultrasonic sensor, it can be use for measuring distance or it can be use for sensing an object.

## **Circuit Diagram**

![](/images/hcsr04_mp.png)

## **Hardware Instruction**

1. Connect the HC-SR04 VCC pin to ESP32 VIN pin. The HC-SR04 needs 5V, trust me I already tried using the 3V3 pin, it doesn’t work.  
2. Connect the HC-SR04 Trigger pin to ESP32 GPIO D13.  
3. Connect the HC-SR04 Echo pin to ESP32 GPIO D12.  
4. Connect the HC-SR04 GND pin to ESP32 GND pin.  
5. Connect one of the buzzer pin to ESP32 GPIO D32.  
6. Connect the other pin of the buzzer to ESP32 GND pin.  
7. Download the hcsr04.py module from: [Download the hcsr04.py](https://github.com/rsc1975/micropython-hcsr04/blob/master/hcsr04.py)  
8. Copy and paste it to Thonny Python IDE.  
9. Make sure that the ESP32 is plugged into the computer, then click File menu then select Save as  
10. Save it as main.py

## **Video Demonstration**

{{< youtube AzGr7FtGUh0 >}}

## **Call To Action**

If you have any question regarding this tutorial, please do not hesitate to write your inquiry in the comment box provided.

If you enjoy this video, please consider supporting my journey by Subscribing to my Youtube channel. [Click this to Subscribe to TechToTinker Youtube channel.  ](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

## **Source Code**

**Download the hcsr04.py module from here or copy it below:**  
<https://github.com/rsc1975/micropython-hcsr04/blob/master/hcsr04.py>

## **Example 1, Intruder Alarm (sort of) using HC-SR04:**

```py { lineNos="true" wrap="true" }
import machine
import hcsr04
import time

ultrasonic = hcsr04.HCSR04(trigger_pin=13, echo_pin=12, echo_timeout_us=1000000)
led = machine.Pin(2, machine.Pin.OUT)
buzzer = machine.PWM(machine.Pin(32, machine.Pin.OUT))
buzzer.freq(4186)
buzzer.duty(0)

while True:
    distance = ultrasonic.distance_cm()
    print('Distance:', distance, 'cm', '|', distance/2.54, 'inch')
    if distance <= 10:
        buzzer.duty(512)
        led.on()
    else:
        buzzer.duty(0)
        led.off()
    time.sleep_ms(1000)

```

### **Copy of hcsr04.py**

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

