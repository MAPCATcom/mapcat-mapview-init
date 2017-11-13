var https = require('https');

function initRasterView(layers, lang, schema, scale, userid, callback) {
    var type = 'raster';
    initView(type, layers, userid, callback, lang, schema, scale);
}

function initVectorView(layers, userid, callback) {
    var type = 'vector';
    initView(type, layers, userid, callback);
}

function initView(type, layers, userid, callback, lang, schema, scale) {
    var data = {};
    data.type = type;
    try {
        if (layers === undefined || layers === "" || Object.keys(layers).length === 0 && layers.constructor === Object) {
            throw new Error('Undefined or invalid layers!');
        }
        if (type === 'raster') {
            if(lang !== undefined) {
                if(lang.length !== 2) {
                    throw new Error('Invalid lang!');
                } else {
                    data.lang = lang;
                }
            }
            if(schema !== undefined) {
                data.schema = schema;
            }
            if(scale !== undefined) {
                var s = Number(scale);
                if(s < 1 || s > 2) {
                    throw new Error('Invalid scale!');
                } else {
                    data.scale = s;
                }
            }
        }
    } catch(error) {
        return callback(error.message);
    }
    
    var post_data = JSON.stringify(data);
    var options = {
        host: 'httpbin.org',
        port: 443,
        path: '/post',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'X-Api-Key': userid
        }
    };

    cb = function(response) {
        var str = ''
        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function() {
            callback(null, str);
        });
    }
    var req = https.request(options, cb);
    req.write(post_data);
    req.end();
    req.on('error', function(err) {
        console.log("error:", err);
    })
}

module.exports.initRasterView = initRasterView;
module.exports.initVectorView = initVectorView;