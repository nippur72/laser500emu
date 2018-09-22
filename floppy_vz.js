// this file emulates the Floppy Disk Controller (fdc)
// it was carbon copied from MAME/MESS (it's disabled there) and adapted
// it was converted to JavaScript, variable names changed/simplified, cleaned up

/*
Description of the FDC (as far as I've understood)

*/

const TRKSIZE_VZ = 0x9a0;  // 2464 arbitrary (actually from analyzing format) 
const TRKSIZE_FM = 3172;   // size of a standard FM mode track 
const TRACKS_PER_FLOPPY = 80; // 80ish ? 
const FLOPPY_SIZE = TRKSIZE_VZ * TRACKS_PER_FLOPPY;

// the actual floppy disks inserted in the drives, seen as array of bytes
const fdc_floppies = [ 
   new Uint8Array(FLOPPY_SIZE), // drive 0
   new Uint8Array(FLOPPY_SIZE)  // drive 1
];

const fdc_track_x2 = new Uint8Array(2);          // the track position in drives 0,1 multiplied by 2
const fdc_wrprot = new Uint8Array([0x80, 0x80]); // write protection of floppy in drives (0x80=write enabled)
const fdc_buffer = new Uint8Array(TRKSIZE_FM);   // the controlle buffer for reading/writing, contains one track

let fdc_status = 0; // uint8
let fdc_data;       // int
let fdc_edge = 0;   // int
let fdc_bits = 8;   // int
let fdc_drive = -1; // drive currently selected (0,1,-1)
let fdc_start = 0;  // starting read/write position in fdc_buffer[]
let fdc_write = 0;  // number of bytes to read/write in buffer[]
let fdc_offs = 0;   // int
let fdc_latch = 0;  // int

// drives are mapped from port 0x10 to 0x1f

function PHI0(n) { return (((n)>>0)&1); }
function PHI1(n) { return (((n)>>1)&1); }
function PHI2(n) { return (((n)>>2)&1); }
function PHI3(n) { return (((n)>>3)&1); }

// initializes the drive
function laser_drive_init() {
   fdc_track_x2[0] = fdc_track_x2[1] = 80;   
   fdc_bits = 8;
   fdc_drive = 1;
}

// returns uint8
function laser_fdc_r(offset)
{
	let data = 0xff;
	switch(offset)
	{
      case 0: // TODO this was unhandled, check which case is appropriate
         return 0xaa;

	   case 1: // data (read-only) 
         if(fdc_bits > 0) {
            if( fdc_status & 0x80 ) fdc_bits--;
            data = (fdc_data >> fdc_bits) & 0xff;         
            console.log(`fdc: (of1) read of the data register data=${hex(data)} (${data.toString(2)})`);
         }
         if(fdc_bits == 0) {
            fdc_data = fdc_buffer[fdc_offs];
            console.log(`fdc: (of1) setting data register to ${hex(data)} from buffer in position ${fdc_offs}`);            
            if(fdc_status & 0x80) {
               fdc_bits = 8;
               fdc_offs = (fdc_offs + 1) % TRKSIZE_FM;
            }
            fdc_status &= ~0x80;
         }
         break;
      case 2: // polling (read-only)
         // fake
         if(fdc_drive >= 0) fdc_status |= 0x80;
         data = fdc_status;
         console.log(`fdc: (of2) reading of status register ${hex(data)}`);            
         break;
      case 3: // write protect status (read-only) 
         if(fdc_drive >= 0) data = fdc_wrprot[fdc_drive];
         console.log(`fdc (of3) read of write_protect state of drive ${fdc_drive} is $${hex(data)}`);
         break;
      default:
         console.log(`unknown disk read from port ${offset}`);
   }
   console.log(`fdc: read from I/O port ${hex(offset+0x10)} resulted in ${hex(data)}`);
	return data;
}

function laser_fdc_w(offset, data)
{
   console.log(`fdc: write to port ${hex(offset+0x10)} <= ${hex(data)}`);

   let drive;

	switch(offset) {
      case 0: // latch (write-only) 
      case 1: // latch (write-only) 
      case 2: // latch (write-only) 
      case 3: // latch (write-only) 
      case 4: // latch (write-only) 
         drive = (data & 0x10) ? 0 : (data & 0x80) ? 1 : -1;
         if(drive != fdc_drive )
         {
            fdc_drive = drive;
            if(fdc_drive >= 0) laser_get_track();
         }
         if(fdc_drive >= 0)
         {
            if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI1(fdc_latch)) ||
               (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI2(fdc_latch)) ||
               (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI3(fdc_latch)) ||
               (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI0(fdc_latch)) )
            {
               if(fdc_track_x2[fdc_drive] > 0) fdc_track_x2[fdc_drive]--;
               console.log("laser_fdc_w(%d) $%02X drive %d: stepout track #%2d.%d\n", offset, data, fdc_drive, fdc_track_x2[fdc_drive]/2,5*(fdc_track_x2[fdc_drive]&1));
               if((fdc_track_x2[fdc_drive] & 1) == 0) laser_get_track();
            }
            else
            if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI3(fdc_latch)) ||
               (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI0(fdc_latch)) ||
               (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI1(fdc_latch)) ||
               (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI2(fdc_latch)) )
            {
               if(fdc_track_x2[fdc_drive] < 2*40) fdc_track_x2[fdc_drive]++;
               console.log("laser_fdc_w(%d) $%02X drive %d: stepin track #%2d.%d\n", offset, data, fdc_drive, fdc_track_x2[fdc_drive]/2,5*(fdc_track_x2[fdc_drive]&1));
               if((fdc_track_x2[fdc_drive] & 1) == 0) laser_get_track();
            }
            if((data & 0x40) == 0) {
               fdc_data <<= 1;
               if((fdc_latch ^ data) & 0x20) fdc_data |= 1;
               if((fdc_edge ^= 1) == 0) {
                  if(--fdc_bits == 0) {
                     let value = 0; // uint8
                     fdc_data &= 0xffff;
                     if( fdc_data & 0x4000 ) value |= 0x80;
                     if( fdc_data & 0x1000 ) value |= 0x40;
                     if( fdc_data & 0x0400 ) value |= 0x20;
                     if( fdc_data & 0x0100 ) value |= 0x10;
                     if( fdc_data & 0x0040 ) value |= 0x08;
                     if( fdc_data & 0x0010 ) value |= 0x04;
                     if( fdc_data & 0x0004 ) value |= 0x02;
                     if( fdc_data & 0x0001 ) value |= 0x01;
                     console.log("laser_fdc_w(%d) data($%04X) $%02X <- $%02X ($%04X)\n", offset, fdc_offs, fdc_buffer[fdc_offs], value, fdc_data);
                     fdc_buffer[fdc_offs] = value;
                     fdc_offs = (fdc_offs + 1) % TRKSIZE_FM;
                     fdc_write++;
                     fdc_bits = 8;
                  }
               }
            }
            // change of write signal? 
            if((fdc_latch ^ data) & 0x40) {
               // falling edge? 
               if(fdc_latch & 0x40) {
                  //console.log(fdc_frame_message, "#%d put track %02d", fdc_drive, fdc_track_x2[fdc_drive]/2);                  
                  fdc_start = fdc_offs;
                  fdc_edge = 0;
               }
               else
               {
                  // data written to track before? 
                  if( fdc_write ) laser_put_track();
               }
               fdc_bits = 8;
               fdc_write = 0;
            }
         }
         fdc_latch = data;
         break;
	}
}

// reads an entire track and puts into the controller buffer
// ---------------------------------------------------------
//
function laser_get_track()
{
	//sprintf(fdc_frame_message, "#%d get track %02d", fdc_drive, fdc_track_x2[fdc_drive]/2);
	fdc_frame_time = 30;

	// drive selected or and image file ok? 
	if(fdc_drive >= 0 /*&& fdc_floppies[fdc_drive].found()*/)
	{
      const floppy = fdc_floppies[fdc_drive];		
		const size = TRKSIZE_VZ;
      const offs = TRKSIZE_VZ * fdc_track_x2[fdc_drive]/2;
      const buffer = fdc_buffer[fdc_drive];
      
      for(let t=0; t<size; t++) {
         buffer[t] = floppy[offs+t];
      }

		// logerror("get track @$%05x $%04x bytes\n", offs, size);
	}
	fdc_offs = 0;
	fdc_write = 0;
}

// write bytes on the floppy from the controller buffer
// ------------------------------------------------------------------
// fdc_buffer[]              buffer containing the data (one track)
// fdc_start               starting address within the buffer and within the track
// fdc_write               number of bytes to write
// fdc_track_x2[fdc_drive] track to write to

function laser_put_track()
{
	// drive selected and image file ok? 
	if(fdc_drive >= 0 /*&& fdc_floppies[fdc_drive].found()*/)
	{
      // gets the floppy in the drive
      const floppy = fdc_floppies[fdc_drive];
      
      // calculate offset at current track, note track is multiplie by two
      const offs = TRKSIZE_VZ * fdc_track_x2[fdc_drive]/2;
      const size = fdc_write; // number of bytes to write

      // do the actual write
      for(let t=0; t<size; t++) {
         const b = fdc_buffer[fdc_start + t];
         floppy[offs + fdc_start + t] = b;
      }		      
		//logerror("put track @$%05X+$%X $%04X/$%04X bytes\n", offs, fdc_start, size, fdc_write);
	}
}
