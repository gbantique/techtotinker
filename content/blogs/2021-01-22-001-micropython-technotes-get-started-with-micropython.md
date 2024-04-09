---
author: George Bantique
categories:
  - GorillaCell
date: '2021-01-22T14:22:00+08:00'
excerpt: In this article, I will guide you on how to get started with MicroPython using an ESP32.
series:
  - MicroPython TechNotes
title: '001 - MicroPython TechNotes: Get Started with MicroPython'
url: /2021/01/22/001-micropython-technotes-get-started-with-micropython/
---

## **Introduction**

In this article, I will guide you on how to get started with MicroPython using an ESP32.

I divided the procedure in to 3 simple steps as follows:

1. ESP32 USB driver installation.
2. Thonny Python IDE installation.
3. Flashing the ESP32 with MicroPython firmware.

So without further delays, lets dive in.

**1. ESP32 USB Driver Installation:**

 Most of ESP32 development board comes with CP210x USB to Serial bridge chip.

 a. Lets download it by going to <https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers>.

 b. Go to Downloads section.

 c. and download the latest USB driver available according to your Operating System.

 d. After the download completion, install it and just accept and follow through.

**2. Thonny Python IDE installation:**

 I choose Thonny because of its user friend interface besides it looks beautiful.

 a. Download Thonny by going to <https://thonny.org/> and click your Operating System.

 b. After the download completion, just install it and just accept whatever it have.

**3. Flashing the ESP32 with MicroPython firmware:**

 ESP32 is not preconfigured with MicroPython, that’s why we need to install it.

 a. Download the latest MicroPython firmware by going to <http://micropython.org/download/>

 b. At the bottom part of the webpage, look for Generic ESP32 module and click it.

 c. There are 2 supported MicroPython firmware for ESP32, one is ESP-IDF v3.x which supports all the ESP32 peripherals while ESP-IDF v4.x does not. I recommend to use v3.x and click the latest stable firmware to download it. In my case its,

- GENERIC : [esp32-idf3-20200902-v1.13.bin](http://micropython.org/resources/firmware/esp32-idf3-20200902-v1.13.bin)

 d. After the downloads, open the Thonny IDE.

 e. Flash the ESP32 with new MicroPython firmware by clicking the Tools menu.

 f. Select “Options”

 g. Under the “Interpreter” tab, click “Install or update firmware”.

 h. Under the “Port”, look for “CP210x” and select it.

 i. Under the “Firmware”, click “Browse” and select the download MicroPython firmware.

 j. In the Flash mode, select “From image file(keep)”.

 k. and make sure that “Erase flash before installing” is checked.

 l. Click Install.

If everything goes accordingly, you should now be ready to start programming your ESP32 with MicroPython. Congratulations.

![](/images/001-technotes-firmware-techtotinker.png)


## **Video Demonstration**

{{< youtube GL7cJ5kawjk >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **References And Credits**

1. Purchased your GorillaCell ESP32 Development kit at: 
[gorillacell.kr/](http://gorillacell.kr/)

