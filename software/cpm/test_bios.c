#include "..\..\..\..\..\z80\test_z88dk\lib500\lib500.h"
#include <stdio.h>
#include <math.h>

typedef unsigned char byte;
typedef unsigned int  word;

extern byte CONIN();
extern void CONOUT(byte ch);

byte CONIN_wrapper() FASTNAKED;
void CONOUT_wrapper(byte c) FASTNAKED;

void test_CONIN();
void test_CONOUT();

int main() {
   set_text_mode(MODE_TEXT_80);
   set_foreground(WHITE);
   set_background(BLACK);
   set_border(BLUE);
   cls();
   rom_prints("CPM BIOS tester ready.\n");
   //test_CONIN();
   test_CONOUT();
}

//**************************************************************************************

void test_CONIN() {
   rom_prints("\r\nCONIN:\r\n");
   for(int t=0;t<10;t++) {
       rom_prints("\r\nPRESS A KEY: ");
       byte c=CONIN_wrapper();
       rom_putc(c);
   }
}

byte CONIN_wrapper() FASTNAKED {
    __asm
        call _CONIN
        ld   h,0
        ld   l,a
        ret
    __endasm;
}

//**************************************************************************************

void test_CONOUT() {
   rom_prints("\r\nCONOUT:\r\n");
   /*
   for(int t=0;t<255;t++) {
       CONOUT_wrapper(t);
   }
   */
   rom_getc();
   while(1) {
       byte c = rom_getc();
       CONOUT_wrapper(c);
   }

}

void CONOUT_wrapper(byte ch) FASTNAKED {
    __asm
        ld   a,l
        call _CONOUT
        ret
    __endasm;
}

