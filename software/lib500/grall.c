void gr_mem_fill(byte value) FASTNAKED {
   __asm

   ; save value
   ld a, l

   ; HL = start video memory
   ld hl, 0x4000

   ; DE = HL + 1
   ld e,l
   ld d,h
   inc de

   ; initialise first byte of block
   ld (hl), a

   ; BC = length of block in bytes, HL+BC-1 = end address of block

   ld bc, 0x4000

   ; fill memory
   ldir

   ret
   __endasm;
}

// sets graphic mode
void gr_mode(byte mode) {
   byte io = mapped_io_read();

   if(mode == GR_MODE_OFF) {
      // turn off graphic mode
      mapped_io_write(io & 0b11110111);

      // set previous text mode
      set_text_mode(isText80());
   } else {
      // turn on graphic mode
      mapped_io_write(io | 0b1000);

      // sets specific mode
      byte latch = (peek(PORT_44_LATCH) & 0b11111000) | mode;
      outport(0x44, latch);
      poke(PORT_44_LATCH, latch);
   }
}

// TODO find ROM's one
void set_background(byte c) FASTCALL {
   byte v = (peek(PORT_45_LATCH) & 0xF0) | (c & 0x0F);
   outport(0x45, v);
   poke(PORT_45_LATCH, v);
}

// TODO find ROM's one
void set_foreground(byte c) {
   byte v = (peek(PORT_45_LATCH) & 0x0F) | (c<<4);
   outport(0x45, v);
   poke(PORT_45_LATCH, v);
}

// TODO find ROM's one
void set_border(byte c) {
   byte v = (peek(PORT_44_LATCH) & 0x0F) | (c<<4);
   outport(0x44, v);
   poke(PORT_44_LATCH, v);
}

byte isText80() {
   // return *((byte *)PORT_44_LATCH) & 1;
   return *((byte *)TEXT_80);
}

void set_text_mode(byte mode) FASTCALL {
   poke(TEXT_80, mode);
   byte latch = (peek(PORT_44_LATCH) & 0xFE) | mode;
   poke(PORT_44_LATCH, latch);
   outport(0x44, latch);
}

