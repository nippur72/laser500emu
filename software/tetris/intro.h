#include <stdlib.h>      // for rand()

#include "lib500.h"
#include "keyboard.h"

byte *logo =
   // 1234567890123456789012345678901234567890
   "TTTTTTT EEEEE XXXXXXX RRRRR   I   SSSS  "
   "   T    E        X    R    R  I  S    S "
   "   T    E        X    R    R  I  S      "
   "   T    EEEE     X    RRRRR   I   SSSS  "
   "   T    E        X    R  R    I       S "
   "   T    E        X    R   R   I  S    S "
   "   T    EEEEE    X    R    R  I   SSSS  ";

void drawLogo() {
   SLOT1_VIDEO_START();
   byte *s = logo;
   for(byte r=0;r<7;r++) {
      for(byte c=0;c<40;c++) {
         byte tile = 0;
         switch(*s++) {
            case 'T': tile = 1; break;
            case 'E': tile = 2; break;
            case 'X': tile = 3; break;
            case 'R': tile = 4; break;
            case 'I': tile = 5; break;
            case 'S': tile = 6; break;
         }
         if(tile) {
            byte ch  = piece_chars[tile];
            byte col = piece_colors[tile];
            gr4_tile(c,r+3,ch,col,FONTS);
         }
      }
   }
   SLOT1_END();
}

// introduction screen
void introScreen() {
   set_border(BLACK);   
   gr_mode(GR_MODE_4);   
   gr4_fast_cls(0,BLACK);

   drawLogo();

   gr4_prints(7,13,"WRITTEN BY ANTONINO PORCINO" , FG_BG(YELLOW,BLACK), FONTS);
   gr4_prints(5,18,"USE ARROWS+SPACE OR JOYSTICK", FG_BG(WHITE,BLACK), FONTS);
   gr4_prints(9,20,"PRESS RETURN TO START"       , FG_BG(WHITE,BLACK), FONTS);

   // wait for key released
   while(test_key(SCANCODE_ROW_RETN, SCANCODE_COL_RETN));

   // wait for key press and do the coloured animation   
   while(!test_key(SCANCODE_ROW_RETN, SCANCODE_COL_RETN)) {
      // TODO music      
      rand();  // extract random numbers, making rand() more "random"
   }
}



