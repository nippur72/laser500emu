#include <lib500.h>

#define STARTBOARD_X 15           /* X start position of the board on the screen */
#define STARTBOARD_Y 2            /* Y start position of the board on the screen */

#define BOARD_CHAR_LEFT  6
#define BOARD_CHAR_RIGHT 6

#define CRUNCH_CHAR_1  13
#define CRUNCH_COLOR_1 0x07

#define CRUNCH_CHAR_2  32
#define CRUNCH_COLOR_2 0xF0

#define POS_SCORE_X 29
#define POS_SCORE_Y 1

#define POS_LEVEL_X 29
#define POS_LEVEL_Y 7

#define POS_LINES_X 29
#define POS_LINES_Y 13

#define POS_NEXT_X 3
#define POS_NEXT_Y 1

#define NEXT_X (POS_NEXT_X+2)
#define NEXT_Y (POS_NEXT_Y+3)

void updateScore();
void drawPlayground();
void gameOver();

void gr_drawpiece(sprite *pl);
void gr_erasepiece(sprite *p);

void gr_update_board();
void gr_crunch_line(byte line, byte crunch_char, byte crunch_color);

// grahpic board
#include <stdio.h>            // for sprintf
//#include <sound.h>

#include "keyboard.h"
#include "fonts.h"
#include "pieces.h"
#include "ckboard.h"

extern unsigned long int score;

// update score table
char tmp[32];
void updateScore() {
   byte color = FG_BG(WHITE,BLACK);
   sprintf(tmp,"%6ld",score);
   gr4_prints(POS_SCORE_X+1,POS_SCORE_Y+2,tmp,color,FONTS);

   sprintf(tmp,"%6d",total_lines);
   gr4_prints(POS_LINES_X+1,POS_LINES_Y+2,tmp,color,FONTS);

   sprintf(tmp,"%6d",level);
   gr4_prints(POS_LEVEL_X+1,POS_LEVEL_Y+2,tmp,color,FONTS);
}

#define FRAME_VERT  7
#define FRAME_HORIZ 8

#define FRAME_NW_CORNER 9
#define FRAME_NE_CORNER 10
#define FRAME_SW_CORNER 11
#define FRAME_SE_CORNER 12

void drawFrame(byte x, byte y, byte w, byte h, byte color) {
   byte i;
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

void fillFrame(byte x, byte y, byte w, byte h, byte ch, byte color) {
   byte i,j;
   for (i=0; i<w; i++) {
      for (j=0; j<h; j++) {
         gr4_tile(x+i, y+j, ch, color, FONTS);
      }
   }
}

// draws the board
void drawPlayground() {
   set_border(DARK_GREY);   
   byte frame_color = FG_BG(LIGHT_GREY,BLACK);
   byte text_color  = FG_BG(YELLOW,BLACK);

   // draw tetris board
   SLOT1_VIDEO_START();
      // tetris frame
      fillFrame(0,0, 14,24,  16,FG_BG(BLACK, DARK_GREY));
      fillFrame(STARTBOARD_X,STARTBOARD_Y,BCOLS,BROWS,32,FG_BG(BLACK, BLACK));
      drawFrame(STARTBOARD_X-1,STARTBOARD_Y-1,BCOLS+2,BROWS+2, frame_color);
      fillFrame(26,0,15,24,  16,FG_BG(BLACK, DARK_GREY));
      fillFrame(0, 0,40,1,   16,FG_BG(BLACK, DARK_GREY));
      fillFrame(0,23,40,1,   16,FG_BG(BLACK, DARK_GREY));

      drawFrame(POS_SCORE_X, POS_SCORE_Y, 8, 4, frame_color);
      drawFrame(POS_LEVEL_X, POS_LEVEL_Y, 8, 4, frame_color);
      drawFrame(POS_LINES_X, POS_LINES_Y, 8, 4, frame_color);

      drawFrame(POS_NEXT_X , POS_NEXT_Y , 8, 8, frame_color);
      fillFrame(POS_NEXT_X+1 , POS_NEXT_Y+1 , 6, 6, 32, FG_BG(BLACK, BLACK));
      
      gr4_prints(POS_SCORE_X+1, POS_SCORE_Y+1, "SCORE ", text_color, FONTS);
      gr4_prints(POS_LEVEL_X+1, POS_LEVEL_Y+1, "LEVEL ", text_color, FONTS);

      gr4_prints(POS_LINES_X+1, POS_LINES_Y+1,"LINES ", text_color, FONTS);
      gr4_prints(POS_NEXT_X +1, POS_NEXT_Y +1,"NEXT" , text_color, FONTS);
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

   gr4_prints(STARTBOARD_X-1,y-0," GAME  OVER ", FG_BG(YELLOW,BLACK), FONTS);

   // sound effect
   bit_fx2(7);

   // since it's game over, there's no next piece
   gr_erasepiece(&piece_preview);

   byte flip = 0;
   while(1) {
      flip++;
      if(test_key(SCANCODE_ROW_RETN, SCANCODE_ROW_RETN)) break;
           if(flip <  60 ) color = FG_BG(YELLOW   ,BLACK);
      else if(flip < 120 ) color = FG_BG(DARK_GREY,BLACK);
      else flip = 0;
      gr4_prints(STARTBOARD_X,y-0,"GAME  OVER", color, FONTS);
   }
}

// erase piece from the screen
void gr_erasepiece(sprite *p) {
   tile_offset *data = get_piece_offsets(p->piece, p->angle);
   int px = p->x;
   int py = p->y;

   // are we erasing the "next" piece ?
   if(py==PIECE_IS_NEXT) {
      px = NEXT_X;
      py = NEXT_Y;
   }
   else {
      px += STARTBOARD_X;
      py += STARTBOARD_Y;
   }

   SLOT1_VIDEO_START();
   for(byte t=0; t<4; t++) {
      int x = px + data->offset_x;
      int y = py + data->offset_y;
      data++;
      gr4_tile((byte)x,(byte)y,EMPTY_GR_CHAR,EMPTY_GR_COLOR,FONTS);
   }
   SLOT1_END();
}

// draw a piece on the screen
void gr_drawpiece(sprite *p) {
   tile_offset *data = get_piece_offsets(p->piece, p->angle);
   int px = p->x;
   int py = p->y;

   // are we drawing the "next" piece ?
   if(py==PIECE_IS_NEXT) {
      px = NEXT_X;
      py = NEXT_Y;
   }
   else {
      px += STARTBOARD_X;
      py += STARTBOARD_Y;
   }

   SLOT1_VIDEO_START();
   for(byte t=0; t<4; t++) {
      int x = px + data->offset_x;
      int y = py + data->offset_y;
      data++;
      byte ch  = piece_chars[p->piece];
      byte col = piece_colors[p->piece];
      gr4_tile((byte)x,(byte)y,ch,col,FONTS);
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
