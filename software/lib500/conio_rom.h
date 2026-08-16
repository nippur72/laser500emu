// special characters
#define CLS  31
#define HOME 28

#define MODE_TEXT_40  0
#define MODE_TEXT_80  1

void move_cursor(byte x, byte y);
void rom_prints(char *pippo) FASTNAKED;
void rom_putc(byte c) FASTNAKED;
byte rom_getc() FASTNAKED;
byte rom_kbhit() FASTNAKED;
void rom_bell() FASTNAKED;
void rom_cls() FASTNAKED;
void cls();
void set_cursor_flash(byte enable);
void rom_set_text_40() FASTNAKED;
void rom_set_text_80() FASTNAKED;
void rom_set_keyboard_beep(byte enable);
void set_keyboard_beep(byte enable);

