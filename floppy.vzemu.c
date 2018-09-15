//---------------------------------------------------------------
//
//               VZDIO Disk Emulation Routines
//
// These routines are taken from the video technology MESS driver
// by Juergen Buchmueller
//
//---------------------------------------------------------------


#define TRKSIZE_VZ      0x9a0   /* arbitrary (actually from analyzing format) */
#define TRKSIZE_FM      3172    /* size of a standard FM mode track */

static void *vtech1_fdc_file[2] = {NULL, NULL};
static byte vtech1_track_x2[2] = {80, 80};
static byte vtech1_fdc_wrprot[2] = {0x80, 0x80};
static byte vtech1_fdc_status = 0;
static byte vtech1_fdc_data[TRKSIZE_FM];

static int vtech1_data;

static int vtech1_fdc_edge = 0;
static int vtech1_fdc_bits = 8;
static int vtech1_drive = -1;
static int vtech1_fdc_start = 0;
static int vtech1_fdc_write = 0;
static int vtech1_fdc_offs = 0;
static int vtech1_fdc_latch = 0;


int vtech1_floppy_init(int id, char *s)
{
    /* first try to open existing image RW */
    vtech1_fdc_wrprot[id] = 0x00;
    vtech1_fdc_file[id] = fopen(s,"rb+");
    /* failed? */
    if( !vtech1_fdc_file[id] )
    {
	 /* try to open existing image RO */
	 vtech1_fdc_wrprot[id] = 0x80;
         vtech1_fdc_file[id] = fopen(s,"rb");
    }
	
    /* failed? */
    if( !vtech1_fdc_file[id] )
    {
	 /* create new image RW */
	 vtech1_fdc_wrprot[id] = 0x00;
         vtech1_fdc_file[id] = fopen(s,"wb+");
    }
    if( vtech1_fdc_file[id] )
	 return 0;
	/* failed permanently */
    return 1;
}

void vtech1_floppy_exit(int id)
{
   if( vtech1_fdc_file[id] )
	   fclose(vtech1_fdc_file[id]);
   vtech1_fdc_file[id] = NULL;
}

static void vtech1_get_track(void)
{
    //sprintf(vtech1_frame_message, "#%d get track %02d", vtech1_drive, vtech1_track_x2[vtech1_drive]/2);
    //vtech1_frame_time = 30;
    /* drive selected or and image file ok? */
    if( vtech1_drive >= 0 && vtech1_fdc_file[vtech1_drive] != NULL )
    {
	int size, offs;
	size = TRKSIZE_VZ;
	offs = TRKSIZE_VZ * vtech1_track_x2[vtech1_drive]/2;
	fseek(vtech1_fdc_file[vtech1_drive], offs, SEEK_SET);
	size = fread(&vtech1_fdc_data, size, 1, vtech1_fdc_file[vtech1_drive]);
    }
    vtech1_fdc_offs = 0;
    vtech1_fdc_write = 0;
}

static void vtech1_put_track(void)
{
    /* drive selected and image file ok? */
    if( vtech1_drive >= 0 && vtech1_fdc_file[vtech1_drive] != NULL )
    {
	int size, offs;
	offs = TRKSIZE_VZ * vtech1_track_x2[vtech1_drive]/2;
	fseek(vtech1_fdc_file[vtech1_drive], offs + vtech1_fdc_start, SEEK_SET);
	size = fwrite(&vtech1_fdc_data[vtech1_fdc_start],1, vtech1_fdc_write,vtech1_fdc_file[vtech1_drive]);
    }
}

#define PHI0(n) (((n)>>0)&1)
#define PHI1(n) (((n)>>1)&1)
#define PHI2(n) (((n)>>2)&1)
#define PHI3(n) (((n)>>3)&1)

int vtech1_fdc_r(int offset)
{
    int data = 0xff;
    switch( offset )
    {
    case 1: /* data (read-only) */
	   if( vtech1_fdc_bits > 0 )
	   {
	       if( vtech1_fdc_status & 0x80 )
		   vtech1_fdc_bits--;
	       data = (vtech1_data >> vtech1_fdc_bits) & 0xff;
	   }
	   if( vtech1_fdc_bits == 0 )
	   {
	       vtech1_data = vtech1_fdc_data[vtech1_fdc_offs];
	       if( vtech1_fdc_status & 0x80 )
	       {
		   vtech1_fdc_bits = 8;
		   vtech1_fdc_offs = ++vtech1_fdc_offs % TRKSIZE_FM;
	       }
	       vtech1_fdc_status &= ~0x80;
	   }
	   break;
    case 2: /* polling (read-only) */
	   /* fake */
	   if( vtech1_drive >= 0 )
	       vtech1_fdc_status |= 0x80;
	   data = vtech1_fdc_status;
	   break;
    case 3: /* write protect status (read-only) */
	   if( vtech1_drive >= 0 )
	       data = vtech1_fdc_wrprot[vtech1_drive];
	   break;
    }
    return data;
}

void vtech1_fdc_w(int offset, int data)
{
    int drive;

    switch( offset )
    {
	case 0: /* latch (write-only) */
		drive = (data & 0x10) ? 0 : (data & 0x80) ? 1 : -1;
		if( drive != vtech1_drive )
		{
		   vtech1_drive = drive;
		   if( vtech1_drive >= 0 )
		       vtech1_get_track();
		}
		if( vtech1_drive >= 0 )
		{
		   if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI1(vtech1_fdc_latch)) ||
		       (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI2(vtech1_fdc_latch)) ||
		       (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI3(vtech1_fdc_latch)) ||
		       (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI0(vtech1_fdc_latch)) )
		   {
		       if( vtech1_track_x2[vtech1_drive] > 0 )
			   vtech1_track_x2[vtech1_drive]--;
		       if( (vtech1_track_x2[vtech1_drive] & 1) == 0 )
			   vtech1_get_track();
		   }
		   else
		       if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI3(vtech1_fdc_latch)) ||
			   (PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI0(vtech1_fdc_latch)) ||
			   (PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI1(vtech1_fdc_latch)) ||
			   (PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI2(vtech1_fdc_latch)) )
		       {
			   if( vtech1_track_x2[vtech1_drive] < 2*40 )
			       vtech1_track_x2[vtech1_drive]++;
			   if( (vtech1_track_x2[vtech1_drive] & 1) == 0 )
			       vtech1_get_track();
		       }
		  if( (data & 0x40) == 0 )
		  {
		       vtech1_data <<= 1;
		       if( (vtech1_fdc_latch ^ data) & 0x20 )
			    vtech1_data |= 1;
		       if( (vtech1_fdc_edge ^= 1) == 0 )
		       {
			   if( --vtech1_fdc_bits == 0 )
			   {
			       byte value = 0;
			       vtech1_data &= 0xffff;
			       if( vtech1_data & 0x4000 ) value |= 0x80;
			       if( vtech1_data & 0x1000 ) value |= 0x40;
			       if( vtech1_data & 0x0400 ) value |= 0x20;
			       if( vtech1_data & 0x0100 ) value |= 0x10;
			       if( vtech1_data & 0x0040 ) value |= 0x08;
			       if( vtech1_data & 0x0010 ) value |= 0x04;
			       if( vtech1_data & 0x0004 ) value |= 0x02;
			       if( vtech1_data & 0x0001 ) value |= 0x01;
			       vtech1_fdc_data[vtech1_fdc_offs] = value;
			       vtech1_fdc_offs = ++vtech1_fdc_offs % TRKSIZE_FM;
			       vtech1_fdc_write++;
			       vtech1_fdc_bits = 8;
			   }
		       }
		  }
		  /* change of write signal? */
		  if( (vtech1_fdc_latch ^ data) & 0x40 )
		  {
		       /* falling edge? */
		      if ( vtech1_fdc_latch & 0x40 )
		      {
			  //sprintf(vtech1_frame_message, "#%d put track //%02d", vtech1_drive, vtech1_track_x2[vtech1_drive]/2);
			  //vtech1_frame_time = 30;
			  vtech1_fdc_start = vtech1_fdc_offs;
			  vtech1_fdc_edge = 0;
		      }
		      else
		      {
			  /* data written to track before? */
			  if( vtech1_fdc_write )
			      vtech1_put_track();
		      }
		      vtech1_fdc_bits = 8;
		      vtech1_fdc_write = 0;
		  }
	     }
	     vtech1_fdc_latch = data;
	     break;
    }
}
