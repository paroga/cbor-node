/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Patrick Gansterer <paroga@paroga.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(exports, undefined) { "use strict";
var POW_2_24 = Math.pow(2, -24),
    POW_2_32 = Math.pow(2, 32),
    POW_2_53 = Math.pow(2, 53);

exports.encode = function(value) {
  var buffer = new Buffer(256);
  var lastLength;
  var offset = 0;

  function ensureSpace(length) {
    var newByteLength = buffer.length;
    var requiredLength = offset + length;
    while (newByteLength < requiredLength)
      newByteLength *= 2;
    if (newByteLength !== buffer.length) {
      var oldBuffer = buffer;
      buffer = new Buffer(newByteLength);
      oldBuffer.copy(buffer);
    }

    lastLength = length;
    return buffer;
  }
  function write() {
    offset += lastLength;
  }
  function writeFloat64(value) {
    write(ensureSpace(8).writeDoubleBE(value, offset));
  }
  function writeUint8(value) {
    write(ensureSpace(1).writeUInt8(value, offset));
  }
  function writeBuffer(value) {
    var buffer = ensureSpace(value.length);
    value.copy(buffer, offset);
    write();
  }
  function writeUint16(value) {
    write(ensureSpace(2).writeUInt16BE(value, offset));
  }
  function writeUint32(value) {
    write(ensureSpace(4).writeUInt32BE(value, offset));
  }
  function writeUint64(value) {
    var low = value % POW_2_32;
    var high = (value - low) / POW_2_32;
    var buffer = ensureSpace(8);
    buffer.writeUInt32BE(high, offset);
    buffer.writeUInt32BE(low, offset + 4);
    write();
  }
  function writeTypeAndLength(type, length) {
    if (length < 24) {
      writeUint8(type << 5 | length);
    } else if (length < 0x100) {
      writeUint8(type << 5 | 24);
      writeUint8(length);
    } else if (length < 0x10000) {
      writeUint8(type << 5 | 25);
      writeUint16(length);
    } else if (length < 0x100000000) {
      writeUint8(type << 5 | 26);
      writeUint32(length);
    } else {
      writeUint8(type << 5 | 27);
      writeUint64(length);
    }
  }
  
  function encodeItem(value) {
    var i;

    if (value === false)
      return writeUint8(0xf4);
    if (value === true)
      return writeUint8(0xf5);
    if (value === null)
      return writeUint8(0xf6);
    if (value === undefined)
      return writeUint8(0xf7);
  
    switch (typeof value) {
      case "number":
        if (Math.floor(value) === value) {
          if (0 <= value && value <= POW_2_53)
            return writeTypeAndLength(0, value);
          if (-POW_2_53 <= value && value < 0)
            return writeTypeAndLength(1, -(value + 1));
        }
        writeUint8(0xfb);
        return writeFloat64(value);

      case "string":
        var utf8data = new Buffer(value, "utf8");
        writeTypeAndLength(3, utf8data.length);
        return writeBuffer(utf8data);

      default:
        var length;
        if (Array.isArray(value)) {
          length = value.length;
          writeTypeAndLength(4, length);
          for (i = 0; i < length; ++i)
            encodeItem(value[i]);
        } else if (Buffer.isBuffer(value)) {
          writeTypeAndLength(2, value.length);
          writeBuffer(value);
        } else {
          var keys = Object.keys(value);
          length = keys.length;
          writeTypeAndLength(5, length);
          for (i = 0; i < length; ++i) {
            var key = keys[i];
            encodeItem(key);
            encodeItem(value[key]);
          }
        }
    }
  }
  
  encodeItem(value);

  return buffer.slice(0, offset);
};

exports.decode = function(buffer, tagger, simpleValue) {
  var offset = 0;

  if (typeof tagger !== "function")
    tagger = function(value) { return value; };
  if (typeof simpleValue !== "function")
    simpleValue = function() { return undefined; };

  function read(value, length) {
    offset += length;
    return value;
  }
  function readBuffer(length) {
    return read(buffer.slice(offset, offset + length), length);
  }
  function readString(length) {
    return read(buffer.toString("utf8", offset, offset + length), length);
  }
  function readFloat16() {
    var tempArrayBuffer = new ArrayBuffer(4);
    var tempDataView = new DataView(tempArrayBuffer);
    var value = readUint16();

    var sign = value & 0x8000;
    var exponent = value & 0x7c00;
    var fraction = value & 0x03ff;
    
    if (exponent === 0x7c00)
      exponent = 0xff << 10;
    else if (exponent !== 0)
      exponent += (127 - 15) << 10;
    else if (fraction !== 0)
      return fraction * POW_2_24;

    tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13);
    return tempDataView.getFloat32(0);
  }
  function readFloat32() {
    return read(buffer.readFloatBE(offset), 4);
  }
  function readFloat64() {
    return read(buffer.readDoubleBE(offset), 8);
  }
  function readUint8() {
    return read(buffer.readUInt8(offset), 1);
  }
  function readUint16() {
    return read(buffer.readUInt16BE(offset), 2);
  }
  function readUint32() {
    return read(buffer.readUInt32BE(offset), 4);
  }
  function readUint64() {
    return readUint32() * POW_2_32 + readUint32();
  }

  function decodeItem() {
    var initialByte = readUint8();
    var majorType = initialByte >> 5;
    var additionalInformation = initialByte & 0x1f;
    var i;
    var length;

    if (majorType === 7) {
      switch (additionalInformation) {
        case 25:
          return readFloat16();
        case 26:
          return readFloat32();
        case 27:
          return readFloat64();
      }
    }

    switch (additionalInformation) {
      case 24:
        length = readUint8();
        break;
      case 25:
        length = readUint16();
        break;
      case 26:
        length = readUint32();
        break;
      case 27:
        length = readUint64();
        break;
      default:
        length = additionalInformation;
        break;
    }

    switch (majorType) {
      case 0:
        return length;
      case 1:
        return -1 - length;
      case 2:
        return readBuffer(length);
      case 3:
        return readString(length);
      case 4:
        var retArray = new Array(length);
        for (i = 0; i < length; ++i)
          retArray[i] = decodeItem();
        return retArray;
      case 5:
        var retObject = {};
        for (i = 0; i < length; ++i) {
          var key = decodeItem();
          retObject[key] = decodeItem();
        }
        return retObject;
      case 6:
        return tagger(decodeItem(), length);
      case 7:
        switch (length) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return undefined;
          default:
            return simpleValue(length);
        }
    }
  }

  var ret = decodeItem();
  if (offset !== buffer.length)
    throw "Remaining bytes";
  return ret;
};

})(exports);
