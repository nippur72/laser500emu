// system variables (low RAM basic workspace)
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

// vdc & io latches
#define PORT_44_LATCH  ((byte *)0x8669)
#define PORT_45_LATCH  ((byte *)0x866a)
#define IO_LATCH       ((byte *)0x85f9)
#define MAPPED_IO_ADDR ((byte *)0x6800)


// memory banks
#define BANK_ROM_0       0
#define BANK_ROM_1       1
#define BANK_IO_2        2
#define BANK_RAM_3       3
#define BANK_RAM_4       4
#define BANK_RAM_5       5
#define BANK_RAM_6       5
#define BANK_VIDEO_RAM_7 7

// other ROM values
#define WARM_RESET            0x68c8
#define RESET_PTR             0x861d
#define RESET_CHECKSUM_VALUE  0xe1

// utils
byte peek(byte *address);
word peek_word(word *address);
void poke(byte *address, byte value);
void poke_word(word *address, word value);
void outport(byte port, byte value);

void mapped_io_write(byte value) FASTCALL;
byte mapped_io_read();

void set_reset_handler(void *handler) FASTNAKED;

void SLOT1_IO_START();
void SLOT1_VIDEO_START();
void SLOT1_END();
