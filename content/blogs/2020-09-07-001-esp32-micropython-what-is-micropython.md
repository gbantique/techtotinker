---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-09-07T14:45:00+08:00'
tags:
  - esp32 micropython
  - micropython for esp32
series:
  - ESP32 MicroPython
title: '001 - ESP32 MicroPython: What is MicroPython'
url: /2020/09/07/001-esp32-micropython-what-is-micropython/
---

## **Introduction**

MicroPython is essentially a Python created for microcontrollers.

MicroPython is a light-weight and compact implementation of Python Programming Language. It is stripped and trimmed down in order to work with embedded devices which basically has limited resources.

And with the help of machine modules, we can easily communicate with the hardware input and output devices.

![](/imaages/MicroPythonVSCpp.png)

So how does the MicroPython works? as you may asked.
1. In MicroPython, the source code is created and/or edited in the computer using an Editor like Thonny Python which is the same as in Arduino traditional programming using an Arduino IDE.
2. In MicroPython, the code is stored inside the microcontrollers flash memory while in Arduino the code is stored in your computer.
3. In MicroPython, the source code compilation happens inside the microcontroller or much better to call it source code interpretation. The Python interpreter converts the source code into byte code and store it in the Random Access Memory and consequently executes the program which all happens in runtime while in Arduino, the source code compilation happens in computer. The Cpp compiler converts code in to machine code. The machine code is transfered to microcontroller through serial interface and written to flash memory. Flash memory is overwritten everytime source code is uploaded.
4. In MicroPython, the time it takes from code compilation until execution is very minimal and virtually executes immediately. And because MicroPython is an interpreted language, when you modified your source code it doesn’t need to compile everything it just need to modify a portion according to change in source code while in Arduino, everytime you modified your source code, you also need to recompile everything in order for the modification to take effect.

But since MicroPython is interpreted during the execution of the code, speed performance is not efficient while traditional programming has the advantage in using machine code level.

Another cool feature of MicroPython is the addition of REPL. REPL stands for Read-Evaluate-Print-Loop. REPL allows you to connect to development board and be able to test a code without any need of compiling.

REPL take advantage of the UART serial interface which is commonly included to almost all embedded devices available in the market.

## **Video Demonstration:**

{{< youtube eHf76lzPbdU >}}

Thank you.

