---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-21T21:01:00+08:00'
excerpt: In this article, we will learn to use the DS3231 RTC module with ESP32 using MicroPython programming language.
tags:
  - ESP32 DS3231
  - How to use DS3231 RTC in MicroPython
  - MicroPython DS3231
  - MicroPython DS3231 RTC
  - MicroPython LCD Menu
series:
  - MicroPython TechNotes
title: '030 - MicroPython TechNotes: DS3231 RTC'
url: /2021/04/21/030-micropython-technotes-ds3231-rtc/
---

## **Introduction**
![](/images/030-MicroPython-TechNotes-RTC.png)

In this article, we will learn to use the DS3231 RTC module with ESP32 using MicroPython programming language.

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **SDA** – for the i2c serial data pin.
4. **SCL** – for the i2c serial clock pin.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 4-pin female-female dupont wires.
4. DS3231 RTC module.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the ESP32 shield and make sure that both USB port are on the same side.
2. Next, attach the dupont wires to the RTC module by following the color coding which is black for the ground, red for the VCC, yellow for the SDA pin, and white for the SCL pin.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers which such as black to black, red to red, and yellow and the following colors to the yellow pin headers. For this experiment, I choose GPIO 21 for the SDA pin and GPIO 22 for the SCL pin.
4. Next, power the ESP32 shield with an external power supply through a type-C USB cable and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through a micro USB cable.

## **Software Instruction**

1. Copy the ds3231.py and save it to ESP32 MicroPython root directory.
2. Copy and paste to Thonny IDE the example source code, play with it and feel free to modify it adapting according to your needs.
3. Enjoy and happy tinkering.

## **Video Demonstration**

{{< youtube Z8mjG5feAec >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, basic of DS3231 RTC:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import SoftI2C 
from ds3231 import DS3231

i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000) 
ds = DS3231(i2c)

# The following line of codes can be tested using the REPL:
# 1. Get the current time
# ds.get_time()
# Return:
#        YYYY, MM, DD, HH, mm, ss, WD, YD
#        YYYY - year
#          MM - month
#          DD - day
#          HH - hour in 24 hour
#          mm - minutes
#          ss - seconds
#          WD - week day: 1=Monday, 7=Sunday
#          YD - day of the year
# 2. Set the current time
# ds.set_time(YYYY, MM, DD, HH, mm, ss, WD, YD)
# ds.set_time(2021, 04, 20, 08, 30, 00, 02, 00)

```

### 2. Example # 2, application of RTC module:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com   
 # George Bantique | tech.to.tinker@gmail.com  
 from machine import Pin  
 from machine import SoftI2C  
 from time import sleep_ms  
 from time import ticks_ms  
 from ds3231 import DS3231  
 from i2c_lcd import I2cLcd  
 from rotary_irq import RotaryIRQ  
 # 1. RTC object instantiation:  
 rtc_i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000)   
 ds = DS3231(rtc_i2c)  
 # DS3231 tuple:  
 #    YYYY, MM, DD, HH, mm, ss, WD, YD  
 #    YYYY - year  
 #     MM - month  
 #     DD - day  
 #     HH - hour in 24 hour  
 #     mm - minutes  
 #     ss - seconds  
 #     WD - week day: 1=Monday, 7=Sunday  
 #     YD - day of the year  
 # 2. Onboard LED object instantiation:  
 led = Pin(2, Pin.OUT)  
 # 3. LCD object instantiation:  
 lcd_i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000)   
 lcd = I2cLcd(lcd_i2c, 0x20, 2, 16)  
 # 4. Rotary Encoder object instantiation:  
 r = RotaryIRQ(pin_num_clk=32,   
        pin_num_dt=33,   
        min_val=0,   
        max_val=19,   
        reverse=True,   
        range_mode=RotaryIRQ.RANGE_WRAP)  
 rsw = Pin(34, Pin.IN)  
 val_old = r.value()  
 menus = ['Display Date',  
      'Display Time',  
      'Display Wkday',  
      'Edit Year',  
      'Edit Month',  
      'Edit Day',  
      'Edit Hour',  
      'Edit Minute',  
      'Edit Wkday']  
 wkdays = ['Monday',  
      'Tuesday',  
      'Wednesday',  
      'Thursday',  
      'Friday',  
      'Saturday',  
      'Sunday']  
 months = ['January',  
      'February',  
      'March',  
      'April',  
      'May',  
      'June',  
      'July',  
      'August',  
      'September',  
      'October',  
      'November',  
      'December']  
 working_idx = 0 # holds the menu index  
 year = 0    # holds the year  
 month = 0    # holds the month <1=January, 12=December>  
 day = 0     # holds the day  
 hour = 0    # holds the hour in 24 hour <0=12AM, 23=11PM>  
 minute = 0   # holds the minue <0-59>  
 wkday = 0    # holds the day of the week <1=Monday, 7=Sunday>  
 isPress = False # flag for the config / normal mode  
 isSaved = False # flag for determining if the configuration is save  
 # get the current time  
 prev_time = ticks_ms()  
 # Prints a string of characters in the LCD  
 #  text - the string you want to print  
 #  x - x position  
 #  y - y position  
 def print_line(text, x, y):  
   # Calculate the start of character display  
   start = 8-len(text)//2  
   # Calculate the end of character display  
   end = start + len(text)  
   # Clears characters before the start position  
   lcd.move_to(x,y)  
   for i in range(x,start,1):  
     lcd.putchar(' ')  
   # Clears characters after the end position  
   lcd.move_to(end,y)  
   for i in range(end,15,1):  
     lcd.putchar(' ')  
   # Print the desired display  
   lcd.move_to(start,y)  
   lcd.putstr(text)  
 # Performs updating the menu display  
 # according to the rotary encoder value  
 def process_menu(rotary_dir=0):  
   # Global variables here if needed to be edited,  
   # else, no need to declare as global here.  
   global working_idx  
   global year  
   global month  
   global day  
   global hour  
   global minute  
   global wkday  
   # If the rotary value is less than -1 ie:-2,-3,etc:  
   #  rotary value = -1  
   # If the rotary value is more than 1:  
   #  rotary value = 1  
   # Else  
   #  rotary value is not modified  
   if rotary_dir < -1:  
     rotary_dir = -1  
   elif rotary_dir > 1:  
     rotary_dir = 1  
   # DISPLAY ONLY MODE  
   if isPress==False:  
     # Calculate the working index  
     # based on rotary encoder value.  
     working_idx += rotary_dir  
     if working_idx < 0:  
       working_idx = 0  
     elif working_idx > len(menus) - 1:  
       working_idx = len(menus) - 1  
     # Check if there is menu available in left  
     # If true, display < character  
     # If false, display none  
     lcd.move_to(0,0)  
     if working_idx==0:  
       lcd.putchar(' ')  
     else:  
       lcd.putchar('<')  
     # Print the menu based on working index value  
     print_line(menus[working_idx],1,0)  
     # Checks if there is menu available in right  
     # If true, display > character  
     # If false, display none  
     lcd.move_to(15,0)  
     if working_idx==len(menus)-1:  
       lcd.putchar(' ')  
     else:  
       lcd.putchar('>')  
     # ------------------------  
     # Process menu selections:  
     if working_idx==0:  
       # Display Date  
       t = ds.get_time()  
       date = '{:04d}-{:02d}-{:02d}'.format(t[0],t[1],t[2])  
       print_line(date,1,1)  
     elif working_idx==1:  
       # Display Time  
       t = ds.get_time()  
       time = '{:02d}:{:02d}'.format(t[3],t[4])  
       print_line(time,1,1)  
     elif working_idx==2:  
       # Display Week Day  
       t = ds.get_time()  
       day = wkdays[t[6]-1]  
       print_line(day,1,1)  
     elif working_idx==3:  
       # Display year  
       t = ds.get_time()  
       year=t[0]  
       print_line(str(year),1,1)  
     elif working_idx==4:  
       # Display month  
       t = ds.get_time()  
       month=t[1]  
       print_line(months[month-1],1,1)  
     elif working_idx==5:  
       # Display day  
       t = ds.get_time()  
       day=t[2]  
       print_line(str(day),1,1)  
     elif working_idx==6:  
       # Display hour  
       t = ds.get_time()  
       hour=t[3]  
       print_line(str(hour),1,1)  
     elif working_idx==7:  
       # Display minute  
       t = ds.get_time()  
       minute=t[4]  
       print_line(str(minute),1,1)  
     elif working_idx==8:  
       # Display wkday  
       t = ds.get_time()  
       wkday=t[6]  
       print_line(wkdays[wkday-1],1,1)        
   # CONFIGURATION MODE  
   elif isPress==True:  
     if working_idx==3:  
       # Edit year  
       year+=rotary_dir  
       print_line(str(year),1,1)  
     elif working_idx==4:  
       # Edit month  
       month+=rotary_dir  
       if month < 1:  
         month = 1  
       elif month > 12:  
         month = 12  
       print_line(months[month-1],1,1)  
     elif working_idx==5:  
       # Edit day  
       day+=rotary_dir  
       if day < 0:  
         day = 0  
       elif day > 31:  
         day = 31  
       print_line(str(day),1,1)  
     elif working_idx==6:  
       # Edit hour  
       hour+=rotary_dir  
       if hour < 0:  
         hour = 0  
       elif hour > 23:  
         hour = 23  
       print_line(str(hour),1,1)  
     elif working_idx==7:  
       # Edit minute  
       minute+=rotary_dir  
       if minute < 0:  
         minute = 0  
       elif minute > 59:  
         minute = 59  
       print_line(str(minute),1,1)  
     elif working_idx==8:  
       # Edit week day  
       wkday+=rotary_dir  
       if wkday < 1:  
         wkday = 1  
       elif wkday > 7:  
         wkday = 7  
       print_line(wkdays[wkday-1],1,1)  
 # Prints the initial menus  
 process_menu()  
 while True:  
   # Creates 200 ms interval  
   if ticks_ms() - prev_time >= 200:  
     # Checks only for the switch when index is more than 2  
     # If switch is press, toggle the state of isPress variable  
     # If isPress is True, config for editing  
     # If isPress is False back again, save the configs.  
     if rsw.value()==1 and working_idx>2:  
       isPress = not isPress  
       if isPress==True:  
         process_menu()  
         isSaved=False  
       if isPress==False and isSaved==False:  
         isSaved=True  
         t = ds.get_time()  
         if working_idx==3:  
           ds.set_time(year,t[1],t[2],t[3],t[4],t[5],t[6],t[7])  
         elif working_idx==4:  
           ds.set_time(t[0],month,t[2],t[3],t[4],t[5],t[6],t[7])  
         elif working_idx==5:  
           ds.set_time(t[0],t[1],day,t[3],t[4],t[5],t[6],t[7])  
         elif working_idx==6:  
           ds.set_time(t[0],t[1],t[2],hour,t[4],t[5],t[6],t[7])  
         elif working_idx==7:  
           ds.set_time(t[0],t[1],t[2],t[3],minute,t[5],t[6],t[7])  
         elif working_idx==8:  
           ds.set_time(t[0],t[1],t[2],t[3],t[4],t[5],wkday,t[7])  
     # Read the rotary encoder values for processing  
     val_new = r.value()  
     if val_old != val_new:  
       if val_old == 0 and val_new == 19:  
         val_dif = -1  
       elif val_old == 19 and val_new == 0:  
         val_dif = 1  
       else:  
         val_dif = val_new - val_old  
       process_menu(val_dif)  
       val_old = val_new  
     # Blink the onboard LED during config mode  
     if isPress:  
       led.value(not led.value())  
     else:  
       led.value(0)  
     # Save the current timer counter  
     prev_time = ticks_ms()  

```

### 3. Modified ds3231.py driver library:

```py { lineNos="true" wrap="true" }
# ds3231_port.py Portable driver for DS3231 precison real time clock.  
 # Adapted from WiPy driver at https://github.com/scudderfish/uDS3231  
 # Author: Peter Hinch  
 # Copyright Peter Hinch 2018 Released under the MIT license.  
 import utime  
 import machine  
 import sys  
 DS3231_I2C_ADDR = 104  
 try:  
   rtc = machine.RTC()  
 except:  
   print('Warning: machine module does not support the RTC.')  
   rtc = None  
 def bcd2dec(bcd):  
   return (((bcd & 0xf0) >> 4) * 10 + (bcd & 0x0f))  
 def dec2bcd(dec):  
   tens, units = divmod(dec, 10)  
   return (tens << 4) + units  
 def tobytes(num):  
   return num.to_bytes(1, 'little')  
 class DS3231:  
   def __init__(self, i2c):  
     self.ds3231 = i2c  
     self.timebuf = bytearray(7)  
     if DS3231_I2C_ADDR not in self.ds3231.scan():  
       raise RuntimeError("DS3231 not found on I2C bus at %d" % DS3231_I2C_ADDR)  
   def get_time(self, set_rtc=False):  
     if set_rtc:  
       self.await_transition() # For accuracy set RTC immediately after a seconds transition  
     else:  
       self.ds3231.readfrom_mem_into(DS3231_I2C_ADDR, 0, self.timebuf) # don't wait  
     return self.convert(set_rtc)  
   def convert(self, set_rtc=False): # Return a tuple in localtime() format (less yday)  
     data = self.timebuf  
     ss = bcd2dec(data[0])  
     mm = bcd2dec(data[1])  
     if data[2] & 0x40:  
       hh = bcd2dec(data[2] & 0x1f)  
       if data[2] & 0x20:  
         hh += 12  
     else:  
       hh = bcd2dec(data[2])  
     wday = data[3]  
     DD = bcd2dec(data[4])  
     MM = bcd2dec(data[5] & 0x1f)  
     YY = bcd2dec(data[6])  
     if data[5] & 0x80:  
       YY += 2000  
     else:  
       YY += 1900  
     # Time from DS3231 in time.localtime() format (less yday)  
     result = YY, MM, DD, hh, mm, ss, wday -1, 0  
     if set_rtc:  
       if rtc is None:  
         # Best we can do is to set local time  
         secs = utime.mktime(result)  
         utime.localtime(secs)  
       else:  
         rtc.datetime((YY, MM, DD, wday, hh, mm, ss, 0))  
     return result  
 #   def save_time(self):  
 #     (YY, MM, mday, hh, mm, ss, wday, yday) = utime.localtime() # Based on RTC  
 #     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 0, tobytes(dec2bcd(ss)))  
 #     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 1, tobytes(dec2bcd(mm)))  
 #     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 2, tobytes(dec2bcd(hh))) # Sets to 24hr mode  
 #     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 3, tobytes(dec2bcd(wday + 1))) # 1 == Monday, 7 == Sunday  
 #     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 4, tobytes(dec2bcd(mday))) # Day of month  
 #     if YY >= 2000:  
 #       self.ds3231.writeto_mem(DS3231_I2C_ADDR, 5, tobytes(dec2bcd(MM) | 0b10000000)) # Century bit  
 #       self.ds3231.writeto_mem(DS3231_I2C_ADDR, 6, tobytes(dec2bcd(YY-2000)))  
 #     else:  
 #       self.ds3231.writeto_mem(DS3231_I2C_ADDR, 5, tobytes(dec2bcd(MM)))  
 #       self.ds3231.writeto_mem(DS3231_I2C_ADDR, 6, tobytes(dec2bcd(YY-1900)))  
   # Modified by George Bantique / April 19, 2021  
   # to add manual saving of time.  
   def set_time(self, YY, MM, mday, hh, mm, ss, wday, yday):  
     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 0, tobytes(dec2bcd(ss)))  
     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 1, tobytes(dec2bcd(mm)))  
     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 2, tobytes(dec2bcd(hh))) # Sets to 24hr mode  
     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 3, tobytes(dec2bcd(wday + 1))) # 1 == Monday, 7 == Sunday  
     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 4, tobytes(dec2bcd(mday))) # Day of month  
     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 5, tobytes(dec2bcd(MM)))  
     self.ds3231.writeto_mem(DS3231_I2C_ADDR, 6, tobytes(dec2bcd(YY-1900)))  
 #   # Wait until DS3231 seconds value changes before reading and returning data  
 #   def await_transition(self):  
 #     self.ds3231.readfrom_mem_into(DS3231_I2C_ADDR, 0, self.timebuf)  
 #     ss = self.timebuf[0]  
 #     while ss == self.timebuf[0]:  
 #       self.ds3231.readfrom_mem_into(DS3231_I2C_ADDR, 0, self.timebuf)  
 #     return self.timebuf  
 #   # Test hardware RTC against DS3231. Default runtime 10 min. Return amount  
 #   # by which DS3231 clock leads RTC in PPM or seconds per year.  
 #   # Precision is achieved by starting and ending the measurement on DS3231  
 #   # one-seond boundaries and using ticks_ms() to time the RTC.  
 #   # For a 10 minute measurement +-1ms corresponds to 1.7ppm or 53s/yr. Longer  
 #   # runtimes improve this, but the DS3231 is "only" good for +-2ppm over 0-40C.  
 #   def rtc_test(self, runtime=600, ppm=False, verbose=True):  
 #     if rtc is None:  
 #       raise RuntimeError('machine.RTC does not exist')  
 #     verbose and print('Waiting {} minutes for result'.format(runtime//60))  
 #     factor = 1_000_000 if ppm else 114_155_200 # seconds per year  
 #   
 #     self.await_transition() # Start on transition of DS3231. Record time in .timebuf  
 #     t = utime.ticks_ms() # Get system time now  
 #     ss = rtc.datetime()[6] # Seconds from system RTC  
 #     while ss == rtc.datetime()[6]:  
 #       pass  
 #     ds = utime.ticks_diff(utime.ticks_ms(), t) # ms to transition of RTC  
 #     ds3231_start = utime.mktime(self.convert()) # Time when transition occurred  
 #     t = rtc.datetime()  
 #     rtc_start = utime.mktime((t[0], t[1], t[2], t[4], t[5], t[6], t[3] - 1, 0)) # y m d h m s wday 0  
 #   
 #     utime.sleep(runtime) # Wait a while (precision doesn't matter)  
 #   
 #     self.await_transition() # of DS3231 and record the time  
 #     t = utime.ticks_ms() # and get system time now  
 #     ss = rtc.datetime()[6] # Seconds from system RTC  
 #     while ss == rtc.datetime()[6]:  
 #       pass  
 #     de = utime.ticks_diff(utime.ticks_ms(), t) # ms to transition of RTC  
 #     ds3231_end = utime.mktime(self.convert()) # Time when transition occurred  
 #     t = rtc.datetime()  
 #     rtc_end = utime.mktime((t[0], t[1], t[2], t[4], t[5], t[6], t[3] - 1, 0)) # y m d h m s wday 0  
 #   
 #     d_rtc = 1000 * (rtc_end - rtc_start) + de - ds # ms recorded by RTC  
 #     d_ds3231 = 1000 * (ds3231_end - ds3231_start) # ms recorded by DS3231  
 #     ratio = (d_ds3231 - d_rtc) / d_ds3231  
 #     ppm = ratio * 1_000_000  
 #     verbose and print('DS3231 leads RTC by {:4.1f}ppm {:4.1f}mins/yr'.format(ppm, ppm*1.903))  
 #     return ratio * factor  
 #   def _twos_complement(self, input_value: int, num_bits: int) -> int:  
 #     mask = 2 ** (num_bits - 1)  
 #     return -(input_value & mask) + (input_value & ~mask)  
 #   def get_temperature(self):  
 #     t = self.ds3231.readfrom_mem(DS3231_I2C_ADDR, 0x11, 2)  
 #     i = t[0] << 8 | t[1]  
 #     return self._twos_complement(i >> 6, 10) * 0.25  

```

### 4. Copy rotary.py in the SOURCE CODE section of:

<https://techtotinker.com/2021/04/027-micropython-technotes-rotary-encoder/>

### 5. Copy rotary\_irq.py in the SOURCE CODE section of:

<https://techtotinker.com/2021/04/027-micropython-technotes-rotary-encoder/>

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. Peter Hinch DS3231 driver library:
[https://github.com/peterhinch/micropython-samples/tree/master/DS3231](https://github.com/peterhinch/micropython-samples/tree/master/DS3231)

