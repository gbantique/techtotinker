---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-04-13T16:48:00+08:00'
excerpt: In this article, we will learn how to use ROTARY ENCODER module with ESP32 using MicroPython programming language.
tags:
  - ESP32 Rotary Encoder
  - How to use rotary encoder in micropython
  - MicroPython Menu System
  - MicroPython Rotary Encoder
series:
  - MicroPython TechNotes
title: '027 - MicroPython TechNotes: Rotary Encoder'
url: /2021/04/13/027-micropython-technotes-rotary-encoder/
---

## **Introduction**

![](/images/027-RotaryEncoder-blogs.png)

In this article, we will learn how to use ROTARY ENCODER module with ESP32 using MicroPython programming language.

## **Pinout**

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage.
3. **SA** – for the signal pin A.
4. **SB** – for the signal pin B.
5. **SW** – for the signal pin from the push button switch.

## **Bill Of Materials**

1. **ESP32 development board** that will serve as the brain for the experiment.
2. **Gorillacell ESP32 shield** to extend ESP32 board to pin headers for easy circuit connection.
3. **5-pin female-female dupont wires** to attach the Rotary Encoder module to ESP32 shield.
4. **Rotary Encoder module** from Gorillacell ESP32 development kit.

## **Hardware Instruction**

1. First, attach the ESP32 board on top of the Gorillacell ESP32 shield and make sure that both USB ports are on the same side.
2. Next, attach dupont wires to the Rotary Encoder by following a color coding which is black for the ground, red for the VCC, yellow and the following colors for the signal pins.
3. Next, attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers. I choose GPIO 32, GPIO 33, and GPIO 34 for the pin SA, pin SB, and pin SW respectively.
4. Next, power the ESP32 shield with an external power supply with a type-C USB cable and make sure that the power switch is set to ON state.
5. Lastly, connect the ESP32 to the computer through a micro USB cable.

## **Software Instruction**

1. Copy the rotary.py and rotary\_irq\_esp.py which I renamed as rotary\_irq.py and save it to the ESP32 MicroPython Device root directory. The rotary library came from the Github of Mike Teachman: https://github.com/miketeachman/micropython-rotary
2. Try the provided example source code, play with it, and adapt it according to your needs. Most of all, enjoy learning. Happy tinkering.

## **Video Demonstration**

{{< youtube hAU23t7IkLM >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, basic example of using the Rotary Encoder:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import sleep_ms
from rotary_irq import RotaryIRQ

r = RotaryIRQ(pin_num_clk=32, 
              pin_num_dt=33, 
              min_val=0, 
              max_val=19, 
              reverse=True, 
              range_mode=RotaryIRQ.RANGE_WRAP)
sw = Pin(34, Pin.IN)              
val_old = r.value()
isRotaryEncoder = False

while True:
    if sw.value()==1:
        isRotaryEncoder = not isRotaryEncoder
        if isRotaryEncoder==True:
            print('Rotary Encoder is now enabled.')
        else:
            print('Rotary Encoder is now disabled.')
            
    if isRotaryEncoder==True:
        val_new = r.value()
        if val_old != val_new:
            val_old = val_new
            print('result = {}'.format(val_new))

    sleep_ms(200)

```

**How the code works:**

*from machine import Pin*

Imports the Pin class from the machine module for accessing the ESP32 GPIO pins.

*from time import sleep\_ms*

Imports the sleep\_ms class from the time module to create delays in milli seconds resolution.

*from rotary\_irq import RotaryIRQ*

Imports RotaryIRQ class from rotary\_irq library to handle reading the Rotary encoder signals.

*r = RotaryIRQ(pin\_num\_clk=32,*

 *pin\_num\_dt=33,*

 *min\_val=0,*

 *max\_val=19,*

 *reverse=True,*

 *range\_mode=RotaryIRQ.RANGE\_WRAP)*

Creates a RotaryIRQ object named “r” with pins connected to **GPIO 32** and **GPIO 33**.  
**min\_val** and **max\_val** sets the number of steps rotary encoder can have.

**reverse=True** sets an increasing value when the rotary encoder is rotated clockwise and a decreasing value when the rotary encoder is rotated in counter clockwise direction. You may change this to False if you want the other way around.

**range\_mode** sets returned value of the library to wrap around between its maximum step value (max\_val) and minimum step value (min\_val) and vice-versa.

*sw = Pin(34, Pin.IN)*

Creates a Pin object named “sw” which is connected to GPIO 34 with a pin direction set as input.

*val\_old = r.value()*

Reads the current value of the rotary encoder and store it to the val\_old variable for comparison later on.

*isRotaryEncoder = False*

Create a variable isRotaryEncoder and sets its default value to False. This defaults to disabling the reading of rotary encoder.

*while True:*

Creates an infinite loop

*if sw.value()==1:*

 *isRotaryEncoder = not isRotaryEncoder*

 *if isRotaryEncoder==True:*

 *print(‘Rotary Encoder is now enabled.’)*

 *else:*

 *print(‘Rotary Encoder is now disabled.’)*

Checks if the push button switch of the rotary encoder.

*if isRotaryEncoder==True:*

 *val\_new = r.value()*

 *if val\_old != val\_new:*

 *val\_old = val\_new*

 *print(‘result = {}’.format(val\_new))*

And if the isRotaryEncoder is set to True, then display the rotary encoder values.


### **2. Example # 2, using the Rotary Encoder to control a menu displayed in 0.96 OLED display:**

```py { lineNos="true" wrap="true" }

# More details can be found in TechToTinker.blogspot.com   
 # George Bantique | tech.to.tinker@gmail.com  
 from time import sleep_ms  
 from time import ticks_ms  
 from rotary_irq import RotaryIRQ  
 from machine import Pin, SoftI2C  
 from machine import RTC  
 from ssd1306 import SSD1306_I2C   
 led = Pin(2, Pin.OUT)  
 rsw = Pin(34, Pin.IN)  
 i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000)   
 oled = SSD1306_I2C(128, 64, i2c, addr=0x3C)   
 r = RotaryIRQ(pin_num_clk=32,   
        pin_num_dt=33,   
        min_val=0,   
        max_val=19,   
        reverse=True,   
        range_mode=RotaryIRQ.RANGE_WRAP)        
 val_old = r.value()  
 rtc = RTC()  
 rtc.datetime((2021, 4, 11, 0, 10, 12, 0, 0))  
 # rtc.datetime((YYYY, MM, DD, WD, HH, MM, SS, MS))  
 # WD 0 = Monday  
 # WD 6 = Sunday  
 menus = ['Blink LED',  
      'Activate LED',  
      'Invert OLED',  
      'Display Time',  
      'Display Date',  
      'Display Weekday',  
      'Menu 6',  
      'Menu 7',  
      'Menu 8',  
      'Menu 9',  
      'Menu 10',  
      'Menu 11',  
      'Menu 12']  
 working_idx = 0  
 sel_menu_idx = 0  
 menu_idx = 0  
 prev_time = ticks_ms()  
 isBlinkLED = False  
 isActiveLED = False  
 isInvertOLED = False  
 isDisplayTime = False  
 isDisplayDate = False  
 isDisplayWkday = False  
 def print_menu(rotary_dir=0):  
   NUM_MENU_LINE = 5  
   global menus  
   global working_idx  
   global sel_menu_idx  
   global menu_idx  
   print_cnt = 0  
   menu_x_pos = 10 # default x position  
   menu_y_pos = 10 # default y position, will be updated every menu printed by 10  
   # Clear the screen  
   oled.fill_rect(0, 9, 128, 55, 0)  
   # Create the working index  
   # It can only have a value of 0 to len(menus)-1  
   working_idx += rotary_dir  
   if working_idx < 0:  
     working_idx = 0  
   elif working_idx > len(menus) - 1:  
     working_idx = len(menus) - 1  
   # Create the selected menu  
   # It can only have a value of  
   # 0, 1, 2, 3, 4  
   # to create 5 lines of menus  
   if working_idx > 1 and working_idx < len(menus)-2:  
     sel_menu_idx = 2  
   elif working_idx == len(menus)-2:  
     sel_menu_idx = 3  
   elif working_idx == len(menus)-1:  
     sel_menu_idx = 4  
   else:  
     sel_menu_idx = working_idx  
   if working_idx < 2:  
     menu_idx = 0  
   elif working_idx > len(menus)-NUM_MENU_LINE + 1:  
     menu_idx = len(menus)-NUM_MENU_LINE  
   else:  
     menu_idx = working_idx - 2  
   for i in range(menu_idx, len(menus), 1):  
     if print_cnt < NUM_MENU_LINE:  
       if print_cnt == sel_menu_idx:  
         #oled.fill_rect(x, y, w, h, col)  
         oled.fill_rect(0, ( ( ( sel_menu_idx + 1 ) * 10 ) -1 ), 128, 9, 1)  
         oled.text(menus[i], menu_x_pos, menu_y_pos, 0)  
       else:  
         oled.text(menus[i], menu_x_pos, menu_y_pos, 1)  
       oled.show()  
       menu_y_pos+=10  
       print_cnt+=1  
 # Prints the header  
 oled.text('Rotary Encoder:', 0, 0)   
 # Prints the initial menus  
 print_menu()  
 while True:  
   if ticks_ms() - prev_time >= 200:  
     val_new = r.value()  
     if val_old != val_new:  
       if val_old == 0 and val_new == 19:  
         val_dif = -1  
       elif val_old == 19 and val_new == 0:  
         val_dif = 1  
       else:  
         val_dif = val_new - val_old  
       print_menu(val_dif)  
       val_old = val_new  
     if rsw.value()==1:  
       if working_idx==0: # Blink LED  
         isBlinkLED = not isBlinkLED  
         isActiveLED = False  
         if isBlinkLED:  
           oled.fill_rect(0, 9, 128, 55, 0)  
           msg = 'Blinking LED'  
           print('Status: {}'.format(msg))  
           oled.text(msg, 63-len(msg)*8//2, 40)  
           oled.show()  
         else:  
           print_menu()  
       elif working_idx==1: # Activate LED  
         isActiveLED = not isActiveLED  
         isBlinkLED = False  
         if isActiveLED:  
           oled.fill_rect(0, 9, 128, 55, 0)  
           msg = 'LED activated'  
           print('Status: {}'.format(msg))  
           oled.text(msg, 63-len(msg)*8//2, 40)  
           oled.show()  
         else:  
           print_menu()  
       elif working_idx==2: # Invert OLED  
         isInvertOLED = not isInvertOLED  
         oled.invert(isInvertOLED)  
         oled.show()  
       elif working_idx==3: # Display Time  
         isDisplayTime = not isDisplayTime  
         isDisplayDate = False  
         isDisplayWkday = False  
         if isDisplayTime:  
           oled.fill_rect(0, 9, 128, 55, 0)  
           t = rtc.datetime()  
           time = '{:02d}:{:02d}'.format(t[4],t[5])  
           print('Time: {}'.format(time))  
           oled.text(time, 63-len(time)*8//2, 40)  
           oled.show()  
         else:  
           print_menu()  
       elif working_idx==4: # Display Date  
         isDisplayTime = False  
         isDisplayDate = not isDisplayDate  
         isDisplayWkday = False  
         if isDisplayDate:  
           oled.fill_rect(0, 9, 128, 55, 0)  
           t = rtc.datetime()  
           date = '{:04d}-{:02d}-{:02d}'.format(t[0],t[1],t[2])  
           print('Date: {}'.format(date))  
           oled.text(date, 63-len(date)*8//2, 40)  
           oled.show()  
         else:  
           print_menu()  
       elif working_idx==5: # Display Weekday  
         isDisplayTime = False  
         isDisplayDate = False  
         isDisplayWkday = not isDisplayWkday  
         if isDisplayWkday:  
           oled.fill_rect(0, 9, 128, 55, 0)  
           t = rtc.datetime()  
           if t[3]==0:  
             wkday = 'Monday'  
           elif t[3]==1:  
             wkday = 'Tuesday'  
           elif t[3]==2:  
             wkday = 'Wednesday'  
           elif t[3]==3:  
             wkday = 'Thursday'  
           elif t[3]==4:  
             wkday = 'Friday'  
           elif t[3]==5:  
             wkday = 'Saturday'  
           elif t[3]==6:  
             wkday = 'Sunday'  
           print('Weekday: {}'.format(wkday))  
           oled.text(wkday, 63-len(wkday)*8//2, 40)  
           oled.show()  
         else:  
           print_menu()  
     if isBlinkLED:  
       led.value(not led.value())  
     elif isActiveLED:  
       led.value(1)  
     else:  
       led.value(0)  
     prev_time = ticks_ms()  

```

### **3. rotary.py:**

```py { lineNos="true" wrap="true" }

 # The MIT License (MIT)  
 # Copyright (c) 2020 Mike Teachman  
 # https://opensource.org/licenses/MIT  
 # Platform-independent MicroPython code for the rotary encoder module  
 # Documentation:  
 #  https://github.com/MikeTeachman/micropython-rotary  
 import micropython  
 _DIR_CW = const(0x10) # Clockwise step  
 _DIR_CCW = const(0x20) # Counter-clockwise step  
 # Rotary Encoder States  
 _R_START = const(0x0)  
 _R_CW_1 = const(0x1)  
 _R_CW_2 = const(0x2)  
 _R_CW_3 = const(0x3)  
 _R_CCW_1 = const(0x4)  
 _R_CCW_2 = const(0x5)  
 _R_CCW_3 = const(0x6)  
 _R_ILLEGAL = const(0x7)  
 _transition_table = [  
   # |------------- NEXT STATE -------------|      |CURRENT STATE|  
   # CLK/DT  CLK/DT   CLK/DT  CLK/DT  
   #  00    01     10    11  
   [_R_START, _R_CCW_1, _R_CW_1, _R_START],       # _R_START  
   [_R_CW_2, _R_START, _R_CW_1, _R_START],       # _R_CW_1  
   [_R_CW_2, _R_CW_3, _R_CW_1, _R_START],       # _R_CW_2  
   [_R_CW_2, _R_CW_3, _R_START, _R_START | _DIR_CW],  # _R_CW_3  
   [_R_CCW_2, _R_CCW_1, _R_START, _R_START],       # _R_CCW_1  
   [_R_CCW_2, _R_CCW_1, _R_CCW_3, _R_START],       # _R_CCW_2  
   [_R_CCW_2, _R_START, _R_CCW_3, _R_START | _DIR_CCW], # _R_CCW_3  
   [_R_START, _R_START, _R_START, _R_START]]       # _R_ILLEGAL  
 _transition_table_half_step = [  
   [_R_CW_3,      _R_CW_2, _R_CW_1, _R_START],  
   [_R_CW_3 | _DIR_CCW, _R_START, _R_CW_1, _R_START],  
   [_R_CW_3 | _DIR_CW, _R_CW_2, _R_START, _R_START],  
   [_R_CW_3,      _R_CCW_2, _R_CCW_1, _R_START],  
   [_R_CW_3,      _R_CW_2, _R_CCW_1, _R_START | _DIR_CW],  
   [_R_CW_3,      _R_CCW_2, _R_CW_3, _R_START | _DIR_CCW]]  
 _STATE_MASK = const(0x07)  
 _DIR_MASK = const(0x30)  
 def _wrap(value, incr, lower_bound, upper_bound):  
   range = upper_bound - lower_bound + 1  
   value = value + incr  
   if value < lower_bound:  
     value += range * ((lower_bound - value) // range + 1)  
   return lower_bound + (value - lower_bound) % range  
 def _bound(value, incr, lower_bound, upper_bound):  
   return min(upper_bound, max(lower_bound, value + incr))  
 def _trigger(rotary_instance):  
   for listener in rotary_instance._listener:  
     listener()  
 class Rotary(object):  
   RANGE_UNBOUNDED = const(1)  
   RANGE_WRAP = const(2)  
   RANGE_BOUNDED = const(3)  
   def __init__(self, min_val, max_val, reverse, range_mode, half_step):  
     self._min_val = min_val  
     self._max_val = max_val  
     self._reverse = -1 if reverse else 1  
     self._range_mode = range_mode  
     self._value = min_val  
     self._state = _R_START  
     self._half_step = half_step  
     self._listener = []  
   def set(self, value=None, min_val=None,  
       max_val=None, reverse=None, range_mode=None):  
     # disable DT and CLK pin interrupts  
     self._hal_disable_irq()  
     if value is not None:  
       self._value = value  
     if min_val is not None:  
       self._min_val = min_val  
     if max_val is not None:  
       self._max_val = max_val  
     if reverse is not None:  
       self._reverse = -1 if reverse else 1  
     if range_mode is not None:  
       self._range_mode = range_mode  
     self._state = _R_START  
     # enable DT and CLK pin interrupts  
     self._hal_enable_irq()  
   def value(self):  
     return self._value  
   def reset(self):  
     self._value = 0  
   def close(self):  
     self._hal_close()  
   def add_listener(self, l):  
     self._listener.append(l)  
   def remove_listener(self, l):  
     if l not in self._listener:  
       raise ValueError('{} is not an installed listener'.format(l))  
     self._listener.remove(l)  
   def _process_rotary_pins(self, pin):  
     old_value = self._value  
     clk_dt_pins = (self._hal_get_clk_value() <<  
             1) | self._hal_get_dt_value()  
     # Determine next state  
     if self._half_step:  
       self._state = _transition_table_half_step[self._state &  
                            _STATE_MASK][clk_dt_pins]  
     else:  
       self._state = _transition_table[self._state &  
                       _STATE_MASK][clk_dt_pins]  
     direction = self._state & _DIR_MASK  
     incr = 0  
     if direction == _DIR_CW:  
       incr = 1  
     elif direction == _DIR_CCW:  
       incr = -1  
     incr *= self._reverse  
     if self._range_mode == self.RANGE_WRAP:  
       self._value = _wrap(  
         self._value,  
         incr,  
         self._min_val,  
         self._max_val)  
     elif self._range_mode == self.RANGE_BOUNDED:  
       self._value = _bound(  
         self._value,  
         incr,  
         self._min_val,  
         self._max_val)  
     else:  
       self._value = self._value + incr  
     try:  
       if old_value != self._value and len(self._listener) != 0:  
         micropython.schedule(_trigger, self)  
     except:  
       pass  

```

### **4. rotary\_irq.py (rotary\_irq\_esp.py):**

```py { lineNos="true" wrap="true" }

 # The MIT License (MIT)  
 # Copyright (c) 2020 Mike Teachman  
 # https://opensource.org/licenses/MIT  
 # Platform-specific MicroPython code for the rotary encoder module  
 # ESP8266/ESP32 implementation  
 # Documentation:  
 #  https://github.com/MikeTeachman/micropython-rotary  
 from machine import Pin  
 from rotary import Rotary  
 from sys import platform  
 _esp8266_deny_pins = [16]  
 class RotaryIRQ(Rotary):  
   def __init__(self, pin_num_clk, pin_num_dt, min_val=0, max_val=10,  
          reverse=False, range_mode=Rotary.RANGE_UNBOUNDED, pull_up=False, half_step=False):  
     if platform == 'esp8266':  
       if pin_num_clk in _esp8266_deny_pins:  
         raise ValueError(  
           '%s: Pin %d not allowed. Not Available for Interrupt: %s' %  
           (platform, pin_num_clk, _esp8266_deny_pins))  
       if pin_num_dt in _esp8266_deny_pins:  
         raise ValueError(  
           '%s: Pin %d not allowed. Not Available for Interrupt: %s' %  
           (platform, pin_num_dt, _esp8266_deny_pins))  
     super().__init__(min_val, max_val, reverse, range_mode, half_step)  
     if pull_up == True:  
       self._pin_clk = Pin(pin_num_clk, Pin.IN, Pin.PULL_UP)  
       self._pin_dt = Pin(pin_num_dt, Pin.IN, Pin.PULL_UP)  
     else:  
       self._pin_clk = Pin(pin_num_clk, Pin.IN)  
       self._pin_dt = Pin(pin_num_dt, Pin.IN)  
     self._enable_clk_irq(self._process_rotary_pins)  
     self._enable_dt_irq(self._process_rotary_pins)  
   def _enable_clk_irq(self, callback=None):  
     self._pin_clk.irq(  
       trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING,  
       handler=callback)  
   def _enable_dt_irq(self, callback=None):  
     self._pin_dt.irq(  
       trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING,  
       handler=callback)  
   def _disable_clk_irq(self):  
     self._pin_clk.irq(handler=None)  
   def _disable_dt_irq(self):  
     self._pin_dt.irq(handler=None)  
   def _hal_get_clk_value(self):  
     return self._pin_clk.value()  
   def _hal_get_dt_value(self):  
     return self._pin_dt.value()  
   def _hal_enable_irq(self):  
     self._enable_clk_irq(self._process_rotary_pins)  
     self._enable_dt_irq(self._process_rotary_pins)  
   def _hal_disable_irq(self):  
     self._disable_clk_irq()  
     self._disable_dt_irq()  
   def _hal_close(self):  
     self._hal_disable_irq()  

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. Rotary Encoder library:
<https://github.com/miketeachman/micropython-rotary>

