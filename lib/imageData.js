/**
 * Created by Gqb on 14/12/5.
 */

var PNG = require('pngjs').PNG,
    fs  = require('fs');

var imageFun = require('./imageHelper');

module.exports = function(PSD){
    var _ = PSD;

    var imageData = _.imageData = {},
        file = _.file;

    var parsed = false, pos = file.now();

    imageData.width = _.header.width;
    imageData.height = _.header.height;


    imageData.toImageData = function(){
        if(parsed) return;

        file.tell(pos);
        var self = this;
        var compression = file.readShort();

        self.channelInfo = imageFun.PSDFormat[compression](_);
        self.pixelData = imageFun.mergeImageData(this, _.header.colorMode);
        parsed = true;
    };

    imageData.saveAsPng = function(output){
        var self = this;
        self.toImageData();
        var png = new PNG({
            width: self.width,
            height: self.height,
            filterType: 4
        });
        if(!self.pixelData) {
            return Promise.reject('pixelData not exist');
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