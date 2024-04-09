---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-06-26T16:34:00+08:00'
tags:
  - analogRead
  - analogWrite
  - digitalRead
  - digitalWrite
  - How to use Arduino pins
  - pinMode
series:
  - My Arduino Exploration
title: 'Tutorial: Arduino GPIO | How to use Arduino Pins'
url: /2020/06/26/tutorial-arduino-gpio-how-to-use-arduino-pins/
---

## **Introduction**

When I am starting to learn the Arduino microcontroller, I started searching on how I am able to use it immediately because I believe that the best way of learning something is the experience of using it.

In this tutorial, we will learn the basics of Arduino GPIO or the General Purpose Input Output or in the simplest term Arduino pins.

GPIO are physical pins found in microcontrollers which can be configured either as input or output.

When a certain pin is configured as input, it can be used to read the state of a switch or the value of the sensor.

When a certain pin is configured as output, it can be used to write such as lights ON or lights OFF or control the rotation of DC motors.

Now let us discuss functions commonly used in Arduino:

![](/images/pinMode.png)

```cpp { lineNos="true" wrap="true" }
pinMode(PIN, MODE)
```
This function is use to set the direction of the PIN either as input or output.

```cpp { lineNos="true" wrap="true" }
MODE could be OUTPUT, INPUT, or INPUT_PULLUP
```

Example:
```cpp
pinMode(13, OUTPUT)
```
This configures digital pin 13 as output.

**OUTPUT** mode configures the PIN output which can drive LEDs, LCD, control signals, and etcetera.
**INPUT** mode configures the PIN as input which can read state of switch or read sensor data. An external pull-down or pull-up resistor is needed when the input pin has unknown state which also known as tri-state.
**INPUT\_PULLUP** mode configures the PIN as input and also connects the PIN to a pullup resistor internally. This is especially useful when external pullup or pulldown resistor is not available.
**Pull-up Resistor** – is a resistor connected between the VCC and the specific pin. Pullup resistor makes the specific pin to a default value of logic HIGH. The RESET button of Arduino Uno is configured using a pullup resistor, so the default value is logic HIGH but when the RESET button is pressed, the RESET button will be connected to the GND which has logic LOW value.

*(insert pullup vs pulldown resistor)*

**Pull-down Resistor** – is a resistor connected between the GND and the specific pin. It function similar to pull-up resistor but opposite logic functions.
*(show the benefit of pull-up resistor by showing the state of a pin when floating and when pullup.)*

![](/images/digitalWrite.png)

digitalWrite(PIN, HIGH/LOW)
This function drives the PIN either a logic HIGH or logic LOW.

![](/images/digitalRead.png)

digitalRead(PIN)
This function reads the state of the PIN and return either a logic HIGH or logic LOW.

![](/images/analogWrite.png)

analogWrite(PIN, VALUE)
This function writes an analog value (in PWM square wave) to a pin.

![](/images/analogRead.png)

analogRead(PIN)
This function reads an analog value from a specified analog pins.

## **Circuit Diagram**

*(insert circuit diagram here)*  

## **Video Demonstration**

{{< youtube id="3nAjmWvTSGU" >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
#include "Servo.h"
#include "LiquidCrystal.h"

#define RED_LED_PIN 11
#define YEL_LED_PIN 12
#define SERVO_PIN   A5

#define JS_YL_PIN   A1  // Joystick vertical position in the left
#define JS_XL_PIN   A2  // Joystick horizontal position in the left
#define JS_YR_PIN   A3  // Joystick vertical position in the right
#define JS_XR_PIN   A4  // Joystick horizontal position in the right

#define JS_SL_PIN   3   // Joystick tactile switch in the left
#define JS_SR_PIN   2   // Joystick tactile switch in the right

Servo myservo;
LiquidCrystal lcd(8, 9, 4, 5, 6, 7);

void setup() {

  // Setting of the pin direction
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(YEL_LED_PIN, OUTPUT);
  pinMode(SERVO_PIN, OUTPUT);

  pinMode(JS_YL_PIN, INPUT);
  pinMode(JS_XL_PIN, INPUT);
  pinMode(JS_YR_PIN, INPUT);
  pinMode(JS_XR_PIN, INPUT);

  pinMode(JS_SL_PIN, INPUT_PULLUP);
  pinMode(JS_SR_PIN, INPUT_PULLUP);

  // ##########################
  myservo.attach(SERVO_PIN);  // Attach the servo to the assigned pin
  lcd.begin(16,2);            // Initialize the LCD as 16 columns and 2 rows
  lcd.clear();                // Clear any garbage in the LCD EPROM
  
}

void loop() {

  //#######################################
  // Using the horizontal (X) analog value
  int js_xr_value = analogRead(JS_XR_PIN);
  byte servo_angle = map (js_xr_value, 0, 1023, 0, 180);
  myservo.write(servo_angle);
  lcd.setCursor(0,0);
  lcd.print("Servo angle: ");
  if (servo_angle < 100) {  // if value is 0 to 99, add a space before printing
    lcd.print(" ");         // this is to make sure that 3 digits is occupied always
  }
  lcd.print(servo_angle);

  //#######################################
  // Using the vertical (Y) analog value
  int js_yr_value = analogRead(JS_YR_PIN);
  byte led_pwm = map ( js_yr_value, 0, 1023, 255, 0);
  analogWrite(RED_LED_PIN, led_pwm);

  lcd.setCursor(0,1);
  lcd.print("LED pwm: ");
  if (led_pwm < 100) {  // if value is 0 to 99, add space before printing
    lcd.print(" ");     // this is to make sure that 3 digits is occupied always.
  }
  lcd.print(led_pwm);

  //#################################################
  // Using the push button switch (S) digital value
  digitalWrite(YEL_LED_PIN, digitalRead(JS_SR_PIN));
  
}
```

## **Call To Action**

That’s all for now, I hope this tutorial helps. Please kindly LIKE and SHARE this video to your friends who may benefit from it.
SUBSCRIBE and leave your comments and suggestions in the comment box.
Thank you and have a good day.
George signing off, bye.

