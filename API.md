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

***

## Workflow

1. Create new SenseBox -> new SenseBoxId
2. Add new Data with Client (select new Track or by TrackId)
3. API creats new TrackId and adds new Measurements for TrackId
