---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-05-24T15:30:00+08:00'
excerpt: In this article, I will talk about the STEPPER MOTOR with ESP32 using MicroPython.
tags:
  - ESP32 A4988
  - MicroPython A4988
  - MicroPython project
  - MicroPython step motor
  - MicroPython Stepper Motor
series:
  - MicroPython TechNotes
title: '036 - MicroPython TechNotes: Stepper Motor'
url: /2021/05/24/036-micropython-technotes-stepper-motor/
---

## **Introduction**

![](/images/036-2B-2BStep-2BMotor.png)

In this article, I will talk about the STEPPER MOTOR with ESP32 using MicroPython.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. Stepper motor set which is consist of (1) Stepper Motor Driver module, (2) generic stepper motor, (3) 9V external power supply, and the (4) wire connectors between the driver module and the stepper motor.
4. 16×2 LCD module
5. Rotary Encoder module
6. and of course dupont wires for attaching the said modules.

## **Pinout**

*Pinout of stepper module.*

1. **GND** – for the ground pin.
2. **VCC** – for the supply voltage for the A4988 driver chip.
3. **DIR** – for setting the direction of rotation. A value of logic 0, sets a clockwise direction while a value of logic 1, sets a counter-clockwise direction of rotation.
4. **STEP** – for enabling / disabling the power applied to the motor.
5. **Microstep Slide Switch:**
6. **Full-step:** it takes **200 steps** to complete 1 revolution.
7. **Half-step:** it takes **400 steps** to complete 1 revolution.

## **Hardware Instruction**

1. Attach the ESP32 board on top of the ESP32 shield and make sure that the USB port are on the same side.
2. Attach the dupont wires to the modules by following the color coding which is black for the ground, red for the VCC, and yellow and the following colors for the signal pins.
3. Attach the other end of the dupont wires to the ESP32 shield by matching the colors of the wires to the colors of the pin headers that is black to black, red to red, yellow and the following colors to the yellow pin headers.
4. Power the ESP32 shield with an external power supply through a type-C USB cable and make sure that the slide switch is set to ON state.
5. Connect the ESP32 to the computer by attaching a micro-USB cable.

## **Software Instruction**

1. Copy the source code provided below.
2. Please feel free to modify it according to your liking.
3. Enjoy and please let me know of your progress.

## **Video Demonstration**

{{< youtube rPOxbWIx8fk >}}

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

from machine import Pin
from time import sleep_ms
from time import sleep_us


def map(x, in_min, in_max, out_min, out_max): 
    return int((x - in_min) * (out_max - out_min) /
               (in_max - in_min) + out_min)
    
class GORILLACELL_STEPMOTOR:
    def __init__(self, step_pin, dir_pin):
        self.step = Pin(step_pin, Pin.OUT)
        self.dir = Pin(dir_pin, Pin.OUT)

    def rotate(self, angle=0, rotation='cw'):
        num_of_steps = map(angle, 0, 360, 0, 200)
        if rotation=='cw':
            self.dir.value(0)
            for i in range(0,num_of_steps,1):
               self.step.value(1)
               sleep_us(500)
               self.step.value(0)
               sleep_us(500)
        if rotation=='ccw':
            self.dir.value(1)
            for i in range(num_of_steps-1,-1,-1):
               self.step.value(1)
               sleep_us(500)
               self.step.value(0)
               sleep_us(500)       

stepper = GORILLACELL_STEPMOTOR(step_pin=19, dir_pin=18)


# The following lines of codes can be tested using the REPL:
# 1. To rotate the stepper motor in clockwise direction:
# stepper.rotate(360, 'cw')
# The first parameter, sets the angle of rotation
# The second parameter, sets the direction
# 2. To rotate it in counter clockwise direction:
# stepper.rotate(360, 'ccw')

```

### 2. Example # 2, controlling the step motor through a menu system displayed in the 16×2 and a rotary encoder for navigating the menu:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from time import ticks_ms
from time import sleep_ms
from time import sleep_us
from machine import SoftI2C
from i2c_lcd import I2cLcd
from rotary_irq import RotaryIRQ


def map(x, in_min, in_max, out_min, out_max): 
    return int((x - in_min) * (out_max - out_min) /
               (in_max - in_min) + out_min)
    
class GORILLACELL_STEPMOTOR:
    def __init__(self, step_pin, dir_pin):
        self.step = Pin(step_pin, Pin.OUT)
        self.dir = Pin(dir_pin, Pin.OUT)

    def rotate(self, angle=0, rotation='cw'):
        num_of_steps = map(angle, 0, 360, 0, 200)
        if rotation=='cw':
            self.dir.value(0)
            for i in range(0,num_of_steps,1):
               self.step.value(1)
               sleep_us(500)
               self.step.value(0)
               sleep_us(500)
        if rotation=='ccw':
            self.dir.value(1)
            for i in range(num_of_steps-1,-1,-1):
               self.step.value(1)
               sleep_us(500)
               self.step.value(0)
               sleep_us(500)       

led = Pin(2, Pin.OUT)
stepper = GORILLACELL_STEPMOTOR(step_pin=19, dir_pin=18)
i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000) 
lcd = I2cLcd(i2c, 0x20, 2, 16)
r = RotaryIRQ(pin_num_clk=32, 
              pin_num_dt=33, 
              min_val=0, 
              max_val=19, 
              reverse=True, 
              range_mode=RotaryIRQ.RANGE_WRAP)
rsw = Pin(34, Pin.IN)              
val_old = r.value()
isRotaryEncoder = False
isPress = False
working_idx = 0 # holds the menu index
curr_direction = 0 # 0-cw, 1-ccw
curr_angle = 360
curr_action = 0 # 0-do not execute, 1-execute

# get the current time
prev_time = ticks_ms()

menus = ['Edit Direction',
         'Edit Angle',
         'Set, Move!',
         'Freestyle']

# Prints a string of characters in the LCD
#    text - the string you want to print
#    x - x position
#    y - y position
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
    global curr_direction
    global curr_angle
    global curr_action

    
    # If the rotary value is less than -1 ie:-2,-3,etc:
    #    rotary value = -1
    # If the rotary value is more than 1:
    #    rotary value = 1
    # Else
    #    rotary value is not modified
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
            # Display current direction
            curr_dir = ""
            if curr_direction==0:
                curr_dir = "Clockwise"
            else: # curr_direction==1:
                curr_dir = "Anti-clockwise"
            print_line(curr_dir,1,1)
        elif working_idx==1:
            # Display current angle
            print_line(str(curr_angle),1,1)
        elif working_idx==2:
            curr_act = ""
            if curr_action==0:
                curr_act = "Status: Stop"
            else:
                curr_act = "Status: Go"
            print_line(curr_act,1,1)
        elif working_idx==3:
            print_line("Press it",1,1)
        else:
            print('where is this?')
    # CONFIGURATION MODE
    elif isPress==True:
        if working_idx==0:
            # Edit Direction
            if rotary_dir!=0:
                curr_direction = not curr_direction
            curr_dir = ""
            if curr_direction==0:
                curr_dir = "Clockwise"
            else: # curr_direction==1:
                curr_dir = "Anti-clockwise"
            print_line(curr_dir,1,1)
        elif working_idx==1:
            # Display current angle
            if rotary_dir!=0:
                curr_angle+=rotary_dir
            print_line(str(curr_angle),1,1) 
        elif working_idx==2:
            if rotary_dir!=0:
                curr_action = not curr_action
            curr_act = ""
            if curr_action==0:
                curr_act = "Status: Stop"
            else:
                curr_act = "Status: Go"
            print_line(curr_act,1,1)
        elif working_idx==3:
            if rotary_dir < 0:
                stepper.rotate(rotary_dir * -10, 'ccw')
            elif rotary_dir > 0:
                stepper.rotate(rotary_dir * 10, 'cw')  
        else:
            print('where is this?')
# Prints the initial menus
process_menu()

while True:
    if curr_action==1 and isSaved==True: # status: go
        curr_dir = ""
        if curr_direction==0: # cw
            curr_dir = "cw"
        else:
            curr_dir = "ccw"
        stepper.rotate(curr_angle, curr_dir)
        curr_action=0 # status: stop
        process_menu()    
    
    # Creates 200 ms interval
    if ticks_ms() - prev_time  >= 200:
        # Checks only for the switch when index is more than 2
        # If switch is press, toggle the state of isPress variable
        # If isPress is True, config for editing
        # If isPress is False back again, save the configs.
        if rsw.value()==1:
            isPress = not isPress

            if isPress==True:
                process_menu()
                isSaved=False
            if isPress==False and isSaved==False:
                isSaved=True
        
        # Read the rotary encoder values for processing
        val_new = r.value()
        if val_old != val_new:
            if val_old == 0 and val_new == 19:
                val_dif = -1
            elif val_old == 19 and val_new == 0:
                val_dif = 1
            else:
                val_dif = val_new - val_old
            print(val_dif)
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

### 3. **Copy the lcd\_api.py from:** 

<https://techtotinker.com/008-micropython-technotes-16×2-lcd/>

### **4. Copy the i2c\_lcd.py from:** 

<https://techtotinker.com/008-micropython-technotes-16×2-lcd/>

### **5. Copy the rotary.py from:** 

<https://techtotinker.com/027-micropython-technotes-rotary-encoder/>

### **6. Copy the rotary\_irq.py from:** 

<https://techtotinker.com/027-micropython-technotes-rotary-encoder/>

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

