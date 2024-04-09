---
author: George Bantique
categories:
  - Uncategorized
date: '2020-12-26T11:16:00+08:00'
excerpt: "Recently Ms. Kate of Reyax Technology reach out with me to introduced their new IoT platform which is the RYC1001 and kind enough to give me a full access to explore this new cloud platform\n \nReyax Technology is a company based in Taiwan, they have a variety of products they even offering IoT solutions according to your project requirements."
tags:
  - MQTT database
  - Reyax
  - Reyax Technology
title: 'Reyax MQTT with Database: RYC10001 Introduction | Part 1'
url: /2020/12/26/reyax-mqtt-with-database-ryc10001-introduction-part-1/
---

## **Introduction**

![](/images/reyax-techtotinker-part2-1-1024x576.png)

Recently Ms. Kate of Reyax Technology reach out with me to introduced their new IoT platform which is the RYC1001 and kind enough to give me a full access to explore this new cloud platform

Reyax Technology is a company based in Taiwan, they have a variety of products they even offering IoT solutions according to your project requirements.

But for today, we will focus on this IoT cloud platform which is the RYC1001.

Firstly, I will use it to demonstrate its basic MQTT protocol then further explore its additional database capability over MQTT protocol later on.

So what is RYC1001?

RYC1001 is built on Amazon Web Services or AWS cloud computing platform which is one of the leaders in cloud technology as of this day.

It supports MQTT protocol which is one of the popular IoT solutions as of now.

It uses a well-thought simple instructions to easily integrate database capability through its MQTT platform via specific topic which we will explore later on.

## **Instruction**

As for the start, lets create the image illustrated above Home automation using basic MQTT.

### 1. Connection Profiles:

![](/images/reyax-techtotinker-part2-1-1.png)

*I prepared a 2 dashboard, one is to simulate the basic MQTT setup and another one to simulate MQTT setup with RYC1001 database capability.*

### 2. **Basic MQTT Setup | Connection:**

![](/images/reyax-techtotinker-part2-2.png)
*In the Client ID, I use my username-some identification for me to be able to identify the client.*

### 3. **Basic MQTT Setup | Connection continuation:**

![](/images/reyax-techtotinker-part2-3.png)

*Username and Password can be acquired from Reyax Technology.*

### 4. **Basic MQTT Setup | Dashboard:**

![](/images/reyax-techtotinker-part2-4.png)

***lr\_switch** simulates a light switch.*  
***lr\_lights** simulates a light bulb.  
**lr\_temp\_sensor** simulates a temperature sensor.  
**lr\_temperature** simulates a temperature gauge.*

### 5. **Basic MQTT Setup | Switch Panel:**

![](/images/reyax-techtotinker-part2-5.png)

*lr\_switch will publish to topic home/living\_room/lights.*

### 6. **Basic MQTT Setup | Lights Panel**:

![](/images/reyax-techtotinker-part2-6.png)

*lr\_lights subscribes to topic: home/living\_room/lights*

### 7. **Basic MQTT Setup | Temperature Sensor panel:**

![](/images/reyax-techtotinker-part2-7.png)
*lr\_temp\_sensor publishes to topic: home/living\_room/temperature*

### 8. **Basic MQTT Setup | Temperature Gauge panel:**

![](/images/reyax-techtotinker-part2-8.png)

*lr\_temperature subscribes to topic: home/living\_room/temperature.*

### **9. MQTT with Database Setup | Connection:**

![](/images/reyax-techtotinker-part2-10.png)

### **10. MQTT with Database Setup | Connection continuation:**

![](/images/reyax-techtotinker-part2-11.png)

### **11. MQTT with Database Setup | Dashboard:**

![](/images/reyax-techtotinker-part2-12.png)

### **12. MQTT with Database Setup | Switch panel:**

![](/images/reyax-techtotinker-part2-13.png)

*lr\_switch needs to publish command message to topic: **api/request** and subscribes to topic: api/command/&lt;Network\_ID&gt;/&lt;deviceTypeId&gt;/&lt;deviceId&gt;/control\_lights or in my case **api/command/35/5/gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic/control\_lights.**  
JsonPath for subscribe: **$.command.result.lights**  
JSON pattern for publish:*  
***{***  
 ***“action”: “command/insert”,***  
 ***“deviceId”: “gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic”,***  
 ***“command”:***  
 ***{***  
 ***“command”: “control\_lights”,***  
 ***“parameters”: {“Control”:”Lights”},***  
 ***“status”:”Done”,***  
 ***“result”: {“lights”: &lt;switch-payload&gt;}***  
 ***}***  
***}***  
&lt;switch-payload&gt; is a variable to send the state of the switch panel.

### **13. MQTT with Database Setup | Lights panel:**

![](/images/reyax-techtotinker-part2-14.png)

**lr\_lights subscribes to topic: api/command/&lt;Network\_ID&gt;/&lt;deviceTypeId&gt;/&lt;deviceId&gt;/control\_lights or in my case **api/command/35/5/gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic/control\_lights.**  
JsonPath for subscribe: **$.command.result.lights****

### **14. MQTT with Database Setup | Temperature sensor panel:**

![](/images/reyax-techtotinker-part2-15.png)

*lr\_temp\_sensor publishes a notification message to topic: api/request*    
*Subscribe Topic:*  
*api/notification/&lt;Network\_ID&gt;/&lt;deviceTypeId&gt;/&lt;deviceId&gt;/temperature*  
***api/notification/35/5/gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic/temperature***  
*JsonPath for subscribe: **$.notification.parameters.temperature**  
JSON pattern for publish:*    
***{***  
 ***“action”: “notification/insert”,***  
 ***“deviceId”: “gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic”,***  
 ***“notification”:***  
 ***{***  
 ***“notification”: “temperature”,***  
 ***“parameters”: {“temperature”: &lt;slider-payload&gt;}***  
 ***}***  
***}***  
&lt;slider-payload&gt; is a variable that takes the value of slider panel.

### **15. MQTT with Database Setup | Temperature gauge panel:**

![](/images/reyax-techtotinker-part2-16.png)

lr\_  
lr\_temperature should subscribe to topic:  
*api/notification/&lt;Network\_ID&gt;/&lt;deviceTypeId&gt;/&lt;deviceId&gt;/temperature*  
***api/notification/35/5/gyBII8EdlDdlLXZDfirHAuOiryBIz2RR4zic/temperature***  
*JsonPath for subscribe: **$.notification.parameters.temperature***

## **Video Demonstration**

{{< youtube tpeTeyjdJ5w >}}

## **Call To Action**

For any concern, write your message in the comment section.

You might also like to support my journey on Youtube by Subscribing. [Click this to Subscribe to TechToTinker.](https://www.youtube.com/c/TechToTinker?sub_confirmation=1)

Thank you and have a good days ahead.

See you,

**– George Bantique | tech.to.tinker@gmail.com**

## **References And Credits**

For more details, you may visit the product details at:
<http://reyax.com/products/ryc1001/>

Or if you decided to purchase it, visit:  
<https://www.amazon.com/REYAX-RYC1001-Cloud-Platform-Account/dp/B08M93FTPF>

So that’s it, if you enjoy this video please consider supporting my journey in Youtube by Subscribing to TechToTinker Youtube channel.

Thank you.

I use JSON Path Finder to find out the exact Json path:  
<https://jsonpathfinder.com/>

