#include "lib500.h"
#include "read_keyboard.h"

/*
porta 78h: read/write data

porta 7Ah
    read: bit 0 => data is ready to be read
          bit 3 => data can be written to output

*/

__sfr __at 0x78 serial_data;
__sfr __at 0x7a serial_status;

byte serial_in_ready() {
   return (serial_status & 1);
}

byte serial_out_ready() {
   return (serial_status & 8) != 0;
}

extern void CONOUT(byte ch);
void myputc(byte c) FASTNAKED {
    __asm
        ld   a,l
        call _CONOUT
        ret
    __endasm;
    c=c;
}

void prints(char *s) {
   while(*s) myputc(*s++);
}

void main() {

   // installs the interrupt keyboard reading routine
   install_interrupt(keyboard_interrupt_handler);

   // prepares the screen
   set_text_mode(MODE_TEXT_80);
   set_foreground(YELLOW);
   set_background(BLACK);
   set_border(DARK_GREY);
   prints("\x0c");
   prints("Press ^C to return to exit\r\n");

   while(1) {      
      while(serial_in_ready()) {
         byte c = serial_data;
         if(c==0) continue;  // NULL
         if(c==7) continue;  // BELL
         myputc(c);
      }         
      byte c = get_key();
      if(c!=0) {
         if(c==3) break;     // CTRL+C exits
         while(!serial_out_ready());
         serial_data = c;
         // myputc(c); uncomment if no ECHO
      }
   }
   prints("Goodbye!\r\n");
}
