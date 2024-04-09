---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-08-23T20:00:00+08:00'
excerpt: In this article, I will tackle how you can use an Infrared receiver module with ESP32 using MicroPython. GorillaCell Infrared Receiver module from GorillaCell ESP32 development kits uses a VS1838 photodiode infrared receiver. It is low cost and easy to use.
tags:
  - ESP32 Infrared
  - ESP32 infrared receiver
  - ESP32 IR
  - ESP8266
  - MicroPython Infrared
  - MicroPython infrared receiver
  - MicroPython IR
series:
  - MicroPython TechNotes
title: '044 - MicroPython TechNotes: Infrared Receiver'
url: /2021/08/23/044-micropython-technotes-infrared-receiver/
---

## **Introduction**

![](/images/044-2B-2BMicroPython-2BTechNotes-2BInfrared-2BReceiver.png)

In this article, I will tackle how you can use an Infrared receiver module with ESP32 using MicroPython. GorillaCell Infrared Receiver module from GorillaCell ESP32 development kits uses a VS1838 photodiode infrared receiver. It is low cost and easy to use.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 3-pin female-female dupont wires.
4. Gorillacell Infrared Receiver module.

## **Pinout**

It has 3 pins namely:
1. G – for the ground pin.
2. V – for the supply voltage.
3. S – for the infrared receive signal pin.

## **Hardware Instruction**

1. First, attach the ESP32 development board on top of the ESP32 shield and make sure that both the USB port are on the same side.
2. Next, attach the dupont wires to the Infrared Receiver module by following the color coding that is black for the ground, red for the VCC, and yellow for the signal pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers that is black is to black, red is to red, and yellow is to yellow pin headers. For this lesson, I choose GPIO 23 to serve as the input pin from the Infrared Receiver module.
4. Next, power the ESP32 shield with an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer using a micro-USB connector cable.

## **Software Instruction**

1. Copy the ir\_rx.py from the SOURCE CODE section and paste it to Thonny IDE.
2. Save it to MicroPython root directory by clicking the File menu and select Save As.
3. Select MicroPython Device.
4. And save it as ir\_rx.py.
5. Copy other examples to Thonny IDE and run it accordingly.
6. Feel free to modify and adapt according to your needs.

## **Video Demonstration**

{{< youtube Xch1VZgfH5c >}}

## **Call To Action**

If you have any concern regarding this video, please write your question in the comment box.

You might also liked to support my journey on Youtube by subscribing on my channel, TechToTinker. [Click this to Subscribe.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

    – George Bantique | tech.to.tinker@gmail.com
## **Source Code**

### 1. Example # 1, decode and display the receive infrared data to the REPL:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

import time
from machine import Pin
from ir_rx import NEC_16

def callback(data, addr, ctrl):
    if data > 0:  # NEC protocol sends repeat codes.
        print('Data {:02x} Addr {:04x}'.format(data, addr))

ir = NEC_16(Pin(23, Pin.IN), callback)

```

### 2. Example # 2, display actual buttons key in the REPL:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from ir_rx import NEC_16

ir_key = {
    0x45: 'POWER',
    0x46: 'MODE',
    0x47: 'MUTE',
    0x44: 'PLAY',
    0x40: 'PREV',
    0x43: 'NEXT',
    0x07: 'EQ',
    0x15: 'MINUS',
    0x09: 'PLUS',
    0x16: '0',
    0x19: 'REPEAT',
    0x0D: 'USD',
    0x0C: '1',
    0x18: '2',
    0x5E: '3',
    0x08: '4',
    0x1C: '5',
    0x5A: '6',
    0x42: '7',
    0x52: '8',
    0x4A: '9'    
    }

def callback(data, addr, ctrl):
    if data > 0:  # NEC protocol sends repeat codes.
        #print('Data {:02x} Addr {:04x}'.format(data, addr))
        print(ir_key[data])

ir = NEC_16(Pin(23, Pin.IN), callback)
```

### 3. Example # 3, application, controlling the on-board LED. Pressing 2 will blinks the LED every 500ms, pressing 0 will turn OFF the LED:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import Timer
from ir_rx import NEC_16


def ir_callback(data, addr, ctrl):
    global ir_data
    global ir_addr
    if data > 0:
        ir_data = data
        ir_addr = addr
        print('Data {:02x} Addr {:04x}'.format(data, addr))
            
def timer_callback(timer):
    led.value( not led.value() )        

ir = NEC_16(Pin(23, Pin.IN), ir_callback)
led = Pin(2, Pin.OUT)
tim0 = Timer(0)
isLedBlinking = False
ir_data = 0
ir_addr = 0

while True:
    if ir_data > 0:
        if ir_data == 0x16:   # 0
            led.value(0)
            if isLedBlinking==True:
                tim0.deinit()
                isLedBlinking = False
        elif ir_data == 0x0C: # 1
            led.value(1)
            if isLedBlinking==True:
                tim0.deinit()
                isLedBlinking = False
        elif ir_data == 0x18: # 2
            isLedBlinking = True
            tim0.init(period=500,
                      mode=Timer.PERIODIC,
                      callback=timer_callback)
        ir_data = 0

```

### 4. micropython\_ir.py driver library:

```py { lineNos="true" wrap="true" }
# MIT License
# 
# Copyright (c) 2020 Peter Hinch
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# Author: Peter Hinch
# Copyright Peter Hinch 2020-2021 Released under the MIT license
# http://github.com/peterhinch/micropython_ir

from machine import Pin
from machine import Timer
from array import array
from utime import ticks_us
from utime import ticks_diff

# Save RAM
# from micropython import alloc_emergency_exception_buf
# alloc_emergency_exception_buf(100)


# On 1st edge start a block timer. While the timer is running, record the time
# of each edge. When the timer times out decode the data. Duration must exceed
# the worst case block transmission time, but be less than the interval between
# a block start and a repeat code start (~108ms depending on protocol)

class IR_RX():
    # Result/error codes
    # Repeat button code
    REPEAT = -1
    # Error codes
    BADSTART = -2
    BADBLOCK = -3
    BADREP = -4
    OVERRUN = -5
    BADDATA = -6
    BADADDR = -7

    def __init__(self, pin, nedges, tblock, callback, *args):  # Optional args for callback
        self._pin = pin
        self._nedges = nedges
        self._tblock = tblock
        self.callback = callback
        self.args = args
        self._errf = lambda _ : None
        self.verbose = False

        self._times = array('i',  (0 for _ in range(nedges + 1)))  # +1 for overrun
        pin.irq(handler = self._cb_pin, trigger = (Pin.IRQ_FALLING | Pin.IRQ_RISING))
        self.edge = 0
        self.tim = Timer(-1)  # Sofware timer
        self.cb = self.decode

    # Pin interrupt. Save time of each edge for later decode.
    def _cb_pin(self, line):
        t = ticks_us()
        # On overrun ignore pulses until software timer times out
        if self.edge <= self._nedges:  # Allow 1 extra pulse to record overrun
            if not self.edge:  # First edge received
                self.tim.init(period=self._tblock , mode=Timer.ONE_SHOT, callback=self.cb)
            self._times[self.edge] = t
            self.edge += 1

    def do_callback(self, cmd, addr, ext, thresh=0):
        self.edge = 0
        if cmd >= thresh:
            self.callback(cmd, addr, ext, *self.args)
        else:
            self._errf(cmd)

    def error_function(self, func):
        self._errf = func

    def close(self):
        self._pin.irq(handler = None)
        self.tim.deinit()


class NEC_ABC(IR_RX):
    def __init__(self, pin, extended, callback, *args):
        # Block lasts <= 80ms (extended mode) and has 68 edges
        super().__init__(pin, 68, 80, callback, *args)
        self._extended = extended
        self._addr = 0

    def decode(self, _):
        try:
            if self.edge > 68:
                raise RuntimeError(self.OVERRUN)
            width = ticks_diff(self._times[1], self._times[0])
            if width < 4000:  # 9ms leading mark for all valid data
                raise RuntimeError(self.BADSTART)
            width = ticks_diff(self._times[2], self._times[1])
            if width > 3000:  # 4.5ms space for normal data
                if self.edge < 68:  # Haven't received the correct number of edges
                    raise RuntimeError(self.BADBLOCK)
                # Time spaces only (marks are always 562.5µs)
                # Space is 1.6875ms (1) or 562.5µs (0)
                # Skip last bit which is always 1
                val = 0
                for edge in range(3, 68 - 2, 2):
                    val >>= 1
                    if ticks_diff(self._times[edge + 1], self._times[edge]) > 1120:
                        val |= 0x80000000
            elif width > 1700: # 2.5ms space for a repeat code. Should have exactly 4 edges.
                raise RuntimeError(self.REPEAT if self.edge == 4 else self.BADREP)  # Treat REPEAT as error.
            else:
                raise RuntimeError(self.BADSTART)
            addr = val & 0xff  # 8 bit addr
            cmd = (val >> 16) & 0xff
            if cmd != (val >> 24) ^ 0xff:
                raise RuntimeError(self.BADDATA)
            if addr != ((val >> 8) ^ 0xff) & 0xff:  # 8 bit addr doesn't match check
                if not self._extended:
                    raise RuntimeError(self.BADADDR)
                addr |= val & 0xff00  # pass assumed 16 bit address to callback
            self._addr = addr
        except RuntimeError as e:
            cmd = e.args[0]
            addr = self._addr if cmd == self.REPEAT else 0  # REPEAT uses last address
        # Set up for new data burst and run user callback
        self.do_callback(cmd, addr, 0, self.REPEAT)

class NEC_8(NEC_ABC):
    def __init__(self, pin, callback, *args):
        super().__init__(pin, False, callback, *args)

class NEC_16(NEC_ABC):
    def __init__(self, pin, callback, *args):
        super().__init__(pin, True, callback, *args)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kits from:
    <https://gorillacell.kr/>

2. Peter Hinch micropython IR library:
    [http://github.com/peterhinch/micropython\_ir](http://github.com/peterhinch/micropython_ir)

