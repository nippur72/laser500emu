#define GR_MODE_5   0b000
#define GR_MODE_4   0b010
#define GR_MODE_3   0b011
#define GR_MODE_2   0b110
#define GR_MODE_1   0b111
#define GR_MODE_0   0b100
#define GR_MODE_OFF 16

// colors
#define BLACK         ((byte) 0)
#define BLUE          ((byte) 1)
#define GREEN         ((byte) 2)
#define CYAN          ((byte) 3)
#define RED           ((byte) 4)
#define MAGENTA       ((byte) 5)
#define BROWN         ((byte) 6)
#define LIGHT_GREY    ((byte) 7)
#define DARK_GREY     ((byte) 8)
#define VIOLET        ((byte) 9)
#define LIGHT_GREEN   ((byte)10)
#define LIGHT_CYAN    ((byte)11)
#define LIGHT_RED     ((byte)12)
#define LIGHT_MAGENTA ((byte)13)
#define YELLOW        ((byte)14)
#define WHITE         ((byte)15)

#define FG_BG(f,b)    (((f)<<4)|(b))

// all graphic modes
void gr_mode(byte mode);
void gr_mem_fill(byte value) FASTNAKED;

void set_background(byte c) FASTCALL;
void set_foreground(byte c);
void set_border(byte c);

byte isText80();

// text mode
word *get_cursor_address(byte x, byte y);
void screen_poke(byte *add, byte c);
void set_text_mode(byte mode) FASTCALL;
