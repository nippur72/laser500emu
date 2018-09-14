#define TRKSIZE_FM  3172    /* size of a standard FM mode track */

uint8_t m_laser_track_x2[2];
	uint8_t m_laser_fdc_status;
	uint8_t m_laser_fdc_data[TRKSIZE_FM];
	int m_laser_data;
	int m_laser_fdc_edge;
	int m_laser_fdc_bits;
	int m_laser_drive;
	int m_laser_fdc_start;
	int m_laser_fdc_write;
	int m_laser_fdc_offs;
   int m_laser_fdc_latch;
   
map(0x10, 0x1f).rw(FUNC(vtech2_state::laser_fdc_r), FUNC(vtech2_state::laser_fdc_w));

void vtech2_state::laser_get_track()
{
	sprintf(m_laser_frame_message, "#%d get track %02d", m_laser_drive, m_laser_track_x2[m_laser_drive]/2);
	m_laser_frame_time = 30;
	/* drive selected or and image file ok? */
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

void vtech2_state::laser_put_track()
{
	/* drive selected and image file ok? */
	if( m_laser_drive >= 0 && m_laser_file[m_laser_drive].found() )
	{
		device_image_interface &image = *m_laser_file[m_laser_drive];
		int offs = TRKSIZE_VZ * m_laser_track_x2[m_laser_drive]/2;
		image.fseek(offs + m_laser_fdc_start, SEEK_SET);
		int size = image.fwrite(&m_laser_fdc_data[m_laser_fdc_start], m_laser_fdc_write);
		logerror("put track @$%05X+$%X $%04X/$%04X bytes\n", offs, m_laser_fdc_start, size, m_laser_fdc_write);
	}
}

#define PHI0(n) (((n)>>0)&1)
#define PHI1(n) (((n)>>1)&1)
#define PHI2(n) (((n)>>2)&1)
#define PHI3(n) (((n)>>3)&1)

READ8_MEMBER(vtech2_state::laser_fdc_r)
{
	int data = 0xff;
	switch( offset )
	{
	case 1: /* data (read-only) */
		if( m_laser_fdc_bits > 0 )
		{
			if( m_laser_fdc_status & 0x80 )
				m_laser_fdc_bits--;
			data = (m_laser_data >> m_laser_fdc_bits) & 0xff;
#if 0
			logerror("laser_fdc_r bits %d%d%d%d%d%d%d%d\n",
				(data>>7)&1,(data>>6)&1,(data>>5)&1,(data>>4)&1,
				(data>>3)&1,(data>>2)&1,(data>>1)&1,(data>>0)&1 );
#endif
		}
		if( m_laser_fdc_bits == 0 )
		{
			m_laser_data = m_laser_fdc_data[m_laser_fdc_offs];
			logerror("laser_fdc_r %d : data ($%04X) $%02X\n", offset, m_laser_fdc_offs, m_laser_data);
			if( m_laser_fdc_status & 0x80 )
			{
				m_laser_fdc_bits = 8;
				m_laser_fdc_offs = (m_laser_fdc_offs + 1) % TRKSIZE_FM;
			}
			m_laser_fdc_status &= ~0x80;
		}
		break;
	case 2: /* polling (read-only) */
		/* fake */
		if( m_laser_drive >= 0 )
			m_laser_fdc_status |= 0x80;
		data = m_laser_fdc_status;
		break;
	case 3: /* write protect status (read-only) */
		if( m_laser_drive >= 0 )
			data = laser_fdc_wrprot[m_laser_drive];
		logerror("laser_fdc_r %d : write_protect $%02X\n", offset, data);
		break;
	}
	return data;
}

WRITE8_MEMBER(vtech2_state::laser_fdc_w)
{
	int drive;

	switch( offset )
	{
	case 0: /* latch (write-only) */
		drive = (data & 0x10) ? 0 : (data & 0x80) ? 1 : -1;
		if( drive != m_laser_drive )
		{
			m_laser_drive = drive;
			if( m_laser_drive >= 0 )
				laser_get_track();
		}
		if( m_laser_drive >= 0 )
		{
			if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI1(m_laser_fdc_latch)) ||
				(PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI2(m_laser_fdc_latch)) ||
				(PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI3(m_laser_fdc_latch)) ||
				(PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI0(m_laser_fdc_latch)) )
			{
				if( m_laser_track_x2[m_laser_drive] > 0 )
					m_laser_track_x2[m_laser_drive]--;
				logerror("laser_fdc_w(%d) $%02X drive %d: stepout track #%2d.%d\n", offset, data, m_laser_drive, m_laser_track_x2[m_laser_drive]/2,5*(m_laser_track_x2[m_laser_drive]&1));
				if( (m_laser_track_x2[m_laser_drive] & 1) == 0 )
					laser_get_track();
			}
			else
			if( (PHI0(data) && !(PHI1(data) || PHI2(data) || PHI3(data)) && PHI3(m_laser_fdc_latch)) ||
				(PHI1(data) && !(PHI0(data) || PHI2(data) || PHI3(data)) && PHI0(m_laser_fdc_latch)) ||
				(PHI2(data) && !(PHI0(data) || PHI1(data) || PHI3(data)) && PHI1(m_laser_fdc_latch)) ||
				(PHI3(data) && !(PHI0(data) || PHI1(data) || PHI2(data)) && PHI2(m_laser_fdc_latch)) )
			{
				if( m_laser_track_x2[m_laser_drive] < 2*40 )
					m_laser_track_x2[m_laser_drive]++;
				logerror("laser_fdc_w(%d) $%02X drive %d: stepin track #%2d.%d\n", offset, data, m_laser_drive, m_laser_track_x2[m_laser_drive]/2,5*(m_laser_track_x2[m_laser_drive]&1));
				if( (m_laser_track_x2[m_laser_drive] & 1) == 0 )
					laser_get_track();
			}
			if( (data & 0x40) == 0 )
			{
				m_laser_data <<= 1;
				if( (m_laser_fdc_latch ^ data) & 0x20 )
					m_laser_data |= 1;
				if( (m_laser_fdc_edge ^= 1) == 0 )
				{
					if( --m_laser_fdc_bits == 0 )
					{
						uint8_t value = 0;
						m_laser_data &= 0xffff;
						if( m_laser_data & 0x4000 ) value |= 0x80;
						if( m_laser_data & 0x1000 ) value |= 0x40;
						if( m_laser_data & 0x0400 ) value |= 0x20;
						if( m_laser_data & 0x0100 ) value |= 0x10;
						if( m_laser_data & 0x0040 ) value |= 0x08;
						if( m_laser_data & 0x0010 ) value |= 0x04;
						if( m_laser_data & 0x0004 ) value |= 0x02;
						if( m_laser_data & 0x0001 ) value |= 0x01;
						logerror("laser_fdc_w(%d) data($%04X) $%02X <- $%02X ($%04X)\n", offset, m_laser_fdc_offs, m_laser_fdc_data[m_laser_fdc_offs], value, m_laser_data);
						m_laser_fdc_data[m_laser_fdc_offs] = value;
						m_laser_fdc_offs = (m_laser_fdc_offs + 1) % TRKSIZE_FM;
						m_laser_fdc_write++;
						m_laser_fdc_bits = 8;
					}
				}
			}
			/* change of write signal? */
			if( (m_laser_fdc_latch ^ data) & 0x40 )
			{
				/* falling edge? */
				if ( m_laser_fdc_latch & 0x40 )
				{
					sprintf(m_laser_frame_message, "#%d put track %02d", m_laser_drive, m_laser_track_x2[m_laser_drive]/2);
					m_laser_frame_time = 30;
					m_laser_fdc_start = m_laser_fdc_offs;
					m_laser_fdc_edge = 0;
				}
				else
				{
					/* data written to track before? */
					if( m_laser_fdc_write )
						laser_put_track();
				}
				m_laser_fdc_bits = 8;
				m_laser_fdc_write = 0;
			}
		}
		m_laser_fdc_latch = data;
		break;
	}
}