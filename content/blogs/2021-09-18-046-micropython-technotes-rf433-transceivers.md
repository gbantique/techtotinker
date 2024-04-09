---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-09-18T09:19:00+08:00'
excerpt: "In this article, I will tackle how you can use an RF433 transceiver modules with ESP32 using MicroPython.\n \nRF433 transmitter and receiver modules uses a radio frequency of 433 MHz which is under the Industrial, Scientific, and Medical bandwidth or ISM band for short."
tags:
  - ESP32 FS1000A MicroPython
  - ESP32 radio receiver
  - ESP32 radio transmitter
  - ESP32 RF433 transceiver
  - ESP8266
  - MicroPython RF433
series:
  - MicroPython TechNotes
title: '046 - MicroPython TechNotes: RF433 Transceivers'
url: /2021/09/18/046-micropython-technotes-rf433-transceivers/
---

## **Introduction**

![](/images/046-2BMicroPython-2BTechNotes-2BRF433-2BTransceivers.png)

In this article, I will tackle how you can use an RF433 transceiver modules with ESP32 using MicroPython.

RF433 transmitter and receiver modules uses a radio frequency of 433 MHz which is under the Industrial, Scientific, and Medical bandwidth or ISM band for short.

**How does it works?**

The RF433 transmitter and receiver module both have 3 pins which are (1) G for the ground pin, (2) V for the supply voltage, and (3) S – for the signal pin or data pin. In receiver module, S pin serves as the receive data pin while in transmitter module, S pin serves as the transmitter data pin.

**What you will need?**
To follow this lesson, you will need the following:
    1. An ESP32 development board, 1 for the transmitter side and another 1 for the receiver side.
    2. A Gorillacell ESP32 shield, 2 pieces for both side of the circuit. This component is optional, you may use a breadboard instead if you want. Gorillacell ESP32 shield simplifies circuit connection.
    3. A 3-pin dupont jumper wires, 2 pieces for both side of the circuit.
    4. The RF433 transceivers, the receiver and the transmitter module.

**Side-trip:**
    Since I don’t have prior knowledge in using an RF433 transceiver modules so I did some quick research in the internet. I found this video <https://www.youtube.com/watch?v=98tYLEnevfA> where he demonstrates the use of the module without using any microcontroller. You might want to jump to 2:23 timestamp to just watch the demonstration.

![](/images/RF433-2BReceiver-2BTransmitter-2Bwithout-2BMicrocontroller.png)

I have the exact components, so I followed the circuit but it is a bit clunky. It easily picks interference and it is not working properly.

![](/images/Gorillacell-2BRF433-2BTransceivers-2Bwithout-2BMicrocontroller.png)

I have a spare components from Gorillacell for RF433 transceivers which produces a functional circuit.

## **Hardware Instruction**

1. Attach the RF433 transceiver module to ESP32 as follows:
 RF433 Rx/Tx G pin to ESP32 ground pin.
 RF433 Rx/Tx V pin to ESP32 5V pin.
 RF433 Rx/Tx S pin to ESP32 GPIO 23 pin.

2. (Optional) Power the ESP32 shield with an external power supply through the type-C USB cable connector.

3. Connect the ESP32 to the computer through a micro USB cable.

## **Software Instruction**

1. Copy the source code and run source code to the assigned ESP32, 1 for the transmitter side and another 1 for the receiver side circuit.

2. Feel free to modify the source code and please let me know if you made progress or you have any concern.

## **Video Demonstration**

{{< youtube BkmIUqccwDw >}}

## **Call To Action**

If you have any concern regarding this video, please write your question in the comment box.

You might also liked to support my journey on Youtube by subscribing on my channel, TechToTinker. [Click this to Subscribe.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,
    – George Bantique | tech.to.tinker@gmail.com

## **Source Code**

### 1. Example # 1, blinking an LED, transmitter:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

transmit = Pin(23, Pin.OUT)
sw = Pin(0, Pin.IN)

while True:
    transmit.value(not transmit.value())
    sleep_ms(50)

```

### 2. Example # 1, blinking an LED, receiver:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

receive = Pin(23, Pin.IN)
led = Pin(2, Pin.OUT)

while True:
    led.value(receive.value())
    sleep_ms(50)

```

### 3. Example # 2, sending message through RF433 modulated serial UART:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import UART

tx = UART(2, baudrate=9600, tx=23, rx=25)

# tx.write('This is a test messagern')

```

### 4. Example # 2, receiving message through RF433 modulated serial UART:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import UART

rx = UART(2, baudrate=9600, tx=25, rx=23)

# print(rx.read())
while True:
    if rx.any():
        print(rx.read())

```

### 5. Modified # 1, toggling the state of the receiver on-board LED, transmitter:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms

transmit = Pin(23, Pin.OUT)
sw = Pin(0, Pin.IN)
var_sw = 1

while True:
    if sw.value()==0:       # means, sw is pressed!
        var_sw = not var_sw # toggle the state of variable
    transmit.value(var_sw)  # send it to the radio
    sleep_ms(50)

```

### 6. Modified # 1, toggling the state of the receiver on-board LED, transmitter:

**(use the same source code in # 2)**

## **References And Credits**
   
1. Purchase your Gorillacell ESP32 development kits:
    <https://gorillacell.kr/>

2. Video showing the use of RF433 transceiver modules without an MCU:
    <https://www.youtube.com/watch?v=98tYLEnevfA/>

