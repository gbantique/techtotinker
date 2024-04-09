---
title: 012 - Brickcell Rotary Encoder | MakeCode Microbit
url: /2023/10/11/brickcell_rotary_encoder/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: "2023-10-11T18:30:00+08:00"
tags:
  - MakeCode
  - microbit
  - rotary encoder
---

## **Introduction**

A rotary encoder is an electromechanical device used to convert the angular position or rotation of an object into an electrical signal. It's commonly used in various applications, such as measuring the position of knobs on electronic devices, controlling the movement of motors and machinery, or even in computer mice. Rotary encoders can be of two types: absolute and incremental.

The primary difference between absolute and incremental rotary encoders lies in how they represent and communicate the position or rotation information:

1. Absolute Rotary Encoder:

- Absolute encoders provide a unique digital code for each possible position in a full 360-degree rotation.
- They can directly indicate the exact position without the need for any additional reference point.
- When power is applied or when queried, they immediately report the absolute position.
- They are often used in applications where knowing the exact position is critical, such as in CNC machines or robotic arms.

2. Incremental Rotary Encoder:

- Incremental encoders generate pulse signals as the shaft rotates, and these pulses are counted to determine the relative position and direction of rotation.
- They do not provide information about the absolute position without a reference point (a starting position or "home" position).
- Incremental encoders are typically used in applications where relative movement or changes in position are more important than knowing the absolute position. For example, they are common in speed and distance measurements in vehicles.

In summary, absolute encoders give you the exact position at any moment, while incremental encoders give you information about relative changes in position and direction. The choice between the two types depends on the specific requirements of the application.

## **Hardware Instruction**

Let's explore how to connect the Rotary Encoder module to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the Rotary Encoder GND pin to microbit GND pin.
2. Connect the Rotary Encoder VCC pin to microbit 5V pin.
3. Connect the Rotary Encoder SA pin to microbit pin 0.
4. Connect the Rotary Encoder SB pin to microbit pin 1.
5. Connect the Rotary Encoder SW pin to microbit pin 2.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the Rotary Encoder module.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "rotary-encoder-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-rotary-encoder/](https://github.com/gbantique/brickcell-rotary-encoder/) on the search bar.
5. Select the "brickcell-rotary-encoder" from the search results. The "rotary encoder" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
Brickcell.onPress(function () {
  count = 0;
  serial.writeLine("" + count);
});
Brickcell.onRotate(RotationDirection.Right, function () {
  count += 1;
  serial.writeLine("" + count);
});
Brickcell.onRotate(RotationDirection.Left, function () {
  count += -1;
  serial.writeLine("" + count);
});
let count = 0;
Brickcell.initRotary(DigitalPin.P0, DigitalPin.P1, DigitalPin.P2);
serial.setBaudRate(BaudRate.BaudRate115200);
count = 0;
serial.writeLine("" + count);
```

7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S42524-23812-11415-25786" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S42524-23812-11415-25786/](https://makecode.microbit.org/S42524-23812-11415-25786/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view a counter value that has the following characteristics:

- increments by 1 everytime the rotary encoder is rotated to the right (clockwise rotation).
- decrements by 1 everytime the rotary encoder is rotated to the left (counter-clockwise rotation).
- resets to 0 everytime the rotary main shaft is push or press.
