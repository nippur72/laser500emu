LOW RAM MAP
===========
```
8012      user defined interrupt routine (default: RET) 
8030      KEYASCII: ASCII code of last key pressed (TODO verify)
803A      ?? (initialized with 0)
803D      (pointer) Topmem (? used to initialize bottom of stack)
803F      current line number ffff=immediate mode (initialized with fffeh)
8041      (pointer) start of basic program (initialized with 8995h)
8043      ?? unid pointer
8147      (pointer) initialized with 2221h
8149      ?? initialized with 3a
8289-838B screen editor input buffer, the line typed on screen is written here
838C      ??
83D8      (pointer) ??
83E7      ?? (initialized with 0)
83E8      ?? (initialized with 0)
83E9      (pointer) basic simple variables
83EB      (pointer) basic array
83ED      (pointer) free space
83C2      (pointer) strings
839D      (pointer) STACKPTR: stack
839F      (pointer) ?? (initialized with 83a1h)
8513      ?? initialized with 0
856A-8577 ?? some substracting self-modifying code
8578-857A INP routine helper, port to read is 8579
857B-857D OUT routine helper, port to write is 857C
857E-8581 ?? some substracting self-modifying code
85D0      ?? initialized with C3h
85D1      ?? initialized with 28h
85D2      ?? initialized with 22h
85D4-85DF 10x "RET 00 00" configurable jump table
85E2      (word) CURSOR_ADDRESS, initialized with 7800h
85E5      NROWS: number of scrolling rows (default 24, lower value means bottom rows are fixed) 
85E6      ?? Left column indent (default 0, in steps of 2, odd values will yield funny results)
85E7      NCOLS: number of screen columns (initialized with 80)
85EA      (word) keyboard table layout: 06de (eng), 07da (fre), 08d6 (ger)
85EC      (word) keyboard table layout: 06de (eng), 07da (fre), 08d6 (ger) + 54h
85EE      (word) keyboard table layout: 06de (eng), 07da (fre), 08d6 (ger) + 54h + 54h
85F0      LAST_KEY_PRESSED: key code currently pressed (255 = no key) (initialized with ffh)
85F4      KEYREPEATCOUNTER key repeat counter, when zero is set to KEYREPEAT (initialized with 28h)
85F5      KEYREPEAT: key autorepeat value, initialized with 28h 
85F6      ?? initialized with 05h
85F7      (pointer) KEY_REPLAY_STRING: if not zero replay the 0 terminated string pointed by this (used for FKEYS?)
85F9      latch of I/O image (was :?? bit 3: if 1 then do not read keyboard during interrupt)
85FA      bit 1: turn on/off inverse text 
          bit 3: turn on/off key beep
          bit 5: 0=do not read keyboard during interrupt
          bit 3: ??
          bit 2: ??
85FB      CAPSLOCK: 
          bit 6: if 1 then do not read keyboard during interrupt
          bit 4: if 0 then do not do key autorepeat during interrupt
          somewhat involved in CAPS LOCK state (bit 3), but other bits are used as well
          bit 1-0: 00 = QWERTY keyboard layout
                   01 = AZERTY keyboard layout
                   10 = QWERTZ keyboard layout
8604      content at cursor position
8606      ?? initialized with 10h
8607      ?? initialized with 10h
8612      PORT_10_LATCH: port 10h latch (?)
861D      (pointer) warm reset routine (reset key)
861F      warm boot flag, if equal to (&H861D)+(&H816E)+&HE1 then is graceful reset, otherwise is boot
8664      ?? port 41 latch old value
8665      PORT_40_LATCH: SYSVAR_bank0
8666      PORT_41_LATCH: SYSVAR_bank1
8667      PORT_42_LATCH: SYSVAR_bank2
8668      PORT_43_LATCH: SYSVAR_bank3
8669      PORT_44_LATCH: SYSVAR_port44 (VDC display mode/border color)
866A      PORT_45_LATCH: port 45h latch (VDC foreground/background color)

866C      ?? used in tape RDBYET routine

8995-     Start of BASIC program
```

KERNAL ROM ROUTINES
===================
```
0538 - GETKEY2: waits for keypress, updates LAST_KEY_PRESSED and returns ASCII code in A
09E2 - BELL: emits small beep sound (CHR$(7))
09EA - BEEP (not working) emet un son 
       HL = hauteur de note (plus la valeur est faible , plus la note est aigue)
       DE = durée de la note
       B = 02
0B4F - not working - GETKEY: reads the keyboard and updates LAST_KEY_PRESSED and KEYASCII
09D2 - lprint character
58F0 - GETC read char from keyboard and returns in A
591C - print new line (apparently) 
62D3 - PRINTSTR: print 0 terminated string in HL
66EF - RESET cold software reset

000B CONOUT outputs character in a to console
006B CONOUT outputs character in a to console
57D9 CHROUT prints character in A
```

I/O PORTS
=========
```
40h-43h  BANK SWITCHING
44h      DISPLAY MODE
45h      COLOR FOR DISPLAY MODE   
```
BANK SWITCHING
==============
```
OUT &H40, n   ; 0000h - 3FFFh
OUT &H41, n   ; 4000h - 7FFFh
OUT &H42, n   ; 8000h - BFFFh
OUT &H43, n   ; C000h - FFFFh
```
MEMORY PAGES
============
```
0,1 ROM KERNAL
2 I/O
3 VIDEO AND RAM IN LASER 350 ONLY
4,5 RAM (available to BASIC)
6 RAM
7 VIDEO RAM
```  
USER INTERRUPT ROUTINE
======================
```
The CPU will be interrupted for every 20 ms. The interrupt service routine will push all registers to stack, 
and call an exit point at location 8012H. When power up this location is initialized to RET. 
The user can modify this vector to jump to his service routine if he wish
```
VIDEO ACCESS
============
```
On the Laser 500, the 8 64Kb DRAM chips are shared between the CPU and the video hardware. 
The CPU accesses RAM through the VLSI IC, which acts as a proxy and can insert wait states for the CPU 
if the RAM is already in use by the video hardware.

As seen by the VLSI, the 64 KB RAM occupies banks 4 to 7, the video hardware uses the RAM at the top of bank 7 
as video memory for both text and graphic modes (it can be configured to use bank 3 instead, 
but it is unpopulated on the Laser 500/700).

Depending on the mode you're using, you may or may not use the lower area of bank 7 as general-purpose RAM.

Video Mode    Video RAM     Free for user

TEXT40/80     3800-3FFF     0000-37FF
GR0/1/2       2000-3FFF     0000-1FFF
GR3/4/5       0000-3FFF     None

The offsets in the above table are given relative to the start of bank 7. The corresponding CPU address space 
range depends on what window the bank 7 is assigned to (if at all).
```
DISPLAY MODES
=============
```
I/O port 44H controls the display modes;

In textmode:
   Bit 0: 0=40 column, 1=80 column
   Bit 1: x
   Bit 2: x

In graphics mode:
   GR0
      Bit 0=x
      Bit 1=0
      Bit 2=1

   GR1
      Bit 0=1
      Bit 1=1
      Bit 2=1

   GR2
      Bit 0=0
      Bit 1=1
      Bit 1=1

   GR3
      Bit 0=1
      Bit 1=1
      Bit 2=0

   GR4
      Bit 0=0
      Bit 1=1
      Bit 2=0

   GR5
      Bit 0=x
      Bit 1=0
      Bit 2=0

   Bit 3; 0=page 3 and 1=page 7 in all modes

   Bit 4-7, is the backdrop color, 4=Blue, 5=Green, 6=Red, 7=Brightness

The ports are write only and can not be read back if I understand things right!

The difference between "2 of 16 colors" and "2 colors"(also of a 16 color palette) graphic modes is that in 
"2 of 16 colors" you can change color after every 8 pixels (every odd byte holds the info of the two colors) 
in the other case you can only change for the hole screen at once (write color info to port 45H)!
```

DISPLAY MODE FORMAT
===================
```
Display modes:
Lowest memory location is in left upper screen corner, highest in the right lower corner, 
All addresses are from the screen maps. 

Text modes 2K;
80 bytes/row
24 rows
F800-FFFF(FFA0H=beginning of row 24)
40 character, 16 colors (even byte=character code, odd byte=color)
80 character, 2 of 16 colors (back and foreground color is written to I/O port 45H)
Character= 5x7 dots in a 8x8 grid

The video memory is the last 16K. In 40 column text mode, the screen matrix starts at &HF800 and is arranged in a ZX Spectrum like order, where every even byte contains the character and every subsequent odd byte is a combination of background (low nybble) and foreground (high nybble).

Row 0: Bytes 0 .. 79
Row 1: Bytes 256 .. 335
Row 2: Bytes 512 .. 591
Row 3: Bytes 768 .. 847
Row 4: Bytes 1024 .. 1103
Row 5: Bytes 1280 .. 1359
Row 6: Bytes 1536 .. 1595
Row 7: Bytes 1792 .. 1871
Row 8: Bytes 80 .. 159
Row 9: Bytes 336 .. 415
Row 10: Bytes 592 .. 671
Row 11: Bytes 848 .. 927
Row 12: Bytes 1104 .. 1183
Row 13: Bytes 1360 .. 1439
Row 14: Bytes 1596 .. 1675
Row 15: Bytes 1872 .. 1951
Row 16: Bytes 160 .. 239
Row 17: Bytes 416 .. 495
Row 18: Bytes 672 .. 751
Row 19: Bytes 928 .. 1007
Row 20: Bytes 1184 .. 1263
Row 21: Bytes 1440 .. 1519
Row 22: Bytes 1676 .. 1755
Row 23: Bytes 1952 .. 2031

As you can see, the last 16 bytes in each block of 256 bytes are wasted in this scheme, a total of 7 * 16 = 112 bytes.

Graphic modes 8K;
All modes 40 bytes/line
E000-FFFF(FFA0=beginning of last line)
GR0 160H x 96V, 16 colors, (vertical resolution is in fact 192, but every odd line is a duplication of the last even line)
GR1 160 x 192, 2 of 16 colors
GR2  320x192, 2 colors

Graphics modes 16K;
All modes 80 bytes/line
C000-FFFF(FFA0H=beginning last line)
GR3 160x192, 16 colors
GR4  320x192, 2 of 16 colors(even byte=8 pixels(1=foreground color , 0=background color), odd byte=back and foreground color info for the 8 pixels)
GR5 640x192, 2 colors, every bit is an pixel(80 bytes=80x8=640 pixels), back and foreground color info written to I/O port 45H   
```
TRICKS
======
if you want a flashing cursor during INKEY$, you can issue the following commands:
```
POKE &H8013,64:POKE &H8014,10:REM PREPARE FLASHING CURSOR
POKE &H8012,&HC3:REM ENABLE FLASHING CURSOR
POKE &H8012,&HC9:REM DISABLE FLASHING CURSOR
```

How to relocate a Basic program: modify the &H8041 pointer to the
new address and POKE address-1, 0. Then use NEW or CLEAR.

INTERRUPT PART 2
================
```
The video chip triggers a maskable interrupt every start of frame.
It is an INT and interrupt mode 1 set, takes takes 13 clock cycles to reach &H0038

M1 cycle: 7 ticks: acknowledge interrupt and decrement SP
M2 cycle: 3 ticks: write high byte of PC onto the stack and decrement SP
M3 cycle: 3 ticks: write low byte onto the stack and to set PC to 0038H.

0038H in the ROM calls &H0A0C

&H0A0C ROM KERNEL Interrupt Routine which in turn calls also 8012H (user interrupt routine)

0a0c f5        push    af
0a0d c5        push    bc
0a0e d5        push    de
0a0f e5        push    hl
0a10 dde5      push    ix
0a12 fde5      push    iy
0a14 cd1280    call    8012h    ; user interrupt routine
0a17 cd2e0a    call    0a2eh    ; something with screen/keyboard
0a1a cd560a    call    0a56h
0a1d cda90a    call    0aa9h
0a20 cdb80a    call    0ab8h
0a23 fde1      pop     iy
0a25 dde1      pop     ix
0a27 e1        pop     hl
0a28 d1        pop     de
0a29 c1        pop     bc
0a2a f1        pop     af
0a2b fb        ei      
0a2c ed4d      reti    
```

MEMORY MAPPED I/O
=================
```
   READ (6800-6BFF when on bank 2)
      * bit  function
      * 7    cassette input
      * 6    column 6
      * 5    column 5
      * 4    column 4
      * 3    column 3
      * 2    column 2
      * 1    column 1
      * 0    column 0

   WRITE (6800-6BFF when on bank 2)
      * bit  function
      * 7-6  not assigned
      * 5    speaker B (has no effect)
      * 4    ???
      * 3    VDC mode: 1 graphics, 0 text
      * 2    cassette out (MSB)
      * 1    cassette out (LSB)
      * 0    speaker A
```
PRINTING CODES
==============
- CHR(24) begin line (cursor up key)
- CHR$(31) cls
- CHR$(28) home 0x1C
- CHR$(7) bell
- ESC A reverse off
- ESC B reverse on

QUIRKS
======
- CALL expression works only if expression == variable
- in MON LD (A000),A results in BAD OPERAND with arguments > 9999h
- in AND F0 results in BAD OPERAND, must write as "AND 0F0"
- in MON ld de, 1 / call exo_getbit is listed as "??"
- first byte in binary cassette file if FFh becomes F1h
- ' is REM

BANKS
=====

Banks C through F are for expansion ROM, made available through the expansion connector.
At startup, the BASIC ROM will look for a magic value (byte sequence AA, 55, E7, 18) in banks 2, C, D, E and F (in that order), and transfer execution to that ROM bank at offset 0x0004 if such a value is found (the bank gets mapped at 0000-3FFF in Z80 address space).

DISK
====
The manual mentions that the BASIC ROM can detect the presence of the disk unit interface by writing the I/O port 0x13 and reading back the result (this is the data buffer, so if the disk interface is present, you should read back the same value you've written).
And if the disk interface is present, the sector 0 of track 0, will be loaded to memory location 0xA200, and execution will resume at that location (after checking that the boot signature is there, I assume).
So it appears there is a least minimal support for the disk drive interface in the BASIC ROM, but it doesn't exclude loading a fuller support from an expansion ROM module.

CHARSET ROM
===========
containts the following character sets:
00 -    0 ($0000) english (standard)
01 - 2048 ($0800) nothing (vertical strips)
10 - 4096 ($1000) german
11 - 6144 ($1800) french

