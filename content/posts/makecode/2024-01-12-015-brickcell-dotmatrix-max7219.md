---
title: 015 - Brickcell 8x8 Dot Matrix Display | MakeCode Microbit
url: /2024/01/12/brickcell_dotmatrix8x8_max7219/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: "2024-01-12T10:20:00+08:00"
tags:
  - MakeCode
  - microbit
  - max7219
  - 8x8 dot matrix display
---

## **Introduction**

The MAX7219 is a serially interfaced, common-cathode LED display driver. It is often used to control dot matrix displays or seven-segment displays. The MAX7219 is designed to drive up to 64 individual LEDs, and it uses a 16-bit shift register and constant-current LED drive to minimize the number of required external components.

When it comes to dot matrix displays, the MAX7219 is commonly used to control 8x8 LED matrices. In the context of an 8x8 dot matrix display, it means there are 8 rows and 8 columns of LEDs, resulting in a total of 64 LEDs. The MAX7219 simplifies the process of controlling and multiplexing these LEDs.

Some key features of the MAX7219 include:

SPI Interface: It communicates using a simple serial interface that allows you to daisy-chain multiple MAX7219s together, reducing the number of pins required to control multiple displays.

Multiplexing: The MAX7219 uses multiplexing to control multiple LEDs with a relatively small number of pins. It cycles through the rows of the display quickly, creating the illusion that all LEDs are on simultaneously.

Brightness Control: It provides a way to control the brightness of the LEDs through digital means, allowing you to adjust the intensity of the display.

Cascading: Multiple MAX7219s can be connected in series to control larger displays or multiple displays.

When building projects with LED matrices, such as scrolling text displays, clocks, or other visualizations, the MAX7219 is a popular choice due to its ease of use and efficient design. Programming it usually involves sending the appropriate data to the device through the serial interface to control the desired patterns on the LED matrix.

## **Hardware Instruction**

Let's explore how to connect the Dot Matrix Display module with SPI interface (MAX7219) to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the MAX7219 Dot Matrix display GND pin to microbit GND pin.
2. Connect the MAX7219 Dot Matrix display VCC pin to microbit 3V3 pin.
3. Connect the MAX7219 Dot Matrix display serial data input pin (DIN) to microbit pin 15.
4. Connect the MAX7219 Dot Matrix display serial clock pin (CLK) to microbit pin 14.
5. Connect the MAX7219 Dot Matrix display chip select pin (CS) to microbit pin 13.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the 8x8 MAX7219 Dot Matrix display module.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "dotmatrix-8x8-max7219-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-dotmatrix-max7219/](https://github.com/gbantique/brickcell-dotmatrix-max7219/) on the search bar.
5. Select the "brickcell-dotmatrix-max7219" from the search results. The "dotmatrix max7219" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
let max7219 = Brickcell.create()
max7219.setup(
    1,
    DigitalPin.P15,
    DigitalPin.P14,
    DigitalPin.P13,
    DigitalPin.P16,
    max7219_rotation_direction.clockwise,
    true
)
basic.forever(function () {
    max7219.scrollText(
        "Brickcell 8x8 Dot Matrix Display",
        150,
        300
    )
})
```

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S88323-04917-57323-26509" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S88323-04917-57323-26509/](https://makecode.microbit.org/S88323-04917-57323-26509/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to see a scrolling text "Brickcell 8x8 Dot Matrix Display".

