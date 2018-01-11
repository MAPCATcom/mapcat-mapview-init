# @mapcat/mapview-init

The *@mapcat/mapview-init* javascript library is used to obtain MAPCAT raster (and vector) tile urls, that you can use for your [Leaflet](http://leafletjs.com/) and [OpenLayers](https://openlayers.org/) projects. You can find the prebuilt version of the javascript library under `./dist` folder.

## Build dependencies
* node (min _v6.9.5_)
* npm (min _4.3.0_)
* yarn (min _1.3.2_)

## Build
* Clone or download zip file from [MAPCATcom/mapcat-mapview-init](https://github.com/MAPCATcom/mapcat-mapview-init.git) repository  
`git clone https://github.com/MAPCATcom/mapcat-mapview-init.git`
* Go to the cloned (or unzipped) project main folder  
`cd mapcat-mapview-init`
* Install Node.js dependencies  
`yarn` or `yarn install`
* To build release version  
`yarn build-min`
* To build debug version  
`yarn build-dev`

If the build was successful you can find under `./dist` folder the recently built release (`mapcatview-min.js`) or debug (`mapcatview-dev.js`) version of library.  

## Usage
Create your HTML skeleton and link mapcat-mapview-init library before your own custom script file.  
`<script src="mapcatview-min.js"></script>`

### In your script file:  

To initialize Mapcat mapview use one of the following functions  
* for raster tiles:  
   
`mapcatview.initRasterView(accessToken, layerOptions, rasterOptions, callback);`  

* for vector tiles:  

`mapcatview.initVectorView(accessToken, layerOptions, callback);`  
  
#### Example

```javascript
mapcatview.initRasterView('< YOUR MAPCAT ACCESS TOKEN >', null, null, function(error, response) {
    //your code
});

mapcatview.initVectorView('< YOUR MAPCAT ACCESS TOKEN >', null, function(error, response) {
    //your code
});
```

### Functions parameters
#### accessToken: *string* `(required)` - Your Mapcat access token  
#### layerOptions: *object* `(optional)` - Options to show cycle roads, routes layers  
Layers are used to toggle specific subsets of data rendered on the raster and vector tiles. Customizable: cycle roads and routes. Default: cycle road and route layers are off.
##### Example
```javascript
{
    cycle: {
        road: true,
        route: false
    }
}
```

#### rasterOptions: *object* `(optional)` - Options to set label language and raster tile scale  
Parameter *lang* is the ISO 639-1 language code representation of the desired language, it defaults to `"en"`. To disable label rendering set lang to `null` or `""`.  
Parameter *scale* must be `1` or `2`. By default, it is `1`, meaning that the required raster tile size is 256 × 256 pixel. If you want to get tiles for retina displays (512 × 512 pixel tiles), you can use value `2`.  
##### Example
```javascript
{
    lang: "hu",
    scale: 1
}
```
#### callback (error, response): *function* `(required)` - Callback function  
It gets called when the map initialization request returns from our server. The first parameter holds the error message (`null` means no error), the second parameter in case of initRasterView function call is the response data holding your templated map view url (*string*). In case of using initVectorView the response data holds the vector tile style sheet (*object*).

### Example with [Leaflet JS](http://leafletjs.com/)
In your HTML page `<head>` include Leaflet CSS file
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
```
Put a div element in `<body>` section to your map
```html
<div id="map" style="width: 400px; height: 300px;"></div>
```
Include Leaflet JavaScript, mapcat-mapview-init.js and your own script file in this order
```html
<script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
<script src="mapcatview-min.js"></script>
<script src="script.js"></script>
```
In your script file initialize your map
```javascript
var layerOptions = {
    cycle: {
        road: true,
        route: true
    }
};

var rasterOptions = {
    lang: 'en',
    scale: 1
};

mapcatview.initRasterView('< YOUR MAPCAT ACCESS TOKEN >', layerOptions, rasterOptions, function(error, response) {
    if (error) {
        console.log(error);
        return;
        // Error handling...
    }

    var tileUrl = response;

    var map = L.map('map', {
        zoomControl: false,
        center: L.latLng(47.4979, 19.0402),
        zoom: 13,
        minZoom: 0,
        maxZoom: 19
    });

    L.tileLayer(tileUrl, {
        attribution: 'Imagery &copy; 2017 <a href="https://mapcat.com">MAPCAT</a>, Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a contributors',
        maxZoom: 18
    }).addTo(map);

    // Your code...
});
```

### Example with [Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js)
In your HTML page `<head>` include Mapbox GL CSS file
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/0.43.0/mapbox-gl.css" />
```
Put a div element in `<body>` section to your map
```html
<div id="map" style="width: 400px; height: 300px;"></div>
```
Include Mapbox GL JS JavaScript, mapcat-mapview-init.js and your own script file in this order
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mapbox-gl/0.43.0/mapbox-gl.js"></script>
<script src="mapcatview-min.js"></script>
<script src="script.js"></script>
```
In your script file initialize your map
```javascript
var layerOptions = {
    cycle: {
        road: true,
        route: true
    }
};

mapcatview.initVectorView('< YOUR MAPCAT ACCESS TOKEN >', layerOptions, function(error, response) {
    if (error) {
        console.log(error);
        return;
        // Error handling...
    }

    var styleSheet = response;

    var map = new mapboxgl.Map({
        container: 'map',
        style: styleSheet,
        center: [0, 51.5],
        zoom: 13
    });

    // Your code...
});
```

Substitute `< YOUR MAPCAT ACCESS TOKEN >` with your access token.  

Read [MAPCAT for Developers](https://docs.mapcat.com) for more information and examples.

## Licence
[MIT Licence](https://github.com/MAPCATcom/mapcat-mapview-init/blob/master/LICENSE)
