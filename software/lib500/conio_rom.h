// special characters
#define CLS  31
#define HOME 28

#define MODE_TEXT_40  0
#define MODE_TEXT_80  1

void move_cursor(byte x, byte y);
void rom_prints(char *pippo) FASTNAKED;
void rom_putc(byte c) FASTNAKED;
byte rom_getc() FASTNAKED;
void rom_bell() FASTNAKED;
void cls();

