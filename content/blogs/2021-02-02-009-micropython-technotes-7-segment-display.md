---
author: George Bantique
categories:
  - ESP32
  - GorillaCell
  - MicroPython
date: '2021-02-02T15:46:00+08:00'
excerpt: In this article, we will look at 4-digit 7-segment display. We will learn on how to use it step by step using the MicroPython Language.
tags:
  - esp32 7 segment display
  - How to use 7 segment in MicroPython
series:
  - MicroPython TechNotes
title: '009 - MicroPython TechNotes: 7 Segment Display'
url: /2021/02/02/009-micropython-technotes-7-segment-display/
---

## **Introduction**

![](/images/009-technotes-7-segment-micropython.png)

In this article, we will look at 4-digit 7-segment display. We will learn on how to use it step by step using the MicroPython Language.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorilla Cell ESP32 shield.
3. 4-pin female-female dupont jumper wires.
4. 4-digit 7-segment display.

## **Hardware Instruction**

1. First, attach the ESP32 development board on top of ESP32 shield making sure that both the USB port is on the same side.
2. Next, attach the dupont to the 7-segment display according to the color coding which is black for the ground, red for the VCC, yellow for the DIO, and white for the CLK pin.
3. Next, attach the other side of the dupont wire to the ESP32 shield by matching the colors of the wire to the colors of the pin headers which is black to black, red to red, yellow and the following colors to the yellow pin headers. For this experiment, I choose the I2C pins on GPIO 21 for the DIO and GPIO 22 for the CLK pin.
4. Next, attach the external power supply for the ESP32 shield by connecting a type-C USB cable power supply source and make sure that the power switch is slide to the ON state.
5. Next, connect the ESP32 to the computer by attaching a micro USB cable. Our demo circuit is now ready.

## **Software Instruction**

1. For this experiment, we will be using Thonny Python IDE as a MicroPython environment.
2. Now, let the Thonny to detect the ESP32 by clicking the Stop button. When you see triple greater than sign, it means that Thonny detected the ESP32 as Micropython device.
3. Now, in order to use the 7-segment display we need an external driver library. Luckily, mcauser provides us a fantastic library named micropython-tm1637 which is available on his Github: <https://github.com/mcauser/micropython-tm1637>
4. For the experiment, I have prepared 3 example source code below.
5. Please feel free to modify it to learn more. Happy tinkering!

## **Video Demonstration**

{{< youtube uD-SPhs-xNw >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### **1. Example # 1, exploring basic functionality of the 7-segment:**

```py { lineNos="true" wrap="true" }
import tm1637
from machine import Pin
tm = tm1637.TM1637(dio=Pin(21), clk=Pin(22))

# The following line of code should
# be tested using the REPL
# This will demonstrate basic function of 7 segment

# 1. TO WRITE A STRING:
# tm.show('abcd')

# 2. TO WRITE A NUMBER:
# tm.numbers(1234)
#    Now to use the decimal point in between
# tm.numbers(12,34) 
#    or use
# tm.numbers(12,34,True)
#    Now to turn off the decimal point
# tm.numbers(12,34,False)
#    So basically the 3rd value determines if
#    decimal point will be active or not.
#    So to display time: "12:59"
# tm.numbers(12, 59)
#    or 
# tm.numbers(12, 59, True)

# 3. TO SCROLL THE DISPLAY:
# tm.scroll('Hello World') # 4 fps
#    Now to control the speed of scroll
#    The second value, is the amount of delay in ms
# tm.scroll('Hello World', 1000) # 1 fps
# tm.scroll(list(tm1637._SEGMENTS))

# 4. TO SHOW TEMPERATURE:
#    Works for range -9 to +99
# tm.temperature(-9)  # -9*C
# tm.temperature(5)   #  5*C
# tm.temperature(99)  # 99*C
#    While values outside the range, will give
# tm.temperature(-10) # LO*C
# tm.temperature(100) # HI*C

#5. TO CONTROL THE BRIGHTNESS
# tm.brightness(0)
# tm.brightness(7)
```

### **2. Example # 2, counter that counts up from 0 to 19 and counts down from 20 to 1 infinitely:**

```py { lineNos="true" wrap="true" }
# Author: George Bantique | tech.to.tinker@gmail.com | TechToTinker.blogspot.com
# Date:   February 2, 2020
# Note:   Please feel free to modify this according to your needs.

import tm1637
from machine import Pin
from time import sleep_ms

tm = tm1637.TM1637(dio=Pin(21), clk=Pin(22))

# This will count up from 0 to 19 and
# count down from 20 down to 1.
while True:
    # Count up counter:
    for i in range(20):
        tm.number(i)
        sleep_ms(500)
        
    # Count down counter:
    for i in range(20, 0, -1):
        tm.number(i)
        sleep_ms(500)
```

### **3. Example # 3, clock by taking advantage of the builtin RTC module in ESP32:**

```py { lineNos="true" wrap="true" }
# Author: George Bantique | tech.to.tinker@gmail.com | TechToTinker.blogspot.com
# Date:   February 2, 2020
# Note:   Please feel free to modify this according to your needs.

import tm1637
from machine import Pin
from time import sleep_ms
from machine import RTC

rtc = RTC()
tm = tm1637.TM1637(dio=Pin(21), clk=Pin(22))

rtc.datetime((2021, 2, 2, 1, 12, 01, 0, 0))
# rtc.datetime((YYYY, MM, DD, WD, HH, MM, SS, MS))
# WD 1 = Monday
# WD 7 = Sunday

isPoint = True

while True:
    t = rtc.datetime()
    tm.numbers(t[4], t[5], isPoint)
    sleep_ms(200)
    isPoint = not isPoint
```

### 4. **Library for 7 Segment Display:**

```py { lineNos="true" wrap="true" }
"""
MicroPython TM1637 quad 7-segment LED display driver
https://github.com/mcauser/micropython-tm1637
MIT License
Copyright (c) 2016 Mike Causer
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

from micropython import const
from machine import Pin
from time import sleep_us, sleep_ms

TM1637_CMD1 = const(64)  # 0x40 data command
TM1637_CMD2 = const(192) # 0xC0 address command
TM1637_CMD3 = const(128) # 0x80 display control command
TM1637_DSP_ON = const(8) # 0x08 display on
TM1637_DELAY = const(10) # 10us delay between clk/dio pulses
TM1637_MSB = const(128)  # msb is the decimal point or the colon depending on your display

# 0-9, a-z, blank, dash, star
_SEGMENTS = bytearray(b'x3Fx06x5Bx4Fx66x6Dx7Dx07x7Fx6Fx77x7Cx39x5Ex79x71x3Dx76x06x1Ex76x38x55x54x3Fx73x67x50x6Dx78x3Ex1Cx2Ax76x6Ex5Bx00x40x63')

class TM1637(object):
    """Library for quad 7-segment LED modules based on the TM1637 LED driver."""
    def __init__(self, clk, dio, brightness=7):
        self.clk = clk
        self.dio = dio

        if not 0 <= brightness <= 7:
            raise ValueError("Brightness out of range")
        self._brightness = brightness

        self.clk.init(Pin.OUT, value=0)
        self.dio.init(Pin.OUT, value=0)
        sleep_us(TM1637_DELAY)

        self._write_data_cmd()
        self._write_dsp_ctrl()

    def _start(self):
        self.dio(0)
        sleep_us(TM1637_DELAY)
        self.clk(0)
        sleep_us(TM1637_DELAY)

    def _stop(self):
        self.dio(0)
        sleep_us(TM1637_DELAY)
        self.clk(1)
        sleep_us(TM1637_DELAY)
        self.dio(1)

    def _write_data_cmd(self):
        # automatic address increment, normal mode
        self._start()
        self._write_byte(TM1637_CMD1)
        self._stop()

    def _write_dsp_ctrl(self):
        # display on, set brightness
        self._start()
        self._write_byte(TM1637_CMD3 | TM1637_DSP_ON | self._brightness)
        self._stop()

    def _write_byte(self, b):
        for i in range(8):
            self.dio((b >> i) & 1)
            sleep_us(TM1637_DELAY)
            self.clk(1)
            sleep_us(TM1637_DELAY)
            self.clk(0)
            sleep_us(TM1637_DELAY)
        self.clk(0)
        sleep_us(TM1637_DELAY)
        self.clk(1)
        sleep_us(TM1637_DELAY)
        self.clk(0)
        sleep_us(TM1637_DELAY)

    def brightness(self, val=None):
        """Set the display brightness 0-7."""
        # brightness 0 = 1/16th pulse width
        # brightness 7 = 14/16th pulse width
        if val is None:
            return self._brightness
        if not 0 <= val <= 7:
            raise ValueError("Brightness out of range")

        self._brightness = val
        self._write_data_cmd()
        self._write_dsp_ctrl()

    def write(self, segments, pos=0):
        """Display up to 6 segments moving right from a given position.
        The MSB in the 2nd segment controls the colon between the 2nd
        and 3rd segments."""
        if not 0 <= pos <= 5:
            raise ValueError("Position out of range")
        self._write_data_cmd()
        self._start()

        self._write_byte(TM1637_CMD2 | pos)
        for seg in segments:
            self._write_byte(seg)
        self._stop()
        self._write_dsp_ctrl()

    def encode_digit(self, digit):
        """Convert a character 0-9, a-f to a segment."""
        return _SEGMENTS[digit & 0x0f]

    def encode_string(self, string):
        """Convert an up to 4 character length string containing 0-9, a-z,
        space, dash, star to an array of segments, matching the length of the
        source string."""
        segments = bytearray(len(string))
        for i in range(len(string)):
            segments[i] = self.encode_char(string[i])
        return segments

    def encode_char(self, char):
        """Convert a character 0-9, a-z, space, dash or star to a segment."""
        o = ord(char)
        if o == 32:
            return _SEGMENTS[36] # space
        if o == 42:
            return _SEGMENTS[38] # star/degrees
        if o == 45:
            return _SEGMENTS[37] # dash
        if o >= 65 and o <= 90:
            return _SEGMENTS[o-55] # uppercase A-Z
        if o >= 97 and o <= 122:
            return _SEGMENTS[o-87] # lowercase a-z
        if o >= 48 and o <= 57:
            return _SEGMENTS[o-48] # 0-9
        raise ValueError("Character out of range: {:d} '{:s}'".format(o, chr(o)))

    def hex(self, val):
        """Display a hex value 0x0000 through 0xffff, right aligned."""
        string = '{:04x}'.format(val & 0xffff)
        self.write(self.encode_string(string))

    def number(self, num):
        """Display a numeric value -999 through 9999, right aligned."""
        # limit to range -999 to 9999
        num = max(-999, min(num, 9999))
        string = '{0: >4d}'.format(num)
        self.write(self.encode_string(string))

    def numbers(self, num1, num2, colon=True):
        """Display two numeric values -9 through 99, with leading zeros
        and separated by a colon."""
        num1 = max(-9, min(num1, 99))
        num2 = max(-9, min(num2, 99))
        segments = self.encode_string('{0:0>2d}{1:0>2d}'.format(num1, num2))
        if colon:
            segments[1] |= 0x80 # colon on
        self.write(segments)

    def temperature(self, num):
        if num < -9:
            self.show('lo') # low
        elif num > 99:
            self.show('hi') # high
        else:
            string = '{0: >2d}'.format(num)
            self.write(self.encode_string(string))
        self.write([_SEGMENTS[38], _SEGMENTS[12]], 2) # degrees C

    def show(self, string, colon=False):
        segments = self.encode_string(string)
        if len(segments) > 1 and colon:
            segments[1] |= 128
        self.write(segments[:4])

    def scroll(self, string, delay=250):
        segments = string if isinstance(string, list) else self.encode_string(string)
        data = [0] * 8
        data[4:0] = list(segments)
        for i in range(len(segments) + 5):
            self.write(data[0+i:4+i])
            sleep_ms(delay)


class TM1637Decimal(TM1637):
    """Library for quad 7-segment LED modules based on the TM1637 LED driver.
    This class is meant to be used with decimal display modules (modules
    that have a decimal point after each 7-segment LED).
    """

    def encode_string(self, string):
        """Convert a string to LED segments.
        Convert an up to 4 character length string containing 0-9, a-z,
        space, dash, star and '.' to an array of segments, matching the length of
        the source string."""
        segments = bytearray(len(string.replace('.','')))
        j = 0
        for i in range(len(string)):
            if string[i] == '.' and j > 0:
                segments[j-1] |= TM1637_MSB
                continue
            segments[j] = self.encode_char(string[i])
            j += 1
        return segments
```

## **References And Credits**

1. mcauser micropython-tm1637 library:
<https://github.com/mcauser/micropython-tm1637/>

2. Purchase Gorilla Cell ESP32 kit from:
[gorillacell.kr](http://gorillacell.kr/)

