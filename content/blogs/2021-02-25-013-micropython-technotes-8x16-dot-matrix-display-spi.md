---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-02-25T15:48:00+08:00'
excerpt: In this article, we will look at the 8×16 Dot Matrix Display with SPI as communication interface. This is basically the continuation of the previous tutorial on how to use the 8×8 Matrix Display.
tags:
  - ESP32 8×16 dot matrix
  - esp32 micropython
  - How to use dot matrix display in MicroPython
  - MicroPython 8×16 dot matrix
  - micropython max7219
series:
  - MicroPython TechNotes
title: '013 - MicroPython TechNotes: 8x16 Dot Matrix Display (SPI)'
url: /2021/02/25/013-micropython-technotes-8x16-dot-matrix-display-spi/
---

## **Introduction**

![](/images/013-technotes-8x16-dot-matrix-spi.png)

In this article, we will look at the 8×16 Dot Matrix Display with SPI as communication interface. This is basically the continuation of the previous tutorial on how to use the 8×8 Matrix Display.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 5-pin female-female dupont jumper wires.
4. 8×16 Dot Matrix display – SPI interface.

## **Pinout**

1. **GND** – for the ground.
2. **VCC** – for the supply voltage.
3. **DIN** – for the SPI data input pin.
4. **CLK** – for the SPI clock pin.
5. **CS** – for the SPI chip select pin.

## **Hardware Instruction**

1. Attach ESP32 dev board on top of ESP32 shield and make sure that both USB port is on the same side.
2. Attach the dupont wires to the 8×16 dot matrix display according to the color coding which is black for the ground, red for the VCC, yellow for the DIN pin, white for the CLK pin, and blue for the CS pin.
3. Attach the other side of the dupont jumper wires to the pin headers of ESP32 shield by matching its colors that is black to black, red to red, yellow and the following colors to yellow pin headers.
4. Power the ESP32 shield by connecting an external power supply with a type-C USB connector and make sure that the power switch is slide to ON state.
5. Connect the ESP32 to the computer through the micro USB cable. The demo circuit should now be ready.

## **Software Instruction**

1. Save the max7219.py driver library below from the SOURCE CODE section of this blog post to the ESP32 MicroPython device root directory.
2. Enjoy learning by trying the example source codes.
3. Further the learning process by modifying it according to your liking.

## **Video Demonstration**

{{< youtube ziKCOOLO9IA >}}

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
display = Max7219(16, 8, spi, cs, False)


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

### 2. Example # 2, binary clock:

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
 display = Max7219(16, 8, spi, cs, False)  
 counter = 0  
 isCountUp = True  
 while True:  
   # count up  
   if isCountUp:  
     if counter < 99:  
       counter += 1  
       if counter == 99:  
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

### 3. max7219.py Dot Matrix Display driver library:

```py { lineNos="true" wrap="true" }
from machine import Pin, SPI, RTC
from max7219 import Max7219
from time import sleep

spi = SPI(1,
          baudrate=10000000,
          polarity=1,
          phase=0,
          sck=Pin(19),
          mosi=Pin(23))
cs = Pin(18, Pin.OUT)
display = Max7219(8, 8, spi, cs, True)

rtc = RTC() 
rtc.datetime((2021, 2, 14, 7, 18, 11, 0, 0)) 
# rtc.datetime((YYYY, MM, DD, WD, HH, MM, SS, MS)) 
# WD 1 = Monday 
# WD 7 = Sunday

def display_binary(decimal, column):
    # converts decimal number into 8-bit binary
    binary_str = '{0:8b}'.format(decimal)
    #print(binary_str)
    for row in range(0, 8):
        if binary_str[row] == '1':
            display.pixel(column, row, 1)
        else:
            display.pixel(column, row, 0)

while True:
    t = rtc.datetime()
    #display_binary(decimal value, dot matrix column)
    display_binary(t[0] % 100, 0)    # year
    display_binary(t[1], 1)          # month
    display_binary(t[2], 2)          # day
    display_binary(t[4], 4)          # hour
    display_binary(t[5], 5)          # minutes
    display_binary(t[6], 6)          # seconds
    display_binary(t[7] // 10000, 7) # subseconds
    display.show() # update the dot matrix display
    sleep(0.0001)  # 100ms wait

```

## **References And Credits**

1. Jeff Brown max7219.py:
[https://github.com/jgbrown32/ESP8266\_MAX7219](https://github.com/jgbrown32/ESP8266_MAX7219)

2. Gorillacell ESP32 dev kit purchase:
[gorillacell.kr](http://gorillacell.kr/)

