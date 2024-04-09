---
author: George Bantique
categories:
  - ESP32
  - GorillaCell
  - MicroPython
date: '2021-01-26T17:50:00+08:00'
excerpt: In this article, we will look at RGB LED module. We will learn on how to use it to create cool and amazing projects.
tags:
  - esp32 micropython
  - ESP32 RGB
  - How to use RGB in MicroPython
  - MicroPython RGB
  - micropython tutorial
  - RGB LED
  - RGB MicroPython
series:
  - MicroPython TechNotes
title: '007 - MicroPython TechNotes: RGB LED'
url: /2021/01/26/007-micropython-technotes-rgb-led/
---

## **Introduction**

![](/images/007-technotes-rgb-led-micropython.png)

In this article, we will look at RGB LED module. We will learn on how to use it to create cool and amazing projects.

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage pin.
3. **Red** – for the control signal of the red LED.
4. **Green** – for the control signal of the green LED.
5. **Blue** – for the control signal of the blue LED.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorilla Cell ESP32 shield (optional).
3. 5-pin dupont jumper wires.
4. RGB LED module.

## **Hardware Instruction**

1. Attach the ESP32 development board on top of the Gorilla Cell ESP32 shield making sure that the pins are aligned and the both the USB port are on the same side, in my case it is in the left-hand side.
2. Attach the dupont jumper wires to RGB LED module according to the following color coding: 
    - black for the Ground.
    - red for the VCC.
    - yellow for the Red pin.
    - white for the Green pin.
    - blue for the Blue pin.
3. Attach the other side of the dupont jumper wires to the ESP32 by matching the colors of the dupont wires and the colors of the pin headers.
4. Attach a type-C USB cable to the ESP32 shield for external power supply.
5. Connect the ESP32 to computer by attaching a micro USB cable.

## **Software Instruction**

1. Open the Thonny Python IDE. If you don’t have this installed, be sure to watch the article tutorial number 1.
2. Press the “Stop” button to let the Thonny Python IDE to connect to ESP32.
3. Create a new Python file by clicking the “New” button.
4. Copy and paste the provided source code below to your Thonny.
5. Press “Run the current script” to execute the code.
6. Enjoy and feel free to modify it according to your liking.

## **Video Demonstration**

{{< youtube TIJ_BKAwdOw >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, RGB basic ON or OFF:

```py { lineNos="true" wrap="true" }
from machine import Pin 

r = Pin(23, Pin.OUT) 
g = Pin(25, Pin.OUT) 
b = Pin(26, Pin.OUT) 

# The following code should be tested using the REPL 

# r.on()  # Turn ON red LED. 
# r.off() # Turn OFF red LED. 
# g.value(1) # Turn ON green LED. 
# g.value(0) # Turn OFF green LED. 
# b.value(True)  # Turn ON blue LED. 
# b.value(False) # Turn OFF blue LED.

```

### 2. Example # 2, basic RGB color combination:

```py { lineNos="true" wrap="true" }
from machine import Pin, PWM 

r = Pin(23, Pin.OUT) 
g = Pin(25, Pin.OUT) 
b = Pin(26, Pin.OUT) 

def set_rgb(x, y, z): 
    r.value(x) 
    g.value(y) 
    b.value(z) 
         
def rst_rgb(): 
    r.off() 
    g.off() 
    b.off() 

# The following code should be tested using the REPL.
     
# This is to demonstrate for creating colors: 
# set_rgb(1,0,0) # red 
# set_rgb(0,1,0) # green 
# set_rgb(0,0,1) # blue 
# Or a combination of primary colors: 
# set_rgb(1,1,0) # r + g = yellow 
# set_rgb(0,1,1) # g + b = cyan 
# set_rgb(1,0,1) # r + b = magenta 
# set_rgb(1,1,1) # r+g+b = white

```

### 3. Example # 3, advance RGB color combination:

```py { lineNos="true" wrap="true" }
from machine import Pin, PWM  

r = PWM(Pin(23)) 
g = PWM(Pin(25)) 
b = PWM(Pin(26)) 

# Initialize the PWM frequency to 60Hz 
r.freq(60) 
g.freq(60) 
b.freq(60) 

# and Initialize with pulse turned OFF 
r.duty(0) 
g.duty(0) 
b.duty(0) 

def map(x, in_min, in_max, out_min, out_max): 
    # This will not handle x value greater than in_max or 
    #                      x value less than in_min 
    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min) 
def set_rgb(x, y, z): 
    # Maximum duty cycle is 1023 
    # RGB values is usually 0 to 255 
    # By using ratio and proportion 
    r.duty(map(x, 0, 255, 0, 1023)) 
    g.duty(map(y, 0, 255, 0, 1023)) 
    b.duty(map(z, 0, 255, 0, 1023)) 
         
def rst_rgb(): 
    # Turn off all pwm pulse 
    r.duty(0) 
    g.duty(0) 
    b.duty(0)

# The following code should be tested using the REPL.

# This is to demonstrate for creating colors:  
# set_rgb(255,0,0) # red  
# set_rgb(0,255,0) # green  
# set_rgb(0,0,255) # blue  
# Or a combination of primary colors:  
# set_rgb(255,255,0) # r + g = yellow  
# set_rgb(0,255,255) # g + b = cyan  
# set_rgb(255,0,255) # r + b = magenta  
# set_rgb(255,255,255) # r+g+b = white

```

### 4. Example # 4, breathing RGB color:

```py { lineNos="true" wrap="true" }
from machine import Pin, PWM 
from time import sleep 

r = PWM(Pin(23)) 
g = PWM(Pin(25)) 
b = PWM(Pin(26))

# Initialize the PWM frequency to 60Hz 
r.freq(60) 
g.freq(60) 
b.freq(60) 
# and Initialize with pulse turned OFF 
r.duty(0) 
g.duty(0) 
b.duty(0) 

while True: 
    for i in range(1024): 
        r.duty(i) 
        #g.duty(i) 
        #b.duty(i) 
        sleep(0.001) 
        
    for i in range(1023, -1, -1): 
        r.duty(i) 
        #g.duty(i) 
        #b.duty(i) 
        sleep(0.001)

```

## **References And Credits**

1. Purchased your kit at:
[gorillacell.kr](http://gorillacell.kr/)

