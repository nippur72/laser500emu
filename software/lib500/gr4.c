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

#define gr4_tile(x,y,tile,color,tileset) _gr4_tile_x = (x); _gr4_tile_y = (y); _gr4_tile_tile = (tile); _gr4_tile_color = (color); _gr4_tile_tileset = (tileset); _gr4_tile()
byte _gr4_tile_x;
byte _gr4_tile_y;
byte _gr4_tile_tile;
byte _gr4_tile_color;
byte *_gr4_tile_tileset;
void _gr4_tile() {
   static byte *source;
   static byte *dest_base;
   static word *dest_row;
   static byte *dest;
   static byte l;
   source = &_gr4_tile_tileset[_gr4_tile_tile*8];
   dest_base = (byte *) 0x4000 + _gr4_tile_x*2;
   dest_row = &gr3_rowaddress[_gr4_tile_y*8];
   for(l=8;l!=0;l--) {
      dest = dest_base + *dest_row++;
      *dest++ = *source++;
      *dest = _gr4_tile_color;
   }
}

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
