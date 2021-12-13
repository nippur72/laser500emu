// TODO optimize in assembly
void gr4_cls(byte background) {   
   SLOT1_VIDEO_START();
   for(int l=0;l<192;l++) {
      byte *ptr = (byte *) 0x4000 + gr3_getrow(l);
      for(int x=0;x<40;x++) {
         *ptr++ = 0;
         *ptr++ = background;
      }
   }
   SLOT1_END();
}

// fast cls/fill with pattern using LDIR
void gr4_fast_cls(byte pattern, byte color) {   
   SLOT1_VIDEO_START();      
   poke((byte *)0x4000, pattern);
   poke((byte *)0x4001, color);
   __asm
      ld hl,0x4000
      ld de,0x4002
      ld bc,16382
      ldir
   __endasm;   
   SLOT1_END();
}

/*
// unoptimized C version
#define gr4_tile(x,y,tile,color,tileset) _gr4_tile_x = (x); _gr4_tile_y = (y); _gr4_tile_tile = (tile); _gr4_tile_color = (color); _gr4_tile_tileset = (tileset); _gr4_tile()
byte _gr4_tile_x;
byte _gr4_tile_y;
byte _gr4_tile_tile;
byte _gr4_tile_color;
byte *_gr4_tile_tileset;

void _gr4_tile() {
   static byte *source;
   static byte *dest;

   source = &_gr4_tile_tileset[_gr4_tile_tile*8];
   dest = (byte *) 0x4000 + _gr4_tile_x*2 + gr3_rowaddress[_gr4_tile_y*8];

   for(byte l=8;l!=0;l--) {
      *dest++ = *source++;
      *dest = _gr4_tile_color;
      dest += 0x7FF;
   }
}
*/

// assembly optimized version
#define gr4_tile(x,y,tile,color,tileset) _gr4_tile_x = (x); _gr4_tile_y = (y); _gr4_tile_tile = (tile); _gr4_tile_color = (color); _gr4_tile_tileset = (tileset); _gr4_tile()
byte _gr4_tile_x;
byte _gr4_tile_y;
byte _gr4_tile_tile;
byte _gr4_tile_color;
byte *_gr4_tile_tileset;

byte *_gr4_tile_source;
byte *_gr4_tile_dest;

void _gr4_tile() {
   _gr4_tile_source = &_gr4_tile_tileset[_gr4_tile_tile*8];
   _gr4_tile_dest = (byte *) 0x4000 + _gr4_tile_x*2 + gr3_rowaddress[_gr4_tile_y*8];

   __asm

   ; C holds the color (does not change during the loop)
   ld	a,(__gr4_tile_color)
   ld c,a

   ld	b,0x08
 cicla:
   ; a = *source;
 	ld	hl, (__gr4_tile_source)
 	ld	a, (hl)

   ; source++;
 	inc hl
 	ld	(__gr4_tile_source), hl

   ; *dest = a;
   ld	hl, (__gr4_tile_dest)
 	ld	(hl), a

   ; dest++;
 	inc hl
 	ld	(__gr4_tile_dest),hl

   ; *dest = gr__gr4_tile_color
 	ld	a,c
 	ld	(hl), a

   ; dest +=0x7ff
 	ld	de,0x07ff
 	add hl,de
 	ld	(__gr4_tile_dest),hl

 	djnz cicla
   __endasm;
}

/*
#define gr4_tile(x,y,tile,color,tileset) _gr4_tile_x = (x); _gr4_tile_y = (y); _gr4_tile_tile = (tile); _gr4_tile_color = (color); _gr4_tile_tileset = (tileset); _gr4_tile()
byte _gr4_tile_x;
byte _gr4_tile_y;
byte _gr4_tile_tile;
byte _gr4_tile_color;
byte *_gr4_tile_tileset;

byte *_gr4_tile_source;
byte *_gr4_tile_dest_base;
word *_gr4_tile_dest_row;
byte *_gr4_tile_dest;
byte _gr4_tile_l;

void _gr4_tile() {
   _gr4_tile_source = &_gr4_tile_tileset[_gr4_tile_tile*8];
   _gr4_tile_dest_base = (byte *) 0x4000 + _gr4_tile_x*2;
   _gr4_tile_dest_row = &gr3_rowaddress[_gr4_tile_y*8];

   __asm
   EXTERN __gr4_tile_l

   ld a, 8
   ld (__gr4_tile_l), a

   cicla:
      ; DE = dest row
      ld hl, _gr4_tile_dest_row
      ld e, (hl)
      inc hl
      ld d, (hl)



      ld a, (__gr4_tile_l)
      dec a
      ld (__gr4_tile_l), a
      cp 0
      jr nz, cicla

   fine:


   __endasm;

   for(_gr4_tile_l=8;_gr4_tile_l!=0;_gr4_tile_l--) {
      _gr4_tile_dest = _gr4_tile_dest_base + *_gr4_tile_dest_row++;
      *_gr4_tile_dest++ = *_gr4_tile_source++;
      *_gr4_tile_dest = _gr4_tile_color;
   }

}
*/

/*
// unoptimized version of gr4_tile()
void gr4_tile(byte x, byte y, byte tile, byte color, byte *tileset) {
   byte *grdata = &tileset[tile*8];
   byte row = y*8;
   for(byte l=0;l<8;l++) {
      byte *ptr = (byte *) 0x4000 + gr3_getrow(row++) + x*2;
      *ptr++ = *grdata++;
      *ptr = color;
   }
}
*/

void gr4_prints(byte x, byte y, byte *s, byte color, byte *tileset) {
   SLOT1_VIDEO_START();
   byte c;
   while(c=*s++) {
      gr4_tile(x++,y,c,color,tileset);
   }
   SLOT1_END();
}
