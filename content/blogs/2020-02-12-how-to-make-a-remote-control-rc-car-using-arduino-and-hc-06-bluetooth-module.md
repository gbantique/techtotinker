---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-02-12T22:25:00+08:00'
tags:
  - Arduino
  - Arduino uno
  - bluetooth
  - DC motor
  - electronics
  - HC-05
  - HC-06
  - hobby
  - Motor driver
  - RC Car
  - Remote Control
  - technology
series:
  - My Arduino Exploration
title: How to make a Remote Control RC car using Arduino and HC-06 bluetooth module
url: /2020/02/12/how-to-make-a-remote-control-rc-car-using-arduino-and-hc-06-bluetooth-module/
---

## **Introduction**
Growing up in a poor family, I was amazed by remote control toys, robots, and transistor radios. I was curious about how those things worked.

One time, when I was a kid, I found an old, rusty but still functional DC motor typically found in battery-powered toy cars. When I got home, I connected it to a battery, and I spent the rest of my day thinking and planning how to use it for my next toy boat project.

My fascination with how things work, especially in the field of electronics, is my burning passion, which is why I continue to tinker. So today, we are going to convert a battery-powered toy car into a remote control car. The subject toy car has three DC motors inside: one motor controls the right-side front and rear wheels, another motor controls the left-side front and rear wheels, and the third motor controls the shovel arm, raising and lowering it.


## **Materials:**  
1. Battery powered toy car (our subject).  
2. Arduino Uno (or any other microcontroller available)  
3. Motor driver (here I am using 4 motors and 16 servo Arduino Uno shield of doit.am)  
4. HC-06 Bluetooth module  
5. Some jumper wires  


## **Video Demonstration:**

{{< youtube RlkGn6Xl7U >}}


## **Source Code**


```cpp { lineNos="true" wrap="true" }
#include <softwareserial.h>

// Arduino UNO Rx, Tx
SoftwareSerial hc06(13,12);
String cmd="";

//Motor A or MOTOR 1
int PWMA = 9; //Speed control
int DIRA = 8; //Direction
//Motor B or MOTOR 2
int PWMB = 6; //Speed control
int DIRB = 7; //Direction
//Motor C or MOTOR 3
int PWMC = 5; //Speed control
int DIRC = 4; //Direction
//Motor D or MOTOR 4gggjh
int PWMD = 3; //Speed control
int DIRD = 2; //Direction


void setup() {
  //Initialize Serial Monitor
  Serial.begin(9600);
  //Initialize Bluetooth Serial Port
  hc06.begin(9600);

  pinMode(PWMA, OUTPUT);
  pinMode(DIRA, OUTPUT);
  pinMode(PWMB, OUTPUT);
  pinMode(DIRB, OUTPUT);
  pinMode(PWMC, OUTPUT);
  pinMode(DIRC, OUTPUT);
  pinMode(PWMD, OUTPUT);
  pinMode(DIRD, OUTPUT);

  // Set default at full stop
  stopped();
  movehalt();
  Serial.print("Setup DONE.");
}


void loop() {
 //Read data from HC06
 while(hc06.available()>0){
   cmd+=(char)hc06.read();
 }

 //Select function with cmd
 if(cmd!=""){
   cmd.trim();  // Remove added LF in transmit
   // We expect Command from bluetooth
   if (cmd.equals("F")) {
       Serial.println("Vehicle Forward");
       forward();
   }else if (cmd.equals("B")){
       Serial.println("Vehicle Backward");
       backward();
   }else if(cmd.equals("L")){
       Serial.println("Vehicle Turn Left");  
       turnleft();
   }else if(cmd.equals("R")){
       Serial.println("Vehicle Turn Right");
       turnright();
   }else if(cmd.equals("S")){
       Serial.println("Vehicle Stop");
       stopped();
   }else if(cmd.equals("U")){
       Serial.println("Crane UP");
       moveup();
   }else if(cmd.equals("D")){
       Serial.println("Crane DOWN");
       movedown();   
   }else if(cmd.equals("H")){
       Serial.println("Crane HALT");
       movehalt();      
   }else{
       Serial.println("Command UNKNOWN");
       stopped();
       movehalt();
   }

   Serial.print("Command recieved:");
   Serial.println(cmd);
   cmd=""; //reset cmd
 }

 delay(100);
}

// Function for the vehicle to move FORWARD
void forward() {
  analogWrite(PWMA, 255);
  digitalWrite (DIRA, HIGH);
  analogWrite(PWMB, 255);
  digitalWrite (DIRB, HIGH);
}

// Function for the vehicle to move BACKWARD
void backward() {
  analogWrite(PWMA, 255);
  digitalWrite (DIRA, LOW);
  analogWrite(PWMB, 255);
  digitalWrite (DIRB, LOW);
}

// Function for the vehicle to turn RIGHT
void turnright() {
  analogWrite(PWMA, 255);
  digitalWrite (DIRA, HIGH);
  analogWrite(PWMB, 0);
  digitalWrite (DIRB, HIGH);
}

// Function for the vehicle to turn LEFT
void turnleft() {
  analogWrite(PWMA, 0);
  digitalWrite (DIRA, HIGH);
  analogWrite(PWMB, 255);
  digitalWrite (DIRB, HIGH);
}

// Function for the vehicle to STOP
void stopped() {
  analogWrite(PWMA, 0);
  digitalWrite (DIRA, HIGH);
  analogWrite(PWMB, 0);
  digitalWrite (DIRB, HIGH);
}

// Function for the crane to move UP
void moveup() {
  analogWrite(PWMC, 255);
  digitalWrite (DIRC, HIGH);
}

// Function for the crane to move DOWN
void movedown() {
  analogWrite(PWMC, 255);
  digitalWrite (DIRC, LOW);
}

// Function for the crane to HALT
void movehalt() {
  analogWrite(PWMC, 0);
  digitalWrite (DIRC, HIGH);
}

```


## **Call To Action**
If you find this lesson useful, please consider visiting my website and Youtube channel:
1. [https://techtotinker.com](https://techtotinker.com/)
2. [techtotinker Youtube Channel](https://www.youtube.com/c/gbantique)

Thank you. Happy tinkering.
