---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-17T14:04:00+08:00'
excerpt: In this article, we will learn how to use a DHT11 sensor with ESP32 using MicroPython programming language.
tags:
  - DHT11 temperature and humidity sensor
  - ESP32 DHT11
  - ESP8266
  - How to use DHT11 sensor in MicroPython
  - MicroPython DHT11
  - MicroPython DHT11 project
  - MicroPython DHT11 sensor
series:
  - MicroPython TechNotes
title: '028 - MicroPython TechNotes: DHT11 Temperature and Humidity Sensor'
url: /2021/04/17/028-micropython-technotes-dht11-temperature-and-humidity-sensor/
---

## **Introduction**

![](/images/028-DHT11-blog.png)

In this article, we will learn how to use a DHT11 sensor with ESP32 using MicroPython programming language.

## **Pinout**

1. **G** – for the ground pin.
2. **V** – for the supply voltage.
3. **S** – for the signal pin.

## **Bill Of Materials**

1. ESP32 development board to serve as the brain of the experiment.
2. GorillaCell ESP32 shield to extend ESP32 pins to pin headers for easy circuit connection.
3. 3-pin female-female dupont jumper wires to attach DHT11 sensor module to ESP32 shield.
4. DHT11 sensor module.

## **Hardware Instruction**

1. First, attach the ESP32 on top of the ESP32 shield and make sure that both USB ports are on the same side.
2. Next, attach the dupont wires to DHT11 sensor module by following the color coding which is black for the GND, red for the VCC, and yellow for the SIGNAL pin.
3. Next, attach the other side of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers which is black to black, red to red, and yellow to yellow pin headers. For this experiment, I choose GPIO 23 to serve as the signal pin from DHT11 sensor module.
4. Next, power the ESP32 shield with an external power supply with a type-C USB cable and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer with a micro-USB cable.

## **Software Instruction**

1. Copy and paste to Thonny the example source codes.
2. Play with it and adapt it according to your needs.
3. Enjoy learning.

## **Video Demonstration**

{{< youtube X8TWhs4e03g >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### **1. Example # 1, basics of using DHT11:**

```py { lineNos="true" wrap="true" }

# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from dht import DHT11
d = DHT11(Pin(23))

# # This line of code should be tested using the REPL
# d.measure()
# d.temperature()
# d.humidity()

```

### **2. Example # 2, display DHT11 sensor readings to 16×2 LCD:**

```py { lineNos="true" wrap="true" }

# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms
from dht import DHT11
from machine import SoftI2C
from i2c_lcd import I2cLcd

d = DHT11(Pin(23))

DEFAULT_I2C_ADDR = 0x20
i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000) 
lcd = I2cLcd(i2c, DEFAULT_I2C_ADDR, 2, 16)

lcd.clear()
lcd.move_to(0, 0)
lcd.putstr("Temp:    ^C.")
lcd.move_to(0, 1)
lcd.putstr("Humi:    %.")

while True:
    d.measure()
    lcd.move_to(6, 0)
    lcd.putstr(str(d.temperature()))
    lcd.move_to(6, 1)
    lcd.putstr(str(d.humidity()))
    sleep_ms(3000)

```

### **3. Example # 3, simple application of DHT11:**

```py { lineNos="true" wrap="true" }

# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms
from dht import DHT11
from machine import SoftI2C
from i2c_lcd import I2cLcd

d = DHT11(Pin(23))

DEFAULT_I2C_ADDR = 0x20
i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000) 
lcd = I2cLcd(i2c, DEFAULT_I2C_ADDR, 2, 16)

lcd.clear()
lcd.move_to(0, 0)
lcd.putstr("Temp:    ^C.")
lcd.move_to(0, 1)
lcd.putstr("Humi:    %.")

count = 0

while True:
    d.measure()
    t = d.temperature()
    h = d.humidity()
    lcd.move_to(6, 0)
    lcd.putstr(str(t))
    lcd.move_to(6, 1)
    lcd.putstr(str(h))
    if t >= 30:
        count += 1
        print("Alert! Count {}".format(count))
    else:
        count = 0
        
    sleep_ms(1000)

```

## **References And Credits**

1. Purchased your Gorillacell ESP32 development kit at:
 <https://gorillacell.kr>


