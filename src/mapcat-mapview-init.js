/*eslint no-undef: "error"*/
/*eslint-env node*/
var https = require('https');

function initRasterView (callback, apiKey, layerOptions, rasterOptions) {
    var type = 'raster';
    initView(callback, type, apiKey, layerOptions, null, rasterOptions);
}

function initVectorView (callback, apiKey, layerOptions, vectorOptions) {
    var type = 'vector';
    initView(callback, type, apiKey, layerOptions, vectorOptions, null);
}

function initView (callback, type, apiKey, layerOptions, vectorOptions, rasterOptions) {
    var data = {};
    data.protocol = 'http';
    if (document && document.location && document.location.protocol && document.location.protocol === 'https:') {
        data.protocol = 'https';
    }
    try {
        if (apiKey === undefined || apiKey === null || typeof(apiKey) !== 'string' || apiKey.length === 0) {
            throw new Error('Invalid MAPCAT Visualization API key! Expected: string value');
        }

        // parse layer options
        var layers = {
            base: '',
            ocean: '',
            relief: '',
            landcover: ''
        };
        if (layerOptions && layerOptions.cycle) {
            if (layerOptions.cycle.road && typeof(layerOptions.cycle.road) !== 'boolean') {
                throw new Error('Layer option cycle.road set, but invalid type. Expected: true or false');
            }
            if (layerOptions.cycle.route && typeof(layerOptions.cycle.route) !== 'boolean') {
                throw new Error('Layer option cycle.route set, but invalid type. Expected: true or false');
            }
            if (layerOptions.cycle.road === true && layerOptions.cycle.route === true) {
                layers.cycle = '';
            } else if (layerOptions.cycle.road === true) {
                layers.cycle = '--,road';
            } else if (layerOptions.cycle.route === true) {
                layers.cycle = '--,route';
            }
        }
        data.layers = layers;

        if (type === 'vector') {
            // parse vector options
            if (vectorOptions && vectorOptions.styleSheet) {
                if (vectorOptions.styleSheet === 'tangram') {
                    data.type = 3;
                } else if (vectorOptions.styleSheet === 'openlayers') {
                    data.type = 2;
                } else if (vectorOptions.styleSheet === 'navcenter') {
                    data.type = 4;
                    data.layers.navcenter = '';
                } else {
                    data.type = vectorOptions.styleSheet; // custom named style sheet
                }
            }
        } else if (type === 'raster') {
            // parse raster options
            if (rasterOptions && rasterOptions.lang !== undefined && rasterOptions.lang !== null) {
                if (typeof(rasterOptions.lang) !== 'string') {
                    throw new Error('Invalid language parameter type! Expected: string value or null');
                }
                data.lang = rasterOptions.lang;
            } else if (rasterOptions && rasterOptions.lang === null) {
                data.lang = '';
            } else {
                data.lang = 'en';
            }
            if (rasterOptions && rasterOptions.scale !== undefined && rasterOptions.scale !== null) {
                var s = Number(rasterOptions.scale);
                if (s === 1 || s === 2) {
                    data.scale = s;
                } else {
                    throw new Error('Invalid scale! Expected scale value: 1 or 2');
                }
            } else {
                data.scale = 1;
            }
        }
    } catch (error) {
        return callback(error.message);
    }

    var postData = JSON.stringify(data);
    var options = {
        host: 'api.mapcat.com',
        port: 443,
        path: '/api/mapinit/' + type,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'X-Api-Key': apiKey
        }
    };

    var cb = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var url = '';
            var resJson = {};
            try {
                resJson = JSON.parse(str);
                if (resJson.error) {
                    return callback(resJson.error);
                } else if (type === 'raster' && resJson.url && typeof(resJson.url) === 'string') {
                    url = resJson.url;
                } else if (type === 'vector') {
                    return callback(null, resJson);
                } else {
                    return callback('Unexpected error! ' + str);
                }
            } catch (error) {
                return callback('Unable to parse response! Error: ' + str);
            }
            callback(null, url);
        });
    };
    var req = https.request(options, cb);
    req.write(postData);
    req.end();
    req.on('error', function (err) {
        return callback(err.message);
    });
}

module.exports.initRasterView = initRasterView;
module.exports.initVectorView = initVectorView;
