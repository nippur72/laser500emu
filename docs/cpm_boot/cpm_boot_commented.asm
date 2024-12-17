; VTECH CPM 2.2 56K BOOT LOADER
;
; This resides on the first sector (track 0, sector 0)
; of a formatted CPM floppy disc and it is loaded in memory 
; at the address $A200-$A2FF by the ROM at boot 
; when disk interface is detected.

; the boot sector code loads the CP/M control program (37 sectors) 
; and puts it at C400h-E8FFh then executes it at DA00h

   org A200h

boot:
   ; switch page 7 (VIDEO RAM) on bank 3
   ld      a,07h
   out     (43h),a 

   ; tries to complement the last byte on the memory bank to see if it's ram
   ; if it's not then it's laser 350 and goes to print error message
   ld      hl,0FFFFh
   ld      a,(hl)
   cpl
   ld      (hl),a
   cp      (hl)
   jr      nz,no_ram

retry: 
   ld      sp,9FFFh         ; set stack pointer below the boot sector routine

   ; prepare parameters for calling $0033 (READDSK)   
   ld      b,25h            ; B=37 number of sectors to read   
   ld      d,00h            ; track 0
   ld      e,0Bh            ; sector 11
   ld      hl,0C400h        ; $C400 start addres of CCP in memory

read_loop:
   push    de
   push    bc
   push    hl

   ; reads the current sector, restarting from beginning if there's a read error   
   ld      (860Bh),hl        ; set read disk buffer to point to destination memory

   ld      hl,deinterleave   ; hl points to CP/M deinterleave table below
   ld      d,00h             ; converts physical sector into logical
   add     hl,de             ; and writes in 0x8609
   ld      a,(hl)            ; a = deinterleave[e]
   ld      (8609h),a         ; write to SECNUM ($8609)

   call    0033h             ; read disk sector pointed by TRACKNUM/SECNUM and 
   jr      c,retry           ; writes it in SECTORBUF. CF=1 failed read
   
   ; increment the dest mem pointer by 256
   pop     hl                ; 
   ld      de,0100h          ; 
   add     hl,de             ; (HL = HL + 256) 

   ; decrement sector count
   pop     bc
   dec     b                  
   jr      z,finished_read   ; if count == 0 then goto finished_read

   ; increment sector and/or track
   pop     de           ;
   inc     e            ; increment sector
   ld      a,e          ;
   cp      16           ; if sector<16 then goto loop
   jr      c, read_loop ;  
   ld      e,00h        ; sector = 0
   inc     d            ; increment track
   ld      a,d          ;
   ld      (8608h),a    ; update track
   jr      read_loop    ; 

finished_read:

   ; when arrived here, it has read 37 consecutive sectors
   ; starting from track 0 sector 11, putting them at address C400

   ld      a,04h           ; selects page 4 (first 16K RAM)
   out     (40h),a         ; on bank 0

   jp      0224Eh          ; continue the execution of code at next location 
                           ; under the new memory bank layout

   ; the following code resides in page 4 (first 16K RAM) 
   ; and is mapped at A224 when in bank 3
   ;                  0224 when in bank 0

L224Eh:
   inc     a               ; selects page 5 (second 16K RAM)
   out     (41h),a         ; on bank 1

   inc     a               ; selects page 6 (third 16K RAM)
   out     (42h),a         ; on bank 2 

   ; final memory layout is all RAM:
   ; bank 0: page 4 (RAM)
   ; bank 1: page 5 (RAM)
   ; bank 2: page 6 (RAM)
   ; bank 3: page 7 (RAM)

   ld      a,01h           ; 80 column, black border
   out     (44h),a         ;

   ld      a,0F0h          ; white foreground on black background
   out     (45h),a         ;

   jp      0DA00h          ; goes to CPM entry point

deinterleave:
   ; sector deinterleave table (+2 steps)    
   defb 00h, 02h, 04h, 06h, 08h, 0Ah, 0Ch, 0Eh
   defb 01h, 03h, 05h, 07h, 09h, 0Bh, 0Dh, 0Fh
   
no_ram: 
   ld      a,05h
   out     (43h),a 
   ld      hl,ERROR_MESSAGE
print_message:
   ld      a,(hl)
   or      a
   ret     z
   push    hl
   call    003Bh
   pop     hl
   inc     hl
   jr      print_message

ERROR_MESSAGE: 
   ; "INSUFFICIENT MEMORY"
   defb 49h
   defb 4Eh
   defb 53h
   defb 55h
   defb 46h
   defb 46h
   defb 49h
   defb 43h
   defb 49h
   defb 45h
   defb 4Eh
   defb 54h
   defb 20h
   defb 4Dh
   defb 45h
   defb 4Dh
   defb 4Fh
   defb 52h
   defb 59h
   defb 00h

   ; filler bytes
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h
   defb 00h

unknown_data:
   defb F4h, AAh, D6h, BAh, 00h, F4h, 00h, D4h      

; notable differences from VT-DOS boot sector
; - the sector interleave schema is different: +2 in CP/M, +3 in VTDOS
; - start reading from track 0 sector 11, not sector 1 as expected
; - bytes at the end of the sector are unknown (not a timestamp)
