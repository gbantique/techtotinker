---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-09-26T13:18:00+08:00'
excerpt: In this article, I will demonstrate how to use an RFID module such as the MFRC522 with ESP32 using MicroPython programming language.
tags:
  - ESP32 RFID
  - ESP8266
  - How to use MFRC522 in MicroPython
  - MFRC522 MicroPython
  - MicroPython RFID
  - micropython tutorial
series:
  - ESP32 MicroPython
title: '026 - ESP32 MicroPython: MFRC522 RFID Module'
url: /2021/09/26/026-esp32-micropython-mfrc522-rfid-module/
---

## **Introduction**

![](/images/MFRC522-2BRFID.png)

In this article, I will demonstrate how to use an RFID module such as the MFRC522 with ESP32 using MicroPython programming language.

## **Bill Of Materials**

For this lesson, you will need:
1. An ESP32 development board.
2. An MFRC522 RFID module kit (RFID reader/write, RFID plastic card, RFID key fobs).
3. A 16×2 LCD with I2C interface module.
4. A red LED.
5. A green LED.
6. A breadboard.
7. And some jumper wires.

## **Circuit Diagram**

![](/images/026_ESP32_MicroPython_RFID_Circuit_Diagram.png)

## **Hardware Instruction**

1. I connected the RC522 VCC pin or pin # 1 to ESP32 3.3V pin using the red wire.
2. Its RST pin or pin # 2 to ESP32 GPIO4 pin using the white wire.
3. Its GND pin or pin # 3 to ESP32 GND pin using the brown wire.
4. Its IRQ pin or pin # 4 is left unconnected. We will just leaved it not connected and only used a polling method for simplicity.
5. Its MISO pin or pin # 5 to ESP32 GPIO 19 pin using the blue wire.
6. Its MOSI pin or pin # 6 to ESP32 GPIO 23 pin using the orange wire.
7. Its SCK pin or pin # 7 to ESP32 GPIO 18 pin using the yellow wire.
8. And lastly, its CS pin or pin # 8 to ESP32 GPIO 5 pin using the green wire.
9. Now for the I2C LCD module, I connected the GND pin to ESP32 GND pin using the brown wire.
10. Its VCC pin to ESP32 3.3V pin using the red wire.
11. Its SDA pin to ESP32 GPIO 22 pin using the yellow wire.
12. Its SCL pin to ESP32 GPIO 21 pin using the orange wire.
13. I connected the green LED to GPIO 13 and the red LED to GPIO 14.

## **Video Demonstration**

{{< youtube KufRt3p9tCI >}}

## **Call To Action**

If you have any concern regarding this article, write your message in the comment box.

You might also like to support my journey on Youtube by Subscribing. Click this to Subscribe to TechToTinker Youtube channel.

Thank you and I wish you good health.

Regards,
    – George Bantique | tech.to.tinker@gmail.com

## **Source Code**

### 1. Example # 1, exploring the basics:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from mfrc522 import MFRC522
from machine import Pin
from machine import SPI

spi = SPI(2, baudrate=2500000, polarity=0, phase=0)
# Using Hardware SPI pins:
#     sck=18   # yellow
#     mosi=23  # orange
#     miso=19  # blue
#     rst=4    # white
#     cs=5     # green, DS
# *************************
# To use SoftSPI,
# from machine import SOftSPI
# spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=mosi, miso=miso)
spi.init()
rdr = MFRC522(spi=spi, gpioRst=4, gpioCs=5)
print("Place card")

while True:
    
    (stat, tag_type) = rdr.request(rdr.REQIDL)
    if stat == rdr.OK:
        (stat, raw_uid) = rdr.anticoll()
        if stat == rdr.OK:
            card_id = "uid: 0x%02x%02x%02x%02x" % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3])
            print(card_id)

```

### 2. Example # 2, door security application:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from mfrc522 import MFRC522
from i2c_lcd import I2cLcd
from machine import Pin
from machine import SoftI2C
from machine import SPI

DEFAULT_I2C_ADDR = 0x20
i2c = SoftI2C(scl=Pin(22, Pin.OUT, Pin.PULL_UP),
              sda=Pin(21, Pin.OUT, Pin.PULL_UP),
              freq=400000) 
lcd = I2cLcd(i2c, DEFAULT_I2C_ADDR, 2, 16)

red = Pin(14, Pin.OUT)
grn = Pin(13, Pin.OUT)

spi = SPI(2, baudrate=2500000, polarity=0, phase=0)
# Using Hardware SPI pins:
#     sck=18   # yellow
#     mosi=23  # orange
#     miso=19  # blue
#     rst=4    # white
#     cs=5     # green, DS
# *************************
# To use SoftSPI,
# from machine import SOftSPI
# spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=mosi, miso=miso)
spi.init()
rdr = MFRC522(spi=spi, gpioRst=4, gpioCs=5)

print("Place card")

lcd.clear()
lcd.move_to(0, 0)
lcd.putstr("Scan RFID")

while True:
    (stat, tag_type) = rdr.request(rdr.REQIDL)
    if stat == rdr.OK:
        (stat, raw_uid) = rdr.anticoll()
        if stat == rdr.OK:
            lcd.clear()
            lcd.move_to(0, 0)
            lcd.putstr("RFID: ")
            
            card_id = "0x%02x%02x%02x%02x" %(raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3])
            print("UID:", card_id)
            
            lcd.move_to(0, 1)
            if card_id == "0x57c07f5a":
                grn.value(True)
                red.value(False)
                lcd.putstr(" Access Granted ")
            else:
                grn.value(False)
                red.value(True)
                lcd.putstr(" Access Denied! ")

```

### 3. Example # 3, attendance system application:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from mfrc522 import MFRC522
from i2c_lcd import I2cLcd
from machine import Pin
from machine import SoftI2C
from machine import SPI

DEFAULT_I2C_ADDR = 0x20
i2c = SoftI2C(scl=Pin(22, Pin.OUT, Pin.PULL_UP),
              sda=Pin(21, Pin.OUT, Pin.PULL_UP),
              freq=400000) 
lcd = I2cLcd(i2c, DEFAULT_I2C_ADDR, 2, 16)

red = Pin(14, Pin.OUT)
grn = Pin(13, Pin.OUT)

spi = SPI(2, baudrate=2500000, polarity=0, phase=0)
# Using Hardware SPI pins:
#     sck=18   # yellow
#     mosi=23  # orange
#     miso=19  # blue
#     rst=4    # white
#     cs=5     # green, DS
# *************************
# To use SoftSPI,
# from machine import SOftSPI
# spi = SoftSPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=mosi, miso=miso)
spi.init()
rdr = MFRC522(spi=spi, gpioRst=4, gpioCs=5)

rfid_name = ["Teacher1",
             "Teacher2",
             "Student1",
             "Student2",
             "Student3"]
rfid_uid = ["0xc97be5a2",
            "0xe7458e7a",
            "0x2907b498",
            "0x29eec498",
            "0x59e1f097"]

def get_username(uid):
    index = 0
    try:
        index = rfid_uid.index(uid)
        return rfid_name[index]
    except:
        index = -1
        print("RFID is not recognized")
        return 0

print("Place card")

lcd.clear()
lcd.move_to(0, 0)
lcd.putstr("Scan RFID")

while True:
    (stat, tag_type) = rdr.request(rdr.REQIDL)
    if stat == rdr.OK:
        (stat, raw_uid) = rdr.anticoll()
        if stat == rdr.OK:
            lcd.clear()
            lcd.move_to(0, 0)
            lcd.putstr("RFID: ")
            
            card_id = "0x%02x%02x%02x%02x" %(raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3])
            print("UID:", card_id)
            lcd.putstr(card_id)

            username = get_username(card_id)
            lcd.move_to(0, 1)
            if username != 0:
                grn.value(True)
                red.value(False)
                lcd.putstr("Welcome {}".format(username))
            else:
                grn.value(False)
                red.value(True)
                lcd.putstr(" Access Denied! ")

```

### 4. mfrc522.py RFID driver library:

```py { lineNos="true" wrap="true" }
# https://github.com/cefn/micropython-mfrc522/blob/master/mfrc522.py

from machine import Pin, SPI
from os import uname

emptyRecv = b""

class MFRC522:

    GAIN_REG = 0x26
    MAX_GAIN = 0x07

    OK = 0
    NOTAGERR = 1
    ERR = 2

    REQIDL = 0x26
    REQALL = 0x52
    AUTHENT1A = 0x60
    AUTHENT1B = 0x61

    def __init__(self, spi=None, gpioRst=None, gpioCs=None):

        if gpioRst is not None:
            self.rst = Pin(gpioRst, Pin.OUT)
        else:
            self.rst = None
        assert(gpioCs is not None, "Needs gpioCs") # TODO fails without cableSelect
        if gpioCs is not None:
            self.cs = Pin(gpioCs, Pin.OUT)
        else:
            self.cs = None

        # TODO CH rationalise which of these are referenced, which can be identical
        self.regBuf = bytearray(4)
        self.blockWriteBuf = bytearray(18)
        self.authBuf = bytearray(12)
        self.wregBuf = bytearray(2)
        self.rregBuf = bytearray(1)
        self.recvBuf = bytearray(16)
        self.recvMv = memoryview(self.recvBuf)

        if self.rst is not None:
            self.rst.value(0)
        if self.cs is not None:
            self.cs.value(1)

        if spi is not None:
            self.spi = spi
        else:
            sck = Pin(14, Pin.OUT)
            mosi = Pin(13, Pin.OUT)
            miso = Pin(12, Pin.IN)
            if uname()[0] == 'WiPy':
                self.spi = SPI(0)
                self.spi.init(SPI.MASTER, baudrate=1000000, pins=(sck, mosi, miso))
            elif uname()[0] == 'esp8266': # TODO update to match https://github.com/cefn/avatap/blob/master/python/host/cockle.py #prepareHost()
                self.spi = SPI(baudrate=100000, polarity=0, phase=0, sck=sck, mosi=mosi, miso=miso)
                self.spi.init()
            else:
                raise RuntimeError("Unsupported platform")

        if self.rst is not None:
            self.rst.value(1)
        self.init()

    def _wreg(self, reg, val):
        if self.cs is not None:
            self.cs.value(0)
        buf = self.wregBuf
        buf[0]=0xff & ((reg << 1) & 0x7e)
        buf[1]=0xff & val
        self.spi.write(buf)
        if self.cs is not None:
            self.cs.value(1)

    def _rreg(self, reg):
        if self.cs is not None:
            self.cs.value(0)
        buf = self.rregBuf
        buf[0]=0xff & (((reg << 1) & 0x7e) | 0x80)
        self.spi.write(buf)
        val = self.spi.read(1)
        if self.cs is not None:
            self.cs.value(1)

        return val[0]

    def _sflags(self, reg, mask):
        self._wreg(reg, self._rreg(reg) | mask)

    def _cflags(self, reg, mask):
        self._wreg(reg, self._rreg(reg) & (~mask))

    def _tocard(self, cmd, send, into=None):

        recv = emptyRecv
        bits = irq_en = wait_irq = n = 0
        stat = self.ERR

        if cmd == 0x0E:
            irq_en = 0x12
            wait_irq = 0x10
        elif cmd == 0x0C:
            irq_en = 0x77
            wait_irq = 0x30

        self._wreg(0x02, irq_en | 0x80)
        self._cflags(0x04, 0x80)
        self._sflags(0x0A, 0x80)
        self._wreg(0x01, 0x00)

        for c in send:
            self._wreg(0x09, c)
        self._wreg(0x01, cmd)

        if cmd == 0x0C:
            self._sflags(0x0D, 0x80)

        i = 2000
        while True:
            n = self._rreg(0x04)
            i -= 1
            if ~((i != 0) and ~(n & 0x01) and ~(n & wait_irq)):
                break

        self._cflags(0x0D, 0x80)

        if i:
            if (self._rreg(0x06) & 0x1B) == 0x00:
                stat = self.OK

                if n & irq_en & 0x01:
                    stat = self.NOTAGERR
                elif cmd == 0x0C:
                    n = self._rreg(0x0A)
                    lbits = self._rreg(0x0C) & 0x07
                    if lbits != 0:
                        bits = (n - 1) * 8 + lbits
                    else:
                        bits = n * 8

                    if n == 0:
                        n = 1
                    elif n > 16:
                        n = 16

                    if into is None:
                        recv = self.recvBuf
                    else:
                        recv = into
                    pos = 0
                    while pos < n:
                        recv[pos] = self._rreg(0x09)
                        pos += 1
                    if into is None:
                        recv = self.recvMv[:n]
                    else:
                        recv = into

            else:
                stat = self.ERR

        return stat, recv, bits

    def _assign_crc(self, data, count):

        self._cflags(0x05, 0x04)
        self._sflags(0x0A, 0x80)

        dataPos = 0
        while dataPos < count:
            self._wreg(0x09, data[dataPos])
            dataPos += 1

        self._wreg(0x01, 0x03)

        i = 0xFF
        while True:
            n = self._rreg(0x05)
            i -= 1
            if not ((i != 0) and not (n & 0x04)):
                break

        data[count] = self._rreg(0x22)
        data[count + 1] = self._rreg(0x21)

    def init(self):

        self.reset()
        self._wreg(0x2A, 0x8D)
        self._wreg(0x2B, 0x3E)
        self._wreg(0x2D, 30)
        self._wreg(0x2C, 0)
        self._wreg(0x15, 0x40)
        self._wreg(0x11, 0x3D)
        self.set_gain(self.MAX_GAIN)
        self.antenna_on()


    def reset(self):
        self._wreg(0x01, 0x0F)

    def antenna_on(self, on=True):

        if on and ~(self._rreg(0x14) & 0x03):
            self._sflags(0x14, 0x03)
        else:
            self._cflags(0x14, 0x03)

    def request(self, mode):

        self._wreg(0x0D, 0x07)
        (stat, recv, bits) = self._tocard(0x0C, [mode])

        if (stat != self.OK) | (bits != 0x10):
            stat = self.ERR

        return stat, bits

    def anticoll(self):

        ser_chk = 0
        ser = [0x93, 0x20]

        self._wreg(0x0D, 0x00)
        (stat, recv, bits) = self._tocard(0x0C, ser)

        if stat == self.OK:
            if len(recv) == 5:
                for i in range(4):
                    ser_chk = ser_chk ^ recv[i]
                if ser_chk != recv[4]:
                    stat = self.ERR
            else:
                stat = self.ERR

        # CH Note bytearray allocation here
        return stat, bytearray(recv)

    def select_tag(self, ser):
        # TODO CH normalise all list manipulation to bytearray, avoid below allocation
        buf = bytearray(9)
        buf[0] = 0x93
        buf[1] = 0x70
        buf[2:7] = ser
        self._assign_crc(buf, 7)
        (stat, recv, bits) = self._tocard(0x0C, buf)
        return self.OK if (stat == self.OK) and (bits == 0x18) else self.ERR

    def auth(self, mode, addr, sect, ser):
        # TODO CH void ser[:4] implicit list allocation
        buf = self.authBuf
        buf[0]=mode # A or B
        buf[1]=addr # block
        buf[2:8]=sect # key bytes
        buf[8:12]=ser[:4] # 4 bytes of id
        return self._tocard(0x0E, buf)[0]

    # TODO this may well need to be implemented for vault to properly back out from a card session
    # TODO how, why, when is 'HaltA' needed? see https://github.com/cefn/micropython-mfrc522/issues/1
    def halt_a(self):
        pass

    def stop_crypto1(self):
        self._cflags(0x08, 0x08)

    def set_gain(self, gain):
        assert gain <= self.MAX_GAIN
        # clear bits
        self._cflags(self.GAIN_REG, 0x07<< 4)
        # set bits according to gain
        self._sflags(self.GAIN_REG, gain << 4)

    def read(self, addr, into = None):
        buf = self.regBuf
        buf[0]=0x30
        buf[1]=addr
        self._assign_crc(buf, 2)
        (stat, recv, _) = self._tocard(0x0C, buf, into=into)
        # TODO this logic probably wrong (should be 'into is None'?)
        if into is None: # superstitiously avoid returning read buffer memoryview
            # CH Note bytearray allocation here
            recv = bytearray(recv)
        return recv if stat == self.OK else None

    def write(self, addr, data):
        buf = self.regBuf
        buf[0] = 0xA0
        buf[1] = addr
        self._assign_crc(buf, 2)
        (stat, recv, bits) = self._tocard(0x0C, buf)

        if not (stat == self.OK) or not (bits == 4) or not ((recv[0] & 0x0F) == 0x0A):
            stat = self.ERR
        else:
            buf = self.blockWriteBuf

            i = 0
            while i < 16:
                buf[i] = data[i]  # TODO CH eliminate this, accelerate it?
                i += 1

            self._assign_crc(buf, 16)
            (stat, recv, bits) = self._tocard(0x0C, buf)
            if not (stat == self.OK) or not (bits == 4) or not ((recv[0] & 0x0F) == 0x0A):
                stat = self.ERR

        return stat

```

### 5. lcd\_api.py LCD driver base library:

```py { lineNos="true" wrap="true" }
"""Provides an API for talking to HD44780 compatible character LCDs.""" 
import time 
class LcdApi: 
    """Implements the API for talking with HD44780 compatible character LCDs. 
    This class only knows what commands to send to the LCD, and not how to get 
    them to the LCD. 
    It is expected that a derived class will implement the hal_xxx functions. 
    """ 
    # The following constant names were lifted from the avrlib lcd.h 
    # header file, however, I changed the definitions from bit numbers 
    # to bit masks. 
    # 
    # HD44780 LCD controller command set 
    LCD_CLR = 0x01              # DB0: clear display 
    LCD_HOME = 0x02             # DB1: return to home position 
    LCD_ENTRY_MODE = 0x04       # DB2: set entry mode 
    LCD_ENTRY_INC = 0x02        # --DB1: increment 
    LCD_ENTRY_SHIFT = 0x01      # --DB0: shift 
    LCD_ON_CTRL = 0x08          # DB3: turn lcd/cursor on 
    LCD_ON_DISPLAY = 0x04       # --DB2: turn display on 
    LCD_ON_CURSOR = 0x02        # --DB1: turn cursor on 
    LCD_ON_BLINK = 0x01         # --DB0: blinking cursor 
    LCD_MOVE = 0x10             # DB4: move cursor/display 
    LCD_MOVE_DISP = 0x08        # --DB3: move display (0-> move cursor) 
    LCD_MOVE_RIGHT = 0x04       # --DB2: move right (0-> left) 
    LCD_FUNCTION = 0x20         # DB5: function set 
    LCD_FUNCTION_8BIT = 0x10    # --DB4: set 8BIT mode (0->4BIT mode) 
    LCD_FUNCTION_2LINES = 0x08  # --DB3: two lines (0->one line) 
    LCD_FUNCTION_10DOTS = 0x04  # --DB2: 5x10 font (0->5x7 font) 
    LCD_FUNCTION_RESET = 0x30   # See "Initializing by Instruction" section 
    LCD_CGRAM = 0x40            # DB6: set CG RAM address 
    LCD_DDRAM = 0x80            # DB7: set DD RAM address 
    LCD_RS_CMD = 0 
    LCD_RS_DATA = 1 
    LCD_RW_WRITE = 0 
    LCD_RW_READ = 1 
    def __init__(self, num_lines, num_columns): 
        self.num_lines = num_lines 
        if self.num_lines > 4: 
            self.num_lines = 4 
        self.num_columns = num_columns 
        if self.num_columns > 40: 
            self.num_columns = 40 
        self.cursor_x = 0 
        self.cursor_y = 0 
        self.implied_newline = False 
        self.backlight = True 
        self.display_off() 
        self.backlight_on() 
        self.clear() 
        self.hal_write_command(self.LCD_ENTRY_MODE | self.LCD_ENTRY_INC) 
        self.hide_cursor() 
        self.display_on() 
    def clear(self): 
        """Clears the LCD display and moves the cursor to the top left 
        corner. 
        """ 
        self.hal_write_command(self.LCD_CLR) 
        self.hal_write_command(self.LCD_HOME) 
        self.cursor_x = 0 
        self.cursor_y = 0 
    def show_cursor(self): 
        """Causes the cursor to be made visible.""" 
        self.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY | 
                               self.LCD_ON_CURSOR) 
    def hide_cursor(self): 
        """Causes the cursor to be hidden.""" 
        self.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY) 
    def blink_cursor_on(self): 
        """Turns on the cursor, and makes it blink.""" 
        self.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY | 
                               self.LCD_ON_CURSOR | self.LCD_ON_BLINK) 
    def blink_cursor_off(self): 
        """Turns on the cursor, and makes it no blink (i.e. be solid).""" 
        self.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY | 
                               self.LCD_ON_CURSOR) 
    def display_on(self): 
        """Turns on (i.e. unblanks) the LCD.""" 
        self.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY) 
    def display_off(self): 
        """Turns off (i.e. blanks) the LCD.""" 
        self.hal_write_command(self.LCD_ON_CTRL) 
    def backlight_on(self): 
        """Turns the backlight on. 
        This isn't really an LCD command, but some modules have backlight 
        controls, so this allows the hal to pass through the command. 
        """ 
        self.backlight = True 
        self.hal_backlight_on() 
    def backlight_off(self): 
        """Turns the backlight off. 
        This isn't really an LCD command, but some modules have backlight 
        controls, so this allows the hal to pass through the command. 
        """ 
        self.backlight = False 
        self.hal_backlight_off() 
    def move_to(self, cursor_x, cursor_y): 
        """Moves the cursor position to the indicated position. The cursor 
        position is zero based (i.e. cursor_x == 0 indicates first column). 
        """ 
        self.cursor_x = cursor_x 
        self.cursor_y = cursor_y 
        addr = cursor_x & 0x3f 
        if cursor_y & 1: 
            addr += 0x40    # Lines 1 & 3 add 0x40 
        if cursor_y & 2:    # Lines 2 & 3 add number of columns 
            addr += self.num_columns 
        self.hal_write_command(self.LCD_DDRAM | addr) 
    def putchar(self, char): 
        """Writes the indicated character to the LCD at the current cursor 
        position, and advances the cursor by one position. 
        """ 
        if char == 'n': 
            if self.implied_newline: 
                # self.implied_newline means we advanced due to a wraparound, 
                # so if we get a newline right after that we ignore it. 
                pass 
            else: 
                self.cursor_x = self.num_columns 
        else: 
            self.hal_write_data(ord(char)) 
            self.cursor_x += 1 
        if self.cursor_x >= self.num_columns: 
            self.cursor_x = 0 
            self.cursor_y += 1 
            self.implied_newline = (char != 'n') 
        if self.cursor_y >= self.num_lines: 
            self.cursor_y = 0 
        self.move_to(self.cursor_x, self.cursor_y) 
    def putstr(self, string): 
        """Write the indicated string to the LCD at the current cursor 
        position and advances the cursor position appropriately. 
        """ 
        for char in string: 
            self.putchar(char) 
    def custom_char(self, location, charmap): 
        """Write a character to one of the 8 CGRAM locations, available 
        as chr(0) through chr(7). 
        """ 
        location &= 0x7 
        self.hal_write_command(self.LCD_CGRAM | (location << 3)) 
        self.hal_sleep_us(40) 
        for i in range(8): 
            self.hal_write_data(charmap[i]) 
            self.hal_sleep_us(40) 
        self.move_to(self.cursor_x, self.cursor_y)
        
    def hal_backlight_on(self): 
        """Allows the hal layer to turn the backlight on. 
        If desired, a derived HAL class will implement this function. 
        """ 
        pass 
    def hal_backlight_off(self): 
        """Allows the hal layer to turn the backlight off. 
        If desired, a derived HAL class will implement this function. 
        """ 
        pass 
    def hal_write_command(self, cmd): 
        """Write a command to the LCD. 
        It is expected that a derived HAL class will implement this 
        function. 
        """ 
        raise NotImplementedError 
    def hal_write_data(self, data): 
        """Write data to the LCD. 
        It is expected that a derived HAL class will implement this 
        function. 
        """ 
        raise NotImplementedError 
    def hal_sleep_us(self, usecs): 
        """Sleep for some time (given in microseconds).""" 
        time.sleep_us(usecs)

```

### 6. i2c\_lcd.py LCD driver library for I2C:

```py { lineNos="true" wrap="true" }
"""Implements a HD44780 character LCD connected via PCF8574 on I2C. 
   This was tested with: https://www.wemos.cc/product/d1-mini.html""" 
from lcd_api import LcdApi 
from machine import I2C 
from time import sleep_ms 
# The PCF8574 has a jumper selectable address: 0x20 - 0x27 
#DEFAULT_I2C_ADDR = 0x20 
# Defines shifts or masks for the various LCD line attached to the PCF8574 
MASK_RS = 0x01 
MASK_RW = 0x02 
MASK_E = 0x04 
SHIFT_BACKLIGHT = 3 
SHIFT_DATA = 4 
class I2cLcd(LcdApi): 
    """Implements a HD44780 character LCD connected via PCF8574 on I2C.""" 
    def __init__(self, i2c, i2c_addr, num_lines, num_columns): 
        self.i2c = i2c 
        self.i2c_addr = i2c_addr 
        self.i2c.writeto(self.i2c_addr, bytearray([0])) 
        sleep_ms(20)   # Allow LCD time to powerup 
        # Send reset 3 times 
        self.hal_write_init_nibble(self.LCD_FUNCTION_RESET) 
        sleep_ms(5)    # need to delay at least 4.1 msec 
        self.hal_write_init_nibble(self.LCD_FUNCTION_RESET) 
        sleep_ms(1) 
        self.hal_write_init_nibble(self.LCD_FUNCTION_RESET) 
        sleep_ms(1) 
        # Put LCD into 4 bit mode 
        self.hal_write_init_nibble(self.LCD_FUNCTION) 
        sleep_ms(1) 
        LcdApi.__init__(self, num_lines, num_columns) 
        cmd = self.LCD_FUNCTION 
        if num_lines > 1: 
            cmd |= self.LCD_FUNCTION_2LINES 
        self.hal_write_command(cmd) 
    def hal_write_init_nibble(self, nibble): 
        """Writes an initialization nibble to the LCD. 
        This particular function is only used during initialization. 
        """ 
        byte = ((nibble >> 4) & 0x0f) << SHIFT_DATA 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
    def hal_backlight_on(self): 
        """Allows the hal layer to turn the backlight on.""" 
        self.i2c.writeto(self.i2c_addr, bytearray([1 << SHIFT_BACKLIGHT])) 
    def hal_backlight_off(self): 
        """Allows the hal layer to turn the backlight off.""" 
        self.i2c.writeto(self.i2c_addr, bytearray([0])) 
    def hal_write_command(self, cmd): 
        """Writes a command to the LCD. 
        Data is latched on the falling edge of E. 
        """ 
        byte = ((self.backlight << SHIFT_BACKLIGHT) | (((cmd >> 4) & 0x0f) << SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
        byte = ((self.backlight << SHIFT_BACKLIGHT) | ((cmd & 0x0f) << SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
        if cmd <= 3: 
            # The home and clear commands require a worst case delay of 4.1 msec 
            sleep_ms(5) 
    def hal_write_data(self, data): 
        """Write data to the LCD.""" 
        byte = (MASK_RS | (self.backlight << SHIFT_BACKLIGHT) | (((data >> 4) & 0x0f) << SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
        byte = (MASK_RS | (self.backlight << SHIFT_BACKLIGHT) | ((data & 0x0f) << SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte]))

```

## **References And Credits**

1. Cefn Hoile Github for MFRC522:
    <https://github.com/cefn/micropython-mfrc522>

2. Dave Hylands Github for I2C LCD:
    [https://github.com/dhylands/python\_lcd](https://github.com/dhylands/python_lcd)

