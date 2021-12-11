#ifndef CKBOARD_H
#define CKBOARD_H

#include <string.h>                // for memcpy()

#include "sprite.h"
#include "pieces.h"

#define BCOLS 10                   // number of board columns
#define BROWS 21                   // number of board rows
#define EMPTY 255                  // empty character on the board

byte board[BROWS][BCOLS];          // the board

// prototypes
void ck_init();
void ck_drawpiece(sprite *pl);
void ck_erasepiece(sprite *pl);
int collides(sprite *pl);
byte is_line_filled(byte line);
void ck_erase_line(byte line);
void ck_scroll_down(byte endline);

// fills the check board with EMPTY
void ck_init() {
   for(int r=0;r<BROWS;r++) {
      ck_erase_line(r);
   }
}

// draw a piece on the check board
void ck_drawpiece(sprite *pl) {
   tile_offset *data = get_piece_offsets(pl->piece, pl->angle);
   for(byte t=0; t<4; t++) {
      int x = pl->x + data[t].offset_x; 
      int y = pl->y + data[t].offset_y; 
      board[y][x] = pl->piece;
   }
}

// erase a piece from the check board
void ck_erasepiece(sprite *pl) {
   tile_offset *data = get_piece_offsets(pl->piece, pl->angle);
   for(byte t=0; t<4; t++) {
      int x = pl->x + data[t].offset_x; 
      int y = pl->y + data[t].offset_y; 
      board[y][x] = EMPTY;
   }
}

// returns 1 if the piece collides with something
int collides(sprite *pl) {
   tile_offset *data = get_piece_offsets(pl->piece, pl->angle);
   for(byte t=0; t<4; t++) {
      int x = pl->x + data[t].offset_x; 
      int y = pl->y + data[t].offset_y;       
      if(x<0) return 1;                  // does it collide with left border?
      if(x>=BCOLS) return 1;             // does it collide with right border?
      if(y>=BROWS) return 1;             // does it collide with bottom? 
      if(board[y][x] != EMPTY) return 1; // does it collide with something? 
   }
   return 0;
}

// returns 1 if the line is all filled
byte is_line_filled(byte line) {
   for(int t=0;t<BCOLS;t++) {
      if(board[line][t]==EMPTY) return 0;
   }
   return 1;
}

// fills the specified line with an empty character 
void ck_erase_line(byte line) {
   for(byte t=0; t<BCOLS; t++) {
      board[line][t] = EMPTY;
   }
}

// scroll down the board by 1 position from top to specified line
void ck_scroll_down(byte endline) {
   for(byte line=endline;line>0;line--) {
      void *above = &board[line-1];
      void *below = &board[line];
      memcpy(below, above, BCOLS);
   }
   // clears the top line
   ck_erase_line(0);
}

#endif
