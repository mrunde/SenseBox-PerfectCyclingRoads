# REST-API

### SenseBoxes

| HTTP-REQUEST | URL |
|--------------|-----|
| **GET (ALL)** | `/boxes` |
| **POST** | `/boxes` |
| **GET** | `/boxes/:boxId` |
| **PUT** | `/boxes/:boxId` |
| **DELETE** | `/boxes/:boxId` |

* **POST**-Example:

```javascript
{
	"name":"My awesome SenseBox",
	"boxType":"mobile"
}
```

* **GET**-Example:

```javascript
{
	"_id":"56bb759b5f660631d8b31c03",
	"name":"My awesome SenseBox",
	"boxType":"mobile",
	"__v":0,
	"updated":"2016-02-10T17:38:35.183Z",
	"created":"2016-02-10T17:38:35.183Z"
}
```


### Tracks

| HTTP-REQUEST | URL |
|--------------|-----|
| **GET (ALL)** | `/boxes/:boxId/tracks` |
| **POST** | `/boxes/:boxId/tracks` | 
| **GET** | `/boxes/:boxId/tracks/:trackId` |
| **PUT** | `/boxes/:boxId/tracks/:trackId` |
| **DELETE (ALL)** | `/boxes/:boxId/tracks` |
| **DELETE** | `/boxes/:boxId/tracks/:trackId` |

* **POST**-Example:

```javascript
{
	"box_id":"56bb759b5f660631d8b31c03"
}
```

* **GET**-Example:

```javascript
{
	"_id":"56bb75c15f660631d8b31c04",
	"box_id":"56bb759b5f660631d8b31c03",
	"__v":0,
	"updated":"2016-02-10T17:39:13.965Z",
	"created":"2016-02-10T17:39:13.965Z"
}
```


### Measurements

| HTTP-REQUEST | URL |
|--------------|-----|
| **GET (ALL)** | `/boxes/:boxId/tracks/:trackId/measurements` |
| **POST** | `/boxes/:boxId/tracks/:trackId/measurements` |
| **GET** | `/boxes/:boxId/tracks/:trackId/measurements/:measurementId` |
| **PUT** | `/boxes/:boxId/tracks/:trackId/measurements/:measurementId` |
| **DELETE (ALL)** | `/boxes/:boxId/tracks/:trackId/measurements` |
| **DELETE** | `/boxes/:boxId/tracks/:trackId/measurements/:measurementId` |

* **POST**-Example:

```javascript
{	
	"track_id":"56bb75c15f660631d8b31c04",
	"lat":51.969055,
	"lng":7.595975,
	"speed":15.58,
	"timestamp":"02/09/2016 08:52:55",
	"sound":768,
	"luminosity":0,
	"brightness":4294967199,
	"ir":37888,
	"vibration":1.0037,
	"altitude":457.27
}
```

* **GET-ALL**-Example:

```javascript
[
	{	"_id":"56bb75c65f660631d8b32016",
		"track_id":"56bb75c15f660631d8b31c04",
		"lat":51.969055,
		"lng":7.595975,
		"speed":15.58,
		"timestamp":"02/09/2016 08:52:55",
		"sound":768,
		"luminosity":0,
		"brightness":4294967199,
		"ir":37888,
		"vibration":1.0037,
		"altitude":457.27,
		"__v":0,
		"updated":"2016-02-10T17:39:18.741Z",
		"created":"2016-02-10T17:39:18.741Z"
	}, {
		"_id":"56bb75c65f660631d8b32017",
		"track_id":"56bb75c15f660631d8b31c04",
		"lat":51.969047,
		"lng":7.59594,
		"speed":15.58,
		"timestamp":"02/09/2016 08:52:56",
		"sound":189,
		"luminosity":0,
		"brightness":4294967199,
		"ir":37888,
		"vibration":1.0139,
		"altitude":458.31,
		"__v":0,
		"updated":"2016-02-10T17:39:18.745Z",
		"created":"2016-02-10T17:39:18.745Z"
	}, {
		"_id":"56bb75c65f660631d8b32018",
		"track_id":"56bb75c15f660631d8b31c04",
		"lat":51.969039,
		"lng":7.59592,
		"speed":0.43,
		"timestamp":"02/09/2016 08:52:57",
		"sound":28,
		"luminosity":0,
		"brightness":4294967199,
		"ir":37888,
		"vibration":1.1226,
		"altitude":457.79,
		"__v":0,
		"updated":"2016-02-10T17:39:18.750Z",
		"created":"2016-02-10T17:39:18.750Z"
	}
]
```