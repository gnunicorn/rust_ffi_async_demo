var ffi = require('ffi'),
    ref = require('ref'),
    arrayType = require('ref-array'),
    Struct = require('ref-struct');

const ourArray = arrayType(ref.types.uint8, 32);

const File = Struct({
	name: arrayType(ref.types.uint8, 32)
});

const FilePtr = ref.refType(File);


var lib = ffi.Library('./../target/debug/libffi_async_demo', {
  // 'register': [ 'void', [ 'pointer', 'pointer' ] ],
  // array testing
  // simple_buffer: [ 'void', ['pointer', 'pointer']]
  'get_file': [ 'void', [ 'pointer', 'pointer' ] ],
  'print_file': [ 'void', [ 'pointer', FilePtr ] ]
});

var callback = ffi.Callback('void', ['pointer', FilePtr], function(ctx, f) {
		const file = File(f);
        console.log("got back ", file);
        lib.print_file(ref.NULL, f);
    });
// lib.get_array(ref.NULL, callback);
lib.get_file(ref.NULL, callback)
var timeout = setInterval(function() {process.exit()}, 500);
