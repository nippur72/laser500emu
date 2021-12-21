//
// TETRIS for Laser 500
// Written by Antonino Porcino, April 2021
// nino.porcino@gmail.com
//
// This tetris version has been derived from my 
// previous implementation for the Laser 310 you can find here:
// https://github.com/nippur72/laser310-emu/tree/main/software/tetris
// 
//
// https://github.com/nippur72/laser500-emu/tree/main/software/tetris
//

// TODO fonts import javascript conversion script

// libraries from C/Z88DK
#include <string.h>        // memset, memcopy
#include <stdlib.h>        // for sprintf, rand
#include <stdio.h>         //
#include <sound.h>         // for z88dk sound effects

#define COUNTER_MAX            500    // the speed counter at level 0
#define COUNTER_FACTOR         7      // speed decrease factor: speed -= speed / factor

#include <lib500.h>
#include "pieces.h"

#define EMPTY_GR_CHAR  32
#define EMPTY_GR_COLOR FG_BG(BLACK, BLACK)

byte piece_chars[NUMPIECES+1] = {
   0, // L (orange in the original tetris)
   1, // J
   2, // T
   3, // I
   2, // O
   1, // S
   0, // Z
   EMPTY_GR_CHAR // space
};
byte piece_colors[NUMPIECES+1] = {
   FG_BG( LIGHT_GREY    , WHITE      ), // L (orange in the original tetris)
   FG_BG( VIOLET        , BLUE       ),  // J
   FG_BG( LIGHT_MAGENTA , MAGENTA    ),  // T
   FG_BG( LIGHT_CYAN    , CYAN       ),  // I
   FG_BG( YELLOW        , BROWN      ),  // O
   FG_BG( LIGHT_GREEN   , GREEN      ),  // S
   FG_BG( LIGHT_RED     , RED        ),  // Z
   EMPTY_GR_COLOR                        // empty character
};

void check_crunched_lines();

#define COLLIDES     1
#define NOT_COLLIDES 0

#define PIECE_IS_NEXT 255      /* tells a piece is not on the board but on the "next" display */

#include "sprite.h"

sprite piece_preview;    // the "next" piece 
sprite player;           // the piece moved by the player
sprite new_pos;          // new player position when making a 1-step move

word drop_counter;       // counter used to set the pace 
word drop_counter_max;   // maximum value of the counter 

unsigned long int score;          // player's score
unsigned int level;               // level
unsigned int lines_remaining;     // lines to complete the level
unsigned int total_lines;         // total number of lines

// game files
#include "pieces.h"
#include "ckboard.h"
#include "fonts.h"
#include "keyboard.h"
#include "grboard.h"

#include "intro.h"

// generate a new piece after the last one can no longer move
// piece is taken from the "next" which in turn is generated randomly
// returns "COLLIDES" if a new piece can't be generated (the board is full)

byte generate_new_piece() {
   // move "next" piece onto the board
   player.piece = piece_preview.piece;
   player.angle = piece_preview.angle;
   player.x = 4;
   player.y = 0;

   // get a new "next" piece
   gr_erasepiece(&piece_preview);
   piece_preview.piece = (byte) rand() % NUMPIECES;
   piece_preview.angle = (byte) rand() % NUMROT;
   gr_drawpiece(&piece_preview);

   if(collides(&player)) {
      // new piece can't be drawn => game over
      return COLLIDES;
   } else {
      // does not collide, draw it on the board
      ck_drawpiece(&player);
      gr_drawpiece(&player);
      return NOT_COLLIDES;
   }
}

void handle_player_input() {
   byte key = player_input();
   byte allowed = 0;

   if(key == 0) return;

   ck_erasepiece(&player);

   // calculate the new position
   sprite_copy(&new_pos, &player);

   if(key == KEY_LEFT) {
      new_pos.x--;
      if(!collides(&new_pos)) allowed = 1;
   }
   else if(key == KEY_RIGHT) {
      new_pos.x++;
      if(!collides(&new_pos)) allowed = 1;
   }
   else if(key == KEY_ROTATE) {
      new_pos.angle = (new_pos.angle + 1) & 3;
      if(!collides(&new_pos)) allowed = 1;
   }
   else if(key == KEY_DOWN) {
      drop_counter = drop_counter_max;
      return;
   }
   else if(key == KEY_DROP) {
      // animate the falling piece
      while(1) {
         ck_erasepiece(&player);
         sprite_copy(&new_pos, &player);
         new_pos.y++;
         if(collides(&new_pos)) {
            break;
         }         
         // gr_erasepiece(&player);
         // gr_drawpiece(&new_pos);         

         // flicker-free version      
         ck_markpiece(&new_pos);           
         gr_erasepiece_unmarked(&player);  
         gr_drawpiece(&new_pos);           

         ck_drawpiece(&new_pos);
         sprite_copy(&player,&new_pos);
      }
      drop_counter=drop_counter_max;  // force an automatic drop
      return;
   }

   if(allowed == 1) {
      // gr_erasepiece(&player);
      // gr_drawpiece(&new_pos);

      // flicker-free version      
      ck_markpiece(&new_pos);           
      gr_erasepiece_unmarked(&player);  
      gr_drawpiece(&new_pos);           

      sprite_copy(&player, &new_pos);
   }

   ck_drawpiece(&player);   
}

// the main game loop, exits when GAME OVER
// if the speed counter reaches its max then the piece is automatically pushed down 1 position
// else lets the player move the piece with keyboard/joystick commands
void gameLoop() {
   while(1) {
      if(drop_counter++==drop_counter_max) {
         // automatic drop down
         drop_counter = 0;

         // erase from the check board in order to make the move
         ck_erasepiece(&player);

         // calculate the new position (1 square down)
         sprite_copy(&new_pos, &player);
         new_pos.y++;

         if(collides(&new_pos)) {
            // collides, redraw it again on the check board
            ck_drawpiece(&player);
            // check if lines to be crunched
            check_crunched_lines();
            // generate a new piece if possible, otherwise exit to game over
            if(generate_new_piece()==COLLIDES) return;
         }
         else {
            // automatic drop does not collide, simply draw it
            // gr_erasepiece(&player);   // erase and draw are as close as possible
            // gr_drawpiece(&new_pos);

            // flicker-free version      
            ck_markpiece(&new_pos);           
            gr_erasepiece_unmarked(&player);  
            gr_drawpiece(&new_pos);           

            sprite_copy(&player, &new_pos);   
            ck_drawpiece(&player);          
         }
         // TODO forces display of the screen buffer 
      }
      else {
         handle_player_input();
      }
   }
}

unsigned int scores[5] = {0, 40, 100, 300, 1200};   // variable score on number of lines crunched

byte lines_cruched[BROWS];                 // stores which lines have been crunched 

// checks if player has made complete lines and "crunches" them
void check_crunched_lines() {
   byte num_lines_crunched = 0;

   // mark completed lines
   for(byte line=(BROWS-1);line>0;line--) {
      byte filled = is_line_filled(line);
      lines_cruched[line] = filled; 
      if(filled) {
         ck_erase_line(line);
         gr_crunch_line(line, CRUNCH_CHAR_1, CRUNCH_COLOR_1);
         num_lines_crunched++;
      }
   }

   if(num_lines_crunched == 0) return;

   // wait 5 frames so the effect is visible
   for(byte t=1; t<5; t++) {
      wait_interrupt();
   }

   // assign score
   score += scores[num_lines_crunched] * (level+1);
   lines_remaining -= num_lines_crunched;
   total_lines += num_lines_crunched;

   // advance level
   if(lines_remaining <= 0) {
      level = level + 1;
      lines_remaining += 10;
      drop_counter_max -= drop_counter_max/COUNTER_FACTOR;      
      // TODO effect when advancing level?
   }

   // update score
   updateScore();

   // // marks the lines crunched with another character
   for(byte line=0; line<BROWS; line++) {
       if(lines_cruched[line]) {
         gr_crunch_line(line, CRUNCH_CHAR_2, CRUNCH_COLOR_2);
       }
   }

   // wait 5 frames so the effect is visible
   for(byte t=1; t<5; t++) {
      wait_interrupt();
   }

   // compact the heap of tetrominos, removing empty lines
   for(byte line=0; line<BROWS; line++) {
      if(lines_cruched[line]) {
         ck_scroll_down(line);
      }
   }

   // update the screen
   gr_update_board();

   // sound effect
   bit_fx3(0);
}

// initializes a new game
void initGame() {
   level = 0;
   score = 0;
   total_lines = 0;
   lines_remaining = 10;
   drop_counter_max = COUNTER_MAX;
   ck_init();

   drawPlayground();
   updateScore();   

   piece_preview.x = PIECE_IS_NEXT;
   piece_preview.y = PIECE_IS_NEXT;  // piece is on "next" display

   // generate pieces twice: one for "next" and one for player   
   generate_new_piece();
   ck_erasepiece(&player);
   gr_erasepiece(&player);
   generate_new_piece();
}

void main() {

   // initialize graphic table for addressing the rows
   gr3_rowinit();

   // install the start-of-frame interrupt detection
   install_timer_irq();

   while(1) {
      introScreen();
      initGame();
      gameLoop();
      gameOver();
   }
}
