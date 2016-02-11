# API

### Senseboxes

| HTTP-REQUEST | URL |
|--------------|-----|
| **GET** | `/boxes` | 
| **POST** | `/boxes` | 
| **GET** | `/boxes/:boxId` |
| **PUT** | `/boxes/:boxId` |
| **DELETE** | `/boxes/:boxId` |


### Tracks

| HTTP-REQUEST | URL |
|--------------|-----|
| **POST** | `/boxes/:boxId/tracks` | 
| **GET** | `/boxes/:boxId/tracks/:trackId` |
| **DELETE (ALL)** | `/boxes/:boxId/tracks` |
| **DELETE** | `/boxes/:boxId/tracks/:trackId` |


### Measurements

| HTTP-REQUEST | URL |
|--------------|-----|
| **POST** | `/boxes/:boxId/tracks/:trackId/measurements` | 
| **GET** | `/boxes/:boxId/tracks/:trackId/measurements/:measurementId` |
| **DELETE (ALL)** | `/boxes/:boxId/tracks/:trackId/measurements` |
| **DELETE** | `/boxes/:boxId/tracks/:trackId/measurements/:measurementId` |
