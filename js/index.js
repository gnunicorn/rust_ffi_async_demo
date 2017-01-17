var ffi = require('ffi'),
    ref = require('ref');

var lib = ffi.Library('./libffi_async_demo', {
  'register': [ 'void', [ 'pointer', 'pointer' ] ]
});

var callback = function() {
    var state = {x: "tada"};

    return ffi.Callback('void', ['pointer', ref.types.int32], function(ctx, code) {
        console.log("getting back: ", code);
        console.log(state.x);
    })
}();

lib.register(ref.NULL, callback)
var timeout = setInterval(function() {process.exit()}, 500);
