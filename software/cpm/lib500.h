typedef unsigned char byte;
typedef unsigned int  word;

#define FASTCALL __z88dk_fastcall
#define FASTNAKED __z88dk_fastcall __naked
#define NAKED __naked

// special characters
#define CLS  31
#define HOME 28

// useful memory locations
#define KEY_SCANCODE   ((byte *)0x85f0)
#define TEXT_80        ((byte *)0x85FD)
#define SCREEN_ADDRESS ((word *)0x7800)
#define CURSOR_ADDRESS ((word *)0x85e2)
#define CURSOR_COL     ((byte *)0x85e9)
#define CURSOR_ROW     ((byte *)0x85e8)

// memory banks latches
#define PORT_40_LATCH  ((byte *)0x8665)      
#define PORT_41_LATCH  ((byte *)0x8666)
#define PORT_42_LATCH  ((byte *)0x8667)      
#define PORT_43_LATCH  ((byte *)0x8668)

// memory banks
#define BANK_ROM_0       0
#define BANK_ROM_1       1
#define BANK_IO_2        2
#define BANK_RAM_3       3
#define BANK_RAM_4       4
#define BANK_RAM_5       5
#define BANK_RAM_6       5
#define BANK_VIDEO_RAM_7 7

// vdc & io latches
#define PORT_44_LATCH  ((byte *)0x8669)      
#define PORT_45_LATCH  ((byte *)0x866a)
#define IO_LATCH       ((byte *)0x85f9)

// other ROM values
#define WARM_RESET            0x68c8
#define RESET_PTR             0x861d
#define RESET_CHECKSUM_VALUE  0xe1

// colors
#define BLACK          0
#define BLUE           1
#define GREEN          2
#define CYAN           3
#define RED            4
#define MAGENTA        5
#define BROWN          6
#define LIGHT_GREY     7
#define DARK_GREY      8
#define VIOLET         9
#define LIGHT_GREEN   10
#define LIGHT_CYAN    11
#define LIGHT_RED     12
#define LIGHT_MAGENTA 13
#define YELLOW        14
#define WHITE         15

#define MODE_TEXT_40  0
#define MODE_TEXT_80  1

#define GR_MODE_5   0b000
#define GR_MODE_4   0b010
#define GR_MODE_3   0b011
#define GR_MODE_2   0b110
#define GR_MODE_1   0b111
#define GR_MODE_0   0b100
#define GR_MODE_OFF 16

// utils
byte peek(byte *address);
word peek_word(word *address) FASTCALL;
void poke(byte *address, byte value);
void poke_word(word *address, word value);
void outp(byte port, byte value);
void mapped_io_write(byte value) FASTNAKED;
byte mapped_io_read() FASTNAKED; 
void set_bank1(byte page) FASTNAKED;  

// general
void install_interrupt(void *handler) FASTNAKED;
void uinstall_interrupt() FASTNAKED;
void set_reset_handler(void *handler) FASTNAKED;

// timer
#define CLOCKS_PER_SEC 50
typedef unsigned long clock_t;
void install_timer_irq();
clock_t clock();

/*
extern void _myfputc_cons(char a) __z88dk_fastcall;
extern void myfputc_cons(char a) __z88dk_fastcall;
*/

byte rom_getc() FASTNAKED;
void rom_bell() FASTNAKED;
byte keyboard_hit() FASTNAKED;
void read_keyboard() FASTNAKED;
void set_background(byte c) FASTCALL;
void set_foreground(byte c);
void set_border(byte c);

// text mode
word *get_cursor_address(byte x, byte y);
void move_cursor(byte x, byte y);
void rom_prints(byte *pippo) FASTNAKED;
void rom_putc(byte c) FASTNAKED;
void screen_poke(byte *add, byte c);
byte isText80();
void set_text_mode(byte mode) FASTCALL;
void cls();

// graphic mode
void gr_mode(byte mode);
void gr_mem_fill(byte value) FASTNAKED;
void gr3_rowinit();
word gr3_getrow(byte row) FASTNAKED;
void gr3_pset(byte row, byte col, byte color);
void gr3_put_bitmap(word picAddress) FASTNAKED;
