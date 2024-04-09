---
title: 010 - Brickcell Gyro MPU6050 | MakeCode Microbit
url: /2023/10/08/brickcell_gyro_mpu6050/
author: George Bantique
series:
  - MakeCode, Microbit, Brickcell
categories:
  - MakeCode
  - microbit
date: '2023-10-08T18:30:00+08:00'
tags:
  - MakeCode
  - microbit
  - mpu6050
---


## **Introduction**

The MPU6050 is a sensor module used in electronics and robotics. It combines a 3-axis accelerometer and a 3-axis gyroscope in a single package. This combination of sensors allows it to measure both linear motion (acceleration) and rotational motion (angular velocity) in three dimensions each. It is commonly used in projects involving motion tracking, orientation sensing, and stabilization applications.

The MPU6050 communicates with microcontrollers or other devices through interfaces like I2C (Inter-Integrated Circuit) or SPI (Serial Peripheral Interface) though only I2C is enabled in Brickcell kit. It's widely used in applications such as drones, quadcopters, gaming controllers, and wearable devices to sense motion and orientation.

## **Hardware Instruction**

Let's explore how to connect the MPU6050 sensor to a micro:bit microcontroller and utilize MakeCode for programming.

1. Connect the MPU6050 GND pin to microbit GND pin.
2. Connect the MPU6050 VCC pin to microbit VCC pin.
3. Connect the MPU6050 serial data pin (SDA) to microbit pin 20.
4. Connect the MPU6050 serial clock pin (SCL) to microbit pin 19.

## **Software Instruction**

Now, let's start into programming the micro:bit to utilize the VL53L0X TOF distance sensor.

1. Login to [https://makecode.microbit.org/](https://makecode.microbit.org/) using your Microsoft account.
2. Create a new project by clicking the "New Project" button. You may name it anything you want, I suggest to name it with descriptive name such as "gyro-mpu6050-test".
3. Click the "Extensions" block just under the "Math" block.
4. Type [https://github.com/gbantique/brickcell-gyro-mpu6050/](https://github.com/gbantique/brickcell-gyro-mpu6050/) on the search bar.
5. Select the "brickcell-gyro-mpu6050" from the search results. The "gyro mpu6050" block should appear under the "Brickcell" block.
6. Copy the code provided below.

```ts
// Initialize sensor for usage
Brickcell.initMPU6050()

while (true) {
    // Output gyroscope values
    serial.writeLine("X Gyroscope: " + Brickcell.gyroscope(axisXYZ.x, gyroSen.range_250_dps) + " rad/s");
    serial.writeLine("Y Gyroscope: " + Brickcell.gyroscope(axisXYZ.y, gyroSen.range_250_dps) + " rad/s");
    serial.writeLine("Z Gyroscope: " + Brickcell.gyroscope(axisXYZ.z, gyroSen.range_250_dps) + " rad/s");
    serial.writeLine("-----------------------------------------------------------------------------");

    // Output angle values
    serial.writeLine("X Angle: " + Brickcell.axisRotation(axisXYZ.x, accelSen.range_2_g) + " Degree");
    serial.writeLine("Y Angle: " + Brickcell.axisRotation(axisXYZ.y, accelSen.range_2_g) + " Degree");
    serial.writeLine("Z Angle: " + Brickcell.axisRotation(axisXYZ.z, accelSen.range_2_g) + " Degree");
    serial.writeLine("-----------------------------------------------------------------------------");

    // Output acceleration values
    serial.writeLine("X Acceleration: " + Brickcell.axisAcceleration(axisXYZ.x, accelSen.range_2_g) + " g");
    serial.writeLine("Y Acceleration: " + Brickcell.axisAcceleration(axisXYZ.y, accelSen.range_2_g) + " g");
    serial.writeLine("Z Acceleration: " + Brickcell.axisAcceleration(axisXYZ.z, accelSen.range_2_g) + " g");
    serial.writeLine("-----------------------------------------------------------------------------");

    // Output temperature value
    serial.writeLine("Temperature: " + Brickcell.readTemperature() + " C");
    serial.writeLine("-----------------------------------------------------------------------------");
    pause(2000)
}
```
7. Open a Serial Monitor such as Termite terminal app [https://www.compuphase.com/software_termite.htm/](https://www.compuphase.com/software_termite.htm/). Set the baud rate to 115200 bps.

**Or you make a copy of my created project in your MakeCode workspace.**

<div style="position:relative;height:0;padding-bottom:70%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.microbit.org/#pub:S44876-90738-59137-62113" frameborder="0" sandbox="allow-popups allow-forms allow-scripts allow-same-origin"></iframe></div>

[https://makecode.microbit.org/S44876-90738-59137-62113/](https://makecode.microbit.org/S44876-90738-59137-62113/)

## **Expected Result**

If you carefully follow the provided instruction above, you should be able to view the measured gyroscope, angle, and acceleration on the serial terminal every 2000 milliseconds.


