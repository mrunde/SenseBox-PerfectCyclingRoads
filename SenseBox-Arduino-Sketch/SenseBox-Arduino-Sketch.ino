#include <SoftwareSerial.h>
#include <TinyGPS.h>
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
float Gxyz[3];
float Mxyz[3];

TinyGPS gps;

File dataFile;
String dataRow;
String seperator = ";";
String dattim = "noval";
int rowCounter = 1;

SoftwareSerial ss(2, 3);

//Button variables
const int buttonPin = 8;// the number of the pushbutton pin
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

  // Initialize Light Sensor
  //Init light sensor
  tsl.begin()
  tsl.setGain(TSL2591_GAIN_HIGH);   // 428x gain
  tsl.setTiming(TSL2591_INTEGRATIONTIME_100MS);  // shortest integration time (bright light)

  //Init barometer
  myBarometer.init();

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
    dataFile.println("row;lat;lon;speed;timestamp;sound;brightness;vibration;altitude");
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
    //Serial.println("Searching GPS...");
    for (unsigned long start = millis(); millis() - start < 1000;)
    {
      while (ss.available())
      {
        char c = ss.read();
        //Serial.print(c); // uncomment to see the full NMEA datasets
        if (gps.encode(c)) { // Did a new valid sentence come in?
          newData = true;
          Serial.println(F("Data found! Proceeding..."));
        }
      }
    }

    ss.end();


    if (newData)

    {
      // IF NEW GPS-DATA
      Serial.println(F("GPS data found!"));



      float flat, flon;
      unsigned long age, date, time;
      gps.f_get_position(&flat, &flon, &age);
      //Serial.println("");
      //Serial.print("LAT = ");
      flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6;
      //Serial.print("LON = ");
      flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6;
      //Speed
      gps.f_speed_kmph() == TinyGPS::GPS_INVALID_F_SPEED ? 0 : gps.f_speed_kmph();

      // Serial.println("DATE & TIME:");

      // print date
      int year;
      byte month, day, hour, minute, second, hundredths;
      gps.crack_datetime(&year, &month, &day, &hour, &minute, &second, &hundredths, &age);
      if (age == TinyGPS::GPS_INVALID_AGE)
        Serial.print(F("********** ******** "));
      else
      {
        char sz[32];
        sprintf(sz, "%02d/%02d/%02d %02d:%02d:%02d ",
                month, day, year, hour, minute, second);
        //Serial.print(sz);
        dattim = String(sz);
        //Serial.print(dattim);
      }

      // GPS reading done
      newData = false;

      //Accel/Gyro
      getAccel_Data();
      getGyro_Data();

      //Save collected data to sd card
      dataFile = SD.open("test.csv", FILE_WRITE);

      if (dataFile) {
        // Serial.print("Writing to test.txt...");
        dataFile.print(rowCounter);
        dataFile.print(seperator);
        dataFile.print(flat, 6);
        dataFile.print(seperator);
        dataFile.print(flon, 6);
        dataFile.print(seperator);
        dataFile.print(gps.f_speed_kmph(), 2);
        dataFile.print(seperator);
        dataFile.print(dattim);
        dataFile.print(seperator);
        dataFile.print(analogRead(soundSensor));
        dataFile.print(seperator);
        dataFile.print(tsl.getLuminosity(TSL2591_VISIBLE));
        dataFile.print(seperator);
        dataFile.print((/*abs(Axyz[0]) + abs(Axyz[1]) + */abs(Axyz[1])), 2);
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

void getGyro_Data(void)
{
  accelgyro.getMotion9(&ax, &ay, &az, &gx, &gy, &gz, &mx, &my, &mz);
  Gxyz[0] = (double) gx * 250 / 32768;
  Gxyz[1] = (double) gy * 250 / 32768;
  Gxyz[2] = (double) gz * 250 / 32768;
}


