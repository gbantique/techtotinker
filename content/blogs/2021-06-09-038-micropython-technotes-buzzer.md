---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2021-06-09T06:52:00+08:00'
excerpt: In this article, we will talk about the BUZZER module with ESP32 using MicroPython. A BUZZER module is basically an electrical device that converts electrical signal into an audible audio signal or a sound that we can hear. Typical uses of Buzzer are in alarms, user audio feedback, or to provide some kind of melodies.
tags:
  - Micropython Buzzer
  - Micropython esp32
  - MicroPython ESP8266
  - micropython pwm
  - MicroPython Raspberry Pi Pico
  - micropython sound
series:
  - MicroPython TechNotes
title: '038 - MicroPython TechNotes: Buzzer'
url: /2021/06/09/038-micropython-technotes-buzzer/
---

## **Introduction**

![](/images/038-2BMicroPython-2BTechNotes-2BBuzzer-2Bblog.png)

In this article, we will talk about the BUZZER module with ESP32 using MicroPython.

A BUZZER module is basically an electrical device that converts electrical signal into an audible audio signal or a sound that we can hear. Typical uses of Buzzer are in alarms, user audio feedback, or to provide some kind of melodies.

## **Pinout**

1. **G** – for the ground pin.
2. **V** – for the supply voltage.
3. **S** – for the signal pin.

## **Bill Of Materials**

1. ESP32 development board.
2. Gorillacell ESP32 shield.
3. 3-pin female-female dupont jumper wires.
4. Gorillacell buzzer moduel.

## **Hardware Instruction**

1. Provide power to the buzzer module through the G-pin and V-pin.
2. Attach the buzzer S-pin to ESP32 GPIO 23.

## **Software Instruction**

1. Copy the source code and paste it to your Thonny IDE and click the RUN button.
2. Modify it according to your liking and most of all, enjoy.

## **Video Demonstration**

{{< youtube QVA0SNsYSik >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

### 1. Example # 1, exploring the basics of controlling the buzzer through PWM:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import PWM
from time import sleep_ms

buzzer = PWM(Pin(23, Pin.OUT))
buzzer.init(freq=0, duty=0)

# ******************************************************************
# The following should be explored using the REPL:
# ******************************************************************
# # 1. To set a pwm frequency which denotes what musical note to play
# buzzer.freq(1047) # Play C note at 6th octave.
# 
# # 2. Set the volume by changing the pwm duty value
# buzzer.duty(512)
# 
# # 3. Let the sound ring for a certain duration
# sleep_ms(1000)
# 
# # 4. Turn off the pulse by setting the duty value to 0
# buzzer.duty(0)
# 
# # 5. Or play a different musical note, lets say C note at 2nd octave
# buzzer.init(freq=69, duty=512)
# sleep_ms(1000)
# buzzer.duty(0)
# 
# # 6. or play a C note at 8th octave
# buzzer.init(freq=4186, duty=512)
# sleep_ms(1000)
# buzzer.duty(0)
# 
# # 7. And to disable the pwm driver.
# buzzer.deinit()

```

### 2. Example # 2, play some popular melodies:

```py { lineNos="true" wrap="true" }
# More details can be found in TechToTinker.blogspot.com 
# George Bantique | tech.to.tinker@gmail.com

from machine import Pin
from machine import PWM
from time import sleep_ms


class GORILLACELL_BUZZER: 
    def __init__(self, sig_pin):
        self.pwm = PWM(Pin(sig_pin, Pin.OUT))
        
    def play(self, melodies, wait, duty):
        for note in melodies:
            self.pwm.freq(note)
            self.pwm.duty(duty)
            sleep_ms(wait)
        # Disable the pulse, setting the duty to 0
        self.pwm.duty(0)
        # Disconnect the pwm driver
        #self.pwm.deinit() # remove to play the next melodies

# Notes and its equivalent frequency
B0  = 31
C1  = 33
CS1 = 35
D1  = 37
DS1 = 39
E1  = 41
F1  = 44
FS1 = 46
G1  = 49
GS1 = 52
A1  = 55
AS1 = 58
B1  = 62
C2  = 65
CS2 = 69
D2  = 73
DS2 = 78
E2  = 82
F2  = 87
FS2 = 93
G2  = 98
GS2 = 104
A2  = 110
AS2 = 117
B2  = 123
C3  = 131
CS3 = 139
D3  = 147
DS3 = 156
E3  = 165
F3  = 175
FS3 = 185
G3  = 196
GS3 = 208
A3  = 220
AS3 = 233
B3  = 247
C4  = 262
CS4 = 277
D4  = 294
DS4 = 311
E4  = 330
F4  = 349
FS4 = 370
G4  = 392
GS4 = 415
A4  = 440
AS4 = 466
B4  = 494
C5  = 523
CS5 = 554
D5  = 587
DS5 = 622
E5  = 659
F5  = 698
FS5 = 740
G5  = 784
GS5 = 831
A5  = 880
AS5 = 932
B5  = 988
C6  = 1047
CS6 = 1109
D6  = 1175
DS6 = 1245
E6  = 1319
F6  = 1397
FS6 = 1480
G6  = 1568
GS6 = 1661
A6  = 1760
AS6 = 1865
B6  = 1976
C7  = 2093
CS7 = 2217
D7  = 2349
DS7 = 2489
E7  = 2637
F7  = 2794
FS7 = 2960
G7  = 3136
GS7 = 3322
A7  = 3520
AS7 = 3729
B7  = 3951
C8  = 4186
CS8 = 4435
D8  = 4699
DS8 = 4978

# This is the list of notes for mario theme
# 0 denotes rest notes
mario = [
     E7, E7,  0, E7,  0, C7, E7,  0,
     G7,  0,  0,  0, G6,  0,  0,  0,
     C7,  0,  0, G6,  0,  0, E6,  0,
      0, A6,  0, B6,  0,AS6, A6,  0,
     G6, E7,  0, G7, A7,  0, F7, G7,
      0, E7,  0, C7, D7, B6,  0,  0,
     C7,  0,  0, G6,  0,  0, E6,  0,
      0, A6,  0, B6,  0,AS6, A6,  0,
     G6, E7,  0, G7, A7,  0, F7, G7,
      0, E7,  0, C7, D7, B6,  0,  0,
    ]

# This is the list of notes for jingle bells
jingle = [
    E7, E7, E7, 0,
    E7, E7, E7, 0,
    E7, G7, C7, D7, E7, 0,
    F7, F7, F7, F7, F7, E7, E7, E7, E7, D7, D7, E7, D7, 0, G7, 0,
    E7, E7, E7, 0,
    E7, E7, E7, 0,
    E7, G7, C7, D7, E7, 0,
    F7, F7, F7, F7, F7, E7, E7, E7, G7, G7, F7, D7, C7, 0 
    ]

# This is the list of notes for Twinkle, Twinkle Little Star
twinkle = [
    C6, C6, G6, G6, A6, A6, G6, 0,
    F6, F6, E6, E6, D6, D6, C6, 0,
    G6, G6, F6, F6, E6, E6, D6, 0,
    G6, G6, F6, F6, E6, E6, D6, 0,
    C6, C6, G6, G6, A6, A6, G6, 0,
    F6, F6, E6, E6, D6, D6, C6, 0,
    ]

# Instantiate a buzzer object which is attached on GPIO 23
buzzer = GORILLACELL_BUZZER(23)

print("Playing mario.")
buzzer.play(mario, 150, 512)
sleep_ms(1000)

print("Playing jingle bells.")
buzzer.play(jingle, 250, 512)
sleep_ms(1000)

print("Playing twinkle, twinkle little star.")
buzzer.play(twinkle, 600, 512)

```

## **References And Credits**

1. Purchase your Gorillacell ESP32 development kit at:
[https://gorillacell.kr](https://gorillacell.kr/)

2. MicroPython PWM references:
<https://docs.micropython.org/en/v1.15/esp32/tutorial/pwm.html>
<https://docs.micropython.org/en/latest/library/machine.PWM.html>

