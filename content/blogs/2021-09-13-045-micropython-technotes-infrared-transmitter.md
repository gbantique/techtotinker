---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-09-13T06:10:00+08:00'
tags:
  - ESP32 Infrared
  - ESP32 infrared transmitter
  - ESP32 IR
  - ESP8266
  - MicroPython Infrared
  - MicroPython infrared transmitter
  - MicroPython IR
series:
  - MicroPython TechNotes
title: '045 - MicroPython TechNotes: Infrared Transmitter'
url: /2021/09/13/045-micropython-technotes-infrared-transmitter/
---

## **Introduction**

![](/images/045-2BMicroPython-2BTechNotes-2BInfrared-2BTransmitter.png)

In this article, I will tackle how you can use an Infrared transmitter module with ESP32 using MicroPython. GorillaCell Infrared Transmitter module from GorillaCell ESP32 development kits uses an infrared transmitter LED. It is low cost and easy to use.

## **Bill Of Materials**

1. ESP32 development board.

2. Gorillacell ESP32 shield.

3. 3-pin female-female dupont wires.

4. Gorillacell Infrared Transmitter module.

## **Pinout**

It has 3 pins namely:
    1. G – for the ground pin.
    2. V – for the supply voltage.
    3. S – for the infrared transmitter signal pin.

![](/images/IR-2BDecoder-2BSetup.png)

## **Hardware Instruction**

1. First, attach the ESP32 development board on top of the ESP32 shield and make sure that both the USB port are on the same side.

2. Next, attach the dupont wires to the Infrared Transmitter module by following the color coding that is black for the ground, red for the VCC, and yellow for the signal pin.

3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers that is black is to black, red is to red, and yellow is to yellow pin headers. For this lesson, I choose GPIO 26 to serve as the output pin for the Infrared Transmitter module.

4. Next, power the ESP32 shield with an external power supply with a type-C USB connector and make sure that the power switch is set to ON state.

5. Lastly, connect the ESP32 to the computer using a micro-USB connector cable.

## **Software Instruction**

1. Copy the ir_tx.py from the SOURCE CODE section and paste it to Thonny IDE.

2. Save it to MicroPython root directory by clicking the File menu and select Save As.

3. Select MicroPython Device.

4. And save it as ir_tx.py.

5. Copy other examples to Thonny IDE and run it accordingly.

6. Feel free to modify and adapt according to your needs.

## **Video Demonstration**

{{< youtube SFxsKJl3Kmw >}}

## **Call To Action**

If you have any concern regarding this video, please write your question in the comment box.

You might also liked to support my journey on Youtube by subscribing on my channel, TechToTinker. [Click this to Subscribe.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,
    – George Bantique | tech.to.tinker@gmail.com

## **Source Code**

### **1. Example # 1, basics of transferring Infrared data:**

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from ir_tx import NEC

nec = NEC(Pin(26, Pin.OUT, value = 0))

#nec.transmit(<addr>, <data>)

```

### **2. Example # 2, basic application of Infrared transmitter:**

```py { lineNos="true" wrap="true" }
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from ir_tx import NEC
from time import sleep_ms

nec = NEC(Pin(26, Pin.OUT, value = 0))
sw = Pin(0, Pin.IN)

while True:
    if sw.value()==0:
        nec.transmit(0x0000, 0x09)
    sleep_ms(100)
```

### **3. micropython\_ir Library of Peter Hinch, save it as ir\_tx.py:**

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

# __init__.py Nonblocking IR blaster
# Runs on Pyboard D or Pyboard 1.x (not Pyboard Lite), ESP32 and RP2

# Released under the MIT License (MIT). See LICENSE.

# Copyright (c) 2020-2021 Peter Hinch
from sys import platform
from micropython import const
ESP32 = platform == 'esp32'  # Loboris not supported owing to RMT
RP2 = platform == 'rp2'
if ESP32:
    from machine import Pin, PWM
    from esp32 import RMT
elif RP2:
    from .rp2_rmt import RP2_RMT
else:
    from pyb import Pin, Timer  # Pyboard does not support machine.PWM
from esp32 import RMT
from array import array
from time import ticks_us
from time import ticks_diff
# import micropython
# micropython.alloc_emergency_exception_buf(100)


# Shared by NEC
STOP = const(0)  # End of data

# IR abstract base class. Array holds periods in μs between toggling 36/38KHz
# carrier on or off. Physical transmission occurs in an ISR context controlled
# by timer 2 and timer 5. See TRANSMITTER.md for details of operation.
class IR:
    _active_high = True  # Hardware turns IRLED on if pin goes high.
    _space = 0  # Duty ratio that causes IRLED to be off
    timeit = False  # Print timing info

    @classmethod
    def active_low(cls):
        if ESP32:
            raise ValueError('Cannot set active low on ESP32')
        cls._active_high = False
        cls._space = 100

    def __init__(self, pin, cfreq, asize, duty, verbose):
        if ESP32:
            self._rmt = RMT(0, pin=pin, clock_div=80, carrier_freq=cfreq,
                            carrier_duty_percent=duty)  # 1μs resolution
        elif RP2:  # PIO-based RMT-like device
            self._rmt = RP2_RMT(pin_pulse=None, carrier=(pin, cfreq, duty))  # 1μs resolution
        else:  # Pyboard
            if not IR._active_high:
                duty = 100 - duty
            tim = Timer(2, freq=cfreq)  # Timer 2/pin produces 36/38/40KHz carrier
            self._ch = tim.channel(1, Timer.PWM, pin=pin)
            self._ch.pulse_width_percent(self._space)  # Turn off IR LED
            # Pyboard: 0 <= pulse_width_percent <= 100
            self._duty = duty
            self._tim = Timer(5)  # Timer 5 controls carrier on/off times
        self._tcb = self._cb  # Pre-allocate
        self._arr = array('H', 0 for _ in range(asize))  # on/off times (μs)
        self._mva = memoryview(self._arr)
        # Subclass interface
        self.verbose = verbose
        self.carrier = False  # Notional carrier state while encoding biphase
        self.aptr = 0  # Index into array

    def _cb(self, t):  # T5 callback, generate a carrier mark or space
        t.deinit()
        p = self.aptr
        v = self._arr[p]
        if v == STOP:
            self._ch.pulse_width_percent(self._space)  # Turn off IR LED.
            return
        self._ch.pulse_width_percent(self._space if p & 1 else self._duty)
        self._tim.init(prescaler=84, period=v, callback=self._tcb)
        self.aptr += 1

    # Public interface
    # Before populating array, zero pointer, set notional carrier state (off).
    def transmit(self, addr, data, toggle=0, validate=False):  # NEC: toggle is unused
        t = ticks_us()
        if validate:
            if addr > self.valid[0] or addr < 0:
                raise ValueError('Address out of range', addr)
            if data > self.valid[1] or data < 0:
                raise ValueError('Data out of range', data)
            if toggle > self.valid[2] or toggle < 0:
                raise ValueError('Toggle out of range', toggle)
        self.aptr = 0  # Inital conditions for tx: index into array
        self.carrier = False
        self.tx(addr, data, toggle)  # Subclass populates ._arr
        self.trigger()  # Initiate transmission
        if self.timeit:
            dt = ticks_diff(ticks_us(), t)
            print('Time = {}μs'.format(dt))

    # Subclass interface
    def trigger(self):  # Used by NEC to initiate a repeat frame
        if ESP32:
            self._rmt.write_pulses(tuple(self._mva[0 : self.aptr]), start = 1)
        elif RP2:
            self.append(STOP)
            self._rmt.send(self._arr)
        else:
            self.append(STOP)
            self.aptr = 0  # Reset pointer
            self._cb(self._tim)  # Initiate physical transmission.

    def append(self, *times):  # Append one or more time peiods to ._arr
        for t in times:
            self._arr[self.aptr] = t
            self.aptr += 1
            self.carrier = not self.carrier  # Keep track of carrier state
            self.verbose and print('append', t, 'carrier', self.carrier)

    def add(self, t):  # Increase last time value (for biphase)
        assert t > 0
        self.verbose and print('add', t)
        # .carrier unaffected
        self._arr[self.aptr - 1] += t


# Given an iterable (e.g. list or tuple) of times, emit it as an IR stream.
class Player(IR):

    def __init__(self, pin, freq=38000, verbose=False):  # NEC specifies 38KHz
        super().__init__(pin, freq, 68, 33, verbose)  # Measured duty ratio 33%

    def play(self, lst):
        for x, t in enumerate(lst):
            self._arr[x] = t
        self.aptr = x + 1
        self.trigger()


_TBURST = const(563)
_T_ONE = const(1687)

class NEC(IR):
    valid = (0xffff, 0xff, 0)  # Max addr, data, toggle

    def __init__(self, pin, freq=38000, verbose=False):  # NEC specifies 38KHz
        super().__init__(pin, freq, 68, 33, verbose)  # Measured duty ratio 33%

    def _bit(self, b):
        self.append(_TBURST, _T_ONE if b else _TBURST)

    def tx(self, addr, data, _):  # Ignore toggle
        self.append(9000, 4500)
        if addr < 256:  # Short address: append complement
            addr |= ((addr ^ 0xff) << 8)
        for _ in range(16):
            self._bit(addr & 1)
            addr >>= 1
        data |= ((data ^ 0xff) << 8)
        for _ in range(16):
            self._bit(data & 1)
            data >>= 1
        self.append(_TBURST)

    def repeat(self):
        self.aptr = 0
        self.append(9000, 2250, _TBURST)
        self.trigger()  # Initiate physical transmission.

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kits from:
    [https://gorillacell.kr/](https://gorillacell.kr/)

2. Peter Hinch micropython IR library:
    [http://github.com/peterhinch/micropython\_ir](http://github.com/peterhinch/micropython_ir)

