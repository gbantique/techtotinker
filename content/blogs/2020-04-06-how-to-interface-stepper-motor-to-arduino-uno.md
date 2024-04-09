---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-04-06T16:00:00+08:00'
tags:
  - Arduino uno
  - diy
  - electronics
  - hobby
  - keypad shield
  - l298
  - Motor driver
  - stepper motor
series:
  - My Arduino Exploration
title: How to Interface Stepper Motor to Arduino Uno
url: /2020/04/06/how-to-interface-stepper-motor-to-arduino-uno/
---

## **Introduction**

I am thinking on creating this tinkering with stepper motor long time ago until yesterday when I met someone in Facebook group asking help regarding his project related to controlling the stepper motor while being able to check for some controls and update LCD to display information. So basically his project should be able to do multiple things at the same time or multi-tasking. Even though Arduino Uno is a powerful microcontroller but it has only one processing core. It means it can process only one task at one time.

To mimic or to copy the functionalities of multi-tasking, I suggest to use the proto-threading. Proto-threading is basically doing small chunks of task by using the power of millis() Arduino function. To do this, BlinkWithoutDelay example of Arduino is used (please refer to the source code below).

## **Bill Of Materials**  

1. Arduino Uno.  
2. Stepper motor.  
3. Stepper motor driver (such as L298)  
4. Keypad shield with 16×2 LCD.  
5. Some jumper wires

## **Hardware Instruction**

![](/images/StepperMotor-KeypadShield-Arduino-Uno.jpg)

1. By referring to the attached schematic above, connect the keypad shield to Arduino Uno.  
2. Connect the L298N motor driver to Arduino Uno as follows:  
 * Connect the IN1 of L298N to Arduino Uno pin 13.  
 * Connect the IN2 of L298N to Arduino Uno pin 12.  
 * Connect the IN3 of L298N to Arduino Uno pin 11.  
 * Connect the IN4 of L298N to Arduino Uno pin 3.  
3. Connect the stepper motor to L298N outputs.  
4. Enable the L298N by placing a jumper on enable pins.  
5. Connect a power supply on +12V pin according to your stepper motor voltage requirements.  
6. Connect the power supply GND to the GND pin of L298N.  
7. Connect the Arduino Uno GND to the GND pin of L298N.  
8. Upload the sketch provided in the source code below.  
9. The sketch basically functions as follows:  
 UP button – increases the angle  
 DOWN button – decreases the angle  
 LEFT button – counter clockwise direction  
 RIGHT button – clockwise direction  
 SELECT button – execute the stepper rotation according to angle and direction set.

 The serial command basically functions by sending command in this format: &lt;A, B, C&gt;  
 Where A: is the command to rotate the stepper  
 B: is the parameter of direction, 1: CW 0: CCW  
 C: is the parameter of angle  
 &lt; and &gt; is necessary for parsing the command.

## **Video Demonstration**

{{< youtube Y2vsN6yb0Zw >}}

## **Source Code**

```cpp { lineNos="true" wrap="true" }
// For LCD and keypad refer to: 
//      https://wiki.dfrobot.com/Arduino_LCD_KeyPad_Shield__SKU__DFR0009_
//      https://create.arduino.cc/projecthub/electropeak/using-1602-lcd-keypad-shield-w-arduino-w-examples-e02d95

#include "LiquidCrystal.h"
#include "Stepper.h"

//LCD pin to Arduino
const int pin_RS = 8; 
const int pin_EN = 9; 
const int pin_d4 = 4; 
const int pin_d5 = 5; 
const int pin_d6 = 6; 
const int pin_d7 = 7; 
const int pin_BL = 10; 

const int stepsPerRevolution = 200;  // change this to fit the number of steps per revolution

LiquidCrystal lcd( pin_RS,  pin_EN,  pin_d4,  pin_d5,  pin_d6,  pin_d7);
Stepper myStepper(stepsPerRevolution, 3, 11, 12, 13);

// ####################################
// PROTOTHREADING DEFINITIONS HERE:
// ####################################
unsigned long checkSerialTaskTimer = 0;
const unsigned long checkSerialTaskInterval = 100;

unsigned long setSerialTaskTimer = 0;
const unsigned long setSerialTaskInterval = 100;

unsigned long updateSerialTaskTimer = 0;
const unsigned long updateSerialTaskInterval = 100;

unsigned long doStepperTaskTimer = 0;
const unsigned long doStepperTaskInterval = 500;

unsigned long updateLCDTaskTimer = 0;
const unsigned long updateLCDTaskInterval = 100;

unsigned long checkButtonTaskTimer = 0;
const unsigned long checkButtonTaskInterval = 100;

// Global variables
const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];        // temporary array for use when parsing

// variables to hold the parsed data
char userCmd[numChars] = {0};
int firstParam = 0;
int secondParam = 0;

boolean newData = false;
bool newCmd = false;

int currAng = 0;
bool currDir = true;
bool executeSteps = false;


void setup() {
  // set the speed at 60 rpm:
  myStepper.setSpeed(60);
  // initialize the serial port:
  Serial.begin(9600);
  Serial.println("Stepper motor controller: ");
  Serial.println("Enter command like <a href="https://www.blogger.com/null">  ");
  Serial.println("A: command to turn stepper, 1:turn CW 0:CCW, 360: degrees");
  Serial.println();

  lcd.begin(16, 2);
  lcd.setCursor(0,0);
  lcd.print("L/R:Dir  U/D:Deg");
  lcd.setCursor(0,1);
  lcd.print("DIR:");
  lcd.setCursor(9,1);
  lcd.print("DEG:");
}

void loop() {
  if(millis() >= checkSerialTaskTimer + checkSerialTaskInterval){
    checkSerialTaskTimer += checkSerialTaskInterval;
    // do the task
    checkSerial();
  }

  if(millis() >= setSerialTaskTimer + setSerialTaskInterval){
    setSerialTaskTimer += setSerialTaskInterval;
    // do the task
    setSerial();
  }

  if(millis() >= updateSerialTaskTimer + updateSerialTaskInterval){
    updateSerialTaskTimer += updateSerialTaskInterval;
    // do the task
    updateSerial();
  }

  if(millis() >= doStepperTaskTimer + doStepperTaskInterval){
    doStepperTaskTimer += doStepperTaskInterval;
    // do the task
    doStepper();
  }

  if(millis() >= updateLCDTaskTimer + updateLCDTaskInterval){
    updateLCDTaskTimer += updateLCDTaskInterval;
    // do the task
    updateLCD();
  }

  if(millis() >= checkButtonTaskTimer + checkButtonTaskInterval){
    checkButtonTaskTimer += checkButtonTaskInterval;
    // do the task
    checkButton();
  }

}

void checkSerial() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;

    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = ''; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void setSerial() {
  char * strtokIndx; // this is used by strtok() as an index

  if (newData == true) {
    strcpy(tempChars, receivedChars);
            // this temporary copy is necessary to protect the original data
            //   because strtok() used in parseData() replaces the commas with 

    strtokIndx = strtok(tempChars,",");
    strcpy(userCmd, strtokIndx);       // user command
 
    strtokIndx = strtok(NULL, ",");
    firstParam = atoi(strtokIndx);     // first parameters
    if (firstParam) {
      currDir = true;
    }
    else {
      currDir = false;
    }

    strtokIndx = strtok(NULL, ",");
    //secondParam = atoi(strtokIndx);    // second parameters
    currAng = atoi(strtokIndx);    // second parameters

    //newCmd = true;
    executeSteps = true;
    newData = false;
  }
    
}


void updateSerial() {
}

void doStepper() {
  int steps = 0;

  // command from keypad shield
  if (executeSteps) {
    steps = rotate(currDir, currAng);
    if (firstParam) {
      Serial.print("Rotated CW by ");
    }
    else {
      Serial.print("Rotated CCW by ");
    }
    Serial.println(currAng);
    executeSteps = false;
  }

}

void updateLCD() {
  lcd.setCursor(4,1);
  if (currDir) {
    lcd.print("CW ");
  }
  else {
    lcd.print("CCW");
  }
  lcd.setCursor(13,1);
  lcd.print(currAng);
  
}

void checkButton() {
   int x;
   x = analogRead (0);
   lcd.setCursor(10,1);
   if (x < 60) {
     //lcd.print ("Right ");
     currDir = true; // CW
   }
   else if (x < 200) {
     //lcd.print ("Up    ");
     if (currAng >= 360) {
      currAng = 360;
     }
     else {
      currAng = currAng + 5; // increase angle
     }
   }
   else if (x < 400){
     //lcd.print ("Down  ");
     if (currAng <= 0) {
      currAng = 0;
     }
     else {
      currAng = currAng - 5; // decrease angle
     }
   }
   else if (x < 600){
     //lcd.print ("Left  "); 
     currDir = false; // CCW
   }
   else if (x < 800){
     //lcd.print ("Select");
     executeSteps = true;
   }
   else {
     //lcd.print ("      ");  // delete previous text when nothing is press
   }
   if (executeSteps) {
   }
}


int rotate(bool rotateDirection, int reqAngle) {
  int steps = reqAngle / 1.8;
  // Clockwise direction
  if (rotateDirection) {
    myStepper.step(int(steps));
  }
  else {
    myStepper.step(int(-steps));
  }
  return steps;
}
```

## **Call To Action**

If you find this lesson useful, please consider supporting my Youtube channel: [TechToTinker](https://www.youtube.com/c/techtotinker/)

Please leave your comments and suggestions in the comment box below.

Thank you and have a good day. Bye.

