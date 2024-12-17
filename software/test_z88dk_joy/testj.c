#include <stdio.h>
#include <games.h>

void main() {
   while(1) {
      unsigned char j0 = joystick(1);
      if(j0 & MOVE_RIGHT) printf("MOVE_RIGHT ");          
      if(j0 & MOVE_LEFT) printf("MOVE_LEFT ");
      if(j0 & MOVE_DOWN) printf("MOVE_DOWN ");
      if(j0 & MOVE_UP  ) printf("MOVE_UP ");
      if(j0 & MOVE_FIRE ) printf("MOVE_FIRE ");
      if(j0 & MOVE_FIRE2) printf("MOVE_FIRE2 ");
      printf("%u\r\n",j0);
   }
}
