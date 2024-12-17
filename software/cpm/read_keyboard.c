#include "lib500.h"

extern byte CAPSLOCK;
extern byte *KEYBOARD_ROWS[12];

/*
// mapped I/O pointers of keyboard rows 0-11
byte *KEYBOARD_ROWS[12] = {
    0x68fe, 0x68fd, 0x68fb, 0x68f7, 0x68ef, 0x68df, 0x68bf, 0x687f,  // normal rows
    0x6bff, 0x6aff, 0x69ff, 0x68ff                                   // extended rows
};
*/

extern byte SCANCODES_NORMAL[84];
extern byte SCANCODES_SHIFT[84];
extern byte SCANCODES_CONTROL[84];

/*
// unshifted keymap
byte SCANCODES_NORMAL[84] = {
	255, 'z', 'x', 'c', 'v', 'b', 'n',   // SHIFT z x c v b n
	255, 'a', 's', 'd', 'f', 'g', 'h',   // CTRL a s d f g h
	'\t','q', 'w', 'e', 'r', 't', 'y',   // TAB q w e r t y
	 27, '1', '2', '3', '4', '5', '6',   // ESC 1 2 3 4 5 6
	255, '=', '-', '0', '9', '8', '7',   // UN = - 0 9 8 7
	  8, 255, 255, 'p', 'o', 'i', 'u',   // BS UN UN p o i u
	 13, 255,  39,  58, 'l', 'k', 'j',   // RET UN ' colon l k j
	255, '`', ' ', '/', '.', ',', 'm',   // GRAPH ` SP \ . , m
	255,'\\', ']', '[', '~', 127, 141,   // UN \ [ ] ~ DEL INS
	  6, 138, 139,  15,   8,  14,  10,   // CAPS DELLINE HOME UP LEFT RIGHT DOWN
	255, 137, 136, 135, 134, 133, 132,   // UN F10 F9 F8 F7 F6 F5
	255, 128, 129, 130, 131, 255, 255    // UN F1 F2 F3 F4 UN UN
};

// shifted keymap
byte SCANCODES_SHIFT[84] = {
	255, 'Z', 'X', 'C', 'V', 'B', 'N',   // SHIFT z x c v b n
	255, 'A', 'S', 'D', 'F', 'G', 'H',   // SHIFT a s d f g h
    '\t','Q', 'W', 'E', 'R', 'T', 'Y',   // TAB q w e r t y
	 27, '!', '@', '#', '$', '%', '^',   // ESC 1 2 3 4 5 6
	255, '+', '_', ')', '(', '*', '&',   // UN = - 0 9 8 7
	  8, 255, 255, 'P', 'O', 'I', 'U',   // BS UN UN p o i u
	 13, 255,  34,  59, 'L', 'K', 'J',   // RET UN ' colon l k j
	255, '`', ' ', '?', '>', '<', 'M',   // GRAPH \ SP \ . , m
	255,'\\', '}', '{', '~', 127, 141,   // UN \ [ ] ~ DEL INS
	  6, 138,  12,  15,   8,  14,  10,   // CAPS DELLINE HOME UP LEFT RIGHT DOWN
	255, 137, 136, 135, 134, 133, 132,   // UN F10 F9 F8 F7 F6 F5
	255, 128, 129, 130, 131, 255, 255    // UN F1 F2 F3 F4 UN UN
};

// control keymap
byte SCANCODES_CONTROL[84] = {
	255,  26,  24,   3,  22,   2,  14,	// SHIFT z x c v b n
	255,   1,  19,   4,   6,   7,   8,	// SHIFT a s d f g h
	'\t', 17,  23,   5,   18,  20, 25,  // TAB q w e r t y
	 27, '1', '2', '3', '4', '5', '6',	// ESC 1 2 3 4 5 6
	255, '=', '-', '0', '9', '8', '7',	// UN = - 0 9 8 7
	  8, 255, 255,  16,  15,   9,  21,	// BS UN UN p o i u
	 13, 255,  39,  58,  12,  11,  10,	// RET UN ' colon l k j
	255, '`', ' ', '/', '.', ',',  13,	// GRAPH ` SP \ . , m
	255,'\\', ']', '[', '~', 127, 141,	// UN \ [ ] ~ DEL INS
	  6, 138, 139,  15,   8,  14,  10,	// CAPS DELLINE HOME UP LEFT RIGHT DOWN
	255, 137, 136, 135, 134, 133, 132,	// UN F10 F9 F8 F7 F6 F5
	255, 128, 129, 130, 131, 255, 255	// UN F1 F2 F3 F4 UN UN
};
*/

/*
// converts 2^n scancode into n
byte code_to_col(byte code) {
   byte col = 6;
   do {
      if(code & 1) break;
      col--;
      code = code >> 1;
   } while(col!=0);
   return col;
}
*/

// converts scancode row,code into ascii key
byte code_to_ascii(byte row, byte code) {
   byte col = code_to_col(code);

   byte control = ~(*KEYBOARD_ROWS[1]) & (1<<6);
   byte shift   = ~(*KEYBOARD_ROWS[0]) & (1<<6);
   byte *table = SCANCODES_NORMAL;
   if(control) table = SCANCODES_CONTROL;
   if(shift)   table = SCANCODES_SHIFT;

   byte ascii = table[row*7+col];

   if(CAPSLOCK) {
      if(ascii > 96 && ascii < 123) ascii -= 32;
   }

   return ascii;
}

// scans the keyboard and return the ascii value of the key pressed
// returns 0 if no key was pressed
byte scan_keyboard() {
   for(byte row=0; row<12; row++) {
      byte code = *KEYBOARD_ROWS[row];
      if(row==5) code |= 0x30; // masks out FRA and GER keyboard layout bits
      if(row==0 || row==1) code |= 64; // masks out CONTROL & SHIFT
      code = ~code & 0x7F;
      if(code != 0) {
         return code_to_ascii(row, code);
      }
   }
   return 0;
}

#define KEY_AUTOREPEAT_FIRST  20
#define KEY_AUTOREPEAT_SECOND 3

// performs a keyboard read handling key autorepeat
// returns ascii of key pressed
// 0 if no key was pressed
byte read_keyboard() {
   static byte last_key = 0;
   static byte first_repeat = 0;
   static byte auto_repeat_counter = 0;
   static byte auto_repeat_max = KEY_AUTOREPEAT_FIRST;

   __asm
   di
   ld a, 2
   out ($41),a
   __endasm;

   byte ascii = scan_keyboard();

   if(ascii == last_key) {
      auto_repeat_counter++;
      if(auto_repeat_counter == auto_repeat_max) {
         last_key = ascii;
         auto_repeat_counter = 0;
         if(auto_repeat_max == KEY_AUTOREPEAT_FIRST) auto_repeat_max = KEY_AUTOREPEAT_SECOND;
      }
      else {
         ascii = 0;
      }
   }
   else {
      last_key = ascii;
      auto_repeat_counter = 0;
      auto_repeat_max = KEY_AUTOREPEAT_FIRST;
   }

   __asm
   ld a, 1
   out ($41),a
   ei
   __endasm;

   return ascii;
}

byte keyboard_buffer[16];         // keyboard buffer (16 bytes)
byte keyboard_buffer_read = 0;    // read head of the keyboard buffer
byte keyboard_buffer_write = 0;   // write head of the keyboard buffer

// write a key to the keyboard buffer
// doesn't write if the buffer is full
void write_key(byte c) {
   static byte pos;
   pos = (keyboard_buffer_write + 1) & 0xf;
   // check if buffer is full
   if(pos == keyboard_buffer_read) return;   
   keyboard_buffer[keyboard_buffer_write] = c;
   keyboard_buffer_write = pos;
}

// interrupt routine that does the keyboard read
// and writes into the keyboard buffer
void keyboard_interrupt_handler() {
   static byte key;
   __asm
   push af
   push bc
   push de
   push hl
   __endasm;

   key = read_keyboard();
   if(key!=0) write_key(key);         
   
   __asm
   pop hl
   pop de
   pop bc
   pop af
   __endasm;
}

// gets a key from the keyboard buffer, 0 if buffer is empty
byte get_key() {
   static byte key;
   if(keyboard_buffer_read == keyboard_buffer_write) return 0;   
   key = keyboard_buffer[keyboard_buffer_read];
   keyboard_buffer_read = (keyboard_buffer_read+1) & 0xf;
   return key;
}
