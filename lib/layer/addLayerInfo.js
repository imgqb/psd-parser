/**
 * Created by Gqb on 14/11/18.
 */
var ref = [
        require('../layerInfo/layerId'),
        require('../layerInfo/layerName'),
        require('../layerInfo/typeTool'),
        require('../layerInfo/sectionDivider'),
        require('../layerInfo/effects')
    ],

    LAYER_INFO = {};

ref.forEach(function(o){
    LAYER_INFO[o.id] = o;
});

module.exports = function(file, endPos){
    var o = {};
    while (file.now() < endPos){
        var sig = file.readString(4),
            key = file.readString(4),
            len = file.pad2(file.readInt()),
            end = file.now() + len;

        if(LAYER_INFO[key]){
            o[key] = LAYER_INFO[key].parse(file);
        }
        file.seek(end - file.now());
    }

    return o;
};