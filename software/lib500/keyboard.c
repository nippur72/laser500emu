byte keyboard_hit() FASTNAKED {
   __asm
   di

   ld a, 2
   out (0x41), a

   ; assume key is hit
   ld hl, 1

   ld b, 0xff
   call inner

   ld a, 1
   out (0x41), a

   ei
   ret

inner:
   ld a, (0x68fe)
   cp b
   ret nz

   ld a, (0x68fd)
   cp b
   ret nz

   ld a, (0x68fb)
   cp b
   ret nz

   ld a, (0x68f7)
   cp b
   ret nz

   ld a, (0x68ef)
   cp b
   ret nz

   ld a, (0x68bf)
   cp b
   ret nz

   ld a, (0x687f)
   cp b
   ret nz

   ld a, (0x69ff)
   cp b
   ret nz

   ld a, (0x6aff)
   cp b
   ret nz

   ld a, (0x6bff)
   cp b
   ret nz

   ; row 5 is special because bit 5,4 contains french and german layout bit
   ld a, (0x68df)
   or 0x30
   cp b
   ret nz

   ; no key was hit
   ld hl, 0
   ret

   __endasm;
}

/*
byte keyboard_hit() FASTNAKED {
   __asm
   di

   ld a, 2
   out (0x41), a

   call keyboard_hit_inner

   ld a, 1
   out (0x41), a

   ld h, e        ; return value hl = d  (e is zero)
   ld l, d

   ei
   ret

keyboard_hit_inner:
   ld hl, rows    ; point to key row table
   ld d, 1        ; return value 1=hit 0=not hit
   ld e, 0x30     ; OR value for the first row only (KDA5/KDB5-4 contain french/german bit)
   ld b, 10       ; key row table length
   ld c, 0xff     ; value to check for 0xff = no key hit

   loop:
      ld a, (hl)  ; read keyboard row
      or e        ; OR for KDA5 keyboard layout
      cp c        ;
      ret nz      ; if not 0xff then return (with d=1)
      ld e, 0     ; clears the KDA5 or value
      inc hl      ; next row
      inc hl      ;
      djnz loop   ; repeats

   ld d, 0        ; all passed, no key way hit, return d=0
   ret

rows:
   defw 0x68fe, 0x68fd, 0x68fb, 0x68f7, 0x68ef, 0x68bf, 0x687f, 0x69ff, 0x6aff, 0x6bff, 0x68df

   __endasm;
}
*/

// row: keyboard row address
// col: negated column
byte mapped_io_key_test(word row, byte col) {
   SLOT1_IO_START();
   byte c = peek((byte *)row);
   SLOT1_END();
   return ((c|col) ^ 0xFF) != 0;
}
