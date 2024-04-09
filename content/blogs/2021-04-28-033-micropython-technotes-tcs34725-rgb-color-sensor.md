---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-28T17:35:00+08:00'
excerpt: In this article, we will learn how to use the TCS34725 RGB Color Sensor with ESP32 using MicroPython programming language.
tags:
  - ESP32 TCS34725
  - How to use TCS34725 in MicroPython
  - MicroPython Color Sensor
  - MicroPython RGB Color sensor
series:
  - MicroPython TechNotes
title: '033 - MicroPython TechNotes: TCS34725 RGB Color Sensor'
url: /2021/04/28/033-micropython-technotes-tcs34725-rgb-color-sensor/
---

## **Introduction**

![](/images/033-2BTCS34725-2Bblogs.png)

In this article, we will learn how to use the TCS34725 RGB Color Sensor with ESP32 using MicroPython programming language.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 4-pin female-female dupont wires.
4. TCS34725 RGB color sensor module.

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **SDA** – for the I2C serial data pin.
4. **SCL** – for the I2C serial clock pin.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the ESP32 shield and make sure that both USB ports are on the same side.
2. Next, attach the dupont wires to the RGB Color Sensor by following the color coding which is black for the ground, red for the VCC, yellow for the SDA pin, and white for the SCL pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers such as black to black, red to red, and yellow and the following colors to yellow pin headers. For this experiment, I choose GPIO 21 for the SDA pin and GPIO 22 for the SCL pin.
4. Next, power the ESP32 shield with an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer.

## **Software Instruction**

1. Copy the tcs34725.py below and paste it to Thonny IDE and save it to ESP32 MicroPython root directory by clicking the File menu and select Save As. Click the MicroPython Device and save it as tcs34725.py.
2. Copy the example source codes and play with it.

## **Video Demonstration**

{{< youtube VNSo75WlyCk >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### Example # 1, exploring the basics of TCS34725 RGB Color Sensor:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import I2C
from tcs34725 import TCS34725
from time import sleep_ms

i2c_bus = I2C(0, sda=Pin(21), scl=Pin(22))
tcs = TCS34725(i2c_bus)

# # The following lines of code should be tested in the REPL:
# #
# # 1. To print the raw data:
# print('raw: {}'.format(tcs.read('raw')))
# #
# # 2. To print the RGB data:
# print('rgb: {}'.format(tcs.read('rgb')))
# #
# # 3. To print the RGB data in decimal form:
# print('dec: {}'.format(tcs.read('dec')))
# #
# # 4. To print the RGB data in hex form:
# print('hex: {}'.format(tcs.read('hex')))
# #
# # 5. To print the color temperature in ^Kelvin and
# #    the luminosity in lux
# print('lux: {}'.format(tcs.read('lux')))

```

### Example # 2, simple application of TCS34725:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import I2C
from machine import PWM
from time import sleep_ms
from tcs34725 import TCS34725
from gorillacell_rgb import GORILLACELL_RGB

i2c_bus = I2C(0, sda=Pin(21), scl=Pin(22))
tcs = TCS34725(i2c_bus)
rgb = GORILLACELL_RGB(25, 26, 27)

while True:
    red, grn, blu = tcs.read('dec')
    rgb.set_rgb(red, grn, blu)

```

### 3. tcs34725.py modified driver library for TCS34725:

```py { lineNos="true" wrap="true" }
import time  
 import ustruct  
 #const = lambda x:x  
 _COMMAND_BIT = const(0x80)  
 _REGISTER_ENABLE = const(0x00)  
 _REGISTER_ATIME = const(0x01)  
 _REGISTER_AILT = const(0x04)  
 _REGISTER_AIHT = const(0x06)  
 _REGISTER_ID = const(0x12)  
 _REGISTER_APERS = const(0x0c)  
 _REGISTER_CONTROL = const(0x0f)  
 _REGISTER_SENSORID = const(0x12)  
 _REGISTER_STATUS = const(0x13)  
 _REGISTER_CDATA = const(0x14)  
 _REGISTER_RDATA = const(0x16)  
 _REGISTER_GDATA = const(0x18)  
 _REGISTER_BDATA = const(0x1a)  
 _ENABLE_AIEN = const(0x10)  
 _ENABLE_WEN = const(0x08)  
 _ENABLE_AEN = const(0x02)  
 _ENABLE_PON = const(0x01)  
 _GAINS = (1, 4, 16, 60)  
 _CYCLES = (0, 1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60)  
 class TCS34725:  
   def __init__(self, i2c, address=0x29):  
     self.i2c = i2c  
     self.address = address  
     self._active = False  
     self.integration_time(2.4)  
     sensor_id = self.sensor_id()  
     if sensor_id not in (0x44, 0x10):  
       raise RuntimeError("wrong sensor id 0x{:x}".format(sensor_id))  
   def _register8(self, register, value=None):  
     register |= _COMMAND_BIT  
     if value is None:  
       return self.i2c.readfrom_mem(self.address, register, 1)[0]  
     data = ustruct.pack('<B', value)  
     self.i2c.writeto_mem(self.address, register, data)  
   def _register16(self, register, value=None):  
     register |= _COMMAND_BIT  
     if value is None:  
       data = self.i2c.readfrom_mem(self.address, register, 2)  
       return ustruct.unpack('<H', data)[0]  
     data = ustruct.pack('<H', value)  
     self.i2c.writeto_mem(self.address, register, data)  
   def active(self, value=None):  
     if value is None:  
       return self._active  
     value = bool(value)  
     if self._active == value:  
       return  
     self._active = value  
     enable = self._register8(_REGISTER_ENABLE)  
     if value:  
       self._register8(_REGISTER_ENABLE, enable | _ENABLE_PON)  
       time.sleep_ms(3)  
       self._register8(_REGISTER_ENABLE,  
         enable | _ENABLE_PON | _ENABLE_AEN)  
     else:  
       self._register8(_REGISTER_ENABLE,  
         enable & ~(_ENABLE_PON | _ENABLE_AEN))  
   def sensor_id(self):  
     return self._register8(_REGISTER_SENSORID)  
   def integration_time(self, value=None):  
     if value is None:  
       return self._integration_time  
     value = min(614.4, max(2.4, value))  
     cycles = int(value / 2.4)  
     self._integration_time = cycles * 2.4  
     return self._register8(_REGISTER_ATIME, 256 - cycles)  
   def gain(self, value):  
     if value is None:  
       return _GAINS[self._register8(_REGISTER_CONTROL)]  
     if value not in _GAINS:  
       raise ValueError("gain must be 1, 4, 16 or 60")  
     return self._register8(_REGISTER_CONTROL, _GAINS.index(value))  
   def _valid(self):  
     return bool(self._register8(_REGISTER_STATUS) & 0x01)  
   def read(self, raw=False):  
     was_active = self.active()  
     self.active(True)  
     while not self._valid():  
       time.sleep_ms(int(self._integration_time + 0.9))  
     data = tuple(self._register16(register) for register in (  
       _REGISTER_RDATA,  
       _REGISTER_GDATA,  
       _REGISTER_BDATA,  
       _REGISTER_CDATA,  
     ))  
     self.active(was_active)  
     if raw:  
       return data  
     return self._temperature_and_lux(data)  
   def _temperature_and_lux(self, data):  
     r, g, b, c = data  
     x = -0.14282 * r + 1.54924 * g + -0.95641 * b  
     y = -0.32466 * r + 1.57837 * g + -0.73191 * b  
     z = -0.68202 * r + 0.77073 * g + 0.56332 * b  
     d = x + y + z  
     n = (x / d - 0.3320) / (0.1858 - y / d)  
     cct = 449.0 * n**3 + 3525.0 * n**2 + 6823.3 * n + 5520.33  
     return cct, y  
   def threshold(self, cycles=None, min_value=None, max_value=None):  
     if cycles is None and min_value is None and max_value is None:  
       min_value = self._register16(_REGISTER_AILT)  
       max_value = self._register16(_REGISTER_AILT)  
       if self._register8(_REGISTER_ENABLE) & _ENABLE_AIEN:  
         cycles = _CYCLES[self._register8(_REGISTER_APERS) & 0x0f]  
       else:  
         cycles = -1  
       return cycles, min_value, max_value  
     if min_value is not None:  
       self._register16(_REGISTER_AILT, min_value)  
     if max_value is not None:  
       self._register16(_REGISTER_AIHT, max_value)  
     if cycles is not None:  
       enable = self._register8(_REGISTER_ENABLE)  
       if cycles == -1:  
         self._register8(_REGISTER_ENABLE, enable & ~(_ENABLE_AIEN))  
       else:  
         self._register8(_REGISTER_ENABLE, enable | _ENABLE_AIEN)  
         if cycles not in _CYCLES:  
           raise ValueError("invalid persistence cycles")  
         self._register8(_REGISTER_APERS, _CYCLES.index(cycles))  
   def interrupt(self, value=None):  
     if value is None:  
       return bool(self._register8(_REGISTER_STATUS) & _ENABLE_AIEN)  
     if value:  
       raise ValueError("interrupt can only be cleared")  
     self.i2c.writeto(self.address, b'xe6')  
 def html_rgb(data):  
   r, g, b, c = data  
   red = pow((int((r/c) * 256) / 255), 2.5) * 255  
   green = pow((int((g/c) * 256) / 255), 2.5) * 255  
   blue = pow((int((b/c) * 256) / 255), 2.5) * 255  
   return red, green, blue  
 def html_hex(data):  
   r, g, b = html_rgb(data)  
   return "{0:02x}{1:02x}{2:02x}".format(int(r),  
                int(g),  
                int(b))  

```

### 4. gorillacell\_rgb driver library for the RGB LED:

```py { lineNos="true" wrap="true" }
# This is a class helper for the RGB module
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import PWM

class GORILLACELL_RGB:
    def __init__(self, r_pin, g_pin, b_pin):
        self.r = PWM(Pin(r_pin))
        self.g = PWM(Pin(g_pin))
        self.b = PWM(Pin(b_pin))
 
        # Initialize the PWM frequency to 60Hz 
        self.r.freq(60) 
        self.g.freq(60) 
        self.b.freq(60) 
        # and Initialize with pulse turned OFF 
        self.r.duty(0) 
        self.g.duty(0) 
        self.b.duty(0)
        
    def map(self, x, in_min, in_max, out_min, out_max): 
        # This will not handle x value greater than in_max or 
        #                      x value less than in_min 
        return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min) 
    def set_rgb(self, x, y, z): 
        # Maximum duty cycle is 1023 
        # RGB values is usually 0 to 255 
        # By using ratio and proportion 
        self.r.duty(self.map(x, 0, 255, 0, 1023)) 
        self.g.duty(self.map(y, 0, 255, 0, 1023)) 
        self.b.duty(self.map(z, 0, 255, 0, 1023)) 
             
    def rst_rgb(self): 
        # Turn off all pwm pulse 
        self.r.duty(0) 
        self.g.duty(0) 
        self.b.duty(0)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. TCS34725 Driver Library:
<https://github.com/adafruit/micropython-adafruit-tcs34725>

