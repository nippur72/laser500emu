#ifndef SPRITE_H
#define SPRITE_H

// tetromino sprite
typedef struct {
   int x;          // signed integers to allow negative board positions
   int y;          // -1 means piece is preview ("next")
   byte piece;
   byte angle;
} sprite;

INLINE void sprite_copy(sprite *to, sprite *from) {
   memcpy(to, from, sizeof(sprite));
}

#endif
