---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-06-15T23:16:00+08:00'
tags:
  - Arduino
  - arduino interrupts
  - Arduino uno
  - interrupts
series:
  - My Arduino Exploration
title: How to Use Arduino Interrupts
url: /2020/06/15/how-to-use-arduino-interrupts/
---

## **Introduction**

Interrupt is extremely useful when dealing with all kinds of processes that needs attention at unexpected time or when expecting a certain event or signal at indefinite and unknown time.

For example you send a chat message to your crush. You are very excited but also nervous. So every second you are checking your messenger if she already replied. This is tiring and it takes most of your time and energy. You will not be able to do other important tasks and responsibilities. In microcontroller jargon, it is called *polling*.

What you can do is to turn the notification and go on with your normal life, do your chores and routines. When someone send you a chat message, you will hear a notification sound. That is the time for you to check your mobile phone.

The notification sound serves as *interrupt* call and checking of mobile phone is the *Interrupt Service Routine*. Efficient, right?

**So how does the interrupt really works?**

When an event occurs which triggers the interrupt, the current process will be put on hold and the ISR or Interrupt Service Routine will be executed. All other interrupt will be disabled.

When the ISR finish executing, the previous process before the interrupt will continue and all other interrupts will be re-enabled.

It is highly recommended to make the ISR as short as possible because an ISR that takes lets say 5 seconds to executes means a 5 seconds of uncertainty, WHY? Because all other processes are disabled during ISR execution, right? As a rule of thumb, just set variable flag or save a sensor value inside the ISR and do the other remaining processes inside the main loop.

**There are two kinds of interrupt:**
*Internal interrupt – or software interrupt* is triggered by internal peripherals like timers.
*External interrupt – or hardware interrupt* is triggered by an external device.

**External Interrupt pins:**  
  
![](/images/Arduino%2BInterrupt%2BPins.png)

**How to set interrupt:**

**attachInterrupt(INTERRUPT\_NUM, ISR\_FUNCTION, TRIGGER\_MODE)**

**INTERRUPT\_NUM** – is the interrupt number associated to interrupt pin.

**ISR\_FUNCTION** – is the ISR function to be executed when the interrupt is detected

**TRIGGER\_MODE** – is the type of detection of interrupt. It could be a RISING, FALLING, CHANGE, or LOW.

**RISING** – triggers when the pin goes from low to high
**FALLING** – triggers when the pin goes from high to low
**CHANGE** – triggers whenever the pin changes value
**LOW** – triggers when the pin is low.

Keep in mind the following rules when using interrupt:
1. ***Keep it short.*** As I already discussed earlier.
2. ***Do not use delay*** functions as per the first rule said, keep interrupt short while delay function prolong the execution of the function.
3. ***Do not use serial.*** Serial use and trigger interrupts.
4. ***Make global variable volatile.*** This is as per C standard, variable should be declared volatile when there is chance that the variable will be use outside the normal execution flow (outside the main loop, which is the ISR function). Volatile disables the variable optimization.

## **Video Demonstration**

{{< youtube lD7o0lySAIs >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#define INTERRUPT_PIN 2
#define INDICATOR_PIN 3

volatile int LED_state = 1;

void setup() {
  // put your setup code here, to run once:
  pinMode(INTERRUPT_PIN, INPUT);
  pinMode(INDICATOR_PIN, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), Button_ISR, RISING);
}

void loop() {
  // put your main code here, to run repeatedly:
}

void Button_ISR () {
  LED_state = !LED_state;
  digitalWrite(INDICATOR_PIN, LED_state);
}
```

## **Call To Action**

If you found this tutorial useful, kindly share this to your friends.
Thank you and have a good day.

