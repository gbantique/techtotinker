---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-03-25T16:36:00+08:00'
excerpt: In this article, we will learn how to use a color touch sensor module with ESP32 using MicroPython programming language.
tags:
  - esp32 color touch sensor
  - how to read input in micropython
series:
  - MicroPython TechNotes
title: '021 - MicroPython TechNotes: Color Touch Sensor'
url: /2021/03/25/021-micropython-technotes-color-touch-sensor/
---

## **Introduction**

![](/images/021-technotes-color-touch-sensor.png)

In this article, we will learn how to use a color touch sensor module with ESP32 using MicroPython programming language.

## **Pinout**

1. **G** – for the ground.
2. **V** – for the supply voltage.
3. **S** – for the signal pin.

## **Bill Of Materials**

1. An **ESP32 development board** that will serve as the brain for this experiment.
2. An **ESP32 shield from Gorillacell ESP32 development kit** to extend the pins to pin headers for easy circuit connection.
3. A **3-pin female-female dupont jumper wires** to attach the color touch sensor module to the ESP32 shield pin headers.
4. And of course the **color touch sensor modules** itself.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to the color touch sensor by following the color coding which is black for the ground, red for the VCC, and yellow for the signal pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers which is black to black, red to red, and yellow to yellow. For this experiment I choose GPIO 32, GPIO 33, GPIO 34, and GPIO 35 for the red, green, blue, and rainbow color touch sensor respectively.
4. Next, power the ESP32 shield with an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through the micro USB cable. Our demo circuit should now be ready.

## **Software Instruction**

I prepared 5 examples below which you can copy and paste to your Thonny IDE.

Play with it and modify it to adapt according to your needs.

Hope you enjoy it by learning. Happy tinkering!

## **Video Demonstration**
{{< youtube zzdSyYwfuP4 >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

cts = Pin(32, Pin.IN)

# # The following lines of code can be tested in the REPL:
# cts.value() # Reads the current value of the color touch sensor.
# # Return value is 1 when color touch sensor is touch,
# # the value is 0 when color touch sensor is not being touch.

```

### 2. Example # 2, multiple color touch sensor:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

red_cts = Pin(32, Pin.IN)
grn_cts = Pin(33, Pin.IN)
blu_cts = Pin(34, Pin.IN)
rbw_cts = Pin(35, Pin.IN)
isRed = red_cts.value()
isGrn = grn_cts.value()
isBlu = blu_cts.value()
isRbw = rbw_cts.value()

while True:
    if red_cts.value()==1:
        if isRed==False:
            isRed = True
            print('Red color touch sensor is activated.')
    else:
        isRed = False
    
    if grn_cts.value()==1:
        if isGrn==False:
            isGrn = True
            print('Green color touch sensor is activated.')
    else:
        isGrn = False
        
    if blu_cts.value()==1:
        if isBlu==False:
            isBlu = True
            print('Blue color touch sensor is activated.')
    else:
        isBlu = False
        
    if rbw_cts.value()==1:
        if isRbw==False:
            isRbw = True
            print('Rainbow color touch sensor is activated.')
    else:
        isRbw = False
        
    sleep_ms(300)

```

### 3. Example # 3, introducing pin interrupt:

```py { lineNos="true" wrap="true" }

# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

red_cts = Pin(32, Pin.IN)
led = Pin(2, Pin.OUT)

def handle_interrupt(pin):
    led.value(not led.value())
    print('LED is toggled.')

# Use Pin.IRQ_RISING to set interrupt trigger to rising edge.
# Use Pin.IRQ_FALLING to set interrupt trigger to falling edge.
# Use Pin.IRQ_RISING | Pin.IRQ_FALLING to set interrupt trigger to both edge.
# Interrupt with rising edge detects signal change from logic LOW to logic HIGH.
# Interrupt with falling edge detects signal change from logic HIGH to logic LOW.
red_cts.irq(trigger=Pin.IRQ_RISING, handler=handle_interrupt)

```

### 4. Example # 4, multiple pin interrupt:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin

red_cts = Pin(32, Pin.IN)
grn_cts = Pin(33, Pin.IN)
blu_cts = Pin(34, Pin.IN)
rbw_cts = Pin(35, Pin.IN)

def handle_interrupt(pin):
    print(pin)

# Use Pin.IRQ_RISING to set interrupt trigger to rising edge.
# Use Pin.IRQ_FALLING to set interrupt trigger to falling edge.
# Use Pin.IRQ_RISING | Pin.IRQ_FALLING to set interrupt trigger to both edge.
# Interrupt with rising edge detects signal change from logic LOW to logic HIGH.
# Interrupt with falling edge detects signal change from logic HIGH to logic LOW.
red_cts.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=handle_interrupt)
grn_cts.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=handle_interrupt)
blu_cts.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=handle_interrupt)
rbw_cts.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=handle_interrupt)

```
This just shows how to use multiple pin interrupts by expanding the Example # 3.

### 5. Example # 5, simple pin interrupt example:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

red_cts = Pin(32, Pin.IN)
grn_cts = Pin(33, Pin.IN)
blu_cts = Pin(34, Pin.IN)
rbw_cts = Pin(35, Pin.IN)
led = Pin(2, Pin.OUT)

press = False
irq_pin = 0

def handle_interrupt(pin):
    global press
    press = True
    global irq_pin
    irq_pin = int(str(pin)[4:-1])
"""  
   String slicing [<start position>,<end position>]  
   positive value - starts counting from left-hand side  
   negative value - starts counting from right-hand side  
   For example:  
     If you press red color touch sensor it will return:  
       Pin(32)  
     Now to get only the integer value, we can slice the string  
     by removing the "Pin(" and that is 4 position from left.  
     We also need to remove the ")" and that is 1 position from right  
     (use negative "-" to indicate slice from right).  
     Which leaves a string "32".  
     And to make it as an integer value, we can use an int() casting.        
   """  
red_cts.irq(trigger=Pin.IRQ_RISING, handler=handle_interrupt)
grn_cts.irq(trigger=Pin.IRQ_RISING, handler=handle_interrupt)
blu_cts.irq(trigger=Pin.IRQ_RISING, handler=handle_interrupt)
rbw_cts.irq(trigger=Pin.IRQ_RISING, handler=handle_interrupt)

while True:
    if press:
        press = False
        if irq_pin == 32:
            print('Red color touch sensor triggered.')
        if irq_pin == 33:
            print('Green color touch sensor triggered.')
        if irq_pin == 34:
            print('Blue color touch sensor triggered.')
        if irq_pin == 35:
            print('Rainbow color touch sensor triggered.')

```
This code works still the same as Example # 3 and Example # 4.

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[gorillacell.kr](http://gorillacell.kr/)

