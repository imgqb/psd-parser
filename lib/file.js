/**
 * Created by Gqb on 14/11/9.
 */

var jspack = require('jspack').jspack,
    iconv = require('iconv-lite'),
    BlendMode = require('./constants/BlendMode');


var Constructor = function(buffer){
    var PSD = {};
    PSD.file = {};
    PSD.file.buffer = buffer;
    var _pos = 0;

    PSD.file.read = function(length){
        var self = this;
        var temp = [];
        for (var i = 0; i < length; i++){
            temp.push(self.buffer[_pos++])
        }
        return temp;
    };

    PSD.file.readByte = function(){
        return this.read(1)[0];
    };

    PSD.file.readShort = function(){
        return jspack.Unpack('h', this.read(2))[0]
    };

    PSD.file.readInt = function(){
        return jspack.Unpack('i', this.read(4))[0]
    };

    PSD.file.readDouble = function(){
        return jspack.Unpack('d', this.read(8))[0]
    };

    PSD.file.readString = function(length){
        return jspack.Unpack(length+'s', this.read(length))[0].replace(/\u0000/g, '')
    };

    PSD.file.readUnicodeString = function(){
        var bf = this.read(this.readInt()*2);
        return iconv.decode(new Buffer(bf), 'utf-16be').replace(/\u0000/g, '')
    };

    PSD.file.readBoolean = function(){
        return this.readByte() == 1;
    };

    PSD.file.readSpaceColor = function(){
        this.readShort() // spaceColor
        return [
            this.readShort() >> 8 & 255,
            this.readShort() >> 8 & 255,
            this.readShort() >> 8 & 255,
            this.readShort() >> 8 & 255
        ];
    };

    PSD.file.readBlendMode = function(){
        this.seek(4)
        return BlendMode[this.readString(4)]
    };

    PSD.file.pad2 = function(i){
        //向上取整到2的倍数
        return (i + 1) & ~0x01;
    };
    PSD.file.pad4 = function(i){
        //4的倍数
        return ((i + 4) & ~0x03);
    };
    PSD.file.seek = function(offset, whence){
        if(!isNaN(whence))
            _pos = whence;
        _pos += offset;
        return _pos
    };
    PSD.file.tell = function(whence){
        _pos = whence;
        return _pos
    };
    PSD.file.now = function(){
        return _pos;
    };
    return PSD;
};

module.exports = Constructor;