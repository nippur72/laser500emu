A200: 3E 07                             ld      a,07h
A202: D3 43                             out     (43h),a ; 'C'
A204: 21 FF FF                          ld      hl,0FFFFh
A207: 7E                                ld      a,(hl)
A208: 2F                                cpl
A209: 77                                ld      (hl),a
A20A: BE                                cp      (hl)
A20B: 20 62                             jr      nz,LA26F
A20D: 31 FF 9F                   LA20D: ld      sp,9FFFh
A210: 06 25                             ld      b,25h   ; '%'
A212: 16 00                             ld      d,00h
A214: 1E 0B                             ld      e,0Bh
A216: 21 00 C4                          ld      hl,0C400h
A219: D5                         LA219: push    de
A21A: C5                                push    bc
A21B: E5                                push    hl
A21C: 22 0B 86                          ld      (860Bh),hl
A21F: 21 5F A2                          ld      hl,0A25Fh
A222: 16 00                             ld      d,00h
A224: 19                                add     hl,de
A225: 7E                                ld      a,(hl)
A226: 32 09 86                          ld      (8609h),a
A229: CD 33 00                          call    0033h
A22C: 38 DF                             jr      c,LA20D
A22E: E1                                pop     hl
A22F: 11 00 01                          ld      de,0100h
A232: 19                                add     hl,de
A233: C1                                pop     bc
A234: 05                                dec     b
A235: 28 10                             jr      z,LA247
A237: D1                                pop     de
A238: 1C                                inc     e
A239: 7B                                ld      a,e
A23A: FE 10                             cp      10h
A23C: 38 DB                             jr      c,LA219
A23E: 1E 00                             ld      e,00h
A240: 14                                inc     d
A241: 7A                                ld      a,d
A242: 32 08 86                          ld      (8608h),a
A245: 18 D2                             jr      LA219

A247: 3E 04                      LA247: ld      a,04h
A249: D3 40                             out     (40h),a ; '@'
A24B: C3 4E 22                          jp      224Eh

A24E: 3C                         LA24E: inc     a
A24F: D3 41                             out     (41h),a ; 'A'
A251: 3C                                inc     a
A252: D3 42                             out     (42h),a ; 'B'
A254: 3E 01                             ld      a,01h
A256: D3 44                             out     (44h),a ; 'D'
A258: 3E F0                             ld      a,0F0h
A25A: D3 45                             out     (45h),a ; 'E'
A25C: C3 00 DA                          jp      0DA00h

A25F: 00                         LA25F: nop
A260: 02                                ld      (bc),a
A261: 04                                inc     b
A262: 06 08                             ld      b,08h
A264: 0A                                ld      a,(bc)
A265: 0C                                inc     c
A266: 0E 01                             ld      c,01h
A268: 03                                inc     bc
A269: 05                                dec     b
A26A: 07                                rlca
A26B: 09                                add     hl,bc
A26C: 0B                                dec     bc
A26D: 0D                                dec     c
A26E: 0F                                rrca
A26F: 3E 05                      LA26F: ld      a,05h
A271: D3 43                             out     (43h),a ; 'C'
A273: 21 81 A2                          ld      hl,0A281h
A276: 7E                         LA276: ld      a,(hl)
A277: B7                                or      a
A278: C8                                ret     z
A279: E5                                push    hl
A27A: CD 3B 00                          call    003Bh
A27D: E1                                pop     hl
A27E: 23                                inc     hl
A27F: 18 F5                             jr      LA276

A281: 49                         LA281: ld      c,c
A282: 4E                                ld      c,(hl)
A283: 53                                ld      d,e
A284: 55                                ld      d,l
A285: 46                                ld      b,(hl)
A286: 46                                ld      b,(hl)
A287: 49                                ld      c,c
A288: 43                                ld      b,e
A289: 49                                ld      c,c
A28A: 45                                ld      b,l
A28B: 4E                                ld      c,(hl)
A28C: 54                                ld      d,h
A28D: 20 4D                             jr      nz,LA2DC
A28F: 45                                ld      b,l
A290: 4D                                ld      c,l
A291: 4F                                ld      c,a
A292: 52                                ld      d,d
A293: 59                                ld      e,c
A294: 00                                nop
A295: 00                                nop
A296: 00                                nop
A297: 00                                nop
A298: 00                                nop
A299: 00                                nop
A29A: 00                                nop
A29B: 00                                nop
A29C: 00                                nop
A29D: 00                                nop
A29E: 00                                nop
A29F: 00                                nop
A2A0: 00                                nop
A2A1: 00                                nop
A2A2: 00                                nop
A2A3: 00                                nop
A2A4: 00                                nop
A2A5: 00                                nop
A2A6: 00                                nop
A2A7: 00                                nop
A2A8: 00                                nop
A2A9: 00                                nop
A2AA: 00                                nop
A2AB: 00                                nop
A2AC: 00                                nop
A2AD: 00                                nop
A2AE: 00                                nop
A2AF: 00                                nop
A2B0: 00                                nop
A2B1: 00                                nop
A2B2: 00                                nop
A2B3: 00                                nop
A2B4: 00                                nop
A2B5: 00                                nop
A2B6: 00                                nop
A2B7: 00                                nop
A2B8: 00                                nop
A2B9: 00                                nop
A2BA: 00                                nop
A2BB: 00                                nop
A2BC: 00                                nop
A2BD: 00                                nop
A2BE: 00                                nop
A2BF: 00                                nop
A2C0: 00                                nop
A2C1: 00                                nop
A2C2: 00                                nop
A2C3: 00                                nop
A2C4: 00                                nop
A2C5: 00                                nop
A2C6: 00                                nop
A2C7: 00                                nop
A2C8: 00                                nop
A2C9: 00                                nop
A2CA: 00                                nop
A2CB: 00                                nop
A2CC: 00                                nop
A2CD: 00                                nop
A2CE: 00                                nop
A2CF: 00                                nop
A2D0: 00                                nop
A2D1: 00                                nop
A2D2: 00                                nop
A2D3: 00                                nop
A2D4: 00                                nop
A2D5: 00                                nop
A2D6: 00                                nop
A2D7: 00                                nop
A2D8: 00                                nop
A2D9: 00                                nop
A2DA: 00                                nop
A2DB: 00                                nop
A2DC: 00                         LA2DC: nop
A2DD: 00                                nop
A2DE: 00                                nop
A2DF: 00                                nop
A2E0: 00                                nop
A2E1: 00                                nop
A2E2: 00                                nop
A2E3: 00                                nop
A2E4: 00                                nop
A2E5: 00                                nop
A2E6: 00                                nop
A2E7: 00                                nop
A2E8: 00                                nop
A2E9: 00                                nop
A2EA: 00                                nop
A2EB: 00                                nop
A2EC: 00                                nop
A2ED: 00                                nop
A2EE: 00                                nop
A2EF: 00                                nop
A2F0: 00                                nop
A2F1: 00                                nop
A2F2: 00                                nop
A2F3: 00                                nop
A2F4: 00                                nop
A2F5: 00                                nop
A2F6: 00                                nop
A2F7: 00                                nop
A2F8: F4 AA D6                          call    p,0D6AAh
A2FB: BA                                cp      d
A2FC: 00                                nop
A2FD: F4 00 D4                          call    p,0D400h

references to external address 0033h:
        A229 call 0033h

references to external address 003Bh:
        A27A call 003Bh

references to external address 224Eh:
        A24B jp 224Eh

references to external address 8608h:
        A242 ld (8608h),a

references to external address 8609h:
        A226 ld (8609h),a

references to external address 860Bh:
        A21C ld (860Bh),hl

references to external address 0D400h:
        A2FD call p,0D400h

references to external address 0D6AAh:
        A2F8 call p,0D6AAh

references to external address 0DA00h:
        A25C jp 0DA00h

possible references to internal address A25F:
        A21F ld hl,0A25Fh

possible references to internal address A281:
        A273 ld hl,0A281h

possible references to external address 0100h:
        A22F ld de,0100h

possible references to external address 9FFFh:
        A20D ld sp,9FFFh

possible references to external address 0C400h:
        A216 ld hl,0C400h

possible references to external address 0FFFFh:
        A204 ld hl,0FFFFh

references to port 40h
        A249 out (40h),a

references to port 41h
        A24F out (41h),a

references to port 42h
        A252 out (42h),a

references to port 43h
        A202 out (43h),a
        A271 out (43h),a

references to port 44h
        A256 out (44h),a

references to port 45h
        A25A out (45h),a

Procedures (0):
  Proc  Length  References Dependants

Call Graph:
