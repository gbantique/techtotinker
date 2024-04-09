---
title: 008 - Brickcell Color TCS34725 | MakeCode Microbit
url: /2023/10/06/brickcell_color_tcs34725/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-06T15:10:00+08:00'
tags:
  - MakeCode
  - microbit
  - color sensor
  - tcs34725
---


## **Introduction**

The TCS34725 is a color sensor manufactured by a company called ams (formerly known as TAOS, Texas Advanced Optoelectronic Solutions). This sensor is designed to detect and measure the color of ambient light and objects. It can accurately determine the intensity of red, green, blue, and clear (unfiltered) light, allowing it to provide RGB color information.

The TCS34725 sensor is commonly used in various applications, including color sensing, color calibration, and ambient light adjustment. It is often used in electronics and robotics projects to enable devices to perceive and respond to colors in their environment.

## **Hardware Instruction**

Let's explore how to connect the TCS34725 RGB color sensor to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the Pressure sensor GND pin to microbit GND pin.
2. Connect the Pressure sensor VCC pin to microbit VCC pin.
3. Connect the Pressure sensor serial data pin (SDA) to microbit pin 20.
4. Connect the Pressure sensor serial clock pin (SCL) to microbit pin 19.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the TCS34725 rgb color sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "color-tcs34725-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-color-tcs34725/](https://github.com/gbantique/brickcell-color-tcs34725/) on the search bar.
5. Select the "brickcell-color-tcs34725" from the search results. The "color tcs34725" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
basic.forever(function () {
    serial.writeLine("R: " + Brickcell.getRed());
    serial.writeLine("G: " + Brickcell.getGreen());
    serial.writeLine("B: " + Brickcell.getBlue());
    serial.writeLine("");
    basic.pause(1000)
})
```
7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S09799-16651-64526-78642" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S09799-16651-64526-78642/](https://makecode.microbit.org/S09799-16651-64526-78642/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the measured color values of red, green, and blue on the serial terminal every 1000 milliseconds.


