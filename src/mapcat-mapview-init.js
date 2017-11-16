/*eslint no-undef: "error"*/
/*eslint-env node*/
var https = require('https');

function initRasterView (accessToken, layerOptions, rasterOptions, callback) {
    var type = 'raster';
    initView(type, accessToken, callback, layerOptions, rasterOptions);
}

function initVectorView (accessToken, layerOptions, callback) {
    var type = 'vector';
    initView(type, accessToken, callback, layerOptions);
}

function initView (type, accessToken, callback, vectorOptions, rasterOptions) {
    var data = {};
    data.type = type;
    try {
        if (accessToken === undefined || accessToken === null || typeof(accessToken) !== 'string' || accessToken.length === 0){
            throw new Error('Invalid acces token! Expected: string value');
        }
        var layers = {
            base: '',
            ocean: '',
            relief: '',
            landcover: ''
        };
        if (vectorOptions && vectorOptions.cycle) {
            if (vectorOptions.cycle.road && typeof(vectorOptions.cycle.road) !== 'boolean') {
                throw new Error('Layer option cycle.road set, but invalid type. Expected: true or false');
            }
            if (vectorOptions.cycle.route && typeof(vectorOptions.cycle.route) !== 'boolean') {
                throw new Error('Layer option cycle.route set, but invalid type. Expected: true or false');
            }
            if (vectorOptions.cycle.road === true && vectorOptions.cycle.route === true) {
                layers.cycle = '';
            } else if (vectorOptions.cycle.road === true) {
                layers.cycle = '--,road';
            } else if (vectorOptions.cycle.route === true) {
                layers.cycle = '--,route';
            }
        }
        data.layers = layers;
        if (type === 'raster') {
            if (rasterOptions && rasterOptions.lang !== undefined && rasterOptions.lang !== null) {
                if (typeof(rasterOptions.lang) !== 'string') {
                    throw new Error('Invalid language parameter type! Expected: string value or null');
                }
                data.labels = rasterOptions.lang;
            } else if (rasterOptions && rasterOptions.lang === null) {
                data.labels = '';
            } else {
                data.labels = 'en';
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
        host: 'httpbin.org',
        port: 443,
        path: '/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'X-Api-Key': accessToken
        }
    };

    var cb = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            callback(null, str);
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
