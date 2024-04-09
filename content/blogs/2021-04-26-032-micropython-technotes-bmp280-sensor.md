---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-26T06:10:00+08:00'
excerpt: In this article, we will learn to use the BMP280 sensor with ESP32 using MicroPython.
tags:
  - ESP32 BMP280
  - How to use BMP280 in MicroPython
  - MicroPython BMP280
  - MicroPython project
series:
  - MicroPython TechNotes
title: '032 - MicroPython TechNotes: BMP280 Sensor'
url: /2021/04/26/032-micropython-technotes-bmp280-sensor/
---

## **Introduction**

![](/images/032-2Bbmp280-2Bblogs.png)

In this article, we will learn to use the BMP280 sensor with ESP32 using MicroPython.

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **SDA** – for the i2c serial data pin.
4. **SCL** – for the i2c serial clock pin.

## **Bill Of Materials**

1. ESP32 development board.
2. ESP32 shield from Gorillacell ESP32 development kit.
3. 4-pin female-female dupont wires.
4. BMP280 temperature, pressure, and altitude sensor module.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the ESP32 shield making sure that both USB port are on the same side.
2. Next, attach the dupont wires to the BMP280 sensor by following a color coding which is black for the ground, red for the VCC, yellow for the SDA pin, and white for the SCL pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers which is black to black, red to red, yellow and the following colors to the yellow pin headers. For this, I choose GPIO 21 for the SDA pin and GPIO 22 for the SCL pin.
4. Next, power the ESP32 shield with an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through the micro USB cable.

## **Software Instruction**

1. Copy and paste the bmp280.py to Thonny IDE and save it to ESP32 MicroPython device root directory by clicking the File menu and select Save As. Click MicroPython Device and save it as bmp280.py.
2. Copy and paste the examples to Thonny IDE. You may modify it according to your needs.
3. Happy tinkering.

## **Video Demonstration**

{{< youtube 882phAhJVdA >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics of BMP280 sensor:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import I2C
from bmp280 import BMP280

i2c_bus = I2C(0, sda=Pin(21), scl=Pin(22))
bmp = BMP280(i2c_bus)

# The following lines of code should be tested in the REPL:
# 1. To get envirment temperature (^C):
# bmp.getTemp()
#
# 2. To get Pressure (hPa):
# bmp.getPress()
#
# 3. To calculate absolute altitude (m):
# bmp.getAlti()

```

### 2. Example # 2, displaying the BMP280 sensor readings in the OLED display:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import I2C
from bmp280 import BMP280
from ssd1306 import SSD1306_I2C
import freesans20
from writer_minimal import Writer
from time import sleep_ms

oled_i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000) 
oled = SSD1306_I2C(128, 64, oled_i2c, addr=0x3C)
font_writer = Writer(oled, freesans20)

bmp_bus = I2C(0, sda=Pin(21), scl=Pin(22))
bmp = BMP280(bmp_bus)

while True:
    # Get the current readings
    temp = bmp.getTemp()
    press = bmp.getPress()
    alti = bmp.getAlti()

    # Update the OLED with current readings
    oled.fill(0)
    font_writer.set_textpos(0, 0)
    font_writer.printstring('T:{:.2f}^C'.format(temp))
    font_writer.set_textpos(20, 0)
    font_writer.printstring('P:{:.0f}hPa'.format(press))
    font_writer.set_textpos(40, 0)
    font_writer.printstring('A:{:.2f}m'.format(alti))
    oled.show()
    
    # Also send to the REPL the current readings
    print('T:{:.2f}^C'.format(temp),
          'P:{:.0f}hPa'.format(press),
          'A:{:.2f}m'.format(alti))
    
    # Read and update only every 1000 ms
    sleep_ms(1000)

```

### 3. bmp280.py driver library for BMP280:

```py { lineNos="true" wrap="true" }
 '''  
   mpy drive for BMP280 Digital Pressure Sensor  
   Author: shaoziyang  
   Date:  2018.2  
   http://www.micropython.org.cn  
 '''  
 from micropython import const  
 from machine import I2C  
 BMP280_I2C_ADDR = const(0x76)  
 class BMP280():  
   def __init__(self, i2c):  
     self.i2c = i2c  
     self.tb = bytearray(1)  
     self.rb = bytearray(1)  
     self.dig_T1 = self.get2Reg(0x88)  
     self.dig_T2 = self.short(self.get2Reg(0x8A))  
     self.dig_T3 = self.short(self.get2Reg(0x8C))  
     self.dig_P1 = self.get2Reg(0x8E)  
     self.dig_P2 = self.short(self.get2Reg(0x90))  
     self.dig_P3 = self.short(self.get2Reg(0x92))  
     self.dig_P4 = self.short(self.get2Reg(0x94))  
     self.dig_P5 = self.short(self.get2Reg(0x96))  
     self.dig_P6 = self.short(self.get2Reg(0x98))  
     self.dig_P7 = self.short(self.get2Reg(0x9A))  
     self.dig_P8 = self.short(self.get2Reg(0x9C))  
     self.dig_P9 = self.short(self.get2Reg(0x9E))  
     self.mode = 3  
     self.osrs_p = 3  
     self.osrs_t = 1  
     self.setReg(0xF4, 0x2F)  
     self.setReg(0xF5, 0x0C)  
     self.filter = 3  
     self.T = 0  
     self.P = 0  
     self.version = '1.0'  
   def     short(self,     dat):  
     if dat > 32767:  
       return dat - 65536  
     else:  
       return dat  
   # set reg  
   def     setReg(self, reg, dat):  
     self.tb[0] = dat  
     self.i2c.writeto_mem(BMP280_I2C_ADDR, reg, self.tb)  
   # get reg  
   def     getReg(self, reg):  
     self.i2c.readfrom_mem_into(BMP280_I2C_ADDR, reg, self.rb)  
     return self.rb[0]  
   # get two reg  
   def     get2Reg(self, reg):  
     return self.getReg(reg) + self.getReg(reg+1) * 256  
   def get(self):  
     adc_T = (self.getReg(0xFA)<<12) + (self.getReg(0xFB)<<4) + (self.getReg(0xFC)>>4)  
     var1 = (((adc_T>>3)-(self.dig_T1<<1))*self.dig_T2)>>11  
     var2 = (((((adc_T>>4)-self.dig_T1)*((adc_T>>4) - self.dig_T1))>>12)*self.dig_T3)>>14  
     t = var1+var2  
     self.T = ((t * 5 + 128) >> 8)/100  
     var1 = (t>>1) - 64000  
     var2 = (((var1>>2) * (var1>>2)) >> 11 ) * self.dig_P6  
     var2 = var2 + ((var1*self.dig_P5)<<1)  
     var2 = (var2>>2)+(self.dig_P4<<16)  
     var1 = (((self.dig_P3*((var1>>2)*(var1>>2))>>13)>>3) + (((self.dig_P2) * var1)>>1))>>18  
     var1 = ((32768+var1)*self.dig_P1)>>15  
     if var1 == 0:  
       return # avoid exception caused by division by zero  
     adc_P = (self.getReg(0xF7)<<12) + (self.getReg(0xF8)<<4) + (self.getReg(0xF9)>>4)  
     p=((1048576-adc_P)-(var2>>12))*3125  
     if p < 0x80000000:  
       p = (p << 1) // var1  
     else:  
       p = (p // var1) * 2  
     var1 = (self.dig_P9 * (((p>>3)*(p>>3))>>13))>>12  
     var2 = (((p>>2)) * self.dig_P8)>>13  
     self.P = p + ((var1 + var2 + self.dig_P7) >> 4)  
     return [self.T, self.P]  
   # get Temperature in Celsius  
   def getTemp(self):  
     self.get()  
     return self.T  
   # get Pressure in Pa  
   def getPress(self):  
     self.get()  
     return self.P  
   # Calculating absolute altitude  
   def     getAlti(self):  
     return 44330*(1-(self.getPress()/101325)**(1/5.255))  
   # sleep mode  
   def poweroff(self):  
     self.setReg(0xF4, 0)  
   # normal mode  
   def poweron(self):  
     self.setReg(0xF4, 0x2F)  

```

### 4. Copy ssd1306.py from:

<https://techtotinker.com/010-micropython-technotes-0-96-oled-display/>

### 5. Copy the custom fonts, writer\_minimal.py, and freesans20.py from:

<https://techtotinker.com/011-micropython-technotes-1-3-oled-display/>

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. Zhaoziyang BMP280 driver library:
<https://github.com/micropython-Chinese-Community/mpy-lib/tree/master/sensor/bmp280>

