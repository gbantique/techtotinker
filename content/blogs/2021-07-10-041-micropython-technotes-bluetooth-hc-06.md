---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-07-10T20:20:00+08:00'
excerpt: In this article, I will  talk about the (external) BLUETOOTH module with ESP32 using MicroPython.
tags:
  - ESP32 HC-06
  - ESP8266
  - Micropython HC-06
  - MicroPython HC06
  - MicroPython project
  - MicroPython tutorials
  - Node MCU
  - Python project
series:
  - MicroPython TechNotes
title: '041 - MicroPython TechNotes: Bluetooth HC-06'
url: /2021/07/10/041-micropython-technotes-bluetooth-hc-06/
---

## **Introduction**

![](/images/041-2B-2BMicroPython-2BTechNotes-2BHC06-2BBluetooth.png)

In this article, I will talk about the (external) BLUETOOTH module with ESP32 using MicroPython.

## **Bill Of Materials**

*To follow this lesson you will need the following:*

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 4-pin female-female dupont wires.
4. Gorillacell Bluetooth module.

![](/images/HC06-2BBluetooth-2BGorillacell-2Bpinout.png)

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **TX** – for the UART transmit pin.
4. **RX** – for the UART receive pin.

## **Hardware Instruction**

1. Connect the Bluetooth module GND pin to ESP32 GND pin.
2. Connect the Bluetooth module VCC pin to ESP32 3.3V pin.
3. Connect the Bluetooth module TX pin to ESP32 GPIO 23 pin.
4. Connect the Bluetooth module RX pin to ESP32 GPIO 25 pin.

## **Software Instruction**

1. Copy the sample source code below and paste it to your Thonny IDE.
2. Run it then modify according to your needs.
3. Enjoy and happy learning.

## **Video Demonstration**

{{< youtube Tp7s5xOMiTU >}}

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
from machine import UART
bt = UART(2, baudrate=9600, tx=25, rx=23)

# The following lines of code can be tested using the REPL:
# 1. To check if there is available serial data<br></br># bt.any()
# 2. To read all data available:<br></br>
# bt.read()<br></br>
# 3. Or you can input the number of bytes as parameter
#    you want to read from uart
# bt.read(num_here)
# 4. Or you can read 1 line
# bt.readline()
# 5. Now to write / transmit uart data
# bt.write(your_data)<br></br>
```

### 2. Example # 2, controlling an output:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com
# George Bantique | tech.to.tinker@gmail.com
from machine import Pin
from machine import UART
bt = UART(2, baudrate=9600, tx=25, rx=23)
led = Pin(2, Pin.OUT)
while True:
    if bt.any()!=0:
    msg = bt.read(bt.any()).decode().strip('rn')
    print(msg)
    if "ON" in msg:
        led.value(1)
    if "OFF" in msg:
        led.value(0)
```

### 3. Example # 3, reading an input:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com
# George Bantique | tech.to.tinker@gmail.com
from machine import Pin
from machine import UART
from machine import Timer
from time import ticks_ms

bt = UART(2, baudrate=9600, tx=25, rx=23)
led = Pin(2, Pin.OUT)
sw = Pin(0, Pin.IN)

tim0 = Timer(0)
t_start = ticks_ms()

while True:
    if bt.any()!=0:
        #msg = bt.read(bt.any()).decode().strip('rn')
        #print(msg)
        msg = bt.read(bt.any()).decode()
        if "ON" in msg:
            led.value(1)
            tim0.deinit()
            print('LED is ON')
        elif "OFF" in msg:
            led.value(0)
            tim0.deinit()
            print('LED is OFF')
        elif "BLINK" in msg:
            tim0.init(period=250, mode=Timer.PERIODIC, callback=lambda t: led.value(not led.value()))
            print('LED is blinking')
        else:
            print(msg.strip('rn'))
            if ticks_ms()-t_start >= 300:
                if sw.value()==0: # BOOT button is pressed
                    bt.write('Boot button is pressed.rn')
                    print('Sending "Boot button is pressed."')
                    t_start=ticks_ms()
```

# **References And Credits**

1. Purchased your Gorillacell ESP32 development kit at:
    [https://gorillacella.kr/](https://gorillacell.kr/)

