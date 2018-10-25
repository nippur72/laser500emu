; DOS BASIC 1.0 BOOT LOADER
;
; This resides on the first sector (track 0, sector 0)
; and it is loaded in memory at the address $A200
;
; The loader basically loads the first 22 sectors from
; the disk and places them at 5E00 in page 6 bank 2
; from $5E00 to $5E00 + $2200 = $8000

   defc SECTORBUF = $860b
   defc SECTOR = $8609
   defc TRACK = $8608

   org 0xa200
boot:
   ; switch page 6 on bank 3
   ld      a,$06                           ;[a200] 3e 06
   out     ($43),a                         ;[a202] d3 43

   ; tries to complement the last byte on the memory bank to see if it's ram
   ; if it's not then it's laser 350 and go to print error message
   ld      hl,$ffff                        ;[a204] 21 ff ff
   ld      a,(hl)                          ;[a207] 7e
   cpl                                     ;[a208] 2f
   ld      (hl),a                          ;[a209] 77
   cp      (hl)                            ;[a20a] be
   jr      nz, LA27D_no_ram                ;[a20b] 20 70

   ; prints "DOS BASIC 1.0"
   ld      hl, LA2AE_MESSAGE               ;[a20d] 21 ae a2
   call    PRINT_MESSAGE                   ;[a210] cd 87 a2

LA213_retry:
   ld      sp,$9fff                        ;[a213] 31 ff 9f

   ; prepare parameters for calling $0033 (READDSK)   
   ld      b,$22                           ; B=34 number of sector to read 
   ld      de,$0000                        ; DE=Track|Sector               
   ld      hl,$de00                        ; HL=0xde00 dest. address       

loop:
   push    de                              ;[a21e] d5
   push    bc                              ;[a21f] c5
   push    hl                              ;[a220] e5

   ; read disk sector 0 and retry if fails
   ld      (SECTORBUF),hl                  ; 0x860b = read sector buffer result

   ld      hl, LA2C2_SECTOR_NUMBERING      ; 
   ld      d,$00                           ; converts physical sector into logical
   add     hl,de                           ; and writes in 0x8609
   ld      a,(hl)                          ; a = LA2C2_SECTOR_NUMBERING[e]
   ld      (SECTOR),a                      ; 

   call    $0033                           ; read disk sector pointed by TRACK/SECTOR and
   jr      c, LA213_retry                  ; writes it in SECTORBUF. CF=1 failed read

   pop     hl                              ; HL = HL + 256
   ld      de,$0100                        ; increments the memory destination
   add     hl,de                           ; 
   pop     bc                              ; 
   dec     b                               ; decrement sector count
   jr      z, finished_read                ; if count == 0 then goto finished_read

   ; increment track, sector
   pop     de                              ;
   inc     e                               ; e++; increment sector
   ld      a,e                             ;
   cp      $10                             ; if sector<10 then goto loop
   jr      c, loop                         ;  
   ld      e,$00                           ; sector = 0
   inc     d                               ; increment track
   ld      a,d                             ;
   ld      (TRACK),a                       ; update track
   jr      loop                            ; 

finished_read:   

   ; when arrived here, it has read 22 consecutive sectors
   ; starting from track 0 sector 0, and put them in memory at 0xde00 (in page 6)

   ; restore page 5
   ld      a,$05                           ;[a24c] 3e 05
   ld      ($8668),a                       ;[a24e] 32 68 86
   out     ($43),a                         ;[a251] d3 43

   ; sets sp, TOPMEM and saves sp into $83d8
   ld      iy,$fe60                        ;[a253] fd 21 60 fe
   ld      hl,$faff                        ;[a257] 21 ff fa
   ld      ($803d),hl                      ;[a25a] 22 3d 80
   ld      sp,hl                           ;[a25d] f9
   ld      ($83d8),hl                      ;[a25e] 22 d8 83

   ; sets MEMSIZ pointer
   ld      de,$fe00                        ;[a261] 11 00 fe
   add     hl,de                           ;[a264] 19
   ld      ($839d),hl                      ;[a265] 22 9d 83

   ; ?? call unid routine 0x8041 = TXTTAB start of basic
   ld      de,$8041                        ;[a268] 11 41 80
   push    hl                              ;[a26b] e5
   call    $5ec1                           ;[a26c] cd c1 5e
   pop     hl                              ;[a26f] e1

   ; fix FRETOP pointer
   ld      ($83c2),hl                      ;[a270] 22 c2 83

   ; switches page 6 on bank 1
   ld      a,$06                           ;[a273] 3e 06
   ld      ($8666),a                       ;[a275] 32 66 86
   out     ($41),a                         ;[a278] d3 41

   ; continues from here in DOS, page 6 mapped on bank 2
   jp      $5f2d                           ;[a27a] c3 2d 5f

LA27D_no_ram:
   ; switch back to page 5 in bank 3
   ld      a,$05                           ;[a27d] 3e 05
   ld      ($8668),a                       ;[a27f] 32 68 86
   out     ($43),a                         ;[a282] d3 43

   ; prints "INSUFFICIENT MEMORY FOR DOS"
   ld      hl, LA292_MESSAGE               ;[a284] 21 92 a2

   PRINT_MESSAGE:   
      ld      a,(hl)                       ; a = peek(HL)
      or      a                            ; 
      ret     z                            ; if a=0 then return; // 0 termination string
      push    hl                           ; 
      call    $000b                        ; CHROUT
      pop     hl                           ; 
      inc     hl                           ; 
   jr PRINT_MESSAGE                        ; 
   
   ; there's missing RET here, most likely a bug

LA292_MESSAGE:
   ; "INSUFFICIENT MEMORY FOR DOS"
   defb $49
   defb $4e
   defb $53
   defb $55
   defb $46
   defb $46
   defb $49
   defb $43
   defb $49
   defb $45
   defb $4e
   defb $54
   defb $4d
   defb $45
   defb $4d
   defb $4f
   defb $52
   defb $59
   defb $46
   defb $4f
   defb $52
   defb $44
   defb $4f
   defb $53
   defb $00

LA2AE_MESSAGE:
   ; "DOS BASIC 1.0" 
   defb $1c
   defb $0a
   defb $44
   defb $4f
   defb $53
   defb $20 
   defb $42
   defb $41
   defb $53
   defb $49
   defb $43
   defb $20 
   defb $56
   defb $31 
   defb $2e 
   defb $30
   defb $0a
   defb $0a
   defb $0d
   defb $00

LA2C2_SECTOR_NUMBERING:
   defb $00
   defb $03
   defb $06 
   defb $09
   defb $0c
   defb $0f
   defb $02
   defb $05
   defb $08
   defb $0b
   defb $0e 
   defb $01
   defb $04
   defb $07
   defb $0a
   defb $0d

   nop                                     ;[a2d2] 00
   nop                                     ;[a2d3] 00
   nop                                     ;[a2d4] 00
   nop                                     ;[a2d5] 00
   nop                                     ;[a2d6] 00
   nop                                     ;[a2d7] 00
   nop                                     ;[a2d8] 00
   nop                                     ;[a2d9] 00
   nop                                     ;[a2da] 00
   nop                                     ;[a2db] 00
   nop                                     ;[a2dc] 00
   nop                                     ;[a2dd] 00
   nop                                     ;[a2de] 00
   nop                                     ;[a2df] 00
   nop                                     ;[a2e0] 00
   nop                                     ;[a2e1] 00
   nop                                     ;[a2e2] 00
   nop                                     ;[a2e3] 00
   nop                                     ;[a2e4] 00
   nop                                     ;[a2e5] 00
   nop                                     ;[a2e6] 00
   nop                                     ;[a2e7] 00
   nop                                     ;[a2e8] 00
   nop                                     ;[a2e9] 00
   nop                                     ;[a2ea] 00
   nop                                     ;[a2eb] 00
   nop                                     ;[a2ec] 00
   nop                                     ;[a2ed] 00
   nop                                     ;[a2ee] 00
   nop                                     ;[a2ef] 00
   nop                                     ;[a2f0] 00
   nop                                     ;[a2f1] 00
   nop                                     ;[a2f2] 00
   nop                                     ;[a2f3] 00
   nop                                     ;[a2f4] 00
   nop                                     ;[a2f5] 00
   nop                                     ;[a2f6] 00
   nop                                     ;[a2f7] 00
   nop                                     ;[a2f8] 00
   nop                                     ;[a2f9] 00
   nop                                     ;[a2fa] 00
   nop                                     ;[a2fb] 00
   nop                                     ;[a2fc] 00

   ; easter egg: build date 17/01/86
   defb $17, $01, $86

