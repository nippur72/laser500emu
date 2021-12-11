word gr3_rowaddress[192] = {
   0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,
};

void gr3_rowinit() {
   register word hl;
   register word *bc;
   bc = gr3_rowaddress;
   for(hl=0; hl<192; ++hl, ++bc) {
      *bc = gr3_getrow(hl);
   }
}

word gr3_getrow(byte row) FASTNAKED {
   __asm

   ld   e, l

   ld   a, e         ; a = e;
   and  0b11000000   ; a = a & 0b11000000;
   ld   l, a         ; l = a;

   rra
   rra               ; a = a >> 2;
   add  a, l         ; a = a + l;
   ld   l, a         ; l = a;

   ld   a, e         ; a = r;
   and  0b111000     ; a = a & 0b111000;
   rra
   rra
   rra               ; a = a >> 3;
   ld   h, a         ; h = a;

   ld   a, e         ; a = r;
   and  0b111        ; a = a & 0b111;
   rla
   rla
   rla               ; a = a << 3;
   add  h            ; a = a + h;
   ld   h, a         ; h = a;

   ret
   __endasm;
}

/*
void gr3_pset(byte col, byte row, byte color) {
   word row_address = gr3_getrow(row);
   word x = col >> 1;
   word address = 0x4000 + row_address + x;
   byte old = peek(address);
   if(col % 2 == 0) old = old & 0xF0 | color;
   else             old = old & 0x0F | (color << 4);
   poke(address, old);
}
*/

// TODO is it different between SDCC and ZCC?
void gr3_pset(byte col, byte row, byte color) NAKED {
   __asm
   ld   ix, 0
   add  ix, sp       ; ix+0:ret, ix+2:color, ix+4:row, ix+6:col

   ld   l, (ix+4)     ; load row
   ld   h, 0          ; HL = row

   push hl
   call _gr3_getrow
   pop  bc          ; HL = row address

   ld   de, 0x4000  ;
   add  hl, de      ; HL = row_address + 0x4000

   ld   a, (ix+6)   ;
   ld   c, a        ; c = col
   rra              ; a = col >> 1

   ld   e, a
   ld   d, 0        ; de = col >> 1

   add  hl, de      ; HL = 0x4000 + row_address + (col >> 1)

check_column_odd:
   bit  0, c
   jr   nz, col_odd

col_even:
   ld  a, (hl)
   and 0xF0
   or  (ix+2)
   jr  gr3_pset_end

col_odd:
   ld  a, (ix+2)   ; color
   rla
   rla
   rla
   rla
   ld  e, a        ; e = color << 4
   ld  a, (hl)
   and 0x0F
   or  e

gr3_pset_end:
   ld  (hl),a
   ret

   __endasm;
}

// display full screen bitmap ad address HL
void gr3_put_bitmap(word picAddress) FASTNAKED
{
   __asm

   EXTERN gr3_getrow

   ld   ixl, 0      ; ix = row

show_loop:
   push  hl         ; hl = address of pic

   ld   a, ixl
   ld   l, a

   ; calculate dest row address
   call _gr3_getrow
   ld   de, 0x4000
   add  hl, de
   ex   de, hl
   ld   bc, 80
   pop  hl

   ; bitmap copy
   ldir

   ; increment row to max 192 rows
   inc  ixl
   ld   a, ixl
   cp   192
   jr   nz, show_loop

   ret

   __endasm;

   /*
   byte *hl = pic;
   for(byte row=0; row<192; row++)
   {
      word dest = 0x4000 + gr3_getrow(row);
      for(byte col=0; col<80; col++,hl++,dest++)
      {
         poke(dest, *hl);
      }
   }
   */
}
