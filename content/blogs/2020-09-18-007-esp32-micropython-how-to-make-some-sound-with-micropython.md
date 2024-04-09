---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-09-18T12:31:00+08:00'
tags:
  - esp32 micropython
  - Micropython esp32
  - micropython music
  - micropython sound
  - micropython tone
series:
  - ESP32 MicroPython
title: '007 - ESP32 MicroPython: How to make some sound with MicroPython'
url: /2020/09/18/007-esp32-micropython-how-to-make-some-sound-with-micropython/
---

## **Introduction**

In this article, we will be exploring the use of Pulse Width Modulation or PWM in producing a sound using MicroPython.

## **Bill Of Materials**

1. ESP32 Development board.
2. A buzzer module or a speaker.
3. Some connecting wires.

## **Circuit Diagram**

![](/images/pwm_sound.png)

## **Video Demonstration**

{{< youtube QAbn-7Ai6UU >}}

## **Call To Action**

If you found this tutorial as helpful, please consider supporting me by Subscribing to my Youtube channel: [Click this to Subscribe to TechToTinker](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

## **Source Code**

### **Example 1, Single Note:**

```py { lineNos="true" wrap="true" }
# How to make some sound with MicroPython
# Author: George Bantique,
#         TechToTinker Youtube channel
#         www.techtotinker.com
# Date: September 18, 2020

# Import the machine module for GPIO and PWM
import machine
# Import the time module to add some delays
import time

# Create a regular GPIO object from pin 23
p23 = machine.Pin(23, machine.Pin.OUT)

# Create a new object and attach the pwm driver
buzzer = machine.PWM(p23)

# Set a pwm frequency
buzzer.freq(1047)
# Set the pwm duty value
# this serves as volume control
# Max volume is a duty value of 512
buzzer.duty(50)
# Let the sound ring for a certain duration
time.sleep(1)
# Turn off the pulse by setting the duty to 0
buzzer.duty(0)
# And disconnect the pwm driver to the GPIO pin
buzzer.deinit()
```

### **Example 2, Mario Melody:**

```py { lineNos="true" wrap="true" }
# How to make some sound with MicroPython
# Author: George Bantique,
#         TechToTinker Youtube channel
#         www.techtotinker.com
# Date: September 18, 2020
from machine import Pin
from machine import PWM
from time import sleep_ms

class GORILLACELL_BUZZER: 
    def __init__(self, sig_pin):
        self.pwm = PWM(Pin(sig_pin),duty_u16=0)      
        
    def play(self, melodies, wait, duty=32767):
        for note in melodies:
            if note != 0:
                self.pwm.freq(note)
            self.pwm.duty_u16(duty)
            sleep_ms(wait)
        # Disable the pulse, setting the duty to 0
        self.pwm.duty_u16(0)
        # Disconnect the pwm driver
        #self.pwm.deinit() # remove to play the next melodies
        
    def tone(self, notes, wait, duty=32767):
        self.pwm.freq(notes)
        self.pwm.duty_u16(duty)
        sleep_ms(wait)
        self.pwm.duty_u16(0)

# Notes and its equivalent frequency
           # Octave 0 ********************
B0  = 31   # B
           # Octave 1 ********************
C1  = 33   # C
CS1 = 35   # C#/Db
D1  = 37   # D
DS1 = 39   # D#/Eb
E1  = 41   # E
F1  = 44   # F
FS1 = 46   # F#/Gb
G1  = 49   # G
GS1 = 52   # G#/Ab
A1  = 55   # A
AS1 = 58   # A#/Bb
B1  = 62   # B
           # Octave 2 ********************
C2  = 65   # C
CS2 = 69   # C#/Db
D2  = 73   # D
DS2 = 78   # D#/Eb
E2  = 82   # E
F2  = 87   # F
FS2 = 93   # F#/Gb
G2  = 98   # G
GS2 = 104  # G#/Ab
A2  = 110  # A
AS2 = 117  # A#/Bb
B2  = 123  # B
           # Octave 3 ********************
C3  = 131  # C
CS3 = 139  # C#/Db
D3  = 147  # D
DS3 = 156  # D#/Eb
E3  = 165  # E
F3  = 175  # F
FS3 = 185  # F#/Gb
G3  = 196  # G
GS3 = 208  # G#/Ab
A3  = 220  # A
AS3 = 233  # A#/Bb
B3  = 247  # B
           # Octave 4 ********************
C4  = 262  # C
CS4 = 277  # C#/Db
D4  = 294  # D
DS4 = 311  # D#/Eb
E4  = 330  # E
F4  = 349  # F
FS4 = 370  # F#/Gb
G4  = 392  # G
GS4 = 415  # G#/Ab
A4  = 440  # A
AS4 = 466  # A#/Bb
B4  = 494  # B
           # Octave 5 ********************
C5  = 523  # C
CS5 = 554  # C#/Db
D5  = 587  # D
DS5 = 622  # D#/Eb
E5  = 659  # E
F5  = 698  # F
FS5 = 740  # F#/Gb
G5  = 784  # G
GS5 = 831  # G#/Ab
A5  = 880  # A
AS5 = 932  # A#/Bb
B5  = 988  # B
           # Octave 6 ********************
C6  = 1047 # C
CS6 = 1109 # C#/Db
D6  = 1175 # D
DS6 = 1245 # D#/Eb
E6  = 1319 # E
F6  = 1397 # F
FS6 = 1480 # F#/Gb
G6  = 1568 # G
GS6 = 1661 # G#/Ab
A6  = 1760 # A
AS6 = 1865 # A#/Bb
B6  = 1976 # B
           # Octave 7 ********************
C7  = 2093 # C
CS7 = 2217 # C#/Db
D7  = 2349 # D
DS7 = 2489 # D#/Eb
E7  = 2637 # E
F7  = 2794 # F
FS7 = 2960 # F#/Gb
G7  = 3136 # G
GS7 = 3322 # G#/Ab
A7  = 3520 # A
AS7 = 3729 # A#/Bb
B7  = 3951 # B
           # Octave 8 ********************
C8  = 4186 # C
CS8 = 4435 # C#/Db
D8  = 4699 # D
DS8 = 4978 # D#/Eb



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


buzzer = GORILLACELL_BUZZER(10)

print("Playing mario.")
buzzer.play(mario, 150, 32767)
sleep_ms(1000)

print("Playing jingle bells.")
buzzer.play(jingle, 250, 32767)
sleep_ms(1000)

print("Playing twinkle, twinkle little star.")
buzzer.play(twinkle, 600, 32767)
```

### **Example 3, More Melodies:**

```py { lineNos="true" wrap="true" }
# How to make some sound with MicroPython
# Author: George Bantique,
#         TechToTinker Youtube channel
#	  www.techtotinker.com
# Date: September 18, 2020

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

def play_jingle():
    play(p23, jingle, 0.25, 512)

# This is the list of notes for Twinkle, Twinkle Little Star
twinkle = [
    C6, C6, G6, G6, A6, A6, G6, 0,
    F6, F6, E6, E6, D6, D6, C6, 0,
    G6, G6, F6, F6, E6, E6, D6, 0,
    G6, G6, F6, F6, E6, E6, D6, 0,
    C6, C6, G6, G6, A6, A6, G6, 0,
    F6, F6, E6, E6, D6, D6, C6, 0,
]

def play_twinkle():
    play(p23, twinkle, 0.6, 50)

```

