#include <lib500.h>

#define CRUNCH_CHAR1  65          /* when a line is crunched, it's filled orange first */
#define CRUNCH_CHAR2  66          /* and then is erased with black */

#define STARTBOARD_X 13           /* X start position of the board on the screen */
#define STARTBOARD_Y 1            /* Y start position of the board on the screen */

#define NEXT_X 31
#define NEXT_Y 19

#define BOARD_CHAR_LEFT  6
#define BOARD_CHAR_RIGHT 6

//#define NCOLS 40                  /* number of screen columns */
//#define NROWS 24                  /* number of screen rows, also board height */

#define BACKGROUND BLACK            /* board background value */

#define EMPTY_GR_CHAR  32
#define EMPTY_GR_COLOR 0x00

#define CRUNCH_CHAR_1  13
#define CRUNCH_COLOR_1 0x07

#define CRUNCH_CHAR_2  32
#define CRUNCH_COLOR_2 0xF0


void updateScore();
void drawPlayground();
void gameOver();

void gr_drawpiece(sprite *pl);
void gr_erasepiece(sprite *p);

void gr_update_board();
void gr_scroll_down(byte endline);
void gr_crunch_line(byte line, byte crunch_char, byte crunch_color);

// grahpic board
#include <stdio.h>            // for sprintf
//#include <sound.h>

#include "keyboard.h"
#include "fonts.h"
#include "pieces.h"
#include "ckboard.h"

// waits until the screen_buffer has been copied on the scree by the interrupt routine
void wait_interrupt() {
   __asm
   EXTERN _irq_trigger;
   ld hl, _irq_trigger
   wait_interrupt_here:
   ld a, (hl)
   cp #0
   jr z, wait_interrupt_here
   xor a
   ld (hl),a
   __endasm;
}

extern long int score;

// update score table
char tmp[32];
void updateScore() {
   byte color = FG_BG(WHITE,BLACK);
   sprintf(tmp,"%6ld",score);
   gr4_prints(30,3,tmp,color,FONTS);

   sprintf(tmp,"%6d",total_lines);
   gr4_prints(30,8,tmp,color,FONTS);

   sprintf(tmp,"%6d",level);
   gr4_prints(30,13,tmp,color,FONTS);
}

#define FRAME_VERT  7
#define FRAME_HORIZ 8

#define FRAME_NW_CORNER 9
#define FRAME_NE_CORNER 10
#define FRAME_SW_CORNER 11
#define FRAME_SE_CORNER 12

void drawFrame(int x, int y, int w, int h, byte color) {
   int i;
   for (i=1; i<w-1; i++) {      
      gr4_tile(x+i, y    , FRAME_VERT, color, FONTS);
      gr4_tile(x+i, y+h-1, FRAME_VERT, color, FONTS);
   }
   for (i=1; i<h-1; i++) {
      gr4_tile(x    , y+i, FRAME_HORIZ, color, FONTS);
      gr4_tile(x+w-1, y+i, FRAME_HORIZ, color, FONTS);
   }

   gr4_tile(x     ,y    , FRAME_NE_CORNER, color, FONTS);
   gr4_tile(x+w-1 ,y    , FRAME_NW_CORNER, color, FONTS);
   gr4_tile(x     ,y+h-1, FRAME_SE_CORNER, color, FONTS);
   gr4_tile(x+w-1 ,y+h-1, FRAME_SW_CORNER, color, FONTS);
}

// draws the board
void drawPlayground() {
   // fill screen
   gr4_cls(BLACK);   

   byte board_color = FG_BG(LIGHT_GREY,RED);
   byte frame_color = FG_BG(LIGHT_GREY,BLACK);
   byte text_color  = FG_BG(YELLOW,BLACK);

   // draw tetris board
   SLOT1_VIDEO_START();
      for(word t=0; t<BROWS+1; t++) {
         gr4_tile(STARTBOARD_X-1      ,STARTBOARD_Y+t, BOARD_CHAR_LEFT , board_color, FONTS);
         gr4_tile(STARTBOARD_X+BCOLS  ,STARTBOARD_Y+t, BOARD_CHAR_RIGHT, board_color, FONTS);

         gr4_tile(STARTBOARD_X-1      -1,STARTBOARD_Y+t, BOARD_CHAR_LEFT , board_color, FONTS);
         gr4_tile(STARTBOARD_X+BCOLS  +1,STARTBOARD_Y+t, BOARD_CHAR_RIGHT, board_color, FONTS);
      }
      for(word t=0;t<BCOLS+4;t++) {
         gr4_tile(STARTBOARD_X-2+t,STARTBOARD_Y+BROWS, BOARD_CHAR_LEFT , board_color, FONTS);
         gr4_tile(STARTBOARD_X-2+t,STARTBOARD_Y+BROWS+1, BOARD_CHAR_LEFT , board_color, FONTS);
      }
         
      drawFrame(29, 1,8,4, frame_color);      
      drawFrame(29, 6,8,4, frame_color);      
      drawFrame(29,11,8,4, frame_color);      
      drawFrame(29,16,8,8, frame_color);      
      
      gr4_prints(30, 2,"SCORE",text_color,FONTS);    
      gr4_prints(30, 7,"LINES",text_color,FONTS);    
      gr4_prints(30,12,"LEVEL",text_color,FONTS);    
      gr4_prints(30,17,"NEXT" ,text_color,FONTS);
   SLOT1_END();
}

// displays "game over" and waits for return key
void gameOver() {
   byte color = FG_BG(YELLOW, BLACK);
   byte frame_color = FG_BG(LIGHT_GREY,BLACK);

   byte y = (STARTBOARD_Y+BROWS)/2;

   SLOT1_VIDEO_START();
   drawFrame(STARTBOARD_X-2, y-1,14,3, frame_color);
   SLOT1_END();

   gr4_prints(STARTBOARD_X-1,y-0,"  GAME OVER ", FG_BG(YELLOW,BLACK), FONTS);

   // sound effect
   bit_fx2(7);

   /*
   gr4_prints(STARTBOARD_X-2,y-1,"              ", color, FONTS);
   gr4_prints(STARTBOARD_X-2,y-0,"   GAME OVER  ", color, FONTS);
   gr4_prints(STARTBOARD_X-2,y+1,"              ", color, FONTS);
   */

   // since it's game over, there's no next piece
   gr_erasepiece(&piece_preview);

   byte flip = 0;
   while(1) {
      flip++;
      if(test_key(SCANCODE_ROW_RETN, SCANCODE_ROW_RETN)) break;
           if(flip <  80 ) color = FG_BG(YELLOW   ,BLACK);
      else if(flip < 160 ) color = FG_BG(DARK_GREY,BLACK);
      else flip = 0;
      gr4_prints(STARTBOARD_X+1,y-0,"GAME OVER", color, FONTS);
   }

   //while(!test_key(SCANCODE_ROW_RETN, SCANCODE_ROW_RETN));
}

// erase piece from the screen
void gr_erasepiece(sprite *p) {
   tile_offset *data = get_piece_offsets(p->piece, p->angle);
   int px = p->x;
   int py = p->y;

   // are we erasing the "next" piece ?
   if(px==255) {
      px = NEXT_X;
      py = NEXT_Y;
   }
   else {
      px += STARTBOARD_X;
      py += STARTBOARD_Y;
   }

   SLOT1_VIDEO_START();
   for(byte t=0; t<4; t++) {
      int x = px + data[t].offset_x;
      int y = py + data[t].offset_y;
      gr4_tile(x,y,EMPTY_GR_CHAR,EMPTY_GR_COLOR,FONTS);
   }
   SLOT1_END();
}

// draw a piece on the screen
void gr_drawpiece(sprite *p) {
   tile_offset *data = get_piece_offsets(p->piece, p->angle);
   int px = p->x;
   int py = p->y;

   // are we drawing the "next" piece ?
   if(px==255) {
      px = NEXT_X;
      py = NEXT_Y;
   }
   else {
      px += STARTBOARD_X;
      py += STARTBOARD_Y;
   }

   SLOT1_VIDEO_START();
   for(byte t=0; t<4; t++) {
      int x = px + data[t].offset_x;
      int y = py + data[t].offset_y;
      byte ch  = piece_chars[p->piece];
      byte col = piece_colors[p->piece];
      gr4_tile(x,y,ch,col,FONTS);
   }
   SLOT1_END();
}

// fills the specified line with an empty character
void gr_crunch_line(byte line, byte crunch_char, byte crunch_color) {
   SLOT1_VIDEO_START();
   for(byte i=0; i<BCOLS; i++) {
      gr4_tile(STARTBOARD_X+i, STARTBOARD_Y+line, crunch_char, crunch_color, FONTS);
   }
   SLOT1_END();
}

// scroll down the board by 1 position from top to specified line
/*
void gr_scroll_down(byte endline) {
   // TODO
   byte tile,ch,col;
   SLOT1_VIDEO_START();
   for(byte line=endline;line>0;line--) {
      for(byte i=0;i<BCOLS;i++) {
         tile = board[line][i];
         if(tile == EMPTY) {
            ch = EMPTY_GR_CHAR;
            col = EMPTY_GR_COLOR;
         } else {
            ch = piece_chars[tile];
            col = piece_colors[tile];
         }
         gr4_tile(STARTBOARD_X+i, STARTBOARD_Y+line, ch, col, FONTS);
      }
   }
   SLOT1_END();

   // clears the top line
   gr_crunch_line(0, EMPTY_GR_CHAR, EMPTY_GR_COLOR);
}
*/

void gr_update_board() {
   byte tile,ch,col;
   SLOT1_VIDEO_START();
   for(byte line=0;line<BROWS;line++) {
      for(byte column=0;column<BCOLS;column++) {
         tile = board[line][column];
         ch = piece_chars[tile];
         col = piece_colors[tile];
         gr4_tile(STARTBOARD_X+column, STARTBOARD_Y+line, ch, col, FONTS);
      }
   }
   SLOT1_END();
}