# mapcat-mapview-init

## Build dependencies
* node (min _v6.9.5_)
* npm (min _4.3.0_)

## Install Node.js dependencies
`npm install`

## Build
Release: `npm run build-min`  
Debug: `npm run build-dev`

## Usage
`<script src="mapcatview-min.js"></script>`

### Use in script file:  

To initialize Mapcat mapview use one of the following functions  
* for raster tiles:  
   
`mapcatview.initRasterView(accessToken, layerOptions, rasterOptions, callback);`  

* for vector tiles:  

`mapcatview.initVectorView(accessToken, layerOptions, callback);`  
  
#### Example
```javascript
mapcatview.initVectorView(accessToken, null, function(error, response) {
    //your code
});
```

### Functions parameters
**accessToken** [`required, string`] - Your Mapcat access token  
**layerOptions** [`optional, object`] - Set for show cycle roads, routes  
Default: cycle road and route layers are off.  
#### Example  
```json
{
    cycle: {
        road: true,
        route: false
    }
}
```
**rasterOptions** [`optional, object`] - Options to set label language or raster tile scale  
Parameter *lang* is the ISO 639-1 language code representation of the desired language, it defaults to "en". To disable label rendering set lang to `null` or `""`.  
Parameter *scale* must be `1` or `2`. By default, it is `1`, meaning that the required raster tile size is 256 × 256 pixel. If you want to get tiles for retina displays (512 × 512 pixel tiles), you can use value `2`.  
#### Example
```json 
{
	lang: "hu",
    scale: 1
}
```
**callback** [`required, function`] - Callback function  
First parameter is the error message (`null` means no error), second parameter is the response data  
Response data: Mapcat mapview url [`string`]

## Licence
[MIT Licence](https://github.com/MAPCATcom/mapcat-mapview-init/blob/master/LICENSE)