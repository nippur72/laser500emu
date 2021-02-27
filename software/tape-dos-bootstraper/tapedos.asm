; TAPE DOS BOOTSTRAPPER
;
; Loads the VT-DOS 1.1 into memory as the disk bootstraper would do.
; It allows the DOS to be bootstrapped from cassette tape.
;

; 1) Switches bank #6 RAM in slot #3
; 2) copies the VTDOS to $de00-$ffff 
; 3) does some initializations 
; 4) gives control to VTDOS

org $8995

   ; add a basic header so that the program can be "RUN"
   ; 2021 A=&H89A5:CALL A:END
   db $FF,$FF,$E5,$07,$41,$F0,$0C,$A5,$89,$3A,$B6,$20,$41,$3A,$81,$00

tapedos:
   ; disable interrupts to mimick power up condition
   di

   ; prints "Bootstrapping DOS V1.1"
   ld      hl,MESSAGE
   call    PRINT_MESSAGE

   ; switch bank #6 on slot #3 where VT-DOS will be copied
   ld      a,$06
   out     ($43),a

   ; copies the VTDOS into $de00-$ffff RAM bank #6
   ld      hl, vtdosimage
   ld      de, $de00
   ld      bc, endvtdos - vtdosimage
   ldir

   ; restore old bank #5 on slot #3
   ld      a,$05
   out     ($43),a

   ; initialize the DOS in RAM
   call    initdos

   ; does the same things as the ROM boot routine at $66B4
   im 1
   ei
   jp   22dch       ; return to "Ready" prompt

; ======================================================================================

; this is the same initialization code found in the DOS boot sector
; after the VTDOS has been loaded in bank #6 slot #3 at $de00-$ffff

initdos:
   ; sets IY and SP
   ld      iy,$fe60 
   ld      hl,$faff 
   ld      ($803d),hl    ; "top location to use for the stack"
   ld      sp,hl      
   ld      ($83d8),hl    ; "stack saved before execution"

   ; sets top of memory
   ld      de,$fe00                        
   add     hl,de                           
   ld      ($839d),hl    ; "highest location in memory"

   ; sets basic memory pointers
   ld      de,$8041      ; "pointer to beginning of text"
   push    hl                              
   call    $5ec1         ; ?set basic pointers?                           
   pop     hl                              

   ; fix FRETOP pointer
   ld      ($83c2),hl    ; "top of string free space"

   ; switches page 6 on bank 1
   ld      a,$06                           
   ld      ($8666),a                       
   out     ($41),a

   ; continues to VT-DOS and RET there
   call     $5f2d
   ret

; ======================================================================================

MESSAGE:
   db "DOS V1.1 LOADED IN MEMORY", $0d, $0a, 0

PRINT_MESSAGE:   
   ld      a,(hl)                       ; a = peek(HL)
   or      a                            ; 
   ret     z                            ; if a=0 then return; // 0 termination string
   push    hl                           ; 
   call    $000b                        ; CHROUT
   pop     hl                           ; 
   inc     hl                           ; 
   jr      PRINT_MESSAGE                ; 

; ======================================================================================

vtdosimage:
   ; VT-DOS image (boot sector included)
   include "vtdos.db.asm"
endvtdos:

