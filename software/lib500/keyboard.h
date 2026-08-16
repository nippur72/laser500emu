#define KEY_AUTOREPEAT_DELAY 8000
#define KEY_AUTOREPEAT_RATE  1200

byte keyboard_hit() FASTNAKED;
byte getchar_non_blocking();
byte mapped_io_key_test(word row, byte col);

