const TRKSIZE_FM = 3172;    // size of a standard FM mode track 

let m_laser_track_x2 = new Uint8Array(2);
let m_laser_fdc_status; // uint8
let m_laser_fdc_data = new Uint8Array(TRKSIZE_FM);
let m_laser_data;       // int
let m_laser_fdc_edge;   // int
let m_laser_fdc_bits;   // int
let m_laser_drive;      // int
let m_laser_fdc_start;  // int
let m_laser_fdc_write;  // int
let m_laser_fdc_offs;   // int
let m_laser_fdc_latch;  // int

//m_laser_file //;

const laser_fdc_wrprot = new Uint8Array(0x80, 0x80);

// drives are mapped from port 0x10 to 0x1f

function PHI0(n) { return (((n)>>0)&1); }
function PHI1(n) { return (((n)>>1)&1); }
function PHI2(n) { return (((n)>>2)&1); }
function PHI3(n) { return (((n)>>3)&1); }

/*
init
m_laser_track_x2[0] = m_laser_track_x2[1] = 80;
m_laser_fdc_bits = 8;
m_laser_drive = -1;
*/

// returns uint8
function laser_fdc_r(offset)
{
	let data = 0xff;
	switch(offset)
	{
	   case 1: // data (read-only) 
         if(m_laser_fdc_bits > 0) {
            if( m_laser_fdc_status & 0x80 ) m_laser_fdc_bits--;
            data = (m_laser_data >> m_laser_fdc_bits) & 0xff;         
            //logerror("laser_fdc_r bits %d%d%d%d%d%d%d%d\n",
            //	(data>>7)&1,(data>>6)&1,(data>>5)&1,(data>>4)&1,
            //   (data>>3)&1,(data>>2)&1,(data>>1)&1,(data>>0)&1 );            
         }
         if(m_laser_fdc_bits == 0) {
            m_laser_data = m_laser_fdc_data[m_laser_fdc_offs];
            // logerror("laser_fdc_r %d : data ($%04X) $%02X\n", offset, m_laser_fdc_offs, m_laser_data);
            if(m_laser_fdc_status & 0x80) {
               m_laser_fdc_bits = 8;
               m_laser_fdc_offs = (m_laser_fdc_offs + 1) % TRKSIZE_FM;
            }
            m_laser_fdc_status &= ~0x80;
         }
         break;
      case 2: // polling (read-only)
         // fake
         if(m_laser_drive >= 0) m_laser_fdc_status |= 0x80;
         data = m_laser_fdc_status;
         break;
      case 3: // write protect status (read-only) 
         if(m_laser_drive >= 0) data = laser_fdc_wrprot[m_laser_drive];
         console.log(`laser_fdc_r ${offset} : write_protect $${hex(data)}`);
         break;
      default:
         console.log("unknown disk read");
	}
	return data;
}

function laser_fdc_w(offset, data)
{
	let drive;

	switch(offset) {
      case 0: // latch (write-only) 
         drive = (data & 0x10) ? 0 : (data & 0x80) ? 1 : -1;
         if(drive != m_laser_drive )
         {
            m_laser_drive = drive;
            if(m_laser_drive >= 0) laser_get_track();
         }
         if(m_laser_drive >= 0)
         {
            if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI1(m_laser_fdc_latch)) ||
               (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI2(m_laser_fdc_latch)) ||
               (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI3(m_laser_fdc_latch)) ||
               (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI0(m_laser_fdc_latch)) )
            {
               if(m_laser_track_x2[m_laser_drive] > 0) m_laser_track_x2[m_laser_drive]--;
               console.log("laser_fdc_w(%d) $%02X drive %d: stepout track #%2d.%d\n", offset, data, m_laser_drive, m_laser_track_x2[m_laser_drive]/2,5*(m_laser_track_x2[m_laser_drive]&1));
               if((m_laser_track_x2[m_laser_drive] & 1) == 0) laser_get_track();
            }
            else
            if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI3(m_laser_fdc_latch)) ||
               (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI0(m_laser_fdc_latch)) ||
               (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI1(m_laser_fdc_latch)) ||
               (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI2(m_laser_fdc_latch)) )
            {
               if(m_laser_track_x2[m_laser_drive] < 2*40) m_laser_track_x2[m_laser_drive]++;
               console.log("laser_fdc_w(%d) $%02X drive %d: stepin track #%2d.%d\n", offset, data, m_laser_drive, m_laser_track_x2[m_laser_drive]/2,5*(m_laser_track_x2[m_laser_drive]&1));
               if((m_laser_track_x2[m_laser_drive] & 1) == 0) laser_get_track();
            }
            if((data & 0x40) == 0) {
               m_laser_data <<= 1;
               if((m_laser_fdc_latch ^ data) & 0x20) m_laser_data |= 1;
               if((m_laser_fdc_edge ^= 1) == 0) {
                  if(--m_laser_fdc_bits == 0) {
                     let value = 0; // uint8
                     m_laser_data &= 0xffff;
                     if( m_laser_data & 0x4000 ) value |= 0x80;
                     if( m_laser_data & 0x1000 ) value |= 0x40;
                     if( m_laser_data & 0x0400 ) value |= 0x20;
                     if( m_laser_data & 0x0100 ) value |= 0x10;
                     if( m_laser_data & 0x0040 ) value |= 0x08;
                     if( m_laser_data & 0x0010 ) value |= 0x04;
                     if( m_laser_data & 0x0004 ) value |= 0x02;
                     if( m_laser_data & 0x0001 ) value |= 0x01;
                     console.log("laser_fdc_w(%d) data($%04X) $%02X <- $%02X ($%04X)\n", offset, m_laser_fdc_offs, m_laser_fdc_data[m_laser_fdc_offs], value, m_laser_data);
                     m_laser_fdc_data[m_laser_fdc_offs] = value;
                     m_laser_fdc_offs = (m_laser_fdc_offs + 1) % TRKSIZE_FM;
                     m_laser_fdc_write++;
                     m_laser_fdc_bits = 8;
                  }
               }
            }
            // change of write signal? 
            if((m_laser_fdc_latch ^ data) & 0x40) {
               // falling edge? 
               if(m_laser_fdc_latch & 0x40) {
                  console.log(m_laser_frame_message, "#%d put track %02d", m_laser_drive, m_laser_track_x2[m_laser_drive]/2);
                  m_laser_frame_time = 30;
                  m_laser_fdc_start = m_laser_fdc_offs;
                  m_laser_fdc_edge = 0;
               }
               else
               {
                  // data written to track before? 
                  if( m_laser_fdc_write ) laser_put_track();
               }
               m_laser_fdc_bits = 8;
               m_laser_fdc_write = 0;
            }
         }
         m_laser_fdc_latch = data;
         break;
	}
}

function laser_get_track()
{
	sprintf(m_laser_frame_message, "#%d get track %02d", m_laser_drive, m_laser_track_x2[m_laser_drive]/2);
	m_laser_frame_time = 30;
	// drive selected or and image file ok? 
	if( m_laser_drive >= 0 && m_laser_file[m_laser_drive].found() )
	{
		device_image_interface &image = *m_laser_file[m_laser_drive];
		int size = TRKSIZE_VZ;
		int offs = TRKSIZE_VZ * m_laser_track_x2[m_laser_drive]/2;
		image.fseek(offs, SEEK_SET);
		size = image.fread(m_laser_fdc_data, size);
		logerror("get track @$%05x $%04x bytes\n", offs, size);
	}
	m_laser_fdc_offs = 0;
	m_laser_fdc_write = 0;
}

function laser_put_track()
{
	// drive selected and image file ok? 
	if( m_laser_drive >= 0 && m_laser_file[m_laser_drive].found() )
	{
		device_image_interface &image = *m_laser_file[m_laser_drive];
		int offs = TRKSIZE_VZ * m_laser_track_x2[m_laser_drive]/2;
		image.fseek(offs + m_laser_fdc_start, SEEK_SET);
		int size = image.fwrite(&m_laser_fdc_data[m_laser_fdc_start], m_laser_fdc_write);
		logerror("put track @$%05X+$%X $%04X/$%04X bytes\n", offs, m_laser_fdc_start, size, m_laser_fdc_write);
	}
}
