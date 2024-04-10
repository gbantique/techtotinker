---
title: 016 - Brickcell 8x16 Dot Matrix Display | MakeCode Microbit
url: /2024/01/12/brickcell_dotmatrix8x16_max7219/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: "2024-01-12T12:40:00+08:00"
tags:
  - MakeCode
  - microbit
  - max7219
  - 8x16 dot matrix display
toc: false
---

## **Introduction**

Please refer to [https://techtotinker.com/2024/01/12/brickcell_dotmatrix8x8_max7219/](https://techtotinker.com/2024/01/12/brickcell_dotmatrix8x8_max7219/)

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
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "dotmatrix-8x16-max7219-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-dotmatrix-max7219/](https://github.com/gbantique/brickcell-dotmatrix-max7219/) on the search bar.
5. Select the "brickcell-dotmatrix-max7219" from the search results. The "dotmatrix max7219" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
let max7219 = Brickcell.create()
max7219.setup(
2,
DigitalPin.P15,
DigitalPin.P14,
DigitalPin.P13,
DigitalPin.P16,
max7219_rotation_direction.counterclockwise,
true
)
basic.forever(function () {
    max7219.scrollText(
    "Brickcell 8x16 Dot Matrix Display",
    150,
    300
    )
})

```

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S95123-37868-60000-90667" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S95123-37868-60000-90667/](https://makecode.microbit.org/S95123-37868-60000-90667/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to see a scrolling text "Brickcell 8x16 Dot Matrix Display".

