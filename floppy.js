// FDC internal registers

let FDC_WREQ;
let FDC_ENBL;
let FDC_PHASE;
let FDC_SIDE;
let FDC_DRIVE;
let FDC_BITS;

function FDC_reset() {
   FDC_WREQ  = 0;
   FDC_ENBL  = 0;
   FDC_PHASE = 0;
   FDC_SIDE  = 0;
   FDC_DRIVE = -1;
   FDC_BITS  = 255;
}

function PHI0(n) { return (((n)>>0)&1); }
function PHI1(n) { return (((n)>>1)&1); }
function PHI2(n) { return (((n)>>2)&1); }
function PHI3(n) { return (((n)>>3)&1); }

// debug flags
let fdc_debug_move      = true;
let fdc_debug_data_size = true;
let fdc_debug_read      = true;
let fdc_debug_write     = true;
let fdc_debug_rw_short  = true;
let fdc_debug_side      = true;
let fdc_debug_read_buf  = [];
let fdc_debug_write_buf = [];

function fdc_debug_flush() {
    if(fdc_debug_read_buf.length > 0) {
        if(fdc_debug_rw_short) console.log(`read: ${fdc_debug_read_buf.length} bytes`);
        else console.log(`read: ${fdc_debug_read_buf.map(e=>hex(e)).join(" ")}`);
        fdc_debug_read_buf = [];
    }

    if(fdc_debug_write_buf.length > 0) {
      if(fdc_debug_rw_short) console.log(`write: ${fdc_debug_write_buf.length} bytes`);
      else console.log(`write: ${fdc_debug_write_buf.map(e=>hex(e)).join(" ")}`);
      fdc_debug_write_buf = [];
    }
}

function floppy_read_port(port) {      
	switch(port)
   {
      case 0x12: return read_12();  // FDC status register
      case 0x13: return read_13();  // FDC data register
      default:
         console.log("FDC: unknown read");
         return 0x00;
   }   
}

function floppy_write_port(port, data) {      
	switch(port)
   {
      case 0x10: write_10(data); return; // FDC control register 1
      case 0x11: write_11(data); return; // FDC control register 2
      case 0x13: write_13(data); return; // FDC data register
      default:
         console.log("FDC: unknown write");
         return;
   }
}

function write_10(data) {
   // 0x10: Latch register 1
   // 7	 Side select:   0 = side 0, 1 = side 1
   // 6	 Write request: 0 = write, 1 = read   Controls the /WREQ output line on the controller.
   // 5	 Drive select:  0 = drive 1, 1 = drive 2
   // 4	 Drive enable:  0 = drive disabled, 1 = drive enabled (motor spinning?)
   //     Controls the /ENBL1 or /ENBL2 output depending on the drive selected by bit 5.
   // 3-0 Stepper motor phase control. bit 0 = phase 0 ... bit 3 = phase 3
   //     Each phase is controlled independently by one bit. A phase is
   //     enabled when its bit is set.

   const old_phase = FDC_PHASE;
   const old_side  = FDC_SIDE;

   FDC_SIDE  = bit(data, 7);
   FDC_WREQ  = not_bit(data, 6);
   FDC_DRIVE = bit(data, 5);
   FDC_ENBL  = bit(data, 4);
   FDC_PHASE = data & 0b1111;

   if(fdc_debug_side && (FDC_SIDE !== old_side)) {
      fdc_debug_flush();
      console.log(`drive ${FDC_DRIVE+1} going on side ${FDC_SIDE}`);
   }

   // decrease track
   if((PHI0(FDC_PHASE) && !(PHI1(FDC_PHASE) || PHI2(FDC_PHASE) || PHI3(FDC_PHASE)) && PHI1(old_phase)) ||
      (PHI1(FDC_PHASE) && !(PHI0(FDC_PHASE) || PHI2(FDC_PHASE) || PHI3(FDC_PHASE)) && PHI2(old_phase)) ||
      (PHI2(FDC_PHASE) && !(PHI0(FDC_PHASE) || PHI1(FDC_PHASE) || PHI3(FDC_PHASE)) && PHI3(old_phase)) ||
      (PHI3(FDC_PHASE) && !(PHI0(FDC_PHASE) || PHI1(FDC_PHASE) || PHI2(FDC_PHASE)) && PHI0(old_phase)) )
   {
      drives[FDC_DRIVE].move_head(-1);
   }
   else
   // increase track
   if((PHI0(FDC_PHASE) && !(PHI1(FDC_PHASE) || PHI2(FDC_PHASE) || PHI3(FDC_PHASE)) && PHI3(old_phase)) ||
      (PHI1(FDC_PHASE) && !(PHI0(FDC_PHASE) || PHI2(FDC_PHASE) || PHI3(FDC_PHASE)) && PHI0(old_phase)) ||
      (PHI2(FDC_PHASE) && !(PHI0(FDC_PHASE) || PHI1(FDC_PHASE) || PHI3(FDC_PHASE)) && PHI1(old_phase)) ||
      (PHI3(FDC_PHASE) && !(PHI0(FDC_PHASE) || PHI1(FDC_PHASE) || PHI2(FDC_PHASE)) && PHI2(old_phase)) )
   {
      drives[FDC_DRIVE].move_head(+1);
   }
   //else console.log("phase not affected");
}

// 0x11: Latch register 2
// 213 = turn off self sync bytes 
// 255 = turn on self sync bytes 
function write_11(data) {  
   FDC_BITS = data;
   if(fdc_debug_data_size) {
      fdc_debug_flush(); 
      console.log(`data size is ${FDC_BITS === 213 ? 'normal' : 'extended' } (${FDC_BITS})`);
   }
}

// 0x13: Data write register
// Bit(s) Description
// ---------------------------------------
// 7-0    Data to write to the controller's buffer. Should be written when bit 7
// 	    of status register is set.

function write_13(data) {  
   drives[FDC_DRIVE].write_byte(data);
}

// 0x12: Status register
// Bit(s)  Description
// ---------------------------------------
// 7       Controller buffer status
// 	     When writing: 0 = buffer not empty
// 	                   1 = buffer empty, ready for writing
// 	     When reading: 0 = data not ready
// 	                   1 = data ready
// 6-1     Reserved
// 0       Write protect sense: 0 = not write-protected
// 	                          1 = write-protected
// 	     Status of the WPROT input (for selected drive).
//
function read_12() {
   if(FDC_DRIVE === -1) {
      return 0x13; // @Bonstra test on no drive selected 0x13 = not ready + write protected + reserved
   }

   let buffer_status = 1; // always ready
   let write_enabled = drives[FDC_DRIVE].write_enabled;
   data = (buffer_status << 7) | write_enabled;
   //console.log(`fdc 0x12: read status register of drive ${fdc_drive} is $${hex(data)}`);
   return data;
}

// 0x13: Data read register
// Bit(s) Description
// ---------------------------------------
// 7-0    Data to read from the controller's buffer. Should be read when bit 7
//        of status register is set.
function read_13() {     
   if(FDC_DRIVE === -1) return 0xFF; // @Bonstra test on no drive select
   return drives[FDC_DRIVE].read_byte();
}

// =====================================================================================

const nic_track_size = 8192; // 327680 / 40
const nic_sector_size = nic_track_size / 16;
const nic_tracks = 40;
const FLOPPY_SIDE = nic_track_size * nic_tracks;
const FLOPPY_SIZE = 2 * FLOPPY_SIDE;
const TRACKS_PER_FLOPPY = 80; // 80ish ?

class Drive {
   constructor(image) {
      this.track_x2 = 80;
      this.track_offset = 0;
      this.floppy = image === undefined ? new Uint8Array(FLOPPY_SIZE) : this.resize(image);
      this.write_enabled = 0;
      this.fdc_data = 0;    // latch
   }

   read_byte() {
      if(this.track_x2 % 2 == 1) return 0; // does not read on even tracks: TODO simulate 80 track disk
      const track = this.track_x2 / 2;
      const pos = track * nic_track_size + this.track_offset + FDC_SIDE * FLOPPY_SIDE;
      let data = this.fdc_data;
      if(FDC_ENBL && !FDC_WREQ) {
         data = this.floppy[pos];
         this.track_offset = (this.track_offset + 1) % nic_track_size;
         if(fdc_debug_read) {
            fdc_debug_read_buf.push(data);
         }
      }
      return data;
   }

   write_byte(data)
   {
      if(this.track_x2 % 2 == 1) return 0; // does not read on even tracks: TODO simulate 80 track disk
      const track = this.track_x2 / 2;
      const pos = track * nic_track_size + this.track_offset + FDC_SIDE * FLOPPY_SIDE;
      this.fdc_data = data;
      if(FDC_ENBL && FDC_WREQ) {
         this.floppy[pos] = data;
         this.track_offset = (this.track_offset + 1) % nic_track_size;
         if(fdc_debug_write) {
            fdc_debug_write_buf.push(data);
         }
      }
   }

   move_head(direction) {
      fdc_debug_flush();

      if(FDC_ENBL) {
         this.track_x2 += direction;
         if(this.track_x2 >= TRACKS_PER_FLOPPY) {
            this.track_x2 = TRACKS_PER_FLOPPY-1;
            if(fdc_debug_move) {
                console.log(`drive ${FDC_DRIVE+1}: seek ${direction===1?'forward':'backward'}, BUMP on track ${this.track_x2/2} (${this.track_x2}/80)`);
            }
         }
         else if(this.track_x2 < 0) {
            this.track_x2 = 0;
            if(fdc_debug_move) {
                console.log(`drive ${FDC_DRIVE+1}: seek ${direction===1?'forward':'backward'}, BUMP on track ${this.track_x2/2} (${this.track_x2}/80)`);
            }
         }
         else {
            if(fdc_debug_move) {
               console.log(`drive ${FDC_DRIVE+1}: seek ${direction===1?'forward':'backward'}, track is now ${this.track_x2/2} (${this.track_x2}/80)`);
            }
         }
      }
   }

   resize(image) {
      const new_image = new Uint8Array(FLOPPY_SIZE);
      image.forEach((e,i)=>new_image[i]=e);
      return new_image;
   }
}

// the actual floppy disks inserted in the drives
const drives = [ new Drive(disk_image), new Drive() ];
