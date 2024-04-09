---
author: George Bantique
categories:
  - ESP32
  - MicroPython
date: '2020-11-07T14:34:00+08:00'
tags:
  - esp32 micropython
  - ESP8266 MicroPython
  - micropython ajax
  - micropython auto updates values
  - MicroPython tutorials
  - micropython weather station
series:
  - ESP32 MicroPython
title: '017 - ESP32 MicroPython: DHT Values Auto Updates using AJAX'
url: /2020/11/07/017-esp32-micropython-dht-values-auto-updates-using-ajax/
---

## **Introduction**

![](/images/017-technotes-web-server-esp32-techtotinker.png)

In the previous tutorials we learned to create web server both as station mode and access point mode using socket connection. And in last video, we use a DHT sensor for displaying measurement readings in simple web server similar to a weather station. While displaying sensor values, we discovered the necessity of constantly updating the displayed measurements. And we concluded that updating the whole web page using the html meta refresh is not efficient. I decided to learn AJAX in order to update only the DHT sensor values displayed without refreshing the whole web page.

## **Bill Of Materials**

1. ESP32 development board, or ESP8266.
2. DHT22 temperature and humidity sensor, or DHT11.

## **Hardware Instruction**
j
1. Connect the DHT22 VCC pin to ESP32 3.3V pin.
2. Connect the DHT22 Data pin to ESP32 D23 pin.
3. Connect the DHT22 GND pin to ESP32 GND pin.

![](/images/017-technotes-web-server-esp32-techtotinker-diagram.png)

## **Video Demonstration**

{{< youtube r9eUTvj9zEM >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **Source Code**

```py { lineNos="true" wrap="true" }
# ******************************************** #
# DHT values auto updates using AJAX           #
# Author: George Bantique, TechToTinker        #
# tech.to.tinker@gmail.com                     #
# Created: Nov. 11, 2020                       #
#                                              #
# NOTE: Please feel free to modify and adapt   #
#    the source code according to your needs.  #
#                                              #
# ******************************************** #
#
import machine
import dht
led = machine.Pin(2,machine.Pin.OUT)
led.off()
d = dht.DHT22(machine.Pin(23))

# ************************
# Configure the ESP32 wifi
# as STAtion mode.
import network
import wifi_credentials

sta = network.WLAN(network.STA_IF)
if not sta.isconnected():
    print('connecting to network...')
    sta.active(True)
    #sta.connect('your wifi ssid', 'your wifi password')
    sta.connect(wifi_credentials.ssid, wifi_credentials.password)
    while not sta.isconnected():
        pass
    print('network config:', sta.ifconfig())

# ************************
# Configure the socket connection
# over TCP/IP
import socket

# AF_INET - use Internet Protocol v4 addresses
# SOCK_STREAM means that it is a TCP socket.
# SOCK_DGRAM means that it is a UDP socket.
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('',80)) # specifies that the socket is reachable by any address the machine happens to have
s.listen(5)     # max of 5 socket connections

# ************************
# Function for creating the
# web page to be displayed
def web_page():
    html_page = """
  
 <html>  
  <head>  
  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>  
  <script>   
   var ajaxRequest = new XMLHttpRequest();  
   
   function ajaxLoad(ajaxURL)  
   {  
    ajaxRequest.open('GET',ajaxURL,true);  
    ajaxRequest.onreadystatechange = function()  
    {  
     if(ajaxRequest.readyState == 4 && ajaxRequest.status==200)  
     {  
      var ajaxResult = ajaxRequest.responseText;  
      var tmpArray = ajaxResult.split("|");  
      document.getElementById('temp').innerHTML = tmpArray[0];  
      document.getElementById('humi').innerHTML = tmpArray[1];  
     }  
    }  
    ajaxRequest.send();  
   }  
     
   function updateDHT()   
   {   
     ajaxLoad('getDHT');   
   }  
     
   setInterval(updateDHT, 3000);  
    
  </script>  
    
    
  <title>ESP32 Weather Station</title>  
  </head>  
    
  <body>  
   <center>  
   <div id='main'>  
    <h1>MicroPython Weather Station</h1>  
    <h4>Web server on ESP32 | DHT values auto updates using AJAX.</h4>  
    <div id='content'>   
     <p>Temperature: <strong><span id='temp'>--.-</span> &deg;C</strong></p>  
     <p>Humidity: <strong><span id='humi'>--.-</span> % </strong></p>  
    </div>  
   </div>  
   </center>  
  </body>  
 </html>
"""
    return html_page

while True:
    
    # Socket accept() 
    conn, addr = s.accept()
    print("Got connection from %s" % str(addr))
    
    # Socket receive()
    request=conn.recv(1024)
    print("")
    print("Content %s" % str(request))

    # Socket send()
    request = str(request)
    update = request.find('/getDHT')
    if update == 6:
        d.measure()
        t = d.temperature()
        h = d.humidity()
        response = str(t) + "|"+ str(h)
        led.value(not led.value())
    else:
        response = web_page()
        
    # Create a socket reply
    conn.send('HTTP/1.1 200 OK\n')
    conn.send('Content-Type: text/html\n')
    conn.send('Connection: close\n\n')
    conn.sendall(response)
    
    # Socket close()
    conn.close()

```

## **References And Credits**

1. W3Schools Ajax Introduction:  
[https://www.w3schools.com/js/js\_ajax\_intro.asp](https://www.w3schools.com/js/js_ajax_intro.asp)

2. W3Schools setInterval Method:  
[https://www.w3schools.com/jsref/met\_win\_setinterval.asp](https://www.w3schools.com/jsref/met_win_setinterval.asp)

