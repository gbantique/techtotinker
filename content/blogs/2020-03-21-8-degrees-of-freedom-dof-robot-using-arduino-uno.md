---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-03-21T22:15:00+08:00'
tags:
  - 8 DOF robot
  - Arduino uno
  - degrees of freedom
  - gait
  - game controller
  - MG 996R
  - multitasking
  - multithreading
  - PCA9685
  - protothreading
  - robotics
  - Servo motors
  - state machine
  - tinkering
  - wireless ps2
series:
  - My Arduino Exploration
title: 8 Degrees Of Freedom (DOF) Robot Using Arduino Uno
url: /2020/03/21/8-degrees-of-freedom-dof-robot-using-arduino-uno/
---

## **Introduction**

This project is an 8-Degrees-Of-Freedom Robot. It is called 8-DOF-Robot because it has 8 servo motors. It has 2 servos for the left and right ankle, 2 servos for the left and right knee, 2 servos for the left and right hips, and 2 servos for the left and right shoulder. No movement for the shoulders yet because I am focus with the walking.

This project is my long and forgotten project because of its complexities like:  
1. How to control multiple servo motors at the same time?  
2. How to rotate servo motors in staggered timing?  
3. How to control it wirelessly?  
4. How to make it walk?

To solve the complexities, the following are what I did.

1: How to control multiple servo motors at the same time? I used what they call PROTOTHREADING which is basically the BlinkWithoutDelay in the Examples of Arduino IDE. With protothreading, it seems like the microcontroller is doing multiple task at the same time. Task like checking the command from wireless PS2, setting the command, setting the requested angle of each servo motors, rotating the servo motors, updating the LCD display, and updating the serial for debugging purposes.

2: How to rotate servo motors in staggered timing? I used what they call STATE MACHINE which is tracking the current angle of the servo versus the requested angle for that specific servo motors and rotating it gradually. I also added a protection check on each side of the servo motors to prevent it from over-turning. This is achieve by comparing the current angle versus the minimum and maximum angle possible.

3: How to control it wirelessly? I achieve this by using a wireless PS2 controller. The PS2 receiver is connected to the microcontroller then I use the Bill Porters Arduino library for PS2.

4: How to make it walk? This is the hardest part because I cannot find a sample code online to follow. There is a research paper I found but the angle mentioned are too ideal and when followed will results to robot falling down. So what I do is by trial and error in simulating how human walks. I used a four-stage per step walking (1) lean to the LEFT, (2) RIGHT foot forward up, (3) RIGHT foot forward down, and (4) balance foot with the RIGHT. This is also the same with the other side.

Atlast, after many hours of tinkering and code troubleshooting, I am able to make it walk.

1. By pressing the LEFT arrow button: 1-step forward (left foot first).  
2. By pressing the RIGHT arrow button: 1-step forward (right foot first).  
3. By pressing the UP arrow button: Walking forward.  
4. By pressing the DOWN arrow button: Stop walking.  
5. By pressing the R1 + LEFT arrow button: 1-step backward (left foot first).  
6. By pressing the R1 + RIGHT arrow button: 1-step backward (right foot first).  
7. By pressing the R1 + UP arrow button: Walking backward.  
8. By pressing the R1 + DOWN arrow button: Stop walking.  
9. By pressing the TRIANGLE button: Vow.

## **Video Demonstration**

{{< youtube R8QRPjkcPcU >}}


## **Call To Action**

If you have any concern regarding this video, please write your message in the comment section.

You might also like to consider supporting my Youtube channel by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and may God bless us all.
– George Bantique | tech.to.tinker@gmail.com


## **Source Code**

```cpp { lineNos="true" wrap="true" }
/*  
  * Original sourse: https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library  
  * This is the Arduino code PAC6985 16 channel servo controller  
  * watch the video for details and demo http://youtu.be/y8X9X10Tn1k  
  * *   
  Watch V2 Video on using PAC9685 with more code:https://youtu.be/bal2STaoQ1M  
  Watch V3 of this code to control 32 Sevo motor: https://youtu.be/6P21wG7N6t4  
  * Written by Ahmad Shamshiri for Robojax Video channel www.Robojax.com  
  * Date: Dec 16, 2017, in Ajax, Ontario, Canada  
  * Permission granted to share this code given that this  
  * note is kept with the code.  
  * Disclaimer: this code is "AS IS" and for educational purpose only.  
  * this code has been downloaded from http://robojax.com/learn/arduino/  
  *   
  */  
 /***************************************************   
  This is an example for our Adafruit 16-channel PWM & Servo driver  
  Servo test - this will drive 16 servos, one after the other  
  Pick one up today in the adafruit shop!  
  ------> http://www.adafruit.com/products/815  
  These displays use I2C to communicate, 2 pins are required to   
  interface. For Arduino UNOs, thats SCL -> Analog 5, SDA -> Analog 4  
  Adafruit invests time and resources providing this open source code,   
  please support Adafruit and open-source hardware by purchasing   
  products from Adafruit!  
  Written by Limor Fried/Ladyada for Adafruit Industries.   
  BSD license, all text above must be included in any redistribution  
 */  
 /**************************************************  
  * Scheduino_Blink_example  
  *  
  * Simple example using the Scheduino library.  
  * Replicates the behaviour of the standard Arduino 'Blink' example, 
  * while outputting the LED status (ON or OFF) to the Serial port  
  *  
  */  
 #include <Adafruit_PWMServoDriver.h>  
 #include <PS2X_lib.h>  
 #include <SoftwareSerial.h>  
 Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(); // create servo Controller Class  
 PS2X ps2x;                        // create PS2 Controller Class  
 SoftwareSerial mySerial(2,3);               // create soft serial class  
 #define SERVOMIN 125 // this is the 'minimum' pulse length count (out of 4096) // RIGHT SIDE  
 #define SERVOMAX 615 // this is the 'maximum' pulse length count (out of 4096) // LEFT SIDE  
 // our servo # counter  
 uint8_t servonum = 0;  
 // Channel 0 - head  
 // Channel 1 - nc  
 // Channel 2 - nc  
 // Channel 3 - left foot  
 // Channel 4 - left knee  
 // Channel 5 - left hip  
 // Channel 6 - left shoulder  
 // Channel 7 - nc  
 // Channel 8 - nc  
 // Channel 9 - nc  
 // Channel 10 - right foot  
 // Channel 11 - right knee  
 // Channel 12 - right hip  
 // Channel 13 - right shoulder  
 // Channel 14 - nc  
 // Channel 15 - nc  
 // Current angle position  
 byte currAnglePOS[16] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};  
 // Maximum allowed angle position  
 byte maxAnglePOS[16] = {0, 0, 0, 115, 180, 180, 180, 0, 0, 0, 115, 180, 180, 180, 0, 0};  
 // Minimum allowed angle position  
 byte minAnglePOS[16] = {0, 0, 0, 65, 0, 0, 0, 0, 0, 0, 65, 0, 0, 0, 0, 0};  
 // Default or standing angle position  
 byte idleAnglePOS[16] = {0, 0, 0, 95, 90, 95, 170, 0, 0, 0, 85, 90, 95, 10, 0, 0};  
 // Requested angle position  
 byte reqAnglePOS[16] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};  
 byte ch = 0;  // channel counter  
 int error = 0;   
 byte type = 0;  
 byte vibrate = 0;  
 byte cmdFUNCTION = 0;  
 bool stepRIGHT = 0; // if 1 = forward step right, 0: forward step left  
 bool isWALKING = 0;  
 // ####################################  
 // PROTOTHREADING DEFINITIONS HERE:  
 // ####################################  
 unsigned long checkPS2TaskTimer = 0;  
 const unsigned long checkPS2TaskInterval = 100;  
 unsigned long setCommandTaskTimer = 0;  
 const unsigned long setCommandTaskInterval = 200;  
 unsigned long setServoTaskTimer = 0;  
 const unsigned long setServoTaskInterval = 200;  
 unsigned long doServoTaskTimer = 0;  
 const unsigned long doServoTaskInterval = 20;  
 unsigned long updateLCDTaskTimer = 0;  
 const unsigned long updateLCDTaskInterval = 500;  
 unsigned long updateSerialTaskTimer = 0;  
 const unsigned long updateSerialTaskInterval = 500;  
 // ###############################  
 // PROTOTYPES here:  
 // ###############################  
 unsigned int angleToPulse(byte ang);  
 void doServo ();  
 void setCommand();  
 void setServo();  
 void checkPS2 ();  
 void updateLCD();  
 void updateSerial();  
 // ######################################  
 // setup function:   
 // Put code that run once here  
 // ######################################  
 void setup() {  
  mySerial.begin(9600);  
  Serial.begin(9600);  
  Serial.println("6 DOF Biped Robot");  
  pwm.begin();  
  pwm.setPWMFreq(60); // Analog servos run at ~60 Hz updates  
  // copy idle Angle to current Angle  
  for (byte i = 0; i < 16; i++) {  
   reqAnglePOS[i] = idleAnglePOS[i];  
   currAnglePOS[i] = idleAnglePOS[i] - 3;  
  }  
  // Setup PS2 controller Here!  
  //error = ps2x.config_gamepad(12,11,10,13, false, false);  //setup pins and settings: GamePad(clock, command, attention, data, Pressures?, Rumble?) check for error  
  ps2x.config_gamepad(12,11,10,13, false, false);  //setup pins and settings: GamePad(clock, command, attention, data, Pressures?, Rumble?) check for error  
 // if(error == 0){  
 //  Serial.println("Found Controller, configured successful");  
 // }  
 // else if(error == 1)  
 //  Serial.println("No controller found, check wiring, see readme.txt to enable debug. visit www.billporter.info for troubleshooting tips");  
 // else if(error == 2)  
 //  Serial.println("Controller found but not accepting commands. see readme.txt to enable debug. Visit www.billporter.info for troubleshooting tips");   
 // else if(error == 3)  
 //  Serial.println("Controller refusing to enter Pressures mode, may not support it. ");  
 //    
 // type = ps2x.readType();   
 // switch(type) {  
 //  case 0:  
 //   Serial.println("Unknown Controller type");  
 //   break;  
 //  case 1:  
 //   Serial.println("DualShock Controller Found");  
 //   break;  
 //  case 2:  
 //   Serial.println("GuitarHero Controller Found");  
 //   break;  
 //  }  
  mySerial.println(" tech-to-tinker ");  
  Serial.println("Setup DONE");    
 }  
 /* It's best not to do anything in loop() except runTasks() - doing anything else here will affect timing */  
 void loop() {  
  if(millis() >= checkPS2TaskTimer + checkPS2TaskInterval){  
   checkPS2TaskTimer += checkPS2TaskInterval;  
   // do the task  
   checkPS2();  
   Serial.println("checkPS2");  
  }  
  if(millis() >= setCommandTaskTimer + setCommandTaskInterval){  
   setCommandTaskTimer += setCommandTaskInterval;  
   // do the task  
   setCommand();  
   Serial.println("setCommand");  
  }  
  if(millis() >= setServoTaskTimer + setServoTaskInterval){  
   setServoTaskTimer += setServoTaskInterval;  
   // do the task  
   setServo();  
   Serial.println("setServo");  
  }  
  if(millis() >= doServoTaskTimer + doServoTaskInterval){  
   doServoTaskTimer += doServoTaskInterval;  
   // do the task  
   doServo();  
   Serial.println("doServo");  
  }  
  if(millis() >= updateLCDTaskTimer + updateLCDTaskInterval){  
   updateLCDTaskTimer += updateLCDTaskInterval;  
   // do the task  
   updateLCD();  
   Serial.println("updateLCD");  
  }  
  if(millis() >= updateSerialTaskTimer + updateSerialTaskInterval){  
   updateSerialTaskTimer += updateSerialTaskInterval;  
   // do the task  
   updateSerial();  
   Serial.println("updateSerial");  
  }  
 }  
 /*  
  * angleToPulse(int ang)  
  * gets angle in degree and returns the pulse width  
  * also prints the value on seial monitor  
  * written by Ahmad Nejrabi for Robojax, Robojax.com  
  */  
 unsigned int angleToPulse(byte ang){  
   unsigned int pulse = map(ang,0, 180, SERVOMIN,SERVOMAX);// map angle of 0 to 180 to Servo min and Servo max   
   return pulse;  
 }  
 void doServo () {  
  for (ch=0; ch < 16; ch++) {  
   if (reqAnglePOS[ch] < currAnglePOS[ch]) {  
    if ((currAnglePOS[ch] >= reqAnglePOS[ch]) && (currAnglePOS[ch] >= minAnglePOS[ch])) {  
     pwm.setPWM(ch, 0, angleToPulse(currAnglePOS[ch]));  
     currAnglePOS[ch]-=1;  
    }  
   }  
   else if (reqAnglePOS[ch] > currAnglePOS[ch]) {  
    if ((currAnglePOS[ch] <= reqAnglePOS[ch]) && (currAnglePOS[ch] <= maxAnglePOS[ch])) {  
     pwm.setPWM(ch, 0, angleToPulse(currAnglePOS[ch]));  
     currAnglePOS[ch]+=1;  
    }  
   }  
  }  
 }  
 void setCommand() {  
  switch (cmdFUNCTION) {  
   case 0:  // no command  
    reqAnglePOS[3] = idleAnglePOS[3];  
    reqAnglePOS[4] = idleAnglePOS[4];  
    reqAnglePOS[5] = idleAnglePOS[5];  
    reqAnglePOS[10] = idleAnglePOS[10];  
    reqAnglePOS[11] = idleAnglePOS[11];  
    reqAnglePOS[12] = idleAnglePOS[12];  
    break;  
   // #############################################################  
   case 1:  // pattern 1   
        // Lean to the left  
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4];  
    reqAnglePOS[5] = idleAnglePOS[5];  
    reqAnglePOS[10] = idleAnglePOS[10] - 15;  
    reqAnglePOS[11] = idleAnglePOS[11];  
    reqAnglePOS[12] = idleAnglePOS[12];  
    cmdFUNCTION = 2;  
    break;  
   case 2:   
    cmdFUNCTION = 3;  
    break;  
   case 3:  
    cmdFUNCTION = 4;  
    break;  
   case 4:  // pattern 2   
        // Right foot up forward step  
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4] + 20;  
    reqAnglePOS[5] = idleAnglePOS[5] + 20;  
    reqAnglePOS[10] = idleAnglePOS[10] - 15;  
    reqAnglePOS[11] = idleAnglePOS[11] + 20;  
    reqAnglePOS[12] = idleAnglePOS[12] + 20;  
    cmdFUNCTION = 5;   
    break;  
   case 5:  
    cmdFUNCTION = 6;  
    break;  
   case 6:    
    cmdFUNCTION = 7;  
    break;  
   case 7:  // pattern 3  
        // Right foot down  
    reqAnglePOS[3] = idleAnglePOS[3] + 15;  
    reqAnglePOS[4] = idleAnglePOS[4] + 20;  
    reqAnglePOS[5] = idleAnglePOS[5] + 20;  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11] + 20;  
    reqAnglePOS[12] = idleAnglePOS[12] + 20;  
    cmdFUNCTION = 8;   
    break;  
   case 8:  
    cmdFUNCTION = 9;  
    break;  
   case 9:  
    cmdFUNCTION = 10;  
    break;  
   case 10:  // pattern 4  
         // Balance foot  
    reqAnglePOS[3] = idleAnglePOS[3] + 25;  
    reqAnglePOS[4] = idleAnglePOS[4] + 20;  
    reqAnglePOS[5] = idleAnglePOS[5] + 20;  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11] + 0;  
    reqAnglePOS[12] = idleAnglePOS[12] + 0;  
    cmdFUNCTION = 11;  
    break;  
   case 11:  
    cmdFUNCTION = 12;  
    break;  
   case 12:  
    //  
    if (isWALKING) {  
     cmdFUNCTION = 13;  // continue walking  
    }  
    else {  
     cmdFUNCTION = 0;  // stop walking in upright position  
    }  
    break;  
   // ############################################################  
   case 13: // pattern 5  
        // Lean to the right  
    reqAnglePOS[3] = idleAnglePOS[3] + 15;  
    reqAnglePOS[4] = idleAnglePOS[4];  
    reqAnglePOS[5] = idleAnglePOS[5];  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11];  
    reqAnglePOS[12] = idleAnglePOS[12];  
    cmdFUNCTION = 14;  
    break;  
   case 14:  
    cmdFUNCTION = 15;  
    break;  
   case 15:  
    cmdFUNCTION = 16;  
    break;  
   case 16: // pattern 6  
        // Left foot up forward step  
    reqAnglePOS[3] = idleAnglePOS[3] + 15;  
    reqAnglePOS[4] = idleAnglePOS[4] - 20;  
    reqAnglePOS[5] = idleAnglePOS[5] - 20;  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11] - 20;  
    reqAnglePOS[12] = idleAnglePOS[12] - 20;  
    cmdFUNCTION = 17;  
    break;  
   case 17:  
    cmdFUNCTION = 18;  
    break;  
   case 18:  
    cmdFUNCTION = 19;  
    break;  
   case 19: // pattern 7  
        // Left foot down  
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4] - 20;  
    reqAnglePOS[5] = idleAnglePOS[5] - 20;  
    reqAnglePOS[10] = idleAnglePOS[10] - 15;  
    reqAnglePOS[11] = idleAnglePOS[11] - 20;  
    reqAnglePOS[12] = idleAnglePOS[12] - 20;  
    cmdFUNCTION = 20;  
    break;  
   case 20:  
    cmdFUNCTION = 21;  
    break;  
   case 21:  
    cmdFUNCTION = 22;  
    break;  
   case 22: // pattern 8  
        // Balance foot   
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4] - 0;  
    reqAnglePOS[5] = idleAnglePOS[5] - 0;  
    reqAnglePOS[10] = idleAnglePOS[10] - 25;  
    reqAnglePOS[11] = idleAnglePOS[11] - 20;  
    reqAnglePOS[12] = idleAnglePOS[12] - 20;  
    cmdFUNCTION = 23;  
    break;  
   case 23:  
    cmdFUNCTION = 24;  
    break;  
   case 24:  
    if (isWALKING) {  
     cmdFUNCTION = 1;  // continue walking  
    }  
    else {  
     cmdFUNCTION = 0;  // stop walking in upright position  
    }  
    break;  
   // #########################################################  
   case 25: // Vow  
    reqAnglePOS[3] = idleAnglePOS[3];  
    reqAnglePOS[4] = idleAnglePOS[4];  
    reqAnglePOS[5] = idleAnglePOS[5];  
    reqAnglePOS[10] = idleAnglePOS[10];  
    reqAnglePOS[11] = idleAnglePOS[11];  
    reqAnglePOS[12] = idleAnglePOS[12];  
    cmdFUNCTION = 26;  
    break;  
   case 26:  
    cmdFUNCTION = 27;  
    break;  
   case 27:  
    cmdFUNCTION = 28;  
    break;  
   case 28:  
    reqAnglePOS[3] = idleAnglePOS[3];  
    reqAnglePOS[4] = idleAnglePOS[4];  
    reqAnglePOS[5] = idleAnglePOS[5] - 90;  
    reqAnglePOS[10] = idleAnglePOS[10];  
    reqAnglePOS[11] = idleAnglePOS[11];  
    reqAnglePOS[12] = idleAnglePOS[12] + 90;  
    cmdFUNCTION = 29;  
    break;  
   case 29:  
    cmdFUNCTION = 30;  
    break;  
   case 30:  
    cmdFUNCTION = 0; // stand straight  
    break;  
   // ########################################################  
   case 31:  // pattern 4 REVERSE  
         // Balance foot  
    reqAnglePOS[3] = idleAnglePOS[3] + 25;  
    reqAnglePOS[4] = idleAnglePOS[4] + 20;  
    reqAnglePOS[5] = idleAnglePOS[5] + 20;  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11] + 0;  
    reqAnglePOS[12] = idleAnglePOS[12] + 0;  
    cmdFUNCTION = 32;  
    break;  
   case 32:  
    cmdFUNCTION = 33;  
    break;  
   case 33:  
    cmdFUNCTION = 34;  
    break;  
   case 34:  // pattern 3 REVERSE  
         // Right foot down  
    reqAnglePOS[3] = idleAnglePOS[3] + 15;  
    reqAnglePOS[4] = idleAnglePOS[4] + 20;  
    reqAnglePOS[5] = idleAnglePOS[5] + 20;  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11] + 20;  
    reqAnglePOS[12] = idleAnglePOS[12] + 20;  
    cmdFUNCTION = 35;  
    break;  
   case 35:  
    cmdFUNCTION = 36;  
    break;  
   case 36:  
    cmdFUNCTION = 37;  
    break;  
   case 37:  // pattern 2 REVERSE  
         // Right foot up forward step  
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4] + 20;  
    reqAnglePOS[5] = idleAnglePOS[5] + 20;  
    reqAnglePOS[10] = idleAnglePOS[10] - 15;  
    reqAnglePOS[11] = idleAnglePOS[11] + 20;  
    reqAnglePOS[12] = idleAnglePOS[12] + 20;  
    cmdFUNCTION = 38;  
    break;  
   case 38:  
    cmdFUNCTION = 39;  
    break;  
   case 39:  
    cmdFUNCTION = 40;  
    break;  
   case 40: // pattern 1 REVERSE  
        // Lean to the left  
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4];  
    reqAnglePOS[5] = idleAnglePOS[5];  
    reqAnglePOS[10] = idleAnglePOS[10] - 15;  
    reqAnglePOS[11] = idleAnglePOS[11];  
    reqAnglePOS[12] = idleAnglePOS[12];  
    cmdFUNCTION = 41;  
    break;  
   case 41:  
    cmdFUNCTION = 42;  
    break;  
   case 42:  
    if (isWALKING) {  
     cmdFUNCTION = 43;  // continue walking  
    }  
    else {  
     cmdFUNCTION = 0;  // stop walking in upright position  
    }  
    break;  
   // ###########################################  
   case 43: // pattern 8 REVERSE  
        // Balance foot   
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4] - 0;  
    reqAnglePOS[5] = idleAnglePOS[5] - 0;  
    reqAnglePOS[10] = idleAnglePOS[10] - 25;  
    reqAnglePOS[11] = idleAnglePOS[11] - 20;  
    reqAnglePOS[12] = idleAnglePOS[12] - 20;  
    cmdFUNCTION = 44;  
    break;  
   case 44:  
    cmdFUNCTION = 45;  
    break;  
   case 45:  
    cmdFUNCTION = 46;  
    break;  
   case 46: // pattern 7 REVERSE  
        // Left foot down  
    reqAnglePOS[3] = idleAnglePOS[3] - 10;  
    reqAnglePOS[4] = idleAnglePOS[4] - 20;  
    reqAnglePOS[5] = idleAnglePOS[5] - 20;  
    reqAnglePOS[10] = idleAnglePOS[10] - 15;  
    reqAnglePOS[11] = idleAnglePOS[11] - 20;  
    reqAnglePOS[12] = idleAnglePOS[12] - 20;  
    cmdFUNCTION = 47;  
    break;  
   case 47:  
    cmdFUNCTION = 48;  
    break;  
   case 48:  
    cmdFUNCTION = 49;  
    break;  
   case 49: // pattern 6 REVERSE  
        // Left foot up forward step  
    reqAnglePOS[3] = idleAnglePOS[3] + 15;  
    reqAnglePOS[4] = idleAnglePOS[4] - 20;  
    reqAnglePOS[5] = idleAnglePOS[5] - 20;  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11] - 20;  
    reqAnglePOS[12] = idleAnglePOS[12] - 20;  
    cmdFUNCTION = 50;  
    break;  
   case 50:  
    cmdFUNCTION = 51;  
    break;  
   case 51:  
    cmdFUNCTION = 52;  
    break;  
   case 52: // pattern 5 REVERSE  
        // Lean to the right  
    reqAnglePOS[3] = idleAnglePOS[3] + 15;  
    reqAnglePOS[4] = idleAnglePOS[4];  
    reqAnglePOS[5] = idleAnglePOS[5];  
    reqAnglePOS[10] = idleAnglePOS[10] + 10;  
    reqAnglePOS[11] = idleAnglePOS[11];  
    reqAnglePOS[12] = idleAnglePOS[12];  
    if (isWALKING) {  
     cmdFUNCTION = 31;  // continue walking  
    }  
    else {  
     cmdFUNCTION = 0;  // stop walking in upright position  
    }     
    break;  
   default:  
    break;  
  }  
 }  
 void setServo() {  
  // ##################  
  // ### COMMANDS ###  
  // ##################  
  if(ps2x.Button(PSB_R1)) {   
   // Reverse function  
   if (ps2x.ButtonPressed(PSB_PAD_UP)) {  
    isWALKING = 1;  
    cmdFUNCTION = 31;  
   }  
   if (ps2x.ButtonReleased(PSB_PAD_UP)) {  
    isWALKING = 0;  
    cmdFUNCTION = 0;  
   }  
   if (ps2x.Button(PSB_PAD_LEFT)) {  
    isWALKING = 0;  
    cmdFUNCTION = 31; // left foot backward  
   }  
   if (ps2x.Button(PSB_PAD_RIGHT)) {  
    isWALKING = 0;  
    cmdFUNCTION = 43; // right foot back ward  
   }  
   if (ps2x.Button(PSB_PAD_DOWN)) {  
    cmdFUNCTION = 0; //   
   }  
   if(ps2x.Button(PSB_GREEN)) {  
    cmdFUNCTION = 25;  
   }  
  }  
  else {  
   // Forward function  
   if (ps2x.ButtonPressed(PSB_PAD_UP)) {  
    isWALKING = 1;  
    cmdFUNCTION = 1;  
   }  
   if (ps2x.ButtonReleased(PSB_PAD_UP)) {  
    isWALKING = 0;  
    cmdFUNCTION = 0;  
   }  
   if (ps2x.Button(PSB_PAD_LEFT)) {  
    isWALKING = 0;  
    cmdFUNCTION = 13; // left foot forward  
   }  
   if (ps2x.Button(PSB_PAD_RIGHT)) {  
    isWALKING = 0;  
    cmdFUNCTION = 1; // right foot forward  
   }  
   if (ps2x.Button(PSB_PAD_DOWN)) {  
    cmdFUNCTION = 0; //   
   }  
   if(ps2x.Button(PSB_GREEN)) {  
    cmdFUNCTION = 25;  
   }  
  }  
 // // ##################  
 // // ### LEFT SIDE ###  
 // // ##################  
 // if (ps2x.Button(PSB_L3)) {  
 //  reqAnglePOS[3] = map(ps2x.Analog(PSS_LX), 0, 255, 0, 180);  
 // }  
 //   
 // if(ps2x.Button(PSB_L1)) {  
 //  reqAnglePOS[4] = map(ps2x.Analog(PSS_LY), 255, 0, 0, 180);  
 // }  
 //  
 // if(ps2x.Button(PSB_L2)) {  
 //  reqAnglePOS[5] = map(ps2x.Analog(PSS_LY), 0, 255, 0, 180);  
 // }  
 //  
 //  
 // // ##################  
 // // ### RIGHT SIDE ###  
 // // ##################  
 // if (ps2x.Button(PSB_R3)) {  
 //  reqAnglePOS[10] = map(ps2x.Analog(PSS_RX), 0, 255, 0, 180);  
 // }  
 //  
 // if(ps2x.Button(PSB_R1)) {  
 //  reqAnglePOS[11] = map(ps2x.Analog(PSS_RY), 0, 255, 0, 180);  
 // }  
 //  
 // if(ps2x.Button(PSB_R2)) {  
 //  reqAnglePOS[12] = map(ps2x.Analog(PSS_RY), 255, 0, 0, 180);  
 // }  
  // #######################  
  // ### RESET / DEFAULT ###  
  // #######################  
  // Reset to default when START button is pressed!  
  if (ps2x.Button(PSB_START)) {  
    cmdFUNCTION = 0;  
  }  
 }  
 void checkPS2 () {  
  ps2x.read_gamepad();  
 }  
 void updateLCD() {  
   mySerial.println(" from 6-DOF Robot ");  
 }  
 void updateSerial() {  
  Serial.print(reqAnglePOS[3]);  
  Serial.print(", ");  
  Serial.print(reqAnglePOS[4]);  
  Serial.print(", ");  
  Serial.print(reqAnglePOS[5]);  
  Serial.print(", ");  
  Serial.print(reqAnglePOS[10]);  
  Serial.print(", ");  
  Serial.print(reqAnglePOS[11]);  
  Serial.print(", ");  
  Serial.print(reqAnglePOS[12]);  
  Serial.println("");  
 }

```
