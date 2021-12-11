#ifndef PIECES_H
#define PIECES_H

#include "types.h"

#define NUMPIECES 7                    // number of tetrominos in tetris
#define NUMTILES  4                    // number of tiles in a piece
#define NUMROT    4                    // number of rotations of a piece

// offset of a single tile composing a piece
typedef struct {
   byte offset_x;
   byte offset_y;
} tile_offset;

tile_offset *get_piece_offsets(byte piece, byte angle);

tile_offset pieces_XY[NUMPIECES*NUMTILES*NUMROT] = {  
   {+1,+1}  ,  {+2,+1}  ,  {+3,+1}  ,  {+1,+2}  , // L
   {+2,+0}  ,  {+2,+1}  ,  {+2,+2}  ,  {+3,+2}  ,
   {+3,+0}  ,  {+1,+1}  ,  {+2,+1}  ,  {+3,+1}  ,
   {+1,+0}  ,  {+2,+0}  ,  {+2,+1}  ,  {+2,+2}  ,
   {+1,+1}  ,  {+2,+1}  ,  {+3,+1}  ,  {+3,+2}  , // J
   {+2,+0}  ,  {+3,+0}  ,  {+2,+1}  ,  {+2,+2}  ,
   {+1,+0}  ,  {+1,+1}  ,  {+2,+1}  ,  {+3,+1}  ,
   {+2,+0}  ,  {+2,+1}  ,  {+1,+2}  ,  {+2,+2}  ,
   {+1,+0}  ,  {+0,+1}  ,  {+1,+1}  ,  {+2,+1}  , // T
   {+1,+0}  ,  {+0,+1}  ,  {+1,+1}  ,  {+1,+2}  ,
   {+0,+1}  ,  {+1,+1}  ,  {+2,+1}  ,  {+1,+2}  ,
   {+1,+0}  ,  {+1,+1}  ,  {+2,+1}  ,  {+1,+2}  ,
   {+0,+1}  ,  {+1,+1}  ,  {+2,+1}  ,  {+3,+1}  , // I
   {+1,+0}  ,  {+1,+1}  ,  {+1,+2}  ,  {+1,+3}  ,
   {+0,+1}  ,  {+1,+1}  ,  {+2,+1}  ,  {+3,+1}  ,
   {+1,+0}  ,  {+1,+1}  ,  {+1,+2}  ,  {+1,+3}  ,
   {+1,+0}  ,  {+2,+0}  ,  {+1,+1}  ,  {+2,+1}  , // O
   {+1,+0}  ,  {+2,+0}  ,  {+1,+1}  ,  {+2,+1}  ,
   {+1,+0}  ,  {+2,+0}  ,  {+1,+1}  ,  {+2,+1}  ,
   {+1,+0}  ,  {+2,+0}  ,  {+1,+1}  ,  {+2,+1}  ,
   {+2,+0}  ,  {+3,+0}  ,  {+1,+1}  ,  {+2,+1}  , // S
   {+1,+0}  ,  {+1,+1}  ,  {+2,+1}  ,  {+2,+2}  ,
   {+2,+0}  ,  {+3,+0}  ,  {+1,+1}  ,  {+2,+1}  ,
   {+1,+0}  ,  {+1,+1}  ,  {+2,+1}  ,  {+2,+2}  ,
   {+1,+0}  ,  {+2,+0}  ,  {+2,+1}  ,  {+3,+1}  , // Z
   {+2,+0}  ,  {+1,+1}  ,  {+2,+1}  ,  {+1,+2}  ,
   {+1,+0}  ,  {+2,+0}  ,  {+2,+1}  ,  {+3,+1}  ,
   {+2,+0}  ,  {+1,+1}  ,  {+2,+1}  ,  {+1,+2}
};

// given a piece number and an angle returns the 4 byte "offsets" of the piece
tile_offset *get_piece_offsets(byte piece, byte angle) {
   return &pieces_XY[(piece*sizeof(tile_offset)*4*2)+angle*4];
}

#endif
