#include <stdio.h>

#include "lib500.h"

char sbuf[256];

void lprints(char *s) {   
   while(*s) {      
      // TODO: check for printer ready???
      outport(PRINTER_PORT, *s++);
   }
}

void lprint_sector() {
   byte *secdata = SECBUF;
   for(int i=0; i<256; i++) {
      sprintf(sbuf, "0x%02x,", *secdata++);
      lprints(sbuf);
      if(i%16 == 15) lprints("\n");
   }     
}

void dump_disk() {
   lprints("const disk = [\r\n");

   for(byte side=0; side<2; side++) {
      for(byte track=0; track<40; track++) {
         sprintf(sbuf, "s: %d, t: %d, sec: ", side, track);
         rom_prints(sbuf);
         for(byte sector=0; sector<16; sector++) {
            set_drive(0, side, track, sector);
            read_track();                       
            lprint_sector();
            sprintf(sbuf, "%d ", sector);
            rom_prints(sbuf);
         }
         rom_prints("\r\n");
      }
   }   
   lprints("];\r\n");
}

void main() {

   // prepares the screen
   set_text_mode(MODE_TEXT_80);   
   set_foreground(YELLOW);
   set_background(BLACK);
   set_border(DARK_GREY);
   cls();
      
   rom_prints("DISK DUMPER!!\r\n");   

   rom_prints("This program dumps an entire 2 sided diskette\r\n");
   rom_prints("on the printer port, in JSON format\r\n\r\n");

   while(1) {
      rom_prints("Please insert a diskette and press ENTER\r\n");
      while(1) {
         int key = rom_getc();
         rom_putc(key);
         if(key == '\r') break;
      }
      rom_prints("GO!\r\n");
      dump_disk();            
   }

   rom_prints("Bye\n");
}
