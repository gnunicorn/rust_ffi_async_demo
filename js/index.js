var ffi = require('ffi'),
    ref = require('ref'),
    arrayType = require('ref-array');

const ourArray = new arrayType(ref.types.uint8, 32);


var lib = ffi.Library('./libffi_async_demo', {
  'register': [ 'void', [ 'pointer', 'pointer' ] ],
  // array testing
  'get_array': [ 'void', [ 'pointer', 'pointer' ] ],
  'print_array': [ 'void', [ "pointer", ourArray ] ]
});

var callback = function() {
    var state = {x: "tada"};

    return ffi.Callback('void', ['pointer', ref.types.int32], function(ctx, code) {
        console.log("getting back: ", code);
        console.log(state.x);
    })
}();

lib.register(ref.NULL, callback)

lib.get_array(ref.NULL, ffi.Callback('void', ['pointer', ourArray], function(ctx, a) {
        console.log("got back ", a);
        lib.print_array(ctx, a);
    }))
var timeout = setInterval(function() {process.exit()}, 500);
