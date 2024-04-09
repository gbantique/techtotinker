---
title: 006 - Brickcell Weight HX711 | MakeCode Microbit
url: /2023/10/04/brickcell_weight_hx711/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-04T15:47:00+08:00'
tags:
  - MakeCode
  - microbit
  - weight sensor
  - load cell
  - hx711
---


## **Introduction**

The HX711 is a precision 24-bit analog-to-digital converter (ADC) designed for weigh scales and industrial control applications. It is commonly used to interface with load cells, which are sensors used to measure weight or force. The HX711 load cell amplifier provides a stable and accurate digital output of the load cell's signal, making it suitable for applications like kitchen scales, industrial weighing systems, and more.

## **Hardware Instruction**

Let's explore how to connect the HX711 weight sensor to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the Weight sensor GND pin to microbit GND pin.
2. Connect the Weight sensor VCC pin to microbit VCC pin.
3. Connect the Weight sensor data pin (DAT) to microbit pin 0.
4. Connect the Weight sensor clock pin (SCL) to microbit pin 1.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the HX711 weight sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "weight-hx711-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-weight-hx711/](https://github.com/gbantique/brickcell-weight-hx711/) on the search bar.
5. Select the "brickcell-weight-hx711" from the search results. The "weight hx711" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
Brickcell.initHX711(DigitalPin.P0, DigitalPin.P1)
serial.setBaudRate(BaudRate.BaudRate115200)
serial.writeLine("Setup done.")
basic.forever(function () {
    serial.writeString("Weight: ")
    serial.writeLine(Brickcell.readWeight())
    basic.pause(1000)
})
```
7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S23983-69246-99555-78181" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S23983-69246-99555-78181/](https://makecode.microbit.org/S23983-69246-99555-78181/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the measured weight in milligrams on the serial terminal every 1000 milliseconds.

---
If you want to used the LCD:
1. Add the extension of LCD and the Weight Sensor from the following:
   [https://github.com/gbantique/brickcell-lcd-i2c/](https://github.com/gbantique/brickcell-lcd-i2c/)
   and
   [https://github.com/gbantique/brickcell-weight-hx711/](https://github.com/gbantique/brickcell-weight-hx711/)
2. Copy and paste the following code:
```ts
Brickcell.init(0);
Brickcell.initHX711(DigitalPin.P0, DigitalPin.P1);
Brickcell.set_multiplier(423);
basic.forever(function () {
    Brickcell.ShowString(Brickcell.readWeight(), 0, 0);
    basic.pause(1000);
})
```

---
For calibration:
Adjust number "423" in the Brickell.set_multiplier(423) until you get accurate readings.

