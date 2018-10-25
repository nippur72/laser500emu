function PHI0(n) { return (((n)>>0)&1); }
function PHI1(n) { return (((n)>>1)&1); }
function PHI2(n) { return (((n)>>2)&1); }
function PHI3(n) { return (((n)>>3)&1); }

const nic_track_size = 8192; // 327680 / 40
const nic_sector_size = nic_track_size / 16;
const nic_tracks = 40; 
const FLOPPY_SIZE = nic_track_size * nic_tracks;
const TRACKS_PER_FLOPPY = 80; // 80ish ? 

class Drive {
   constructor(image) {
      this.track_x2 = 80;
      this.track_offset = 0;
      this.floppy = image === undefined ? new Uint8Array(FLOPPY_SIZE) : image;
      this.write_enabled = 0;
      this.fdc_data = 0;  // latch
      this.fdc_bits = 8;  // not used/implemented
      this.side = 0;      // not used/implemented

      this.WREQ = 0;
      this.ENBL = 0;
      this.PHASE = 0;      
   }

   read_byte() {   
      if(this.track_x2 % 2 == 1) return 0; // does not read on even tracks: TODO simulate 80 track disk
      const track = this.track_x2 / 2;   
      const pos = track * nic_track_size + this.track_offset;
      let data = this.fdc_data;
      if(this.ENBL) {
         data = this.floppy[pos];      
         this.track_offset = (this.track_offset + 1) % nic_track_size;   
         //console.log(`${hex(data)} POS=${pos}, T=${hex(track)} TO=${hex(this.track_offset)}`);
      }
      return data;
   }

   write_byte(data)
   {               
      if(this.track_x2 % 2 == 1) return 0; // does not read on even tracks: TODO simulate 80 track disk
      const track = this.track_x2 / 2;   
      const pos = track * nic_track_size + this.track_offset;
      this.fdc_data = data;
      if(this.ENBL) {
         this.floppy[pos] = data;      
         this.track_offset = (this.track_offset + 1) % nic_track_size;      
      }
   }

   move_head(direction) {
      if(this.ENBL) {         
         this.track_x2 += direction;
         if(this.track_x2 >= TRACKS_PER_FLOPPY) {
            this.track_x2 = TRACKS_PER_FLOPPY-1;
            // console.log(`bump on track ${this.track_x2}/80`);
         }
         else if(this.track_x2 < 0) {
            this.track_x2 = 0;
            // console.log(`bump on track ${this.track_x2}/80`);
         }
         else {
            // console.log(`moving to track ${this.track_x2}/80    (${direction})`);
         }
      }
   }
}

// the actual floppy disks inserted in the drives
const drives = [ new Drive(disk_image), new Drive() ];
let fdc_drive = 0;   // drive currently selected (0,1)

function floppy_read_port(port) {      
	switch(port-0x10)	
   {
      case 2: return read_12(); 
      case 3: return read_13();
      default:
         console.log("FDC: unknown read");
         return 0x00;
   }   
}

function floppy_write_port(port, data) {      
	switch(port-0x10) 
   {
      case 0: write_10(data); return;         
      case 1: write_11(data); return;         
      case 3: write_13(data); return;
      default:
         console.log("FDC: unknown write");
         return;
   }
}

function write_10(data) {  
   // 0x10: Latch register 1
   // 7	Side select:   0 = side 0, 1 = side 1
   // 6	Write request: 0 = write, 1 = read   Controls the /WREQ output line on the controller.
   // 5	Drive select:  0 = drive 1, 1 = drive 2
   // 4	Drive enable:  0 = drive disabled, 1 = drive enabled (motor spinning?)
   //    Controls the /ENBL1 or /ENBL2 output depending on the drive selected
   //    by bit 5.
   // 3-0	Stepper motor phase control. bit 0 = phase 0 ... bit 3 = phase 3
   //    Each phase is controlled independently by one bit. A phase is
   //    enabled when its bit is set.
   
   const side = bit(data,7);
   const WREQ = not_bit(data, 6);          
   const drive = bit(data,5);
   const ENBL = bit(data, 4); 
   const phase = data & 0b1111;

   fdc_drive = drive;   

   const d = drives[fdc_drive];

   const old_phase = d.PHASE;

   d.ENBL = ENBL;
   d.WREQ = WREQ;
   d.PHASE = phase;

   //console.log(`FDC: 0x10 SET: side=${side}, WREQ=${WREQ}, drive=${drive}, ENBL=${ENBL}, phase=${bin(phase,4)}`);   

   // decrease track
   if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI1(old_phase)) ||
      (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI2(old_phase)) ||
      (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI3(old_phase)) ||
      (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI0(old_phase)) )
   {
      drives[fdc_drive].move_head(-1);
   }
   else
   // increase track
   if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI3(old_phase)) ||
      (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI0(old_phase)) ||
      (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI1(old_phase)) ||
      (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI2(old_phase)) )
   {
      drives[fdc_drive].move_head(+1);
   }
   //else console.log("phase not affected");   
}

// 0x11: Latch register 2
// Bit(s)	Description
// 7-1	Reserved
// 0	Data write mode: 0 = 8 bit
// 	                 1 = 16 bit
function write_11(data) {  
   fdc_bits = data & 1 ? 16 : 8;
}

// 0x13: Data write register
// Bit(s) Description
// ---------------------------------------
// 7-0    Data to write to the controller's buffer. Should be written when bit 7
// 	    of status register is set.

function write_13(data) {  
   //console.log(`FDC: 0x13 SET: data=${data}`);   
   drives[fdc_drive].write_byte(data);   
}

// 0x13: Data read register
// Bit(s) Description
// ---------------------------------------
// 7-0    Data to read from the controller's buffer. Should be read when bit 7
//        of status register is set.
function read_13() {         
   return drives[fdc_drive].read_byte();
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
// 0       Write protect sense: 0 = write-protected
// 	                          1 = not write-protected
// 	     Status of the WPROT input (for selected drive).
//
function read_12() {
   const buffer_status = 0x80; // always ready
   let write_enabled = drives[fdc_drive].write_enabled;   
   data = buffer_status | write_enabled;         
   //console.log(`fdc 0x12: read status register of drive ${fdc_drive} is $${hex(data)}`);   
   return data;
}

