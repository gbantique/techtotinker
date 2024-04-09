---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-04T09:51:00+08:00'
excerpt: In this article, we will tackle how to use JOYSTICK with ESP32 using MicroPython programming language.
tags:
  - esp32 joystick
  - how to read analog input in MicroPython
series:
  - MicroPython TechNotes
title: '025 - MicroPython TechNotes: Joystick'
url: /2021/04/04/025-micropython-technotes-joystick/
---

## **Introduction**

![](/images/025-joystick-micropython.png)

In this article, we will tackle how to use JOYSTICK with ESP32 using MicroPython programming language.

## **Pinout**

1. **G** – for the ground pin.
2. **V** – for the supply voltage.
3. **x** – for the horizontal potentiometer pin.
4. **y** – for the vertical potentiometer pin.

## **Bill Of Materials**

1. **ESP32 development board** to serve as the brain for the experiment.
2. **ESP32 shield** from Gorillacell ESP32 development kit to extend the ESP32 pins to pin headers for easy circuit connection.
3. **4-pin female-female dupont jumper wires** to connect the joystick module to the ESP32 shield.
4. **Joystick module** itself.

## **Hardware Instruction**

1. First, attach the ESP32 development board on top of the ESP32 shield and make sure that both USB ports are on the same side.
2. Next, attach the dupont wires to the joystick module by following the color coding which is black for the ground, red for the VCC, yellow for the x pin, and white for the y pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers which is black to black, red to red, yellow and the following colors to the yellow pin headers.
4. Next, power the ESP32 shield with an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through a micro-USB cable. Our demo circuit should be now ready.

## **Software Instruction**

I prepared 3 example source code for this demo.

Copy and paste it to your Thonny IDE.

Play with it, modify and adapt according to your needs.

Enjoy and happy tinkering.

## **Video Demonstration**

{{< youtube Wr3ztVSeuts >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, basics of reading an analog input just like the joystick module:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from time import sleep_ms

x = ADC(Pin(32, Pin.IN))
y = ADC(Pin(33, Pin.IN))
x.atten(ADC.ATTN_11DB)
y.atten(ADC.ATTN_11DB)

while True:
    x_val = x.read()
    y_val = y.read()
    print('Current position:{},{}'.format(x_val,y_val))
    sleep_ms(300)

```

### 2. Example # 2, display joystick position using RGB matrix:

```py { lineNos="true" wrap="true" } 
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from neopixel import NeoPixel
from time import sleep_ms

class RGB_Matrix:
    
    def __init__(self, gpio, width, height):
        self.width = width
        self.height = height
        self.neopixel = NeoPixel(Pin(gpio), width*height)
        
    def pixel_set(self, row, col, r=0, g=0, b=0):
        self.neopixel[row + (col*self.width)] = (r, g, b)
        self.neopixel.write()
            
    def pixel_clr(self, row, col):
        self.neopixel[row + (col*self.width)] = (0, 0, 0)
        self.neopixel.write()
        
    def clear_all(self):
        self.neopixel.fill((0,0,0))
        self.neopixel.write()


np = RGB_Matrix(25, 8, 8)
x = ADC(Pin(32, Pin.IN))
y = ADC(Pin(33, Pin.IN))
x.atten(ADC.ATTN_11DB)
y.atten(ADC.ATTN_11DB)

def map(x, in_min, in_max, out_min, out_max): 
    # This will not handle x value greater than in_max or 
    #                      x value less than in_min 
    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

while True:
    x_pos = map(x.read(), 0, 4095, 0, 7)
    y_pos = map(y.read(), 0, 4095, 7, 0)
    np.clear_all()
    np.pixel_set(x_pos, y_pos, 10,0,0)
    sleep_ms(300)

```

### 3. Example # 3, control a pixel in RGB matrix using the joystick module:

```py { lineNos="true" wrap="true" } 
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin, ADC
from neopixel import NeoPixel
from time import sleep_ms

class RGB_Matrix:
    
    def __init__(self, gpio, width, height):
        self.width = width
        self.height = height
        self.neopixel = NeoPixel(Pin(gpio), width*height)
        
    def pixel_set(self, row, col, r=0, g=0, b=0):
        self.neopixel[row + (col*self.width)] = (r, g, b)
        self.neopixel.write()
            
    def pixel_clr(self, row, col):
        self.neopixel[row + (col*self.width)] = (0, 0, 0)
        self.neopixel.write()
        
    def clear_all(self):
        self.neopixel.fill((0,0,0))
        self.neopixel.write()


np = RGB_Matrix(25, 8, 8)
x = ADC(Pin(32, Pin.IN))
y = ADC(Pin(33, Pin.IN))
x.atten(ADC.ATTN_11DB)
y.atten(ADC.ATTN_11DB)

curr_x = 3
curr_y = 3

while True:
    x_val = x.read()
    y_val = y.read()
    
    if x_val < 1850:  
      if curr_x > 0:  
        curr_x = curr_x - 1  
    elif x_val > 1930:  
      if curr_x < 7:  
        curr_x = curr_x + 1  
    if y_val < 1890:  
      if curr_y < 7:  
        curr_y = curr_y + 1  
    elif y_val > 1970:  
      if curr_y > 0:  
        curr_y = curr_y - 1  
    print(curr_x, curr_y)  
    
    np.clear_all()
    np.pixel_set(curr_x, curr_y, 10, 0, 0)
    sleep_ms(100)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[gorillacell.kr](http://gorillacell.kr/)

