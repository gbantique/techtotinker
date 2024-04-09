---
title: 001 - Brickcell LCD I2C | MakeCode Microbit
url: /2023/09/28/brickcell_lcd_i2c/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-09-28T11:25:00+08:00'
tags:
  - MakeCode
  - microbit
---


## **Introduction**

Brickcell Development Kit comes with an LCD module which is a 16x2 LCD module with an I2C interface.

It has an alphanumeric dot matrix display screen, an HD44780 display controller developed by Hitachi, and a PCF8574T I2C to GPIO expansion IC which converts parallel IO to I2C. The LCD module can be access through `0x20` I2C address.

### **Working Details**
- The I2C interface, can only work with 4-bit mode (no 8-bit mode support).
- Register Select (RS pin):
    * Data register - is a register that contains what is displayed in the LCD
    * Instruction register - is a register that contains instruction for the display controller.
- Read/Write (R/W pin):
    * Reading mode
    * Writing mode
- Enable pin
- Data bus (8 bits, bi-directional) pin

## **Hardware Instruction**

Let's explore how to connect the LCD I2C to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the LCD GND pin to microbit GND pin.
2. Connect the LCD VCC pin to microbit VCC pin.
3. Connect the LCD SDA pin to microbit pin 20.
4. Connect the LCD SCL pin to microbit pin 19.


## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the NTC temperature sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "lcd-i2c-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-lcd-i2c/](https://github.com/gbantique/brickcell-lcd-i2c/) on the search bar.
5. Select the "brickcell-lcd-i2c" from the search results. The "lcd i2c" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
let loopCount = 0
Brickcell.init(0)
Brickcell.ShowString("Brickcell", 0, 0)
basic.forever(function () {
    loopCount += 1
    Brickcell.ShowNumber(loopCount, 0, 1)
    basic.pause(1000)
})
```

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S97995-99534-94247-46039" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S97995-99534-94247-46039/](https://makecode.microbit.org/S97995-99534-94247-46039/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view a text character displayed in first line, the word "Brickell" and on the second line is counter value that increases every 1000 milliseconds.

---
## **References And Credits**

1. [https://docs.arduino.cc/learn/electronics/lcd-displays/](https://docs.arduino.cc/learn/electronics/lcd-displays/)

2. [https://www.playembedded.org/blog/hd44780-lcdii-and-chibioshal/](https://www.playembedded.org/blog/hd44780-lcdii-and-chibioshal/)

3. [http://www.matidavid.com/pic/LCD%20interfacing/introduction.htm/](http://www.matidavid.com/pic/LCD%20interfacing/introduction.htm/)
