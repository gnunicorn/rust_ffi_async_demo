var ffi = require('ffi'),
    ref = require('ref'),
    arrayType = require('ref-array');

const ourArray = arrayType(ref.types.uint8, 32);

var lib = ffi.Library('./../target/debug/libffi_async_demo', {
  // 'register': [ 'void', [ 'pointer', 'pointer' ] ],
  // array testing
  'get_array': [ 'void', [ 'pointer', 'pointer' ] ],
  'print_array': [ 'void', [ 'pointer', ref.refType(ourArray) ] ]
});

var callback = ffi.Callback('void', ['pointer', ref.refType(ourArray)], function(ctx, a) {
        // console.log("got back ", ref.reinterpret(a.buffer, 32));
        console.log("got back ", a.hexAddress(), a.deref().length);
        // console.log("got back ", a.deref());
        lib.print_array(ctx, a);
    });
lib.get_array(ref.NULL, callback);
var timeout = setInterval(function() {process.exit()}, 500);
