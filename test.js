var cbor = require("./cbor.js");
var testcases = function(undefined) {
  return [
    [
      "PositiveIntegerFix 0",
      "00",
      0
    ], [
      "PositiveIntegerFix 1",
      "01",
      1
    ], [
      "PositiveIntegerFix 10",
      "0a",
      10
    ], [
      "PositiveIntegerFix 23",
      "17",
      23
    ], [
      "PositiveIntegerFix 24",
      "1818",
      24
    ], [
      "PositiveInteger8 25",
      "1819",
      25
    ], [
      "PositiveInteger8 100",
      "1864",
      100
    ], [
      "PositiveInteger16 1000",
      "1903e8",
      1000
    ], [
      "PositiveInteger32 1000000",
      "1a000f4240",
      1000000
    ], [
      "PositiveInteger64 1000000000000",
      "1b000000e8d4a51000",
      1000000000000
    ], [
      "PositiveInteger64 9007199254740991",
      "1b001fffffffffffff",
      9007199254740991
    ], [
      "PositiveInteger64 9007199254740992",
      "1b0020000000000000",
      9007199254740992
    ], [
      "PositiveInteger64 18446744073709551615",
      "1bffffffffffffffff",
      18446744073709551615,
      true
    ], [
      "NegativeIntegerFix -1",
      "20",
      -1
    ], [
      "NegativeIntegerFix -10",
      "29",
      -10
    ], [
      "NegativeIntegerFix -24",
      "37",
      -24
    ], [
      "NegativeInteger8 -25",
      "3818",
      -25
    ], [
      "NegativeInteger8 -26",
      "3819",
      -26
    ], [
      "NegativeInteger8 -100",
      "3863",
      -100
    ], [
      "NegativeInteger16 -1000",
      "3903e7",
      -1000
    ], [
      "NegativeInteger32 -1000000",
      "3a000f423f",
      -1000000
    ], [
      "NegativeInteger64 -1000000000000",
      "3b000000e8d4a50fff",
      -1000000000000
    ], [
      "NegativeInteger64 -9007199254740992",
      "3b001fffffffffffff",
      -9007199254740992
    ], [
      "NegativeInteger64 -18446744073709551616",
      "3bffffffffffffffff",
      -18446744073709551616,
      true
    ], [
      "ByteString []",
      "40",
      new Buffer([])
    ], [
      "Bytestring [1,2,3,4]",
      "4401020304",
      new Buffer([1,2,3,4])
    ], [
      "String ''",
      "60",
      ""
    ], [
      "String 'a'",
      "6161",
      "a"
    ], [
      "String 'IETF'",
      "6449455446",
      "IETF"
    ], [
      "String '\"\\'",
      "62225c",
      "\"\\"
    ], [
      "String '\u00fc' (U+00FC)",
      "62c3bc",
      "\u00fc"
    ], [
      "String '\u6c34' (U+6C34)",
      "63e6b0b4",
      "\u6c34"
    ], [
      "String '\ud800\udd51' (U+10151)",
      "64f0908591",
      "\ud800\udd51"
    ], [
      "Array []",
      "80",
      []
    ], [
      "Array [1,2,3]",
      "83010203",
      [1, 2, 3]
    ], [
      "Array [1, [2, 3], [4, 5]]",
      "8301820203820405",
      [1, [2, 3], [4, 5]]
    ], [
      "Array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]",
      "98190102030405060708090a0b0c0d0e0f101112131415161718181819",
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
    ], [
      "Object {}",
      "a0",
      {}
    ], [
      "Object {1: 2, 3: 4}",
      "a201020304",
      {1: 2, 3: 4},
      true
    ], [
      "Array ['a', {'b': 'c'}]",
      "826161a161626163",
      ["a", {"b": "c"}]
    ], [
      "Object {'a': 1, 'b': [2, 3]}",
      "a26161016162820203",
      {"a": 1, "b": [2, 3]},
      true
    ], [
      "Object {'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}",
      "a56161614161626142616361436164614461656145",
      {"a": "A", "b": "B", "c": "C", "d": "D", "e": "E"},
      true
    ], [
      "Tag Self-describe CBOR 0",
      "d9d9f700",
      0,
      true
    ], [
      "false",
      "f4",
      false
    ], [
      "true",
      "f5",
      true
    ], [
      "null",
      "f6",
      null
    ], [
      "undefined",
      "f7",
      undefined
    ], [
      "UnassignedSimpleValue 255",
      "f8ff",
      undefined,
      true
    ], [
      "Float16 0.0",
      "f90000",
      0.0,
      true
    ], [
      "Float16 -0.0",
      "f98000",
      -0.0,
      true
    ], [
      "Float16 1.0",
      "f93c00",
      1.0,
      true
    ], [
      "Float16 1.5",
      "f93e00",
      1.5,
      true
    ], [
      "Float16 65504.0",
      "f97bff",
      65504.0,
      true
    ], [
      "Float16 5.960464477539063e-8",
      "f90001",
      5.960464477539063e-8,
      true
    ], [
      "Float16 0.00006103515625",
      "f90400",
      0.00006103515625,
      true
    ], [
      "Float16 -4.0",
      "f9c400",
      -4.0,
      true
    ], [
      "Float16 +Infinity",
      "f97c00",
      Infinity,
      true
    ], [
      "Float16 NaN",
      "f97e00",
      NaN,
      true
    ], [
      "Float16 -Infinity",
      "f9fc00",
      -Infinity,
      true
    ], [
      "Float32 100000.0",
      "fa47c35000",
      100000.0,
      true
    ], [
      "Float32 3.4028234663852886e+38",
      "fa7f7fffff",
      3.4028234663852886e+38,
      true
    ], [
      "Float32 +Infinity",
      "fa7f800000",
      Infinity,
      true
    ], [
      "Float32 NaN",
      "fa7fc00000",
      NaN,
      true
    ], [
      "Float32 -Infinity",
      "faff800000",
      -Infinity,
      true
    ], [
      "Float64 1.1",
      "fb3ff199999999999a",
      1.1
    ], [
      "Float64 9007199254740994",
      "fb4340000000000001",
      9007199254740994
    ], [
      "Float64 1.0e+300",
      "fb7e37e43c8800759c",
      1.0e+300
    ], [
      "Float64 -4.1",
      "fbc010666666666666",
      -4.1
    ], [
      "Float64 -9007199254740994",
      "fbc340000000000001",
      -9007199254740994
    ], [
      "Float64 +Infinity",
      "fb7ff0000000000000",
      Infinity
    ], [
      "Float64 NaN",
      "fb7ff8000000000000",
      NaN,
      true
    ], [
      "Float64 -Infinity",
      "fbfff0000000000000",
      -Infinity
    ] ];
}();

function myDeepEqual(test, actual, expected, text) {
  if (expected !== expected)
    return test.ok(actual !== actual, text);
  
  return test.deepEqual(actual, expected, text);
}

function hex2buffer(data) {
  var length = data.length / 2;
  var ret = new Buffer(length);
  for (var i = 0; i < length; ++i) {
    ret[i] = parseInt(data.substr(i * 2, 2), 16);
  }
  return ret;
}

testcases.forEach(function(testcase) {
  var name = testcase[0];
  var data = testcase[1];
  var expected = testcase[2];
  var binaryDifference = testcase[3];
  
  exports[name] = function(test) {
    myDeepEqual(test, cbor.decode(hex2buffer(data)), expected, "Decoding");
    var encoded = cbor.encode(expected);
    myDeepEqual(test, cbor.decode(encoded), expected, "Encoding (deepEqual)");
    if (!binaryDifference) {
      var hex = "";
      for (var i = 0; i < encoded.length; ++i)
        hex += (encoded[i] < 0x10 ? "0" : "") + encoded[i].toString(16);
      test.equal(hex, data, "Encoding (byteMatch)");
    }
    test.done();
  };
});

exports["Big Array"] = function(test) {
  var value = new Buffer(0x10001);
  for (var i = 0; i < value.length; ++i)
    value[i] = i;
  test.deepEqual(cbor.decode(cbor.encode(value)), value, "deepEqual");
  test.done();
};

exports["Remaining Bytes"] = function(test) {
  test.throws(function() {
    cbor.decode(hex2buffer("0000"));
  }, /Remaining bytes/);
  test.done();
};

exports["Tagging"] = function(test) {
  function TaggedValue(value, tag) {
    this.value = value;
    this.tag = tag;
  }
  function SimpleValue(value) {
    this.value = value;
  }

  var arrayBuffer = hex2buffer("83d81203d9456708f8f0");
  var decoded = cbor.decode(arrayBuffer, function(value, tag) {
    return new TaggedValue(value, tag);
  }, function(value) {
    return new SimpleValue(value);
  });
  
  test.ok(decoded[0] instanceof TaggedValue, "first item is a TaggedValue");
  test.equal(decoded[0].value, 3, "first item value");
  test.equal(decoded[0].tag, 0x12, "first item tag");
  test.ok(decoded[1] instanceof TaggedValue, "second item is a TaggedValue");
  test.equal(decoded[1].value, 8, "second item value");
  test.equal(decoded[1].tag, 0x4567, "second item tag");
  test.ok(decoded[2] instanceof SimpleValue, "third item is a SimpleValue");
  test.equal(decoded[2].value, 0xf0, "third item tag");
  test.done();
};
