#include "lib500.h"

/*
porta 51h: read/write data

porta 50h
    read: bit 0 => data is ready to be read
          bit 1 => data can be written to output

*/

__sfr __at 0x51 serial_data;
__sfr __at 0x50 serial_status;

byte serial_in_ready() {
   return (serial_status & 1);
}

byte serial_out_ready() {
   return (serial_status & 2) != 0;
}

void main() {

   // prepares the screen
   rom_set_text_80();
   set_foreground(YELLOW);
   set_background(BLACK);
   set_border(DARK_GREY);
   set_cursor_flash(1);
   set_keyboard_beep(0);   
   rom_prints("SERIAL TERMINAL - press ^C to exit\r\n");

   while(1) {      
      while(serial_in_ready()) {
         byte c = serial_data;
         if(c==0) continue;  // NULL
         if(c==7) continue;  // BELL
         rom_putc(c);
      }         
      byte c = getchar_non_blocking();
      if(c!=0) {
         if(c==3) break;     // CTRL+C exits
         while(!serial_out_ready());
         serial_data = c;
         // rom_putc(c); uncomment if no ECHO
      }
   }
   rom_prints("Goodbye!\r\n");
}
