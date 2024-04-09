---
author: George Bantique
categories:
  - Arduino
  - Uno
date: '2020-08-26T09:27:00+08:00'
tags:
  - 2.4 tft display
  - arduino ili9341
  - arduino spfd5408
  - ili9341 arduino
  - spfd5408 arduino
title: 'Tutorial: How to use 2.4 TFT Display | SPFD5408 | ILI9341'
url: /2020/08/26/tutorial-how-to-use-2-4-tft-display-spfd5408-ili9341/
---

## **Introduction**

Display modules is commonly use to show text, shapes, images, or animation to convey necessary information to the user. In this tutorial, we will learn to use the 2.4 inch TFT display.

## **Video Demonstration**

{{< youtube D3lv0eySz8A >}}

## **Call To Action**

If you have any question, please do not hesitate to write it in the comment box and I am happy to answer it.

If you find this tutorial as helpful, please consider supporting me by Subscribing TechToTinker Youtube channel. [Click this to subscribe.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and keep tinkering.

## **Source Code**

**Example 1: Displaying text:**

```cpp { lineNos="true" wrap="true" }
// Modified for SPFD5408 Library by Joao Lopes

#include "SPFD5408_Adafruit_GFX.h"    // Core graphics library
#include "SPFD5408_Adafruit_TFTLCD.h" // Hardware-specific library
#include "SPFD5408_TouchScreen.h"

// Pin assignments for the TFT touch screen
#define YP    A1
#define XM    A2
#define YM    7
#define XP    6

// Calibrated values for the TFT touch screen  
#define TS_MINX   178
#define TS_MINY   75
#define TS_MAXX   931
#define TS_MAXY   895

// Instantiate the ts object
TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);

#define LCD_RD    A0
#define LCD_WR    A1
#define LCD_CD    A2
#define LCD_CS    A3
#define LCD_RESET A4

// Instantiate the tft object
Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);

// Assign human-readable names to some common 16-bit color values:
#define	BLACK   0x0000
#define	BLUE    0x001F
#define	RED     0xF800
#define	GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF

void setup(void) {
  Serial.begin(9600);
  Serial.println(F("Paint!"));
  
  tft.reset();
  tft.begin(0x9341);      // SPFD5408 compatible
  tft.setRotation(2);     // This settings works for me with correct orientation
                          // tft.setRotation(2);
  tft.fillScreen(BLACK);  //Set Background Color with BLACK

  tft.setTextColor(WHITE);
  tft.setTextSize(1);
  tft.setCursor(10, 10);
  tft.println("Hello from TechToTinker");

  tft.setTextColor(RED);
  tft.setTextSize(2);
  tft.setCursor(10, 30);
  tft.println("2.4 TFT Display");
}

void loop() {}
```

**Example 2: Displaying Shapes:**

```cpp { lineNos="true" wrap="true" }
// Modified for SPFD5408 Library by Joao Lopes

#include "SPFD5408_Adafruit_GFX.h"    // Core graphics library
#include "SPFD5408_Adafruit_TFTLCD.h" // Hardware-specific library
#include "SPFD5408_TouchScreen.h"

// Pin assignments for the TFT touch screen
#define YP    A1
#define XM    A2
#define YM    7
#define XP    6

// Calibrated values for the TFT touch screen  
#define TS_MINX   178
#define TS_MINY   75
#define TS_MAXX   931
#define TS_MAXY   895

// Instantiate the ts object
TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);

#define LCD_RD    A0
#define LCD_WR    A1
#define LCD_CD    A2
#define LCD_CS    A3
#define LCD_RESET A4

// Instantiate the tft object
Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);

// Assign human-readable names to some common 16-bit color values:
#define	BLACK   0x0000
#define	BLUE    0x001F
#define	RED     0xF800
#define	GREEN   0x07E0
#define CYAN    0x07FF
#define MAGENTA 0xF81F
#define YELLOW  0xFFE0
#define WHITE   0xFFFF

void setup(void) {
  Serial.begin(9600);
  Serial.println(F("Paint!"));
  
  tft.reset();
  tft.begin(0x9341);      // SPFD5408 compatible
  tft.setRotation(2);     // This settings works for me with correct orientation
                          // tft.setRotation(2);
  tft.fillScreen(BLACK);  //Set Background Color with BLACK

  tft.setTextColor(WHITE);
  tft.setTextSize(1);
  tft.setCursor(10, 10);
  tft.println("Hello from TechToTinker");

  tft.setTextColor(RED);
  tft.setTextSize(2);
  tft.setCursor(10, 30);
  tft.println("2.4 TFT Display");

  tft.drawCircle(120, 160, 20, YELLOW);
  tft.fillCircle(120, 160, 10, GREEN);
  tft.drawTriangle(10,70,80,70,60,90,CYAN);
}

void loop() {}
```

**<u>Example 3: Using Touch Screen:</u>**

```cpp { lineNos="true" wrap="true" }
// Modified for SPFD5408 Library by Joao Lopes  
 #include <SPFD5408_Adafruit_GFX.h>  // Core graphics library  
 #include <SPFD5408_Adafruit_TFTLCD.h> // Hardware-specific library  
 #include <SPFD5408_TouchScreen.h>  
 // Pin assignments for the TFT touch screen  
 #define YP  A1  
 #define XM  A2  
 #define YM  7  
 #define XP  6  
 // Calibrated values for the TFT touch screen   
 #define TS_MINX  178  
 #define TS_MINY  75  
 #define TS_MAXX  931  
 #define TS_MAXY  895  
 // Instantiate the ts object  
 TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);  
 #define LCD_RD  A0  
 #define LCD_WR  A1  
 #define LCD_CD  A2  
 #define LCD_CS  A3  
 #define LCD_RESET A4  
 // Instantiate the tft object  
 Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);  
 // Assign human-readable names to some common 16-bit color values:  
 #define BLACK  0x0000  
 #define BLUE  0x001F  
 #define RED   0xF800  
 #define GREEN  0x07E0  
 #define CYAN  0x07FF  
 #define MAGENTA 0xF81F  
 #define YELLOW 0xFFE0  
 #define WHITE  0xFFFF  
 #define BOXSIZE   40  
 #define PENRADIUS  3  
 #define MINPRESSURE 10  
 #define MAXPRESSURE 1000  
 #define LED_PIN   A5  
 int touch = 0;  
 void setup() {  
  pinMode(LED_PIN, OUTPUT);  
  digitalWrite(LED_PIN, LOW);  
  Serial.begin(9600);  
  tft.reset();  
  tft.begin(0x9341);  
  tft.setRotation(2); // This settings works for me with correct orientation  
            // tft.setRotation(2);  
  tft.setTextColor(WHITE);  
  tft.setTextSize(2);  
  tft.fillScreen(BLACK);  
  tft.fillRect(0, 0, 120, 120, GREEN);  
  tft.fillRect(120, 0, 120, 120, RED);  
  tft.setCursor(15, 45);  
  tft.println("LED ON");  
  tft.setCursor(128, 45);  
  tft.println("LED OFF");  
  tft.setTextColor(WHITE, BLACK);  
  tft.setTextSize(8);  
 }  
 void loop() {  
  // Get the touch points  
  TSPoint p = ts.getPoint();  
  // Restore the mode  
  pinMode(XM, OUTPUT);  
  pinMode(YP, OUTPUT);  
  if (p.z > MINPRESSURE && p.z < MAXPRESSURE) {  
   p.x = map(p.x, TS_MINX, TS_MAXX, 0, tft.width());  
   p.y = map(p.y, TS_MINY, TS_MAXY, 0, tft.height());  
   // Touch area for box 1  
   if (p.x > 0 && p.x < 120) {  
    if (p.y > 0 && p.y < 120) {  
     touch = 1;  
    }  
   }  
   // Touch area for box 2  
   if (p.x > 120 && p.x < 240) {  
    if (p.y > 0 && p.y < 120) {  
     touch = 2;  
    }  
   }  
  }  
  // Process the touch in box 1  
  if (touch == 1) {  
   digitalWrite(LED_PIN, HIGH);  
   tft.setCursor(100,200);  
   tft.print("1");  
   touch = 0;  
   delay(100);  
  }  
  // Process the touch in box 2  
  if (touch == 2) {  
   digitalWrite(LED_PIN, LOW);  
   tft.setCursor(100,200);  
   tft.print("0");  
   touch = 0;  
   delay(100);  
  }  
 }  
```

**Example 4: Accessing the microSD card:**

```cpp { lineNos="true" wrap="true" }
// Load the libraries for microSD  
 #include <SPI.h>  
 #include <SD.h>  
 // Load the libraries for the TFT display  
 #include <SPFD5408_Adafruit_GFX.h>  // Core graphics library  
 #include <SPFD5408_Adafruit_TFTLCD.h> // Hardware-specific library  
 #include <SPFD5408_TouchScreen.h>  
 #if defined(__SAM3X8E__)  
   #undef __FlashStringHelper::F(string_literal)  
   #define F(string_literal) string_literal  
 #endif  
 // Pin assignments for the touch screen  
 #define YP A1  
 #define XM A2  
 #define YM 7  
 #define XP 6  
 // Calibrate values    
 #define TS_MINX 178  
 #define TS_MINY 75  
 #define TS_MAXX 931  
 #define TS_MAXY 895  
 // For better pressure precision, we need to know the resistance  
 // between X+ and X- Use any multimeter to read it  
 // For the one we're using, its 300 ohms across the X plate  
 TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);  
 #define LCD_RD  A0  
 #define LCD_WR  A1  
 #define LCD_CD  A2  
 #define LCD_CS  A3  
 #define LCD_RESET A4  
 // Assign human-readable names to some common 16-bit color values:  
 #define  BLACK  0x0000  
 #define  BLUE  0x001F  
 #define  RED   0xF800  
 #define  GREEN  0x07E0  
 #define CYAN  0x07FF  
 #define MAGENTA 0xF81F  
 #define YELLOW 0xFFE0  
 #define WHITE  0xFFFF  
 Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);  
 File myFile;  
 void setup(void) {  
  tft.reset();  
  tft.begin(0x9341); // SDFP5408  
  tft.setRotation(2); // This settings works for me with correct orientation  
            // tft.setRotation(2);  
  tft.fillScreen(BLACK); //Set Background Color with BLACK  
  tft.setTextColor(WHITE);  
  tft.setTextSize(2);  
  tft.println("MicroSD Read Write");  
  tft.println("");  
  tft.println("Initializing SD card...");  
  if (!SD.begin(10)) {  
   tft.println("initialization failed!");  
   while (1);  
  }  
  tft.println("initialization done.");  
  // open the file. note that only one file can be open at a time,  
  // so you have to close this one before opening another.  
  myFile = SD.open("test.txt", FILE_WRITE);  
  // if the file opened okay, write to it:  
  if (myFile) {  
   tft.println("Writing to test.txt...");  
   myFile.println("testing 1, 2, 3.");  
   // close the file:  
   myFile.close();  
   tft.println("Done.");  
  } else {  
   // if the file didn't open, print an error:  
   tft.println("error opening test.txt");  
  }  
  // re-open the file for reading:  
  myFile = SD.open("test.txt");  
  if (myFile) {  
   tft.println("test.txt:");  
   // read from the file until there's nothing else in it:  
   while (myFile.available()) {  
    tft.write(myFile.read());  
   }  
   // close the file:  
   myFile.close();  
  } else {  
   // if the file didn't open, print an error:  
   tft.println("error opening test.txt");  
  }  
  tft.println("");  
  tft.println("Done");  
 }  
 void loop()  
 {  
 }  
```

**Example 5: Displaying BMP Pictures:**

```cpp { lineNos="true" wrap="true" }
// Modified for SPFD5408 Library by Joao Lopes  
 #include <SPFD5408_Adafruit_GFX.h>  // Core graphics library  
 #include <SPFD5408_Adafruit_TFTLCD.h> // Hardware-specific library  
 #include <SPFD5408_TouchScreen.h>  
 #include <SPI.h>  
 #include <SD.h>  
 #define LCD_RD  A0  
 #define LCD_WR  A1  
 #define LCD_CD  A2  
 #define LCD_CS  A3  
 #define LCD_RESET A4  
 // Instantiate the tft object  
 Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);  
 #define SD_CS 10  
 void setup()  
 {  
  Serial.begin(9600);  
  tft.reset();  
  tft.begin(0x9341);  
  tft.setRotation(3);  
  progmemPrint(PSTR("Initializing SD card..."));  
  if (!SD.begin(SD_CS)) {  
   progmemPrintln(PSTR("failed!"));  
   return;  
  }  
  progmemPrintln(PSTR("OK!"));  
 }  
 void loop() {  
  bmpDraw("Youtube.bmp", 0, 0);  
  delay(4000);  
  bmpDraw("Logo.bmp", 0, 0);  
  delay(4000);  
  bmpDraw("Subs.bmp", 0, 0);  
  delay(4000);   
  bmpDraw("TTT.bmp", 0, 0);  
  delay(4000);  
  bmpDraw("CLSS.bmp", 0, 0);  
  delay(4000);   
 }  
 // This function opens a Windows Bitmap (BMP) file and  
 // displays it at the given coordinates. It's sped up  
 // by reading many pixels worth of data at a time  
 // (rather than pixel by pixel). Increasing the buffer  
 // size takes more of the Arduino's precious RAM but  
 // makes loading a little faster. 20 pixels seems a  
 // good balance.  
 #define BUFFPIXEL 20  
 void bmpDraw(char *filename, int x, int y) {  
  File   bmpFile;  
  int   bmpWidth, bmpHeight;  // W+H in pixels  
  uint8_t bmpDepth;       // Bit depth (currently must be 24)  
  uint32_t bmpImageoffset;    // Start of image data in file  
  uint32_t rowSize;        // Not always = bmpWidth; may have padding  
  uint8_t sdbuffer[3*BUFFPIXEL]; // pixel in buffer (R+G+B per pixel)  
  uint16_t lcdbuffer[BUFFPIXEL]; // pixel out buffer (16-bit per pixel)  
  uint8_t buffidx = sizeof(sdbuffer); // Current position in sdbuffer  
  boolean goodBmp = false;    // Set to true on valid header parse  
  boolean flip  = true;    // BMP is stored bottom-to-top  
  int   w, h, row, col;  
  uint8_t r, g, b;  
  uint32_t pos = 0, startTime = millis();  
  uint8_t lcdidx = 0;  
  boolean first = true;  
  if((x >= tft.width()) || (y >= tft.height())) return;  
  Serial.println();  
  progmemPrint(PSTR("Loading image '"));  
  Serial.print(filename);  
  Serial.println(''');  
  // Open requested file on SD card  
  if ((bmpFile = SD.open(filename)) == NULL) {  
   progmemPrintln(PSTR("File not found"));  
   return;  
  }  
  // Parse BMP header  
  if(read16(bmpFile) == 0x4D42) { // BMP signature  
   progmemPrint(PSTR("File size: ")); Serial.println(read32(bmpFile));  
   (void)read32(bmpFile); // Read & ignore creator bytes  
   bmpImageoffset = read32(bmpFile); // Start of image data  
   progmemPrint(PSTR("Image Offset: ")); Serial.println(bmpImageoffset, DEC);  
   // Read DIB header  
   progmemPrint(PSTR("Header size: ")); Serial.println(read32(bmpFile));  
   bmpWidth = read32(bmpFile);  
   bmpHeight = read32(bmpFile);  
   if(read16(bmpFile) == 1) { // # planes -- must be '1'  
    bmpDepth = read16(bmpFile); // bits per pixel  
    progmemPrint(PSTR("Bit Depth: ")); Serial.println(bmpDepth);  
    if((bmpDepth == 24) && (read32(bmpFile) == 0)) { // 0 = uncompressed  
     goodBmp = true; // Supported BMP format -- proceed!  
     progmemPrint(PSTR("Image size: "));  
     Serial.print(bmpWidth);  
     Serial.print('x');  
     Serial.println(bmpHeight);  
     // BMP rows are padded (if needed) to 4-byte boundary  
     rowSize = (bmpWidth * 3 + 3) & ~3;  
     // If bmpHeight is negative, image is in top-down order.  
     // This is not canon but has been observed in the wild.  
     if(bmpHeight < 0) {  
      bmpHeight = -bmpHeight;  
      flip   = false;  
     }  
     // Crop area to be loaded  
     w = bmpWidth;  
     h = bmpHeight;  
     if((x+w-1) >= tft.width()) w = tft.width() - x;  
     if((y+h-1) >= tft.height()) h = tft.height() - y;  
     // Set TFT address window to clipped image bounds  
     tft.setAddrWindow(x, y, x+w-1, y+h-1);  
     for (row=0; row<h; row++) { // For each scanline...  
      // Seek to start of scan line. It might seem labor-  
      // intensive to be doing this on every line, but this  
      // method covers a lot of gritty details like cropping  
      // and scanline padding. Also, the seek only takes  
      // place if the file position actually needs to change  
      // (avoids a lot of cluster math in SD library).  
      if(flip) // Bitmap is stored bottom-to-top order (normal BMP)  
       pos = bmpImageoffset + (bmpHeight - 1 - row) * rowSize;  
      else   // Bitmap is stored top-to-bottom  
       pos = bmpImageoffset + row * rowSize;  
      if(bmpFile.position() != pos) { // Need seek?  
       bmpFile.seek(pos);  
       buffidx = sizeof(sdbuffer); // Force buffer reload  
      }  
      for (col=0; col<w; col++) { // For each column...  
       // Time to read more pixel data?  
       if (buffidx >= sizeof(sdbuffer)) { // Indeed  
        // Push LCD buffer to the display first  
        if(lcdidx > 0) {  
         tft.pushColors(lcdbuffer, lcdidx, first);  
         lcdidx = 0;  
         first = false;  
        }  
        bmpFile.read(sdbuffer, sizeof(sdbuffer));  
        buffidx = 0; // Set index to beginning  
       }  
       // Convert pixel from BMP to TFT format  
       b = sdbuffer[buffidx++];  
       g = sdbuffer[buffidx++];  
       r = sdbuffer[buffidx++];  
       lcdbuffer[lcdidx++] = tft.color565(r,g,b);  
      } // end pixel  
     } // end scanline  
     // Write any remaining data to LCD  
     if(lcdidx > 0) {  
      tft.pushColors(lcdbuffer, lcdidx, first);  
     }   
     progmemPrint(PSTR("Loaded in "));  
     Serial.print(millis() - startTime);  
     Serial.println(" ms");  
    } // end goodBmp  
   }  
  }  
  bmpFile.close();  
  if(!goodBmp) progmemPrintln(PSTR("BMP format not recognized."));  
 }  
 // These read 16- and 32-bit types from the SD card file.  
 // BMP data is stored little-endian, Arduino is little-endian too.  
 // May need to reverse subscript order if porting elsewhere.  
 uint16_t read16(File f) {  
  uint16_t result;  
  ((uint8_t *)&result)[0] = f.read(); // LSB  
  ((uint8_t *)&result)[1] = f.read(); // MSB  
  return result;  
 }  
 uint32_t read32(File f) {  
  uint32_t result;  
  ((uint8_t *)&result)[0] = f.read(); // LSB  
  ((uint8_t *)&result)[1] = f.read();  
  ((uint8_t *)&result)[2] = f.read();  
  ((uint8_t *)&result)[3] = f.read(); // MSB  
  return result;  
 }  
 // Copy string from flash to serial port  
 // Source string MUST be inside a PSTR() declaration!  
 void progmemPrint(const char *str) {  
  char c;  
  while(c = pgm_read_byte(str++)) Serial.print(c);  
 }  
 // Same as above, with trailing newline  
 void progmemPrintln(const char *str) {  
  progmemPrint(str);  
  Serial.println();  
 }  
```

## **References And Credits**

![](/images/Youtube.bmp)

![](/images/TTT.bmp)

![](/images/Subs.bmp)

![](/images/Logo.bmp)

![](/images/CLSS.bmp)

