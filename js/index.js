var ffi = require('ffi'),
    ref = require('ref'),
    arrayType = require('ref-array'),
    Struct = require('ref-struct');

const ourArray = arrayType(ref.types.uint8, 32);

const i32 = ref.types.int32;

const Time = Struct({
  "tm_sec": i32,
  "tm_min": i32,
  "tm_hour": i32,
  "tm_mday": i32,
  "tm_mon": i32,
  "tm_year": i32,
  "tm_wday": i32,
  "tm_yday": i32,
  "tm_isdst": i32,
  "tm_utcoff": i32,
  "tm_nsec": i32,
});

const File = Struct({
  size: ref.types.uint64,
  created: Time,
  modified: Time,
  user_metadata_ptr: ref.refType(ref.types.uint8),
  user_metadata_len: ref.types.size_t,
  user_metadata_cap: ref.types.size_t,
  data_map_name: arrayType(ref.types.uint8, 32)
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
