# SenseBox - Perfect Cycling Roads


### Members

##### ![alt GitHub](http://i.imgur.com/0o48UoR.png") [Lukas Lohoff](https://github.com/LukasLohoff)  
##### ![alt GitHub](http://i.imgur.com/0o48UoR.png") [Marius Runde](https://github.com/mrunde)  
##### ![alt GitHub](http://i.imgur.com/0o48UoR.png") [Nicholas Schiestel](https://github.com/nicho90)


## Steps to build and run the application

1. Install **NodeJS**: [https://nodejs.org/en/](https://nodejs.org/en/)
2. Open a terminal and move with command `cd` to the directory of the project
3. Install the Node-Packages with command `sudo npm install`
4. Create a new folder in `/public/lib` (by command-line `mkdir /public/lib`)
5. Install **Bower** `sudo npm install -g bower`
6. Move with command `cd /public` to the directory `public`
7. Install Bower-Packages with command `bower install`
8. Move with command `cd ../` back to the directory of the project
9. Run NodeJS-Server with the command `node server.js`
10. Open a web-browser and go to `localhost:8080`


## Example Data

### Sensebox

**POST** `http://localhost:8080/api/boxes`

```javascript
{
    "name": "Perfect Cycling Roads",
    "boxType": "mobile"
}
```

Please remember the generated `BoxId`!


### Track

**POST** `http://localhost:8080/api/boxes/:boxId/tracks`

```javascript
{
    "box_id": "56a4e8380a303b3df692694c"
}
```

Please remember the generated `TrackId`!


### Measurements

**POST** `http://localhost:8080/api/boxes/:boxId/tracks/:trackId/measurements`

```javascript
{
    "track_id": "56a4e8660a303b3df692694d",
    "timestamp": "12/21/2015 13:37:04",
    "lat": 51.965240,
    "lng": 7.598272,
    "altitude": 353.40,
    "speed": 0,
    "sound": 41,
    "vibration": 1.46,
    "brightness": 1134,
    "uv": 0,
    "ir": 0
}
```

**GET** `http://localhost:8080/api/boxes/:boxId/tracks/:trackId/measurements`


##### Example-Measurements

Please see: `data.json`
