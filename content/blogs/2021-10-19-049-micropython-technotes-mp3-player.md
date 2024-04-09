---
author: George Bantique
categories:
  - ESP32
  - GorillaCell
  - MicroPython
date: '2021-10-19T18:27:00+08:00'
excerpt: 'In this article, I will discuss on how to use an MP3 Player module interfaced to ESP32 with MicroPython programming language. What I have is an MP3 Player module from Gorillacell ESP32 development kit.'
tags:
  - audio player micropython
  - esp32 micropython
  - ESP8266 MicroPython
  - micropython projects
  - micropython tutorial
  - mp3 player micropython
series:
  - MicroPython TechNotes
title: '049 - MicroPython TechNotes: MP3 Player'
url: /2021/10/19/049-micropython-technotes-mp3-player/
# showRelatedInArticle: true
---

## **Introduction**

![](/images/Gorillacell-MP3-Player.png)

In this article, I will discuss on how to use an MP3 Player module interfaced to ESP32 with MicroPython programming language.

What I have is an MP3 Player module from Gorillacell ESP32 development kit. It uses the YX5300 MP3 audio chip which is capable of playing common audio files such as mp3 and wav files. The MP3 Player module kit includes: 1 piece of 8 Ohms speaker and of course the mp3 player board itself. The mp3 player board has microSD card slot and an audio output connector or it can also be output to 3.5mm audio jack.

## **Pinout**

The mp3 player has 4 pins which are:
1. **GND** – for the ground pins.
2. **VCC** – for the supply voltage.
3. **Tx** – for the UART serial transmit pin.
4. **Rx** – for the UART serial receive pin.

## **Bill Of Materials**

In order to follow this, you will need the following:
1. An ESP32 development board.
2. A Gorillacell ESP32 shield (optional, you may use breadboard or directly connect it to ESP32 pins).
3. A 4-pin Dupont jumper wires.
4. And of course, the Gorillacell MP3 Player module.
5. For example # 2, you will need additional Analog Touch Sensor module, 16×2 LCD module, and its corresponding jumper wires.

## **Hardware Instruction**

1. First, attach the ESP32 on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to the MP3 Player module by following a color coding such that black is for the ground, red is for the VCC, yellow is for the Tx pin, and white is for the Rx pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers such as black is to black, red is to red, yellow and the following colors to the yellow pin headers. For this lesson, Tx pin is connected to GPIO 25 and Rx pin is connected to GPIO 26.
4. Next, power the ESP32 shield using external power supply with a type-C USB cable and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through a micro USB cable.
6. For the example # 2, attach the Analog Touch Sensor module on GPIO 32 and the 16×2 LCD module on GPIO 21 (SDA) and GPIO 22 (SCL).

## **Software Instruction**

1. Copy the provided example source code in the SOURCE CODE section and for the example # 2, you will also need to upload the i2c_lcd.py library to your ESP32 MicroPython root directory by clicking the File menu, select Save As, select MicroPython Device, name it as i2c_lcd.py, and hit OK.

## **Video Demonstration**

{{< youtube YqFRxxXMS_Q >}}

## **Call To Action**

If you have any concern regarding this lesson, be sure to write your message in the comment section.

You might also like to support me on my journey on Youtube by Subscribing. [Click this link to SUBSCRIBE to TechToTinker Youtube channel.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

May you have a blessed day.

Thank you,
    George Bantique | tech.to.tinker@gmail.com

## **Source Code**

### 1. Example # 1, exploring the mp3 player module through the REPL:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import UART
from machine import Pin

STA_BYTE = 0x7E
VER_BYTE = 0xFF
LEN_BYTE = 0x06
FDB_BYTE = 0x00
END_BYTE = 0xEF

class GORILLA_MP3PLAYER():
#     player_volume = 20
#     is_mute = False
    
    def __init__(self,tx,rx):
        self.uart = UART(2, baudrate=9600, tx=tx, rx=rx)
        self.player_volume = 20
        self.is_mute = True
        self.setVolume(self.player_volume)
        
    def command(self, cmd, hbyte_data, lbyte_data):
        self.uart.write(bytes([STA_BYTE]))
        self.uart.write(bytes([VER_BYTE]))
        self.uart.write(bytes([LEN_BYTE]))
        self.uart.write(bytes([cmd]))
        self.uart.write(bytes([FDB_BYTE]))
        self.uart.write(bytes([hbyte_data]))
        self.uart.write(bytes([lbyte_data]))
        self.uart.write(bytes([END_BYTE]))

    def playNext(self):
        self.command(0x01, 0, 0)
        
    def playPrevious(self):
        self.command(0x02, 0, 0)
        
    def playIndex(self,index):
        self.command(0x03, 0, index)
        
    def volumeUp(self):
        if self.player_volume &lt; 30:
            self.player_volume += 1
            self.command(0x04, 0, 0)
            print("Current volume: {}".format(self.player_volume))
        else:
            print("Max volume set\r\n")
            
    def volumeDown(self):
        if self.player_volume != 0:
            self.player_volume -= 1
            self.command(0x05, 0, 0)
            print("Current volume: {}".format(self.player_volume))
        else:
            print("Volume set to MUTE\r\n")
            
    def setVolume(self, volume):
        self.player_volume = volume
        self.command(0x06, 0, volume)
        
    def sleep(self):
        self.command(0x0A, 0, 0)
        
    def wakeUp(self):
        self.command(0x0B, 0, 0)
        
    def reset(self):
        self.command(0x0C, 0, 0)
        
    def play(self):
        self.command(0x0D, 0, 1)
        self.is_mute = False
        
    def pause(self):
        self.command(0x0E, 0, 0)
        
    def playFolder(self, folder, file):
        self.command(0x0F, folder, file)
        
    def playStop(self):
        self.command(0x16, 0, 0)
        
    def playMute(self):
        curr_vol = self.player_volume
        if self.is_mute:
            self.setVolume(curr_vol)
            self.is_mute = False
        else:
            self.setVolume(0)
            self.is_mute = True
        self.player_volume = curr_vol

mp3 = GORILLA_MP3PLAYER(rx=25,tx=26)
```

### 2. Example # 2, sample application of the mp3 player module, analog touch sensor, and the 16×2 LCD module:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import UART
from machine import ADC
from machine import SoftI2C
from i2c_lcd import I2cLcd
from time import sleep_ms

STA_BYTE = 0x7E
VER_BYTE = 0xFF
LEN_BYTE = 0x06
FDB_BYTE = 0x00
END_BYTE = 0xEF

class GORILLA_MP3PLAYER():
#     player_volume = 20
#     is_mute = False
    
    def __init__(self,tx,rx):
        self.uart = UART(2, baudrate=9600, tx=tx, rx=rx)
        self.player_volume = 20
        self.is_mute = True
        self.setVolume(self.player_volume)
        
    def command(self, cmd, hbyte_data, lbyte_data):
        self.uart.write(bytes([STA_BYTE]))
        self.uart.write(bytes([VER_BYTE]))
        self.uart.write(bytes([LEN_BYTE]))
        self.uart.write(bytes([cmd]))
        self.uart.write(bytes([FDB_BYTE]))
        self.uart.write(bytes([hbyte_data]))
        self.uart.write(bytes([lbyte_data]))
        self.uart.write(bytes([END_BYTE]))

    def playNext(self):
        self.command(0x01, 0, 0)
        
    def playPrevious(self):
        self.command(0x02, 0, 0)
        
    def playIndex(self,index):
        self.command(0x03, 0, index)
        
    def volumeUp(self):
        if self.player_volume &lt; 30:
            self.player_volume += 1
            self.command(0x04, 0, 0)
            print("Current volume: {}".format(self.player_volume))
        else:
            print("Max volume set\r\n")
            
    def volumeDown(self):
        if self.player_volume != 0:
            self.player_volume -= 1
            self.command(0x05, 0, 0)
            print("Current volume: {}".format(self.player_volume))
        else:
            print("Volume set to MUTE\r\n")
            
    def setVolume(self, volume):
        self.player_volume = volume
        self.command(0x06, 0, volume)
        
    def sleep(self):
        self.command(0x0A, 0, 0)
        
    def wakeUp(self):
        self.command(0x0B, 0, 0)
        
    def reset(self):
        self.command(0x0C, 0, 0)
        
    def play(self):
        self.command(0x0D, 0, 1)
        self.is_mute = False
        
    def pause(self):
        self.command(0x0E, 0, 0)
        
    def playFolder(self, folder, file):
        self.command(0x0F, folder, file)
        
    def playStop(self):
        self.command(0x16, 0, 0)
        
    def playMute(self):
        curr_vol = self.player_volume
        if self.is_mute:
            self.setVolume(curr_vol)
            self.is_mute = False
        else:
            self.setVolume(0)
            self.is_mute = True
        self.player_volume = curr_vol
        
class GORILLA_ANALOGTOUCHSENSOR():
    def __init__(self, pin):
        self.pin = Pin(pin, Pin.IN)
        self.ats = ADC(self.pin)
        self.ats.atten(ADC.ATTN_11DB)
        
    def get_raw(self):
        return self.ats.read()
    
    def get_key(self):
        adc_value = self.ats.read()
        if (adc_value &gt; 640) and (adc_value &lt; 700):     # 1
            key = '1'
        elif (adc_value &gt; 1470) and (adc_value &lt; 1530): # 2
            key = '2'
        elif (adc_value &gt; 2310) and (adc_value &lt; 2370): # 3
            key = '3'
        elif (adc_value &gt; 3170) and (adc_value &lt; 3230): # 4
            key = '4'
        else:
            key = '0'
        return key

mp3 = GORILLA_MP3PLAYER(rx=25,tx=26)
ats = GORILLA_ANALOGTOUCHSENSOR(32)
i2c = SoftI2C(scl=Pin(22, Pin.OUT, Pin.PULL_UP), sda=Pin(21, Pin.OUT, Pin.PULL_UP))
lcd = I2cLcd(i2c, 0x20, 2, 16)

#     **************************
#       MP3 Player Menu System
#     **************************
#     Playback
#         Play/Pause
#         Play Prev
#         Play Next
#         Play Stop
#     Volume
#         Mute Sound
#         Volume Up
#         Volume Down
#         Set Volume
#     Advance
#         Play Index
#         Play Folder
#     System
#         Sleep
#         Wakeup
#         About
menu = [['Playback', 'Play/Pause', 'Play Prev', 'Play Next', 'Play Stop'],
        ['Volume', 'Mute Sound', 'Volume Up', 'Volume Down', 'Reset Volume']]
mainmenu_idx = 0
submenu_idx = 1
in_submenu = False
is_playing = False

def execute_menu():
    global mainmenu_idx
    global submenu_idx
    global is_playing
    
    if mainmenu_idx==0:      # PLAYBACK
        if submenu_idx==1:   # Play / Pause
            if is_playing:   # Currently playing, so do pause
                mp3.pause()
                is_playing = False
            else:            # Current pause/stop, so do play
                mp3.play()
                is_playing = True
        elif submenu_idx==2: # Play previous
            mp3.playPrevious()
        elif submenu_idx==3: # Play next
            mp3.playNext()
        elif submenu_idx==4: # Play stop
            mp3.playStop()
            is_playing = False
    elif mainmenu_idx==1:    # VOLUME
        if submenu_idx==1:   # Mute
            mp3.playMute()
        elif submenu_idx==2: # Volume Up
            mp3.volumeUp()
        elif submenu_idx==3: # Volume Down
            mp3.volumeDown()
        elif submenu_idx==4: # Set volume
            mp3.setVolume(20)
    else:
        pass

def process_menu(key):
    global mainmenu_idx
    global submenu_idx
    global in_submenu

    if key == '1':   # Use as BACK key
        in_submenu = False
        submenu_idx = 1
    elif key == '2': # Use as LEFT key
        if in_submenu:
            if submenu_idx &gt; 0:
                submenu_idx -= 1
        else:
            if mainmenu_idx &gt; 0:
                mainmenu_idx -= 1
    elif key == '3': # Use as RIGHT key
        if in_submenu:
            if submenu_idx &lt; len(menu[mainmenu_idx])-1:
                submenu_idx += 1
        else:
            if mainmenu_idx &lt; len(menu)-1:
                mainmenu_idx += 1
    elif key == '4':   # Use as ENTER key
        if in_submenu:
            execute_menu() # Executes are all in sub menus
        else: # in mainmenu
            in_submenu = True
            submenu_idx = 0
        
    else:              # None is press
        pass
    
    if key != '0': # Update only when a key is pressed!
        update_display()
        

def update_display():
    global submenu_idx
    
    lcd.clear()

    if in_submenu:
        if submenu_idx==0:                                # index 0
            lcd.setcursor(1,0)
            lcd.putstr(menu[mainmenu_idx][submenu_idx])
            lcd.setcursor(2,1)
            lcd.putstr(menu[mainmenu_idx][submenu_idx+1])
            lcd.setcursor(1,1)
            submenu_idx = 1
        elif submenu_idx==1:                              # index 1
            lcd.setcursor(1,0)
            lcd.putstr(menu[mainmenu_idx][submenu_idx-1])
            lcd.setcursor(2,1)
            lcd.putstr(menu[mainmenu_idx][submenu_idx])
            lcd.setcursor(1,1)
        elif (submenu_idx==len(menu[mainmenu_idx])-1):    # last index
            lcd.setcursor(2,0)
            lcd.putstr(menu[mainmenu_idx][submenu_idx-1])
            lcd.setcursor(2,1)
            lcd.putstr(menu[mainmenu_idx][submenu_idx])
            lcd.setcursor(1,1)
        else:                                             # middle index
            lcd.setcursor(2,0)
            lcd.putstr(menu[mainmenu_idx][submenu_idx])
            lcd.setcursor(2,1)
            lcd.putstr(menu[mainmenu_idx][submenu_idx+1])
            lcd.setcursor(1,0)
        lcd.putstr('&gt;')
    else: # means in main menu
        if (mainmenu_idx==len(menu)-1):        # mainmenu index @ end of the array
          lcd.setcursor(1,0)
          lcd.putstr(menu[mainmenu_idx-1][0])
          lcd.setcursor(1,1)
          lcd.putstr(menu[mainmenu_idx][0])
          lcd.setcursor(0,1)
        else:
          lcd.setcursor(1,0)
          lcd.putstr(menu[mainmenu_idx][0])
          lcd.setcursor(1,1)
          lcd.putstr(menu[mainmenu_idx+1][0])
          lcd.setcursor(0,0)
        lcd.putstr("&gt;")


update_display()

while True:
    process_menu( ats.get_key() )
    sleep_ms(150)
```

### 3. i2c\_lcd.py:

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
    LCD_MOVE_DISP = 0x08        # --DB3: move display (0-&gt;; move cursor) 
    LCD_MOVE_RIGHT = 0x04       # --DB2: move right (0-&gt; left) 
    LCD_FUNCTION = 0x20         # DB5: function set 
    LCD_FUNCTION_8BIT = 0x10    # --DB4: set 8BIT mode (0-&gt;4BIT mode) 
    LCD_FUNCTION_2LINES = 0x08  # --DB3: two lines (0-&gt;one line) 
    LCD_FUNCTION_10DOTS = 0x04  # --DB2: 5x10 font (0-&gt;5x7 font) 
    LCD_FUNCTION_RESET = 0x30   # See "Initializing by Instruction" section 
    LCD_CGRAM = 0x40            # DB6: set CG RAM address 
    LCD_DDRAM = 0x80            # DB7: set DD RAM address 
    LCD_RS_CMD = 0 
    LCD_RS_DATA = 1 
    LCD_RW_WRITE = 0 
    LCD_RW_READ = 1 
    def __init__(self, num_lines, num_columns): 
        self.num_lines = num_lines 
        if self.num_lines &gt; 4: 
            self.num_lines = 4 
        self.num_columns = num_columns 
        if self.num_columns &gt; 40: 
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
    def setcursor(self, cursor_x, cursor_y): 
        """Moves the cursor position to the indicated position. The cursor 
        position is zero based (i.e. cursor_x == 0 indicates first column). 
        """ 
        self.cursor_x = cursor_x 
        self.cursor_y = cursor_y 
        addr = cursor_x &amp;s; 0x3f 
        if cursor_y &amp;s; 1: 
            addr += 0x40    # Lines 1 &amp;s; 3 add 0x40 
        if cursor_y &amp;s; 2:    # Lines 2 &amp;s; 3 add number of columns 
            addr += self.num_columns 
        self.hal_write_command(self.LCD_DDRAM | addr) 
    def putchar(self, char): 
        """Writes the indicated character to the LCD at the current cursor 
        position, and advances the cursor by one position. 
        """ 
        if char == '\n': 
            if self.implied_newline: 
                # self.implied_newline means we advanced due to a wraparound, 
                # so if we get a newline right after that we ignore it. 
                pass 
            else: 
                self.cursor_x = self.num_columns 
        else: 
            self.hal_write_data(ord(char)) 
            self.cursor_x += 1 
        if self.cursor_x &gt;= self.num_columns: 
            self.cursor_x = 0 
            self.cursor_y += 1 
            self.implied_newline = (char != '\n') 
        if self.cursor_y &gt;= self.num_lines: 
            self.cursor_y = 0 
        self.setcursor(self.cursor_x, self.cursor_y) 
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
        location &amp;s;= 0x7 
        self.hal_write_command(self.LCD_CGRAM | (location &lt;&lt; 3)) 
        self.hal_sleep_us(40) 
        for i in range(8): 
            self.hal_write_data(charmap[i]) 
            self.hal_sleep_us(40) 
        self.setcursor(self.cursor_x, self.cursor_y)
        
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



"""Implements a HD44780 character LCD connected via PCF8574 on I2C. 
   This was tested with: https://www.wemos.cc/product/d1-mini.html""" 
# from lcd_api import LcdApi 
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
        if num_lines &gt; 1: 
            cmd |= self.LCD_FUNCTION_2LINES 
        self.hal_write_command(cmd) 
    def hal_write_init_nibble(self, nibble): 
        """Writes an initialization nibble to the LCD. 
        This particular function is only used during initialization. 
        """ 
        byte = ((nibble &gt;&gt; 4) &amp;s; 0x0f) &lt;&lt; SHIFT_DATA 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
    def hal_backlight_on(self): 
        """Allows the hal layer to turn the backlight on.""" 
        self.i2c.writeto(self.i2c_addr, bytearray([1 &lt;&lt; SHIFT_BACKLIGHT])) 
    def hal_backlight_off(self): 
        """Allows the hal layer to turn the backlight off.""" 
        self.i2c.writeto(self.i2c_addr, bytearray([0])) 
    def hal_write_command(self, cmd): 
        """Writes a command to the LCD. 
        Data is latched on the falling edge of E. 
        """ 
        byte = ((self.backlight &lt;&lt; SHIFT_BACKLIGHT) | (((cmd &gt;&gt; 4) &amp;s; 0x0f) &lt;&lt; SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
        byte = ((self.backlight &lt;&lt; SHIFT_BACKLIGHT) | ((cmd &amp;s; 0x0f) &lt;&lt; SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
        if cmd &lt;= 3: 
            # The home and clear commands require a worst case delay of 4.1 msec 
            sleep_ms(5) 
    def hal_write_data(self, data): 
        """Write data to the LCD.""" 
        byte = (MASK_RS | (self.backlight &lt;&lt; SHIFT_BACKLIGHT) | (((data &gt;&gt; 4) &amp;s; 0x0f) &lt;&lt; SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte])) 
        byte = (MASK_RS | (self.backlight &lt;&lt; SHIFT_BACKLIGHT) | ((data &amp;s; 0x0f) &lt;&lt; SHIFT_DATA)) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte | MASK_E])) 
        self.i2c.writeto(self.i2c_addr, bytearray([byte]))
```

## **Credits And References**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr/](https://gorillacell.kr/)

2. YX5300 datasheet:
[http://geekmatic.in.ua/pdf/Catalex\_MP3\_board.pdf](http://geekmatic.in.ua/pdf/Catalex_MP3_board.pdf)

