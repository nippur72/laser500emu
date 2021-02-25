// FDC internal registers

let FDC_WREQ_n;   // write request
let FDC_ENBL;     // enable
let FDC_PHASE;    // step motor phase
let FDC_SIDE;     // side of the floppy
let FDC_DRIVE;    // drive number (0,1)
let FDC_BITS;     // bit sync (not used here)
let FDC_DATA;     // read/write data byte

function FDC_reset() {
   FDC_WREQ_n = 1;
   FDC_ENBL   = 0;
   FDC_PHASE  = 0;
   FDC_SIDE   = 0;
   FDC_DRIVE  = -1;
   FDC_BITS   = 255;
   FDC_DATA   = 0;
}

function PHI0(n) { return (((n)>>0)&1); }
function PHI1(n) { return (((n)>>1)&1); }
function PHI2(n) { return (((n)>>2)&1); }
function PHI3(n) { return (((n)>>3)&1); }

function FDC_io_read(port) {
	switch(port)
   {
      case 0x12: return FDC_read_port_12h();  // FDC status register
      case 0x13: return FDC_read_port_13h();  // FDC data register
      default:
         console.log("FDC: unknown read");
         return 0x00;
   }   
}

function FDC_io_write(port, data) {
	switch(port)
   {
      case 0x10: FDC_write_port_10h(data); return; // FDC control register 1
      case 0x11: FDC_write_port_11h(data); return; // FDC control register 2
      case 0x13: FDC_write_port_12h(data); return; // FDC data register
      default:
         console.log("FDC: unknown write");
         return;
   }
}

function FDC_write_port_10h(data) {
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

   FDC_SIDE   = (data >> 7) & 1;
   FDC_WREQ_n = (data >> 6) & 1;
   FDC_DRIVE  = (data >> 5) & 1;
   FDC_ENBL   = (data >> 4) & 1;
   FDC_PHASE  = data & 0x0f;

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
}

// 0x11: Latch register 2
// 213 = turn off self sync bytes 
// 255 = turn on self sync bytes 
function FDC_write_port_11h(data) {
   FDC_BITS = data;
}

// 0x13: Data write register
// Bit(s) Description
// ---------------------------------------
// 7-0    Data to write to the controller's buffer. Should be written when bit 7
// 	    of status register is set.

function FDC_write_port_12h(data) {
   FDC_DATA = data;
   drives[FDC_DRIVE].write_byte();
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
function FDC_read_port_12h() {
   if(FDC_DRIVE === -1) {
      return 0x13; // @Bonstra test on no drive selected 0x13 = not ready + write protected + reserved
   }

   let buffer_status = 1; // always ready
   let write_enabled = drives[FDC_DRIVE].write_enabled;
   data = (buffer_status << 7) | write_enabled;
   return data;
}

// 0x13: Data read register
// Bit(s) Description
// ---------------------------------------
// 7-0    Data to read from the controller's buffer. Should be read when bit 7
//        of status register is set.
function FDC_read_port_13h() {
   if(FDC_DRIVE === -1) return 0xFF; // @Bonstra test on no drive select
   drives[FDC_DRIVE].read_byte()
   return FDC_DATA;
}

// =====================================================================================

const NIC_TRACK_SIZE = 8192; // 327680 / 40
const NIC_SECTOR_SIZE = NIC_TRACK_SIZE / 16;
const NIC_TRACKS = 40;
const FLOPPY_SIDE = NIC_TRACK_SIZE * NIC_TRACKS;
const FLOPPY_SIZE = 2 * FLOPPY_SIDE;
const TRACKS_PER_FLOPPY = 80; // 80ish ?

class Drive {
   constructor(image) {
      this.track_x2 = 80;
      this.track_offset = 0;
      this.floppy = image === undefined ? new Uint8Array(FLOPPY_SIZE) : this.resize(image);
      this.write_enabled = 0;
   }

   getpos(track, side) {
      return (track * NIC_TRACK_SIZE) + (side * FLOPPY_SIDE);
   }

   read_byte() {
      if(this.track_x2 % 2 == 1) return 0; // does not read on even tracks: TODO simulate 80 track disk
      const track = this.track_x2 / 2;
      const pos = this.getpos(track, FDC_SIDE) + this.track_offset;
      if(FDC_ENBL && FDC_WREQ_n) {
         FDC_DATA = this.floppy[pos];
         this.track_offset = (this.track_offset + 1) % NIC_TRACK_SIZE;
      }
   }

   write_byte()
   {
      if(this.track_x2 % 2 == 1) return 0; // does not read on even tracks: TODO simulate 80 track disk
      const track = this.track_x2 / 2;
      const pos = this.getpos(track, FDC_SIDE) + this.track_offset;
      if(FDC_ENBL && !FDC_WREQ_n) {
         this.floppy[pos] = FDC_DATA;
         this.track_offset = (this.track_offset + 1) % NIC_TRACK_SIZE;
      }
   }

   move_head(direction) {
      if(FDC_ENBL) {
         this.track_x2 += direction;
         if(this.track_x2 >= TRACKS_PER_FLOPPY) this.track_x2 = TRACKS_PER_FLOPPY-1;
         else if(this.track_x2 < 0)             this.track_x2 = 0;
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
