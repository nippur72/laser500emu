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

void rom_bell() FASTNAKED {
   __asm
      jp 0x09E2   ; and ret there
   __endasm;
}

void cls() {
   rom_putc(CLS);
}

word *get_cursor_address(byte x, byte y) {
   //word z = (word) (y >> 3) * 80;
   word z = (word) ((y & 0xF8)<<1)*5;
   word k = (word) (y & 0x7) << 8;
   word add = 0x7800 + z + k + (isText80() ? x : x*2);
   return (word *)add;
}
