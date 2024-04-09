---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-10-11T13:17:00+08:00'
tags:
  - esp32 micropython
  - how to use sim800l in micropython
  - micropython sim800l
  - MicroPython tutorials
  - sim800l micropython
  - sim800l micropython projects
series:
  - ESP32 MicroPython
title: '014 - ESP32 MicroPython: SIM800L GSM Module in MicroPython'
url: /2020/10/11/014-esp32-micropython-sim800l-gsm-module-in-micropython/
---

## **Introduction**

In this tutorial, we will tackle on how to interface SIM800L GSM module to ESP32 in MicroPython.

## **Circuit Diagram**

![](/images/sim800l_intro_mp.png)

## **Hardware Instruction**

1. Connect SIM800L Rx pin to ESP32 GPIO 16 (Tx2).
2. Connect SIM800L Tx pin to ESP32 GPIO 17 (Rx2).  
3. Connect the SIM800L VCC pin to external positive terminal. In this tutorial, I use external power supply through 1N4001 diode.  
4. Common ground all the ground pins. **Refer to this manual for the AT Commands:**

[https://www.elecrow.com/wiki/images/2/20/SIM800\_Series\_AT\_Command\_Manual\_V1.09.pdf](https://www.elecrow.com/wiki/images/2/20/SIM800_Series_AT_Command_Manual_V1.09.pdf)

## **Video Demonstration**

{{< youtube uKGD9oKQJSs >}}

## **Call To Action**

If you find this tutorial as helpful, please do Subscribe to my Youtube channel by clicking the following link: [Click this to Subscribe to TechToTinker Youtube channel.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead,  
George Bantique, TechToTinker

## **Source Code**

```py { lineNos="true" wrap="true" }
import machine
gsm = machine.UART(2, 115200)

#1. Check for the signal strength
gsm.write('AT+CSQ')

#2. Get the list of available network operators
gsm.write('AT+COPS=?')

#3. Determine the network operators the sim800l is currently registered
gsm.write('AT+COPS?')

#4. Determine if the sim800l is currently connected
gsm.write('AT+CREG?')

#5. Force it to connect
gsm.write('AT+CREG=1')

#6. Get the current battery level
gsm.write('AT+CBC')

#7. Turn off the echo of commands, 
# use ATE0 to turnoff and ATE1 to turnon.
gsm.write('ATE0')

```

