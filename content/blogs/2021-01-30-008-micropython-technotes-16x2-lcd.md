---
author: George Bantique
categories:
  - ESP32
  - GorillaCell
  - MicroPython
date: '2021-01-30T21:01:00+08:00'
excerpt: In this article, we will look at LCD. We will also learn on how to use it using the MicroPython language. LCD stands for Liquid Crystal Display. What I have is 16×2 LCD with Gorilla Cell LCD module which uses i2c protocol to simplify wiring connection.
tags:
  - 16×2 LCD
  - ESP32 LCD
  - esp32 micropython
  - ESP32 RGB
  - How to use LCD in MicroPython
  - LCD MicroPython
  - MicroPython LCD
series:
  - MicroPython TechNotes
title: '008 - MicroPython TechNotes: 16x2 LCD'
url: /2021/01/30/008-micropython-technotes-16x2-lcd/
---

## **Introduction**

![](/images/008-technotes-lcd-micropython.png)

In this article, we will look at LCD. We will also learn on how to use it using the MicroPython language. LCD stands for Liquid Crystal Display. What I have is 16×2 LCD with Gorilla Cell LCD module which uses i2c protocol to simplify wiring connection.

## **Pinout**

1. **GND** – for the ground pins.
2. **VCC** – for the supply voltage.
3. **SDA** – for the i2c serial data pin.
4. **SCL** – for the i2c serial clock pin.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorilla Cell ESP32 shield.
3. 4-pin female to female dupont jumper wires.
4. and of course the Gorilla Cell LCD module itself.

## **Hardware Instruction**

1. First attach the dupont jumper wires to the LCD module by following the color coding which is black for the ground, red for the VCC, yellow for the SDA, and white for the SCL pin.
2. Next, attach the other end of the dupont jumper wires to the Gorilla Cell ESP32 shield by matching the colors of the dupont wires to the colors of the pin headers on ESP32 shield which is black to black, red to red, yellow and the following colors to yellow pin headers. For this experiment, I choose GPIO 21 for the SDA and GPIO 22 for the SCL pins.
3. Next, power the ESP32 shield by attaching a USB type-C cable. Make sure that the power switch is slide to ON state.
4. Next, connect the ESP32 to the computer by attaching a micro-USB cable. Our demo is now ready.

## **Software Instruction**

For the software part, we will be needing additional driver library. Luckily, there is available library from Github which is written by Dave Hylands https://github.com/dhylands/python\_lcd/

1. First, open your Thonny Python IDE.
2. Next, let Thonny to detect and connect to ESP32 by clicking the Stop button.
3. Next, copy the lcd\_api.py below (SOURCE CODE section), click the New button, and paste it in Thonny.
4. Next, save it to MicroPython root directory by clicking the File menu, select Save As, and click the MicroPython Device.
5. Next, enter a file name as lcd\_api.py.
6. Repeat steps #3 to steps #5 for i2c\_lcd.py.

## **Video Demonstration**

{{< youtube ewq9y2d63mM >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1:

```py { lineNos="true" wrap="true" }
from time import sleep_ms, ticks_ms 
from machine import I2C, Pin 
from i2c_lcd import I2cLcd 

DEFAULT_I2C_ADDR = 0x20

i2c = I2C(scl=Pin(22), sda=Pin(21), freq=400000) 
lcd = I2cLcd(i2c, DEFAULT_I2C_ADDR, 2, 16)

# The following line of code should be tested
# using the REPL:

# 1. To print a string to the LCD:
#    lcd.putstr('Hello world')
# 2. To clear the display:
#	 lcd.clear()
# 3. To control the cursor position:
# 	 lcd.move_to(2, 1)
# 4. To show the cursor:
#  	 lcd.show_cursor()
# 5. To hide the cursor:
#	 lcd.hide_cursor()
# 6. To set the cursor to blink:
#	 lcd.blink_cursor_on()
# 7. To stop the cursor on blinking:
#	 lcd.blink_cursor_off()
# 8. To hide the currently displayed character:
#	 lcd.display_off()
# 9. To show the currently hidden character:
#	 lcd.display_on()
# 10. To turn off the backlight:
#	 lcd.backlight_off()
# 11. To turn ON the backlight:
#	 lcd.backlight_on()
# 12. To print a single character:
#	 lcd.putchar('x')
# 13. To print a custom character:
#	 happy_face = bytearray([0x00, 0x0A, 0x00, 0x04, 0x00, 0x11, 0x0E, 0x00])
#	 lcd.custom_char(0, happy_face)
#	 lcd.putchar(chr(0))

```

### 2. Example # 2:

```py { lineNos="true" wrap="true" }
from time import sleep_ms, ticks_ms 
from machine import I2C, Pin 
from i2c_lcd import I2cLcd 

DEFAULT_I2C_ADDR = 0x20

i2c = I2C(scl=Pin(22), sda=Pin(21), freq=400000) 
lcd = I2cLcd(i2c, DEFAULT_I2C_ADDR, 2, 16)

lcd.clear()
lcd.putstr('Example # 2')
sleep_ms(1000)
count = 0

while True:
    print('Counter: {}'.format(count))
    lcd.clear() # Clears the LCD,
                # Sets the cursor position to 0,0 
    lcd.putstr('Counter: {}' .format(count))
    count = count + 1
    sleep_ms(1000)

```

### 3. lcd\_api.py driver library:

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

### 4. i2c\_lcd.py driver library:

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

1. Dave Hylands python lcd library: 
[https://github.com/dhylands/python\_lcd/](https://github.com/dhylands/python_lcd/)

2. Gorilla Cell ESP32 development kit: 
[gorillacell.kr](http://gorillacell.kr/)

