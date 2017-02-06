extern crate thread_id;

use std::thread;
use std::os::raw::c_void;

struct OpaqueCtx(*mut c_void);
unsafe impl Send for OpaqueCtx {}


/// FFI-wrapper for `File`.
#[repr(C)]
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone)]
pub struct File {
    /// Name of the `ImmutableData` containing the content of this file.
    pub name: [u8; 32],
}

#[no_mangle]
pub unsafe extern "C" fn register(ctx: *mut c_void,
                                  cb: unsafe extern "C" fn(*mut c_void, i32)) {
    println!("{:p}", ctx);
    let ctx = OpaqueCtx(ctx);
    let _ = thread::spawn(move || {
           let ctx = ctx.0;
           cb(ctx, -1003);
     });
}


#[no_mangle]
pub unsafe extern "C" fn get_file(ctx: *mut c_void,
                                  cb: extern "C" fn(*mut c_void, *const File)) {
                                      print!("Updated");
    println!("{:p}", ctx);
    let ctx = OpaqueCtx(ctx);
    let f = File {
      name: [208, 39, 232, 3, 0, 0, 0, 0, 160, 221, 98, 168, 254, 127, 0, 0, 152, 28, 159, 78, 196, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99]
    };
    println!("file {:?}", f);
    let _ = thread::spawn(move || {
           let ctx = ctx.0;
           cb(ctx, &f);
     });
}


#[no_mangle]
pub unsafe extern "C" fn print_file(_app: *const c_void, a: *const File) {
    println!("input is {:?}", *a);
}
