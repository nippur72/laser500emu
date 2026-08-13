import { areUint8ArraysDifferent, downloadBytes } from "./bytes";
import { playDriveSound } from "./drive-sound";

// ---- FDC debug logging ----
// Set to true to enable debug output in the browser console.
// Logs all control register writes, data I/O, and head movement.
export let FDC_DEBUG = false;
(window as any).FDC_DEBUG_ON  = () => { FDC_DEBUG = true;  console.log("FDC debug ON"); };
(window as any).FDC_DEBUG_OFF = () => { FDC_DEBUG = false; console.log("FDC debug OFF"); };

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

export function FDC_io_read(port) {
	switch(port)
   {
      case 0x12: return FDC_read_port_12h();  // FDC status register
      case 0x13: return FDC_read_port_13h();  // FDC data register
      default:
         console.log("FDC: unknown read port", port.toString(16));
         return 0x00;
   }   
}

export function FDC_io_write(port, data) {
	switch(port)
   {
      case 0x10: FDC_write_port_10h(data); return; // FDC control register 1
      case 0x11: FDC_write_port_11h(data); return; // FDC control register 2
      case 0x13: FDC_write_port_13h(data); return; // FDC data register
      default:
         console.log("FDC: unknown write port", port.toString(16));
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
   const old_drive = FDC_DRIVE;
   const old_wreq  = FDC_WREQ_n;
   const old_side  = FDC_SIDE;
   const old_enbl  = FDC_ENBL;

   FDC_SIDE   = (data >> 7) & 1;
   FDC_WREQ_n = (data >> 6) & 1;
   FDC_DRIVE  = (data >> 5) & 1;
   FDC_ENBL   = (data >> 4) & 1;
   FDC_PHASE  = data & 0x0f;

   if(FDC_DEBUG) {
      const changes: string[] = [];
      if(FDC_DRIVE  !== old_drive)  changes.push(`drive:${old_drive}→${FDC_DRIVE}`);
      if(FDC_ENBL   !== old_enbl)   changes.push(`enbl:${old_enbl}→${FDC_ENBL}`);
      if(FDC_WREQ_n !== old_wreq)   changes.push(`wreq_n:${old_wreq}→${FDC_WREQ_n}(${FDC_WREQ_n?'READ':'WRITE'})`);
      if(FDC_SIDE   !== old_side)   changes.push(`side:${old_side}→${FDC_SIDE}`);
      //if(FDC_PHASE  !== old_phase)  changes.push(`phase:${old_phase.toString(2).padStart(4,'0')}→${FDC_PHASE.toString(2).padStart(4,'0')}`);

      if(changes.length > 0) {
         console.log(`FDC ← port10 0x${data.toString(16).padStart(2,'0')} | drv=${FDC_DRIVE} enbl=${FDC_ENBL} side=${FDC_SIDE} ${FDC_WREQ_n?'RD':'WR'} phase=${FDC_PHASE.toString(2).padStart(4,'0')} trk=${drives[FDC_DRIVE].track_x2>>1} [${changes.join(' ')}]`);
      }
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
}

// 0x11: Latch register 2
// 213 = turn off self sync bytes 
// 255 = turn on self sync bytes 
function FDC_write_port_11h(data) {
   //if(FDC_DEBUG && FDC_BITS !== data) {
   //   console.log(`FDC ← port11 0x${data.toString(16).padStart(2,'0')} | sync=${data === 255 ? 'ON' : data === 213 ? 'OFF' : '?'}`);
   //}
   FDC_BITS = data;
}

// 0x13: Data write register
// Bit(s) Description
// ---------------------------------------
// 7-0    Data to write to the controller's buffer. Should be written when bit 7
// 	    of status register is set.

function FDC_write_port_13h(data) {
   FDC_DATA = data;
   if(FDC_DEBUG) {
      const drv = drives[FDC_DRIVE];
      const track = drv.track_x2 >> 1;
      const side = drv.sides === 1 ? 0 : FDC_SIDE;
      const pos = drv.getpos(track, side) + drv.track_offset;
      const blocked = !(FDC_ENBL && !FDC_WREQ_n && !drv.write_protected);
      if(blocked) {
         console.warn(`FDC ← port13 WRITE BLOCKED data=0x${data.toString(16).padStart(2,'0')} drv=${FDC_DRIVE} trk=${track} side=${side} off=${drv.track_offset} | enbl=${FDC_ENBL} wreq_n=${FDC_WREQ_n} wp=${drv.write_protected}`);
      } else if(pos >= drv.floppy.length) {
         console.warn(`FDC ← port13 WRITE OUT OF RANGE data=0x${data.toString(16).padStart(2,'0')} drv=${FDC_DRIVE} trk=${track} side=${side} off=${drv.track_offset} pos=${pos} len=${drv.floppy.length} | write goes nowhere`);
      }
   }
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
   let write_protected = drives[FDC_DRIVE].write_protected;
   const data = (buffer_status << 7) | write_protected;
   //console.log(`read 12h status = 0x${data.toString(16).padStart(2,'0')}`)
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
   //console.log(`read 13h data = 0x${FDC_DATA.toString(16).padStart(2,'0')}`)
   return FDC_DATA;
}

// =====================================================================================

export function EmptyDisk(sides: number) {
   const NIC_TRACK_SIZE = 8192; // 327680 / 40
   const NIC_SECTOR_SIZE = NIC_TRACK_SIZE / 16;
   const NIC_TRACKS = 40;
   const FLOPPY_SIDE = NIC_TRACK_SIZE * NIC_TRACKS;
   const FLOPPY_SIZE = sides * FLOPPY_SIDE;   
   return new Uint8Array(FLOPPY_SIZE).fill(0xFF); //.map(e=>(Math.random()*256)&0xFF);
}

export class Drive {
   track_x2: number;
   track_offset: number;
   floppy: Uint8Array;
   original_image: Uint8Array;
   sides: number;
   original_length: number;
   side1_warning_shown: boolean;

   write_protected: number;
   fileName: string;
   NIC_TRACK_SIZE: number;
   NIC_SECTOR_SIZE: number;
   NIC_TRACKS: number;
   FLOPPY_SIDE: number;
   FLOPPY_SIZE: number;
   TRACKS_PER_FLOPPY: number;
   
   constructor(image: Uint8Array, fileName: string) {
      this.track_x2 = 0;
      this.track_offset = 0;

      this.write_protected = 0;
      this.fileName = fileName;
      this.NIC_TRACK_SIZE = 8192; // 327680 / 40
      this.NIC_SECTOR_SIZE = this.NIC_TRACK_SIZE / 16;
      this.NIC_TRACKS = 40;
      this.FLOPPY_SIDE = this.NIC_TRACK_SIZE * this.NIC_TRACKS;
      this.FLOPPY_SIZE = 2 * this.FLOPPY_SIDE;
      this.TRACKS_PER_FLOPPY = 80; // 80ish ?

      // special case for fd021_patched.nic (Chinese CP/M)
      if(image.length === 335872) {
         this.NIC_TRACK_SIZE = 8192; // 327680 / 40
         this.NIC_SECTOR_SIZE = this.NIC_TRACK_SIZE / 16;
         this.NIC_TRACKS = 41;
         this.FLOPPY_SIDE = this.NIC_TRACK_SIZE * this.NIC_TRACKS;
         this.FLOPPY_SIZE = 2 * this.FLOPPY_SIDE;
         this.TRACKS_PER_FLOPPY = 82; // 80ish ?
      }

      // pad single-sided images to full double-sided geometry, so that
      // side-1 accesses land in a writable second side instead of being
      // silently discarded by the (pos < floppy.length) checks
      this.original_length = image.length;
      this.sides = image.length > this.FLOPPY_SIDE ? 2 : 1;
      this.side1_warning_shown = false;
      if(this.sides === 1) {
         const padded = new Uint8Array(this.FLOPPY_SIZE).fill(0xFF);
         padded.set(image, 0);
         this.floppy = padded;
         this.original_image = new Uint8Array(padded);
      } else {
         this.floppy = image;
         this.original_image = new Uint8Array(image);
      }
   }

   getpos(track, side) {
      return (track * this.NIC_TRACK_SIZE) + (side * this.FLOPPY_SIDE);
   }

   warn_side1_single_sided() {
      // On a single-sided image the side-select bit is ignored (the head is
      // always on side 0), so this warning no longer triggers for real access.
      // It is kept only as a reminder for double-sided images.
      if(FDC_SIDE === 1 && this.sides === 1 && !this.side1_warning_shown) {
         this.side1_warning_shown = true;
         console.warn(`FDC: side 1 requested but "${this.fileName}" is a single-sided image; side-select ignored (head stays on side 0)`);
      }
   }

   read_byte() {
      // TODO simulate 80 half tracks disk
      // if(this.track_x2 % 2 == 1) return 0;
      //const track = this.track_x2 / 2;
      const track = this.track_x2 >> 1;
      // On single-sided images the side-select bit is ignored, exactly like on
      // the real hardware ("side select, apparentemente non usato"): the head
      // is always on side 0. This matters for the CP/M tools (FORMAT.COM,
      // COPY.COM) which write with bit 7 set even on single-sided disks.
      const side = this.sides === 1 ? 0 : FDC_SIDE;
      const pos = this.getpos(track, side) + this.track_offset;
      if(FDC_ENBL && FDC_WREQ_n) {
         this.warn_side1_single_sided();
         FDC_DATA = (pos < this.floppy.length) ? this.floppy[pos] : 0xFF;
         this.track_offset = (this.track_offset + 1) % this.NIC_TRACK_SIZE;
      }
   }

   write_byte()
   {
      // TODO simulate 80 half tracks disk
      // if(this.track_x2 % 2 == 1) return 0;
      const track = this.track_x2 >> 1;
      const side = this.sides === 1 ? 0 : FDC_SIDE;
      const pos = this.getpos(track, side) + this.track_offset;
      if(FDC_ENBL && !FDC_WREQ_n && !this.write_protected) {
         this.warn_side1_single_sided();
         if(pos < this.floppy.length) this.floppy[pos] = FDC_DATA;
         this.track_offset = (this.track_offset + 1) % this.NIC_TRACK_SIZE;
      }
   }

   move_head(direction) {
      if(FDC_ENBL) {
         this.track_x2 += direction;
         if(this.track_x2 >= this.TRACKS_PER_FLOPPY) this.track_x2 = this.TRACKS_PER_FLOPPY-1;
         else if(this.track_x2 < 0)                  this.track_x2 = 0;
         // play head step sound if enabled
         if((window as any).laser500?.drive_sound) playDriveSound();
         if(FDC_DEBUG) console.log(`FDC move head drv=${FDC_DRIVE} ${direction>0?'+':'-'}1 → track=${this.track_x2>>1} (x2=${this.track_x2})`);
      } else if(FDC_DEBUG) {
         console.warn(`FDC head BLOCKED (enbl=0) drv=${FDC_DRIVE} dir=${direction}`);
      }
   }

   /*
   resize(image) {
      const new_image = new Uint8Array(FLOPPY_SIZE);
      image.forEach((e,i)=>new_image[i]=e);
      return new_image;
   }
   */

   save_image_to_file() {
      // single-sided images are padded to double-sided in memory; if the padded
      // second side was never written, save back only the original length
      if(this.original_length < this.floppy.length) {
         const pad = this.floppy.subarray(this.original_length);
         if(pad.every(b => b === 0xFF)) {
            downloadBytes(this.fileName, this.floppy.slice(0, this.original_length));
            return;
         }
      }
      downloadBytes(this.fileName, this.floppy);
   }

   is_modified() {
      return areUint8ArraysDifferent(this.floppy, this.original_image);
   }
}

// the actual floppy disks inserted in the drives at startup
export const drives = [ 
   new Drive(EmptyDisk(2), "EMPTY.NIC"), 
   new Drive(EmptyDisk(2), "EMPTY.NIC") 
];
