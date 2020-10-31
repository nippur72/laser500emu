;
; Laser 500 CPM 2.2 CCP+CBIOS main file
;

MEM	        EQU	48		; KB RAM Left
STARTBIOS   EQU $BA00   ; start of bios in memory, called from boot loader

IOBYTE            EQU $0003   ; IO byte
DEFDRIVE          EQU $0004   ; default drive
JUMPTOBDOS        EQU $0005   ; (3 bytes) JP BDOS

include "ccp.calkins.asm"
include "cbios.asm"

; common routines

