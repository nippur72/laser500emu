// sets the reset handler and its checksum value (copied from ROM)
void set_reset_handler(void *handler) FASTNAKED
{
   __asm
      push    hl     ; copies HL into DE
      pop     de     ;

      ; sets the RESET_PTR and RESET_WARM_FLAG
      ld      hl, RESET_PTR
      ld      (hl), e
      inc     hl
      ld      (hl), d
      inc     hl
      ld      a,d
      add     a,e
      add     a, RESET_CHECKSUM_VALUE
      ld      (hl), a
      ret
   __endasm;
}

INLINE byte peek(byte *address) {
   return *address;
}

INLINE void poke(byte *address, byte value) {
   *address = value;
}

INLINE word peek_word(word *address) {
   return *address;
}

INLINE void poke_word(word *address, word value) {
   *address = value;
}

void mapped_io_write(byte value) FASTCALL {
   SLOT1_IO_START();
   poke(MAPPED_IO_ADDR, value);
   poke(IO_LATCH,value);
   SLOT1_END();
}

byte mapped_io_read() {
   SLOT1_IO_START();
   byte value = peek(MAPPED_IO_ADDR);
   SLOT1_END();
   return value;
}

void outport(byte port, byte value) {
   #ifdef SDCC
   // [sp+0] retaddress
   // [sp+2] port
   // [sp+3] value
   __asm
   ld   hl,3
   add  hl,sp
   ld   a,(hl)        // value
   ld   hl,2
   add  hl,sp
   ld   c,(hl)        // port
   out  (c),a
	__endasm;
   #endif

   #ifdef ZCC
   // [sp+0] retaddress
   // [sp+2] value
   // [sp+4] port
   __asm
   ld   hl,2
   add  hl,sp
   ld   a,(hl)        // value
   ld   hl,4
   add  hl,sp
   ld   c,(hl)        // port
   out  (c),a
	__endasm;
   #endif
}

void screen_poke(byte *add, byte c) {
   __asm
   di
   __endasm;
   outport(0x41, 7);
   *add = c;
   outport(0x41, 1);
   __asm
   ei
   __endasm;
}

INLINE void SLOT1_IO_START() {
   __asm
   di
   ld a, 2             ; IO (BANK 2)
   out (0x41), a
   __endasm;
}

INLINE void SLOT1_VIDEO_START() {
   __asm
   di
   ld a, 7             ; IO (BANK 2)
   out (0x41), a
   __endasm;
}

INLINE void SLOT1_END() {
   __asm
   ld a, 1            ; ROM (BANK 1)
   out (0x41), a
   ei
   __endasm;
}

