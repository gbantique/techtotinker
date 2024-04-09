---
title: 007 - Brickcell Pressure BMP280 | MakeCode Microbit
url: /2024/10/05/brickcell_pressure_bmp280/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-05T16:20:00+08:00'
tags:
  - MakeCode
  - microbit
  - pressure sensor
  - bmp280
---


## **Introduction**

The BMP280 is a popular digital pressure sensor manufactured by Bosch Sensortec. It is commonly used to measure barometric pressure and temperature. 

It is capable of measuring pressure ranging from 300 hPa to 1100 hPa.

While the sensor is mainly designed to measure barometric pressure, it also comes with a built-in temperature sensor that can give you accurate temperature readings, typically in degrees Celsius (°C).

The Brickcell Development Kit comes 1 piece of BMP280 pressure sensor module which can be access through 0x76 I2C address.

## **Hardware Instruction**

Let's explore how to connect the BMP280 Pressure sensor to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the Pressure sensor GND pin to microbit GND pin.
2. Connect the Pressure sensor VCC pin to microbit VCC pin.
3. Connect the Pressure sensor serial data pin (SDA) to microbit pin 20.
4. Connect the Pressure sensor serial clock pin (SCL) to microbit pin 19.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the BMP280 pressure sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "pressure-bmp280-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-pressure-bmp280/](https://github.com/gbantique/brickcell-pressure-bmp280/) on the search bar.
5. Select the "brickcell-pressure-bmp280" from the search results. The "pressure bmp280" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
serial.setBaudRate(BaudRate.BaudRate115200)
let pressure = 0
let temperature = 0
basic.forever(function () {
    pressure = Brickcell.pressure()
    temperature = Brickcell.temperature()
    serial.writeNumber(pressure)
    serial.writeString(" hpa, ")
    serial.writeNumber(temperature)
    serial.writeLine(" C.")
    basic.pause(1000)
})
```
7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S51130-69783-82888-53560" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S51130-69783-82888-53560/](https://makecode.microbit.org/S51130-69783-82888-53560/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the measured pressure in hecto Pascal and temperature in degrees Celsius on the serial terminal every 1000 milliseconds.

