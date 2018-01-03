var map;

function init(){
    map = L.map('map', {
        zoomControl: false,
        center: L.latLng(47.4979, 19.0402),
        zoom: 13,
        minZoom: 0,
        maxZoom: 19
    });
}

function load(layerOptions, rasterOptions){
    mapcatview.initRasterView('jM9oGlsfWxOOYYF0kvuq2UbYl3XrVuUzJmwfnB6M', layerOptions, rasterOptions, function(error, response) {
        if (error) {
            console.log(error);
            return;
            // Error handling...
        }
        var tileUrl = response;
        L.tileLayer(tileUrl, {
            attribution: 'Imagery &copy; 2017 <a href="https://mapcat.com">MAPCAT</a>, Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a contributors',
            maxZoom: 18
        }).addTo(map);
    });
}

function reload(){
    var layerOptions = null;
    var rasterOptions = null;
    try {
        layerOptions = JSON.parse(document.getElementById('layerOp').value);
    } catch (e) {
        console.log('Error:', e);
        alert('Unable to parse layer options');
    }
    try {
        rasterOptions = JSON.parse(document.getElementById('rasterOp').value);
    } catch (e) {
        console.log('Error:', e);
        alert('Unable to parse raster options');
    }
    load(layerOptions, rasterOptions);
}

init();
reload();