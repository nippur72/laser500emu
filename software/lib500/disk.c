// ==== VT-DOS DISK ROUTINES ====

#pragma save
#pragma disable_warning 85
void set_drive(byte drive, byte side, byte track, byte sector) {
   *TRACK  = track;
   *SECTOR = sector;
   //*SIDE   = side;
}
#pragma restore

byte read_track() NAKED {
   __asm
   di
   ld  a,6
   out ($41),a

   ld   b,1
   call READ_WRITE_SEC_DATA
   ld   l,a

   ld   a,1
   out  ($41),a
   ei

   ld   h,0
   __endasm;
}

byte write_track() NAKED {
   __asm
   di
   ld   a,6
   out  ($41),a

   ld   b,0
   call READ_WRITE_SEC_DATA
   ld   l,a

   ld   a,1
   out  ($41),a
   ei

   ld   h,0
   __endasm;
}
