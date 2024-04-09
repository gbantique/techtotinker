---
author: George Bantique
categories:
  - ESP32
  - GorillaCell
  - MicroPython
date: '2021-01-22T14:38:00+08:00'
excerpt: In this article, we will look at LED. We will learn on how to control it by turning it ON and OFF. LED stands for Light-Emitting Diode. It is a type of electronic of component that emits light when a sufficient voltage is applied on its terminals.
tags:
  - esp32 micropython
  - Gorilla Cell LED
  - Gorilla Cell LED MicroPython
  - How to get started with MicroPython
  - How to use LED in MicroPython
  - LED MicroPython
  - MicroPython LED
series:
  - MicroPython TechNotes
title: '005 - MicroPython TechNotes: Gorilla Cell LED | MicroPython Hello World'
url: /2021/01/22/005-micropython-technotes-gorilla-cell-led-micropython-hello-world/
---

## **Introduction**

![](/images/005-technotes-led-micropython-techtotinker.png)

In this article, we will look at LED. We will learn on how to control it by turning it ON and OFF. **LED** stands for **L**ight-**E**mitting **D**iode. It is a type of electronic of component that emits light when a sufficient voltage is applied on its terminals.

## **Pinout**

1. **G** – for the ground pin.
2. **V** – for the supply voltage pin.
3. **S** – for the control signal for the LED. Applying a logic 1 on this pin will turn ON the LED and a logic 0 turn it OFF.

## **Bill Of Materials**

1. LED module.
2. ESP32 Development board.
3. Gorilla ESP32 shield.
4. 3-pin female-to-female dupont jump wires.

## **Hardware Instruction**

1. Connect ESP32 dev board at the top of ESP32 shield observing correct orientation and alignment.
2. Attach a dupont to LED module observing proper color-coding which black wire for the ground, red wire for the VCC, and yellow wire for other signal pins.
3. Attach the other side of dupont to ESP32 shield by matching the color-coding of the dupont and the pin headers which black to black, red to red, and other colors to yellow.
4. Power up the ESP32 shield by attaching the USB type-C cable.
5. Connect the micro USB cable to ESP32 dev board.

![](/images/005-technotes-led-micropython-techtotinker-diagram.png)

## **Software Instruction**

1. Open Thonny Python IDE.
2. Click “New” to create a new file.
3. Copy and paste one of the example source code.
4. Save it to your computer in your preferred location. I recommend to create a single folder location for easy reference.
5. Click the “Stop” button in Thonny. The triple greater than sign should appear &gt;&gt;&gt;.
6. Click the “Run” button to execute the code.
7. Enjoy.

## **Video Demonstration**

{{< youtube CsMkJr3qhH4 >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. LED Example # 1, turning ON or OFF:

```py { lineNos="true" wrap="true" }
from machine import Pin

red = Pin(16, Pin.OUT)

# The following codes should be tested
# using the REPL
red.on()  # Turn ON LED
red.off() # Turn OFF LED

red.value(1) # Turn ON LED
red.value(0) # Turn OFF LED

red.value(True)  # Turn ON LED
red.value(False) # Turn OFF LED

```

#### How the code works:

`from machine import Pin`
This imports or loads the Pin class from the machine module to enable access to the ESP32 pins.

`red = Pin(16, Pin.OUT)`
Creates an object named “red” for the red LED which connected on GPIO 16 denoted by the number “16” and the pin is set as an output by “Pin.OUT”.

*The red LED can be turned ON by calling any of the following:*
red.on()
red.value(1)
red.value(True)

*or turn it OFF by calling any of the following:*
red.off()
red.value(0)
red.value(False)


### 2. LED Example#2, blinking all LED:

```py { lineNos="true" wrap="true" }
from machine import Pin
from time import sleep

r = Pin(16, Pin.OUT)
g = Pin(17, Pin.OUT)
b = Pin(18, Pin.OUT)
y = Pin(19, Pin.OUT)

while True:
    # Turn ON 'all' LEDs
    r.on()
    g.on()
    b.on()
    y.on()
    sleep(1)
    
    # Turn OFF 'all' LEDs
    r.off()
    g.off()
    b.off()
    y.off()
    sleep(1)
```

#### How the code works:

```py { lineNos="true" wrap="true" }
from machine import Pin  
from time import sleep
```
This imports the Pin class from the machine library and the sleep class from the time library. Pin class enables access to the pins of ESP32 while sleep class enables the use of sleep() function which is equivalent to delay.

```py { lineNos="true" wrap="true" }
r = Pin(16, Pin.OUT)
g = Pin(17, Pin.OUT)
b = Pin(18, Pin.OUT)
y = Pin(19, Pin.OUT)
```
Creates objects for the LEDs namely “r” for the red LED, “g” for the green LED, “b” for the blue LED, and “y” for the yellow LED.

```py { lineNos="true" wrap="true" }
while True:
    r.on()  
    g.on()  
    b.on()  
    y.on()  
    sleep(1)  
    r.off()  
    g.off()  
    b.off()  
    y.off()  
    sleep(1)
```

Creates the main loop of the program.
“while True:” makes the loop to loop forever or indefinitely. Any code inside will be executed one by one until the end then the cycle will be repeated.

Inside the main loop, all the LEDs are turned ON then it will wait for 1 second before turning it OFF then wait for another 1 second then the program will be repeated.

### 3. LED Example#3, running LED:

```py { lineNos="true" wrap="true" }
from machine import Pin
from time import sleep

r = Pin(16, Pin.OUT)
g = Pin(17, Pin.OUT)
b = Pin(18, Pin.OUT)
y = Pin(19, Pin.OUT)

# Create the list of led objects
led = [r, g, b, y]
while True:
    # Create a loop that will iterate from 0 to 3
    for x in range(4):
        print(x)       # Print the current value of 'x'
        led[x].on()    # Turn ON current x led
        led[x-1].off() # Turn OFF previous x led
        sleep(0.5)     # Stay in the LED value for a definite time
```

#### How the code works:

The works similar to example # 2 but this time, it is turned ON one-by-one to create the running-LED-effect.

```py { lineNos="true" wrap="true" }
led = \[r, g, b, y\]
```
Creates the list of LED objects which works similar to an array.

Inside the main loop, the LEDs are turned on one-by-one by using the for loop and turned on the LED according to current loop index.

## **References And Credits**

1. [gorillacell.kr/](http://gorillacell.kr/)

