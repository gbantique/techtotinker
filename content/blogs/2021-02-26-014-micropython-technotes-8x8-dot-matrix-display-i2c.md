---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-02-26T14:40:00+08:00'
excerpt: In this article, we will learn on how to use the 8×8 Dot Matrix display with an I2C communication interface using the MicroPython language.
tags:
  - ESP32 8×8 dot matrix
  - esp32 micropython
  - How to use dot matrix display in MicroPython
  - MicroPython 8×8 dot matrix
  - micropython ht16k33
series:
  - MicroPython TechNotes
title: '014 - MicroPython TechNotes: 8x8 Dot Matrix Display (I2C)'
url: /2021/02/26/014-micropython-technotes-8x8-dot-matrix-display-i2c/
---

## **Introduction**

![](/images/014-technotes-8x8-dot-matrix-i2c.png)

In this article, we will learn on how to use the 8×8 Dot Matrix display with an I2C communication interface using the MicroPython language.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 4-pin female-female dupont jumper wires.
4. 8×8 Dot Matrix display (I2C)

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **SDA** – for the I2C serial data pin.
4. **SCL** – for the I2C serial clock pin.

## **Hardware Instruction**

1. Attach the ESP32 dev board on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Attach the dupont wire on the 8×8 Dot Matrix display by following the color coding which is black for the GND, red for the VCC, yellow for the SDA, and white for the SCL pin.
3. Attach the other side of the dupont to the ESP32 shield by matching the colors of the wires to the colors of the pin headers that is black to black, red to red, and yellow and the following colors to yellow pin headers.
4. Power the ESP32 shield by attaching an external power supply with a USB type-C connector and make sure that the power switch is slide to the ON state.
5. Connect the ESP32 to the computer through a micro USB cable. Our demo circuit should now be ready.

## **Software Instruction**

1. Go to the source of the driver library from the Github of Tony Smith: https://github.com/smittytone/HT16K33-Python or you may copy it provided below on the SOURCE CODE section of this blog post.
2. Save one by one the ht16k33.py and the ht16k33Matrix.py to the MicroPython device root directory.  
    By clicking the File menu and select Save As.
3. Select MicroPython device and name it as ht16k33.py and ht16k33Matrix accordingly.
4. Enjoy playing with the examples and try to modify it to enhance the learning.

## **Video Demonstration**

{{< youtube yGFF_lEl-68 >}}

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

from machine import I2C, Pin, RTC
from ht16k33matrix import HT16K33Matrix
from time import sleep

i2c = I2C(scl=Pin(22), sda=Pin(21))
display = HT16K33Matrix(i2c)
display.set_brightness(10)
display.set_angle(270) # properly set the orientation of the display

# # The following lines of code should be tested using the REPL:
# # 1. To display a text:
# display.set_character(ord('A'), True).draw()
#
# # 2. To display all characters:
# for char in range(32, 128, 1):
#     display.clear().draw()
#     display.set_character(char, True).draw()
#     sleep(0.5)
#
# # 3. To display a scrolling text:
# display.clear().draw()
# text = "    abcdefghijklmnopqrstuvwxyz 0123456789!$%&*() x00x01    "
# display.scroll_text(text)
#
# # 4. Draw a custom icon on the LED
# icon = b"x3Cx42xA9x85x85xA9x42x3C"
# display.set_icon(icon).draw()
# # Rotate the icon
# display.set_angle(0).draw()
#
# # 5. Clear the LED
# display.clear().draw()
# 
# # 6. Record two custom icons using 'define_character()'
# icon = b"x0Ex18xBEx6Dx3Dx3C"
# display.define_character(icon, 0)
# icon = b"x3Cx3Dx6DxBEx18x0E"
# display.define_character(icon, 1)
# # Show the previously stored custom icon then Blink the LED
# display.set_character(0, True).draw()
# display.set_blink_rate(1)
# 
# # 7. Inverse the pixel
# display.set_inverse().draw()
# # Inverse the pixels (to revert)
# display.set_inverse().draw()
# 
# # 8. Clear and stop blinking
# display.clear().draw()
# display.set_blink_rate(0)
# 
# # 9. Plot an X
# for i in range(4):
#     display.plot(i, i).plot(7 - i, i).plot(i, 7 - i).plot(7 - i, 7 - i)
# display.draw()
# time.sleep(PAUSE)
# assert (display.is_set(0, 0) is True) and (display.is_set(0, 1) is False)
# display.clear().draw()
# 
# # 10. Show an animation
# while True:
#     x = 7
#     y = 0;
#     dx = 0
#     dy = 1;
#     mx = 6
#     my = 7;
#     nx = 0
#     ny = 0;
# 
#     for i in range(0,64):
#         display.plot(x, y).draw();
# 
#         if dx == 1 and x == mx:
#             dy = 1;
#             dx = 0;
#             mx -= 1;
#         elif dx == -1 and x == nx:
#             nx += 1;
#             dy = -1;
#             dx = 0;
#         elif dy == 1 and y == my:
#             dy = 0;
#             dx = -1;
#             my -= 1;
#         elif dy == -1 and y == ny:
#             dx = 1;
#             dy = 0;
#             ny += 1;
# 
#         x += dx;
#         y += dy
# 
#         sleep(0.01)
# 
#     x = 4
#     y = 3
#     dx = -1
#     dy = 0
#     mx = 5
#     my = 4
#     nx = 3
#     ny = 2
# 
#     for i in range(0, 64):
#         display.plot(x, y, 0).draw()
# 
#         if dx == 1 and x == mx:
#             dy = -1;
#             dx = 0;
#             mx += 1;
#         elif dx == -1 and x == nx:
#             nx -= 1;
#             dy = 1;
#             dx = 0;
#         elif dy == 1 and y == my:
#             dy = 0;
#             dx = 1;
#             my += 1;
#         elif dy == -1 and y == ny:
#             dx = -1;
#             dy = 0;
#             ny -= 1;
# 
#         x += dx;
#         y += dy
# 
#         sleep(0.01)

```

### 2. Example # 2, binary clock example:

```py { lineNos="true" wrap="tru" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import I2C, Pin, RTC
from ht16k33matrix import HT16K33Matrix
from time import sleep

i2c = I2C(scl=Pin(22), sda=Pin(21))
display = HT16K33Matrix(i2c)
display.set_brightness(10)
display.set_angle(90) # properly set the orientation of the display
display.clear().draw()

rtc = RTC() 
rtc.datetime((2021, 2, 24, 3, 20, 25, 0, 0)) 
# rtc.datetime((YYYY, MM, DD, WD, HH, MM, SS, MS)) 
# WD 1 = Monday 
# WD 7 = Sunday

def display_binary(decimal, column):
    # converts decimal number into 8-bit binary
    binary_str = '{0:8b}'.format(decimal)
    #print(binary_str)
    for row in range(0, 8):
        if binary_str[row] == '1':
            display.plot(column, row, 1)
        else:
            display.plot(column, row, 0)

while True:
    t = rtc.datetime()
    #display_binary(decimal value, dot matrix column)
    display_binary(t[0] % 100, 7)    # year
    display_binary(t[1], 6)          # month
    display_binary(t[2], 5)          # day
    display_binary(t[4], 3)          # hour
    display_binary(t[5], 2)          # minutes
    display_binary(t[6], 1)          # seconds
    display_binary(t[7] // 10000, 0) # subseconds
    display.draw() # update the dot matrix display
    sleep(0.0001)  # 100ms wait

```

### 3. ht16k33.py base driver library:

```py { lineNos="true" wrap="true" }
# MIT License
# 
# Copyright (c) 2020 Tony Smith (@smittytone)
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
class HT16K33:
    """
    A simple, generic driver for the I2C-connected Holtek HT16K33 controller chip.
    This release supports MicroPython and CircuitPython
    Version:    3.0.2
    Bus:        I2C
    Author:     Tony Smith (@smittytone)
    License:    MIT
    Copyright:  2020
    """

    # *********** CONSTANTS **********

    HT16K33_GENERIC_DISPLAY_ON = 0x81
    HT16K33_GENERIC_DISPLAY_OFF = 0x80
    HT16K33_GENERIC_SYSTEM_ON = 0x21
    HT16K33_GENERIC_SYSTEM_OFF = 0x20
    HT16K33_GENERIC_DISPLAY_ADDRESS = 0x00
    HT16K33_GENERIC_CMD_BRIGHTNESS = 0xE0
    HT16K33_GENERIC_CMD_BLINK = 0x81

    # *********** PRIVATE PROPERTIES **********

    i2c = None
    address = 0
    brightness = 15
    flash_rate = 0

    # *********** CONSTRUCTOR **********

    def __init__(self, i2c, i2c_address):
        assert 0x00 <= i2c_address < 0x80, "ERROR - Invalid I2C address in HT16K33()"
        self.i2c = i2c
        self.address = i2c_address
        self.power_on()

    # *********** PUBLIC METHODS **********

    def set_blink_rate(self, rate=0):
        """
        Set the display's flash rate.
        Only four values (in Hz) are permitted: 0, 2, 1, and 0,5.
        Args:
            rate (int): The chosen flash rate. Default: 0Hz (no flash).
        """
        assert rate in (0, 0.5, 1, 2), "ERROR - Invalid blink rate set in set_blink_rate()"
        self.blink_rate = rate & 0x03
        self._write_cmd(self.HT16K33_GENERIC_CMD_BLINK | rate << 1)

    def set_brightness(self, brightness=15):
        """
        Set the display's brightness (ie. duty cycle).
        Brightness values range from 0 (dim, but not off) to 15 (max. brightness).
        Args:
            brightness (int): The chosen flash rate. Default: 15 (100%).
        """
        if brightness < 0 or brightness > 15: brightness = 15
        self.brightness = brightness
        self._write_cmd(self.HT16K33_GENERIC_CMD_BRIGHTNESS | brightness)

    def draw(self):
        """
        Writes the current display buffer to the display itself.
        Call this method after updating the buffer to update
        the LED itself.
        """
        self._render()

    def update(self):
        """
        Alternative for draw() for backwards compatibility
        """
        self._render()

    def clear(self):
        """
        Clear the buffer.
        Returns:
            The instance (self)
        """
        for i in range(0, len(self.buffer)): self.buffer[i] = 0x00
        return self

    def power_on(self):
        """
        Power on the controller and display.
        """
        self._write_cmd(self.HT16K33_GENERIC_SYSTEM_ON)
        self._write_cmd(self.HT16K33_GENERIC_DISPLAY_ON)

    def power_off(self):
        """
        Power on the controller and display.
        """
        self._write_cmd(self.HT16K33_GENERIC_DISPLAY_OFF)
        self._write_cmd(self.HT16K33_GENERIC_SYSTEM_OFF)

    # ********** PRIVATE METHODS **********

    def _render(self):
        """
        Write the display buffer out to I2C
        """
        buffer = bytearray(len(self.buffer) + 1)
        buffer[1:] = self.buffer
        buffer[0] = 0x00
        self.i2c.writeto(self.address, bytes(buffer))

    def _write_cmd(self, byte):
        """
        Writes a single command to the HT16K33. A private method.
        """
        self.i2c.writeto(self.address, bytes([byte]))

```

### 4. ht16k33Matrix.py driver library class for the Dot Matrix Display:

```py { lineNos="true" wrap="true" }
# MIT License
# 
# Copyright (c) 2020 Tony Smith (@smittytone)
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
from ht16k33 import HT16K33

class HT16K33Matrix(HT16K33):
    """
    Micro/Circuit Python class for the Adafruit 8x8 monochrome LED matrix
    backpack.
    Version:    3.0.2
    Bus:        I2C
    Author:     Tony Smith (@smittytone)
    License:    MIT
    Copyright:  2020
    """

    # *********** CONSTANTS **********

    CHARSET = [
        b"x00x00",              # space - Ascii 32
        b"xfa",                  # !
        b"xc0x00xc0",          # "
        b"x24x7ex24x7ex24",  # #
        b"x24xd4x56x48",      # $
        b"xc6xc8x10x26xc6",  # %
        b"x6cx92x6ax04x0a",  # &
        b"xc0",                  # '
        b"x7cx82",              # (
        b"x82x7c",              # )
        b"x10x7cx38x7cx10",  # *
        b"x10x10x7cx10x10",  # +
        b"x06x07",              # ,
        b"x10x10x10x10",      # -
        b"x06x06",              # .
        b"x04x08x10x20x40",  # /
        b"x7cx8ax92xa2x7c",  # 0 - Ascii 48
        b"x42xfex02",          # 1
        b"x46x8ax92x92x62",  # 2
        b"x44x92x92x92x6c",  # 3
        b"x18x28x48xfex08",  # 4
        b"xf4x92x92x92x8c",  # 5
        b"x3cx52x92x92x8c",  # 6
        b"x80x8ex90xa0xc0",  # 7
        b"x6cx92x92x92x6c",  # 8
        b"x60x92x92x94x78",  # 9
        b"x36x36",              # : - Ascii 58
        b"x36x37",              #
        b"x10x28x44x82",      # <
        b"x24x24x24x24x24",  # =
        b"x82x44x28x10",      # >
        b"x60x80x9ax90x60",  # ?
        b"x7cx82xbaxaax78",  # @
        b"x7ex90x90x90x7e",  # A - Ascii 65
        b"xfex92x92x92x6c",  # B
        b"x7cx82x82x82x44",  # C
        b"xfex82x82x82x7c",  # D
        b"xfex92x92x92x82",  # E
        b"xfex90x90x90x80",  # F
        b"x7cx82x92x92x5c",  # G
        b"xfex10x10x10xfe",  # H
        b"x82xfex82",          # I
        b"x0cx02x02x02xfc",  # J
        b"xfex10x28x44x82",  # K
        b"xfex02x02x02",      # L
        b"xfex40x20x40xfe",  # M
        b"xfex40x20x10xfe",  # N
        b"x7cx82x82x82x7c",  # O
        b"xfex90x90x90x60",  # P
        b"x7cx82x92x8cx7a",  # Q
        b"xfex90x90x98x66",  # R
        b"x64x92x92x92x4c",  # S
        b"x80x80xfex80x80",  # T
        b"xfcx02x02x02xfc",  # U
        b"xf8x04x02x04xf8",  # V
        b"xfcx02x3cx02xfc",  # W
        b"xc6x28x10x28xc6",  # X
        b"xe0x10x0ex10xe0",  # Y
        b"x86x8ax92xa2xc2",  # Z - Ascii 90
        b"xfex82x82",          # [
        b"x40x20x10x08x04",  # 
        b"x82x82xfe",          # ]
        b"x20x40x80x40x20",  # ^
        b"x02x02x02x02x02",  # _
        b"xc0xe0",              # '
        b"x04x2ax2ax1e",      # a - Ascii 97
        b"xfex22x22x1c",      # b
        b"x1cx22x22x22",      # c
        b"x1cx22x22xfc",      # d
        b"x1cx2ax2ax10",      # e
        b"x10x7ex90x80",      # f
        b"x18x25x25x3e",      # g
        b"xfex20x20x1e",      # h
        b"xbcx02",              # i
        b"x02x01x21xbe",      # j
        b"xfex08x14x22",      # k
        b"xfcx02",              # l
        b"x3ex20x18x20x1e",  # m
        b"x3ex20x20 x1e",     # n
        b"x1cx22x22x1c",      # o
        b"x3fx22x22x1c",      # p
        b"x1cx22x22x3f",      # q
        b"x22x1ex20x10",      # r
        b"x12x2ax2ax04",      # s
        b"x20x7cx22x04",      # t
        b"x3cx02x02x3e",      # u
        b"x38x04x02x04x38",  # v
        b"x3cx06x0cx06x3c",  # w
        b"x22x14x08x14x22",  # x
        b"x39x05x06x3c",      # y
        b"x26x2ax2ax32",      # z - Ascii 122
        b"x10x7cx82x82",      #
        b"xee",                  # |
        b"x82x82x7cx10",      #
        b"x40x80x40x80",      # ~
        b"x60x90x90x60"       # Degrees sign - Ascii 127
    ]

    # ********** PRIVATE PROPERTIES **********

    width = 8
    height = 8
    def_chars = None
    rotation_angle = 0
    is_rotated = False
    is_inverse = False

    # *********** CONSTRUCTOR **********

    def __init__(self, i2c, i2c_address=0x70):
        self.buffer = bytearray(self.width)
        self.def_chars = []
        for i in range(32): self.def_chars.append(b"x00")
        super(HT16K33Matrix, self).__init__(i2c, i2c_address)

    # *********** PUBLIC METHODS **********

    def set_angle(self, angle=0):
        """
        Set the matrix orientation.
        Args:
            angle (integer) Display auto-rotation angle, 0 to -360 degrees. Default: 0
        Returns:
            The instance (self)
        """
        # Bring the supplied angle to with 0-360 degrees
        if angle > 360:
            while angle > 360:
                angle -= 360

        if angle < 0:
            while angle < 360:
                angle += 360

        # Convert angle to internal value:
        # 0 = none, 1 = 90 clockwise, 2 = 180, 3 = 90 anti-clockwise
        if angle > 3:
            if angle < 45 or angle > 360: angle = 0
            if angle >= 45 and angle < 135: angle = 1
            if angle >= 135 and angle < 225: angle = 2
            if angle >= 225: angle = 3

        self.rotation_angle = angle
        self.is_rotated = True if self.rotation_angle != 0 else False
        return self

    def set_inverse(self):
        """
        Inverts the ink colour of the display.
        Returns:
            The instance (self)
        """
        self.is_inverse = not self.is_inverse
        for i in range(self.width):
            self.buffer[i] = (~ self.buffer[i]) & 0xFF
        return self

    def set_icon(self, glyph, centre=False):
        """
        Displays a custom character on the matrix.
        Args:
            glyph (array) 1-8 8-bit values defining a pixel image. The data is passed as columns
                          0 through 7, left to right. Bit 0 is at the bottom, bit 7 at the top
            centre (bool) Whether the icon should be displayed centred on the screen. Default: False
        Returns:
            The instance (self)
        """
        length = len(glyph)
        assert 0 < length <= self.width, "ERROR - Invalid glyph set in set_icon()"
        for i in range(length):
            a = i
            if centre: a = i + ((8 - length) >> 1)
            self.buffer[a] = glyph[i] if self.is_inverse is False else ((~ glyph[i]) & 0xFF)
        return self

    def set_character(self, ascii_value=32, centre=False):
        """
        Display a single character specified by its Ascii value on the matrix.
        Args:
            ascii_value (integer) Character Ascii code. Default: 32 (space)
            centre (bool)         Whether the icon should be displayed centred on the screen. Default: False
        Returns:
            The instance (self)
        """
        assert 0 <= ascii_value < 128, "ERROR - Invalid ascii code set in set_character()"
        glyph = None
        if ascii_value < 32:
            # A user-definable character has been chosen
            glyph = self.def_chars[ascii_value]
        else:
            # A standard character has been chosen
            ascii_value -= 32
            if ascii_value < 0 or ascii_value >= len(self.CHARSET): ascii_value = 0
            glyph = self.CHARSET[ascii_value]
        return self.set_icon(glyph, centre)

    def scroll_text(self, the_line, speed=0.1):
        """
        Scroll the specified line of text leftwards across the display.
        Args:
            the_line (string) The string to display
            speed (float)     The delay between frames
        Returns:
            The instance (self)
        """
        import time

        assert len(the_line) > 0, "ERROR - Invalid string set in scroll_text()"

        # Calculate the source buffer size
        length = 0
        for i in range(0, len(the_line)):
            asc_val = ord(the_line[i])
            if asc_val < 32:
                glyph = self.def_chars[asc_val]
            else:
                glyph = self.CHARSET[asc_val - 32]
            length += len(glyph)
            if asc_val > 32: length += 1
        src_buffer = bytearray(length)

        # Draw the string to the source buffer
        row = 0
        for i in range(0, len(the_line)):
            asc_val = ord(the_line[i])
            if asc_val < 32:
                glyph = self.def_chars[asc_val]
            else:
                glyph = self.CHARSET[asc_val - 32]
            for j in range(0, len(glyph)):
                src_buffer[row] = glyph[j] if self.is_inverse is False else ((~ glyph[j]) & 0xFF)
                row += 1
            if asc_val > 32: row += 1
        assert row == length, "ERROR - Mismatched lengths in scroll_text()"

        # Finally, animate the line
        cursor = 0
        while True:
            a = cursor
            for i in range(0, self.width):
                self.buffer[i] = src_buffer[a];
                a += 1
            self.draw()
            cursor += 1
            if cursor > length - self.width: break
            time.sleep(speed)

    def define_character(self, glyph, char_code=0):
        """
        Set a user-definable character for later use.
        Args:
            glyph (bytearray)   1-8 8-bit values defining a pixel image. The data is passed as columns,
                                with bit 0 at the bottom and bit 7 at the top
            char_code (integer) Character's ID Ascii code 0-31. Default: 0
        Returns:
            The instance (self)
        """
        assert 0 < len(glyph) <= self.width, "ERROR - Invalid glyph set in define_character()"
        assert 0 <= char_code < 32, "ERROR - Invalid character code set in define_character()"
        self.def_chars[char_code] = glyph
        return self

    def plot(self, x, y, ink=1, xor=False):
        """
        Plot a point on the matrix. (0,0) is bottom left as viewed.
        Args:
            x (integer)   X co-ordinate (0 - 7) left to right
            y (integer)   Y co-ordinate (0 - 7) bottom to top
            ink (integer) Pixel color: 1 = 'white', 0 = black. NOTE inverse video mode reverses this. Default: 1
            xor (bool)    Whether an underlying pixel already of color ink should be inverted. Default: False
        Returns:
            The instance (self)
        """
        # Check argument range and value
        assert (0 <= x < self.width) and (0 <= y < self.height), "ERROR - Invalid coordinate set in plot()"
        if ink not in (0, 1): ink = 1
        if ink == 1:
            if self.is_set(x ,y) and xor:
                self.buffer[x] ^= (1 << y)
            else:
                if self.buffer[x] & (1 << y) == 0: self.buffer[x] |= (1 << y)
        else:
            if not self.is_set(x ,y) and xor:
                self.buffer[x] ^= (1 << y)
            else:
                if self.buffer[x] & (1 << y) != 0: self.buffer[x] &= ~(1 << y)
        return self

    def is_set(self, x, y):
        """
        Indicate whether a pixel is set.
        Args:
            x (int) X co-ordinate left to right
            y (int) Y co-ordinate bottom to top
        Returns:
            Whether the pixel is set (True) or not (False)
        """
        assert (0 <= x < self.width) and (0 <= y < self.height), "ERROR - Invalid coordinate set in is_set()"
        bit = (self.buffer[x] >> y) & 1
        return True if bit > 0 else False

    def draw(self):
        """
        Takes the contents of _buffer and writes it to the LED matrix.
        NOTE Overrides the parent method.
        """
        if self.is_rotated:
            new_buffer = self._rotate_matrix(self.buffer, self.rotation_angle)
        else:
            new_buffer = bytearray(len(self.buffer))
            for i in range(8): new_buffer[i] = self.buffer[i]
        draw_buffer = bytearray(17)
        for i in range(len(new_buffer)):
            draw_buffer[i * 2 + 1] = (new_buffer[i] >> 1) | ((new_buffer[i] << 7) & 0xFF)
        self.i2c.writeto(self.address, bytes(draw_buffer))

    # ********** PRIVATE METHODS **********

    def _rotate_matrix(self, input_matrix, angle=0):
        """
        Rotate an 8-integer matrix through the specified angle in 90-degree increments:
           0 = none, 1 = 90 clockwise, 2 = 180, 3 = 90 anti-clockwise
        """
        assert angle in (0, 1, 2, 3), "ERROR - Invalid angle in _rotate_matrix()"
        if angle is 0: return input_matrix

        a = 0
        line_value = 0
        output_matrix = bytearray(self.width)

        # NOTE It's quicker to have three case-specific
        #      code blocks than a single, generic block
        for y in range(self.height):
            line_value = input_matrix[y]
            for x in range(7, -1, -1):
                a = line_value & (1 << x)
                if a is not 0:
                    if angle is 1:
                        output_matrix[7 - x] = output_matrix[7 - x] + (1 << y)
                    elif angle is 2:
                        output_matrix[7 - y] += (1 << (7 - x))
                    else:
                        output_matrix[x] = output_matrix[x] + (1 << (7 - y))
        return output_matrix

    def _fill(value=0xFF):
        """
        Fill the buffer, column by column with the specified byte value
        """
        value &= 0xFF
        for i in range(self.width): self.buffer[i] = value

```

## **References And Credits**

1. Tony Smith:
<https://github.com/smittytone/HT16K33-Python>

2. Gorillacell:
[gorillacell.kr](http://gorillacell.kr/)

