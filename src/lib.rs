extern crate thread_id;
extern crate time;

use std::thread;
use std::os::raw::c_void;
use time::Tm;
use std::mem;


struct OpaqueCtx(*mut c_void);
unsafe impl Send for OpaqueCtx {}


/// FFI-wrapper for `File`.
#[repr(C)]
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone)]
pub struct File {
    /// File size in bytes.
    pub size: u64,
    /// Creation time.
    pub created: Tm,
    /// Modification time.
    pub modified: Tm,
    /// Pointer to the user metadata.
    pub user_metadata_ptr: *mut u8,
    /// Size of the user metadata.
    pub user_metadata_len: usize,
    /// Capacity of the user metadata (internal field).
    pub user_metadata_cap: usize,
    /// Name of the `ImmutableData` containing the content of this file.
    pub data_map_name: [u8; 32],
}

impl Drop for File {
    #[allow(unsafe_code)]
    fn drop(&mut self) {
        let _ = unsafe {
            Vec::from_raw_parts(self.user_metadata_ptr,
                                self.user_metadata_len,
                                self.user_metadata_cap)
        };
    }
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
    let mut meta = vec![0, 208, 109];

    let ptr = meta.as_mut_ptr();
    let len = meta.len();
    let cap = meta.capacity();
    mem::forget(meta);

    let f = File {
      size: 0,
      created: time::now_utc(),
      modified: time::now_utc(),
      user_metadata_len: len,
      user_metadata_ptr: ptr,
      user_metadata_cap: cap,
      data_map_name: [208, 39, 232, 3, 0, 0, 0, 0, 160, 221, 98, 168, 254, 127, 0, 0, 152, 28, 159, 78, 196, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99]
    };
    println!("file {:?}", f);
    // let _ = thread::spawn(move || {
       let ctx = ctx.0;
       cb(ctx, &f);
     // });
}


#[no_mangle]
pub unsafe extern "C" fn print_file(_app: *const c_void, a: *const File) {
    println!("input is {:?}", *a);
}
