var ffi = require('ffi'),
    ref = require('ref'),
    arrayType = require('ref-array');

const ourArray = arrayType(ref.types.uint8, 32);

var lib = ffi.Library('./../target/debug/libffi_async_demo', {
  // 'register': [ 'void', [ 'pointer', 'pointer' ] ],
  // array testing
  simple_buffer: [ 'void', ['pointer', 'pointer']]
  // 'get_array': [ 'void', [ 'pointer', 'pointer' ] ],
  // 'print_array': [ 'void', [ 'pointer', ref.refType(ourArray) ] ]
});

var callback = ffi.Callback('void', ['pointer', ref.refType(ref.types.uint8), ref.types.size_t], function(ctx, b, l) {
        console.log("got back ", ref.reinterpret(b, l));
    });
// lib.get_array(ref.NULL, callback);
lib.simple_buffer(ref.NULL, callback)
var timeout = setInterval(function() {process.exit()}, 500);
