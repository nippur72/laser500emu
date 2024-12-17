#include "lib500.h"
#include <stdio.h>
#include <math.h>
#include <string.h>

#include "read_keyboard.h"

extern byte CONIN();
extern void CONOUT(byte ch);
extern byte CCOL;
extern byte CROW;
extern byte CAPSLOCK;

//**************************************************************************************

/*
void CONST() FASTNAKED {
    __asm
    ld   a, (_KEYBOARD_BUFFER_PTR)
    or   a
    ret  z
    ld   a, $FF
    ret
    __endasm;
}
*/

byte CONIN_wrapper() FASTNAKED {
    __asm
        call _CONIN
        ld   h,0
        ld   l,a
        ret
    __endasm;
}

/*
void test_CONIN() {
   rom_prints("\r\nCONIN:\r\n");
   for(int t=0;t<10;t++) {
       rom_prints("\r\nPRESS A KEY: ");
       //byte c=CONIN_wrapper();
       byte c=read_keyboard();
       rom_putc(c);
   }
}
*/

//**************************************************************************************

void CONOUT_wrapper(byte ch) FASTNAKED {
    __asm
        ld   a,l
        call _CONOUT
        ret
    __endasm;
}

byte sbuf[255];

void test_CONOUT() {
   rom_prints("\r\nCONOUTxx:\r\n");      
   while(1) {       
       byte c = get_key();
            if(c== 0) { /* does nothing */ }
       else if(c==31) { c=12; CONOUT_wrapper(c); }
       else if(c==25) { c=14; CONOUT_wrapper(c); }
       else if(c==29) { c=10; CONOUT_wrapper(c); }
       else if(c==24) { c=15; CONOUT_wrapper(c); }
       else if(c==13) {
            CONOUT_wrapper(c);
            CONOUT_wrapper(10);
       }
       else {
            CONOUT_wrapper(c);
       }
       sprintf(sbuf, "\x1c C=%d R=%d char=%d CAPS=%d  \r\n", CCOL, CROW, c, CAPSLOCK);
       rom_prints(sbuf);
   }
}

//**************************************************************************************


void dump(byte *addr, word num) {
    for(word t=0;t<num;t++) {
        sprintf(sbuf,"%02X ",*addr);
        ++addr;
        rom_prints(sbuf);
    }
    rom_prints("\n");
}

void test_disk_drive() {
   rom_prints("\r\n");
   memset(SECBUF, 0xEE, 256);
   dump(SECBUF, 256);

   rom_prints("\r\n\r\nreading track...");
   set_drive(0,0,0,1);
   read_track();

   rom_prints("done\r\n\r\n");
   dump(SECBUF, 256);
   rom_prints("\r\n");

   rom_prints("\r\n\r\nwriting track...");
   memset(SECBUF, 0xC8, 256);
   set_drive(0,0,0,1);
   write_track();

   rom_prints("done\r\n\r\n");

   rom_prints("\r\n");
   memset(SECBUF, 0xEE, 256);
   dump(SECBUF, 256);

   rom_prints("\r\n\r\nreading track again...");
   set_drive(0,0,0,1);
   read_track();
   dump(SECBUF, 256);
}

int main() {

   install_interrupt(keyboard_interrupt_handler);

   set_text_mode(MODE_TEXT_80);
   set_foreground(WHITE);
   set_background(BLACK);
   set_border(BLUE);
   cls();
   rom_prints("CPM BIOS tester ready.\r\n");

   //test_CONIN();
   test_CONOUT();

   uinstall_interrupt();
}
