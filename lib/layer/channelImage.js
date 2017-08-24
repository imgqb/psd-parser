/**
 * Created by Gqb on 14/11/24.
 */

var PNG = require('pngjs').PNG,
fs  = require('fs');

var imageFun = require('../imageHelper');


function parseCompression(file){
return file.readShort()
}

function parseImageData(layer, file){
var compression = parseCompression(file);
return imageFun.layerFormat[compression](layer, file);
}


module.exports = function(layer, file, colorMode) {
var parsed = false;
var pos = file.now();

for (var i = 0, l = layer.channelInfo.length; i < l; i++) {
    //skip first
    var channel = layer.channelInfo[i];
    file.seek(channel.length, file.now());
}

layer.parseImageData = function(){
    var self = this;

    if (parsed) return self.pixelData;

    file.tell(pos);
    for (var i = 0, l = self.channelInfo.length; i < l; i++) {
        var channel = self.channelInfo[i];
        if (channel.length <= 0){
            parseCompression(file);// 压缩位
            channel.data = [];
            continue;
        }

        var startPos = file.now();
        channel.data = parseImageData(self, file);
        file.seek(channel.length, startPos);
    }
    self.pixelData = imageFun.mergeImageData(self, colorMode);
    parsed = true;
    return self.pixelData
};

layer.saveAsPng = function(output){
    var self = this;
    self.parseImageData();
    var png = new PNG({
        width: self.width,
        height: self.height,
        filterType: 4
    });
    if(!self.pixelData) {
        return Promise.reject('Not support the colorMode');
    }
    return new Promise((resolve, reject) => {
        png.data = self.pixelData;
        var stream = fs.createWriteStream(output);
        png.pack().pipe(stream);

        stream.on('error', reject)
        stream.on('finish', () => {
            resolve(output)
        })
    })
};
};