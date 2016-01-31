#include <SoftwareSerial.h>
#include <SPI.h>
#include <SD.h>
#include <Wire.h>
#include "Barometer.h"
#include "I2Cdev.h"
#include "MPU6050.h"
#include <Adafruit_Sensor.h>
#include "Adafruit_TSL2591.h"

const int LED = 7;
const int chipSelect = 4;
const int soundSensor = A0;

Adafruit_TSL2591 tsl = Adafruit_TSL2591(2591); // pass in a number for the sensor identifier (for your use later)

//Barometer variables
float pressure;
float atm;
Barometer myBarometer;

//Accelerometer variables
MPU6050 accelgyro;
I2Cdev   I2C_M;
int16_t ax, ay, az;
int16_t gx, gy, gz;
int16_t   mx, my, mz;
float Axyz[3];

File dataFile;
String dataRow;
String seperator = ",";
String dattim = "noval";
int rowCounter = 1;

//GPS variables
unsigned char buffer[64];                   // buffer array for data receive over serial port
int count = 0;                              // counter for buffer array

SoftwareSerial ss(2, 3);

//Button variables
const int buttonPin = 8;
int buttonState = 0;
int lastButtonState = 0;
int isOn;

/*
  GPS to 3, 2, 5V and GND.
  Sound to A0.
  Gyro, Light and Barometer to I2C.
  Button to 8.
  LED to 7.
*/

void setup() {
  Serial.begin(9600);
  Wire.begin();
  //Initialize Accelerometer
  accelgyro.initialize();
  //Serial.println(accelgyro.testConnection() ? F("MPU6050 connection successful") : F("MPU6050 connection failed"));

  delay(1000);

  //Init barometer
  myBarometer.init();

  //Init light sensor
  tsl.begin();
  tsl.setGain(TSL2591_GAIN_HIGH);   // 428x gain
  tsl.setTiming(TSL2591_INTEGRATIONTIME_100MS);  // shortest integration time (bright light)

  // Initalize SD card:
  //Serial.print("init sd card...");

  if (!SD.begin(chipSelect)) {
    //Serial.println("Card failed, or not present");
    // don't do anything more:
    return;
  }
  //Serial.println(F("card initialized."));

  //Pins:
  pinMode(LED, OUTPUT);
  pinMode(soundSensor, INPUT);
  pinMode(buttonPin, INPUT);

  //Serial.println(F(FreeRam()));
  dataFile = SD.open("test.csv", FILE_WRITE);

  // If the file opened okay, write to it:
  if (dataFile) {
    //Serial.print("Writing to test.txt...");
    dataFile.println("row,NMEA,sound,brightness,acc_x,acc_y,acc_z,altitude");
    // close the file:
    dataFile.close();
    //Serial.println("done.");
  } else {
    // if the file didn't open, print an error:
    Serial.println(F("error opening test.txt"));
  }
}

void loop() {
  buttonState = digitalRead(buttonPin);

  //Serial.println(buttonState);
  if (buttonState != lastButtonState) {
    if (buttonState == HIGH) {
      //buttonPushCounter++;
      Serial.println(F("ON"));
      isOn = 1 - isOn;
      //Serial.print(buttonPushCounter);

    } else {
    }
    delay(50);
  }
  lastButtonState = buttonState;

  if (isOn == 1) {
    digitalWrite(LED, HIGH);
    bool newData = false;

    ss.begin(9600);

    //Serial.println("starting gps reading");

    // Parse GPS data for one second and report some key values

    if (ss.available())                     // if date is coming from software serial port ==> data is coming from SoftSerial shield
    {
      while (ss.available())              // reading data into char array
      {
        buffer[count++] = ss.read();    // writing data into array
        if (count == 64)break;
      }
      Serial.write(buffer, count);     // if no data transmission ends, write buffer to hardware serial port
      writeData();
      clearBufferArray();                         // call clearBufferArray function to clear the stored data from the array
      count = 0;                                  // set counter of while loop to zero
    }


  } else {
    digitalWrite(LED, LOW);   // turn the LED on (HIGH is the voltage level)
    Serial.println(F("OFF"));
  }

}

void getAccel_Data(void)
{
  accelgyro.getMotion9(&ax, &ay, &az, &gx, &gy, &gz, &mx, &my, &mz);
  Axyz[0] = (double) ax / 16384;
  Axyz[1] = (double) ay / 16384;
  Axyz[2] = (double) az / 16384;
}

void clearBufferArray()                     // function to clear buffer array
{
  for (int i = 0; i < count; i++)
  {
    buffer[i] = NULL;
  }
}

void writeData()
{
  //First, get data from accelerometer
  getAccel_Data();

  //Save collected data to sd card
  dataFile = SD.open("test.csv", FILE_WRITE);

  if (dataFile) {
    // Serial.print("Writing to test.txt...");
    dataFile.print(rowCounter);
    dataFile.print(seperator);
    dataFile.print((const char *) buffer);
    dataFile.print(seperator);
    dataFile.print(analogRead(soundSensor));
    dataFile.print(seperator);
    dataFile.print(tsl.getLuminosity(TSL2591_VISIBLE));
    dataFile.print(seperator);
    dataFile.print(Axyz[0], 2);
    dataFile.print(seperator);
    dataFile.print(Axyz[1], 2);
    dataFile.print(seperator);
    dataFile.print(Axyz[2], 2);
    dataFile.print(seperator);
    dataFile.println(myBarometer.calcAltitude(myBarometer.bmp085GetPressure(myBarometer.bmp085ReadUP())));

    // close the file:
    dataFile.close();

    rowCounter = rowCounter + 1;
    Serial.println(F("done writing."));
  } else {
    // if the file didn't open, print an error:
    Serial.println(F("error opening file"));
  }
}
