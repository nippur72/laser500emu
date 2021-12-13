#ifndef KEYBOARD_H
#define KEYBOARD_H

#include <lib500.h>

/* keyboard defititions */
#define KEY_LEFT   'J'
#define KEY_RIGHT  'L'
#define KEY_DOWN   'K'
#define KEY_DROP   ' '
#define KEY_ROTATE 'I'

#define KEY_REPEAT_COUNTER_MAX 200     // key autorepeat timer value

// keyboard scan codes
#define SCANCODE_ROW_UP    0x6aff
#define SCANCODE_ROW_DOWN  0x6aff
#define SCANCODE_ROW_LEFT  0x6aff
#define SCANCODE_ROW_RIGHT 0x6aff
#define SCANCODE_ROW_SPC   0x687f
#define SCANCODE_ROW_RETN  0x68bf

#define SCANCODE_COL_UP    (8  ^ 0xFF)
#define SCANCODE_COL_DOWN  (1  ^ 0xFF)
#define SCANCODE_COL_LEFT  (4  ^ 0xFF)
#define SCANCODE_COL_RIGHT (2  ^ 0xFF)
#define SCANCODE_COL_SPC   (16 ^ 0xFF)
#define SCANCODE_COL_RETN  (64 ^ 0xFF)

byte test_key(word scancode, byte col);
byte read_joystick();
byte read_keyboard();
byte player_input();

// test a specific scancode on the memory mapped I/O
byte test_key(word row, byte col) {
   return mapped_io_key_test(row,col);
}

// reads the joystick simulating keyboard keys
byte read_joystick() {
   static __sfr __at 0x20 joy_present;  // I/O port for checking if joy is present
   static __sfr __at 0x2e joystick;     // I/O joystick port, 4 directions + fire
   static __sfr __at 0x2d arm_button;   // I/O joystick port, alternate fire button ("arm")

   if(joy_present == 0x21) return 0;    // joystick is not present

        if(!(joystick   &  1)) return KEY_ROTATE; // up
   else if(!(joystick   &  2)) return KEY_DOWN;   // down
   else if(!(joystick   &  4)) return KEY_LEFT;   // left
   else if(!(joystick   &  8)) return KEY_RIGHT;  // right
   else if(!(joystick   & 16)) return KEY_ROTATE; // fire
   else if(!(arm_button & 16)) return KEY_DROP;   // arm
   else return 0;
}

// reads the keyboard and return the key pressed
byte read_keyboard() {
        if(test_key(SCANCODE_ROW_UP   ,SCANCODE_COL_UP   )) return KEY_ROTATE;
   else if(test_key(SCANCODE_ROW_LEFT ,SCANCODE_COL_LEFT )) return KEY_LEFT;
   else if(test_key(SCANCODE_ROW_DOWN ,SCANCODE_COL_DOWN )) return KEY_DOWN;
   else if(test_key(SCANCODE_ROW_RIGHT,SCANCODE_COL_RIGHT)) return KEY_RIGHT;
   else if(test_key(SCANCODE_ROW_SPC  ,SCANCODE_COL_SPC  )) return KEY_DROP;
   else return 0;
}

// handle player input, implementing key autorepeat
// for all keys except "rotate" and "drop"

byte player_input() {
   static byte last_key = 0;
   static int repeat_counter = 0;

   byte key = read_keyboard() | read_joystick();

   if(key == KEY_LEFT || key == KEY_RIGHT || key == KEY_DOWN) {
      repeat_counter++;
      if(repeat_counter == KEY_REPEAT_COUNTER_MAX) {
         repeat_counter = 0;
         last_key = 0;
      }
   }
   else repeat_counter = 0;

   if(key == last_key) return 0;
   last_key = key;
   return key;
}

#endif
