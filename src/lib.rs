extern crate thread_id;

use std::thread;
use std::os::raw::c_void;

struct OpaqueCtx(*mut c_void);
unsafe impl Send for OpaqueCtx {}

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
pub unsafe extern "C" fn get_array(ctx: *mut c_void,
                                  cb: extern "C" fn(*mut c_void, *const [u8; 32])) {
                                      print!("Updated");
    println!("{:p}", ctx);
    let ctx = OpaqueCtx(ctx);
    let arr = [208, 39, 232, 3, 0, 0, 0, 0, 160, 221, 98, 168, 254, 127, 0, 0, 152, 28, 159, 78, 196, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99];
    println!("address {:?}", &arr as *const [u8; 32]);
    let _ = thread::spawn(move || {
           let ctx = ctx.0;
           cb(ctx, &arr);
     });
}


#[no_mangle]
pub unsafe extern "C" fn print_array(_app: *const c_void, a: *const [u8; 32]) {
    println!("input is {:?} - {:?}", a, *a);
}
