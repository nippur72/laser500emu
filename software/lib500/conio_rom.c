void move_cursor(byte x, byte y) {
   word address = (word) get_cursor_address(x,y);
   poke(CURSOR_ROW, x);
   poke(CURSOR_COL, y);
   poke_word(CURSOR_ADDRESS, address);
}

void rom_prints(char *pippo) FASTNAKED {
   __asm
   push af
   push bc
   push de
   call 0x62D3
   pop  de
   pop  bc
   pop  af
   ret
   __endasm;
}

void rom_putc(byte c) FASTNAKED {
   __asm
   ld a, l
   jp 0x57D9
   __endasm;
}

byte rom_getc() FASTNAKED {
   __asm
   push af
   push bc
   push de
   call 0x58F0
   ld l,a
   ld h,0
   pop de
   pop bc
   pop af
   ret
   __endasm;
}

byte rom_kbhit() FASTNAKED {
   __asm
   push bc
   push de

   di
   ld a, 2
   out (0x41), a

   call 0x05CA

   ld l, a
   ld h, 0

   ld a, 1
   out (0x41), a
   ei

   pop de
   pop bc
   ret
   __endasm;
}

void rom_bell() FASTNAKED {
   __asm
      jp 0x09E2   ; and ret there
   __endasm;
}

void rom_cls() FASTNAKED {
   __asm
   di
   ld a, 7
   out (0x41), a

   call 0x04D0

   ld a, 1
   out (0x41), a
   ei
   ret
   __endasm;
}

void rom_set_text_40() FASTNAKED {
   __asm
   di
   ld a, 7
   out (0x41), a

   call 0x045E

   ld a, 1
   out (0x41), a
   ei
   ret
   __endasm;
}

void rom_set_text_80() FASTNAKED {
   __asm
   di
   ld a, 7
   out (0x41), a

   call 0x0445

   ld a, 1
   out (0x41), a
   ei
   ret
   __endasm;
}

void set_cursor_flash(byte enable) {
   byte v = peek(CURSOR_STATUS);
   if(enable) v |= 0b100000;
   else v &= ~0b100000;
   poke(CURSOR_STATUS, v);
}

void rom_set_keyboard_beep(byte enable) {
   byte v = peek(CURSOR_STATUS);
   if(enable) v &= ~0b1000; // bit 3 = 0 -> beep on
   else v |= 0b1000;        // bit 3 = 1 -> beep off (muted)
   poke(CURSOR_STATUS, v);
}

void set_keyboard_beep(byte enable) {
   rom_set_keyboard_beep(enable);
}

word *get_cursor_address(byte x, byte y) {
   //word z = (word) (y >> 3) * 80;
   word z = (word) ((y & 0xF8)<<1)*5;
   word k = (word) (y & 0x7) << 8;
   word add = 0x7800 + z + k + (isText80() ? x : x*2);
   return (word *)add;
}
