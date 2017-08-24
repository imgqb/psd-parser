/**
 * Created by Gqb on 14/11/16.
 */

var parseLayer = require('./layer/records'),
    parseChannelImage = require('./layer/channelImage');

function parseGlobalMask(file){
    var length = file.readInt(),
        pos = file.now();
    var colorComponents = file.readSpaceColor(),
        opacity = file.readShort(),
        kine = file.readByte();

    file.seek(length, pos);
    return {
        colorComponents: colorComponents,
        opacity: opacity,
        kine: kine
    }
}

module.exports = function(PSD){
    var _  = PSD;
    var layerMaskInfo = _.layerMaskInfo = {},
        file = _.file;
    var startPos = layerMaskInfo.startPos = file.now();

    var length = layerMaskInfo.length = file.readInt();
    //layers
    var layerInfo = layerMaskInfo.layerInfo = {};

    layerInfo.length = file.pad2(file.readInt());

    layerInfo.layerCount = file.readShort();
    _.mergedAlpha = false;

    if (layerInfo.layerCount < 0){
        layerInfo.layerCount = -layerInfo.layerCount;
        _.mergedAlpha = true; //
    }

    layerInfo.layers = [];
    for (var i= 0; i<layerInfo.layerCount; i++){
        layerInfo.layers.push(parseLayer(file));
    }

    layerInfo.layers.forEach(function(layer){
        parseChannelImage(layer, file, _.header.colorMode);
    });

    layerMaskInfo.gloablMask = parseGlobalMask(file);

    layerInfo.layers.reverse();

    file.seek(length, startPos+4)
};
