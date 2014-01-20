cbor-node
=========

The Concise Binary Object Representation (CBOR) data format ([RFC 7049](http://tools.ietf.org/html/rfc7049)) implemented for Node.js.

[![Build Status](https://api.travis-ci.org/paroga/cbor-node.png)](https://travis-ci.org/paroga/cbor-node)
[![Coverage Status](https://coveralls.io/repos/paroga/cbor-node/badge.png?branch=master)](https://coveralls.io/r/paroga/cbor-node?branch=master)
[![Dependency status](https://david-dm.org/paroga/cbor-node/status.png)](https://david-dm.org/paroga/cbor-node#info=dependencies&view=table)
[![Dev Dependency Status](https://david-dm.org/paroga/cbor-node/dev-status.png)](https://david-dm.org/paroga/cbor-node#info=devDependencies&view=table)

API
---

The module `cbor` provides the following two functions:

cbor.**decode**(*data*)
> Take the Buffer object *data* and return it decoded as a JavaScript object.

cbor.**encode**(*data*)
> Take the JavaScript object *data* and return it encoded as a Buffer object.

Usage
-----

```javascript
var cbor = require("cbor");
var assert = require("assert");

var initial = { Hello: "World" };
var encoded = cbor.encode(initial);
var decoded = cbor.decode(encoded);

assert.deepEqual(initial, decoded);
```
