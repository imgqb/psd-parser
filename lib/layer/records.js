/**
 * Created by Gqb on 14/11/16.
 */

var parseMask = require('./mask'),
    parseBlendingRange = require('./blendingRange'),
    parseAdditional = require('./addLayerInfo'),
    BlendMode = require('../constants/BlendMode');


module.exports = function(file){
    var top = file.readInt(),
        left = file.readInt(),
        bottom = file.readInt(),
        right = file.readInt();

    var channelCount = file.readShort();

    var channelInfo = [];
    for(var i=0; i<channelCount; i++){
        var o = {};
        o.id = file.readShort();
        o.length = file.readInt(); //data Length
        channelInfo.push(o);
    }

    var blendModeSig = file.readString(4),
        blendModeKey = file.readString(4),
        opacity = file.readByte(),
        clipping= file.readByte(),
        flag = file.readByte(),
        visible = !((flag & (0x01 << 1)) > 0),
        filler = file.readByte(),

        extraLen = file.readInt(),
        endPos = file.now()+extraLen;

    var layerMaskData = parseMask(file);
    var blendingRangesData = parseBlendingRange(file);

    var nameLength = file.pad4(file.readByte())-1,
        name = file.readString(nameLength);

    var additional = parseAdditional(file, endPos);

    file.seek(endPos - file.now());

    return {
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        width: right - left,
        height: bottom - top,
        channelCount: channelCount,
        channelInfo: channelInfo,
        blendMode: BlendMode[blendModeKey],
        opacity: opacity,
        visible: visible,
        legacyName: name,
        additional: additional
    }
};