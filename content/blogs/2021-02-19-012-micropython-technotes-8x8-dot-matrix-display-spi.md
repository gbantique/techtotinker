---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-02-19T13:33:00+08:00'
excerpt: In this tutorial, we will learn on how to use an 8×8 Dot Matrix Display with SPI protocol as communication interface. For this tutorial, I will be using the 8x8 Dot Matrix Display module with SPI protocol from GorillaCell ESP32 development kit.
tags:
  - ESP32 8×8 dot matrix
  - esp32 micropython
  - How to use dot matrix display in MicroPython
  - MicroPython 8×8 dot matrix
  - micropython max7219
series:
  - MicroPython TechNotes
title: '012 - MicroPython TechNotes: 8x8 Dot Matrix Display (SPI)'
url: /2021/02/19/012-micropython-technotes-8x8-dot-matrix-display-spi/
---

## **Introduction**

![](/images/012-technotes-8x8-dot-matrix-spi-micropython.png)

In this tutorial, we will learn on how to use an 8×8 Dot Matrix Display with SPI protocol as communication interface. For this tutorial, I will be using the 8×8 Dot Matrix Display module with SPI protocol from GorillaCell ESP32 development kit.

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **DIN** – for the SPI serial data input.
4. **CLK** – for the SPI serial clock pin.
5. **CS** – for the SPI chip select pin.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield (optional).
3. 5-pin female-female dupont jumper wires.
4. 8×8 dot matrix display (SPI).

## **Hardware Instruction**

1. First, attach the ESP32 dev board on top the ESP32 shield making sure that both USB port is on the same side.
2. Next, attach the dupont wires to the 8×8 dot matrix display by following the a color coding which is black for the ground, red for the VCC, and etc.
3. Next, attach the other side of the dupont wires to the ESP32 shield with the following pin assignment which is black to the GND, red to the VCC, yellow to GPIO 23, white to GPIO 19, and blue to GPIO 18.
4. Next, power the ESP32 shield with an external power supply with a USB type-C connector and make sure that the power switch is slide to ON state.
5. Next, connect the ESP32 to the computer by connecting a micro-USB cable. Our demo circuit is now ready.

## **Software Instruction**

1. Copy the max7219.py and paste it to Thonny IDE.
2. Save it to ESP32 MicroPython device root directory by clicking the File menu and select Save As.
3. Give it a name as max7219.py and click Ok.
4. Play with your dot matrix display using the example # 1 and example # 2. Please feel free to modify it according to your needs. And if you have any concern, just send me a message by writing in the comment box provided.

## **Video Demonstration**

{{< youtube gfaz_nJ5gj8 >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics:

```py { lineNos="true" wrap="true" }
from machine import Pin, SPI
from max7219 import Max7219

spi = SPI(1,
          baudrate=10000000,
          polarity=1,
          phase=0,
          sck=Pin(19),
          mosi=Pin(23))
cs = Pin(18, Pin.OUT)
display = Max7219(8, 8, spi, cs, True)


# The following codes should be tested using the REPL:
# 1. To display a character:
display.text('A',0,0)
display.show()
# 2. To clear the display:
# display.fill(0)
# 3. To modify the default brightness:
# display.brightness(0)  # minimum brightness
display.brightness(15) # maximum brightness
# 4. To display a scrolling message:
# display.marquee('Hello world')
# ****************************************************
# Other graphic primitives:
# 5. To display a single pixel:
# display.pixel(x, y[, c])
# 6. To display a horizontal line:
# display.hline(x, y, w, col)
# 7. To display a vertical line:
# display.vline(x, y, h, col)
# 8. To display a line:
# display.line(x1, y1, x2, y2, col)
# 9. To display a rectangle:
# display.rect(x, y, w, h, col)
# 10. To display a filled rectangle:
# display.fill_rect(x, y, w, h, col)
# 11. To scroll the display:
# display.scroll(dx, dy)
# 12. To display custom character:
# display.blit(fbuf, x, y[, key])

```
## 2. Example # 2, count up then count down:

```py { lineNos="true" wrap="true" }
from machine import Pin, SPI
from max7219 import Max7219
from time import sleep_ms

spi = SPI(1,
          baudrate=10000000,
          polarity=1,
          phase=0,
          sck=Pin(19),
          mosi=Pin(23))
cs = Pin(18, Pin.OUT)
display = Max7219(8, 8, spi, cs, True)

counter = 0
isCountUp = True

while True:
    # count up
    if isCountUp:
        if counter < 9:
            counter += 1
            if counter == 9:
                isCountUp = False
    # count down
    else:
        if counter > 0:
            counter -= 1
            if counter == 0:
                isCountUp = True

    display.fill(0)
    display.text(str(counter),0,0)
    display.show()
    
    sleep_ms(500)

```

### 3. max7219.py dot matrix display library:

```py { lineNos="true" wrap="true" }
from machine import Pin, SPI
from micropython import const
import framebuf, utime

_DIGIT_0 = const(0x1)

_DECODE_MODE = const(0x9)
_NO_DECODE = const(0x0)

_INTENSITY = const(0xa)
_INTENSITY_MIN = const(0x0)

_SCAN_LIMIT = const(0xb)
_DISPLAY_ALL_DIGITS = const(0x7)

_SHUTDOWN = const(0xc)
_SHUTDOWN_MODE = const(0x0)
_NORMAL_OPERATION = const(0x1)

_DISPLAY_TEST = const(0xf)
_DISPLAY_TEST_NORMAL_OPERATION = const(0x0)

_MATRIX_SIZE = const(8)

# _SCROLL_SPEED_NORMAL is ms to delay (slow) scrolling text.
_SCROLL_SPEED_NORMAL = 100

class Max7219(framebuf.FrameBuffer):
    """
    Driver for MAX7219 8x8 LED matrices
    https://github.com/vrialland/micropython-max7219
    Example for ESP8266 with 2x4 matrices (one on top, one on bottom),
    so we have a 32x16 display area:
    >>> from machine import Pin, SPI
    >>> from max7219 import Max7219
    >>> spi = SPI(1, baudrate=10000000)
    >>> screen = Max7219(32, 16, spi, Pin(15))
    >>> screen.rect(0, 0, 32, 16, 1)  # Draws a frame
    >>> screen.text('Hi!', 4, 4, 1)
    >>> screen.show()
    On some matrices, the display is inverted (rotated 180°), in this case
     you can use `rotate_180=True` in the class constructor.
    """

    def __init__(self, width, height, spi, cs, rotate_180=False):
        # Pins setup
        self.spi = spi
        self.cs = cs
        self.cs.init(Pin.OUT, True)

        # Dimensions
        self.width = width
        self.height = height
        # Guess matrices disposition
        self.cols = width // _MATRIX_SIZE
        self.rows = height // _MATRIX_SIZE
        self.nb_matrices = self.cols * self.rows
        self.rotate_180 = rotate_180
        # 1 bit per pixel (on / off) -> 8 bytes per matrix
        self.buffer = bytearray(width * height // 8)
        format = framebuf.MONO_HLSB if not self.rotate_180 else framebuf.MONO_HMSB
        super().__init__(self.buffer, width, height, format)

        # Init display
        self.init_display()

    def _write_command(self, command, data):
        """Write command on SPI"""
        cmd = bytearray([command, data])
        self.cs(0)
        for matrix in range(self.nb_matrices):
            self.spi.write(cmd)
        self.cs(1)

    def init_display(self):
        """Init hardware"""
        for command, data in (
                (_SHUTDOWN, _SHUTDOWN_MODE),  # Prevent flash during init
                (_DECODE_MODE, _NO_DECODE),
                (_DISPLAY_TEST, _DISPLAY_TEST_NORMAL_OPERATION),
                (_INTENSITY, _INTENSITY_MIN),
                (_SCAN_LIMIT, _DISPLAY_ALL_DIGITS),
                (_SHUTDOWN, _NORMAL_OPERATION),  # Let's go
        ):
            self._write_command(command, data)

        self.fill(0)
        self.show()

    def brightness(self, value):
        # Set display brightness (0 to 15)
        if not 0 <= value < 16:
            raise ValueError('Brightness must be between 0 and 15')
        self._write_command(_INTENSITY, value)

    def marquee(self, message):
        start = 33
        extent = 0 - (len(message) * 8) - 32
        for i in range(start, extent, -1):
            self.fill(0)
            self.text(message, i, 0, 1)
            self.show()
            utime.sleep_ms(_SCROLL_SPEED_NORMAL)

    def show(self):
        """Update display"""
        # Write line per line on the matrices
        for line in range(8):
            self.cs(0)

            for matrix in range(self.nb_matrices):
                # Guess where the matrix is placed
                row, col = divmod(matrix, self.cols)
                # Compute where the data starts
                if not self.rotate_180:
                    offset = row * 8 * self.cols
                    index = col + line * self.cols + offset
                else:
                    offset = 8 * self.cols - row * (8 - line) * self.cols
                    index = (7 - line) * self.cols + col - offset

                self.spi.write(bytearray([_DIGIT_0 + line, self.buffer[index]]))

            self.cs(1)

```

## **References And Credits**

1. Purchase the kits at:
</div><div><https://gorillacell.kr>

2. MAX7219 Driver Library of Jeff Brown:
[https://github.com/jgbrown32/ESP8266\_MAX7219](https://github.com/jgbrown32/ESP8266_MAX7219)

