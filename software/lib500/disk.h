// ==== VT-DOS DISK ROUTINES ====

// DOS V1.1
#define TRACK  ((byte *)(0xFE60+0x12))
#define SECTOR ((byte *)(0xFE60+0x11))
#define SIDE   ((byte *)(0xFE60+0x43))
#define SECBUF ((byte *)0xFC56)

// disk routine in bank 6 loaded by VT-DOS
#define READ_WRITE_SEC_DATA   0x79B7

void set_drive(byte drive, byte side, byte track, byte sector);
byte read_track() NAKED;
byte write_track() NAKED;


