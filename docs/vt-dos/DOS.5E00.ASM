   ; DOS BASIC 1.0 for Laser 500/700
   ;
   ; this is placed in page 6
   ; and usually mapped in bank 2
   ;
   ; It is loaded from disk from the first 22 sectors
   ; Note: it also contains the boot sector itself (I guess
   ; to be able to INIT disks with the whole system)   
   ;
   org $5e00

boot_sector:   
   ld      a,$06                           ;[5e00] 3e 06
   out     ($43),a                         ;[5e02] d3 43
   ld      hl,$ffff                        ;[5e04] 21 ff ff
   ld      a,(hl)                          ;[5e07] 7e
   cpl                                     ;[5e08] 2f
   ld      (hl),a                          ;[5e09] 77
   cp      (hl)                            ;[5e0a] be
   jr      nz,$5e7d                        ;[5e0b] 20 70
   ld      hl,$a2ae                        ;[5e0d] 21 ae a2
   call    $a287                           ;[5e10] cd 87 a2
   ld      sp,$9fff                        ;[5e13] 31 ff 9f
   ld      b,$22                           ;[5e16] 06 22
   ld      de,$0000                        ;[5e18] 11 00 00
   ld      hl,$de00                        ;[5e1b] 21 00 de
   push    de                              ;[5e1e] d5
   push    bc                              ;[5e1f] c5
   push    hl                              ;[5e20] e5
   ld      ($860b),hl                      ;[5e21] 22 0b 86
   ld      hl,$a2c2                        ;[5e24] 21 c2 a2
   ld      d,$00                           ;[5e27] 16 00
   add     hl,de                           ;[5e29] 19
   ld      a,(hl)                          ;[5e2a] 7e
   ld       ($8609),a                      ;[5e2b] 32 09 86
   call    $0033                           ;[5e2e] cd 33 00
   jr      c,$5e13                         ;[5e31] 38 e0
   pop     hl                              ;[5e33] e1
   ld      de,$0100                        ;[5e34] 11 00 01
   add     hl,de                           ;[5e37] 19
   pop     bc                              ;[5e38] c1
   dec     b                               ;[5e39] 05
   jr      z,$5e4c                         ;[5e3a] 28 10
   pop     de                              ;[5e3c] d1
   inc     e                               ;[5e3d] 1c
   ld      a,e                             ;[5e3e] 7b
   cp      $10                             ;[5e3f] fe 10
   jr      c,$5e1e                         ;[5e41] 38 db
   ld      e,$00                           ;[5e43] 1e 00
   inc     d                               ;[5e45] 14
   ld      a,d                             ;[5e46] 7a
   ld       ($8608),a                      ;[5e47] 32 08 86
   jr      $5e1e                           ;[5e4a] 18 d2
   ld      a,$05                           ;[5e4c] 3e 05
   ld       ($8668),a                      ;[5e4e] 32 68 86
   out     ($43),a                         ;[5e51] d3 43
   ld      iy,$fe60                        ;[5e53] fd 21 60 fe
   ld      hl,$faff                        ;[5e57] 21 ff fa
   ld      ($803d),hl                      ;[5e5a] 22 3d 80
   ld      sp,hl                           ;[5e5d] f9
   ld      ($83d8),hl                      ;[5e5e] 22 d8 83
   ld      de,$fe00                        ;[5e61] 11 00 fe
   add     hl,de                           ;[5e64] 19
   ld      ($839d),hl                      ;[5e65] 22 9d 83
   ld      de,$8041                        ;[5e68] 11 41 80
   push    hl                              ;[5e6b] e5
   call    $5ec1                           ;[5e6c] cd c1 5e
   pop     hl                              ;[5e6f] e1
   ld      ($83c2),hl                      ;[5e70] 22 c2 83
   ld      a,$06                           ;[5e73] 3e 06
   ld       ($8666),a                      ;[5e75] 32 66 86
   out     ($41),a                         ;[5e78] d3 41
   jp      $5f2d                           ;[5e7a] c3 2d 5f
   ld      a,$05                           ;[5e7d] 3e 05
   ld       ($8668),a                      ;[5e7f] 32 68 86
   out     ($43),a                         ;[5e82] d3 43
   ld      hl,$a292                        ;[5e84] 21 92 a2
   ld      a,(hl)                          ;[5e87] 7e
   or      a                               ;[5e88] b7
   ret     z                               ;[5e89] c8
   push    hl                              ;[5e8a] e5
   call    $000b                           ;[5e8b] cd 0b 00
   pop     hl                              ;[5e8e] e1
   inc     hl                              ;[5e8f] 23
   jr      $5e87                           ;[5e90] 18 f5
   ld      c,c                             ;[5e92] 49
   ld      c,(hl)                          ;[5e93] 4e
   ld      d,e                             ;[5e94] 53
   ld      d,l                             ;[5e95] 55
   ld      b,(hl)                          ;[5e96] 46
   ld      b,(hl)                          ;[5e97] 46
   ld      c,c                             ;[5e98] 49
   ld      b,e                             ;[5e99] 43
   ld      c,c                             ;[5e9a] 49
   ld      b,l                             ;[5e9b] 45
   ld      c,(hl)                          ;[5e9c] 4e
   ld      d,h                             ;[5e9d] 54
   jr      nz,$5eed                        ;[5e9e] 20 4d
   ld      b,l                             ;[5ea0] 45
   ld      c,l                             ;[5ea1] 4d
   ld      c,a                             ;[5ea2] 4f
   ld      d,d                             ;[5ea3] 52
   ld      e,c                             ;[5ea4] 59
   jr      nz,$5eed                        ;[5ea5] 20 46
   ld      c,a                             ;[5ea7] 4f
   ld      d,d                             ;[5ea8] 52
   jr      nz,$5eef                        ;[5ea9] 20 44
   ld      c,a                             ;[5eab] 4f
   ld      d,e                             ;[5eac] 53
   nop                                     ;[5ead] 00
   inc     e                               ;[5eae] 1c
   ld      a,(bc)                          ;[5eaf] 0a
   ld      b,h                             ;[5eb0] 44
   ld      c,a                             ;[5eb1] 4f
   ld      d,e                             ;[5eb2] 53
   jr      nz,$5ef7                        ;[5eb3] 20 42
   ld      b,c                             ;[5eb5] 41
   ld      d,e                             ;[5eb6] 53
   ld      c,c                             ;[5eb7] 49
   ld      b,e                             ;[5eb8] 43
   jr      nz,$5f11                        ;[5eb9] 20 56
   ld      sp,$302e                        ;[5ebb] 31 2e 30
   ld      a,(bc)                          ;[5ebe] 0a
   ld      a,(bc)                          ;[5ebf] 0a
   dec     c                               ;[5ec0] 0d
   nop                                     ;[5ec1] 00
   nop                                     ;[5ec2] 00
   inc     bc                              ;[5ec3] 03
   ld      b,$09                           ;[5ec4] 06 09
   inc     c                               ;[5ec6] 0c
   rrca                                    ;[5ec7] 0f
   ld      (bc),a                          ;[5ec8] 02
   dec     b                               ;[5ec9] 05
   ex      af,af'                          ;[5eca] 08
   dec     bc                              ;[5ecb] 0b
   ld      c,$01                           ;[5ecc] 0e 01
   inc     b                               ;[5ece] 04
   rlca                                    ;[5ecf] 07
   ld      a,(bc)                          ;[5ed0] 0a
   dec     c                               ;[5ed1] 0d
   nop                                     ;[5ed2] 00
   nop                                     ;[5ed3] 00
   nop                                     ;[5ed4] 00
   nop                                     ;[5ed5] 00
   nop                                     ;[5ed6] 00
   nop                                     ;[5ed7] 00
   nop                                     ;[5ed8] 00
   nop                                     ;[5ed9] 00
   nop                                     ;[5eda] 00
   nop                                     ;[5edb] 00
   nop                                     ;[5edc] 00
   nop                                     ;[5edd] 00
   nop                                     ;[5ede] 00
   nop                                     ;[5edf] 00
   nop                                     ;[5ee0] 00
   nop                                     ;[5ee1] 00
   nop                                     ;[5ee2] 00
   nop                                     ;[5ee3] 00
   nop                                     ;[5ee4] 00
   nop                                     ;[5ee5] 00
   nop                                     ;[5ee6] 00
   nop                                     ;[5ee7] 00
   nop                                     ;[5ee8] 00
   nop                                     ;[5ee9] 00
   nop                                     ;[5eea] 00
   nop                                     ;[5eeb] 00
   nop                                     ;[5eec] 00
   nop                                     ;[5eed] 00
   nop                                     ;[5eee] 00
   nop                                     ;[5eef] 00
   nop                                     ;[5ef0] 00
   nop                                     ;[5ef1] 00
   nop                                     ;[5ef2] 00
   nop                                     ;[5ef3] 00
   nop                                     ;[5ef4] 00
   nop                                     ;[5ef5] 00
   nop                                     ;[5ef6] 00
   nop                                     ;[5ef7] 00
   nop                                     ;[5ef8] 00
   nop                                     ;[5ef9] 00
   nop                                     ;[5efa] 00
   nop                                     ;[5efb] 00
   nop                                     ;[5efc] 00
   rla                                     ;[5efd] 17
   ld      bc,$c386                        ;[5efe] 01 86 

SECTOR1:   
   jp      $7bbc                           ;[5f00] c3 bc 7b
   jp      $7bd5                           ;[5f03] c3 d5 7b
   jp      $6206                           ;[5f06] c3 06 62
   jp      $678b                           ;[5f09] c3 8b 67
   jp      $67b8                           ;[5f0c] c3 b8 67
   jp      $67c5                           ;[5f0f] c3 c5 67
   jp      $65db                           ;[5f12] c3 db 65
   jp      $774b                           ;[5f15] c3 4b 77
   jp      $779d                           ;[5f18] c3 9d 77
   jp      $7a97                           ;[5f1b] c3 97 7a
   jp      $7aea                           ;[5f1e] c3 ea 7a
   jp      $790a                           ;[5f21] c3 0a 79
   jp      $7887                           ;[5f24] c3 87 78
   jp      $6408                           ;[5f27] c3 08 64
   jp      $64a4                           ;[5f2a] c3 a4 64

; the boot loader enters here, iy = $fe60
ENTRY:
   ld      a,($8612)                       ;[5f2d] 3a 12 86
   ld      (iy+$43),a                      ;[5f30] fd 77 43
   ld      (iy+$11),$14                    ;[5f33] fd 36 14 11
   ld      (iy+$40),$0b                    ;[5f37] fd 36 0b 40
   call    $7bd5                           ;[5f3b] cd d5 7b
   ld      (iy+$00),$7d                    ;[5f3e] fd 36 7d 00
   ld      (iy+$02),$7f                    ;[5f42] fd 36 7f 02
   ld      (iy+$00),$17                    ;[5f46] fd 36 17 00
   ld      (iy+$00),$2c                    ;[5f4a] fd 36 2c 00
   ld      (iy+$00),$48                    ;[5f4e] fd 36 48 00
   ld      hl,$8000                        ;[5f52] 21 00 80
   ld      (hl),$c3                        ;[5f55] 36 c3
   inc     hl                              ;[5f57] 23
   ld      de,$6064                        ;[5f58] 11 64 60
   ld      (hl),e                          ;[5f5b] 73
   inc     hl                              ;[5f5c] 23
   ld      (hl),d                          ;[5f5d] 72
   inc     hl                              ;[5f5e] 23
   ld      (hl),$c3                        ;[5f5f] 36 c3
   inc     hl                              ;[5f61] 23
   ld      de,$003b                        ;[5f62] 11 3b 00
   ld      (hl),e                          ;[5f65] 73
   inc     hl                              ;[5f66] 23
   ld      (hl),d                          ;[5f67] 72
   inc     hl                              ;[5f68] 23
   ld      (hl),$c3                        ;[5f69] 36 c3
   inc     hl                              ;[5f6b] 23
   ld      de,$ff3b                        ;[5f6c] 11 3b ff
   ld      (hl),e                          ;[5f6f] 73
   inc     hl                              ;[5f70] 23
   ld      (hl),d                          ;[5f71] 72
   ld      a,$c3                           ;[5f72] 3e c3
   ld       ($85c4),a                      ;[5f74] 32 c4 85
   ld      de,$ff1c                        ;[5f77] 11 1c ff
   ld      hl,$85c5                        ;[5f7a] 21 c5 85
   ld      (hl),e                          ;[5f7d] 73
   inc     hl                              ;[5f7e] 23
   ld      (hl),d                          ;[5f7f] 72
   ld      hl,$5fa4                        ;[5f80] 21 a4 5f
   ld      de,$fee0                        ;[5f83] 11 e0 fe
   ld      bc,$00cd                        ;[5f86] 01 cd 00
   ldir                                    ;[5f89] ed b0
   ld      hl,$7bf5                        ;[5f8b] 21 f5 7b
   ld      de,$fb00                        ;[5f8e] 11 00 fb
   ld      bc,$0040                        ;[5f91] 01 40 00
   ldir                                    ;[5f94] ed b0
   ld      hl,$7c45                        ;[5f96] 21 45 7c
   ld      de,$fb96                        ;[5f99] 11 96 fb
   ld      bc,$006a                        ;[5f9c] 01 6a 00
   ldir                                    ;[5f9f] ed b0
   jp      $ff5a                           ;[5fa1] c3 5a ff

rest:   
   inc     e                               ;[5fa4] 1c
   ld      a,(bc)                          ;[5fa5] 0a
   ld      b,h                             ;[5fa6] 44
   ld      c,a                             ;[5fa7] 4f
   ld      d,e                             ;[5fa8] 53
   jr      nz,$5fed                        ;[5fa9] 20 42
   ld      b,c                             ;[5fab] 41
   ld      d,e                             ;[5fac] 53
   ld      c,c                             ;[5fad] 49
   ld      b,e                             ;[5fae] 43
   jr      nz,$6007                        ;[5faf] 20 56
   ld      sp,$302e                        ;[5fb1] 31 2e 30
   ld      a,(bc)                          ;[5fb4] 0a
   ld      a,(bc)                          ;[5fb5] 0a
   dec     c                               ;[5fb6] 0d
   nop                                     ;[5fb7] 00
   push    af                              ;[5fb8] f5
   ld      a,$00                           ;[5fb9] 3e 00
   ld       ($8665),a                      ;[5fbb] 32 65 86
   out     ($40),a                         ;[5fbe] d3 40
   ld      a,$01                           ;[5fc0] 3e 01
   ld       ($8666),a                      ;[5fc2] 32 66 86
   out     ($41),a                         ;[5fc5] d3 41
   pop     af                              ;[5fc7] f1
   exx                                     ;[5fc8] d9
   ld      e,a                             ;[5fc9] 5f
   cp      $11                             ;[5fca] fe 11
   jr      nz,$5fcf                        ;[5fcc] 20 01
   xor     a                               ;[5fce] af
   jp      (ix)                            ;[5fcf] dd e9
   push    af                              ;[5fd1] f5
   ld      a,$01                           ;[5fd2] 3e 01
   ld       ($8666),a                      ;[5fd4] 32 66 86
   out     ($41),a                         ;[5fd7] d3 41
   pop     af                              ;[5fd9] f1
   pop     hl                              ;[5fda] e1
   pop     de                              ;[5fdb] d1
   ld      b,a                             ;[5fdc] 47
   ex      af,af'                          ;[5fdd] 08
   ld      a,b                             ;[5fde] 78
   ret                                     ;[5fdf] c9
   ld      c,l                             ;[5fe0] 4d
   ld      b,h                             ;[5fe1] 44
   ex      af,af'                          ;[5fe2] 08
   ld      hl,$ff2e                        ;[5fe3] 21 2e ff
   push    hl                              ;[5fe6] e5
   ld      a,$06                           ;[5fe7] 3e 06
   ld       ($8666),a                      ;[5fe9] 32 66 86
   out     ($41),a                         ;[5fec] d3 41
   ld      hl,$6290                        ;[5fee] 21 90 62
   jp      (hl)                            ;[5ff1] e9
   ld      a,$01                           ;[5ff2] 3e 01
   ld       ($8666),a                      ;[5ff4] 32 66 86
   out     ($41),a                         ;[5ff7] d3 41
   pop     bc                              ;[5ff9] c1
   ld      bc,$0056                        ;[5ffa] 01 56 00
   push    bc                              ;[5ffd] c5
   ret                                     ;[5ffe] c9
   push    ix                              ;[5fff] dd e5
   exx                                     ;[6001] d9
   ld      hl,$ff4e                        ;[6002] 21 4e ff
   push    hl                              ;[6005] e5
   push    af                              ;[6006] f5
   ld      a,$01                           ;[6007] 3e 01
   ld       ($8666),a                      ;[6009] 32 66 86
   out     ($41),a                         ;[600c] d3 41
   pop     af                              ;[600e] f1
   exx                                     ;[600f] d9
   jp      (ix)                            ;[6010] dd e9
   push    af                              ;[6012] f5
   ld      a,$06                           ;[6013] 3e 06
   ld       ($8666),a                      ;[6015] 32 66 86
   out     ($41),a                         ;[6018] d3 41
   pop     af                              ;[601a] f1
   pop     ix                              ;[601b] dd e1
   ret                                     ;[601d] c9
   ld      a,$01                           ;[601e] 3e 01
   ld       ($8666),a                      ;[6020] 32 66 86
   out     ($41),a                         ;[6023] d3 41
   im      1                               ;[6025] ed 56
   ei                                      ;[6027] fb
   jp      $0059                           ;[6028] c3 59 00
   out     ($41),a                         ;[602b] d3 41
   dec     d                               ;[602d] 15
   jr      nz,$6047                        ;[602e] 20 17
   ld      d,e                             ;[6030] 53
   ld      a,(hl)                          ;[6031] 7e
   xor     $80                             ;[6032] ee 80
   ld      (hl),a                          ;[6034] 77
   ld      bc,$0080                        ;[6035] 01 80 00
   push    bc                              ;[6038] c5
   ld      bc,$0089                        ;[6039] 01 89 00
   dec     bc                              ;[603c] 0b
   ld      a,b                             ;[603d] 78
   or      c                               ;[603e] b1
   jr      nz,$603c                        ;[603f] 20 fb
   pop     bc                              ;[6041] c1
   dec     bc                              ;[6042] 0b
   ld      a,b                             ;[6043] 78
   or      c                               ;[6044] b1
   jr      nz,$6038                        ;[6045] 20 f1
   push    hl                              ;[6047] e5
   push    de                              ;[6048] d5
   call    $001b                           ;[6049] cd 1b 00
   pop     de                              ;[604c] d1
   pop     hl                              ;[604d] e1
   cp      $ff                             ;[604e] fe ff
   jr      nz,$602d                        ;[6050] 20 db
   push    hl                              ;[6052] e5
   push    de                              ;[6053] d5
   call    $0013                           ;[6054] cd 13 00
   pop     de                              ;[6057] d1
   pop     hl                              ;[6058] e1
   push    af                              ;[6059] f5
   ld      a,$06                           ;[605a] 3e 06
   ld       ($8666),a                      ;[605c] 32 66 86
   out     ($41),a                         ;[605f] d3 41
   pop     af                              ;[6061] f1
   ei                                      ;[6062] fb
   ret                                     ;[6063] c9
   ld      a,(hl)                          ;[6064] 7e
   ex      (sp),hl                         ;[6065] e3
   cp      (hl)                            ;[6066] be
   inc     hl                              ;[6067] 23
   ex      (sp),hl                         ;[6068] e3
   jp      z,$003b                         ;[6069] ca 3b 00
   jp      $6267                           ;[606c] c3 67 62
   ld      ix,$003b                        ;[606f] dd 21 3b 00
   rst     $18                             ;[6073] df
   ret                                     ;[6074] c9
   ld      ix,$002b                        ;[6075] dd 21 2b 00
   rst     $18                             ;[6079] df
   ret                                     ;[607a] c9
   ld      a,(hl)                          ;[607b] 7e
   or      a                               ;[607c] b7
   ret     z                               ;[607d] c8
   call    $6075                           ;[607e] cd 75 60
   inc     hl                              ;[6081] 23
   jr      $607b                           ;[6082] 18 f7
   call    z,$e160                         ;[6084] cc 60 e1
   ld      h,b                             ;[6087] 60
   pop     af                              ;[6088] f1
   ld      h,b                             ;[6089] 60
   rlca                                    ;[608a] 07
   ld      h,c                             ;[608b] 61
   ld      d,$61                           ;[608c] 16 61
   ld      h,$61                           ;[608e] 26 61
   ld      sp,$1661                        ;[6090] 31 61 16
   ld      h,c                             ;[6093] 61
   ld      d,$61                           ;[6094] 16 61
   ld      b,h                             ;[6096] 44
   ld      h,c                             ;[6097] 61
   ld      e,b                             ;[6098] 58
   ld      h,c                             ;[6099] 61
   ld      l,h                             ;[609a] 6c
   ld      h,c                             ;[609b] 61
   ld      a,h                             ;[609c] 7c
   ld      h,c                             ;[609d] 61
   adc     (hl)                            ;[609e] 8e
   ld      h,c                             ;[609f] 61
   sbc     h                               ;[60a0] 9c
   ld      h,c                             ;[60a1] 61
   nop                                     ;[60a2] 00
   nop                                     ;[60a3] 00
   xor     e                               ;[60a4] ab
   ld      h,c                             ;[60a5] 61
   cp      l                               ;[60a6] bd
   ld      h,c                             ;[60a7] 61
   rst     $08                             ;[60a8] cf
   ld      h,c                             ;[60a9] 61
   jp      po,$f561                        ;[60aa] e2 61 f5
   ld      h,c                             ;[60ad] 61
   ccf                                     ;[60ae] 3f
   ld      c,c                             ;[60af] 49
   ld      c,(hl)                          ;[60b0] 4e
   ld      d,e                             ;[60b1] 53
   ld      d,l                             ;[60b2] 55
   ld      b,(hl)                          ;[60b3] 46
   ld      b,(hl)                          ;[60b4] 46
   ld      c,c                             ;[60b5] 49
   ld      b,e                             ;[60b6] 43
   ld      c,c                             ;[60b7] 49
   ld      b,l                             ;[60b8] 45
   ld      c,(hl)                          ;[60b9] 4e
   ld      d,h                             ;[60ba] 54
   jr      nz,$610a                        ;[60bb] 20 4d
   ld      b,l                             ;[60bd] 45
   ld      c,l                             ;[60be] 4d
   ld      c,a                             ;[60bf] 4f
   ld      d,d                             ;[60c0] 52
   ld      e,c                             ;[60c1] 59
   jr      nz,$610a                        ;[60c2] 20 46
   ld      c,a                             ;[60c4] 4f
   ld      d,d                             ;[60c5] 52
   jr      nz,$610c                        ;[60c6] 20 44
   ld      c,a                             ;[60c8] 4f
   ld      d,e                             ;[60c9] 53
   dec     c                               ;[60ca] 0d
   nop                                     ;[60cb] 00
   ccf                                     ;[60cc] 3f
   ld      b,(hl)                          ;[60cd] 46
   ld      c,c                             ;[60ce] 49
   ld      c,h                             ;[60cf] 4c
   ld      b,l                             ;[60d0] 45
   jr      nz,$6114                        ;[60d1] 20 41
   ld      c,h                             ;[60d3] 4c
   ld      d,d                             ;[60d4] 52
   ld      b,l                             ;[60d5] 45
   ld      b,c                             ;[60d6] 41
   ld      b,h                             ;[60d7] 44
   ld      e,c                             ;[60d8] 59
   jr      nz,$6120                        ;[60d9] 20 45
   ld      e,b                             ;[60db] 58
   ld      c,c                             ;[60dc] 49
   ld      d,e                             ;[60dd] 53
   ld      d,h                             ;[60de] 54
   ld      d,e                             ;[60df] 53
   nop                                     ;[60e0] 00
   ccf                                     ;[60e1] 3f
   ld      b,h                             ;[60e2] 44
   ld      c,c                             ;[60e3] 49
   ld      d,d                             ;[60e4] 52
   ld      b,l                             ;[60e5] 45
   ld      b,e                             ;[60e6] 43
   ld      d,h                             ;[60e7] 54
   ld      c,a                             ;[60e8] 4f
   ld      d,d                             ;[60e9] 52
   ld      e,c                             ;[60ea] 59
   jr      nz,$6133                        ;[60eb] 20 46
   ld      d,l                             ;[60ed] 55
   ld      c,h                             ;[60ee] 4c
   ld      c,h                             ;[60ef] 4c
   nop                                     ;[60f0] 00
   ccf                                     ;[60f1] 3f
   ld      b,h                             ;[60f2] 44
   ld      c,c                             ;[60f3] 49
   ld      d,e                             ;[60f4] 53
   ld      c,e                             ;[60f5] 4b
   jr      nz,$614f                        ;[60f6] 20 57
   ld      d,d                             ;[60f8] 52
   ld      c,c                             ;[60f9] 49
   ld      d,h                             ;[60fa] 54
   ld      b,l                             ;[60fb] 45
   jr      nz,$614e                        ;[60fc] 20 50
   ld      d,d                             ;[60fe] 52
   ld      c,a                             ;[60ff] 4f
   ld      d,h                             ;[6100] 54
   ld      b,l                             ;[6101] 45
   ld      b,e                             ;[6102] 43
   ld      d,h                             ;[6103] 54
   ld      b,l                             ;[6104] 45
   ld      b,h                             ;[6105] 44
   nop                                     ;[6106] 00
   ccf                                     ;[6107] 3f
   ld      b,(hl)                          ;[6108] 46
   ld      c,c                             ;[6109] 49
   ld      c,h                             ;[610a] 4c
   ld      b,l                             ;[610b] 45
   jr      nz,$615c                        ;[610c] 20 4e
   ld      c,a                             ;[610e] 4f
   ld      d,h                             ;[610f] 54
   jr      nz,$6161                        ;[6110] 20 4f
   ld      d,b                             ;[6112] 50
   ld      b,l                             ;[6113] 45
   ld      c,(hl)                          ;[6114] 4e
   nop                                     ;[6115] 00
   ccf                                     ;[6116] 3f
   ld      b,h                             ;[6117] 44
   ld      c,c                             ;[6118] 49
   ld      d,e                             ;[6119] 53
   ld      c,e                             ;[611a] 4b
   jr      nz,$6166                        ;[611b] 20 49
   cpl                                     ;[611d] 2f
   ld      c,a                             ;[611e] 4f
   jr      nz,$6166                        ;[611f] 20 45
   ld      d,d                             ;[6121] 52
   ld      d,d                             ;[6122] 52
   ld      c,a                             ;[6123] 4f
   ld      d,d                             ;[6124] 52
   nop                                     ;[6125] 00
   ccf                                     ;[6126] 3f
   ld      b,h                             ;[6127] 44
   ld      c,c                             ;[6128] 49
   ld      d,e                             ;[6129] 53
   ld      c,e                             ;[612a] 4b
   jr      nz,$6173                        ;[612b] 20 46
   ld      d,l                             ;[612d] 55
   ld      c,h                             ;[612e] 4c
   ld      c,h                             ;[612f] 4c
   nop                                     ;[6130] 00
   ccf                                     ;[6131] 3f
   ld      b,(hl)                          ;[6132] 46
   ld      c,c                             ;[6133] 49
   ld      c,h                             ;[6134] 4c
   ld      b,l                             ;[6135] 45
   jr      nz,$6179                        ;[6136] 20 41
   ld      c,h                             ;[6138] 4c
   ld      d,d                             ;[6139] 52
   ld      b,l                             ;[613a] 45
   ld      b,c                             ;[613b] 41
   ld      b,h                             ;[613c] 44
   ld      e,c                             ;[613d] 59
   jr      nz,$618f                        ;[613e] 20 4f
   ld      d,b                             ;[6140] 50
   ld      b,l                             ;[6141] 45
   ld      c,(hl)                          ;[6142] 4e
   nop                                     ;[6143] 00
   ccf                                     ;[6144] 3f
   ld      d,l                             ;[6145] 55
   ld      c,(hl)                          ;[6146] 4e
   ld      d,e                             ;[6147] 53
   ld      d,l                             ;[6148] 55
   ld      d,b                             ;[6149] 50
   ld      d,b                             ;[614a] 50
   ld      c,a                             ;[614b] 4f
   ld      d,d                             ;[614c] 52
   ld      d,h                             ;[614d] 54
   ld      b,l                             ;[614e] 45
   ld      b,h                             ;[614f] 44
   jr      nz,$6196                        ;[6150] 20 44
   ld      b,l                             ;[6152] 45
   ld      d,(hl)                          ;[6153] 56
   ld      c,c                             ;[6154] 49
   ld      b,e                             ;[6155] 43
   ld      b,l                             ;[6156] 45
   nop                                     ;[6157] 00
   ccf                                     ;[6158] 3f
   ld      b,(hl)                          ;[6159] 46
   ld      c,c                             ;[615a] 49
   ld      c,h                             ;[615b] 4c
   ld      b,l                             ;[615c] 45
   jr      nz,$61b3                        ;[615d] 20 54
   ld      e,c                             ;[615f] 59
   ld      d,b                             ;[6160] 50
   ld      b,l                             ;[6161] 45
   jr      nz,$61b1                        ;[6162] 20 4d
   ld      c,c                             ;[6164] 49
   ld      d,e                             ;[6165] 53
   ld      c,l                             ;[6166] 4d
   ld      b,c                             ;[6167] 41
   ld      d,h                             ;[6168] 54
   ld      b,e                             ;[6169] 43
   ld      c,b                             ;[616a] 48
   nop                                     ;[616b] 00
   ccf                                     ;[616c] 3f
   ld      b,(hl)                          ;[616d] 46
   ld      c,c                             ;[616e] 49
   ld      c,h                             ;[616f] 4c
   ld      b,l                             ;[6170] 45
   jr      nz,$61c1                        ;[6171] 20 4e
   ld      c,a                             ;[6173] 4f
   ld      d,h                             ;[6174] 54
   jr      nz,$61bd                        ;[6175] 20 46
   ld      c,a                             ;[6177] 4f
   ld      d,l                             ;[6178] 55
   ld      c,(hl)                          ;[6179] 4e
   ld      b,h                             ;[617a] 44
   nop                                     ;[617b] 00
   ccf                                     ;[617c] 3f
   ld      b,h                             ;[617d] 44
   ld      c,c                             ;[617e] 49
   ld      d,e                             ;[617f] 53
   ld      c,e                             ;[6180] 4b
   jr      nz,$61c5                        ;[6181] 20 42
   ld      d,l                             ;[6183] 55
   ld      b,(hl)                          ;[6184] 46
   ld      b,(hl)                          ;[6185] 46
   ld      b,l                             ;[6186] 45
   ld      d,d                             ;[6187] 52
   jr      nz,$61d0                        ;[6188] 20 46
   ld      d,l                             ;[618a] 55
   ld      c,h                             ;[618b] 4c
   ld      c,h                             ;[618c] 4c
   nop                                     ;[618d] 00
   ccf                                     ;[618e] 3f
   ld      c,c                             ;[618f] 49
   ld      c,h                             ;[6190] 4c
   ld      c,h                             ;[6191] 4c
   ld      b,l                             ;[6192] 45
   ld      b,a                             ;[6193] 47
   ld      b,c                             ;[6194] 41
   ld      c,h                             ;[6195] 4c
   jr      nz,$61ea                        ;[6196] 20 52
   ld      b,l                             ;[6198] 45
   ld      b,c                             ;[6199] 41
   ld      b,h                             ;[619a] 44
   nop                                     ;[619b] 00
   ccf                                     ;[619c] 3f
   ld      c,c                             ;[619d] 49
   ld      c,h                             ;[619e] 4c
   ld      c,h                             ;[619f] 4c
   ld      b,l                             ;[61a0] 45
   ld      b,a                             ;[61a1] 47
   ld      b,c                             ;[61a2] 41
   ld      c,h                             ;[61a3] 4c
   jr      nz,$61fd                        ;[61a4] 20 57
   ld      d,d                             ;[61a6] 52
   ld      c,c                             ;[61a7] 49
   ld      d,h                             ;[61a8] 54
   ld      b,l                             ;[61a9] 45
   nop                                     ;[61aa] 00
   ccf                                     ;[61ab] 3f
   ld      d,d                             ;[61ac] 52
   ld      b,l                             ;[61ad] 45
   ld      b,e                             ;[61ae] 43
   ld      c,a                             ;[61af] 4f
   ld      d,d                             ;[61b0] 52
   ld      b,h                             ;[61b1] 44
   jr      nz,$6202                        ;[61b2] 20 4e
   ld      c,a                             ;[61b4] 4f
   ld      d,h                             ;[61b5] 54
   jr      nz,$61fe                        ;[61b6] 20 46
   ld      c,a                             ;[61b8] 4f
   ld      d,l                             ;[61b9] 55
   ld      c,(hl)                          ;[61ba] 4e
   ld      b,h                             ;[61bb] 44
   nop                                     ;[61bc] 00
   ccf                                     ;[61bd] 3f
   ld      b,d                             ;[61be] 42
   ld      e,c                             ;[61bf] 59
   ld      d,h                             ;[61c0] 54
   ld      b,l                             ;[61c1] 45
   jr      nz,$61e7                        ;[61c2] 20 23
   jr      nz,$621a                        ;[61c4] 20 54
   ld      c,a                             ;[61c6] 4f
   ld      c,a                             ;[61c7] 4f
   jr      nz,$6216                        ;[61c8] 20 4c
   ld      b,c                             ;[61ca] 41
   ld      d,d                             ;[61cb] 52
   ld      b,a                             ;[61cc] 47
   ld      b,l                             ;[61cd] 45
   nop                                     ;[61ce] 00
   ccf                                     ;[61cf] 3f
   ld      c,c                             ;[61d0] 49
   ld      c,h                             ;[61d1] 4c
   ld      c,h                             ;[61d2] 4c
   ld      b,l                             ;[61d3] 45
   ld      b,a                             ;[61d4] 47
   ld      b,c                             ;[61d5] 41
   ld      c,h                             ;[61d6] 4c
   jr      nz,$6229                        ;[61d7] 20 50
   ld      b,c                             ;[61d9] 41
   ld      d,d                             ;[61da] 52
   ld      b,c                             ;[61db] 41
   ld      c,l                             ;[61dc] 4d
   ld      b,l                             ;[61dd] 45
   ld      d,h                             ;[61de] 54
   ld      b,l                             ;[61df] 45
   ld      d,d                             ;[61e0] 52
   nop                                     ;[61e1] 00
   ccf                                     ;[61e2] 3f
   ld      d,a                             ;[61e3] 57
   ld      d,d                             ;[61e4] 52
   ld      c,a                             ;[61e5] 4f
   ld      c,(hl)                          ;[61e6] 4e
   ld      b,a                             ;[61e7] 47
   jr      nz,$623c                        ;[61e8] 20 52
   ld      b,l                             ;[61ea] 45
   ld      b,e                             ;[61eb] 43
   ld      c,a                             ;[61ec] 4f
   ld      d,d                             ;[61ed] 52
   ld      b,h                             ;[61ee] 44
   jr      nz,$6244                        ;[61ef] 20 53
   ld      c,c                             ;[61f1] 49
   ld      e,d                             ;[61f2] 5a
   ld      b,l                             ;[61f3] 45
   nop                                     ;[61f4] 00
   ccf                                     ;[61f5] 3f
   ld      d,l                             ;[61f6] 55
   ld      c,(hl)                          ;[61f7] 4e
   ld      d,d                             ;[61f8] 52
   ld      b,l                             ;[61f9] 45
   ld      b,c                             ;[61fa] 41
   ld      b,h                             ;[61fb] 44
   ld      b,c                             ;[61fc] 41
   ld      b,d                             ;[61fd] 42
   ld      c,h                             ;[61fe] 4c
   ld      b,l                             ;[61ff] 45
   jr      nz,$6246                        ;[6200] 20 44
   ld      b,c                             ;[6202] 41
   ld      d,h                             ;[6203] 54
   ld      b,c                             ;[6204] 41
   nop                                     ;[6205] 00
   push    af                              ;[6206] f5
   call    $7bd5                           ;[6207] cd d5 7b
   ld      a,(iy+$48)                      ;[620a] fd 7e 48
   bit     0,a                             ;[620d] cb 47
   call    nz,$6cb5                        ;[620f] c4 b5 6c
   pop     af                              ;[6212] f1
   or      a                               ;[6213] b7
   jr      z,$6251                         ;[6214] 28 3b
   cp      $11                             ;[6216] fe 11
   jp      z,$625e                         ;[6218] ca 5e 62
   push    af                              ;[621b] f5
   call    $627e                           ;[621c] cd 7e 62
   pop     af                              ;[621f] f1
   cp      $01                             ;[6220] fe 01
   jr      z,$6267                         ;[6222] 28 43
   push    af                              ;[6224] f5
   ld      ix,$5910                        ;[6225] dd 21 10 59
   rst     $18                             ;[6229] df
   pop     af                              ;[622a] f1
   ld      hl,$6080                        ;[622b] 21 80 60
   sla     a                               ;[622e] cb 27
   add     l                               ;[6230] 85
   ld      l,a                             ;[6231] 6f
   ld      a,$00                           ;[6232] 3e 00
   adc     h                               ;[6234] 8c
   ld      h,a                             ;[6235] 67
   ld      e,(hl)                          ;[6236] 5e
   inc     hl                              ;[6237] 23
   ld      d,(hl)                          ;[6238] 56
   ex      de,hl                           ;[6239] eb
   call    $607b                           ;[623a] cd 7b 60
   ld      hl,($803f)                      ;[623d] 2a 3f 80
   ld      ($83da),hl                      ;[6240] 22 da 83
   ld      ($83dc),hl                      ;[6243] 22 dc 83
   inc     hl                              ;[6246] 23
   ld      a,l                             ;[6247] 7d
   or      h                               ;[6248] b4
   dec     hl                              ;[6249] 2b
   jr      z,$6251                         ;[624a] 28 05
   ld      ix,$449f                        ;[624c] dd 21 9f 44
   rst     $18                             ;[6250] df
   ld      bc,$0059                        ;[6251] 01 59 00
   ld      hl,($803d)                      ;[6254] 2a 3d 80
   ld      ix,$5f77                        ;[6257] dd 21 77 5f
   exx                                     ;[625b] d9
   jr      $6272                           ;[625c] 18 14
   ld      a,$11                           ;[625e] 3e 11
   ei                                      ;[6260] fb
   ld      ix,$5961                        ;[6261] dd 21 61 59
   jr      $6274                           ;[6265] 18 0d
   ld      ix,$2228                        ;[6267] dd 21 28 22
   call    $627e                           ;[626b] cd 7e 62
   ld      a,$02                           ;[626e] 3e 02
   jr      $6274                           ;[6270] 18 02
   ld      a,$01                           ;[6272] 3e 01
   ld      hl,$fef4                        ;[6274] 21 f4 fe
   jp      (hl)                            ;[6277] e9
   ld      ix,$005f                        ;[6278] dd 21 5f 00
   jr      $6274                           ;[627c] 18 f6
   ld      de,($803f)                      ;[627e] ed 5b 3f 80
   inc     de                              ;[6282] 13
   ld      a,d                             ;[6283] 7a
   or      e                               ;[6284] b3
   ret     z                               ;[6285] c8
   ld      de,($83e0)                      ;[6286] ed 5b e0 83
   ld      a,d                             ;[628a] 7a
   or      e                               ;[628b] b3
   ret     z                               ;[628c] c8
   jp      $6278                           ;[628d] c3 78 62
   ld      l,c                             ;[6290] 69
   ld      h,b                             ;[6291] 60
   push    hl                              ;[6292] e5
   ld      a,(hl)                          ;[6293] 7e
   or      a                               ;[6294] b7
   jr      nz,$629a                        ;[6295] 20 03
   jp      $6328                           ;[6297] c3 28 63
   jp      p,$632c                         ;[629a] f2 2c 63
   cp      $b7                             ;[629d] fe b7
   jr      nz,$62a3                        ;[629f] 20 02
   jr      $62cb                           ;[62a1] 18 28
   cp      $8a                             ;[62a3] fe 8a
   jr      nz,$62a9                        ;[62a5] 20 02
   jr      $62cb                           ;[62a7] 18 22
   cp      $cb                             ;[62a9] fe cb
   jr      nz,$62af                        ;[62ab] 20 02
   jr      $62cb                           ;[62ad] 18 1c
   cp      $c4                             ;[62af] fe c4
   jr      nz,$62b5                        ;[62b1] 20 02
   jr      $62cb                           ;[62b3] 18 16
   cp      $c1                             ;[62b5] fe c1
   jr      nz,$62bb                        ;[62b7] 20 02
   jr      $62cb                           ;[62b9] 18 10
   cp      $c2                             ;[62bb] fe c2
   jr      nz,$62c1                        ;[62bd] 20 02
   jr      $62cb                           ;[62bf] 18 0a
   cp      $bf                             ;[62c1] fe bf
   jr      nz,$62c7                        ;[62c3] 20 02
   jr      $62cb                           ;[62c5] 18 04
   cp      $c3                             ;[62c7] fe c3
   jr      nz,$6297                        ;[62c9] 20 cc
   push    af                              ;[62cb] f5
   inc     hl                              ;[62cc] 23
   ld      a,(hl)                          ;[62cd] 7e
   or      a                               ;[62ce] b7
   jr      z,$6326                         ;[62cf] 28 55
   cp      $20                             ;[62d1] fe 20
   jr      z,$62cc                         ;[62d3] 28 f7
   cp      $22                             ;[62d5] fe 22
   jr      nz,$6326                        ;[62d7] 20 4d
   pop     af                              ;[62d9] f1
   pop     de                              ;[62da] d1
   cp      $b7                             ;[62db] fe b7
   jr      nz,$62e4                        ;[62dd] 20 05
   ld      bc,$7501                        ;[62df] 01 01 75
   jr      $6322                           ;[62e2] 18 3e
   cp      $8a                             ;[62e4] fe 8a
   jr      nz,$62ed                        ;[62e6] 20 05
   ld      bc,$6766                        ;[62e8] 01 66 67
   jr      $6322                           ;[62eb] 18 35
   cp      $cb                             ;[62ed] fe cb
   jr      nz,$62f6                        ;[62ef] 20 05
   ld      bc,$648d                        ;[62f1] 01 8d 64
   jr      $6322                           ;[62f4] 18 2c
   cp      $c4                             ;[62f6] fe c4
   jr      nz,$62ff                        ;[62f8] 20 05
   ld      bc,$63e2                        ;[62fa] 01 e2 63
   jr      $6322                           ;[62fd] 18 23
   cp      $c1                             ;[62ff] fe c1
   jr      nz,$6308                        ;[6301] 20 05
   ld      bc,$757b                        ;[6303] 01 7b 75
   jr      $6322                           ;[6306] 18 1a
   cp      $c2                             ;[6308] fe c2
   jr      nz,$6311                        ;[630a] 20 05
   ld      bc,$75eb                        ;[630c] 01 eb 75
   jr      $6322                           ;[630f] 18 11
   cp      $bf                             ;[6311] fe bf
   jr      nz,$631a                        ;[6313] 20 05
   ld      bc,$714a                        ;[6315] 01 4a 71
   jr      $6322                           ;[6318] 18 08
   cp      $c3                             ;[631a] fe c3
   jp      nz,$6297                        ;[631c] c2 97 62
   ld      bc,$7102                        ;[631f] 01 02 71
   dec     hl                              ;[6322] 2b
   ex      de,hl                           ;[6323] eb
   jr      $6362                           ;[6324] 18 3c
   pop     af                              ;[6326] f1
   or      a                               ;[6327] b7
   ld      hl,$ff0d                        ;[6328] 21 0d ff
   jp      (hl)                            ;[632b] e9
   ld      de,$6365                        ;[632c] 11 65 63
   ld      b,$ff                           ;[632f] 06 ff
   ld      c,(hl)                          ;[6331] 4e
   ex      de,hl                           ;[6332] eb
   inc     hl                              ;[6333] 23
   or      (hl)                            ;[6334] b6
   jp      p,$6333                         ;[6335] f2 33 63
   inc     b                               ;[6338] 04
   ld      a,(hl)                          ;[6339] 7e
   and     $7f                             ;[633a] e6 7f
   jr      z,$6328                         ;[633c] 28 ea
   cp      c                               ;[633e] b9
   jr      nz,$6333                        ;[633f] 20 f2
   ex      de,hl                           ;[6341] eb
   push    hl                              ;[6342] e5
   inc     de                              ;[6343] 13
   ld      a,(de)                          ;[6344] 1a
   or      a                               ;[6345] b7
   jp      m,$6352                         ;[6346] fa 52 63
   ld      c,a                             ;[6349] 4f
   inc     hl                              ;[634a] 23
   ld      a,(hl)                          ;[634b] 7e
   cp      c                               ;[634c] b9
   jr      z,$6343                         ;[634d] 28 f4
   pop     hl                              ;[634f] e1
   jr      $6331                           ;[6350] 18 df
   ld      a,b                             ;[6352] 78
   pop     bc                              ;[6353] c1
   pop     bc                              ;[6354] c1
   sla     a                               ;[6355] cb 27
   ld      c,a                             ;[6357] 4f
   ld      b,$00                           ;[6358] 06 00
   ex      de,hl                           ;[635a] eb
   ld      hl,$63ba                        ;[635b] 21 ba 63
   add     hl,bc                           ;[635e] 09
   ld      c,(hl)                          ;[635f] 4e
   inc     hl                              ;[6360] 23
   ld      b,(hl)                          ;[6361] 46
   ex      de,hl                           ;[6362] eb
   inc     hl                              ;[6363] 23
   push    bc                              ;[6364] c5
   ret                                     ;[6365] c9
   call    z,$414f                         ;[6366] cc 4f 41
   ld      b,h                             ;[6369] 44
   out     ($41),a                         ;[636a] d3 41
   ld      d,(hl)                          ;[636c] 56
   ld      b,l                             ;[636d] 45
   rst     $08                             ;[636e] cf
   ld      d,b                             ;[636f] 50
   ld      b,l                             ;[6370] 45
   ld      c,(hl)                          ;[6371] 4e
   jp      $4f4c                           ;[6372] c3 4c 4f
   ld      d,e                             ;[6375] 53
   ld      b,l                             ;[6376] 45
   jp      nz,$4153                        ;[6377] c2 53 41
   ld      d,(hl)                          ;[637a] 56
   ld      b,l                             ;[637b] 45
   jp      nz,$4f4c                        ;[637c] c2 4c 4f
   ld      b,c                             ;[637f] 41
   ld      b,h                             ;[6380] 44
   jp      nz,$5552                        ;[6381] c2 52 55
   ld      c,(hl)                          ;[6384] 4e
   call    nz,$5249                        ;[6385] c4 49 52
   push    bc                              ;[6388] c5
   ld      d,d                             ;[6389] 52
   ld      b,c                             ;[638a] 41
   jp      nc,$4e45                        ;[638b] d2 45 4e
   ret                                     ;[638e] c9
   ld      c,(hl)                          ;[638f] 4e
   ld      c,c                             ;[6390] 49
   ld      d,h                             ;[6391] 54
   call    nz,$4952                        ;[6392] c4 52 49
   ld      d,(hl)                          ;[6395] 56
   ld      b,l                             ;[6396] 45
   ret                                     ;[6397] c9
   ld      c,(hl)                          ;[6398] 4e
   inc     hl                              ;[6399] 23
   ret     nc                              ;[639a] d0
   ld      d,d                             ;[639b] 52
   inc     hl                              ;[639c] 23
   call    nz,$4f43                        ;[639d] c4 43 4f
   ld      d,b                             ;[63a0] 50
   ld      e,c                             ;[63a1] 59
   out     ($54),a                         ;[63a2] d3 54
   ld      b,c                             ;[63a4] 41
   ld      d,h                             ;[63a5] 54
   ld      d,l                             ;[63a6] 55
   ld      d,e                             ;[63a7] 53
   rst     $10                             ;[63a8] d7
   ld      d,d                             ;[63a9] 52
   ld      c,c                             ;[63aa] 49
   ld      d,h                             ;[63ab] 54
   ld      b,l                             ;[63ac] 45
   pop     bc                              ;[63ad] c1
   ld      b,e                             ;[63ae] 43
   ld      b,e                             ;[63af] 43
   ld      b,l                             ;[63b0] 45
   ld      d,b                             ;[63b1] 50
   ld      d,h                             ;[63b2] 54
   ret     nc                              ;[63b3] d0
   ld      d,l                             ;[63b4] 55
   ld      d,h                             ;[63b5] 54
   rst     $00                             ;[63b6] c7
   ld      b,l                             ;[63b7] 45
   ld      d,h                             ;[63b8] 54
   add     b                               ;[63b9] 80
   jp      po,$8d63                        ;[63ba] e2 63 8d
   ld      h,h                             ;[63bd] 64
   ld      c,d                             ;[63be] 4a
   ld      (hl),c                          ;[63bf] 71
   ld      (bc),a                          ;[63c0] 02
   ld      (hl),c                          ;[63c1] 71
   rst     $20                             ;[63c2] e7
   ld      h,a                             ;[63c3] 67
   ld      e,c                             ;[63c4] 59
   ld      l,b                             ;[63c5] 68
   add     h                               ;[63c6] 84
   ld      l,b                             ;[63c7] 68
   sub     l                               ;[63c8] 95
   ld      l,c                             ;[63c9] 69
   ld      de,$9b6a                        ;[63ca] 11 6a 9b
   ld      l,b                             ;[63cd] 68
   in      a,($65)                         ;[63ce] db 65
   call    pe,$4a6d                        ;[63d0] ec 6d 4a
   ld      l,(hl)                          ;[63d3] 6e
   inc     sp                              ;[63d4] 33
   ld      l,a                             ;[63d5] 6f
   add     l                               ;[63d6] 85
   ld      l,e                             ;[63d7] 6b
   ret     nc                              ;[63d8] d0
   ld      l,d                             ;[63d9] 6a
   ld      bc,$0a75                        ;[63da] 01 75 0a
   ld      (hl),l                          ;[63dd] 75
   ex      de,hl                           ;[63de] eb
   ld      (hl),l                          ;[63df] 75
   ld      a,e                             ;[63e0] 7b
   ld      (hl),l                          ;[63e1] 75
   call    $774b                           ;[63e2] cd 4b 77
   push    hl                              ;[63e5] e5
   or      a                               ;[63e6] b7
   jp      nz,$6206                        ;[63e7] c2 06 62
   ld      (iy+$54),$09                    ;[63ea] fd 36 09 54
   call    $6408                           ;[63ee] cd 08 64
   or      a                               ;[63f1] b7
   jp      nz,$6206                        ;[63f2] c2 06 62
   ld      hl,$21a8                        ;[63f5] 21 a8 21
   ld      ix,$62d3                        ;[63f8] dd 21 d3 62
   rst     $18                             ;[63fc] df
   ld      hl,($8041)                      ;[63fd] 2a 41 80
   push    hl                              ;[6400] e5
   ld      ix,$23ce                        ;[6401] dd 21 ce 23
   jp      $6272                           ;[6405] c3 72 62
   call    $7aea                           ;[6408] cd ea 7a
   cp      $02                             ;[640b] fe 02
   jp      z,$6413                         ;[640d] ca 13 64
   ld      a,$0d                           ;[6410] 3e 0d
   ret                                     ;[6412] c9
   ld      a,(iy+$09)                      ;[6413] fd 7e 09
   cp      (iy+$0a)                        ;[6416] fd be 0a
   ld      a,$0c                           ;[6419] 3e 0c
   ret     nz                              ;[641b] c0
   ld      a,(de)                          ;[641c] 1a
   inc     de                              ;[641d] 13
   ld      (iy+$12),a                      ;[641e] fd 77 12
   ld      a,(de)                          ;[6421] 1a
   inc     de                              ;[6422] 13
   ld      (iy+$11),a                      ;[6423] fd 77 11
   ex      de,hl                           ;[6426] eb
   ld      e,(hl)                          ;[6427] 5e
   inc     hl                              ;[6428] 23
   ld      d,(hl)                          ;[6429] 56
   inc     hl                              ;[642a] 23
   ld      ($8041),de                      ;[642b] ed 53 41 80
   ld      (iy+$0e),e                      ;[642f] fd 73 0e
   ld      (iy+$0f),d                      ;[6432] fd 72 0f
   ld      e,(hl)                          ;[6435] 5e
   inc     hl                              ;[6436] 23
   ld      d,(hl)                          ;[6437] 56
   ld      ($83e9),de                      ;[6438] ed 53 e9 83
   ld      b,$01                           ;[643c] 06 01
   call    $790a                           ;[643e] cd 0a 79
   or      a                               ;[6441] b7
   jp      nz,$6480                        ;[6442] c2 80 64
   ld      hl,$fc56                        ;[6445] 21 56 fc
   push    hl                              ;[6448] e5
   ld      de,$00fe                        ;[6449] 11 fe 00
   add     hl,de                           ;[644c] 19
   ld      a,(hl)                          ;[644d] 7e
   inc     hl                              ;[644e] 23
   ld      (iy+$12),a                      ;[644f] fd 77 12
   ld      a,(hl)                          ;[6452] 7e
   ld      (iy+$11),a                      ;[6453] fd 77 11
   pop     hl                              ;[6456] e1
   ld      e,(iy+$0e)                      ;[6457] fd 5e 0e
   ld      d,(iy+$0f)                      ;[645a] fd 56 0f
   ld      bc,$00fe                        ;[645d] 01 fe 00
   ld      a,(iy+$12)                      ;[6460] fd 7e 12
   or      (iy+$11)                        ;[6463] fd b6 11
   jr      z,$6472                         ;[6466] 28 0a
   ldir                                    ;[6468] ed b0
   ld      (iy+$0e),e                      ;[646a] fd 73 0e
   ld      (iy+$0f),d                      ;[646d] fd 72 0f
   jr      $643c                           ;[6470] 18 ca
   push    hl                              ;[6472] e5
   ld      hl,($83e9)                      ;[6473] 2a e9 83
   or      a                               ;[6476] b7
   sbc     hl,de                           ;[6477] ed 52
   ld      c,l                             ;[6479] 4d
   ld      b,h                             ;[647a] 44
   pop     hl                              ;[647b] e1
   ldir                                    ;[647c] ed b0
   xor     a                               ;[647e] af
   ret                                     ;[647f] c9
   ld      hl,($8041)                      ;[6480] 2a 41 80
   ld      (hl),$00                        ;[6483] 36 00
   inc     hl                              ;[6485] 23
   ld      (hl),$00                        ;[6486] 36 00
   inc     hl                              ;[6488] 23
   ld      ($83e9),hl                      ;[6489] 22 e9 83
   ret                                     ;[648c] c9
   call    $774b                           ;[648d] cd 4b 77
   push    hl                              ;[6490] e5
   or      a                               ;[6491] b7
   jp      nz,$6206                        ;[6492] c2 06 62
   call    $7be0                           ;[6495] cd e0 7b
   ld      (iy+$54),$09                    ;[6498] fd 36 09 54
   push    hl                              ;[649c] e5
   ld      ix,$004d                        ;[649d] dd 21 4d 00
   rst     $18                             ;[64a1] df
   pop     hl                              ;[64a2] e1
   pop     hl                              ;[64a3] e1
   ld      de,($83e9)                      ;[64a4] ed 5b e9 83
   push    de                              ;[64a8] d5
   ld      de,($8041)                      ;[64a9] ed 5b 41 80
   push    de                              ;[64ad] d5
   push    hl                              ;[64ae] e5
   ld      de,($8041)                      ;[64af] ed 5b 41 80
   ld      (iy+$0e),e                      ;[64b3] fd 73 0e
   ld      (iy+$0f),d                      ;[64b6] fd 72 0f
   call    $678b                           ;[64b9] cd 8b 67
   call    $7a97                           ;[64bc] cd 97 7a
   or      a                               ;[64bf] b7
   jp      nz,$65af                        ;[64c0] c2 af 65
   call    $7aea                           ;[64c3] cd ea 7a
   cp      $02                             ;[64c6] fe 02
   jp      z,$65af                         ;[64c8] ca af 65
   cp      $03                             ;[64cb] fe 03
   jp      z,$65af                         ;[64cd] ca af 65
   ld      a,(iy+$16)                      ;[64d0] fd 7e 16
   or      (iy+$15)                        ;[64d3] fd b6 15
   jp      z,$6579                         ;[64d6] ca 79 65
   ld      d,(iy+$16)                      ;[64d9] fd 56 16
   ld      e,(iy+$15)                      ;[64dc] fd 5e 15
   ld      (iy+$12),d                      ;[64df] fd 72 12
   ld      (iy+$11),e                      ;[64e2] fd 73 11
   call    $7a97                           ;[64e5] cd 97 7a
   or      a                               ;[64e8] b7
   jp      nz,$6206                        ;[64e9] c2 06 62
   call    $67aa                           ;[64ec] cd aa 67
   ld      l,(iy+$0e)                      ;[64ef] fd 6e 0e
   ld      h,(iy+$0f)                      ;[64f2] fd 66 0f
   push    hl                              ;[64f5] e5
   ld      de,($83e9)                      ;[64f6] ed 5b e9 83
   or      a                               ;[64fa] b7
   sbc     hl,de                           ;[64fb] ed 52
   jp      nc,$6530                        ;[64fd] d2 30 65
   ld      de,$00fe                        ;[6500] 11 fe 00
   add     hl,de                           ;[6503] 19
   jp      c,$6573                         ;[6504] da 73 65
   ld      de,($83e9)                      ;[6507] ed 5b e9 83
   add     hl,de                           ;[650b] 19
   ld      (iy+$0e),l                      ;[650c] fd 75 0e
   ld      (iy+$0f),h                      ;[650f] fd 74 0f
   pop     hl                              ;[6512] e1
   ld      de,$fc56                        ;[6513] 11 56 fc
   ld      bc,$00fe                        ;[6516] 01 fe 00
   ldir                                    ;[6519] ed b0
   ld      a,(iy+$16)                      ;[651b] fd 7e 16
   ld      (de),a                          ;[651e] 12
   inc     de                              ;[651f] 13
   ld      a,(iy+$15)                      ;[6520] fd 7e 15
   ld      (de),a                          ;[6523] 12
   ld      b,$00                           ;[6524] 06 00
   call    $790a                           ;[6526] cd 0a 79
   or      a                               ;[6529] b7
   jp      nz,$65af                        ;[652a] c2 af 65
   jp      $64d0                           ;[652d] c3 d0 64
   push    hl                              ;[6530] e5
   call    $6536                           ;[6531] cd 36 65
   jr      $6562                           ;[6534] 18 2c
   ld      hl,$fb40                        ;[6536] 21 40 fb
   ld      a,(iy+$16)                      ;[6539] fd 7e 16
   ld      b,$03                           ;[653c] 06 03
   sub     b                               ;[653e] 90
   sla     a                               ;[653f] cb 27
   ld      e,a                             ;[6541] 5f
   ld      d,$00                           ;[6542] 16 00
   ld      a,(iy+$15)                      ;[6544] fd 7e 15
   cp      $08                             ;[6547] fe 08
   ccf                                     ;[6549] 3f
   adc     hl,de                           ;[654a] ed 5a
   and     $07                             ;[654c] e6 07
   inc     a                               ;[654e] 3c
   ld      b,a                             ;[654f] 47
   ld      c,(hl)                          ;[6550] 4e
   rlc     c                               ;[6551] cb 01
   rrc     c                               ;[6553] cb 09
   djnz    $6553                           ;[6555] 10 fc
   res     0,c                             ;[6557] cb 81
   ld      b,a                             ;[6559] 47
   rrc     c                               ;[655a] cb 09
   rlc     c                               ;[655c] cb 01
   djnz    $655c                           ;[655e] 10 fc
   ld      (hl),c                          ;[6560] 71
   ret                                     ;[6561] c9
   pop     bc                              ;[6562] c1
   pop     hl                              ;[6563] e1
   ld      de,$fc56                        ;[6564] 11 56 fc
   ldir                                    ;[6567] ed b0
   ld      (iy+$00),$16                    ;[6569] fd 36 16 00
   ld      (iy+$00),$15                    ;[656d] fd 36 15 00
   jr      $6524                           ;[6571] 18 b1
   ex      de,hl                           ;[6573] eb
   or      a                               ;[6574] b7
   sbc     hl,de                           ;[6575] ed 52
   jr      $6530                           ;[6577] 18 b7
   call    $67aa                           ;[6579] cd aa 67
   ld      hl,$fb40                        ;[657c] 21 40 fb
   ld      de,$fc56                        ;[657f] 11 56 fc
   ld      bc,$004a                        ;[6582] 01 4a 00
   ldir                                    ;[6585] ed b0
   ld      (iy+$02),$12                    ;[6587] fd 36 12 02
   ld      (iy+$0f),$11                    ;[658b] fd 36 11 0f
   ld      b,$00                           ;[658f] 06 00
   call    $790a                           ;[6591] cd 0a 79
   or      a                               ;[6594] b7
   jr      nz,$659f                        ;[6595] 20 08
   call    $6aba                           ;[6597] cd ba 6a
   ld      b,$00                           ;[659a] 06 00
   call    $790a                           ;[659c] cd 0a 79
   pop     hl                              ;[659f] e1
   pop     de                              ;[65a0] d1
   ld      ($8041),de                      ;[65a1] ed 53 41 80
   pop     de                              ;[65a5] d1
   ld      ($83e9),de                      ;[65a6] ed 53 e9 83
   or      a                               ;[65aa] b7
   jp      nz,$6206                        ;[65ab] c2 06 62
   ret                                     ;[65ae] c9
   cp      $11                             ;[65af] fe 11
   jr      nz,$65cd                        ;[65b1] 20 1a
   call    $7aea                           ;[65b3] cd ea 7a
   cp      $02                             ;[65b6] fe 02
   ld      a,$11                           ;[65b8] 3e 11
   jr      nz,$65cd                        ;[65ba] 20 11
   ex      de,hl                           ;[65bc] eb
   ld      de,$fff6                        ;[65bd] 11 f6 ff
   add     hl,de                           ;[65c0] 19
   ld      (hl),$01                        ;[65c1] 36 01
   ld      b,$00                           ;[65c3] 06 00
   call    $790a                           ;[65c5] cd 0a 79
   or      a                               ;[65c8] b7
   jr      nz,$65cd                        ;[65c9] 20 02
   ld      a,$11                           ;[65cb] 3e 11
   pop     hl                              ;[65cd] e1
   pop     de                              ;[65ce] d1
   ld      ($8041),de                      ;[65cf] ed 53 41 80
   pop     de                              ;[65d3] d1
   ld      ($83e9),de                      ;[65d4] ed 53 e9 83
   jp      $6206                           ;[65d8] c3 06 62
   call    $6986                           ;[65db] cd 86 69
   push    hl                              ;[65de] e5
   call    $6634                           ;[65df] cd 34 66
   or      a                               ;[65e2] b7
   jp      nz,$6206                        ;[65e3] c2 06 62
   ld      (iy+$00),$12                    ;[65e6] fd 36 12 00
   ld      (iy+$00),$11                    ;[65ea] fd 36 11 00
   ld      a,$22                           ;[65ee] 3e 22
   ld       ($fe58),a                      ;[65f0] 32 58 fe
   ld      hl,$5e00                        ;[65f3] 21 00 5e
   ld      de,$fc56                        ;[65f6] 11 56 fc
   ld      bc,$0100                        ;[65f9] 01 00 01
   ldir                                    ;[65fc] ed b0
   push    hl                              ;[65fe] e5
   ld      b,$00                           ;[65ff] 06 00
   call    $790a                           ;[6601] cd 0a 79
   pop     hl                              ;[6604] e1
   or      a                               ;[6605] b7
   jp      nz,$6206                        ;[6606] c2 06 62
   ld      a,($fe58)                       ;[6609] 3a 58 fe
   dec     a                               ;[660c] 3d
   ld       ($fe58),a                      ;[660d] 32 58 fe
   jr      z,$6625                         ;[6610] 28 13
   inc     (iy+$11)                        ;[6612] fd 34 11
   ld      a,(iy+$11)                      ;[6615] fd 7e 11
   cp      $10                             ;[6618] fe 10
   jr      c,$65f6                         ;[661a] 38 da
   ld      (iy+$00),$11                    ;[661c] fd 36 11 00
   inc     (iy+$12)                        ;[6620] fd 34 12
   jr      $65f6                           ;[6623] 18 d1
   inc     (iy+$11)                        ;[6625] fd 34 11
   call    $67b8                           ;[6628] cd b8 67
   ld      a,(iy+$11)                      ;[662b] fd 7e 11
   cp      $0f                             ;[662e] fe 0f
   jr      nz,$6625                        ;[6630] 20 f3
   pop     hl                              ;[6632] e1
   ret                                     ;[6633] c9
   call    $7be0                           ;[6634] cd e0 7b
   ld      a,$11                           ;[6637] 3e 11
   ld      (iy+$14),a                      ;[6639] fd 77 14
   xor     a                               ;[663c] af
   ld      (iy+$11),a                      ;[663d] fd 77 11
   ld      (iy+$7f),a                      ;[6640] fd 77 7f
   ld      (iy+$7e),a                      ;[6643] fd 77 7e
   ld      a,(iy+$7d)                      ;[6646] fd 7e 7d
   ld      (iy+$7c),a                      ;[6649] fd 77 7c
   ld      b,$28                           ;[664c] 06 28
   call    $78ca                           ;[664e] cd ca 78
   ld      a,$0e                           ;[6651] 3e 0e
   ld       ($fe5b),a                      ;[6653] 32 5b fe
   ld      b,$7f                           ;[6656] 06 7f
   ld      c,$10                           ;[6658] 0e 10
   ld      d,$ff                           ;[665a] 16 ff
   ld      a,(iy+$43)                      ;[665c] fd 7e 43
   and     $bf                             ;[665f] e6 bf
   ld      (iy+$43),a                      ;[6661] fd 77 43
   out     ($10),a                         ;[6664] d3 10
   ld      a,d                             ;[6666] 7a
   out     ($13),a                         ;[6667] d3 13
   call    $7864                           ;[6669] cd 64 78
   djnz    $6669                           ;[666c] 10 fb
   ld      d,$d5                           ;[666e] 16 d5
   call    $7864                           ;[6670] cd 64 78
   out     ($11),a                         ;[6673] d3 11
   ld      d,$aa                           ;[6675] 16 aa
   call    $7864                           ;[6677] cd 64 78
   ld      d,$96                           ;[667a] 16 96
   call    $7864                           ;[667c] cd 64 78
   ld      d,(iy+$7c)                      ;[667f] fd 56 7c
   ld      b,d                             ;[6682] 42
   call    $786d                           ;[6683] cd 6d 78
   ld      a,(iy+$7f)                      ;[6686] fd 7e 7f
   ld      d,a                             ;[6689] 57
   xor     b                               ;[668a] a8
   ld      b,a                             ;[668b] 47
   call    $786d                           ;[668c] cd 6d 78
   ld      a,(iy+$7e)                      ;[668f] fd 7e 7e
   ld      d,a                             ;[6692] 57
   xor     b                               ;[6693] a8
   ld      b,a                             ;[6694] 47
   call    $786d                           ;[6695] cd 6d 78
   ld      d,b                             ;[6698] 50
   call    $786d                           ;[6699] cd 6d 78
   ld      d,$de                           ;[669c] 16 de
   call    $7864                           ;[669e] cd 64 78
   ld      d,$aa                           ;[66a1] 16 aa
   call    $7864                           ;[66a3] cd 64 78
   ld      d,$eb                           ;[66a6] 16 eb
   call    $7864                           ;[66a8] cd 64 78
   ld      b,$04                           ;[66ab] 06 04
   ld      d,$ff                           ;[66ad] 16 ff
   call    $7864                           ;[66af] cd 64 78
   out     ($11),a                         ;[66b2] d3 11
   call    $7864                           ;[66b4] cd 64 78
   djnz    $66b4                           ;[66b7] 10 fb
   ld      d,$d5                           ;[66b9] 16 d5
   call    $7864                           ;[66bb] cd 64 78
   out     ($11),a                         ;[66be] d3 11
   ld      d,$aa                           ;[66c0] 16 aa
   call    $7864                           ;[66c2] cd 64 78
   ld      d,$ad                           ;[66c5] 16 ad
   call    $7864                           ;[66c7] cd 64 78
   ld      b,$54                           ;[66ca] 06 54
   ld      d,$e6                           ;[66cc] 16 e6
   call    $7864                           ;[66ce] cd 64 78
   ld      d,$96                           ;[66d1] 16 96
   call    $7864                           ;[66d3] cd 64 78
   djnz    $66d3                           ;[66d6] 10 fb
   ld      d,$b7                           ;[66d8] 16 b7
   call    $7864                           ;[66da] cd 64 78
   ld      b,$00                           ;[66dd] 06 00
   ld      d,$96                           ;[66df] 16 96
   call    $7864                           ;[66e1] cd 64 78
   djnz    $66e1                           ;[66e4] 10 fb
   ld      d,$f9                           ;[66e6] 16 f9
   call    $7864                           ;[66e8] cd 64 78
   ld      d,$de                           ;[66eb] 16 de
   call    $7864                           ;[66ed] cd 64 78
   ld      d,$aa                           ;[66f0] 16 aa
   call    $7864                           ;[66f2] cd 64 78
   ld      d,$eb                           ;[66f5] 16 eb
   call    $7864                           ;[66f7] cd 64 78
   dec     c                               ;[66fa] 0d
   jr      z,$670e                         ;[66fb] 28 11
   inc     (iy+$7e)                        ;[66fd] fd 34 7e
   ld      a,($fe5b)                       ;[6700] 3a 5b fe
   ld      b,a                             ;[6703] 47
   ld      d,$ff                           ;[6704] 16 ff
   call    $7864                           ;[6706] cd 64 78
   out     ($11),a                         ;[6709] d3 11
   jp      $6669                           ;[670b] c3 69 66
   ld      a,(iy+$43)                      ;[670e] fd 7e 43
   or      $40                             ;[6711] f6 40
   ld      (iy+$43),a                      ;[6713] fd 77 43
   out     ($10),a                         ;[6716] d3 10
   ld      a,(iy+$7c)                      ;[6718] fd 7e 7c
   ld      (iy+$7d),a                      ;[671b] fd 77 7d
   ld      a,(iy+$7f)                      ;[671e] fd 7e 7f
   ld      (iy+$12),a                      ;[6721] fd 77 12
   xor     a                               ;[6724] af
   ld      (iy+$7e),a                      ;[6725] fd 77 7e
   ld      c,$10                           ;[6728] 0e 10
   push    bc                              ;[672a] c5
   ld      (iy+$03),$13                    ;[672b] fd 36 13 03
   call    $779d                           ;[672f] cd 9d 77
   pop     bc                              ;[6732] c1
   jr      c,$6754                         ;[6733] 38 1f
   inc     (iy+$7e)                        ;[6735] fd 34 7e
   dec     c                               ;[6738] 0d
   jr      nz,$672a                        ;[6739] 20 ef
   xor     a                               ;[673b] af
   ld      (iy+$7e),a                      ;[673c] fd 77 7e
   ld      a,(iy+$7f)                      ;[673f] fd 7e 7f
   inc     a                               ;[6742] 3c
   cp      $28                             ;[6743] fe 28
   jr      z,$674f                         ;[6745] 28 08
   ld      b,$01                           ;[6747] 06 01
   call    $7897                           ;[6749] cd 97 78
   jp      $6656                           ;[674c] c3 56 66
   call    $7bd5                           ;[674f] cd d5 7b
   xor     a                               ;[6752] af
   ret                                     ;[6753] c9
   ld      a,($fe5b)                       ;[6754] 3a 5b fe
   dec     a                               ;[6757] 3d
   ld       ($fe5b),a                      ;[6758] 32 5b fe
   cp      $05                             ;[675b] fe 05
   jp      nz,$6656                        ;[675d] c2 56 66
   call    $7bd5                           ;[6760] cd d5 7b
   ld      a,$09                           ;[6763] 3e 09
   ret                                     ;[6765] c9
   call    $774b                           ;[6766] cd 4b 77
   push    hl                              ;[6769] e5
   or      a                               ;[676a] b7
   jp      nz,$6206                        ;[676b] c2 06 62
   ld      (iy+$54),$09                    ;[676e] fd 36 09 54
   call    $6408                           ;[6772] cd 08 64
   or      a                               ;[6775] b7
   jp      nz,$6206                        ;[6776] c2 06 62
   ld      de,($8041)                      ;[6779] ed 5b 41 80
   push    hl                              ;[677d] e5
   ld      hl,$85fa                        ;[677e] 21 fa 85
   set     6,(hl)                          ;[6781] cb f6
   pop     hl                              ;[6783] e1
   ld      ix,$1771                        ;[6784] dd 21 71 17
   jp      $6272                           ;[6788] c3 72 62
   push    hl                              ;[678b] e5
   ld      (iy+$02),$12                    ;[678c] fd 36 12 02
   ld      (iy+$0f),$11                    ;[6790] fd 36 11 0f
   ld      b,$01                           ;[6794] 06 01
   call    $790a                           ;[6796] cd 0a 79
   or      a                               ;[6799] b7
   jp      nz,$6206                        ;[679a] c2 06 62
   ld      hl,$fc56                        ;[679d] 21 56 fc
   ld      de,$fb40                        ;[67a0] 11 40 fb
   ld      bc,$004a                        ;[67a3] 01 4a 00
   ldir                                    ;[67a6] ed b0
   pop     hl                              ;[67a8] e1
   ret                                     ;[67a9] c9
   ld      hl,$fc56                        ;[67aa] 21 56 fc
   ld      (hl),$00                        ;[67ad] 36 00
   ld      e,l                             ;[67af] 5d
   ld      d,h                             ;[67b0] 54
   inc     de                              ;[67b1] 13
   ld      bc,$0100                        ;[67b2] 01 00 01
   ldir                                    ;[67b5] ed b0
   ret                                     ;[67b7] c9
   call    $67aa                           ;[67b8] cd aa 67
   ld      b,$00                           ;[67bb] 06 00
   call    $790a                           ;[67bd] cd 0a 79
   or      a                               ;[67c0] b7
   jp      nz,$6206                        ;[67c1] c2 06 62
   ret                                     ;[67c4] c9
   push    hl                              ;[67c5] e5
   call    $67aa                           ;[67c6] cd aa 67
   ld      (iy+$02),$12                    ;[67c9] fd 36 12 02
   ld      (iy+$0f),$11                    ;[67cd] fd 36 11 0f
   ld      hl,$fb40                        ;[67d1] 21 40 fb
   ld      de,$fc56                        ;[67d4] 11 56 fc
   ld      bc,$004a                        ;[67d7] 01 4a 00
   ldir                                    ;[67da] ed b0
   ld      b,$00                           ;[67dc] 06 00
   call    $790a                           ;[67de] cd 0a 79
   pop     hl                              ;[67e1] e1
   or      a                               ;[67e2] b7
   jp      nz,$6206                        ;[67e3] c2 06 62
   ret                                     ;[67e6] c9
   call    $775c                           ;[67e7] cd 5c 77
   push    hl                              ;[67ea] e5
   or      a                               ;[67eb] b7
   jp      nz,$6206                        ;[67ec] c2 06 62
   rst     $08                             ;[67ef] cf
   inc     l                               ;[67f0] 2c
   pop     hl                              ;[67f1] e1
   ld      de,($83e9)                      ;[67f2] ed 5b e9 83
   push    de                              ;[67f6] d5
   ld      de,($8041)                      ;[67f7] ed 5b 41 80
   push    de                              ;[67fb] d5
   call    $6840                           ;[67fc] cd 40 68
   ld      ($8041),de                      ;[67ff] ed 53 41 80
   push    hl                              ;[6803] e5
   rst     $08                             ;[6804] cf
   inc     l                               ;[6805] 2c
   pop     hl                              ;[6806] e1
   call    $6840                           ;[6807] cd 40 68
   inc     de                              ;[680a] 13
   ld      ($83e9),de                      ;[680b] ed 53 e9 83
   ld      a,(hl)                          ;[680f] 7e
   or      a                               ;[6810] b7
   jr      z,$681a                         ;[6811] 28 07
   cp      $3a                             ;[6813] fe 3a
   ld      a,$01                           ;[6815] 3e 01
   jp      nz,$65ce                        ;[6817] c2 ce 65
   ld      (iy+$42),$09                    ;[681a] fd 36 09 42
   push    hl                              ;[681e] e5
   ld      hl,($8041)                      ;[681f] 2a 41 80
   or      a                               ;[6822] b7
   sbc     hl,de                           ;[6823] ed 52
   ld      a,$01                           ;[6825] 3e 01
   jp      nc,$65af                        ;[6827] d2 af 65
   call    $7bbc                           ;[682a] cd bc 7b
   push    bc                              ;[682d] c5
   ld      bc,$0002                        ;[682e] 01 02 00
   call    $7887                           ;[6831] cd 87 78
   pop     bc                              ;[6834] c1
   in      a,($12)                         ;[6835] db 12
   rrca                                    ;[6837] 0f
   ld      a,$04                           ;[6838] 3e 04
   jp      c,$65af                         ;[683a] da af 65
   jp      $64af                           ;[683d] c3 af 64
   inc     hl                              ;[6840] 23
   ld      a,(hl)                          ;[6841] 7e
   or      a                               ;[6842] b7
   jr      z,$6853                         ;[6843] 28 0e
   cp      $20                             ;[6845] fe 20
   jr      z,$6853                         ;[6847] 28 0a
   cp      $0c                             ;[6849] fe 0c
   jr      nz,$6853                        ;[684b] 20 06
   inc     hl                              ;[684d] 23
   ld      e,(hl)                          ;[684e] 5e
   inc     hl                              ;[684f] 23
   ld      d,(hl)                          ;[6850] 56
   inc     hl                              ;[6851] 23
   ret                                     ;[6852] c9
   ld      a,$01                           ;[6853] 3e 01
   pop     de                              ;[6855] d1
   jp      $65ce                           ;[6856] c3 ce 65
   call    $774b                           ;[6859] cd 4b 77
   push    hl                              ;[685c] e5
   or      a                               ;[685d] b7
   jp      nz,$6206                        ;[685e] c2 06 62
   ld      (iy+$42),$09                    ;[6861] fd 36 09 42
   pop     hl                              ;[6865] e1
   ld      de,($83e9)                      ;[6866] ed 5b e9 83
   push    de                              ;[686a] d5
   ld      de,($8041)                      ;[686b] ed 5b 41 80
   push    de                              ;[686f] d5
   push    hl                              ;[6870] e5
   call    $6408                           ;[6871] cd 08 64
   pop     hl                              ;[6874] e1
   pop     de                              ;[6875] d1
   ld      ($8041),de                      ;[6876] ed 53 41 80
   pop     de                              ;[687a] d1
   ld      ($83e9),de                      ;[687b] ed 53 e9 83
   or      a                               ;[687f] b7
   jp      nz,$6206                        ;[6880] c2 06 62
   ret                                     ;[6883] c9
   call    $774b                           ;[6884] cd 4b 77
   push    hl                              ;[6887] e5
   or      a                               ;[6888] b7
   jp      nz,$6206                        ;[6889] c2 06 62
   ld      (iy+$42),$09                    ;[688c] fd 36 09 42
   call    $6408                           ;[6890] cd 08 64
   or      a                               ;[6893] b7
   jp      nz,$6206                        ;[6894] c2 06 62
   ld      hl,($8041)                      ;[6897] 2a 41 80
   jp      (hl)                            ;[689a] e9
   ld      (iy+$54),l                      ;[689b] fd 75 54
   ld      (iy+$55),h                      ;[689e] fd 74 55
   call    $775c                           ;[68a1] cd 5c 77
   or      a                               ;[68a4] b7
   jp      nz,$6206                        ;[68a5] c2 06 62
   rst     $08                             ;[68a8] cf
   inc     l                               ;[68a9] 2c
   ld      (iy+$52),l                      ;[68aa] fd 75 52
   ld      (iy+$53),h                      ;[68ad] fd 74 53
   call    $774b                           ;[68b0] cd 4b 77
   or      a                               ;[68b3] b7
   jp      nz,$6206                        ;[68b4] c2 06 62
   ld      (iy+$02),$12                    ;[68b7] fd 36 12 02
   ld      (iy+$03),$11                    ;[68bb] fd 36 11 03
   ld      (iy+$00),$51                    ;[68bf] fd 36 51 00
   ld      b,$01                           ;[68c3] 06 01
   call    $790a                           ;[68c5] cd 0a 79
   or      a                               ;[68c8] b7
   jp      nz,$6206                        ;[68c9] c2 06 62
   ld      a,(iy+$51)                      ;[68cc] fd 7e 51
   or      a                               ;[68cf] b7
   jr      nz,$68db                        ;[68d0] 20 09
   ld      l,(iy+$54)                      ;[68d2] fd 6e 54
   ld      h,(iy+$55)                      ;[68d5] fd 66 55
   call    $6945                           ;[68d8] cd 45 69
   ld      l,(iy+$52)                      ;[68db] fd 6e 52
   ld      h,(iy+$53)                      ;[68de] fd 66 53
   call    $6945                           ;[68e1] cd 45 69
   cp      $02                             ;[68e4] fe 02
   jp      z,$6206                         ;[68e6] ca 06 62
   inc     (iy+$11)                        ;[68e9] fd 34 11
   ld      a,(iy+$11)                      ;[68ec] fd 7e 11
   cp      $0b                             ;[68ef] fe 0b
   jr      nz,$68c3                        ;[68f1] 20 d0
   ld      a,(iy+$51)                      ;[68f3] fd 7e 51
   or      a                               ;[68f6] b7
   jr      nz,$68fe                        ;[68f7] 20 05
   ld      a,$0d                           ;[68f9] 3e 0d
   jp      $6206                           ;[68fb] c3 06 62
   call    $6aba                           ;[68fe] cd ba 6a
   ld      l,(iy+$54)                      ;[6901] fd 6e 54
   ld      h,(iy+$55)                      ;[6904] fd 66 55
   call    $6945                           ;[6907] cd 45 69
   cp      $02                             ;[690a] fe 02
   jr      z,$6913                         ;[690c] 28 05
   ld      a,$0d                           ;[690e] 3e 0d
   jp      $6206                           ;[6910] c3 06 62
   push    de                              ;[6913] d5
   ld      l,(iy+$52)                      ;[6914] fd 6e 52
   ld      h,(iy+$53)                      ;[6917] fd 66 53
   call    $775c                           ;[691a] cd 5c 77
   pop     hl                              ;[691d] e1
   ld      de,$fff8                        ;[691e] 11 f8 ff
   add     hl,de                           ;[6921] 19
   ex      de,hl                           ;[6922] eb
   push    iy                              ;[6923] fd e5
   pop     hl                              ;[6925] e1
   inc     hl                              ;[6926] 23
   ld      bc,$0008                        ;[6927] 01 08 00
   ldir                                    ;[692a] ed b0
   ld      a,(iy+$46)                      ;[692c] fd 7e 46
   ld      (iy+$11),a                      ;[692f] fd 77 11
   ld      b,$00                           ;[6932] 06 00
   call    $790a                           ;[6934] cd 0a 79
   or      a                               ;[6937] b7
   jp      nz,$6206                        ;[6938] c2 06 62
   ld      l,(iy+$52)                      ;[693b] fd 6e 52
   ld      h,(iy+$53)                      ;[693e] fd 66 53
   call    $775c                           ;[6941] cd 5c 77
   ret                                     ;[6944] c9
   call    $775c                           ;[6945] cd 5c 77
   ld      b,$10                           ;[6948] 06 10
   ld      hl,$fc56                        ;[694a] 21 56 fc
   push    iy                              ;[694d] fd e5
   pop     de                              ;[694f] d1
   inc     de                              ;[6950] 13
   ld      a,(hl)                          ;[6951] 7e
   or      a                               ;[6952] b7
   ret     z                               ;[6953] c8
   push    de                              ;[6954] d5
   push    hl                              ;[6955] e5
   cp      $01                             ;[6956] fe 01
   jr      z,$697c                         ;[6958] 28 22
   inc     hl                              ;[695a] 23
   inc     hl                              ;[695b] 23
   ld      c,$08                           ;[695c] 0e 08
   ex      de,hl                           ;[695e] eb
   ld      a,(de)                          ;[695f] 1a
   cp      (hl)                            ;[6960] be
   jr      nz,$697c                        ;[6961] 20 19
   inc     hl                              ;[6963] 23
   inc     de                              ;[6964] 13
   dec     c                               ;[6965] 0d
   jr      nz,$695f                        ;[6966] 20 f7
   pop     af                              ;[6968] f1
   pop     af                              ;[6969] f1
   push    de                              ;[696a] d5
   call    $7b96                           ;[696b] cd 96 7b
   pop     de                              ;[696e] d1
   ld      (iy+$01),$51                    ;[696f] fd 36 51 01
   ld      a,(iy+$11)                      ;[6973] fd 7e 11
   ld      (iy+$46),a                      ;[6976] fd 77 46
   ld      a,$02                           ;[6979] 3e 02
   ret                                     ;[697b] c9
   pop     hl                              ;[697c] e1
   ld      de,$0010                        ;[697d] 11 10 00
   add     hl,de                           ;[6980] 19
   pop     de                              ;[6981] d1
   djnz    $6951                           ;[6982] 10 cd
   xor     a                               ;[6984] af
   ret                                     ;[6985] c9
   dec     hl                              ;[6986] 2b
   inc     hl                              ;[6987] 23
   ld      a,(hl)                          ;[6988] 7e
   or      a                               ;[6989] b7
   ret     z                               ;[698a] c8
   cp      $20                             ;[698b] fe 20
   jr      z,$6987                         ;[698d] 28 f8
   cp      $3a                             ;[698f] fe 3a
   ret     z                               ;[6991] c8
   jp      $6267                           ;[6992] c3 67 62
   call    $6986                           ;[6995] cd 86 69
   push    hl                              ;[6998] e5
   ld      (iy+$02),$12                    ;[6999] fd 36 12 02
   ld      (iy+$03),$11                    ;[699d] fd 36 11 03
   xor     a                               ;[69a1] af
   ld       ($fe58),a                      ;[69a2] 32 58 fe
   ld      b,$01                           ;[69a5] 06 01
   call    $790a                           ;[69a7] cd 0a 79
   or      a                               ;[69aa] b7
   jp      nz,$6206                        ;[69ab] c2 06 62
   ld      hl,$fc56                        ;[69ae] 21 56 fc
   ld      de,$0006                        ;[69b1] 11 06 00
   ld      c,$10                           ;[69b4] 0e 10
   ld      a,(hl)                          ;[69b6] 7e
   or      a                               ;[69b7] b7
   jr      z,$69fe                         ;[69b8] 28 44
   cp      $01                             ;[69ba] fe 01
   jr      nz,$69c6                        ;[69bc] 20 08
   push    bc                              ;[69be] c5
   ld      bc,$000a                        ;[69bf] 01 0a 00
   add     hl,bc                           ;[69c2] 09
   pop     bc                              ;[69c3] c1
   jr      $69ef                           ;[69c4] 18 29
   ld      b,$0a                           ;[69c6] 06 0a
   ld      a,(hl)                          ;[69c8] 7e
   call    $6075                           ;[69c9] cd 75 60
   inc     hl                              ;[69cc] 23
   djnz    $69c8                           ;[69cd] 10 f9
   ld      a,$0a                           ;[69cf] 3e 0a
   call    $6075                           ;[69d1] cd 75 60
   ld      a,$0d                           ;[69d4] 3e 0d
   call    $6075                           ;[69d6] cd 75 60
   ld      a,($fe58)                       ;[69d9] 3a 58 fe
   inc     a                               ;[69dc] 3c
   ld       ($fe58),a                      ;[69dd] 32 58 fe
   cp      $17                             ;[69e0] fe 17
   jr      nz,$69ef                        ;[69e2] 20 0b
   xor     a                               ;[69e4] af
   ld       ($fe58),a                      ;[69e5] 32 58 fe
   call    $6a00                           ;[69e8] cd 00 6a
   cp      $20                             ;[69eb] fe 20
   jr      nz,$69e8                        ;[69ed] 20 f9
   add     hl,de                           ;[69ef] 19
   dec     c                               ;[69f0] 0d
   jr      nz,$69b6                        ;[69f1] 20 c3
   inc     (iy+$11)                        ;[69f3] fd 34 11
   ld      a,(iy+$11)                      ;[69f6] fd 7e 11
   cp      $0b                             ;[69f9] fe 0b
   jp      nz,$69a5                        ;[69fb] c2 a5 69
   pop     hl                              ;[69fe] e1
   ret                                     ;[69ff] c9
   push    hl                              ;[6a00] e5
   push    de                              ;[6a01] d5
   push    bc                              ;[6a02] c5
   call    $001b                           ;[6a03] cd 1b 00
   cp      $ff                             ;[6a06] fe ff
   jr      nz,$6a03                        ;[6a08] 20 f9
   call    $0013                           ;[6a0a] cd 13 00
   pop     bc                              ;[6a0d] c1
   pop     de                              ;[6a0e] d1
   pop     hl                              ;[6a0f] e1
   ret                                     ;[6a10] c9
   call    $774b                           ;[6a11] cd 4b 77
   push    hl                              ;[6a14] e5
   or      a                               ;[6a15] b7
   jp      nz,$6206                        ;[6a16] c2 06 62
   call    $7be0                           ;[6a19] cd e0 7b
   call    $678b                           ;[6a1c] cd 8b 67
   ld      (iy+$01),$51                    ;[6a1f] fd 36 51 01
   call    $7aee                           ;[6a23] cd ee 7a
   cp      $02                             ;[6a26] fe 02
   jr      z,$6a33                         ;[6a28] 28 09
   or      a                               ;[6a2a] b7
   jp      nz,$6206                        ;[6a2b] c2 06 62
   ld      a,$0d                           ;[6a2e] 3e 0d
   jp      $6206                           ;[6a30] c3 06 62
   ld      a,(de)                          ;[6a33] 1a
   inc     de                              ;[6a34] 13
   ld      (iy+$16),a                      ;[6a35] fd 77 16
   ld      a,(de)                          ;[6a38] 1a
   ld      (iy+$15),a                      ;[6a39] fd 77 15
   ex      de,hl                           ;[6a3c] eb
   ld      de,$fff5                        ;[6a3d] 11 f5 ff
   add     hl,de                           ;[6a40] 19
   ld      (hl),$01                        ;[6a41] 36 01
   ld      a,(iy+$11)                      ;[6a43] fd 7e 11
   ld      (iy+$46),a                      ;[6a46] fd 77 46
   call    $7b96                           ;[6a49] cd 96 7b
   ld      a,(iy+$16)                      ;[6a4c] fd 7e 16
   or      (iy+$15)                        ;[6a4f] fd b6 15
   jp      z,$6a8d                         ;[6a52] ca 8d 6a
   ld      a,(iy+$15)                      ;[6a55] fd 7e 15
   ld      (iy+$11),a                      ;[6a58] fd 77 11
   ld      a,(iy+$16)                      ;[6a5b] fd 7e 16
   ld      (iy+$12),a                      ;[6a5e] fd 77 12
   ld      b,$01                           ;[6a61] 06 01
   call    $790a                           ;[6a63] cd 0a 79
   or      a                               ;[6a66] b7
   jp      nz,$6206                        ;[6a67] c2 06 62
   ld      hl,$fc56                        ;[6a6a] 21 56 fc
   ld      de,$00fe                        ;[6a6d] 11 fe 00
   add     hl,de                           ;[6a70] 19
   ld      d,(hl)                          ;[6a71] 56
   inc     hl                              ;[6a72] 23
   ld      e,(hl)                          ;[6a73] 5e
   push    de                              ;[6a74] d5
   ld      a,(iy+$12)                      ;[6a75] fd 7e 12
   ld      (iy+$16),a                      ;[6a78] fd 77 16
   ld      a,(iy+$11)                      ;[6a7b] fd 7e 11
   ld      (iy+$15),a                      ;[6a7e] fd 77 15
   call    $6536                           ;[6a81] cd 36 65
   pop     de                              ;[6a84] d1
   ld      (iy+$16),d                      ;[6a85] fd 72 16
   ld      (iy+$15),e                      ;[6a88] fd 73 15
   jr      $6a4c                           ;[6a8b] 18 bf
   call    $67aa                           ;[6a8d] cd aa 67
   ld      hl,$fb40                        ;[6a90] 21 40 fb
   ld      de,$fc56                        ;[6a93] 11 56 fc
   ld      bc,$004a                        ;[6a96] 01 4a 00
   ldir                                    ;[6a99] ed b0
   ld      (iy+$02),$12                    ;[6a9b] fd 36 12 02
   ld      (iy+$0f),$11                    ;[6a9f] fd 36 11 0f
   ld      b,$00                           ;[6aa3] 06 00
   call    $790a                           ;[6aa5] cd 0a 79
   or      a                               ;[6aa8] b7
   jp      nz,$6206                        ;[6aa9] c2 06 62
   call    $6aba                           ;[6aac] cd ba 6a
   ld      b,$00                           ;[6aaf] 06 00
   call    $790a                           ;[6ab1] cd 0a 79
   or      a                               ;[6ab4] b7
   jp      nz,$6206                        ;[6ab5] c2 06 62
   pop     hl                              ;[6ab8] e1
   ret                                     ;[6ab9] c9
   ld      hl,$fd57                        ;[6aba] 21 57 fd
   ld      de,$fc56                        ;[6abd] 11 56 fc
   ld      bc,$0100                        ;[6ac0] 01 00 01
   ldir                                    ;[6ac3] ed b0
   ld      (iy+$02),$12                    ;[6ac5] fd 36 12 02
   ld      a,(iy+$46)                      ;[6ac9] fd 7e 46
   ld      (iy+$11),a                      ;[6acc] fd 77 11
   ret                                     ;[6acf] c9
   call    $6986                           ;[6ad0] cd 86 69
   push    hl                              ;[6ad3] e5
   call    $678b                           ;[6ad4] cd 8b 67
   ld      hl,$fb40                        ;[6ad7] 21 40 fb
   ld      de,$0000                        ;[6ada] 11 00 00
   ld      c,$4a                           ;[6add] 0e 4a
   ld      b,$08                           ;[6adf] 06 08
   ld      a,(hl)                          ;[6ae1] 7e
   rrca                                    ;[6ae2] 0f
   jr      c,$6ae6                         ;[6ae3] 38 01
   inc     de                              ;[6ae5] 13
   djnz    $6ae2                           ;[6ae6] 10 fa
   inc     hl                              ;[6ae8] 23
   dec     c                               ;[6ae9] 0d
   jr      nz,$6adf                        ;[6aea] 20 f3
   ld      l,e                             ;[6aec] 6b
   ld      h,d                             ;[6aed] 62
   push    hl                              ;[6aee] e5
   call    $6b43                           ;[6aef] cd 43 6b
   ld      hl,$6b24                        ;[6af2] 21 24 6b
   call    $607b                           ;[6af5] cd 7b 60
   pop     hl                              ;[6af8] e1
   push    hl                              ;[6af9] e5
   srl     h                               ;[6afa] cb 3c
   rr      l                               ;[6afc] cb 1d
   srl     h                               ;[6afe] cb 3c
   rr      l                               ;[6b00] cb 1d
   call    $6b43                           ;[6b02] cd 43 6b
   ld      a,$2e                           ;[6b05] 3e 2e
   call    $6075                           ;[6b07] cd 75 60
   pop     hl                              ;[6b0a] e1
   ld      a,$07                           ;[6b0b] 3e 07
   and     l                               ;[6b0d] a5
   inc     a                               ;[6b0e] 3c
   ld      b,a                             ;[6b0f] 47
   ld      hl,$ff83                        ;[6b10] 21 83 ff
   ld      de,$007d                        ;[6b13] 11 7d 00
   add     hl,de                           ;[6b16] 19
   djnz    $6b16                           ;[6b17] 10 fd
   call    $6b43                           ;[6b19] cd 43 6b
   ld      hl,$6b34                        ;[6b1c] 21 34 6b
   call    $607b                           ;[6b1f] cd 7b 60
   pop     hl                              ;[6b22] e1
   ret                                     ;[6b23] c9
   jr      nz,$6b78                        ;[6b24] 20 52
   ld      b,l                             ;[6b26] 45
   ld      b,e                             ;[6b27] 43
   ld      c,a                             ;[6b28] 4f
   ld      d,d                             ;[6b29] 52
   ld      b,h                             ;[6b2a] 44
   ld      d,e                             ;[6b2b] 53
   jr      nz,$6b74                        ;[6b2c] 20 46
   ld      d,d                             ;[6b2e] 52
   ld      b,l                             ;[6b2f] 45
   ld      b,l                             ;[6b30] 45
   ld      a,(bc)                          ;[6b31] 0a
   dec     c                               ;[6b32] 0d
   nop                                     ;[6b33] 00
   ld      c,e                             ;[6b34] 4b
   jr      nz,$6b79                        ;[6b35] 20 42
   ld      e,c                             ;[6b37] 59
   ld      d,h                             ;[6b38] 54
   ld      b,l                             ;[6b39] 45
   ld      d,e                             ;[6b3a] 53
   jr      nz,$6b83                        ;[6b3b] 20 46
   ld      d,d                             ;[6b3d] 52
   ld      b,l                             ;[6b3e] 45
   ld      b,l                             ;[6b3f] 45
   ld      a,(bc)                          ;[6b40] 0a
   dec     c                               ;[6b41] 0d
   nop                                     ;[6b42] 00
   ld      b,$00                           ;[6b43] 06 00
   push    iy                              ;[6b45] fd e5
   ld      iy,$6b7d                        ;[6b47] fd 21 7d 6b
   xor     a                               ;[6b4b] af
   ld      e,(iy+$00)                      ;[6b4c] fd 5e 00
   ld      d,(iy+$01)                      ;[6b4f] fd 56 01
   or      a                               ;[6b52] b7
   sbc     hl,de                           ;[6b53] ed 52
   jp      c,$6b5b                         ;[6b55] da 5b 6b
   inc     a                               ;[6b58] 3c
   jr      $6b52                           ;[6b59] 18 f7
   add     hl,de                           ;[6b5b] 19
   or      a                               ;[6b5c] b7
   jr      z,$6b61                         ;[6b5d] 28 02
   ld      b,$01                           ;[6b5f] 06 01
   bit     0,b                             ;[6b61] cb 40
   jr      z,$6b6a                         ;[6b63] 28 05
   add     $30                             ;[6b65] c6 30
   call    $6075                           ;[6b67] cd 75 60
   inc     iy                              ;[6b6a] fd 23
   inc     iy                              ;[6b6c] fd 23
   ld      a,$0a                           ;[6b6e] 3e 0a
   cp      e                               ;[6b70] bb
   jr      nz,$6b75                        ;[6b71] 20 02
   ld      b,$01                           ;[6b73] 06 01
   ld      a,$01                           ;[6b75] 3e 01
   cp      e                               ;[6b77] bb
   jr      nz,$6b4b                        ;[6b78] 20 d1
   pop     iy                              ;[6b7a] fd e1
   ret                                     ;[6b7c] c9
   ret     pe                              ;[6b7d] e8
   inc     bc                              ;[6b7e] 03
   ld      h,h                             ;[6b7f] 64
   nop                                     ;[6b80] 00
   ld      a,(bc)                          ;[6b81] 0a
   nop                                     ;[6b82] 00
   ld      bc,$fd00                        ;[6b83] 01 00 fd
   ld      a,(hl)                          ;[6b86] 7e
   dec     bc                              ;[6b87] 0b
   ld       ($fe5c),a                      ;[6b88] 32 5c fe
   ld      de,($803f)                      ;[6b8b] ed 5b 3f 80
   inc     de                              ;[6b8f] 13
   ld      a,d                             ;[6b90] 7a
   or      e                               ;[6b91] b3
   ld      a,$0c                           ;[6b92] 3e 0c
   jp      nz,$6278                        ;[6b94] c2 78 62
   ld      (iy+$01),$48                    ;[6b97] fd 36 48 01
   dec     hl                              ;[6b9b] 2b
   call    $606f                           ;[6b9c] cd 6f 60
   jr      z,$6be0                         ;[6b9f] 28 3f
   call    $774b                           ;[6ba1] cd 4b 77
   or      a                               ;[6ba4] b7
   jp      nz,$6206                        ;[6ba5] c2 06 62
   push    hl                              ;[6ba8] e5
   call    $6cd7                           ;[6ba9] cd d7 6c
   call    $6d67                           ;[6bac] cd 67 6d
   call    $7aea                           ;[6baf] cd ea 7a
   cp      $02                             ;[6bb2] fe 02
   jr      z,$6bbf                         ;[6bb4] 28 09
   or      a                               ;[6bb6] b7
   jp      nz,$6206                        ;[6bb7] c2 06 62
   ld      a,$0d                           ;[6bba] 3e 0d
   jp      $6206                           ;[6bbc] c3 06 62
   ld      a,(iy+$0a)                      ;[6bbf] fd 7e 0a
   ld      (iy+$09),a                      ;[6bc2] fd 77 09
   cp      $44                             ;[6bc5] fe 44
   ld      a,$0c                           ;[6bc7] 3e 0c
   jp      z,$6206                         ;[6bc9] ca 06 62
   call    $641c                           ;[6bcc] cd 1c 64
   or      a                               ;[6bcf] b7
   jp      nz,$6cd1                        ;[6bd0] c2 d1 6c
   call    $6d8d                           ;[6bd3] cd 8d 6d
   call    $64a4                           ;[6bd6] cd a4 64
   or      a                               ;[6bd9] b7
   jp      nz,$6cd1                        ;[6bda] c2 d1 6c
   jp      $6ca4                           ;[6bdd] c3 a4 6c
   push    hl                              ;[6be0] e5
   ld      hl,$ffc6                        ;[6be1] 21 c6 ff
   add     hl,sp                           ;[6be4] 39
   ld      de,$8995                        ;[6be5] 11 95 89
   or      a                               ;[6be8] b7
   sbc     hl,de                           ;[6be9] ed 52
   srl     h                               ;[6beb] cb 3c
   srl     h                               ;[6bed] cb 3c
   srl     h                               ;[6bef] cb 3c
   srl     h                               ;[6bf1] cb 3c
   ld      a,h                             ;[6bf3] 7c
   ld       ($fe5a),a                      ;[6bf4] 32 5a fe
   ld      (iy+$00),$47                    ;[6bf7] fd 36 47 00
   ld      (iy+$00),$12                    ;[6bfb] fd 36 12 00
   ld      (iy+$00),$11                    ;[6bff] fd 36 11 00
   call    $7056                           ;[6c03] cd 56 70
   call    $6cd7                           ;[6c06] cd d7 6c
   call    $6d67                           ;[6c09] cd 67 6d
   ld      de,$8995                        ;[6c0c] 11 95 89
   ld      ($8041),de                      ;[6c0f] ed 53 41 80
   ld      b,$01                           ;[6c13] 06 01
   call    $790a                           ;[6c15] cd 0a 79
   or      a                               ;[6c18] b7
   jp      nz,$6cd1                        ;[6c19] c2 d1 6c
   ld      hl,$fc56                        ;[6c1c] 21 56 fc
   ld      de,($8041)                      ;[6c1f] ed 5b 41 80
   ld      bc,$0100                        ;[6c23] 01 00 01
   ldir                                    ;[6c26] ed b0
   ld      ($8041),de                      ;[6c28] ed 53 41 80
   inc     (iy+$11)                        ;[6c2c] fd 34 11
   ld      a,(iy+$11)                      ;[6c2f] fd 7e 11
   cp      $10                             ;[6c32] fe 10
   jr      nz,$6c13                        ;[6c34] 20 dd
   ld      (iy+$00),$11                    ;[6c36] fd 36 11 00
   inc     (iy+$12)                        ;[6c3a] fd 34 12
   ld      a,(iy+$12)                      ;[6c3d] fd 7e 12
   cp      $28                             ;[6c40] fe 28
   jr      z,$6c4e                         ;[6c42] 28 0a
   ld      hl,$fe5a                        ;[6c44] 21 5a fe
   ld      b,(hl)                          ;[6c47] 46
   sub     b                               ;[6c48] 90
   sub     (iy+$47)                        ;[6c49] fd 96 47
   jr      nz,$6c13                        ;[6c4c] 20 c5
   ld      a,(iy+$47)                      ;[6c4e] fd 7e 47
   ld      (iy+$12),a                      ;[6c51] fd 77 12
   call    $6d8d                           ;[6c54] cd 8d 6d
   call    $7bbc                           ;[6c57] cd bc 7b
   ld      hl,$8995                        ;[6c5a] 21 95 89
   ld      ($8041),hl                      ;[6c5d] 22 41 80
   ld      hl,($8041)                      ;[6c60] 2a 41 80
   ld      de,$fc56                        ;[6c63] 11 56 fc
   ld      bc,$0100                        ;[6c66] 01 00 01
   ldir                                    ;[6c69] ed b0
   ld      ($8041),hl                      ;[6c6b] 22 41 80
   ld      b,$00                           ;[6c6e] 06 00
   call    $790a                           ;[6c70] cd 0a 79
   or      a                               ;[6c73] b7
   jr      nz,$6cd1                        ;[6c74] 20 5b
   inc     (iy+$11)                        ;[6c76] fd 34 11
   ld      a,(iy+$11)                      ;[6c79] fd 7e 11
   cp      $10                             ;[6c7c] fe 10
   jr      nz,$6c60                        ;[6c7e] 20 e0
   ld      (iy+$00),$11                    ;[6c80] fd 36 11 00
   inc     (iy+$12)                        ;[6c84] fd 34 12
   ld      a,(iy+$12)                      ;[6c87] fd 7e 12
   cp      $28                             ;[6c8a] fe 28
   jr      z,$6ca4                         ;[6c8c] 28 16
   ld      hl,$fe5a                        ;[6c8e] 21 5a fe
   ld      b,(hl)                          ;[6c91] 46
   sub     b                               ;[6c92] 90
   sub     (iy+$47)                        ;[6c93] fd 96 47
   jr      nz,$6c60                        ;[6c96] 20 c8
   ld      a,($fe5a)                       ;[6c98] 3a 5a fe
   add     (iy+$47)                        ;[6c9b] fd 86 47
   ld      (iy+$47),a                      ;[6c9e] fd 77 47
   jp      $6c09                           ;[6ca1] c3 09 6c
   call    $7bd5                           ;[6ca4] cd d5 7b
   call    $6cb5                           ;[6ca7] cd b5 6c
   ld      bc,$0059                        ;[6caa] 01 59 00
   push    bc                              ;[6cad] c5
   ld      ix,$5efa                        ;[6cae] dd 21 fa 5e
   jp      $6272                           ;[6cb2] c3 72 62
   ld      hl,$8995                        ;[6cb5] 21 95 89
   ld      ($8041),hl                      ;[6cb8] 22 41 80
   ld      (hl),$00                        ;[6cbb] 36 00
   inc     hl                              ;[6cbd] 23
   ld      (hl),$00                        ;[6cbe] 36 00
   inc     hl                              ;[6cc0] 23
   ld      ($83e9),hl                      ;[6cc1] 22 e9 83
   push    af                              ;[6cc4] f5
   ld      a,($fe5c)                       ;[6cc5] 3a 5c fe
   ld      (iy+$0b),a                      ;[6cc8] fd 77 0b
   pop     af                              ;[6ccb] f1
   ld      (iy+$00),$48                    ;[6ccc] fd 36 48 00
   ret                                     ;[6cd0] c9
   call    $6cb5                           ;[6cd1] cd b5 6c
   jp      $6206                           ;[6cd4] c3 06 62
   ld      hl,$6d36                        ;[6cd7] 21 36 6d
   call    $607b                           ;[6cda] cd 7b 60
   ld      de,$ffff                        ;[6cdd] 11 ff ff
   call    $6d2a                           ;[6ce0] cd 2a 6d
   cp      $03                             ;[6ce3] fe 03
   jr      z,$6d07                         ;[6ce5] 28 20
   cp      $31                             ;[6ce7] fe 31
   jr      z,$6cef                         ;[6ce9] 28 04
   cp      $32                             ;[6ceb] fe 32
   jr      nz,$6ce0                        ;[6ced] 20 f1
   call    $6075                           ;[6cef] cd 75 60
   and     $03                             ;[6cf2] e6 03
   ld      (iy+$0d),a                      ;[6cf4] fd 77 0d
   ld      hl,$6d4c                        ;[6cf7] 21 4c 6d
   call    $607b                           ;[6cfa] cd 7b 60
   ld      de,$ffff                        ;[6cfd] 11 ff ff
   call    $6d2a                           ;[6d00] cd 2a 6d
   cp      $03                             ;[6d03] fe 03
   jr      nz,$6d0f                        ;[6d05] 20 08
   call    $6cb5                           ;[6d07] cd b5 6c
   ld      a,$11                           ;[6d0a] 3e 11
   jp      $6206                           ;[6d0c] c3 06 62
   cp      $31                             ;[6d0f] fe 31
   jr      z,$6d17                         ;[6d11] 28 04
   cp      $32                             ;[6d13] fe 32
   jr      nz,$6d00                        ;[6d15] 20 e9
   call    $6075                           ;[6d17] cd 75 60
   and     $03                             ;[6d1a] e6 03
   ld      (iy+$10),a                      ;[6d1c] fd 77 10
   ld      a,$0a                           ;[6d1f] 3e 0a
   call    $6075                           ;[6d21] cd 75 60
   ld      a,$0d                           ;[6d24] 3e 0d
   call    $6075                           ;[6d26] cd 75 60
   ret                                     ;[6d29] c9
   ld      hl,($85e2)                      ;[6d2a] 2a e2 85
   ld      a,($8664)                       ;[6d2d] 3a 64 86
   ld       ($8666),a                      ;[6d30] 32 66 86
   jp      $ff67                           ;[6d33] c3 67 ff
   ld      a,(bc)                          ;[6d36] 0a
   dec     c                               ;[6d37] 0d
   ld      d,e                             ;[6d38] 53
   ld      c,a                             ;[6d39] 4f
   ld      d,l                             ;[6d3a] 55
   ld      d,d                             ;[6d3b] 52
   ld      b,e                             ;[6d3c] 43
   ld      b,l                             ;[6d3d] 45
   jr      nz,$6d84                        ;[6d3e] 20 44
   ld      d,d                             ;[6d40] 52
   ld      c,c                             ;[6d41] 49
   ld      d,(hl)                          ;[6d42] 56
   ld      b,l                             ;[6d43] 45
   jr      z,$6d77                         ;[6d44] 28 31
   cpl                                     ;[6d46] 2f
   ld       ($3f29),a                      ;[6d47] 32 29 3f
   jr      nz,$6d4c                        ;[6d4a] 20 00
   ld      a,(bc)                          ;[6d4c] 0a
   dec     c                               ;[6d4d] 0d
   ld      b,h                             ;[6d4e] 44
   ld      b,l                             ;[6d4f] 45
   ld      d,e                             ;[6d50] 53
   ld      d,h                             ;[6d51] 54
   ld      c,c                             ;[6d52] 49
   ld      c,(hl)                          ;[6d53] 4e
   ld      b,c                             ;[6d54] 41
   ld      d,h                             ;[6d55] 54
   ld      c,c                             ;[6d56] 49
   ld      c,a                             ;[6d57] 4f
   ld      c,(hl)                          ;[6d58] 4e
   jr      nz,$6d9f                        ;[6d59] 20 44
   ld      d,d                             ;[6d5b] 52
   ld      c,c                             ;[6d5c] 49
   ld      d,(hl)                          ;[6d5d] 56
   ld      b,l                             ;[6d5e] 45
   jr      z,$6d92                         ;[6d5f] 28 31
   cpl                                     ;[6d61] 2f
   ld       ($3f29),a                      ;[6d62] 32 29 3f
   jr      nz,$6d67                        ;[6d65] 20 00
   ld      a,(iy+$0d)                      ;[6d67] fd 7e 0d
   call    $6e03                           ;[6d6a] cd 03 6e
   cp      (iy+$10)                        ;[6d6d] fd be 10
   ret     nz                              ;[6d70] c0
   ld      hl,$6d9c                        ;[6d71] 21 9c 6d
   call    $607b                           ;[6d74] cd 7b 60
   ld      hl,$6db4                        ;[6d77] 21 b4 6d
   call    $607b                           ;[6d7a] cd 7b 60
   ld      de,$ffff                        ;[6d7d] 11 ff ff
   call    $6d2a                           ;[6d80] cd 2a 6d
   cp      $03                             ;[6d83] fe 03
   jp      z,$6d07                         ;[6d85] ca 07 6d
   cp      $20                             ;[6d88] fe 20
   jr      nz,$6d80                        ;[6d8a] 20 f4
   ret                                     ;[6d8c] c9
   ld      a,(iy+$10)                      ;[6d8d] fd 7e 10
   call    $6e03                           ;[6d90] cd 03 6e
   cp      (iy+$0d)                        ;[6d93] fd be 0d
   ret     nz                              ;[6d96] c0
   ld      hl,$6dcf                        ;[6d97] 21 cf 6d
   jr      $6d74                           ;[6d9a] 18 d8
   ld      a,(bc)                          ;[6d9c] 0a
   dec     c                               ;[6d9d] 0d
   ld      c,c                             ;[6d9e] 49
   ld      c,(hl)                          ;[6d9f] 4e
   ld      d,e                             ;[6da0] 53
   ld      b,l                             ;[6da1] 45
   ld      d,d                             ;[6da2] 52
   ld      d,h                             ;[6da3] 54
   jr      nz,$6df9                        ;[6da4] 20 53
   ld      c,a                             ;[6da6] 4f
   ld      d,l                             ;[6da7] 55
   ld      d,d                             ;[6da8] 52
   ld      b,e                             ;[6da9] 43
   ld      b,l                             ;[6daa] 45
   jr      nz,$6df1                        ;[6dab] 20 44
   ld      d,d                             ;[6dad] 52
   ld      c,c                             ;[6dae] 49
   ld      d,(hl)                          ;[6daf] 56
   ld      b,l                             ;[6db0] 45
   ld      a,(bc)                          ;[6db1] 0a
   dec     c                               ;[6db2] 0d
   nop                                     ;[6db3] 00
   jr      z,$6e06                         ;[6db4] 28 50
   ld      d,d                             ;[6db6] 52
   ld      b,l                             ;[6db7] 45
   ld      d,e                             ;[6db8] 53
   ld      d,e                             ;[6db9] 53
   jr      nz,$6e0f                        ;[6dba] 20 53
   ld      d,b                             ;[6dbc] 50
   ld      b,c                             ;[6dbd] 41
   ld      b,e                             ;[6dbe] 43
   ld      b,l                             ;[6dbf] 45
   jr      nz,$6e19                        ;[6dc0] 20 57
   ld      c,b                             ;[6dc2] 48
   ld      b,l                             ;[6dc3] 45
   ld      c,(hl)                          ;[6dc4] 4e
   jr      nz,$6e19                        ;[6dc5] 20 52
   ld      b,l                             ;[6dc7] 45
   ld      b,c                             ;[6dc8] 41
   ld      b,h                             ;[6dc9] 44
   ld      e,c                             ;[6dca] 59
   add     hl,hl                           ;[6dcb] 29
   ld      a,(bc)                          ;[6dcc] 0a
   dec     c                               ;[6dcd] 0d
   nop                                     ;[6dce] 00
   ld      a,(bc)                          ;[6dcf] 0a
   dec     c                               ;[6dd0] 0d
   ld      c,c                             ;[6dd1] 49
   ld      c,(hl)                          ;[6dd2] 4e
   ld      d,e                             ;[6dd3] 53
   ld      b,l                             ;[6dd4] 45
   ld      d,d                             ;[6dd5] 52
   ld      d,h                             ;[6dd6] 54
   jr      nz,$6e1d                        ;[6dd7] 20 44
   ld      b,l                             ;[6dd9] 45
   ld      d,e                             ;[6dda] 53
   ld      d,h                             ;[6ddb] 54
   ld      c,c                             ;[6ddc] 49
   ld      c,(hl)                          ;[6ddd] 4e
   ld      b,c                             ;[6dde] 41
   ld      d,h                             ;[6ddf] 54
   ld      c,c                             ;[6de0] 49
   ld      c,a                             ;[6de1] 4f
   ld      c,(hl)                          ;[6de2] 4e
   jr      nz,$6e29                        ;[6de3] 20 44
   ld      d,d                             ;[6de5] 52
   ld      c,c                             ;[6de6] 49
   ld      d,(hl)                          ;[6de7] 56
   ld      b,l                             ;[6de8] 45
   ld      a,(bc)                          ;[6de9] 0a
   dec     c                               ;[6dea] 0d
   nop                                     ;[6deb] 00
   call    $7056                           ;[6dec] cd 56 70
   ld      ix,$350a                        ;[6def] dd 21 0a 35
   rst     $18                             ;[6df3] df
   or      a                               ;[6df4] b7
   jr      nz,$6dfc                        ;[6df5] 20 05
   ld      a,$05                           ;[6df7] 3e 05
   jp      $6278                           ;[6df9] c3 78 62
   cp      $03                             ;[6dfc] fe 03
   jp      c,$6e03                         ;[6dfe] da 03 6e
   jr      $6df7                           ;[6e01] 18 f4
   cp      $01                             ;[6e03] fe 01
   jr      nz,$6e0c                        ;[6e05] 20 05
   ld      (iy+$40),$0b                    ;[6e07] fd 36 0b 40
   ret                                     ;[6e0b] c9
   ld      (iy+$60),$0b                    ;[6e0c] fd 36 0b 60
   ret                                     ;[6e10] c9
   ld      ix,$345d                        ;[6e11] dd 21 5d 34
   rst     $18                             ;[6e15] df
   ret                                     ;[6e16] c9
   ld      ix,$2ed3                        ;[6e17] dd 21 d3 2e
   rst     $18                             ;[6e1b] df
   ret                                     ;[6e1c] c9
   ld      ix,$3d61                        ;[6e1d] dd 21 61 3d
   rst     $18                             ;[6e21] df
   ret                                     ;[6e22] c9
   dec     hl                              ;[6e23] 2b
   ld      a,(hl)                          ;[6e24] 7e
   cp      $2c                             ;[6e25] fe 2c
   jr      nz,$6e23                        ;[6e27] 20 fa
   ld      (iy+$00),$10                    ;[6e29] fd 36 10 00
   dec     hl                              ;[6e2d] 2b
   inc     hl                              ;[6e2e] 23
   ld      a,(hl)                          ;[6e2f] 7e
   or      a                               ;[6e30] b7
   ret     z                               ;[6e31] c8
   cp      $2c                             ;[6e32] fe 2c
   jr      nz,$6e2e                        ;[6e34] 20 f8
   inc     hl                              ;[6e36] 23
   ld      a,(iy+$10)                      ;[6e37] fd 7e 10
   or      a                               ;[6e3a] b7
   jr      z,$6e45                         ;[6e3b] 28 08
   ld      a,(hl)                          ;[6e3d] 7e
   cp      $00                             ;[6e3e] fe 00
   ld      a,$01                           ;[6e40] 3e 01
   jp      z,$6206                         ;[6e42] ca 06 62
   inc     (iy+$10)                        ;[6e45] fd 34 10
   jr      $6e2f                           ;[6e48] 18 e5
   call    $6e11                           ;[6e4a] cd 11 6e
   call    $775c                           ;[6e4d] cd 5c 77
   or      a                               ;[6e50] b7
   jp      nz,$6206                        ;[6e51] c2 06 62
   rst     $08                             ;[6e54] cf
   inc     l                               ;[6e55] 2c
   push    hl                              ;[6e56] e5
   push    hl                              ;[6e57] e5
   call    $6e23                           ;[6e58] cd 23 6e
   pop     hl                              ;[6e5b] e1
   call    $709d                           ;[6e5c] cd 9d 70
   cp      $08                             ;[6e5f] fe 08
   ld      a,$05                           ;[6e61] 3e 05
   jp      nz,$6206                        ;[6e63] c2 06 62
   inc     de                              ;[6e66] 13
   ld      a,(de)                          ;[6e67] 1a
   or      a                               ;[6e68] b7
   ld      a,$0f                           ;[6e69] 3e 0f
   jp      nz,$6206                        ;[6e6b] c2 06 62
   call    $6f25                           ;[6e6e] cd 25 6f
   dec     de                              ;[6e71] 1b
   ld      a,(de)                          ;[6e72] 1a
   cp      $02                             ;[6e73] fe 02
   jr      z,$6e94                         ;[6e75] 28 1d
   call    $7056                           ;[6e77] cd 56 70
   ld      a,$02                           ;[6e7a] 3e 02
   ld      (de),a                          ;[6e7c] 12
   ex      de,hl                           ;[6e7d] eb
   ld      de,$000a                        ;[6e7e] 11 0a 00
   add     hl,de                           ;[6e81] 19
   ld      a,(hl)                          ;[6e82] 7e
   inc     hl                              ;[6e83] 23
   ld      (iy+$12),a                      ;[6e84] fd 77 12
   ld      a,(hl)                          ;[6e87] 7e
   ld      (iy+$11),a                      ;[6e88] fd 77 11
   ld      b,$01                           ;[6e8b] 06 01
   call    $790a                           ;[6e8d] cd 0a 79
   or      a                               ;[6e90] b7
   jp      nz,$6206                        ;[6e91] c2 06 62
   ld      b,$fd                           ;[6e94] 06 fd
   ld      hl,$8289                        ;[6e96] 21 89 82
   call    $6ecd                           ;[6e99] cd cd 6e
   ld      (hl),a                          ;[6e9c] 77
   ld      e,a                             ;[6e9d] 5f
   inc     hl                              ;[6e9e] 23
   cp      $2c                             ;[6e9f] fe 2c
   jr      nz,$6eb2                        ;[6ea1] 20 0f
   dec     (iy+$10)                        ;[6ea3] fd 35 10
   ld      a,(iy+$10)                      ;[6ea6] fd 7e 10
   or      a                               ;[6ea9] b7
   jr      nz,$6eb2                        ;[6eaa] 20 06
   dec     hl                              ;[6eac] 2b
   ld      (hl),$0d                        ;[6ead] 36 0d
   inc     hl                              ;[6eaf] 23
   jr      $6ebe                           ;[6eb0] 18 0c
   ld      a,e                             ;[6eb2] 7b
   cp      $0d                             ;[6eb3] fe 0d
   jr      z,$6ebe                         ;[6eb5] 28 07
   djnz    $6e99                           ;[6eb7] 10 e0
   ld      a,$17                           ;[6eb9] 3e 17
   jp      $6278                           ;[6ebb] c3 78 62
   dec     hl                              ;[6ebe] 2b
   ld      (hl),$00                        ;[6ebf] 36 00
   ld      hl,$8288                        ;[6ec1] 21 88 82
   exx                                     ;[6ec4] d9
   ei                                      ;[6ec5] fb
   ld      ix,$2e16                        ;[6ec6] dd 21 16 2e
   jp      $6272                           ;[6eca] c3 72 62
   push    hl                              ;[6ecd] e5
   push    de                              ;[6ece] d5
   push    bc                              ;[6ecf] c5
   call    $709d                           ;[6ed0] cd 9d 70
   ld      hl,$000c                        ;[6ed3] 21 0c 00
   ex      de,hl                           ;[6ed6] eb
   add     hl,de                           ;[6ed7] 19
   ld      a,(hl)                          ;[6ed8] 7e
   ex      de,hl                           ;[6ed9] eb
   ld      hl,$fc56                        ;[6eda] 21 56 fc
   add     l                               ;[6edd] 85
   ld      l,a                             ;[6ede] 6f
   ld      a,$00                           ;[6edf] 3e 00
   adc     h                               ;[6ee1] 8c
   ld      h,a                             ;[6ee2] 67
   ld      a,(hl)                          ;[6ee3] 7e
   or      a                               ;[6ee4] b7
   jr      nz,$6eeb                        ;[6ee5] 20 04
   ld      c,$0d                           ;[6ee7] 0e 0d
   jr      $6f1b                           ;[6ee9] 18 30
   ld      c,a                             ;[6eeb] 4f
   ld      a,(de)                          ;[6eec] 1a
   inc     a                               ;[6eed] 3c
   ld      (de),a                          ;[6eee] 12
   cp      $fe                             ;[6eef] fe fe
   jr      nz,$6f1b                        ;[6ef1] 20 28
   xor     a                               ;[6ef3] af
   ld      (de),a                          ;[6ef4] 12
   ld      hl,$fd54                        ;[6ef5] 21 54 fd
   ld      a,(hl)                          ;[6ef8] 7e
   or      a                               ;[6ef9] b7
   jr      nz,$6f03                        ;[6efa] 20 07
   inc     hl                              ;[6efc] 23
   ld      a,(hl)                          ;[6efd] 7e
   or      a                               ;[6efe] b7
   jr      z,$6f20                         ;[6eff] 28 1f
   dec     hl                              ;[6f01] 2b
   ld      a,(hl)                          ;[6f02] 7e
   ld      (iy+$12),a                      ;[6f03] fd 77 12
   dec     de                              ;[6f06] 1b
   dec     de                              ;[6f07] 1b
   ld      (de),a                          ;[6f08] 12
   inc     hl                              ;[6f09] 23
   ld      a,(hl)                          ;[6f0a] 7e
   ld      (iy+$11),a                      ;[6f0b] fd 77 11
   inc     de                              ;[6f0e] 13
   ld      (de),a                          ;[6f0f] 12
   push    bc                              ;[6f10] c5
   ld      b,$01                           ;[6f11] 06 01
   call    $790a                           ;[6f13] cd 0a 79
   pop     bc                              ;[6f16] c1
   or      a                               ;[6f17] b7
   jp      nz,$6206                        ;[6f18] c2 06 62
   ld      a,c                             ;[6f1b] 79
   pop     bc                              ;[6f1c] c1
   pop     de                              ;[6f1d] d1
   pop     hl                              ;[6f1e] e1
   ret                                     ;[6f1f] c9
   ld      a,$ff                           ;[6f20] 3e ff
   ld      (de),a                          ;[6f22] 12
   jr      $6f1b                           ;[6f23] 18 f6
   push    de                              ;[6f25] d5
   pop     ix                              ;[6f26] dd e1
   ld      a,(ix+$13)                      ;[6f28] dd 7e 13
   cp      $52                             ;[6f2b] fe 52
   ld      a,$0c                           ;[6f2d] 3e 0c
   jp      z,$6206                         ;[6f2f] ca 06 62
   ret                                     ;[6f32] c9
   call    $6e11                           ;[6f33] cd 11 6e
   call    $775c                           ;[6f36] cd 5c 77
   or      a                               ;[6f39] b7
   jp      nz,$6206                        ;[6f3a] c2 06 62
   push    hl                              ;[6f3d] e5
   call    $709d                           ;[6f3e] cd 9d 70
   cp      $08                             ;[6f41] fe 08
   ld      a,$05                           ;[6f43] 3e 05
   jp      nz,$6206                        ;[6f45] c2 06 62
   inc     de                              ;[6f48] 13
   call    $6f25                           ;[6f49] cd 25 6f
   pop     hl                              ;[6f4c] e1
   rst     $08                             ;[6f4d] cf
   inc     l                               ;[6f4e] 2c
   dec     hl                              ;[6f4f] 2b
   call    $606f                           ;[6f50] cd 6f 60
   call    z,$6f8a                         ;[6f53] cc 8a 6f
   jr      nz,$6f5b                        ;[6f56] 20 03
   push    hl                              ;[6f58] e5
   pop     hl                              ;[6f59] e1
   ret                                     ;[6f5a] c9
   push    hl                              ;[6f5b] e5
   cp      $2c                             ;[6f5c] fe 2c
   jp      z,$6f91                         ;[6f5e] ca 91 6f
   cp      $3b                             ;[6f61] fe 3b
   jr      z,$6f94                         ;[6f63] 28 2f
   pop     bc                              ;[6f65] c1
   call    $6e17                           ;[6f66] cd 17 6e
   push    hl                              ;[6f69] e5
   ld      ix,$320f                        ;[6f6a] dd 21 0f 32
   rst     $18                             ;[6f6e] df
   jr      z,$6f84                         ;[6f6f] 28 13
   ld      ix,$44b5                        ;[6f71] dd 21 b5 44
   rst     $18                             ;[6f75] df
   ld      ix,$627d                        ;[6f76] dd 21 7d 62
   rst     $18                             ;[6f7a] df
   call    $6f98                           ;[6f7b] cd 98 6f
   ld      a,$20                           ;[6f7e] 3e 20
   call    $6fac                           ;[6f80] cd ac 6f
   or      a                               ;[6f83] b7
   call    z,$6f98                         ;[6f84] cc 98 6f
   pop     hl                              ;[6f87] e1
   jr      $6f4f                           ;[6f88] 18 c5
   ld      a,$0d                           ;[6f8a] 3e 0d
   call    $6fac                           ;[6f8c] cd ac 6f
   xor     a                               ;[6f8f] af
   ret                                     ;[6f90] c9
   call    $6fac                           ;[6f91] cd ac 6f
   pop     hl                              ;[6f94] e1
   rst     $10                             ;[6f95] d7
   jr      $6f56                           ;[6f96] 18 be
   ld      ix,$644b                        ;[6f98] dd 21 4b 64
   rst     $18                             ;[6f9c] df
   ld      ix,$3ca8                        ;[6f9d] dd 21 a8 3c
   rst     $18                             ;[6fa1] df
   inc     d                               ;[6fa2] 14
   dec     d                               ;[6fa3] 15
   ret     z                               ;[6fa4] c8
   ld      a,(bc)                          ;[6fa5] 0a
   call    $6fac                           ;[6fa6] cd ac 6f
   inc     bc                              ;[6fa9] 03
   jr      $6fa3                           ;[6faa] 18 f7
   push    hl                              ;[6fac] e5
   push    de                              ;[6fad] d5
   push    bc                              ;[6fae] c5
   push    af                              ;[6faf] f5
   call    $709d                           ;[6fb0] cd 9d 70
   ex      de,hl                           ;[6fb3] eb
   inc     hl                              ;[6fb4] 23
   ld      a,(hl)                          ;[6fb5] 7e
   or      a                               ;[6fb6] b7
   ld      a,$10                           ;[6fb7] 3e 10
   jp      z,$6206                         ;[6fb9] ca 06 62
   dec     hl                              ;[6fbc] 2b
   ld      a,(hl)                          ;[6fbd] 7e
   cp      $02                             ;[6fbe] fe 02
   jr      z,$6fe4                         ;[6fc0] 28 22
   call    $7056                           ;[6fc2] cd 56 70
   ld      de,$000a                        ;[6fc5] 11 0a 00
   add     hl,de                           ;[6fc8] 19
   ld      a,(hl)                          ;[6fc9] 7e
   inc     hl                              ;[6fca] 23
   ld      (iy+$12),a                      ;[6fcb] fd 77 12
   ld      a,(hl)                          ;[6fce] 7e
   inc     hl                              ;[6fcf] 23
   ld      (iy+$11),a                      ;[6fd0] fd 77 11
   push    hl                              ;[6fd3] e5
   ld      b,$01                           ;[6fd4] 06 01
   call    $790a                           ;[6fd6] cd 0a 79
   or      a                               ;[6fd9] b7
   jp      nz,$6206                        ;[6fda] c2 06 62
   pop     hl                              ;[6fdd] e1
   ld      de,$fff4                        ;[6fde] 11 f4 ff
   add     hl,de                           ;[6fe1] 19
   ld      (hl),$02                        ;[6fe2] 36 02
   ld      de,$000c                        ;[6fe4] 11 0c 00
   add     hl,de                           ;[6fe7] 19
   ld      e,(hl)                          ;[6fe8] 5e
   inc     (hl)                            ;[6fe9] 34
   ld      d,$00                           ;[6fea] 16 00
   ld      hl,$fc56                        ;[6fec] 21 56 fc
   add     hl,de                           ;[6fef] 19
   pop     af                              ;[6ff0] f1
   push    af                              ;[6ff1] f5
   ld      (hl),a                          ;[6ff2] 77
   ld      a,e                             ;[6ff3] 7b
   cp      $00                             ;[6ff4] fe 00
   jr      z,$7000                         ;[6ff6] 28 08
   dec     hl                              ;[6ff8] 2b
   ld      a,(hl)                          ;[6ff9] 7e
   cp      $0d                             ;[6ffa] fe 0d
   jr      nz,$7000                        ;[6ffc] 20 02
   ld      (hl),$2c                        ;[6ffe] 36 2c
   ld      a,e                             ;[7000] 7b
   inc     a                               ;[7001] 3c
   cp      $fe                             ;[7002] fe fe
   jr      nz,$7051                        ;[7004] 20 4b
   call    $7a97                           ;[7006] cd 97 7a
   or      a                               ;[7009] b7
   jp      nz,$6206                        ;[700a] c2 06 62
   ld      hl,$fd53                        ;[700d] 21 53 fd
   ld      a,(ix+$05)                      ;[7010] dd 7e 05
   cp      $52                             ;[7013] fe 52
   jr      z,$701e                         ;[7015] 28 07
   ld      a,(hl)                          ;[7017] 7e
   cp      $0d                             ;[7018] fe 0d
   jr      nz,$701e                        ;[701a] 20 02
   ld      (hl),$2c                        ;[701c] 36 2c
   inc     hl                              ;[701e] 23
   ld      a,(iy+$16)                      ;[701f] fd 7e 16
   ld      (hl),a                          ;[7022] 77
   inc     hl                              ;[7023] 23
   ld      a,(iy+$15)                      ;[7024] fd 7e 15
   ld      (hl),a                          ;[7027] 77
   ld      b,$00                           ;[7028] 06 00
   call    $790a                           ;[702a] cd 0a 79
   or      a                               ;[702d] b7
   jp      nz,$6206                        ;[702e] c2 06 62
   call    $67c5                           ;[7031] cd c5 67
   call    $709d                           ;[7034] cd 9d 70
   ex      de,hl                           ;[7037] eb
   ld      de,$000a                        ;[7038] 11 0a 00
   add     hl,de                           ;[703b] 19
   ld      a,(iy+$16)                      ;[703c] fd 7e 16
   ld      (iy+$12),a                      ;[703f] fd 77 12
   ld      (hl),a                          ;[7042] 77
   inc     hl                              ;[7043] 23
   ld      a,(iy+$15)                      ;[7044] fd 7e 15
   ld      (iy+$11),a                      ;[7047] fd 77 11
   ld      (hl),a                          ;[704a] 77
   inc     hl                              ;[704b] 23
   xor     a                               ;[704c] af
   ld      (hl),a                          ;[704d] 77
   call    $67b8                           ;[704e] cd b8 67
   pop     af                              ;[7051] f1
   pop     bc                              ;[7052] c1
   pop     de                              ;[7053] d1
   pop     hl                              ;[7054] e1
   ret                                     ;[7055] c9
   push    hl                              ;[7056] e5
   push    de                              ;[7057] d5
   push    iy                              ;[7058] fd e5
   pop     hl                              ;[705a] e1
   ld      de,$0017                        ;[705b] 11 17 00
   add     hl,de                           ;[705e] 19
   call    $706c                           ;[705f] cd 6c 70
   ld      de,$0015                        ;[7062] 11 15 00
   add     hl,de                           ;[7065] 19
   call    $706c                           ;[7066] cd 6c 70
   pop     de                              ;[7069] d1
   pop     hl                              ;[706a] e1
   ret                                     ;[706b] c9
   ld      a,(hl)                          ;[706c] 7e
   or      a                               ;[706d] b7
   ret     z                               ;[706e] c8
   cp      $02                             ;[706f] fe 02
   ret     nz                              ;[7071] c0
   ld      (hl),$01                        ;[7072] 36 01
   inc     hl                              ;[7074] 23
   ld      a,(hl)                          ;[7075] 7e
   or      a                               ;[7076] b7
   dec     hl                              ;[7077] 2b
   ret     z                               ;[7078] c8
   ld      de,$000a                        ;[7079] 11 0a 00
   add     hl,de                           ;[707c] 19
   ld      a,(hl)                          ;[707d] 7e
   ld      (iy+$12),a                      ;[707e] fd 77 12
   inc     hl                              ;[7081] 23
   ld      a,(hl)                          ;[7082] 7e
   ld      (iy+$11),a                      ;[7083] fd 77 11
   push    hl                              ;[7086] e5
   ld      b,$00                           ;[7087] 06 00
   call    $790a                           ;[7089] cd 0a 79
   pop     hl                              ;[708c] e1
   or      a                               ;[708d] b7
   jp      nz,$6206                        ;[708e] c2 06 62
   ld      de,$fff5                        ;[7091] 11 f5 ff
   add     hl,de                           ;[7094] 19
   ret                                     ;[7095] c9
   push    hl                              ;[7096] e5
   push    de                              ;[7097] d5
   push    bc                              ;[7098] c5
   push    af                              ;[7099] f5
   jp      $7006                           ;[709a] c3 06 70
   push    iy                              ;[709d] fd e5
   pop     hl                              ;[709f] e1
   ld      (iy+$00),$00                    ;[70a0] fd 36 00 00
   ld      de,$0017                        ;[70a4] 11 17 00
   add     hl,de                           ;[70a7] 19
   ld      a,(hl)                          ;[70a8] 7e
   or      a                               ;[70a9] b7
   jr      z,$70b5                         ;[70aa] 28 09
   call    $70e4                           ;[70ac] cd e4 70
   cp      $08                             ;[70af] fe 08
   ret     z                               ;[70b1] c8
   inc     (iy+$00)                        ;[70b2] fd 34 00
   ld      de,$0015                        ;[70b5] 11 15 00
   add     hl,de                           ;[70b8] 19
   ld      a,(hl)                          ;[70b9] 7e
   or      a                               ;[70ba] b7
   jr      nz,$70d1                        ;[70bb] 20 14
   push    iy                              ;[70bd] fd e5
   pop     hl                              ;[70bf] e1
   ld      de,$0017                        ;[70c0] 11 17 00
   add     hl,de                           ;[70c3] 19
   ld      a,(iy+$00)                      ;[70c4] fd 7e 00
   or      a                               ;[70c7] b7
   jr      z,$70ce                         ;[70c8] 28 04
   ld      de,$0015                        ;[70ca] 11 15 00
   add     hl,de                           ;[70cd] 19
   ld      a,$05                           ;[70ce] 3e 05
   ret                                     ;[70d0] c9
   call    $70e4                           ;[70d1] cd e4 70
   cp      $08                             ;[70d4] fe 08
   ret     z                               ;[70d6] c8
   or      a                               ;[70d7] b7
   sbc     hl,de                           ;[70d8] ed 52
   ld      a,(iy+$17)                      ;[70da] fd 7e 17
   or      a                               ;[70dd] b7
   ld      a,$0e                           ;[70de] 3e 0e
   ret     nz                              ;[70e0] c0
   ld      a,$05                           ;[70e1] 3e 05
   ret                                     ;[70e3] c9
   push    iy                              ;[70e4] fd e5
   push    hl                              ;[70e6] e5
   ld      b,$08                           ;[70e7] 06 08
   inc     hl                              ;[70e9] 23
   inc     hl                              ;[70ea] 23
   ld      a,(iy+$01)                      ;[70eb] fd 7e 01
   cp      (hl)                            ;[70ee] be
   inc     hl                              ;[70ef] 23
   inc     iy                              ;[70f0] fd 23
   jr      nz,$70fc                        ;[70f2] 20 08
   djnz    $70eb                           ;[70f4] 10 f5
   ld      a,$08                           ;[70f6] 3e 08
   pop     de                              ;[70f8] d1
   pop     iy                              ;[70f9] fd e1
   ret                                     ;[70fb] c9
   pop     hl                              ;[70fc] e1
   pop     iy                              ;[70fd] fd e1
   ld      a,$05                           ;[70ff] 3e 05
   ret                                     ;[7101] c9
   call    $774b                           ;[7102] cd 4b 77
   or      a                               ;[7105] b7
   jp      nz,$6206                        ;[7106] c2 06 62
   push    hl                              ;[7109] e5
   ld      hl,($803f)                      ;[710a] 2a 3f 80
   inc     hl                              ;[710d] 23
   ld      a,h                             ;[710e] 7c
   or      l                               ;[710f] b5
   jr      nz,$711c                        ;[7110] 20 0a
   call    $709d                           ;[7112] cd 9d 70
   pop     hl                              ;[7115] e1
   cp      $08                             ;[7116] fe 08
   ret     nz                              ;[7118] c0
   xor     a                               ;[7119] af
   ld      (de),a                          ;[711a] 12
   ret                                     ;[711b] c9
   call    $709d                           ;[711c] cd 9d 70
   pop     hl                              ;[711f] e1
   cp      $08                             ;[7120] fe 08
   ret     nz                              ;[7122] c0
   ld      a,(de)                          ;[7123] 1a
   cp      $02                             ;[7124] fe 02
   ld      a,$00                           ;[7126] 3e 00
   ld      (de),a                          ;[7128] 12
   ret     nz                              ;[7129] c0
   inc     de                              ;[712a] 13
   ld      a,(de)                          ;[712b] 1a
   and     $7f                             ;[712c] e6 7f
   or      a                               ;[712e] b7
   ret     z                               ;[712f] c8
   push    hl                              ;[7130] e5
   ex      de,hl                           ;[7131] eb
   ld      de,$0009                        ;[7132] 11 09 00
   add     hl,de                           ;[7135] 19
   ld      a,(hl)                          ;[7136] 7e
   inc     hl                              ;[7137] 23
   ld      (iy+$12),a                      ;[7138] fd 77 12
   ld      a,(hl)                          ;[713b] 7e
   ld      (iy+$11),a                      ;[713c] fd 77 11
   ld      b,$00                           ;[713f] 06 00
   call    $790a                           ;[7141] cd 0a 79
   or      a                               ;[7144] b7
   jp      nz,$6206                        ;[7145] c2 06 62
   pop     hl                              ;[7148] e1
   ret                                     ;[7149] c9
   call    $6e11                           ;[714a] cd 11 6e
   call    $775c                           ;[714d] cd 5c 77
   push    hl                              ;[7150] e5
   or      a                               ;[7151] b7
   jp      nz,$6206                        ;[7152] c2 06 62
   pop     af                              ;[7155] f1
   rst     $08                             ;[7156] cf
   inc     l                               ;[7157] 2c
   inc     hl                              ;[7158] 23
   cp      $4c                             ;[7159] fe 4c
   jp      z,$72d0                         ;[715b] ca d0 72
   dec     hl                              ;[715e] 2b
   ld      (iy+$44),$50                    ;[715f] fd 36 50 44
   ld      ix,$350a                        ;[7163] dd 21 0a 35
   rst     $18                             ;[7167] df
   or      a                               ;[7168] b7
   jr      z,$7174                         ;[7169] 28 09
   cp      $02                             ;[716b] fe 02
   jr      c,$7174                         ;[716d] 38 05
   ld      a,$05                           ;[716f] 3e 05
   jp      $6278                           ;[7171] c3 78 62
   ld      (iy+$0c),a                      ;[7174] fd 77 0c
   push    hl                              ;[7177] e5
   call    $7056                           ;[7178] cd 56 70
   call    $709d                           ;[717b] cd 9d 70
   cp      $05                             ;[717e] fe 05
   jp      nz,$6206                        ;[7180] c2 06 62
   push    hl                              ;[7183] e5
   pop     ix                              ;[7184] dd e1
   ld      a,(iy+$50)                      ;[7186] fd 7e 50
   ld      (iy+$09),a                      ;[7189] fd 77 09
   ld      (ix+$14),a                      ;[718c] dd 77 14
   ld      (hl),$01                        ;[718f] 36 01
   inc     hl                              ;[7191] 23
   cp      $52                             ;[7192] fe 52
   ld      a,$80                           ;[7194] 3e 80
   jr      z,$719b                         ;[7196] 28 03
   ld      a,(iy+$0c)                      ;[7198] fd 7e 0c
   ld      (hl),a                          ;[719b] 77
   inc     hl                              ;[719c] 23
   push    iy                              ;[719d] fd e5
   pop     de                              ;[719f] d1
   inc     de                              ;[71a0] 13
   ex      de,hl                           ;[71a1] eb
   ld      bc,$0008                        ;[71a2] 01 08 00
   ldir                                    ;[71a5] ed b0
   push    de                              ;[71a7] d5
   call    $678b                           ;[71a8] cd 8b 67
   call    $7a97                           ;[71ab] cd 97 7a
   or      a                               ;[71ae] b7
   jp      nz,$6206                        ;[71af] c2 06 62
   push    hl                              ;[71b2] e5
   push    bc                              ;[71b3] c5
   call    $7aea                           ;[71b4] cd ea 7a
   cp      $02                             ;[71b7] fe 02
   jp      nz,$71ee                        ;[71b9] c2 ee 71
   pop     bc                              ;[71bc] c1
   pop     hl                              ;[71bd] e1
   ld      a,c                             ;[71be] 79
   xor     (hl)                            ;[71bf] ae
   ld      (hl),a                          ;[71c0] 77
   ld      b,(iy+$50)                      ;[71c1] fd 46 50
   ld      a,(iy+$0a)                      ;[71c4] fd 7e 0a
   cp      b                               ;[71c7] b8
   ld      a,$0c                           ;[71c8] 3e 0c
   jp      nz,$6206                        ;[71ca] c2 06 62
   pop     hl                              ;[71cd] e1
   ld      a,(de)                          ;[71ce] 1a
   ld      (hl),a                          ;[71cf] 77
   ld      (iy+$12),a                      ;[71d0] fd 77 12
   inc     de                              ;[71d3] 13
   inc     hl                              ;[71d4] 23
   ld      a,(de)                          ;[71d5] 1a
   ld      (hl),a                          ;[71d6] 77
   ld      (iy+$11),a                      ;[71d7] fd 77 11
   xor     a                               ;[71da] af
   inc     hl                              ;[71db] 23
   ld      (hl),a                          ;[71dc] 77
   ld      a,(iy+$50)                      ;[71dd] fd 7e 50
   cp      $52                             ;[71e0] fe 52
   jp      z,$72f2                         ;[71e2] ca f2 72
   ld      a,(iy+$0c)                      ;[71e5] fd 7e 0c
   or      a                               ;[71e8] b7
   jp      nz,$727d                        ;[71e9] c2 7d 72
   pop     hl                              ;[71ec] e1
   ret                                     ;[71ed] c9
   pop     bc                              ;[71ee] c1
   pop     bc                              ;[71ef] c1
   ld      c,a                             ;[71f0] 4f
   push    bc                              ;[71f1] c5
   ld      a,(iy+$0c)                      ;[71f2] fd 7e 0c
   or      a                               ;[71f5] b7
   ld      c,$0d                           ;[71f6] 0e 0d
   jp      z,$7271                         ;[71f8] ca 71 72
   call    $7bbc                           ;[71fb] cd bc 7b
   push    bc                              ;[71fe] c5
   ld      bc,$0002                        ;[71ff] 01 02 00
   call    $7887                           ;[7202] cd 87 78
   pop     bc                              ;[7205] c1
   in      a,($12)                         ;[7206] db 12
   rrca                                    ;[7208] 0f
   ld      c,$04                           ;[7209] 0e 04
   jp      c,$7271                         ;[720b] da 71 72
   pop     bc                              ;[720e] c1
   ld      a,c                             ;[720f] 79
   cp      $03                             ;[7210] fe 03
   jp      z,$6206                         ;[7212] ca 06 62
   pop     hl                              ;[7215] e1
   ld      a,(iy+$16)                      ;[7216] fd 7e 16
   ld      (iy+$12),a                      ;[7219] fd 77 12
   ld      (hl),a                          ;[721c] 77
   inc     hl                              ;[721d] 23
   ld      a,(iy+$15)                      ;[721e] fd 7e 15
   ld      (iy+$11),a                      ;[7221] fd 77 11
   ld      (hl),a                          ;[7224] 77
   inc     hl                              ;[7225] 23
   ld      (hl),$00                        ;[7226] 36 00
   push    hl                              ;[7228] e5
   pop     ix                              ;[7229] dd e1
   ld      a,(iy+$50)                      ;[722b] fd 7e 50
   ld      (ix+$08),a                      ;[722e] dd 77 08
   call    $67b8                           ;[7231] cd b8 67
   call    $67c5                           ;[7234] cd c5 67
   call    $6aba                           ;[7237] cd ba 6a
   ld      b,$00                           ;[723a] 06 00
   call    $790a                           ;[723c] cd 0a 79
   or      a                               ;[723f] b7
   jp      nz,$6206                        ;[7240] c2 06 62
   ld      a,(iy+$50)                      ;[7243] fd 7e 50
   cp      $44                             ;[7246] fe 44
   jr      z,$726f                         ;[7248] 28 25
   call    $67aa                           ;[724a] cd aa 67
   ld      hl,$fc56                        ;[724d] 21 56 fc
   ld      a,(iy+$4d)                      ;[7250] fd 7e 4d
   ld      (ix+$03),a                      ;[7253] dd 77 03
   ld      (hl),a                          ;[7256] 77
   ld      a,(iy+$4e)                      ;[7257] fd 7e 4e
   ld      (ix+$04),a                      ;[725a] dd 77 04
   inc     hl                              ;[725d] 23
   ld      (hl),a                          ;[725e] 77
   ld      a,(iy+$16)                      ;[725f] fd 7e 16
   ld      (ix+$2f),a                      ;[7262] dd 77 2f
   ld      a,(iy+$15)                      ;[7265] fd 7e 15
   ld      (ix+$30),a                      ;[7268] dd 77 30
   ld      (ix+$02),$f4                    ;[726b] dd 36 f4 02
   pop     hl                              ;[726f] e1
   ret                                     ;[7270] c9
   pop     af                              ;[7271] f1
   pop     hl                              ;[7272] e1
   ld      de,$fff6                        ;[7273] 11 f6 ff
   add     hl,de                           ;[7276] 19
   ld      (hl),$00                        ;[7277] 36 00
   ld      a,c                             ;[7279] 79
   jp      $6206                           ;[727a] c3 06 62
   push    hl                              ;[727d] e5
   ld      b,$01                           ;[727e] 06 01
   call    $790a                           ;[7280] cd 0a 79
   or      a                               ;[7283] b7
   jp      nz,$6206                        ;[7284] c2 06 62
   ld      hl,$fd54                        ;[7287] 21 54 fd
   ld      a,(hl)                          ;[728a] 7e
   or      a                               ;[728b] b7
   jr      z,$7298                         ;[728c] 28 0a
   ld      (iy+$12),a                      ;[728e] fd 77 12
   inc     hl                              ;[7291] 23
   ld      a,(hl)                          ;[7292] 7e
   ld      (iy+$11),a                      ;[7293] fd 77 11
   jr      $727e                           ;[7296] 18 e6
   ld      b,$fe                           ;[7298] 06 fe
   ld      hl,$fc56                        ;[729a] 21 56 fc
   ld      a,(hl)                          ;[729d] 7e
   inc     hl                              ;[729e] 23
   or      a                               ;[729f] b7
   jr      z,$72bf                         ;[72a0] 28 1d
   djnz    $729d                           ;[72a2] 10 f9
   call    $678b                           ;[72a4] cd 8b 67
   call    $7a97                           ;[72a7] cd 97 7a
   or      a                               ;[72aa] b7
   jp      nz,$6206                        ;[72ab] c2 06 62
   ld      a,(iy+$16)                      ;[72ae] fd 7e 16
   ld      (iy+$12),a                      ;[72b1] fd 77 12
   ld      a,(iy+$15)                      ;[72b4] fd 7e 15
   ld      (iy+$11),a                      ;[72b7] fd 77 11
   call    $67b8                           ;[72ba] cd b8 67
   ld      b,$fe                           ;[72bd] 06 fe
   ld      a,$fe                           ;[72bf] 3e fe
   sub     b                               ;[72c1] 90
   pop     hl                              ;[72c2] e1
   ld      (hl),a                          ;[72c3] 77
   dec     hl                              ;[72c4] 2b
   ld      a,(iy+$11)                      ;[72c5] fd 7e 11
   ld      (hl),a                          ;[72c8] 77
   dec     hl                              ;[72c9] 2b
   ld      a,(iy+$12)                      ;[72ca] fd 7e 12
   ld      (hl),a                          ;[72cd] 77
   pop     hl                              ;[72ce] e1
   ret                                     ;[72cf] c9
   call    $6e17                           ;[72d0] cd 17 6e
   push    hl                              ;[72d3] e5
   call    $6e1d                           ;[72d4] cd 1d 6e
   ld      a,h                             ;[72d7] 7c
   or      a                               ;[72d8] b7
   ld      a,$14                           ;[72d9] 3e 14
   jp      m,$6206                         ;[72db] fa 06 62
   call    $74f1                           ;[72de] cd f1 74
   ld      (iy+$4d),l                      ;[72e1] fd 75 4d
   ld      (iy+$4e),h                      ;[72e4] fd 74 4e
   ld      (iy+$52),$50                    ;[72e7] fd 36 50 52
   ld      (iy+$01),$0c                    ;[72eb] fd 36 0c 01
   jp      $7178                           ;[72ef] c3 78 71
   push    hl                              ;[72f2] e5
   pop     ix                              ;[72f3] dd e1
   ld      (ix+$52),$08                    ;[72f5] dd 36 08 52
   ld      a,(ix-$02)                      ;[72f9] dd 7e fe
   ld      (iy+$12),a                      ;[72fc] fd 77 12
   ld      (ix+$2f),a                      ;[72ff] dd 77 2f
   ld      a,(ix-$01)                      ;[7302] dd 7e ff
   ld      (iy+$11),a                      ;[7305] fd 77 11
   ld      (ix+$30),a                      ;[7308] dd 77 30
   ld      b,$01                           ;[730b] 06 01
   call    $790a                           ;[730d] cd 0a 79
   or      a                               ;[7310] b7
   jp      nz,$6206                        ;[7311] c2 06 62
   ld      hl,$fc56                        ;[7314] 21 56 fc
   ld      a,(hl)                          ;[7317] 7e
   ld      (ix+$03),a                      ;[7318] dd 77 03
   cp      (iy+$4d)                        ;[731b] fd be 4d
   ld      a,$15                           ;[731e] 3e 15
   jp      nz,$6206                        ;[7320] c2 06 62
   inc     hl                              ;[7323] 23
   ld      a,(hl)                          ;[7324] 7e
   ld      (ix+$04),a                      ;[7325] dd 77 04
   cp      (iy+$4e)                        ;[7328] fd be 4e
   ld      a,$15                           ;[732b] 3e 15
   jp      nz,$6206                        ;[732d] c2 06 62
   ld      (ix+$02),$00                    ;[7330] dd 36 00 02
   jp      $71ec                           ;[7334] c3 ec 71
   ld      a,h                             ;[7337] 7c
   sub     d                               ;[7338] 92
   ret     nz                              ;[7339] c0
   ld      a,l                             ;[733a] 7d
   sub     e                               ;[733b] 93
   ret                                     ;[733c] c9
   call    $6e11                           ;[733d] cd 11 6e
   call    $775c                           ;[7340] cd 5c 77
   push    hl                              ;[7343] e5
   or      a                               ;[7344] b7
   jp      nz,$6206                        ;[7345] c2 06 62
   call    $709d                           ;[7348] cd 9d 70
   push    de                              ;[734b] d5
   pop     ix                              ;[734c] dd e1
   cp      $08                             ;[734e] fe 08
   ld      a,$05                           ;[7350] 3e 05
   jp      nz,$6206                        ;[7352] c2 06 62
   ld      a,(ix+$14)                      ;[7355] dd 7e 14
   cp      $52                             ;[7358] fe 52
   ld      a,$0c                           ;[735a] 3e 0c
   jp      nz,$6206                        ;[735c] c2 06 62
   call    $7056                           ;[735f] cd 56 70
   ld      a,(iy+$50)                      ;[7362] fd 7e 50
   cp      $01                             ;[7365] fe 01
   jr      nz,$736f                        ;[7367] 20 06
   ld      (ix+$01),$01                    ;[7369] dd 36 01 01
   jr      $7373                           ;[736d] 18 04
   ld      (ix+$00),$01                    ;[736f] dd 36 01 00
   ex      de,hl                           ;[7373] eb
   ex      (sp),hl                         ;[7374] e3
   rst     $08                             ;[7375] cf
   inc     l                               ;[7376] 2c
   call    $6e17                           ;[7377] cd 17 6e
   push    hl                              ;[737a] e5
   call    $6e1d                           ;[737b] cd 1d 6e
   ld      a,h                             ;[737e] 7c
   or      a                               ;[737f] b7
   ld      a,$14                           ;[7380] 3e 14
   jp      m,$6206                         ;[7382] fa 06 62
   pop     af                              ;[7385] f1
   pop     ix                              ;[7386] dd e1
   push    ix                              ;[7388] dd e5
   push    af                              ;[738a] f5
   call    $74f1                           ;[738b] cd f1 74
   ld      (ix+$0d),l                      ;[738e] dd 75 0d
   ld      (ix+$0e),h                      ;[7391] dd 74 0e
   pop     hl                              ;[7394] e1
   rst     $08                             ;[7395] cf
   inc     l                               ;[7396] 2c
   call    $6e17                           ;[7397] cd 17 6e
   push    hl                              ;[739a] e5
   call    $6e1d                           ;[739b] cd 1d 6e
   ld      a,h                             ;[739e] 7c
   or      a                               ;[739f] b7
   ld      a,$14                           ;[73a0] 3e 14
   jp      m,$6206                         ;[73a2] fa 06 62
   pop     af                              ;[73a5] f1
   pop     de                              ;[73a6] d1
   push    de                              ;[73a7] d5
   push    af                              ;[73a8] f5
   call    $74f1                           ;[73a9] cd f1 74
   ld      ix,$000f                        ;[73ac] dd 21 0f 00
   add     ix,de                           ;[73b0] dd 19
   push    hl                              ;[73b2] e5
   pop     de                              ;[73b3] d1
   ld      l,(ix+$00)                      ;[73b4] dd 6e 00
   ld      h,(ix+$01)                      ;[73b7] dd 66 01
   call    $7337                           ;[73ba] cd 37 73
   ld      a,$13                           ;[73bd] 3e 13
   jp      c,$6206                         ;[73bf] da 06 62
   ld      (ix+$03),d                      ;[73c2] dd 72 03
   ld      (ix+$02),e                      ;[73c5] dd 73 02
   ld      (ix+$02),$f1                    ;[73c8] dd 36 f1 02
   ld      a,(ix+$2c)                      ;[73cc] dd 7e 2c
   ld      (iy+$12),a                      ;[73cf] fd 77 12
   ld      (ix-$05),a                      ;[73d2] dd 77 fb
   ld      a,(ix+$2d)                      ;[73d5] dd 7e 2d
   ld      (iy+$11),a                      ;[73d8] fd 77 11
   ld      (ix-$04),a                      ;[73db] dd 77 fc
   ld      (ix+$02),$fd                    ;[73de] dd 36 fd 02
   ld      b,$01                           ;[73e2] 06 01
   call    $790a                           ;[73e4] cd 0a 79
   or      a                               ;[73e7] b7
   jp      nz,$6206                        ;[73e8] c2 06 62
   ld      (ix+$04),a                      ;[73eb] dd 77 04
   ld      a,(ix-$03)                      ;[73ee] dd 7e fd
   inc     a                               ;[73f1] 3c
   cp      $fe                             ;[73f2] fe fe
   jp      nz,$74eb                        ;[73f4] c2 eb 74
   ld      de,$00fd                        ;[73f7] 11 fd 00
   call    $74e6                           ;[73fa] cd e6 74
   ld      a,(hl)                          ;[73fd] 7e
   ld      (iy+$49),a                      ;[73fe] fd 77 49
   call    $7519                           ;[7401] cd 19 75
   ld      (iy+$4a),a                      ;[7404] fd 77 4a
   inc     (ix-$03)                        ;[7407] dd 34 fd
   ld      a,(ix-$03)                      ;[740a] dd 7e fd
   cp      $fe                             ;[740d] fe fe
   call    z,$7519                         ;[740f] cc 19 75
   ld      a,(iy+$49)                      ;[7412] fd 7e 49
   or      a                               ;[7415] b7
   jr      nz,$7446                        ;[7416] 20 2e
   ld      a,(iy+$4a)                      ;[7418] fd 7e 4a
   or      a                               ;[741b] b7
   jr      nz,$7446                        ;[741c] 20 28
   ld      a,(ix-$0e)                      ;[741e] dd 7e f2
   cp      $01                             ;[7421] fe 01
   ld      a,$12                           ;[7423] 3e 12
   jp      nz,$6206                        ;[7425] c2 06 62
   ld      (ix+$04),a                      ;[7428] dd 77 04
   ld      a,(ix-$03)                      ;[742b] dd 7e fd
   cp      $02                             ;[742e] fe 02
   jr      c,$7470                         ;[7430] 38 3e
   ld      a,(ix-$03)                      ;[7432] dd 7e fd
   dec     a                               ;[7435] 3d
   dec     a                               ;[7436] 3d
   ld      e,a                             ;[7437] 5f
   call    $74e4                           ;[7438] cd e4 74
   ld      a,(ix-$02)                      ;[743b] dd 7e fe
   ld      (hl),a                          ;[743e] 77
   ld      a,(ix-$01)                      ;[743f] dd 7e ff
   inc     hl                              ;[7442] 23
   ld      (hl),a                          ;[7443] 77
   jr      $7463                           ;[7444] 18 1d
   ld      c,(ix-$02)                      ;[7446] dd 4e fe
   ld      b,(ix-$01)                      ;[7449] dd 46 ff
   ld      l,(iy+$49)                      ;[744c] fd 6e 49
   ld      h,(iy+$4a)                      ;[744f] fd 66 4a
   scf                                     ;[7452] 37
   ccf                                     ;[7453] 3f
   sbc     hl,bc                           ;[7454] ed 42
   jr      z,$7463                         ;[7456] 28 0b
   ld      l,(ix+$00)                      ;[7458] dd 6e 00
   ld      h,(ix+$01)                      ;[745b] dd 66 01
   call    $7560                           ;[745e] cd 60 75
   jr      $73ee                           ;[7461] 18 8b
   ld      l,(ix+$02)                      ;[7463] dd 6e 02
   ld      h,(ix+$03)                      ;[7466] dd 66 03
   dec     hl                              ;[7469] 2b
   call    $7560                           ;[746a] cd 60 75
   pop     hl                              ;[746d] e1
   pop     de                              ;[746e] d1
   ret                                     ;[746f] c9
   ld      a,(iy+$4b)                      ;[7470] fd 7e 4b
   ld      (iy+$12),a                      ;[7473] fd 77 12
   ld      a,(iy+$4c)                      ;[7476] fd 7e 4c
   ld      (iy+$11),a                      ;[7479] fd 77 11
   call    $7bbc                           ;[747c] cd bc 7b
   push    bc                              ;[747f] c5
   ld      bc,$0002                        ;[7480] 01 02 00
   call    $7887                           ;[7483] cd 87 78
   pop     bc                              ;[7486] c1
   in      a,($12)                         ;[7487] db 12
   rrca                                    ;[7489] 0f
   ld      a,$04                           ;[748a] 3e 04
   jp      c,$6206                         ;[748c] da 06 62
   ld      b,$01                           ;[748f] 06 01
   call    $790a                           ;[7491] cd 0a 79
   or      a                               ;[7494] b7
   jp      nz,$6206                        ;[7495] c2 06 62
   ld      b,(ix-$02)                      ;[7498] dd 46 fe
   ld      de,$00fc                        ;[749b] 11 fc 00
   call    $74e6                           ;[749e] cd e6 74
   ld      a,(ix-$03)                      ;[74a1] dd 7e fd
   cp      $01                             ;[74a4] fe 01
   jr      z,$74ac                         ;[74a6] 28 04
   ld      (hl),b                          ;[74a8] 70
   ld      b,(ix-$01)                      ;[74a9] dd 46 ff
   inc     hl                              ;[74ac] 23
   ld      (hl),b                          ;[74ad] 70
   ld      b,$00                           ;[74ae] 06 00
   call    $790a                           ;[74b0] cd 0a 79
   call    $7519                           ;[74b3] cd 19 75
   ld      a,c                             ;[74b6] 79
   cp      $00                             ;[74b7] fe 00
   jp      z,$7444                         ;[74b9] ca 44 74
   ld      de,$0000                        ;[74bc] 11 00 00
   call    $74e6                           ;[74bf] cd e6 74
   ld      b,(ix-$01)                      ;[74c2] dd 46 ff
   ld      (hl),b                          ;[74c5] 70
   inc     (ix-$03)                        ;[74c6] dd 34 fd
   jp      $7444                           ;[74c9] c3 44 74
   dec     a                               ;[74cc] 3d
   ld      e,a                             ;[74cd] 5f
   call    $74e4                           ;[74ce] cd e4 74
   ld      a,(hl)                          ;[74d1] 7e
   ld      (iy+$49),a                      ;[74d2] fd 77 49
   inc     hl                              ;[74d5] 23
   ld      a,(hl)                          ;[74d6] 7e
   ld      (iy+$4a),a                      ;[74d7] fd 77 4a
   inc     (ix-$03)                        ;[74da] dd 34 fd
   inc     (ix-$03)                        ;[74dd] dd 34 fd
   ret                                     ;[74e0] c9
   ld      e,(ix-$03)                      ;[74e1] dd 5e fd
   ld      d,$00                           ;[74e4] 16 00
   ld      hl,$fc56                        ;[74e6] 21 56 fc
   add     hl,de                           ;[74e9] 19
   ret                                     ;[74ea] c9
   call    $74cc                           ;[74eb] cd cc 74
   jp      $740a                           ;[74ee] c3 0a 74
   ld      a,h                             ;[74f1] 7c
   cp      $00                             ;[74f2] fe 00
   jr      nz,$7500                        ;[74f4] 20 0a
   ld      a,l                             ;[74f6] 7d
   cp      $00                             ;[74f7] fe 00
   jr      nz,$7500                        ;[74f9] 20 05
   ld      a,$14                           ;[74fb] 3e 14
   jp      $6206                           ;[74fd] c3 06 62
   ret                                     ;[7500] c9
   ld      a,$01                           ;[7501] 3e 01
   ld      (iy+$50),a                      ;[7503] fd 77 50
   call    $733d                           ;[7506] cd 3d 73
   ret                                     ;[7509] c9
   ld      a,$00                           ;[750a] 3e 00
   ld      (iy+$50),a                      ;[750c] fd 77 50
   call    $733d                           ;[750f] cd 3d 73
   ret                                     ;[7512] c9
   ld      a,(hl)                          ;[7513] 7e
   or      a                               ;[7514] b7
   jr      z,$755a                         ;[7515] 28 43
   jr      $7538                           ;[7517] 18 1f
   push    hl                              ;[7519] e5
   ld      b,(iy+$12)                      ;[751a] fd 46 12
   ld      (iy+$4b),b                      ;[751d] fd 70 4b
   ld      b,(iy+$11)                      ;[7520] fd 46 11
   ld      (iy+$4c),b                      ;[7523] fd 70 4c
   ld      b,$01                           ;[7526] 06 01
   call    $790a                           ;[7528] cd 0a 79
   ld      de,$00fe                        ;[752b] 11 fe 00
   call    $74e6                           ;[752e] cd e6 74
   ld      a,(hl)                          ;[7531] 7e
   or      a                               ;[7532] b7
   inc     hl                              ;[7533] 23
   ld      c,a                             ;[7534] 4f
   jr      z,$755a                         ;[7535] 28 23
   ld      a,(hl)                          ;[7537] 7e
   ld      (iy+$12),c                      ;[7538] fd 71 12
   ld      (iy+$11),a                      ;[753b] fd 77 11
   ld      (ix-$05),c                      ;[753e] dd 71 fb
   ld      (ix-$04),a                      ;[7541] dd 77 fc
   ld      b,$01                           ;[7544] 06 01
   call    $790a                           ;[7546] cd 0a 79
   or      a                               ;[7549] b7
   jp      nz,$6206                        ;[754a] c2 06 62
   xor     a                               ;[754d] af
   ld      c,(ix-$03)                      ;[754e] dd 4e fd
   ld      (ix-$03),a                      ;[7551] dd 77 fd
   ld      hl,$fc56                        ;[7554] 21 56 fc
   ld      a,(hl)                          ;[7557] 7e
   pop     hl                              ;[7558] e1
   ret                                     ;[7559] c9
   call    $7096                           ;[755a] cd 96 70
   jp      $754d                           ;[755d] c3 4d 75
   ld      d,$00                           ;[7560] 16 00
   ld      e,(ix-$03)                      ;[7562] dd 5e fd
   add     hl,de                           ;[7565] 19
   ld      bc,$00fe                        ;[7566] 01 fe 00
   scf                                     ;[7569] 37
   ccf                                     ;[756a] 3f
   push    hl                              ;[756b] e5
   sbc     hl,bc                           ;[756c] ed 42
   jr      nc,$7575                        ;[756e] 30 05
   pop     hl                              ;[7570] e1
   ld      (ix-$03),l                      ;[7571] dd 75 fd
   ret                                     ;[7574] c9
   call    $7519                           ;[7575] cd 19 75
   pop     af                              ;[7578] f1
   jr      $7566                           ;[7579] 18 eb
   call    $6e11                           ;[757b] cd 11 6e
   call    $775c                           ;[757e] cd 5c 77
   or      a                               ;[7581] b7
   jp      nz,$6206                        ;[7582] c2 06 62
   rst     $08                             ;[7585] cf
   inc     l                               ;[7586] 2c
   push    hl                              ;[7587] e5
   push    hl                              ;[7588] e5
   call    $6e23                           ;[7589] cd 23 6e
   pop     hl                              ;[758c] e1
   call    $709d                           ;[758d] cd 9d 70
   cp      $08                             ;[7590] fe 08
   ld      a,$05                           ;[7592] 3e 05
   jp      nz,$6206                        ;[7594] c2 06 62
   call    $773d                           ;[7597] cd 3d 77
   inc     de                              ;[759a] 13
   ld      a,(de)                          ;[759b] 1a
   or      a                               ;[759c] b7
   ld      a,$0f                           ;[759d] 3e 0f
   jp      nz,$6206                        ;[759f] c2 06 62
   dec     de                              ;[75a2] 1b
   ld      a,(de)                          ;[75a3] 1a
   cp      $02                             ;[75a4] fe 02
   jr      z,$75c5                         ;[75a6] 28 1d
   call    $7056                           ;[75a8] cd 56 70
   ld      a,$02                           ;[75ab] 3e 02
   ld      (de),a                          ;[75ad] 12
   ex      de,hl                           ;[75ae] eb
   ld      de,$000a                        ;[75af] 11 0a 00
   add     hl,de                           ;[75b2] 19
   ld      a,(hl)                          ;[75b3] 7e
   inc     hl                              ;[75b4] 23
   ld      (iy+$12),a                      ;[75b5] fd 77 12
   ld      a,(hl)                          ;[75b8] 7e
   ld      (iy+$11),a                      ;[75b9] fd 77 11
   ld      b,$01                           ;[75bc] 06 01
   call    $790a                           ;[75be] cd 0a 79
   or      a                               ;[75c1] b7
   jp      nz,$6206                        ;[75c2] c2 06 62
   ld      l,(ix+$0f)                      ;[75c5] dd 6e 0f
   ld      h,(ix+$10)                      ;[75c8] dd 66 10
   ld      e,(ix+$11)                      ;[75cb] dd 5e 11
   ld      d,(ix+$12)                      ;[75ce] dd 56 12
   scf                                     ;[75d1] 37
   sbc     hl,de                           ;[75d2] ed 52
   inc     hl                              ;[75d4] 23
   ld      a,h                             ;[75d5] 7c
   cp      $00                             ;[75d6] fe 00
   jr      nz,$75e7                        ;[75d8] 20 0d
   ld      a,l                             ;[75da] 7d
   cp      $fd                             ;[75db] fe fd
   jr      nc,$75e7                        ;[75dd] 30 08
   ld      b,l                             ;[75df] 45
   inc     b                               ;[75e0] 04
   ld      hl,$8289                        ;[75e1] 21 89 82
   jp      $6e99                           ;[75e4] c3 99 6e
   ld      b,$fd                           ;[75e7] 06 fd
   jr      $75e1                           ;[75e9] 18 f6
   call    $6e11                           ;[75eb] cd 11 6e
   call    $775c                           ;[75ee] cd 5c 77
   or      a                               ;[75f1] b7
   jp      nz,$6206                        ;[75f2] c2 06 62
   push    hl                              ;[75f5] e5
   call    $709d                           ;[75f6] cd 9d 70
   cp      $08                             ;[75f9] fe 08
   ld      a,$05                           ;[75fb] 3e 05
   jp      nz,$6206                        ;[75fd] c2 06 62
   call    $773d                           ;[7600] cd 3d 77
   inc     de                              ;[7603] 13
   ld      a,(de)                          ;[7604] 1a
   cp      $01                             ;[7605] fe 01
   ld      a,$10                           ;[7607] 3e 10
   jp      nz,$6206                        ;[7609] c2 06 62
   dec     de                              ;[760c] 1b
   pop     hl                              ;[760d] e1
   rst     $08                             ;[760e] cf
   inc     l                               ;[760f] 2c
   dec     hl                              ;[7610] 2b
   call    $606f                           ;[7611] cd 6f 60
   call    z,$7647                         ;[7614] cc 47 76
   ret     z                               ;[7617] c8
   push    hl                              ;[7618] e5
   cp      $2c                             ;[7619] fe 2c
   jp      z,$764e                         ;[761b] ca 4e 76
   cp      $3b                             ;[761e] fe 3b
   jr      z,$7651                         ;[7620] 28 2f
   pop     bc                              ;[7622] c1
   call    $6e17                           ;[7623] cd 17 6e
   push    hl                              ;[7626] e5
   ld      ix,$320f                        ;[7627] dd 21 0f 32
   rst     $18                             ;[762b] df
   jr      z,$7641                         ;[762c] 28 13
   ld      ix,$44b5                        ;[762e] dd 21 b5 44
   rst     $18                             ;[7632] df
   ld      ix,$627d                        ;[7633] dd 21 7d 62
   rst     $18                             ;[7637] df
   call    $7655                           ;[7638] cd 55 76
   ld      a,$20                           ;[763b] 3e 20
   call    $7669                           ;[763d] cd 69 76
   or      a                               ;[7640] b7
   call    z,$7655                         ;[7641] cc 55 76
   pop     hl                              ;[7644] e1
   jr      $7610                           ;[7645] 18 c9
   ld      a,$0d                           ;[7647] 3e 0d
   call    $7669                           ;[7649] cd 69 76
   xor     a                               ;[764c] af
   ret                                     ;[764d] c9
   call    $7669                           ;[764e] cd 69 76
   pop     hl                              ;[7651] e1
   rst     $10                             ;[7652] d7
   jr      $7617                           ;[7653] 18 c2
   ld      ix,$644b                        ;[7655] dd 21 4b 64
   rst     $18                             ;[7659] df
   ld      ix,$3ca8                        ;[765a] dd 21 a8 3c
   rst     $18                             ;[765e] df
   inc     d                               ;[765f] 14
   dec     d                               ;[7660] 15
   ret     z                               ;[7661] c8
   ld      a,(bc)                          ;[7662] 0a
   call    $7669                           ;[7663] cd 69 76
   inc     bc                              ;[7666] 03
   jr      $7660                           ;[7667] 18 f7
   push    hl                              ;[7669] e5
   push    de                              ;[766a] d5
   push    bc                              ;[766b] c5
   push    af                              ;[766c] f5
   call    $709d                           ;[766d] cd 9d 70
   ex      de,hl                           ;[7670] eb
   inc     hl                              ;[7671] 23
   ld      a,(hl)                          ;[7672] 7e
   or      a                               ;[7673] b7
   ld      a,$10                           ;[7674] 3e 10
   jp      z,$6206                         ;[7676] ca 06 62
   dec     hl                              ;[7679] 2b
   ld      a,(hl)                          ;[767a] 7e
   cp      $02                             ;[767b] fe 02
   jr      z,$76b4                         ;[767d] 28 35
   call    $7056                           ;[767f] cd 56 70
   ld      de,$000a                        ;[7682] 11 0a 00
   add     hl,de                           ;[7685] 19
   ld      a,(hl)                          ;[7686] 7e
   inc     hl                              ;[7687] 23
   ld      (iy+$12),a                      ;[7688] fd 77 12
   ld      a,(hl)                          ;[768b] 7e
   inc     hl                              ;[768c] 23
   ld      (iy+$11),a                      ;[768d] fd 77 11
   call    $7bbc                           ;[7690] cd bc 7b
   push    bc                              ;[7693] c5
   ld      bc,$0002                        ;[7694] 01 02 00
   call    $7887                           ;[7697] cd 87 78
   pop     bc                              ;[769a] c1
   in      a,($12)                         ;[769b] db 12
   rrca                                    ;[769d] 0f
   ld      a,$04                           ;[769e] 3e 04
   jp      c,$6206                         ;[76a0] da 06 62
   push    hl                              ;[76a3] e5
   ld      b,$01                           ;[76a4] 06 01
   call    $790a                           ;[76a6] cd 0a 79
   or      a                               ;[76a9] b7
   jp      nz,$6206                        ;[76aa] c2 06 62
   pop     hl                              ;[76ad] e1
   ld      de,$fff4                        ;[76ae] 11 f4 ff
   add     hl,de                           ;[76b1] 19
   ld      (hl),$02                        ;[76b2] 36 02
   push    hl                              ;[76b4] e5
   pop     ix                              ;[76b5] dd e1
   ld      a,(ix+$0f)                      ;[76b7] dd 7e 0f
   sub     (ix+$11)                        ;[76ba] dd 96 11
   cp      $00                             ;[76bd] fe 00
   jr      nz,$76d9                        ;[76bf] 20 18
   ld      a,(ix+$10)                      ;[76c1] dd 7e 10
   sbc     (ix+$12)                        ;[76c4] dd 9e 12
   cp      $00                             ;[76c7] fe 00
   jr      nz,$76d9                        ;[76c9] 20 0e
   ld      e,(ix+$0c)                      ;[76cb] dd 5e 0c
   call    $74e4                           ;[76ce] cd e4 74
   xor     a                               ;[76d1] af
   ld      (hl),a                          ;[76d2] 77
   ld      (iy+$50),a                      ;[76d3] fd 77 50
   jp      $7738                           ;[76d6] c3 38 77
   pop     af                              ;[76d9] f1
   push    af                              ;[76da] f5
   ld      e,(ix+$0c)                      ;[76db] dd 5e 0c
   inc     (ix+$0c)                        ;[76de] dd 34 0c
   call    $74e4                           ;[76e1] cd e4 74
   ld      (hl),a                          ;[76e4] 77
   dec     hl                              ;[76e5] 2b
   ld      a,(hl)                          ;[76e6] 7e
   cp      $0d                             ;[76e7] fe 0d
   jr      nz,$76ed                        ;[76e9] 20 02
   ld      (hl),$2c                        ;[76eb] 36 2c
   inc     hl                              ;[76ed] 23
   inc     (ix+$11)                        ;[76ee] dd 34 11
   jr      nz,$7702                        ;[76f1] 20 0f
   inc     (ix+$12)                        ;[76f3] dd 34 12
   jp      p,$7702                         ;[76f6] f2 02 77
   dec     (ix+$11)                        ;[76f9] dd 35 11
   dec     (ix+$12)                        ;[76fc] dd 35 12
   xor     a                               ;[76ff] af
   jr      $7735                           ;[7700] 18 33
   ld      a,(ix+$0c)                      ;[7702] dd 7e 0c
   cp      $fe                             ;[7705] fe fe
   jr      nz,$7733                        ;[7707] 20 2a
   ld      de,$00fe                        ;[7709] 11 fe 00
   call    $74e6                           ;[770c] cd e6 74
   ld      a,(hl)                          ;[770f] 7e
   or      a                               ;[7710] b7
   jr      nz,$7722                        ;[7711] 20 0f
   ld      b,$00                           ;[7713] 06 00
   call    $790a                           ;[7715] cd 0a 79
   ld      de,$000f                        ;[7718] 11 0f 00
   add     ix,de                           ;[771b] dd 19
   call    $7519                           ;[771d] cd 19 75
   jr      $7733                           ;[7720] 18 11
   ld      b,$00                           ;[7722] 06 00
   call    $790a                           ;[7724] cd 0a 79
   or      a                               ;[7727] b7
   jp      nz,$6206                        ;[7728] c2 06 62
   ld      de,$000f                        ;[772b] 11 0f 00
   add     ix,de                           ;[772e] dd 19
   call    $7519                           ;[7730] cd 19 75
   ld      a,$01                           ;[7733] 3e 01
   ld      (iy+$50),a                      ;[7735] fd 77 50
   pop     af                              ;[7738] f1
   pop     bc                              ;[7739] c1
   pop     de                              ;[773a] d1
   pop     hl                              ;[773b] e1
   ret                                     ;[773c] c9
   push    de                              ;[773d] d5
   pop     ix                              ;[773e] dd e1
   ld      a,(ix+$14)                      ;[7740] dd 7e 14
   cp      $52                             ;[7743] fe 52
   ld      a,$0c                           ;[7745] 3e 0c
   jp      nz,$6206                        ;[7747] c2 06 62
   ret                                     ;[774a] c9
   call    $775c                           ;[774b] cd 5c 77
   or      a                               ;[774e] b7
   jp      nz,$6206                        ;[774f] c2 06 62
   ld      a,(hl)                          ;[7752] 7e
   or      a                               ;[7753] b7
   ret     z                               ;[7754] c8
   cp      $3a                             ;[7755] fe 3a
   jp      nz,$6267                        ;[7757] c2 67 62
   xor     a                               ;[775a] af
   ret                                     ;[775b] c9
   push    iy                              ;[775c] fd e5
   ld      b,$08                           ;[775e] 06 08
   ld      (iy+$20),$01                    ;[7760] fd 36 01 20
   inc     iy                              ;[7764] fd 23
   djnz    $7760                           ;[7766] 10 f8
   pop     iy                              ;[7768] fd e1
   ld      a,(hl)                          ;[776a] 7e
   inc     hl                              ;[776b] 23
   cp      $20                             ;[776c] fe 20
   jr      z,$776a                         ;[776e] 28 fa
   dec     hl                              ;[7770] 2b
   rst     $08                             ;[7771] cf
   ld      ($0806),hl                      ;[7772] 22 06 08
   ld      a,(hl)                          ;[7775] 7e
   cp      $22                             ;[7776] fe 22
   jr      nz,$777d                        ;[7778] 20 03
   ld      a,$01                           ;[777a] 3e 01
   ret                                     ;[777c] c9
   push    iy                              ;[777d] fd e5
   ld      a,(hl)                          ;[777f] 7e
   inc     hl                              ;[7780] 23
   cp      $22                             ;[7781] fe 22
   jr      z,$7799                         ;[7783] 28 14
   ld      (iy+$01),a                      ;[7785] fd 77 01
   inc     iy                              ;[7788] fd 23
   djnz    $777f                           ;[778a] 10 f3
   pop     iy                              ;[778c] fd e1
   ld      a,(hl)                          ;[778e] 7e
   inc     hl                              ;[778f] 23
   or      a                               ;[7790] b7
   jr      z,$777a                         ;[7791] 28 e7
   cp      $22                             ;[7793] fe 22
   jr      z,$779b                         ;[7795] 28 04
   jr      $778e                           ;[7797] 18 f5
   pop     iy                              ;[7799] fd e1
   xor     a                               ;[779b] af
   ret                                     ;[779c] c9
   exx                                     ;[779d] d9
   ld      hl,$1f40                        ;[779e] 21 40 1f
   exx                                     ;[77a1] d9
   ld      a,(iy+$12)                      ;[77a2] fd 7e 12
   sub     (iy+$7f)                        ;[77a5] fd 96 7f
   jr      z,$77c9                         ;[77a8] 28 1f
   jp      p,$77bd                         ;[77aa] f2 bd 77
   neg                                     ;[77ad] ed 44
   ld      b,a                             ;[77af] 47
   call    $78ca                           ;[77b0] cd ca 78
   push    bc                              ;[77b3] c5
   ld      bc,$001e                        ;[77b4] 01 1e 00
   call    $7887                           ;[77b7] cd 87 78
   pop     bc                              ;[77ba] c1
   jr      $77c9                           ;[77bb] 18 0c
   ld      b,a                             ;[77bd] 47
   call    $7897                           ;[77be] cd 97 78
   push    bc                              ;[77c1] c5
   ld      bc,$000f                        ;[77c2] 01 0f 00
   call    $7887                           ;[77c5] cd 87 78
   pop     bc                              ;[77c8] c1
   ld      a,$10                           ;[77c9] 3e 10
   ld       ($fe59),a                      ;[77cb] 32 59 fe
   ld      h,(iy+$12)                      ;[77ce] fd 66 12
   ld      l,(iy+$7e)                      ;[77d1] fd 6e 7e
   ld      d,(iy+$7d)                      ;[77d4] fd 56 7d
   call    $784a                           ;[77d7] cd 4a 78
   cp      $d5                             ;[77da] fe d5
   jp      nz,$783a                        ;[77dc] c2 3a 78
   call    $784a                           ;[77df] cd 4a 78
   cp      $aa                             ;[77e2] fe aa
   jp      nz,$783a                        ;[77e4] c2 3a 78
   call    $784a                           ;[77e7] cd 4a 78
   cp      $96                             ;[77ea] fe 96
   jp      nz,$783a                        ;[77ec] c2 3a 78
   call    $7852                           ;[77ef] cd 52 78
   cp      d                               ;[77f2] ba
   jr      nz,$7827                        ;[77f3] 20 32
   ld      b,a                             ;[77f5] 47
   call    $7852                           ;[77f6] cd 52 78
   cp      h                               ;[77f9] bc
   jr      nz,$782f                        ;[77fa] 20 33
   xor     b                               ;[77fc] a8
   ld      b,a                             ;[77fd] 47
   call    $7852                           ;[77fe] cd 52 78
   cp      l                               ;[7801] bd
   jp      nz,$781d                        ;[7802] c2 1d 78
   xor     b                               ;[7805] a8
   ld      b,a                             ;[7806] 47
   call    $7852                           ;[7807] cd 52 78
   xor     b                               ;[780a] a8
   jr      nz,$7827                        ;[780b] 20 1a
   call    $784a                           ;[780d] cd 4a 78
   cp      $de                             ;[7810] fe de
   jr      nz,$7827                        ;[7812] 20 13
   call    $784a                           ;[7814] cd 4a 78
   cp      $aa                             ;[7817] fe aa
   jr      nz,$7827                        ;[7819] 20 0c
   or      a                               ;[781b] b7
   ret                                     ;[781c] c9
   ld      a,($fe59)                       ;[781d] 3a 59 fe
   dec     a                               ;[7820] 3d
   ld       ($fe59),a                      ;[7821] 32 59 fe
   jp      nz,$77ce                        ;[7824] c2 ce 77
   dec     (iy+$13)                        ;[7827] fd 35 13
   jp      nz,$77c9                        ;[782a] c2 c9 77
   scf                                     ;[782d] 37
   ret                                     ;[782e] c9
   ld      (iy+$7f),a                      ;[782f] fd 77 7f
   dec     (iy+$13)                        ;[7832] fd 35 13
   jp      nz,$779d                        ;[7835] c2 9d 77
   scf                                     ;[7838] 37
   ret                                     ;[7839] c9
   exx                                     ;[783a] d9
   dec     hl                              ;[783b] 2b
   ld      a,h                             ;[783c] 7c
   or      l                               ;[783d] b5
   exx                                     ;[783e] d9
   jp      nz,$77d7                        ;[783f] c2 d7 77
   ld      a,$28                           ;[7842] 3e 28
   ld      (iy+$7f),a                      ;[7844] fd 77 7f
   jp      $782f                           ;[7847] c3 2f 78
   in      a,($12)                         ;[784a] db 12
   rlca                                    ;[784c] 07
   jr      nc,$784a                        ;[784d] 30 fb
   in      a,($13)                         ;[784f] db 13
   ret                                     ;[7851] c9
   in      a,($12)                         ;[7852] db 12
   rlca                                    ;[7854] 07
   jr      nc,$7852                        ;[7855] 30 fb
   in      a,($13)                         ;[7857] db 13
   rla                                     ;[7859] 17
   ld      e,a                             ;[785a] 5f
   in      a,($12)                         ;[785b] db 12
   rlca                                    ;[785d] 07
   jr      nc,$785b                        ;[785e] 30 fb
   in      a,($13)                         ;[7860] db 13
   and     e                               ;[7862] a3
   ret                                     ;[7863] c9
   in      a,($12)                         ;[7864] db 12
   rlca                                    ;[7866] 07
   jr      nc,$7864                        ;[7867] 30 fb
   ld      a,d                             ;[7869] 7a
   out     ($13),a                         ;[786a] d3 13
   ret                                     ;[786c] c9
   ld      a,d                             ;[786d] 7a
   rra                                     ;[786e] 1f
   or      $aa                             ;[786f] f6 aa
   ld      e,a                             ;[7871] 5f
   in      a,($12)                         ;[7872] db 12
   rlca                                    ;[7874] 07
   jr      nc,$7872                        ;[7875] 30 fb
   ld      a,e                             ;[7877] 7b
   out     ($13),a                         ;[7878] d3 13
   ld      a,d                             ;[787a] 7a
   or      $aa                             ;[787b] f6 aa
   ld      e,a                             ;[787d] 5f
   in      a,($12)                         ;[787e] db 12
   rlca                                    ;[7880] 07
   jr      nc,$787e                        ;[7881] 30 fb
   ld      a,e                             ;[7883] 7b
   out     ($13),a                         ;[7884] d3 13
   ret                                     ;[7886] c9
   push    bc                              ;[7887] c5
   ld      bc,$0089                        ;[7888] 01 89 00
   dec     bc                              ;[788b] 0b
   ld      a,b                             ;[788c] 78
   or      c                               ;[788d] b1
   jr      nz,$788b                        ;[788e] 20 fb
   pop     bc                              ;[7890] c1
   dec     bc                              ;[7891] 0b
   ld      a,b                             ;[7892] 78
   or      c                               ;[7893] b1
   jr      nz,$7887                        ;[7894] 20 f1
   ret                                     ;[7896] c9
   ld      a,(iy+$7f)                      ;[7897] fd 7e 7f
   add     b                               ;[789a] 80
   cp      $28                             ;[789b] fe 28
   jr      c,$78a1                         ;[789d] 38 02
   ld      a,$27                           ;[789f] 3e 27
   ld      (iy+$7f),a                      ;[78a1] fd 77 7f
   sla     b                               ;[78a4] cb 20
   ld      a,(iy+$14)                      ;[78a6] fd 7e 14
   ld      c,a                             ;[78a9] 4f
   rlca                                    ;[78aa] 07
   push    af                              ;[78ab] f5
   ld      (iy+$14),a                      ;[78ac] fd 77 14
   or      c                               ;[78af] b1
   call    $78fb                           ;[78b0] cd fb 78
   push    bc                              ;[78b3] c5
   ld      bc,$0001                        ;[78b4] 01 01 00
   call    $7887                           ;[78b7] cd 87 78
   pop     bc                              ;[78ba] c1
   pop     af                              ;[78bb] f1
   call    $78fb                           ;[78bc] cd fb 78
   push    bc                              ;[78bf] c5
   ld      bc,$0007                        ;[78c0] 01 07 00
   call    $7887                           ;[78c3] cd 87 78
   pop     bc                              ;[78c6] c1
   djnz    $78a6                           ;[78c7] 10 dd
   ret                                     ;[78c9] c9
   ld      a,(iy+$7f)                      ;[78ca] fd 7e 7f
   sub     b                               ;[78cd] 90
   jp      p,$78d2                         ;[78ce] f2 d2 78
   xor     a                               ;[78d1] af
   ld      (iy+$7f),a                      ;[78d2] fd 77 7f
   sla     b                               ;[78d5] cb 20
   ld      a,(iy+$14)                      ;[78d7] fd 7e 14
   ld      c,a                             ;[78da] 4f
   rrca                                    ;[78db] 0f
   push    af                              ;[78dc] f5
   ld      (iy+$14),a                      ;[78dd] fd 77 14
   or      c                               ;[78e0] b1
   call    $78fb                           ;[78e1] cd fb 78
   push    bc                              ;[78e4] c5
   ld      bc,$0001                        ;[78e5] 01 01 00
   call    $7887                           ;[78e8] cd 87 78
   pop     bc                              ;[78eb] c1
   pop     af                              ;[78ec] f1
   call    $78fb                           ;[78ed] cd fb 78
   push    bc                              ;[78f0] c5
   ld      bc,$0007                        ;[78f1] 01 07 00
   call    $7887                           ;[78f4] cd 87 78
   pop     bc                              ;[78f7] c1
   djnz    $78d7                           ;[78f8] 10 dd
   ret                                     ;[78fa] c9
   and     $0f                             ;[78fb] e6 0f
   ld      c,a                             ;[78fd] 4f
   ld      a,$f0                           ;[78fe] 3e f0
   and     (iy+$43)                        ;[7900] fd a6 43
   or      c                               ;[7903] b1
   ld      (iy+$43),a                      ;[7904] fd 77 43
   out     ($10),a                         ;[7907] d3 10
   ret                                     ;[7909] c9
   ld      a,(iy+$0b)                      ;[790a] fd 7e 0b
   cp      $40                             ;[790d] fe 40
   ld      a,(iy+$43)                      ;[790f] fd 7e 43
   jr      nz,$7918                        ;[7912] 20 04
   res     5,a                             ;[7914] cb af
   jr      $791a                           ;[7916] 18 02
   set     5,a                             ;[7918] cb ef
   ld      (iy+$43),a                      ;[791a] fd 77 43
   ld      e,(iy+$11)                      ;[791d] fd 5e 11
   ld      d,$00                           ;[7920] 16 00
   ld      hl,$7c35                        ;[7922] 21 35 7c
   add     hl,de                           ;[7925] 19
   ld      a,(hl)                          ;[7926] 7e
   ld      (iy+$7e),a                      ;[7927] fd 77 7e
   call    $7bbc                           ;[792a] cd bc 7b
   ld      a,b                             ;[792d] 78
   or      a                               ;[792e] b7
   jp      nz,$79d6                        ;[792f] c2 d6 79
   call    $7a6b                           ;[7932] cd 6b 7a
   in      a,($12)                         ;[7935] db 12
   rrca                                    ;[7937] 0f
   ld      a,$04                           ;[7938] 3e 04
   ret     c                               ;[793a] d8
   ld      (iy+$0a),$13                    ;[793b] fd 36 13 0a
   call    $779d                           ;[793f] cd 9d 77
   ld      a,$09                           ;[7942] 3e 09
   ret     c                               ;[7944] d8
   ld      b,$03                           ;[7945] 06 03
   djnz    $7947                           ;[7947] 10 fe
   ld      hl,$fc00                        ;[7949] 21 00 fc
   ld      c,$00                           ;[794c] 0e 00
   ld      b,$04                           ;[794e] 06 04
   ld      d,$ff                           ;[7950] 16 ff
   ld      a,(iy+$43)                      ;[7952] fd 7e 43
   and     $bf                             ;[7955] e6 bf
   ld      (iy+$43),a                      ;[7957] fd 77 43
   out     ($10),a                         ;[795a] d3 10
   ld      a,d                             ;[795c] 7a
   out     ($13),a                         ;[795d] d3 13
   call    $7864                           ;[795f] cd 64 78
   djnz    $795f                           ;[7962] 10 fb
   ld      d,$d5                           ;[7964] 16 d5
   call    $7864                           ;[7966] cd 64 78
   out     ($11),a                         ;[7969] d3 11
   ld      d,$aa                           ;[796b] 16 aa
   call    $7864                           ;[796d] cd 64 78
   ld      d,$ad                           ;[7970] 16 ad
   call    $7864                           ;[7972] cd 64 78
   ld      de,$fb00                        ;[7975] 11 00 fb
   in      a,($12)                         ;[7978] db 12
   or      a                               ;[797a] b7
   jp      p,$7978                         ;[797b] f2 78 79
   ld      e,(hl)                          ;[797e] 5e
   ld      a,(de)                          ;[797f] 1a
   out     ($13),a                         ;[7980] d3 13
   ld      b,$00                           ;[7982] 06 00
   in      a,($12)                         ;[7984] db 12
   or      a                               ;[7986] b7
   jp      p,$7984                         ;[7987] f2 84 79
   ld      a,(hl)                          ;[798a] 7e
   inc     hl                              ;[798b] 23
   xor     (hl)                            ;[798c] ae
   ld      e,a                             ;[798d] 5f
   ld      a,(de)                          ;[798e] 1a
   out     ($13),a                         ;[798f] d3 13
   djnz    $7984                           ;[7991] 10 f1
   ld      b,$55                           ;[7993] 06 55
   in      a,($12)                         ;[7995] db 12
   or      a                               ;[7997] b7
   jp      p,$7995                         ;[7998] f2 95 79
   ld      a,(hl)                          ;[799b] 7e
   inc     hl                              ;[799c] 23
   xor     (hl)                            ;[799d] ae
   ld      e,a                             ;[799e] 5f
   ld      a,(de)                          ;[799f] 1a
   out     ($13),a                         ;[79a0] d3 13
   djnz    $7995                           ;[79a2] 10 f1
   in      a,($12)                         ;[79a4] db 12
   or      a                               ;[79a6] b7
   jp      p,$79a4                         ;[79a7] f2 a4 79
   ld      e,(hl)                          ;[79aa] 5e
   ld      a,(de)                          ;[79ab] 1a
   out     ($13),a                         ;[79ac] d3 13
   ld      d,$de                           ;[79ae] 16 de
   call    $7864                           ;[79b0] cd 64 78
   ld      d,$aa                           ;[79b3] 16 aa
   call    $7864                           ;[79b5] cd 64 78
   ld      d,$eb                           ;[79b8] 16 eb
   call    $7864                           ;[79ba] cd 64 78
   in      a,($12)                         ;[79bd] db 12
   or      a                               ;[79bf] b7
   ld      a,$ff                           ;[79c0] 3e ff
   out     ($13),a                         ;[79c2] d3 13
   in      a,($12)                         ;[79c4] db 12
   or      a                               ;[79c6] b7
   jp      p,$79c4                         ;[79c7] f2 c4 79
   ld      a,(iy+$43)                      ;[79ca] fd 7e 43
   or      $40                             ;[79cd] f6 40
   ld      (iy+$43),a                      ;[79cf] fd 77 43
   out     ($10),a                         ;[79d2] d3 10
   jr      $79e8                           ;[79d4] 18 12
   ld      (iy+$0a),$13                    ;[79d6] fd 36 13 0a
   call    $779d                           ;[79da] cd 9d 77
   ld      a,$09                           ;[79dd] 3e 09
   ret     c                               ;[79df] d8
   call    $79f5                           ;[79e0] cd f5 79
   jr      c,$79ed                         ;[79e3] 38 08
   call    $7a4d                           ;[79e5] cd 4d 7a
   call    $7bd5                           ;[79e8] cd d5 7b
   xor     a                               ;[79eb] af
   ret                                     ;[79ec] c9
   dec     (iy+$13)                        ;[79ed] fd 35 13
   jr      nz,$79da                        ;[79f0] 20 e8
   ld      a,$16                           ;[79f2] 3e 16
   ret                                     ;[79f4] c9
   ld      hl,$fb96                        ;[79f5] 21 96 fb
   ld      de,$fc00                        ;[79f8] 11 00 fc
   ld      c,$00                           ;[79fb] 0e 00
   ld      b,c                             ;[79fd] 41
   call    $784a                           ;[79fe] cd 4a 78
   cp      $d5                             ;[7a01] fe d5
   jr      nz,$79fe                        ;[7a03] 20 f9
   call    $784a                           ;[7a05] cd 4a 78
   cp      $aa                             ;[7a08] fe aa
   jr      nz,$79fe                        ;[7a0a] 20 f2
   call    $784a                           ;[7a0c] cd 4a 78
   cp      $ad                             ;[7a0f] fe ad
   jr      nz,$7a4b                        ;[7a11] 20 38
   in      a,($12)                         ;[7a13] db 12
   or      a                               ;[7a15] b7
   jp      p,$7a13                         ;[7a16] f2 13 7a
   in      a,($13)                         ;[7a19] db 13
   ld      l,a                             ;[7a1b] 6f
   ld      a,c                             ;[7a1c] 79
   xor     (hl)                            ;[7a1d] ae
   ld      c,a                             ;[7a1e] 4f
   ld      (de),a                          ;[7a1f] 12
   inc     de                              ;[7a20] 13
   djnz    $7a13                           ;[7a21] 10 f0
   ld      b,$57                           ;[7a23] 06 57
   in      a,($12)                         ;[7a25] db 12
   or      a                               ;[7a27] b7
   jp      p,$7a25                         ;[7a28] f2 25 7a
   in      a,($13)                         ;[7a2b] db 13
   ld      l,a                             ;[7a2d] 6f
   ld      a,c                             ;[7a2e] 79
   xor     (hl)                            ;[7a2f] ae
   ld      c,a                             ;[7a30] 4f
   ld      (de),a                          ;[7a31] 12
   inc     de                              ;[7a32] 13
   djnz    $7a25                           ;[7a33] 10 f0
   in      a,($12)                         ;[7a35] db 12
   or      a                               ;[7a37] b7
   jp      p,$7a35                         ;[7a38] f2 35 7a
   in      a,($13)                         ;[7a3b] db 13
   cp      $de                             ;[7a3d] fe de
   jr      nz,$7a4b                        ;[7a3f] 20 0a
   call    $784a                           ;[7a41] cd 4a 78
   cp      $aa                             ;[7a44] fe aa
   jr      nz,$7a4b                        ;[7a46] 20 03
   ld      a,c                             ;[7a48] 79
   or      a                               ;[7a49] b7
   ret                                     ;[7a4a] c9
   scf                                     ;[7a4b] 37
   ret                                     ;[7a4c] c9
   ld      de,$fc56                        ;[7a4d] 11 56 fc
   ld      c,$02                           ;[7a50] 0e 02
   ld      b,$56                           ;[7a52] 06 56
   ld      hl,$fc00                        ;[7a54] 21 00 fc
   ld      a,(de)                          ;[7a57] 1a
   srl     (hl)                            ;[7a58] cb 3e
   rla                                     ;[7a5a] 17
   srl     (hl)                            ;[7a5b] cb 3e
   rla                                     ;[7a5d] 17
   inc     hl                              ;[7a5e] 23
   ld      (de),a                          ;[7a5f] 12
   inc     de                              ;[7a60] 13
   djnz    $7a57                           ;[7a61] 10 f4
   dec     c                               ;[7a63] 0d
   ret     m                               ;[7a64] f8
   jr      nz,$7a52                        ;[7a65] 20 eb
   ld      b,$54                           ;[7a67] 06 54
   jr      $7a54                           ;[7a69] 18 e9
   ld      hl,$fc00                        ;[7a6b] 21 00 fc
   ld      b,$56                           ;[7a6e] 06 56
   xor     a                               ;[7a70] af
   ld      (hl),a                          ;[7a71] 77
   inc     hl                              ;[7a72] 23
   djnz    $7a71                           ;[7a73] 10 fc
   ld      de,$fd55                        ;[7a75] 11 55 fd
   ld      hl,$fc53                        ;[7a78] 21 53 fc
   ld      b,$54                           ;[7a7b] 06 54
   ld      c,$03                           ;[7a7d] 0e 03
   jr      $7a86                           ;[7a7f] 18 05
   ld      hl,$fc55                        ;[7a81] 21 55 fc
   ld      b,$56                           ;[7a84] 06 56
   ld      a,(de)                          ;[7a86] 1a
   srl     a                               ;[7a87] cb 3f
   rl      (hl)                            ;[7a89] cb 16
   rra                                     ;[7a8b] 1f
   rl      (hl)                            ;[7a8c] cb 16
   dec     hl                              ;[7a8e] 2b
   ld      (de),a                          ;[7a8f] 12
   dec     de                              ;[7a90] 1b
   djnz    $7a86                           ;[7a91] 10 f3
   dec     c                               ;[7a93] 0d
   jr      nz,$7a81                        ;[7a94] 20 eb
   ret                                     ;[7a96] c9
   ld      (iy+$03),$16                    ;[7a97] fd 36 16 03
   ld      (iy+$00),$15                    ;[7a9b] fd 36 15 00
   ld      hl,$fb40                        ;[7a9f] 21 40 fb
   dec     hl                              ;[7aa2] 2b
   inc     hl                              ;[7aa3] 23
   ld      c,(hl)                          ;[7aa4] 4e
   rrc     c                               ;[7aa5] cb 09
   jr      nc,$7ad4                        ;[7aa7] 30 2b
   inc     (iy+$15)                        ;[7aa9] fd 34 15
   ld      a,(iy+$15)                      ;[7aac] fd 7e 15
   cp      $08                             ;[7aaf] fe 08
   jr      nz,$7aa5                        ;[7ab1] 20 f2
   inc     hl                              ;[7ab3] 23
   ld      c,(hl)                          ;[7ab4] 4e
   rrc     c                               ;[7ab5] cb 09
   jr      nc,$7ad4                        ;[7ab7] 30 1b
   inc     (iy+$15)                        ;[7ab9] fd 34 15
   ld      a,(iy+$15)                      ;[7abc] fd 7e 15
   cp      $10                             ;[7abf] fe 10
   jr      nz,$7ab5                        ;[7ac1] 20 f2
   ld      (iy+$00),$15                    ;[7ac3] fd 36 15 00
   inc     (iy+$16)                        ;[7ac7] fd 34 16
   ld      a,(iy+$16)                      ;[7aca] fd 7e 16
   cp      $28                             ;[7acd] fe 28
   jr      nz,$7aa3                        ;[7acf] 20 d2
   ld      a,$07                           ;[7ad1] 3e 07
   ret                                     ;[7ad3] c9
   rlc     c                               ;[7ad4] cb 01
   ld      c,$01                           ;[7ad6] 0e 01
   ld      a,(iy+$15)                      ;[7ad8] fd 7e 15
   and     $07                             ;[7adb] e6 07
   inc     a                               ;[7add] 3c
   ld      b,a                             ;[7ade] 47
   rrc     c                               ;[7adf] cb 09
   rlc     c                               ;[7ae1] cb 01
   djnz    $7ae1                           ;[7ae3] 10 fc
   ld      a,(hl)                          ;[7ae5] 7e
   or      c                               ;[7ae6] b1
   ld      (hl),a                          ;[7ae7] 77
   xor     a                               ;[7ae8] af
   ret                                     ;[7ae9] c9
   ld      (iy+$00),$51                    ;[7aea] fd 36 51 00
   ld      hl,$fc56                        ;[7aee] 21 56 fc
   ld      (iy+$02),$12                    ;[7af1] fd 36 12 02
   ld      (iy+$03),$11                    ;[7af5] fd 36 11 03
   ld      b,$01                           ;[7af9] 06 01
   call    $790a                           ;[7afb] cd 0a 79
   or      a                               ;[7afe] b7
   jp      nz,$6206                        ;[7aff] c2 06 62
   ld      b,$10                           ;[7b02] 06 10
   ld      hl,$fc56                        ;[7b04] 21 56 fc
   push    iy                              ;[7b07] fd e5
   pop     de                              ;[7b09] d1
   inc     de                              ;[7b0a] 13
   ld      a,(hl)                          ;[7b0b] 7e
   or      a                               ;[7b0c] b7
   jr      nz,$7b18                        ;[7b0d] 20 09
   ld      a,(iy+$51)                      ;[7b0f] fd 7e 51
   or      a                               ;[7b12] b7
   call    z,$7b5a                         ;[7b13] cc 5a 7b
   xor     a                               ;[7b16] af
   ret                                     ;[7b17] c9
   push    de                              ;[7b18] d5
   push    hl                              ;[7b19] e5
   cp      $01                             ;[7b1a] fe 01
   jr      nz,$7b27                        ;[7b1c] 20 09
   ld      a,(iy+$51)                      ;[7b1e] fd 7e 51
   or      a                               ;[7b21] b7
   call    z,$7b5a                         ;[7b22] cc 5a 7b
   jr      $7b3d                           ;[7b25] 18 16
   ld      (iy+$0a),a                      ;[7b27] fd 77 0a
   inc     hl                              ;[7b2a] 23
   inc     hl                              ;[7b2b] 23
   ld      c,$08                           ;[7b2c] 0e 08
   ex      de,hl                           ;[7b2e] eb
   ld      a,(de)                          ;[7b2f] 1a
   cp      (hl)                            ;[7b30] be
   jr      nz,$7b3d                        ;[7b31] 20 0a
   inc     hl                              ;[7b33] 23
   inc     de                              ;[7b34] 13
   dec     c                               ;[7b35] 0d
   jr      nz,$7b2f                        ;[7b36] 20 f7
   pop     af                              ;[7b38] f1
   pop     af                              ;[7b39] f1
   ld      a,$02                           ;[7b3a] 3e 02
   ret                                     ;[7b3c] c9
   pop     hl                              ;[7b3d] e1
   ld      de,$0010                        ;[7b3e] 11 10 00
   add     hl,de                           ;[7b41] 19
   pop     de                              ;[7b42] d1
   djnz    $7b0b                           ;[7b43] 10 c6
   inc     (iy+$11)                        ;[7b45] fd 34 11
   ld      a,(iy+$11)                      ;[7b48] fd 7e 11
   cp      $0b                             ;[7b4b] fe 0b
   jr      nz,$7af9                        ;[7b4d] 20 aa
   ld      a,(iy+$51)                      ;[7b4f] fd 7e 51
   or      a                               ;[7b52] b7
   ld      a,$0d                           ;[7b53] 3e 0d
   jr      nz,$7b59                        ;[7b55] 20 02
   ld      a,$03                           ;[7b57] 3e 03
   ret                                     ;[7b59] c9
   ld      (iy+$01),$51                    ;[7b5a] fd 36 51 01
   push    hl                              ;[7b5e] e5
   push    de                              ;[7b5f] d5
   push    bc                              ;[7b60] c5
   ld      a,(iy+$11)                      ;[7b61] fd 7e 11
   ld      (iy+$46),a                      ;[7b64] fd 77 46
   ld      a,(iy+$09)                      ;[7b67] fd 7e 09
   ld      (hl),a                          ;[7b6a] 77
   inc     hl                              ;[7b6b] 23
   ld      (hl),$3a                        ;[7b6c] 36 3a
   inc     hl                              ;[7b6e] 23
   ex      de,hl                           ;[7b6f] eb
   ld      bc,$0008                        ;[7b70] 01 08 00
   ldir                                    ;[7b73] ed b0
   ex      de,hl                           ;[7b75] eb
   ld      a,(iy+$16)                      ;[7b76] fd 7e 16
   ld      (hl),a                          ;[7b79] 77
   inc     hl                              ;[7b7a] 23
   ld      a,(iy+$15)                      ;[7b7b] fd 7e 15
   ld      (hl),a                          ;[7b7e] 77
   inc     hl                              ;[7b7f] 23
   ld      de,($8041)                      ;[7b80] ed 5b 41 80
   ld      (hl),e                          ;[7b84] 73
   inc     hl                              ;[7b85] 23
   ld      (hl),d                          ;[7b86] 72
   inc     hl                              ;[7b87] 23
   ld      de,($83e9)                      ;[7b88] ed 5b e9 83
   ld      (hl),e                          ;[7b8c] 73
   inc     hl                              ;[7b8d] 23
   ld      (hl),d                          ;[7b8e] 72
   call    $7b96                           ;[7b8f] cd 96 7b
   pop     bc                              ;[7b92] c1
   pop     de                              ;[7b93] d1
   pop     hl                              ;[7b94] e1
   ret                                     ;[7b95] c9
   ld      hl,$fc56                        ;[7b96] 21 56 fc
   ld      de,$fd57                        ;[7b99] 11 57 fd
   ld      bc,$0100                        ;[7b9c] 01 00 01
   ldir                                    ;[7b9f] ed b0
   ret                                     ;[7ba1] c9
   ld      a,($6ffd)                       ;[7ba2] 3a fd 6f
   bit     6,a                             ;[7ba5] cb 77
   jr      z,$7ba2                         ;[7ba7] 28 f9
   push    bc                              ;[7ba9] c5
   ld      bc,$0014                        ;[7baa] 01 14 00
   call    $7887                           ;[7bad] cd 87 78
   pop     bc                              ;[7bb0] c1
   ld      a,($6ffd)                       ;[7bb1] 3a fd 6f
   bit     6,a                             ;[7bb4] cb 77
   jr      z,$7ba2                         ;[7bb6] 28 ea
   ld      a,$11                           ;[7bb8] 3e 11
   or      a                               ;[7bba] b7
   ret                                     ;[7bbb] c9
   di                                      ;[7bbc] f3
   ld      a,(iy+$43)                      ;[7bbd] fd 7e 43
   and     $cf                             ;[7bc0] e6 cf
   or      (iy+$0b)                        ;[7bc2] fd b6 0b
   or      $10                             ;[7bc5] f6 10
   ld      (iy+$43),a                      ;[7bc7] fd 77 43
   out     ($10),a                         ;[7bca] d3 10
   push    bc                              ;[7bcc] c5
   ld      bc,$0002                        ;[7bcd] 01 02 00
   call    $7887                           ;[7bd0] cd 87 78
   pop     bc                              ;[7bd3] c1
   ret                                     ;[7bd4] c9
   ld      a,(iy+$43)                      ;[7bd5] fd 7e 43
   and     $ef                             ;[7bd8] e6 ef
   ld      (iy+$43),a                      ;[7bda] fd 77 43
   out     ($10),a                         ;[7bdd] d3 10
   ret                                     ;[7bdf] c9
   call    $7bbc                           ;[7be0] cd bc 7b
   push    bc                              ;[7be3] c5
   ld      bc,$0014                        ;[7be4] 01 14 00
   call    $7887                           ;[7be7] cd 87 78
   pop     bc                              ;[7bea] c1
   in      a,($12)                         ;[7beb] db 12
   rrca                                    ;[7bed] 0f
   ld      a,$04                           ;[7bee] 3e 04
   jp      c,$6206                         ;[7bf0] da 06 62
   xor     a                               ;[7bf3] af
   ret                                     ;[7bf4] c9
   sub     (hl)                            ;[7bf5] 96
   sub     a                               ;[7bf6] 97
   sbc     d                               ;[7bf7] 9a
   sbc     e                               ;[7bf8] 9b
   sbc     l                               ;[7bf9] 9d
   sbc     (hl)                            ;[7bfa] 9e
   sbc     a                               ;[7bfb] 9f
   and     (hl)                            ;[7bfc] a6
   and     a                               ;[7bfd] a7
   xor     e                               ;[7bfe] ab
   xor     h                               ;[7bff] ac
   xor     l                               ;[7c00] ad
   xor     (hl)                            ;[7c01] ae
   xor     a                               ;[7c02] af
   or      d                               ;[7c03] b2
   or      e                               ;[7c04] b3
   or      h                               ;[7c05] b4
   or      l                               ;[7c06] b5
   or      (hl)                            ;[7c07] b6
   or      a                               ;[7c08] b7
   cp      c                               ;[7c09] b9
   cp      d                               ;[7c0a] ba
   cp      e                               ;[7c0b] bb
   cp      h                               ;[7c0c] bc
   cp      l                               ;[7c0d] bd
   cp      (hl)                            ;[7c0e] be
   cp      a                               ;[7c0f] bf
   set     1,l                             ;[7c10] cb cd
   adc     $cf                             ;[7c12] ce cf
   out     ($d6),a                         ;[7c14] d3 d6
   rst     $10                             ;[7c16] d7
   exx                                     ;[7c17] d9
   jp      c,$dcdb                         ;[7c18] da db dc
   sbc     $df                             ;[7c1b] dd de df
   push    hl                              ;[7c1e] e5
   and     $e7                             ;[7c1f] e6 e7
   jp      (hl)                            ;[7c21] e9
   jp      pe,$eceb                        ;[7c22] ea eb ec
   nop                                     ;[7c25] ed ee
   rst     $28                             ;[7c27] ef
   jp      p,$f4f3                         ;[7c28] f2 f3 f4
   push    af                              ;[7c2b] f5
   or      $f7                             ;[7c2c] f6 f7
   ld      sp,hl                           ;[7c2e] f9
   jp      m,$fcfb                         ;[7c2f] fa fb fc
   cp      $ff                             ;[7c32] fd fe ff
   nop                                     ;[7c35] 00
   inc     bc                              ;[7c36] 03
   ld      b,$09                           ;[7c37] 06 09
   inc     c                               ;[7c39] 0c
   rrca                                    ;[7c3a] 0f
   ld      (bc),a                          ;[7c3b] 02
   dec     b                               ;[7c3c] 05
   ex      af,af'                          ;[7c3d] 08
   dec     bc                              ;[7c3e] 0b
   ld      c,$01                           ;[7c3f] 0e 01
   inc     b                               ;[7c41] 04
   rlca                                    ;[7c42] 07
   ld      a,(bc)                          ;[7c43] 0a
   dec     c                               ;[7c44] 0d
   nop                                     ;[7c45] 00
   ld      bc,$9998                        ;[7c46] 01 98 99
   ld      (bc),a                          ;[7c49] 02
   inc     bc                              ;[7c4a] 03
   sbc     h                               ;[7c4b] 9c
   inc     b                               ;[7c4c] 04
   dec     b                               ;[7c4d] 05
   ld      b,$a0                           ;[7c4e] 06 a0
   and     c                               ;[7c50] a1
   and     d                               ;[7c51] a2
   and     e                               ;[7c52] a3
   and     h                               ;[7c53] a4
   and     l                               ;[7c54] a5
   rlca                                    ;[7c55] 07
   ex      af,af'                          ;[7c56] 08
   xor     b                               ;[7c57] a8
   xor     c                               ;[7c58] a9
   xor     d                               ;[7c59] aa
   add     hl,bc                           ;[7c5a] 09
   ld      a,(bc)                          ;[7c5b] 0a
   dec     bc                              ;[7c5c] 0b
   inc     c                               ;[7c5d] 0c
   dec     c                               ;[7c5e] 0d
   or      b                               ;[7c5f] b0
   or      c                               ;[7c60] b1
   ld      c,$0f                           ;[7c61] 0e 0f
   djnz    $7c76                           ;[7c63] 10 11
   ld      (de),a                          ;[7c65] 12
   inc     de                              ;[7c66] 13
   cp      b                               ;[7c67] b8
   inc     d                               ;[7c68] 14
   dec     d                               ;[7c69] 15
   ld      d,$17                           ;[7c6a] 16 17
   jr      $7c87                           ;[7c6c] 18 19
   ld      a,(de)                          ;[7c6e] 1a
   ret     nz                              ;[7c6f] c0
   pop     bc                              ;[7c70] c1
   jp      nz,$c4c3                        ;[7c71] c2 c3 c4
   push    bc                              ;[7c74] c5
   add     $c7                             ;[7c75] c6 c7
   ret     z                               ;[7c77] c8
   ret                                     ;[7c78] c9
   jp      z,$cc1b                         ;[7c79] ca 1b cc
   inc     e                               ;[7c7c] 1c
   dec     e                               ;[7c7d] 1d
   ld      e,$d0                           ;[7c7e] 1e d0
   pop     de                              ;[7c80] d1
   jp      nc,$d41f                        ;[7c81] d2 1f d4
   push    de                              ;[7c84] d5
   jr      nz,$7ca8                        ;[7c85] 20 21
   ret     c                               ;[7c87] d8
   ld      ($2423),hl                      ;[7c88] 22 23 24
   dec     h                               ;[7c8b] 25
   ld      h,$27                           ;[7c8c] 26 27
   jr      z,$7c70                         ;[7c8e] 28 e0
   pop     hl                              ;[7c90] e1
   jp      po,$e4e3                        ;[7c91] e2 e3 e4
   add     hl,hl                           ;[7c94] 29
   ld      hl,($e82b)                      ;[7c95] 2a 2b e8
   inc     l                               ;[7c98] 2c
   dec     l                               ;[7c99] 2d
   ld      l,$2f                           ;[7c9a] 2e 2f
   jr      nc,$7ccf                        ;[7c9c] 30 31
   ld       ($f1f0),a                      ;[7c9e] 32 f0 f1
   inc     sp                              ;[7ca1] 33
   inc     (hl)                            ;[7ca2] 34
   dec     (hl)                            ;[7ca3] 35
   ld      (hl),$37                        ;[7ca4] 36 37
   jr      c,$7ca0                         ;[7ca6] 38 f8
   add     hl,sp                           ;[7ca8] 39
   ld      a,($3c3b)                       ;[7ca9] 3a 3b 3c
   dec     a                               ;[7cac] 3d
   ld      a,$3f                           ;[7cad] 3e 3f
   nop                                     ;[7caf] 00
   nop                                     ;[7cb0] 00
   nop                                     ;[7cb1] 00
   nop                                     ;[7cb2] 00
   nop                                     ;[7cb3] 00
   nop                                     ;[7cb4] 00
   nop                                     ;[7cb5] 00
   nop                                     ;[7cb6] 00
   nop                                     ;[7cb7] 00
   nop                                     ;[7cb8] 00
   nop                                     ;[7cb9] 00
   nop                                     ;[7cba] 00
   nop                                     ;[7cbb] 00
   nop                                     ;[7cbc] 00
   nop                                     ;[7cbd] 00
   nop                                     ;[7cbe] 00
   nop                                     ;[7cbf] 00
   nop                                     ;[7cc0] 00
   nop                                     ;[7cc1] 00
   nop                                     ;[7cc2] 00
   nop                                     ;[7cc3] 00
   nop                                     ;[7cc4] 00
   nop                                     ;[7cc5] 00
   nop                                     ;[7cc6] 00
   nop                                     ;[7cc7] 00
   nop                                     ;[7cc8] 00
   nop                                     ;[7cc9] 00
   nop                                     ;[7cca] 00
   nop                                     ;[7ccb] 00
   nop                                     ;[7ccc] 00
   nop                                     ;[7ccd] 00
   nop                                     ;[7cce] 00
   nop                                     ;[7ccf] 00
   nop                                     ;[7cd0] 00
   nop                                     ;[7cd1] 00
   nop                                     ;[7cd2] 00
   nop                                     ;[7cd3] 00
   nop                                     ;[7cd4] 00
   nop                                     ;[7cd5] 00
   nop                                     ;[7cd6] 00
   nop                                     ;[7cd7] 00
   nop                                     ;[7cd8] 00
   nop                                     ;[7cd9] 00
   nop                                     ;[7cda] 00
   nop                                     ;[7cdb] 00
   nop                                     ;[7cdc] 00
   nop                                     ;[7cdd] 00
   nop                                     ;[7cde] 00
   nop                                     ;[7cdf] 00
   nop                                     ;[7ce0] 00
   nop                                     ;[7ce1] 00
   nop                                     ;[7ce2] 00
   nop                                     ;[7ce3] 00
   nop                                     ;[7ce4] 00
   nop                                     ;[7ce5] 00
   nop                                     ;[7ce6] 00
   nop                                     ;[7ce7] 00
   nop                                     ;[7ce8] 00
   nop                                     ;[7ce9] 00
   nop                                     ;[7cea] 00
   nop                                     ;[7ceb] 00
   nop                                     ;[7cec] 00
   nop                                     ;[7ced] 00
   nop                                     ;[7cee] 00
   nop                                     ;[7cef] 00
   nop                                     ;[7cf0] 00
   nop                                     ;[7cf1] 00
   nop                                     ;[7cf2] 00
   nop                                     ;[7cf3] 00
   nop                                     ;[7cf4] 00
   nop                                     ;[7cf5] 00
   nop                                     ;[7cf6] 00
   nop                                     ;[7cf7] 00
   nop                                     ;[7cf8] 00
   nop                                     ;[7cf9] 00
   nop                                     ;[7cfa] 00
   nop                                     ;[7cfb] 00
   nop                                     ;[7cfc] 00
   nop                                     ;[7cfd] 00
   nop                                     ;[7cfe] 00
   nop                                     ;[7cff] 00
   nop                                     ;[7d00] 00
   nop                                     ;[7d01] 00
   nop                                     ;[7d02] 00
   nop                                     ;[7d03] 00
   nop                                     ;[7d04] 00
   nop                                     ;[7d05] 00
   nop                                     ;[7d06] 00
   nop                                     ;[7d07] 00
   rst     $38                             ;[7d08] ff
   rst     $38                             ;[7d09] ff
   ld      a,a                             ;[7d0a] 7f
   rst     $38                             ;[7d0b] ff
   ld      a,h                             ;[7d0c] 7c
   call    m,$fc74                         ;[7d0d] fc 74 fc
   ld      bc,$0180                        ;[7d10] 01 80 01
   add     e                               ;[7d13] 83
   inc     bc                              ;[7d14] 03
   add     a                               ;[7d15] 87
   inc     bc                              ;[7d16] 03
   add     a                               ;[7d17] 87
   ld      d,b                             ;[7d18] 50
   call    m,$fc70                         ;[7d19] fc 70 fc
   ld      a,d                             ;[7d1c] 7a
   cp      $74                             ;[7d1d] fe 74
   call    m,$8001                         ;[7d1f] fc 01 80
   nop                                     ;[7d22] 00
   add     b                               ;[7d23] 80
   nop                                     ;[7d24] 00
   add     b                               ;[7d25] 80
   nop                                     ;[7d26] 00
   add     b                               ;[7d27] 80
   ld      a,a                             ;[7d28] 7f
   rst     $38                             ;[7d29] ff
   ld      (hl),e                          ;[7d2a] 73
   rst     $38                             ;[7d2b] ff
   ld      a,h                             ;[7d2c] 7c
   call    m,$fc70                         ;[7d2d] fc 70 fc
   ld      bc,$0383                        ;[7d30] 01 83 03
   add     c                               ;[7d33] 81
   inc     bc                              ;[7d34] 03
   and     e                               ;[7d35] a3
   inc     bc                              ;[7d36] 03
   add     e                               ;[7d37] 83
   ld      (hl),b                          ;[7d38] 70
   ret     m                               ;[7d39] f8
   ld      (hl),b                          ;[7d3a] 70
   ret     m                               ;[7d3b] f8
   ld      (hl),b                          ;[7d3c] 70
   cp      $72                             ;[7d3d] fe 72
   call    m,$8000                         ;[7d3f] fc 00 80
   ld      bc,$0080                        ;[7d42] 01 80 00
   add     b                               ;[7d45] 80
   nop                                     ;[7d46] 00
   add     b                               ;[7d47] 80
   ld      a,a                             ;[7d48] 7f
   rst     $38                             ;[7d49] ff
   ld      (hl),a                          ;[7d4a] 77
   rst     $38                             ;[7d4b] ff
   ld      (hl),c                          ;[7d4c] 71
   call    m,$fc78                         ;[7d4d] fc 78 fc
   ld      bc,$0183                        ;[7d50] 01 83 01
   add     e                               ;[7d53] 83
   inc     bc                              ;[7d54] 03
   add     e                               ;[7d55] 83
   inc     hl                              ;[7d56] 23
   add     e                               ;[7d57] 83
   ld      (hl),b                          ;[7d58] 70
   call    m,$dc70                         ;[7d59] fc 70 dc
   ld      (hl),b                          ;[7d5c] 70
   call    m,$fa71                         ;[7d5d] fc 71 fa
   nop                                     ;[7d60] 00
   nop                                     ;[7d61] 00
   nop                                     ;[7d62] 00
   add     b                               ;[7d63] 80
   nop                                     ;[7d64] 00
   add     b                               ;[7d65] 80
   nop                                     ;[7d66] 00
   add     b                               ;[7d67] 80
   ld      a,a                             ;[7d68] 7f
   rst     $38                             ;[7d69] ff
   ld      a,a                             ;[7d6a] 7f
   rst     $38                             ;[7d6b] ff
   ld      a,h                             ;[7d6c] 7c
   call    m,$fc7c                         ;[7d6d] fc 7c fc
   ld      bc,$0382                        ;[7d70] 01 82 03
   add     e                               ;[7d73] 83
   inc     bc                              ;[7d74] 03
   add     e                               ;[7d75] 83
   inc     bc                              ;[7d76] 03
   add     e                               ;[7d77] 83
   ld      d,b                             ;[7d78] 50
   call    c,$f870                         ;[7d79] dc 70 f8
   ld      (hl),b                          ;[7d7c] 70
   cp      $70                             ;[7d7d] fe 70
   call    m,$8000                         ;[7d7f] fc 00 80
   ld      bc,$0080                        ;[7d82] 01 80 00
   add     b                               ;[7d85] 80
   nop                                     ;[7d86] 00
   add     b                               ;[7d87] 80
   ld      a,a                             ;[7d88] 7f
   rst     $38                             ;[7d89] ff
   ld      (hl),a                          ;[7d8a] 77
   rst     $38                             ;[7d8b] ff
   ld      a,h                             ;[7d8c] 7c
   call    m,$fc75                         ;[7d8d] fc 75 fc
   ld      bc,$0381                        ;[7d90] 01 81 03
   add     e                               ;[7d93] 83
   inc     bc                              ;[7d94] 03
   add     e                               ;[7d95] 83
   inc     bc                              ;[7d96] 03
   add     e                               ;[7d97] 83
   ld      d,h                             ;[7d98] 54
   ret     m                               ;[7d99] f8
   ld      d,h                             ;[7d9a] 54
   ret     m                               ;[7d9b] f8
   ld      (hl),h                          ;[7d9c] 74
   cp      $74                             ;[7d9d] fe 74
   ret     m                               ;[7d9f] f8
   nop                                     ;[7da0] 00
   add     b                               ;[7da1] 80
   nop                                     ;[7da2] 00
   add     b                               ;[7da3] 80
   nop                                     ;[7da4] 00
   add     h                               ;[7da5] 84
   nop                                     ;[7da6] 00
   add     b                               ;[7da7] 80
   rst     $38                             ;[7da8] ff
   rst     $38                             ;[7da9] ff
   ld      a,a                             ;[7daa] 7f
   rst     $38                             ;[7dab] ff
   ld      a,h                             ;[7dac] 7c
   call    m,$fc7d                         ;[7dad] fc 7d fc
   ld      bc,$0185                        ;[7db0] 01 85 01
   add     e                               ;[7db3] 83
   rlca                                    ;[7db4] 07
   add     a                               ;[7db5] 87
   rlca                                    ;[7db6] 07
   add     a                               ;[7db7] 87
   ld      (hl),h                          ;[7db8] 74
   call    c,$fc7c                         ;[7db9] dc 7c fc
   ld      (hl),h                          ;[7dbc] 74
   cp      $74                             ;[7dbd] fe 74
   call    m,$8001                         ;[7dbf] fc 01 80
   nop                                     ;[7dc2] 00
   add     b                               ;[7dc3] 80
   nop                                     ;[7dc4] 00
   add     b                               ;[7dc5] 80
   nop                                     ;[7dc6] 00
   add     b                               ;[7dc7] 80
   ld      a,a                             ;[7dc8] 7f
   rst     $38                             ;[7dc9] ff
   ld      a,a                             ;[7dca] 7f
   rst     $38                             ;[7dcb] ff
   ld      a,h                             ;[7dcc] 7c
   call    m,$fc7c                         ;[7dcd] fc 7c fc
   ld      bc,$0583                        ;[7dd0] 01 83 05
   add     e                               ;[7dd3] 83
   inc     bc                              ;[7dd4] 03
   add     e                               ;[7dd5] 83
   daa                                     ;[7dd6] 27
   add     e                               ;[7dd7] 83
   ld      (hl),h                          ;[7dd8] 74
   call    m,$fc74                         ;[7dd9] fc 74 fc
   ld      (hl),h                          ;[7ddc] 74
   cp      $7c                             ;[7ddd] fe 7c
   call    m,$8001                         ;[7ddf] fc 01 80
   nop                                     ;[7de2] 00
   add     b                               ;[7de3] 80
   nop                                     ;[7de4] 00
   add     b                               ;[7de5] 80
   nop                                     ;[7de6] 00
   add     b                               ;[7de7] 80
   rst     $38                             ;[7de8] ff
   rst     $38                             ;[7de9] ff
   ld      a,a                             ;[7dea] 7f
   rst     $38                             ;[7deb] ff
   ld      a,h                             ;[7dec] 7c
   call    m,$fc7c                         ;[7ded] fc 7c fc
   ld      bc,$0181                        ;[7df0] 01 81 01
   add     e                               ;[7df3] 83
   inc     bc                              ;[7df4] 03
   add     a                               ;[7df5] 87
   inc     bc                              ;[7df6] 03
   add     a                               ;[7df7] 87
   ld      (hl),b                          ;[7df8] 70
   call    m,$fc50                         ;[7df9] fc 50 fc
   ld      a,h                             ;[7dfc] 7c
   call    m,$fc78                         ;[7dfd] fc 78 fc
   nop                                     ;[7e00] 00
   add     b                               ;[7e01] 80
   nop                                     ;[7e02] 00
   add     b                               ;[7e03] 80
   nop                                     ;[7e04] 00
   add     b                               ;[7e05] 80
   ld      bc,$ff00                        ;[7e06] 01 00 ff
   cp      $ff                             ;[7e09] fe ff
   cp      $ff                             ;[7e0b] fe ff
   rst     $38                             ;[7e0d] ff
   rst     $38                             ;[7e0e] ff
   rst     $38                             ;[7e0f] ff
   ld      bc,$0381                        ;[7e10] 01 81 03
   nop                                     ;[7e13] 00
   ld      bc,$0000                        ;[7e14] 01 00 00
   add     b                               ;[7e17] 80
   rst     $38                             ;[7e18] ff
   rst     $38                             ;[7e19] ff
   rst     $38                             ;[7e1a] ff
   rst     $38                             ;[7e1b] ff
   ld      a,a                             ;[7e1c] 7f
   cp      $7f                             ;[7e1d] fe 7f
   cp      $00                             ;[7e1f] fe 00
   add     b                               ;[7e21] 80
   nop                                     ;[7e22] 00
   add     b                               ;[7e23] 80
   nop                                     ;[7e24] 00
   add     b                               ;[7e25] 80
   ld      bc,$7f80                        ;[7e26] 01 80 7f
   cp      $7f                             ;[7e29] fe 7f
   rst     $38                             ;[7e2b] ff
   ld      a,a                             ;[7e2c] 7f
   rst     $38                             ;[7e2d] ff
   ld      a,a                             ;[7e2e] 7f
   rst     $38                             ;[7e2f] ff
   ld      bc,$0381                        ;[7e30] 01 81 03
   add     c                               ;[7e33] 81
   ld      bc,$0180                        ;[7e34] 01 80 01
   add     b                               ;[7e37] 80
   ld      a,a                             ;[7e38] 7f
   rst     $38                             ;[7e39] ff
   ld      a,a                             ;[7e3a] 7f
   rst     $38                             ;[7e3b] ff
   ld      a,a                             ;[7e3c] 7f
   cp      $7f                             ;[7e3d] fe 7f
   cp      $00                             ;[7e3f] fe 00
   add     b                               ;[7e41] 80
   nop                                     ;[7e42] 00
   add     b                               ;[7e43] 80
   ld      bc,$0080                        ;[7e44] 01 80 00
   add     b                               ;[7e47] 80
   rst     $38                             ;[7e48] ff
   cp      $ff                             ;[7e49] fe ff
   cp      $7f                             ;[7e4b] fe 7f
   rst     $38                             ;[7e4d] ff
   ld      a,a                             ;[7e4e] 7f
   rst     $38                             ;[7e4f] ff
   ld      bc,$0180                        ;[7e50] 01 80 01
   add     b                               ;[7e53] 80
   nop                                     ;[7e54] 00
   add     b                               ;[7e55] 80
   ld      bc,$ff80                        ;[7e56] 01 80 ff
   rst     $38                             ;[7e59] ff
   ld      a,a                             ;[7e5a] 7f
   rst     $38                             ;[7e5b] ff
   ld      a,a                             ;[7e5c] 7f
   cp      $7f                             ;[7e5d] fe 7f
   cp      $00                             ;[7e5f] fe 00
   add     b                               ;[7e61] 80
   nop                                     ;[7e62] 00
   add     b                               ;[7e63] 80
   nop                                     ;[7e64] 00
   add     b                               ;[7e65] 80
   nop                                     ;[7e66] 00
   add     b                               ;[7e67] 80
   ld      a,a                             ;[7e68] 7f
   rst     $38                             ;[7e69] ff
   ld      a,a                             ;[7e6a] 7f
   cp      $7f                             ;[7e6b] fe 7f
   rst     $38                             ;[7e6d] ff
   ld      a,a                             ;[7e6e] 7f
   rst     $38                             ;[7e6f] ff
   ld      bc,$0180                        ;[7e70] 01 80 01
   add     d                               ;[7e73] 82
   ld      bc,$0000                        ;[7e74] 01 00 00
   add     b                               ;[7e77] 80
   ld      a,a                             ;[7e78] 7f
   rst     $38                             ;[7e79] ff
   ld      a,a                             ;[7e7a] 7f
   rst     $38                             ;[7e7b] ff
   ld      a,a                             ;[7e7c] 7f
   cp      $7f                             ;[7e7d] fe 7f
   cp      $00                             ;[7e7f] fe 00
   add     b                               ;[7e81] 80
   nop                                     ;[7e82] 00
   add     b                               ;[7e83] 80
   ld      bc,$0080                        ;[7e84] 01 80 00
   add     b                               ;[7e87] 80
   rst     $38                             ;[7e88] ff
   cp      $7f                             ;[7e89] fe 7f
   cp      $ff                             ;[7e8b] fe ff
   rst     $38                             ;[7e8d] ff
   rst     $38                             ;[7e8e] ff
   rst     $38                             ;[7e8f] ff
   ld      bc,$0181                        ;[7e90] 01 81 01
   add     c                               ;[7e93] 81
   nop                                     ;[7e94] 00
   add     b                               ;[7e95] 80
   nop                                     ;[7e96] 00
   add     b                               ;[7e97] 80
   rst     $38                             ;[7e98] ff
   rst     $38                             ;[7e99] ff
   rst     $38                             ;[7e9a] ff
   rst     $38                             ;[7e9b] ff
   ld      a,a                             ;[7e9c] 7f
   cp      $7f                             ;[7e9d] fe 7f
   cp      $00                             ;[7e9f] fe 00
   add     b                               ;[7ea1] 80
   nop                                     ;[7ea2] 00
   add     b                               ;[7ea3] 80
   nop                                     ;[7ea4] 00
   add     b                               ;[7ea5] 80
   ld      bc,$ff80                        ;[7ea6] 01 80 ff
   rst     $38                             ;[7ea9] ff
   rst     $38                             ;[7eaa] ff
   rst     $38                             ;[7eab] ff
   rst     $38                             ;[7eac] ff
   rst     $38                             ;[7ead] ff
   rst     $38                             ;[7eae] ff
   rst     $38                             ;[7eaf] ff
   ld      bc,$0181                        ;[7eb0] 01 81 01
   add     c                               ;[7eb3] 81
   ld      bc,$0180                        ;[7eb4] 01 80 01
   add     b                               ;[7eb7] 80
   rst     $38                             ;[7eb8] ff
   rst     $38                             ;[7eb9] ff
   rst     $38                             ;[7eba] ff
   cp      $ff                             ;[7ebb] fe ff
   cp      $ff                             ;[7ebd] fe ff
   cp      $00                             ;[7ebf] fe 00
   add     b                               ;[7ec1] 80
   nop                                     ;[7ec2] 00
   add     b                               ;[7ec3] 80
   ld      bc,$0180                        ;[7ec4] 01 80 01
   add     d                               ;[7ec7] 82
   rst     $38                             ;[7ec8] ff
   rst     $38                             ;[7ec9] ff
   ld      a,a                             ;[7eca] 7f
   rst     $38                             ;[7ecb] ff
   ld      a,a                             ;[7ecc] 7f
   rst     $38                             ;[7ecd] ff
   ld      a,a                             ;[7ece] 7f
   rst     $38                             ;[7ecf] ff
   ld      bc,$0180                        ;[7ed0] 01 80 01
   add     d                               ;[7ed3] 82
   nop                                     ;[7ed4] 00
   add     b                               ;[7ed5] 80
   nop                                     ;[7ed6] 00
   add     b                               ;[7ed7] 80
   rst     $38                             ;[7ed8] ff
   rst     $38                             ;[7ed9] ff
   ld      a,a                             ;[7eda] 7f
   rst     $38                             ;[7edb] ff
   ld      a,a                             ;[7edc] 7f
   cp      $7f                             ;[7edd] fe 7f
   cp      $00                             ;[7edf] fe 00
   add     b                               ;[7ee1] 80
   nop                                     ;[7ee2] 00
   add     b                               ;[7ee3] 80
   nop                                     ;[7ee4] 00
   add     b                               ;[7ee5] 80
   nop                                     ;[7ee6] 00
   add     b                               ;[7ee7] 80
   rst     $38                             ;[7ee8] ff
   rst     $38                             ;[7ee9] ff
   rst     $38                             ;[7eea] ff
   rst     $38                             ;[7eeb] ff
   ld      a,a                             ;[7eec] 7f
   rst     $38                             ;[7eed] ff
   ld      a,a                             ;[7eee] 7f
   rst     $38                             ;[7eef] ff
   ld      bc,$0181                        ;[7ef0] 01 81 01
   add     e                               ;[7ef3] 83
   nop                                     ;[7ef4] 00
   add     b                               ;[7ef5] 80
   nop                                     ;[7ef6] 00
   add     b                               ;[7ef7] 80
   rst     $38                             ;[7ef8] ff
   rst     $38                             ;[7ef9] ff
   rst     $38                             ;[7efa] ff
   rst     $38                             ;[7efb] ff
   ld      a,a                             ;[7efc] 7f
   cp      $7f                             ;[7efd] fe 7f
   cp      $00                             ;[7eff] fe 00
   nop                                     ;[7f01] 00
   nop                                     ;[7f02] 00
   add     b                               ;[7f03] 80
   nop                                     ;[7f04] 00
   nop                                     ;[7f05] 00
   nop                                     ;[7f06] 00
   add     b                               ;[7f07] 80
   ld      a,a                             ;[7f08] 7f
   rst     $38                             ;[7f09] ff
   rst     $38                             ;[7f0a] ff
   rst     $38                             ;[7f0b] ff
   ld      a,a                             ;[7f0c] 7f
   cp      $fb                             ;[7f0d] fe fb
   rst     $38                             ;[7f0f] ff
   nop                                     ;[7f10] 00
   add     b                               ;[7f11] 80
   ld      bc,$0380                        ;[7f12] 01 80 03
   add     c                               ;[7f15] 81
   inc     hl                              ;[7f16] 23
   add     a                               ;[7f17] 87
   rst     $38                             ;[7f18] ff
   cp      $ff                             ;[7f19] fe ff
   call    m,$ffff                         ;[7f1b] fc ff ff
   ld      (hl),e                          ;[7f1e] 73
   rst     $38                             ;[7f1f] ff
   ld      bc,$0180                        ;[7f20] 01 80 01
   add     b                               ;[7f23] 80
   nop                                     ;[7f24] 00
   add     b                               ;[7f25] 80
   nop                                     ;[7f26] 00
   add     b                               ;[7f27] 80
   ld      a,a                             ;[7f28] 7f
   rst     $38                             ;[7f29] ff
   ld      a,a                             ;[7f2a] 7f
   rst     $38                             ;[7f2b] ff
   ld      a,a                             ;[7f2c] 7f
   rst     $38                             ;[7f2d] ff
   ld      a,a                             ;[7f2e] 7f
   rst     $38                             ;[7f2f] ff
   nop                                     ;[7f30] 00
   add     b                               ;[7f31] 80
   nop                                     ;[7f32] 00
   add     b                               ;[7f33] 80
   inc     bc                              ;[7f34] 03
   add     c                               ;[7f35] 81
   inc     bc                              ;[7f36] 03
   add     e                               ;[7f37] 83
   rst     $38                             ;[7f38] ff
   cp      $7b                             ;[7f39] fe 7b
   cp      $7f                             ;[7f3b] fe 7f
   rst     $38                             ;[7f3d] ff
   ld      (hl),e                          ;[7f3e] 73
   ei                                      ;[7f3f] fb
   ld      bc,$0180                        ;[7f40] 01 80 01
   add     b                               ;[7f43] 80
   nop                                     ;[7f44] 00
   add     b                               ;[7f45] 80
   nop                                     ;[7f46] 00
   add     b                               ;[7f47] 80
   ld      a,a                             ;[7f48] 7f
   rst     $38                             ;[7f49] ff
   ld      (hl),a                          ;[7f4a] 77
   rst     $38                             ;[7f4b] ff
   ld      a,a                             ;[7f4c] 7f
   cp      $73                             ;[7f4d] fe 73
   rst     $38                             ;[7f4f] ff
   nop                                     ;[7f50] 00
   add     b                               ;[7f51] 80
   nop                                     ;[7f52] 00
   add     b                               ;[7f53] 80
   inc     bc                              ;[7f54] 03
   add     c                               ;[7f55] 81
   inc     bc                              ;[7f56] 03
   and     e                               ;[7f57] a3
   rst     $38                             ;[7f58] ff
   cp      $77                             ;[7f59] fe 77
   cp      $ff                             ;[7f5b] fe ff
   rst     $38                             ;[7f5d] ff
   ld      (hl),e                          ;[7f5e] 73
   ei                                      ;[7f5f] fb
   nop                                     ;[7f60] 00
   add     b                               ;[7f61] 80
   nop                                     ;[7f62] 00
   add     b                               ;[7f63] 80
   nop                                     ;[7f64] 00
   add     b                               ;[7f65] 80
   nop                                     ;[7f66] 00
   add     b                               ;[7f67] 80
   ld      a,a                             ;[7f68] 7f
   rst     $38                             ;[7f69] ff
   ld      a,a                             ;[7f6a] 7f
   rst     $38                             ;[7f6b] ff
   ld      a,a                             ;[7f6c] 7f
   rst     $38                             ;[7f6d] ff
   ld      (hl),e                          ;[7f6e] 73
   rst     $38                             ;[7f6f] ff
   nop                                     ;[7f70] 00
   nop                                     ;[7f71] 00
   nop                                     ;[7f72] 00
   add     b                               ;[7f73] 80
   inc     bc                              ;[7f74] 03
   add     e                               ;[7f75] 83
   inc     bc                              ;[7f76] 03
   add     c                               ;[7f77] 81
   ld      a,a                             ;[7f78] 7f
   cp      $7f                             ;[7f79] fe 7f
   cp      $7f                             ;[7f7b] fe 7f
   cp      $7b                             ;[7f7d] fe 7b
   ei                                      ;[7f7f] fb
   ld      bc,$0080                        ;[7f80] 01 80 00
   add     b                               ;[7f83] 80
   nop                                     ;[7f84] 00
   add     b                               ;[7f85] 80
   nop                                     ;[7f86] 00
   add     b                               ;[7f87] 80
   ld      a,a                             ;[7f88] 7f
   rst     $38                             ;[7f89] ff
   ld      a,a                             ;[7f8a] 7f
   rst     $38                             ;[7f8b] ff
   ld      a,a                             ;[7f8c] 7f
   rst     $38                             ;[7f8d] ff
   ld      a,a                             ;[7f8e] 7f
   rst     $38                             ;[7f8f] ff
   ld      bc,$0080                        ;[7f90] 01 80 00
   add     b                               ;[7f93] 80
   inc     bc                              ;[7f94] 03
   add     c                               ;[7f95] 81
   rlca                                    ;[7f96] 07
   add     e                               ;[7f97] 83
   rst     $38                             ;[7f98] ff
   cp      $7f                             ;[7f99] fe 7f
   cp      $ff                             ;[7f9b] fe ff
   rst     $38                             ;[7f9d] ff
   ld      (hl),a                          ;[7f9e] 77
   ei                                      ;[7f9f] fb
   ld      bc,$0180                        ;[7fa0] 01 80 01
   add     b                               ;[7fa3] 80
   nop                                     ;[7fa4] 00
   add     b                               ;[7fa5] 80
   nop                                     ;[7fa6] 00
   add     b                               ;[7fa7] 80
   ld      a,a                             ;[7fa8] 7f
   rst     $38                             ;[7fa9] ff
   rst     $38                             ;[7faa] ff
   rst     $38                             ;[7fab] ff
   ld      a,a                             ;[7fac] 7f
   cp      $7f                             ;[7fad] fe 7f
   rst     $38                             ;[7faf] ff
   nop                                     ;[7fb0] 00
   nop                                     ;[7fb1] 00
   nop                                     ;[7fb2] 00
   add     b                               ;[7fb3] 80
   inc     bc                              ;[7fb4] 03
   add     c                               ;[7fb5] 81
   rlca                                    ;[7fb6] 07
   add     a                               ;[7fb7] 87
   rst     $38                             ;[7fb8] ff
   cp      $7f                             ;[7fb9] fe 7f
   cp      $ff                             ;[7fbb] fe ff
   rst     $38                             ;[7fbd] ff
   ld      (hl),a                          ;[7fbe] 77
   rst     $38                             ;[7fbf] ff
   ld      bc,$0180                        ;[7fc0] 01 80 01
   add     b                               ;[7fc3] 80
   nop                                     ;[7fc4] 00
   add     b                               ;[7fc5] 80
   nop                                     ;[7fc6] 00
   add     b                               ;[7fc7] 80
   ld      a,a                             ;[7fc8] 7f
   rst     $38                             ;[7fc9] ff
   ld      a,a                             ;[7fca] 7f
   rst     $38                             ;[7fcb] ff
   ld      a,a                             ;[7fcc] 7f
   rst     $38                             ;[7fcd] ff
   ld      a,a                             ;[7fce] 7f
   rst     $38                             ;[7fcf] ff
   nop                                     ;[7fd0] 00
   add     b                               ;[7fd1] 80
   nop                                     ;[7fd2] 00
   add     b                               ;[7fd3] 80
   inc     bc                              ;[7fd4] 03
   add     e                               ;[7fd5] 83
   rlca                                    ;[7fd6] 07
   add     e                               ;[7fd7] 83
   rst     $38                             ;[7fd8] ff
   cp      $7f                             ;[7fd9] fe 7f
   cp      $7f                             ;[7fdb] fe 7f
   rst     $38                             ;[7fdd] ff
   ld      (hl),a                          ;[7fde] 77
   ei                                      ;[7fdf] fb
   ld      bc,$000d                        ;[7fe0] 01 0d 00
   ld      l,e                             ;[7fe3] 6b
   inc     bc                              ;[7fe4] 03
   dec     c                               ;[7fe5] 0d
   nop                                     ;[7fe6] 00
   ld      b,h                             ;[7fe7] 44
   inc     bc                              ;[7fe8] 03
   ld      b,b                             ;[7fe9] 40
   jr      nz,$7fe7                        ;[7fea] 20 fb
   add     l                               ;[7fec] 85
   adc     (hl)                            ;[7fed] 8e
   and     d                               ;[7fee] a2
   ret     nz                              ;[7fef] c0
   and     d                               ;[7ff0] a2
   inc     de                              ;[7ff1] 13
   and     d                               ;[7ff2] a2
   add     b                               ;[7ff3] 80
   inc     bc                              ;[7ff4] 03
   add     c                               ;[7ff5] 81
   inc     hl                              ;[7ff6] 23
   add     a                               ;[7ff7] 87
   rst     $38                             ;[7ff8] ff
   cp      $7f                             ;[7ff9] fe 7f
   cp      $ff                             ;[7ffb] fe ff
   rst     $38                             ;[7ffd] ff
   ld      (hl),e                          ;[7ffe] 73
   rst     $38                             ;[7fff] ff
   nop                                     ;[8000] 00
   nop                                     ;[8001] 00
   nop                                     ;[8002] 00
   nop                                     ;[8003] 00
   nop                                     ;[8004] 00
   nop                                     ;[8005] 00
   nop                                     ;[8006] 00
   nop                                     ;[8007] 00
   nop                                     ;[8008] 00
   nop                                     ;[8009] 00
   nop                                     ;[800a] 00
   nop                                     ;[800b] 00
   nop                                     ;[800c] 00
   nop                                     ;[800d] 00
   nop                                     ;[800e] 00
   nop                                     ;[800f] 00
   nop                                     ;[8010] 00
   nop                                     ;[8011] 00
   nop                                     ;[8012] 00
   nop                                     ;[8013] 00
   nop                                     ;[8014] 00
   nop                                     ;[8015] 00
   nop                                     ;[8016] 00
   nop                                     ;[8017] 00
   nop                                     ;[8018] 00
   nop                                     ;[8019] 00
   nop                                     ;[801a] 00
   nop                                     ;[801b] 00
   nop                                     ;[801c] 00
   nop                                     ;[801d] 00
   nop                                     ;[801e] 00
   nop                                     ;[801f] 00
   nop                                     ;[8020] 00
   nop                                     ;[8021] 00
   nop                                     ;[8022] 00
   nop                                     ;[8023] 00
   nop                                     ;[8024] 00
   nop                                     ;[8025] 00
   nop                                     ;[8026] 00
   nop                                     ;[8027] 00
   nop                                     ;[8028] 00
   nop                                     ;[8029] 00
   nop                                     ;[802a] 00
   nop                                     ;[802b] 00
   nop                                     ;[802c] 00
   nop                                     ;[802d] 00
   nop                                     ;[802e] 00
   nop                                     ;[802f] 00
   nop                                     ;[8030] 00
   nop                                     ;[8031] 00
   nop                                     ;[8032] 00
   nop                                     ;[8033] 00
   nop                                     ;[8034] 00
   nop                                     ;[8035] 00
   nop                                     ;[8036] 00
   nop                                     ;[8037] 00
   nop                                     ;[8038] 00
   nop                                     ;[8039] 00
   nop                                     ;[803a] 00
   nop                                     ;[803b] 00
   nop                                     ;[803c] 00
   nop                                     ;[803d] 00
   nop                                     ;[803e] 00
   nop                                     ;[803f] 00
   nop                                     ;[8040] 00
   nop                                     ;[8041] 00
   nop                                     ;[8042] 00
   nop                                     ;[8043] 00
   nop                                     ;[8044] 00
   nop                                     ;[8045] 00
   nop                                     ;[8046] 00
   nop                                     ;[8047] 00
   nop                                     ;[8048] 00
   nop                                     ;[8049] 00
   nop                                     ;[804a] 00
   nop                                     ;[804b] 00
   nop                                     ;[804c] 00
   nop                                     ;[804d] 00
   nop                                     ;[804e] 00
   nop                                     ;[804f] 00
   nop                                     ;[8050] 00
   nop                                     ;[8051] 00
   nop                                     ;[8052] 00
   nop                                     ;[8053] 00
   nop                                     ;[8054] 00
   nop                                     ;[8055] 00
   nop                                     ;[8056] 00
   nop                                     ;[8057] 00
   nop                                     ;[8058] 00
   nop                                     ;[8059] 00
   nop                                     ;[805a] 00
   nop                                     ;[805b] 00
   nop                                     ;[805c] 00
   nop                                     ;[805d] 00
   nop                                     ;[805e] 00
   nop                                     ;[805f] 00
   nop                                     ;[8060] 00
   nop                                     ;[8061] 00
   nop                                     ;[8062] 00
   nop                                     ;[8063] 00
   nop                                     ;[8064] 00
   nop                                     ;[8065] 00
   nop                                     ;[8066] 00
   nop                                     ;[8067] 00
   nop                                     ;[8068] 00
   nop                                     ;[8069] 00
   nop                                     ;[806a] 00
   nop                                     ;[806b] 00
   nop                                     ;[806c] 00
   nop                                     ;[806d] 00
   nop                                     ;[806e] 00
   nop                                     ;[806f] 00
   nop                                     ;[8070] 00
   nop                                     ;[8071] 00
   nop                                     ;[8072] 00
   nop                                     ;[8073] 00
   nop                                     ;[8074] 00
   nop                                     ;[8075] 00
   nop                                     ;[8076] 00
   nop                                     ;[8077] 00
   nop                                     ;[8078] 00
   nop                                     ;[8079] 00
   nop                                     ;[807a] 00
   nop                                     ;[807b] 00
   nop                                     ;[807c] 00
   nop                                     ;[807d] 00
   nop                                     ;[807e] 00
   nop                                     ;[807f] 00
   nop                                     ;[8080] 00
   nop                                     ;[8081] 00
   nop                                     ;[8082] 00
   nop                                     ;[8083] 00
   nop                                     ;[8084] 00
   nop                                     ;[8085] 00
   nop                                     ;[8086] 00
   nop                                     ;[8087] 00
   nop                                     ;[8088] 00
   nop                                     ;[8089] 00
   nop                                     ;[808a] 00
   nop                                     ;[808b] 00
   nop                                     ;[808c] 00
   nop                                     ;[808d] 00
   nop                                     ;[808e] 00
   nop                                     ;[808f] 00
   nop                                     ;[8090] 00
   nop                                     ;[8091] 00
   nop                                     ;[8092] 00
   nop                                     ;[8093] 00
   nop                                     ;[8094] 00
   nop                                     ;[8095] 00
   nop                                     ;[8096] 00
   nop                                     ;[8097] 00
   nop                                     ;[8098] 00
   nop                                     ;[8099] 00
   nop                                     ;[809a] 00
   nop                                     ;[809b] 00
   nop                                     ;[809c] 00
   nop                                     ;[809d] 00
   nop                                     ;[809e] 00
   nop                                     ;[809f] 00
   nop                                     ;[80a0] 00
   nop                                     ;[80a1] 00
   nop                                     ;[80a2] 00
   nop                                     ;[80a3] 00
   nop                                     ;[80a4] 00
   nop                                     ;[80a5] 00
   nop                                     ;[80a6] 00
   nop                                     ;[80a7] 00
   nop                                     ;[80a8] 00
   nop                                     ;[80a9] 00
   nop                                     ;[80aa] 00
   nop                                     ;[80ab] 00
   nop                                     ;[80ac] 00
   nop                                     ;[80ad] 00
   nop                                     ;[80ae] 00
   nop                                     ;[80af] 00
   nop                                     ;[80b0] 00
   nop                                     ;[80b1] 00
   nop                                     ;[80b2] 00
   nop                                     ;[80b3] 00
   nop                                     ;[80b4] 00
   nop                                     ;[80b5] 00
   nop                                     ;[80b6] 00
   nop                                     ;[80b7] 00
   nop                                     ;[80b8] 00
   nop                                     ;[80b9] 00
   nop                                     ;[80ba] 00
   nop                                     ;[80bb] 00
   nop                                     ;[80bc] 00
   nop                                     ;[80bd] 00
   nop                                     ;[80be] 00
   nop                                     ;[80bf] 00
   nop                                     ;[80c0] 00
   nop                                     ;[80c1] 00
   nop                                     ;[80c2] 00
   nop                                     ;[80c3] 00
   nop                                     ;[80c4] 00
   nop                                     ;[80c5] 00
   nop                                     ;[80c6] 00
   nop                                     ;[80c7] 00
   nop                                     ;[80c8] 00
   nop                                     ;[80c9] 00
   nop                                     ;[80ca] 00
   nop                                     ;[80cb] 00
   nop                                     ;[80cc] 00
   nop                                     ;[80cd] 00
   nop                                     ;[80ce] 00
   nop                                     ;[80cf] 00
   nop                                     ;[80d0] 00
   nop                                     ;[80d1] 00
   nop                                     ;[80d2] 00
   nop                                     ;[80d3] 00
   nop                                     ;[80d4] 00
   nop                                     ;[80d5] 00
   nop                                     ;[80d6] 00
   nop                                     ;[80d7] 00
   nop                                     ;[80d8] 00
   nop                                     ;[80d9] 00
   nop                                     ;[80da] 00
   nop                                     ;[80db] 00
   nop                                     ;[80dc] 00
   nop                                     ;[80dd] 00
   nop                                     ;[80de] 00
   nop                                     ;[80df] 00
   nop                                     ;[80e0] 00
   nop                                     ;[80e1] 00
   nop                                     ;[80e2] 00
   nop                                     ;[80e3] 00
   nop                                     ;[80e4] 00
   nop                                     ;[80e5] 00
   nop                                     ;[80e6] 00
   nop                                     ;[80e7] 00
   nop                                     ;[80e8] 00
   nop                                     ;[80e9] 00
   nop                                     ;[80ea] 00
   nop                                     ;[80eb] 00
   nop                                     ;[80ec] 00
   nop                                     ;[80ed] 00
   nop                                     ;[80ee] 00
   nop                                     ;[80ef] 00
   nop                                     ;[80f0] 00
   nop                                     ;[80f1] 00
   nop                                     ;[80f2] 00
   nop                                     ;[80f3] 00
   nop                                     ;[80f4] 00
   nop                                     ;[80f5] 00
   nop                                     ;[80f6] 00
   nop                                     ;[80f7] 00
   nop                                     ;[80f8] 00
   nop                                     ;[80f9] 00
   nop                                     ;[80fa] 00
   nop                                     ;[80fb] 00
   nop                                     ;[80fc] 00
   nop                                     ;[80fd] 00
   nop                                     ;[80fe] 00
   nop                                     ;[80ff] 00
   nop                                     ;[8100] 00
   nop                                     ;[8101] 00
   nop                                     ;[8102] 00
   nop                                     ;[8103] 00
   nop                                     ;[8104] 00
   nop                                     ;[8105] 00
   nop                                     ;[8106] 00
   nop                                     ;[8107] 00
   nop                                     ;[8108] 00
   nop                                     ;[8109] 00
   nop                                     ;[810a] 00
   nop                                     ;[810b] 00
   nop                                     ;[810c] 00
   nop                                     ;[810d] 00
   nop                                     ;[810e] 00
   nop                                     ;[810f] 00
   nop                                     ;[8110] 00
   nop                                     ;[8111] 00
   nop                                     ;[8112] 00
   nop                                     ;[8113] 00
   nop                                     ;[8114] 00
   nop                                     ;[8115] 00
   nop                                     ;[8116] 00
   nop                                     ;[8117] 00
   nop                                     ;[8118] 00
   nop                                     ;[8119] 00
   nop                                     ;[811a] 00
   nop                                     ;[811b] 00
   nop                                     ;[811c] 00
   nop                                     ;[811d] 00
   nop                                     ;[811e] 00
   nop                                     ;[811f] 00
   nop                                     ;[8120] 00
   nop                                     ;[8121] 00
   nop                                     ;[8122] 00
   nop                                     ;[8123] 00
   nop                                     ;[8124] 00
   nop                                     ;[8125] 00
   nop                                     ;[8126] 00
   nop                                     ;[8127] 00
   nop                                     ;[8128] 00
   nop                                     ;[8129] 00
   nop                                     ;[812a] 00
   nop                                     ;[812b] 00
   nop                                     ;[812c] 00
   nop                                     ;[812d] 00
   nop                                     ;[812e] 00
   nop                                     ;[812f] 00
   nop                                     ;[8130] 00
   nop                                     ;[8131] 00
   nop                                     ;[8132] 00
   nop                                     ;[8133] 00
   nop                                     ;[8134] 00
   nop                                     ;[8135] 00
   nop                                     ;[8136] 00
   nop                                     ;[8137] 00
   nop                                     ;[8138] 00
   nop                                     ;[8139] 00
   nop                                     ;[813a] 00
   nop                                     ;[813b] 00
   nop                                     ;[813c] 00
   nop                                     ;[813d] 00
   nop                                     ;[813e] 00
   nop                                     ;[813f] 00
   nop                                     ;[8140] 00
   nop                                     ;[8141] 00
   nop                                     ;[8142] 00
   nop                                     ;[8143] 00
   nop                                     ;[8144] 00
   nop                                     ;[8145] 00
   nop                                     ;[8146] 00
   nop                                     ;[8147] 00
   nop                                     ;[8148] 00
   nop                                     ;[8149] 00
   nop                                     ;[814a] 00
   nop                                     ;[814b] 00
   nop                                     ;[814c] 00
   nop                                     ;[814d] 00
   nop                                     ;[814e] 00
   nop                                     ;[814f] 00
   nop                                     ;[8150] 00
   nop                                     ;[8151] 00
   nop                                     ;[8152] 00
   nop                                     ;[8153] 00
   nop                                     ;[8154] 00
   nop                                     ;[8155] 00
   nop                                     ;[8156] 00
   nop                                     ;[8157] 00
   nop                                     ;[8158] 00
   nop                                     ;[8159] 00
   nop                                     ;[815a] 00
   nop                                     ;[815b] 00
   nop                                     ;[815c] 00
   nop                                     ;[815d] 00
   nop                                     ;[815e] 00
   nop                                     ;[815f] 00
   nop                                     ;[8160] 00
   nop                                     ;[8161] 00
   nop                                     ;[8162] 00
   nop                                     ;[8163] 00
   nop                                     ;[8164] 00
   nop                                     ;[8165] 00
   nop                                     ;[8166] 00
   nop                                     ;[8167] 00
   nop                                     ;[8168] 00
   nop                                     ;[8169] 00
   nop                                     ;[816a] 00
   nop                                     ;[816b] 00
   nop                                     ;[816c] 00
   nop                                     ;[816d] 00
   nop                                     ;[816e] 00
   nop                                     ;[816f] 00
   nop                                     ;[8170] 00
   nop                                     ;[8171] 00
   nop                                     ;[8172] 00
   nop                                     ;[8173] 00
   nop                                     ;[8174] 00
   nop                                     ;[8175] 00
   nop                                     ;[8176] 00
   nop                                     ;[8177] 00
   nop                                     ;[8178] 00
   nop                                     ;[8179] 00
   nop                                     ;[817a] 00
   nop                                     ;[817b] 00
   nop                                     ;[817c] 00
   nop                                     ;[817d] 00
   nop                                     ;[817e] 00
   nop                                     ;[817f] 00
   nop                                     ;[8180] 00
   nop                                     ;[8181] 00
   nop                                     ;[8182] 00
   nop                                     ;[8183] 00
   nop                                     ;[8184] 00
   nop                                     ;[8185] 00
   nop                                     ;[8186] 00
   nop                                     ;[8187] 00
   nop                                     ;[8188] 00
   nop                                     ;[8189] 00
   nop                                     ;[818a] 00
   nop                                     ;[818b] 00
   nop                                     ;[818c] 00
   nop                                     ;[818d] 00
   nop                                     ;[818e] 00
   nop                                     ;[818f] 00
   nop                                     ;[8190] 00
   nop                                     ;[8191] 00
   nop                                     ;[8192] 00
   nop                                     ;[8193] 00
   nop                                     ;[8194] 00
   nop                                     ;[8195] 00
   nop                                     ;[8196] 00
   nop                                     ;[8197] 00
   nop                                     ;[8198] 00
   nop                                     ;[8199] 00
   nop                                     ;[819a] 00
   nop                                     ;[819b] 00
   nop                                     ;[819c] 00
   nop                                     ;[819d] 00
   nop                                     ;[819e] 00
   nop                                     ;[819f] 00
   nop                                     ;[81a0] 00
   nop                                     ;[81a1] 00
   nop                                     ;[81a2] 00
   nop                                     ;[81a3] 00
   nop                                     ;[81a4] 00
   nop                                     ;[81a5] 00
   nop                                     ;[81a6] 00
   nop                                     ;[81a7] 00
   nop                                     ;[81a8] 00
   nop                                     ;[81a9] 00
   nop                                     ;[81aa] 00
   nop                                     ;[81ab] 00
   nop                                     ;[81ac] 00
   nop                                     ;[81ad] 00
   nop                                     ;[81ae] 00
   nop                                     ;[81af] 00
   nop                                     ;[81b0] 00
   nop                                     ;[81b1] 00
   nop                                     ;[81b2] 00
   nop                                     ;[81b3] 00
   nop                                     ;[81b4] 00
   nop                                     ;[81b5] 00
   nop                                     ;[81b6] 00
   nop                                     ;[81b7] 00
   nop                                     ;[81b8] 00
   nop                                     ;[81b9] 00
   nop                                     ;[81ba] 00
   nop                                     ;[81bb] 00
   nop                                     ;[81bc] 00
   nop                                     ;[81bd] 00
   nop                                     ;[81be] 00
   nop                                     ;[81bf] 00
   nop                                     ;[81c0] 00
   nop                                     ;[81c1] 00
   nop                                     ;[81c2] 00
   nop                                     ;[81c3] 00
   nop                                     ;[81c4] 00
   nop                                     ;[81c5] 00
   nop                                     ;[81c6] 00
   nop                                     ;[81c7] 00
   nop                                     ;[81c8] 00
   nop                                     ;[81c9] 00
   nop                                     ;[81ca] 00
   nop                                     ;[81cb] 00
   nop                                     ;[81cc] 00
   nop                                     ;[81cd] 00
   nop                                     ;[81ce] 00
   nop                                     ;[81cf] 00
   nop                                     ;[81d0] 00
   nop                                     ;[81d1] 00
   nop                                     ;[81d2] 00
   nop                                     ;[81d3] 00
   nop                                     ;[81d4] 00
   nop                                     ;[81d5] 00
   nop                                     ;[81d6] 00
   nop                                     ;[81d7] 00
   nop                                     ;[81d8] 00
   nop                                     ;[81d9] 00
   nop                                     ;[81da] 00
   nop                                     ;[81db] 00
   nop                                     ;[81dc] 00
   nop                                     ;[81dd] 00
   nop                                     ;[81de] 00
   nop                                     ;[81df] 00
   nop                                     ;[81e0] 00
   nop                                     ;[81e1] 00
   nop                                     ;[81e2] 00
   nop                                     ;[81e3] 00
   nop                                     ;[81e4] 00
   nop                                     ;[81e5] 00
   nop                                     ;[81e6] 00
   nop                                     ;[81e7] 00
   nop                                     ;[81e8] 00
   nop                                     ;[81e9] 00
   nop                                     ;[81ea] 00
   nop                                     ;[81eb] 00
   nop                                     ;[81ec] 00
   nop                                     ;[81ed] 00
   nop                                     ;[81ee] 00
   nop                                     ;[81ef] 00
   nop                                     ;[81f0] 00
   nop                                     ;[81f1] 00
   nop                                     ;[81f2] 00
   nop                                     ;[81f3] 00
   nop                                     ;[81f4] 00
   nop                                     ;[81f5] 00
   nop                                     ;[81f6] 00
   nop                                     ;[81f7] 00
   nop                                     ;[81f8] 00
   nop                                     ;[81f9] 00
   nop                                     ;[81fa] 00
   nop                                     ;[81fb] 00
   nop                                     ;[81fc] 00
   nop                                     ;[81fd] 00
   nop                                     ;[81fe] 00
   nop                                     ;[81ff] 00
   nop                                     ;[8200] 00
   nop                                     ;[8201] 00
   nop                                     ;[8202] 00
   nop                                     ;[8203] 00
   nop                                     ;[8204] 00
   nop                                     ;[8205] 00
   nop                                     ;[8206] 00
   nop                                     ;[8207] 00
   nop                                     ;[8208] 00
   nop                                     ;[8209] 00
   nop                                     ;[820a] 00
   nop                                     ;[820b] 00
   nop                                     ;[820c] 00
   nop                                     ;[820d] 00
   nop                                     ;[820e] 00
   nop                                     ;[820f] 00
   nop                                     ;[8210] 00
   nop                                     ;[8211] 00
   nop                                     ;[8212] 00
   nop                                     ;[8213] 00
   nop                                     ;[8214] 00
   nop                                     ;[8215] 00
   nop                                     ;[8216] 00
   nop                                     ;[8217] 00
   nop                                     ;[8218] 00
   nop                                     ;[8219] 00
   nop                                     ;[821a] 00
   nop                                     ;[821b] 00
   nop                                     ;[821c] 00
   nop                                     ;[821d] 00
   nop                                     ;[821e] 00
   nop                                     ;[821f] 00
   nop                                     ;[8220] 00
   nop                                     ;[8221] 00
   nop                                     ;[8222] 00
   nop                                     ;[8223] 00
   nop                                     ;[8224] 00
   nop                                     ;[8225] 00
   nop                                     ;[8226] 00
   nop                                     ;[8227] 00
   nop                                     ;[8228] 00
   nop                                     ;[8229] 00
   nop                                     ;[822a] 00
   nop                                     ;[822b] 00
   nop                                     ;[822c] 00
   nop                                     ;[822d] 00
   nop                                     ;[822e] 00
   nop                                     ;[822f] 00
   nop                                     ;[8230] 00
   nop                                     ;[8231] 00
   nop                                     ;[8232] 00
   nop                                     ;[8233] 00
   nop                                     ;[8234] 00
   nop                                     ;[8235] 00
   nop                                     ;[8236] 00
   nop                                     ;[8237] 00
   nop                                     ;[8238] 00
   nop                                     ;[8239] 00
   nop                                     ;[823a] 00
   nop                                     ;[823b] 00
   nop                                     ;[823c] 00
   nop                                     ;[823d] 00
   nop                                     ;[823e] 00
   nop                                     ;[823f] 00
   nop                                     ;[8240] 00
   nop                                     ;[8241] 00
   nop                                     ;[8242] 00
   nop                                     ;[8243] 00
   nop                                     ;[8244] 00
   nop                                     ;[8245] 00
   nop                                     ;[8246] 00
   nop                                     ;[8247] 00
   nop                                     ;[8248] 00
   nop                                     ;[8249] 00
   nop                                     ;[824a] 00
   nop                                     ;[824b] 00
   nop                                     ;[824c] 00
   nop                                     ;[824d] 00
   nop                                     ;[824e] 00
   nop                                     ;[824f] 00
   nop                                     ;[8250] 00
   nop                                     ;[8251] 00
   nop                                     ;[8252] 00
   nop                                     ;[8253] 00
   nop                                     ;[8254] 00
   nop                                     ;[8255] 00
   nop                                     ;[8256] 00
   nop                                     ;[8257] 00
   nop                                     ;[8258] 00
   nop                                     ;[8259] 00
   nop                                     ;[825a] 00
   nop                                     ;[825b] 00
   nop                                     ;[825c] 00
   nop                                     ;[825d] 00
   nop                                     ;[825e] 00
   nop                                     ;[825f] 00
   nop                                     ;[8260] 00
   nop                                     ;[8261] 00
   nop                                     ;[8262] 00
   nop                                     ;[8263] 00
   nop                                     ;[8264] 00
   nop                                     ;[8265] 00
   nop                                     ;[8266] 00
   nop                                     ;[8267] 00
   nop                                     ;[8268] 00
   nop                                     ;[8269] 00
   nop                                     ;[826a] 00
   nop                                     ;[826b] 00
   nop                                     ;[826c] 00
   nop                                     ;[826d] 00
   nop                                     ;[826e] 00
   nop                                     ;[826f] 00
   nop                                     ;[8270] 00
   nop                                     ;[8271] 00
   nop                                     ;[8272] 00
   nop                                     ;[8273] 00
   nop                                     ;[8274] 00
   nop                                     ;[8275] 00
   nop                                     ;[8276] 00
   nop                                     ;[8277] 00
   nop                                     ;[8278] 00
   nop                                     ;[8279] 00
   nop                                     ;[827a] 00
   nop                                     ;[827b] 00
   nop                                     ;[827c] 00
   nop                                     ;[827d] 00
   nop                                     ;[827e] 00
   nop                                     ;[827f] 00
   nop                                     ;[8280] 00
   nop                                     ;[8281] 00
   nop                                     ;[8282] 00
   nop                                     ;[8283] 00
   nop                                     ;[8284] 00
   nop                                     ;[8285] 00
   nop                                     ;[8286] 00
   nop                                     ;[8287] 00
   nop                                     ;[8288] 00
   nop                                     ;[8289] 00
   nop                                     ;[828a] 00
   nop                                     ;[828b] 00
   nop                                     ;[828c] 00
   nop                                     ;[828d] 00
   nop                                     ;[828e] 00
   nop                                     ;[828f] 00
   nop                                     ;[8290] 00
   nop                                     ;[8291] 00
   nop                                     ;[8292] 00
   nop                                     ;[8293] 00
   nop                                     ;[8294] 00
   nop                                     ;[8295] 00
   nop                                     ;[8296] 00
   nop                                     ;[8297] 00
   nop                                     ;[8298] 00
   nop                                     ;[8299] 00
   nop                                     ;[829a] 00
   nop                                     ;[829b] 00
   nop                                     ;[829c] 00
   nop                                     ;[829d] 00
   nop                                     ;[829e] 00
   nop                                     ;[829f] 00
   nop                                     ;[82a0] 00
   nop                                     ;[82a1] 00
   nop                                     ;[82a2] 00
   nop                                     ;[82a3] 00
   nop                                     ;[82a4] 00
   nop                                     ;[82a5] 00
   nop                                     ;[82a6] 00
   nop                                     ;[82a7] 00
   nop                                     ;[82a8] 00
   nop                                     ;[82a9] 00
   nop                                     ;[82aa] 00
   nop                                     ;[82ab] 00
   nop                                     ;[82ac] 00
   nop                                     ;[82ad] 00
   nop                                     ;[82ae] 00
   nop                                     ;[82af] 00
   nop                                     ;[82b0] 00
   nop                                     ;[82b1] 00
   nop                                     ;[82b2] 00
   nop                                     ;[82b3] 00
   nop                                     ;[82b4] 00
   nop                                     ;[82b5] 00
   nop                                     ;[82b6] 00
   nop                                     ;[82b7] 00
   nop                                     ;[82b8] 00
   nop                                     ;[82b9] 00
   nop                                     ;[82ba] 00
   nop                                     ;[82bb] 00
   nop                                     ;[82bc] 00
   nop                                     ;[82bd] 00
   nop                                     ;[82be] 00
   nop                                     ;[82bf] 00
   nop                                     ;[82c0] 00
   nop                                     ;[82c1] 00
   nop                                     ;[82c2] 00
   nop                                     ;[82c3] 00
   nop                                     ;[82c4] 00
   nop                                     ;[82c5] 00
   nop                                     ;[82c6] 00
   nop                                     ;[82c7] 00
   nop                                     ;[82c8] 00
   nop                                     ;[82c9] 00
   nop                                     ;[82ca] 00
   nop                                     ;[82cb] 00
   nop                                     ;[82cc] 00
   nop                                     ;[82cd] 00
   nop                                     ;[82ce] 00
   nop                                     ;[82cf] 00
   nop                                     ;[82d0] 00
   nop                                     ;[82d1] 00
   nop                                     ;[82d2] 00
   nop                                     ;[82d3] 00
   nop                                     ;[82d4] 00
   nop                                     ;[82d5] 00
   nop                                     ;[82d6] 00
   nop                                     ;[82d7] 00
   nop                                     ;[82d8] 00
   nop                                     ;[82d9] 00
   nop                                     ;[82da] 00
   nop                                     ;[82db] 00
   nop                                     ;[82dc] 00
   nop                                     ;[82dd] 00
   nop                                     ;[82de] 00
   nop                                     ;[82df] 00
   nop                                     ;[82e0] 00
   nop                                     ;[82e1] 00
   nop                                     ;[82e2] 00
   nop                                     ;[82e3] 00
   nop                                     ;[82e4] 00
   nop                                     ;[82e5] 00
   nop                                     ;[82e6] 00
   nop                                     ;[82e7] 00
   nop                                     ;[82e8] 00
   nop                                     ;[82e9] 00
   nop                                     ;[82ea] 00
   nop                                     ;[82eb] 00
   nop                                     ;[82ec] 00
   nop                                     ;[82ed] 00
   nop                                     ;[82ee] 00
   nop                                     ;[82ef] 00
   nop                                     ;[82f0] 00
   nop                                     ;[82f1] 00
   nop                                     ;[82f2] 00
   nop                                     ;[82f3] 00
   nop                                     ;[82f4] 00
   nop                                     ;[82f5] 00
   nop                                     ;[82f6] 00
   nop                                     ;[82f7] 00
   nop                                     ;[82f8] 00
   nop                                     ;[82f9] 00
   nop                                     ;[82fa] 00
   nop                                     ;[82fb] 00
   nop                                     ;[82fc] 00
   nop                                     ;[82fd] 00
   nop                                     ;[82fe] 00
   nop                                     ;[82ff] 00
   nop                                     ;[8300] 00
   nop                                     ;[8301] 00
   nop                                     ;[8302] 00
   nop                                     ;[8303] 00
   nop                                     ;[8304] 00
   nop                                     ;[8305] 00
   nop                                     ;[8306] 00
   nop                                     ;[8307] 00
   nop                                     ;[8308] 00
   nop                                     ;[8309] 00
   nop                                     ;[830a] 00
   nop                                     ;[830b] 00
   nop                                     ;[830c] 00
   nop                                     ;[830d] 00
   nop                                     ;[830e] 00
   nop                                     ;[830f] 00
   nop                                     ;[8310] 00
   nop                                     ;[8311] 00
   nop                                     ;[8312] 00
   nop                                     ;[8313] 00
   nop                                     ;[8314] 00
   nop                                     ;[8315] 00
   nop                                     ;[8316] 00
   nop                                     ;[8317] 00
   nop                                     ;[8318] 00
   nop                                     ;[8319] 00
   nop                                     ;[831a] 00
   nop                                     ;[831b] 00
   nop                                     ;[831c] 00
   nop                                     ;[831d] 00
   nop                                     ;[831e] 00
   nop                                     ;[831f] 00
   nop                                     ;[8320] 00
   nop                                     ;[8321] 00
   nop                                     ;[8322] 00
   nop                                     ;[8323] 00
   nop                                     ;[8324] 00
   nop                                     ;[8325] 00
   nop                                     ;[8326] 00
   nop                                     ;[8327] 00
   nop                                     ;[8328] 00
   nop                                     ;[8329] 00
   nop                                     ;[832a] 00
   nop                                     ;[832b] 00
   nop                                     ;[832c] 00
   nop                                     ;[832d] 00
   nop                                     ;[832e] 00
   nop                                     ;[832f] 00
   nop                                     ;[8330] 00
   nop                                     ;[8331] 00
   nop                                     ;[8332] 00
   nop                                     ;[8333] 00
   nop                                     ;[8334] 00
   nop                                     ;[8335] 00
   nop                                     ;[8336] 00
   nop                                     ;[8337] 00
   nop                                     ;[8338] 00
   nop                                     ;[8339] 00
   nop                                     ;[833a] 00
   nop                                     ;[833b] 00
   nop                                     ;[833c] 00
   nop                                     ;[833d] 00
   nop                                     ;[833e] 00
   nop                                     ;[833f] 00
   nop                                     ;[8340] 00
   nop                                     ;[8341] 00
   nop                                     ;[8342] 00
   nop                                     ;[8343] 00
   nop                                     ;[8344] 00
   nop                                     ;[8345] 00
   nop                                     ;[8346] 00
   nop                                     ;[8347] 00
   nop                                     ;[8348] 00
   nop                                     ;[8349] 00
   nop                                     ;[834a] 00
   nop                                     ;[834b] 00
   nop                                     ;[834c] 00
   nop                                     ;[834d] 00
   nop                                     ;[834e] 00
   nop                                     ;[834f] 00
   nop                                     ;[8350] 00
   nop                                     ;[8351] 00
   nop                                     ;[8352] 00
   nop                                     ;[8353] 00
   nop                                     ;[8354] 00
   nop                                     ;[8355] 00
   nop                                     ;[8356] 00
   nop                                     ;[8357] 00
   nop                                     ;[8358] 00
   nop                                     ;[8359] 00
   nop                                     ;[835a] 00
   nop                                     ;[835b] 00
   nop                                     ;[835c] 00
   nop                                     ;[835d] 00
   nop                                     ;[835e] 00
   nop                                     ;[835f] 00
   nop                                     ;[8360] 00
   nop                                     ;[8361] 00
   nop                                     ;[8362] 00
   nop                                     ;[8363] 00
   nop                                     ;[8364] 00
   nop                                     ;[8365] 00
   nop                                     ;[8366] 00
   nop                                     ;[8367] 00
   nop                                     ;[8368] 00
   nop                                     ;[8369] 00
   nop                                     ;[836a] 00
   nop                                     ;[836b] 00
   nop                                     ;[836c] 00
   nop                                     ;[836d] 00
   nop                                     ;[836e] 00
   nop                                     ;[836f] 00
   nop                                     ;[8370] 00
   nop                                     ;[8371] 00
   nop                                     ;[8372] 00
   nop                                     ;[8373] 00
   nop                                     ;[8374] 00
   nop                                     ;[8375] 00
   nop                                     ;[8376] 00
   nop                                     ;[8377] 00
   nop                                     ;[8378] 00
   nop                                     ;[8379] 00
   nop                                     ;[837a] 00
   nop                                     ;[837b] 00
   nop                                     ;[837c] 00
   nop                                     ;[837d] 00
   nop                                     ;[837e] 00
   nop                                     ;[837f] 00
   nop                                     ;[8380] 00
   nop                                     ;[8381] 00
   nop                                     ;[8382] 00
   nop                                     ;[8383] 00
   nop                                     ;[8384] 00
   nop                                     ;[8385] 00
   nop                                     ;[8386] 00
   nop                                     ;[8387] 00
   nop                                     ;[8388] 00
   nop                                     ;[8389] 00
   nop                                     ;[838a] 00
   nop                                     ;[838b] 00
   nop                                     ;[838c] 00
   nop                                     ;[838d] 00
   nop                                     ;[838e] 00
   nop                                     ;[838f] 00
   nop                                     ;[8390] 00
   nop                                     ;[8391] 00
   nop                                     ;[8392] 00
   nop                                     ;[8393] 00
   nop                                     ;[8394] 00
   nop                                     ;[8395] 00
   nop                                     ;[8396] 00
   nop                                     ;[8397] 00
   nop                                     ;[8398] 00
   nop                                     ;[8399] 00
   nop                                     ;[839a] 00
   nop                                     ;[839b] 00
   nop                                     ;[839c] 00
   nop                                     ;[839d] 00
   nop                                     ;[839e] 00
   nop                                     ;[839f] 00
   nop                                     ;[83a0] 00
   nop                                     ;[83a1] 00
   nop                                     ;[83a2] 00
   nop                                     ;[83a3] 00
   nop                                     ;[83a4] 00
   nop                                     ;[83a5] 00
   nop                                     ;[83a6] 00
   nop                                     ;[83a7] 00
   nop                                     ;[83a8] 00
   nop                                     ;[83a9] 00
   nop                                     ;[83aa] 00
   nop                                     ;[83ab] 00
   nop                                     ;[83ac] 00
   nop                                     ;[83ad] 00
   nop                                     ;[83ae] 00
   nop                                     ;[83af] 00
   nop                                     ;[83b0] 00
   nop                                     ;[83b1] 00
   nop                                     ;[83b2] 00
   nop                                     ;[83b3] 00
   nop                                     ;[83b4] 00
   nop                                     ;[83b5] 00
   nop                                     ;[83b6] 00
   nop                                     ;[83b7] 00
   nop                                     ;[83b8] 00
   nop                                     ;[83b9] 00
   nop                                     ;[83ba] 00
   nop                                     ;[83bb] 00
   nop                                     ;[83bc] 00
   nop                                     ;[83bd] 00
   nop                                     ;[83be] 00
   nop                                     ;[83bf] 00
   nop                                     ;[83c0] 00
   nop                                     ;[83c1] 00
   nop                                     ;[83c2] 00
   nop                                     ;[83c3] 00
   nop                                     ;[83c4] 00
   nop                                     ;[83c5] 00
   nop                                     ;[83c6] 00
   nop                                     ;[83c7] 00
   nop                                     ;[83c8] 00
   nop                                     ;[83c9] 00
   nop                                     ;[83ca] 00
   nop                                     ;[83cb] 00
   nop                                     ;[83cc] 00
   nop                                     ;[83cd] 00
   nop                                     ;[83ce] 00
   nop                                     ;[83cf] 00
   nop                                     ;[83d0] 00
   nop                                     ;[83d1] 00
   nop                                     ;[83d2] 00
   nop                                     ;[83d3] 00
   nop                                     ;[83d4] 00
   nop                                     ;[83d5] 00
   nop                                     ;[83d6] 00
   nop                                     ;[83d7] 00
   nop                                     ;[83d8] 00
   nop                                     ;[83d9] 00
   nop                                     ;[83da] 00
   nop                                     ;[83db] 00
   nop                                     ;[83dc] 00
   nop                                     ;[83dd] 00
   nop                                     ;[83de] 00
   nop                                     ;[83df] 00
   nop                                     ;[83e0] 00
   nop                                     ;[83e1] 00
   nop                                     ;[83e2] 00
   nop                                     ;[83e3] 00
   nop                                     ;[83e4] 00
   nop                                     ;[83e5] 00
   nop                                     ;[83e6] 00
   nop                                     ;[83e7] 00
   nop                                     ;[83e8] 00
   nop                                     ;[83e9] 00
   nop                                     ;[83ea] 00
   nop                                     ;[83eb] 00
   nop                                     ;[83ec] 00
   nop                                     ;[83ed] 00
   nop                                     ;[83ee] 00
   nop                                     ;[83ef] 00
   nop                                     ;[83f0] 00
   nop                                     ;[83f1] 00
   nop                                     ;[83f2] 00
   nop                                     ;[83f3] 00
   nop                                     ;[83f4] 00
   nop                                     ;[83f5] 00
   nop                                     ;[83f6] 00
   nop                                     ;[83f7] 00
   nop                                     ;[83f8] 00
   nop                                     ;[83f9] 00
   nop                                     ;[83fa] 00
   nop                                     ;[83fb] 00
   nop                                     ;[83fc] 00
   nop                                     ;[83fd] 00
   nop                                     ;[83fe] 00
   nop                                     ;[83ff] 00
   nop                                     ;[8400] 00
   nop                                     ;[8401] 00
   nop                                     ;[8402] 00
   nop                                     ;[8403] 00
   nop                                     ;[8404] 00
   nop                                     ;[8405] 00
   nop                                     ;[8406] 00
   nop                                     ;[8407] 00
   nop                                     ;[8408] 00
   nop                                     ;[8409] 00
   nop                                     ;[840a] 00
   nop                                     ;[840b] 00
   nop                                     ;[840c] 00
   nop                                     ;[840d] 00
   nop                                     ;[840e] 00
   nop                                     ;[840f] 00
   nop                                     ;[8410] 00
   nop                                     ;[8411] 00
   nop                                     ;[8412] 00
   nop                                     ;[8413] 00
   nop                                     ;[8414] 00
   nop                                     ;[8415] 00
   nop                                     ;[8416] 00
   nop                                     ;[8417] 00
   nop                                     ;[8418] 00
   nop                                     ;[8419] 00
   nop                                     ;[841a] 00
   nop                                     ;[841b] 00
   nop                                     ;[841c] 00
   nop                                     ;[841d] 00
   nop                                     ;[841e] 00
   nop                                     ;[841f] 00
   nop                                     ;[8420] 00
   nop                                     ;[8421] 00
   nop                                     ;[8422] 00
   nop                                     ;[8423] 00
   nop                                     ;[8424] 00
   nop                                     ;[8425] 00
   nop                                     ;[8426] 00
   nop                                     ;[8427] 00
   nop                                     ;[8428] 00
   nop                                     ;[8429] 00
   nop                                     ;[842a] 00
   nop                                     ;[842b] 00
   nop                                     ;[842c] 00
   nop                                     ;[842d] 00
   nop                                     ;[842e] 00
   nop                                     ;[842f] 00
   nop                                     ;[8430] 00
   nop                                     ;[8431] 00
   nop                                     ;[8432] 00
   nop                                     ;[8433] 00
   nop                                     ;[8434] 00
   nop                                     ;[8435] 00
   nop                                     ;[8436] 00
   nop                                     ;[8437] 00
   nop                                     ;[8438] 00
   nop                                     ;[8439] 00
   nop                                     ;[843a] 00
   nop                                     ;[843b] 00
   nop                                     ;[843c] 00
   nop                                     ;[843d] 00
   nop                                     ;[843e] 00
   nop                                     ;[843f] 00
   nop                                     ;[8440] 00
   nop                                     ;[8441] 00
   nop                                     ;[8442] 00
   nop                                     ;[8443] 00
   nop                                     ;[8444] 00
   nop                                     ;[8445] 00
   nop                                     ;[8446] 00
   nop                                     ;[8447] 00
   nop                                     ;[8448] 00
   nop                                     ;[8449] 00
   nop                                     ;[844a] 00
   nop                                     ;[844b] 00
   nop                                     ;[844c] 00
   nop                                     ;[844d] 00
   nop                                     ;[844e] 00
   nop                                     ;[844f] 00
   nop                                     ;[8450] 00
   nop                                     ;[8451] 00
   nop                                     ;[8452] 00
   nop                                     ;[8453] 00
   nop                                     ;[8454] 00
   nop                                     ;[8455] 00
   nop                                     ;[8456] 00
   nop                                     ;[8457] 00
   nop                                     ;[8458] 00
   nop                                     ;[8459] 00
   nop                                     ;[845a] 00
   nop                                     ;[845b] 00
   nop                                     ;[845c] 00
   nop                                     ;[845d] 00
   nop                                     ;[845e] 00
   nop                                     ;[845f] 00
   nop                                     ;[8460] 00
   nop                                     ;[8461] 00
   nop                                     ;[8462] 00
   nop                                     ;[8463] 00
   nop                                     ;[8464] 00
   nop                                     ;[8465] 00
   nop                                     ;[8466] 00
   nop                                     ;[8467] 00
   nop                                     ;[8468] 00
   nop                                     ;[8469] 00
   nop                                     ;[846a] 00
   nop                                     ;[846b] 00
   nop                                     ;[846c] 00
   nop                                     ;[846d] 00
   nop                                     ;[846e] 00
   nop                                     ;[846f] 00
   nop                                     ;[8470] 00
   nop                                     ;[8471] 00
   nop                                     ;[8472] 00
   nop                                     ;[8473] 00
   nop                                     ;[8474] 00
   nop                                     ;[8475] 00
   nop                                     ;[8476] 00
   nop                                     ;[8477] 00
   nop                                     ;[8478] 00
   nop                                     ;[8479] 00
   nop                                     ;[847a] 00
   nop                                     ;[847b] 00
   nop                                     ;[847c] 00
   nop                                     ;[847d] 00
   nop                                     ;[847e] 00
   nop                                     ;[847f] 00
   nop                                     ;[8480] 00
   nop                                     ;[8481] 00
   nop                                     ;[8482] 00
   nop                                     ;[8483] 00
   nop                                     ;[8484] 00
   nop                                     ;[8485] 00
   nop                                     ;[8486] 00
   nop                                     ;[8487] 00
   nop                                     ;[8488] 00
   nop                                     ;[8489] 00
   nop                                     ;[848a] 00
   nop                                     ;[848b] 00
   nop                                     ;[848c] 00
   nop                                     ;[848d] 00
   nop                                     ;[848e] 00
   nop                                     ;[848f] 00
   nop                                     ;[8490] 00
   nop                                     ;[8491] 00
   nop                                     ;[8492] 00
   nop                                     ;[8493] 00
   nop                                     ;[8494] 00
   nop                                     ;[8495] 00
   nop                                     ;[8496] 00
   nop                                     ;[8497] 00
   nop                                     ;[8498] 00
   nop                                     ;[8499] 00
   nop                                     ;[849a] 00
   nop                                     ;[849b] 00
   nop                                     ;[849c] 00
   nop                                     ;[849d] 00
   nop                                     ;[849e] 00
   nop                                     ;[849f] 00
   nop                                     ;[84a0] 00
   nop                                     ;[84a1] 00
   nop                                     ;[84a2] 00
   nop                                     ;[84a3] 00
   nop                                     ;[84a4] 00
   nop                                     ;[84a5] 00
   nop                                     ;[84a6] 00
   nop                                     ;[84a7] 00
   nop                                     ;[84a8] 00
   nop                                     ;[84a9] 00
   nop                                     ;[84aa] 00
   nop                                     ;[84ab] 00
   nop                                     ;[84ac] 00
   nop                                     ;[84ad] 00
   nop                                     ;[84ae] 00
   nop                                     ;[84af] 00
   nop                                     ;[84b0] 00
   nop                                     ;[84b1] 00
   nop                                     ;[84b2] 00
   nop                                     ;[84b3] 00
   nop                                     ;[84b4] 00
   nop                                     ;[84b5] 00
   nop                                     ;[84b6] 00
   nop                                     ;[84b7] 00
   nop                                     ;[84b8] 00
   nop                                     ;[84b9] 00
   nop                                     ;[84ba] 00
   nop                                     ;[84bb] 00
   nop                                     ;[84bc] 00
   nop                                     ;[84bd] 00
   nop                                     ;[84be] 00
   nop                                     ;[84bf] 00
   nop                                     ;[84c0] 00
   nop                                     ;[84c1] 00
   nop                                     ;[84c2] 00
   nop                                     ;[84c3] 00
   nop                                     ;[84c4] 00
   nop                                     ;[84c5] 00
   nop                                     ;[84c6] 00
   nop                                     ;[84c7] 00
   nop                                     ;[84c8] 00
   nop                                     ;[84c9] 00
   nop                                     ;[84ca] 00
   nop                                     ;[84cb] 00
   nop                                     ;[84cc] 00
   nop                                     ;[84cd] 00
   nop                                     ;[84ce] 00
   nop                                     ;[84cf] 00
   nop                                     ;[84d0] 00
   nop                                     ;[84d1] 00
   nop                                     ;[84d2] 00
   nop                                     ;[84d3] 00
   nop                                     ;[84d4] 00
   nop                                     ;[84d5] 00
   nop                                     ;[84d6] 00
   nop                                     ;[84d7] 00
   nop                                     ;[84d8] 00
   nop                                     ;[84d9] 00
   nop                                     ;[84da] 00
   nop                                     ;[84db] 00
   nop                                     ;[84dc] 00
   nop                                     ;[84dd] 00
   nop                                     ;[84de] 00
   nop                                     ;[84df] 00
   nop                                     ;[84e0] 00
   nop                                     ;[84e1] 00
   nop                                     ;[84e2] 00
   nop                                     ;[84e3] 00
   nop                                     ;[84e4] 00
   nop                                     ;[84e5] 00
   nop                                     ;[84e6] 00
   nop                                     ;[84e7] 00
   nop                                     ;[84e8] 00
   nop                                     ;[84e9] 00
   nop                                     ;[84ea] 00
   nop                                     ;[84eb] 00
   nop                                     ;[84ec] 00
   nop                                     ;[84ed] 00
   nop                                     ;[84ee] 00
   nop                                     ;[84ef] 00
   nop                                     ;[84f0] 00
   nop                                     ;[84f1] 00
   nop                                     ;[84f2] 00
   nop                                     ;[84f3] 00
   nop                                     ;[84f4] 00
   nop                                     ;[84f5] 00
   nop                                     ;[84f6] 00
   nop                                     ;[84f7] 00
   nop                                     ;[84f8] 00
   nop                                     ;[84f9] 00
   nop                                     ;[84fa] 00
   nop                                     ;[84fb] 00
   nop                                     ;[84fc] 00
   nop                                     ;[84fd] 00
   nop                                     ;[84fe] 00
   nop                                     ;[84ff] 00
   nop                                     ;[8500] 00
   nop                                     ;[8501] 00
   nop                                     ;[8502] 00
   nop                                     ;[8503] 00
   nop                                     ;[8504] 00
   nop                                     ;[8505] 00
   nop                                     ;[8506] 00
   nop                                     ;[8507] 00
   nop                                     ;[8508] 00
   nop                                     ;[8509] 00
   nop                                     ;[850a] 00
   nop                                     ;[850b] 00
   nop                                     ;[850c] 00
   nop                                     ;[850d] 00
   nop                                     ;[850e] 00
   nop                                     ;[850f] 00
   nop                                     ;[8510] 00
   nop                                     ;[8511] 00
   nop                                     ;[8512] 00
   nop                                     ;[8513] 00
   nop                                     ;[8514] 00
   nop                                     ;[8515] 00
   nop                                     ;[8516] 00
   nop                                     ;[8517] 00
   nop                                     ;[8518] 00
   nop                                     ;[8519] 00
   nop                                     ;[851a] 00
   nop                                     ;[851b] 00
   nop                                     ;[851c] 00
   nop                                     ;[851d] 00
   nop                                     ;[851e] 00
   nop                                     ;[851f] 00
   nop                                     ;[8520] 00
   nop                                     ;[8521] 00
   nop                                     ;[8522] 00
   nop                                     ;[8523] 00
   nop                                     ;[8524] 00
   nop                                     ;[8525] 00
   nop                                     ;[8526] 00
   nop                                     ;[8527] 00
   nop                                     ;[8528] 00
   nop                                     ;[8529] 00
   nop                                     ;[852a] 00
   nop                                     ;[852b] 00
   nop                                     ;[852c] 00
   nop                                     ;[852d] 00
   nop                                     ;[852e] 00
   nop                                     ;[852f] 00
   nop                                     ;[8530] 00
   nop                                     ;[8531] 00
   nop                                     ;[8532] 00
   nop                                     ;[8533] 00
   nop                                     ;[8534] 00
   nop                                     ;[8535] 00
   nop                                     ;[8536] 00
   nop                                     ;[8537] 00
   nop                                     ;[8538] 00
   nop                                     ;[8539] 00
   nop                                     ;[853a] 00
   nop                                     ;[853b] 00
   nop                                     ;[853c] 00
   nop                                     ;[853d] 00
   nop                                     ;[853e] 00
   nop                                     ;[853f] 00
   nop                                     ;[8540] 00
   nop                                     ;[8541] 00
   nop                                     ;[8542] 00
   nop                                     ;[8543] 00
   nop                                     ;[8544] 00
   nop                                     ;[8545] 00
   nop                                     ;[8546] 00
   nop                                     ;[8547] 00
   nop                                     ;[8548] 00
   nop                                     ;[8549] 00
   nop                                     ;[854a] 00
   nop                                     ;[854b] 00
   nop                                     ;[854c] 00
   nop                                     ;[854d] 00
   nop                                     ;[854e] 00
   nop                                     ;[854f] 00
   nop                                     ;[8550] 00
   nop                                     ;[8551] 00
   nop                                     ;[8552] 00
   nop                                     ;[8553] 00
   nop                                     ;[8554] 00
   nop                                     ;[8555] 00
   nop                                     ;[8556] 00
   nop                                     ;[8557] 00
   nop                                     ;[8558] 00
   nop                                     ;[8559] 00
   nop                                     ;[855a] 00
   nop                                     ;[855b] 00
   nop                                     ;[855c] 00
   nop                                     ;[855d] 00
   nop                                     ;[855e] 00
   nop                                     ;[855f] 00
   nop                                     ;[8560] 00
   nop                                     ;[8561] 00
   nop                                     ;[8562] 00
   nop                                     ;[8563] 00
   nop                                     ;[8564] 00
   nop                                     ;[8565] 00
   nop                                     ;[8566] 00
   nop                                     ;[8567] 00
   nop                                     ;[8568] 00
   nop                                     ;[8569] 00
   nop                                     ;[856a] 00
   nop                                     ;[856b] 00
   nop                                     ;[856c] 00
   nop                                     ;[856d] 00
   nop                                     ;[856e] 00
   nop                                     ;[856f] 00
   nop                                     ;[8570] 00
   nop                                     ;[8571] 00
   nop                                     ;[8572] 00
   nop                                     ;[8573] 00
   nop                                     ;[8574] 00
   nop                                     ;[8575] 00
   nop                                     ;[8576] 00
   nop                                     ;[8577] 00
   nop                                     ;[8578] 00
   nop                                     ;[8579] 00
   nop                                     ;[857a] 00
   nop                                     ;[857b] 00
   nop                                     ;[857c] 00
   nop                                     ;[857d] 00
   nop                                     ;[857e] 00
   nop                                     ;[857f] 00
   nop                                     ;[8580] 00
   nop                                     ;[8581] 00
   nop                                     ;[8582] 00
   nop                                     ;[8583] 00
   nop                                     ;[8584] 00
   nop                                     ;[8585] 00
   nop                                     ;[8586] 00
   nop                                     ;[8587] 00
   nop                                     ;[8588] 00
   nop                                     ;[8589] 00
   nop                                     ;[858a] 00
   nop                                     ;[858b] 00
   nop                                     ;[858c] 00
   nop                                     ;[858d] 00
   nop                                     ;[858e] 00
   nop                                     ;[858f] 00
   nop                                     ;[8590] 00
   nop                                     ;[8591] 00
   nop                                     ;[8592] 00
   nop                                     ;[8593] 00
   nop                                     ;[8594] 00
   nop                                     ;[8595] 00
   nop                                     ;[8596] 00
   nop                                     ;[8597] 00
   nop                                     ;[8598] 00
   nop                                     ;[8599] 00
   nop                                     ;[859a] 00
   nop                                     ;[859b] 00
   nop                                     ;[859c] 00
   nop                                     ;[859d] 00
   nop                                     ;[859e] 00
   nop                                     ;[859f] 00
   nop                                     ;[85a0] 00
   nop                                     ;[85a1] 00
   nop                                     ;[85a2] 00
   nop                                     ;[85a3] 00
   nop                                     ;[85a4] 00
   nop                                     ;[85a5] 00
   nop                                     ;[85a6] 00
   nop                                     ;[85a7] 00
   nop                                     ;[85a8] 00
   nop                                     ;[85a9] 00
   nop                                     ;[85aa] 00
   nop                                     ;[85ab] 00
   nop                                     ;[85ac] 00
   nop                                     ;[85ad] 00
   nop                                     ;[85ae] 00
   nop                                     ;[85af] 00
   nop                                     ;[85b0] 00
   nop                                     ;[85b1] 00
   nop                                     ;[85b2] 00
   nop                                     ;[85b3] 00
   nop                                     ;[85b4] 00
   nop                                     ;[85b5] 00
   nop                                     ;[85b6] 00
   nop                                     ;[85b7] 00
   nop                                     ;[85b8] 00
   nop                                     ;[85b9] 00
   nop                                     ;[85ba] 00
   nop                                     ;[85bb] 00
   nop                                     ;[85bc] 00
   nop                                     ;[85bd] 00
   nop                                     ;[85be] 00
   nop                                     ;[85bf] 00
   nop                                     ;[85c0] 00
   nop                                     ;[85c1] 00
   nop                                     ;[85c2] 00
   nop                                     ;[85c3] 00
   nop                                     ;[85c4] 00
   nop                                     ;[85c5] 00
   nop                                     ;[85c6] 00
   nop                                     ;[85c7] 00
   nop                                     ;[85c8] 00
   nop                                     ;[85c9] 00
   nop                                     ;[85ca] 00
   nop                                     ;[85cb] 00
   nop                                     ;[85cc] 00
   nop                                     ;[85cd] 00
   nop                                     ;[85ce] 00
   nop                                     ;[85cf] 00
   nop                                     ;[85d0] 00
   nop                                     ;[85d1] 00
   nop                                     ;[85d2] 00
   nop                                     ;[85d3] 00
   nop                                     ;[85d4] 00
   nop                                     ;[85d5] 00
   nop                                     ;[85d6] 00
   nop                                     ;[85d7] 00
   nop                                     ;[85d8] 00
   nop                                     ;[85d9] 00
   nop                                     ;[85da] 00
   nop                                     ;[85db] 00
   nop                                     ;[85dc] 00
   nop                                     ;[85dd] 00
   nop                                     ;[85de] 00
   nop                                     ;[85df] 00
   nop                                     ;[85e0] 00
   nop                                     ;[85e1] 00
   nop                                     ;[85e2] 00
   nop                                     ;[85e3] 00
   nop                                     ;[85e4] 00
   nop                                     ;[85e5] 00
   nop                                     ;[85e6] 00
   nop                                     ;[85e7] 00
   nop                                     ;[85e8] 00
   nop                                     ;[85e9] 00
   nop                                     ;[85ea] 00
   nop                                     ;[85eb] 00
   nop                                     ;[85ec] 00
   nop                                     ;[85ed] 00
   nop                                     ;[85ee] 00
   nop                                     ;[85ef] 00
   nop                                     ;[85f0] 00
   nop                                     ;[85f1] 00
   nop                                     ;[85f2] 00
   nop                                     ;[85f3] 00
   nop                                     ;[85f4] 00
   nop                                     ;[85f5] 00
   nop                                     ;[85f6] 00
   nop                                     ;[85f7] 00
   nop                                     ;[85f8] 00
   nop                                     ;[85f9] 00
   nop                                     ;[85fa] 00
   nop                                     ;[85fb] 00
   nop                                     ;[85fc] 00
   nop                                     ;[85fd] 00
   nop                                     ;[85fe] 00
   nop                                     ;[85ff] 00
   nop                                     ;[8600] 00
   nop                                     ;[8601] 00
   nop                                     ;[8602] 00
   nop                                     ;[8603] 00
   nop                                     ;[8604] 00
   nop                                     ;[8605] 00
   nop                                     ;[8606] 00
   nop                                     ;[8607] 00
   nop                                     ;[8608] 00
   nop                                     ;[8609] 00
   nop                                     ;[860a] 00
   nop                                     ;[860b] 00
   nop                                     ;[860c] 00
   nop                                     ;[860d] 00
   nop                                     ;[860e] 00
   nop                                     ;[860f] 00
   nop                                     ;[8610] 00
   nop                                     ;[8611] 00
   nop                                     ;[8612] 00
   nop                                     ;[8613] 00
   nop                                     ;[8614] 00
   nop                                     ;[8615] 00
   nop                                     ;[8616] 00
   nop                                     ;[8617] 00
   nop                                     ;[8618] 00
   nop                                     ;[8619] 00
   nop                                     ;[861a] 00
   nop                                     ;[861b] 00
   nop                                     ;[861c] 00
   nop                                     ;[861d] 00
   nop                                     ;[861e] 00
   nop                                     ;[861f] 00
   nop                                     ;[8620] 00
   nop                                     ;[8621] 00
   nop                                     ;[8622] 00
   nop                                     ;[8623] 00
   nop                                     ;[8624] 00
   nop                                     ;[8625] 00
   nop                                     ;[8626] 00
   nop                                     ;[8627] 00
   nop                                     ;[8628] 00
   nop                                     ;[8629] 00
   nop                                     ;[862a] 00
   nop                                     ;[862b] 00
   nop                                     ;[862c] 00
   nop                                     ;[862d] 00
   nop                                     ;[862e] 00
   nop                                     ;[862f] 00
   nop                                     ;[8630] 00
   nop                                     ;[8631] 00
   nop                                     ;[8632] 00
   nop                                     ;[8633] 00
   nop                                     ;[8634] 00
   nop                                     ;[8635] 00
   nop                                     ;[8636] 00
   nop                                     ;[8637] 00
   nop                                     ;[8638] 00
   nop                                     ;[8639] 00
   nop                                     ;[863a] 00
   nop                                     ;[863b] 00
   nop                                     ;[863c] 00
   nop                                     ;[863d] 00
   nop                                     ;[863e] 00
   nop                                     ;[863f] 00
   nop                                     ;[8640] 00
   nop                                     ;[8641] 00
   nop                                     ;[8642] 00
   nop                                     ;[8643] 00
   nop                                     ;[8644] 00
   nop                                     ;[8645] 00
   nop                                     ;[8646] 00
   nop                                     ;[8647] 00
   nop                                     ;[8648] 00
   nop                                     ;[8649] 00
   nop                                     ;[864a] 00
   nop                                     ;[864b] 00
   nop                                     ;[864c] 00
   nop                                     ;[864d] 00
   nop                                     ;[864e] 00
   nop                                     ;[864f] 00
   nop                                     ;[8650] 00
   nop                                     ;[8651] 00
   nop                                     ;[8652] 00
   nop                                     ;[8653] 00
   nop                                     ;[8654] 00
   nop                                     ;[8655] 00
   nop                                     ;[8656] 00
   nop                                     ;[8657] 00
   nop                                     ;[8658] 00
   nop                                     ;[8659] 00
   nop                                     ;[865a] 00
   nop                                     ;[865b] 00
   nop                                     ;[865c] 00
   nop                                     ;[865d] 00
   nop                                     ;[865e] 00
   nop                                     ;[865f] 00
   nop                                     ;[8660] 00
   nop                                     ;[8661] 00
   nop                                     ;[8662] 00
   nop                                     ;[8663] 00
   nop                                     ;[8664] 00
   nop                                     ;[8665] 00
   nop                                     ;[8666] 00
   nop                                     ;[8667] 00
   nop                                     ;[8668] 00
   nop                                     ;[8669] 00
   nop                                     ;[866a] 00
   nop                                     ;[866b] 00
   nop                                     ;[866c] 00
   nop                                     ;[866d] 00
   nop                                     ;[866e] 00
   nop                                     ;[866f] 00
   nop                                     ;[8670] 00
   nop                                     ;[8671] 00
   nop                                     ;[8672] 00
   nop                                     ;[8673] 00
   nop                                     ;[8674] 00
   nop                                     ;[8675] 00
   nop                                     ;[8676] 00
   nop                                     ;[8677] 00
   nop                                     ;[8678] 00
   nop                                     ;[8679] 00
   nop                                     ;[867a] 00
   nop                                     ;[867b] 00
   nop                                     ;[867c] 00
   nop                                     ;[867d] 00
   nop                                     ;[867e] 00
   nop                                     ;[867f] 00
   nop                                     ;[8680] 00
   nop                                     ;[8681] 00
   nop                                     ;[8682] 00
   nop                                     ;[8683] 00
   nop                                     ;[8684] 00
   nop                                     ;[8685] 00
   nop                                     ;[8686] 00
   nop                                     ;[8687] 00
   nop                                     ;[8688] 00
   nop                                     ;[8689] 00
   nop                                     ;[868a] 00
   nop                                     ;[868b] 00
   nop                                     ;[868c] 00
   nop                                     ;[868d] 00
   nop                                     ;[868e] 00
   nop                                     ;[868f] 00
   nop                                     ;[8690] 00
   nop                                     ;[8691] 00
   nop                                     ;[8692] 00
   nop                                     ;[8693] 00
   nop                                     ;[8694] 00
   nop                                     ;[8695] 00
   nop                                     ;[8696] 00
   nop                                     ;[8697] 00
   nop                                     ;[8698] 00
   nop                                     ;[8699] 00
   nop                                     ;[869a] 00
   nop                                     ;[869b] 00
   nop                                     ;[869c] 00
   nop                                     ;[869d] 00
   nop                                     ;[869e] 00
   nop                                     ;[869f] 00
   nop                                     ;[86a0] 00
   nop                                     ;[86a1] 00
   nop                                     ;[86a2] 00
   nop                                     ;[86a3] 00
   nop                                     ;[86a4] 00
   nop                                     ;[86a5] 00
   nop                                     ;[86a6] 00
   nop                                     ;[86a7] 00
   nop                                     ;[86a8] 00
   nop                                     ;[86a9] 00
   nop                                     ;[86aa] 00
   nop                                     ;[86ab] 00
   nop                                     ;[86ac] 00
   nop                                     ;[86ad] 00
   nop                                     ;[86ae] 00
   nop                                     ;[86af] 00
   nop                                     ;[86b0] 00
   nop                                     ;[86b1] 00
   nop                                     ;[86b2] 00
   nop                                     ;[86b3] 00
   nop                                     ;[86b4] 00
   nop                                     ;[86b5] 00
   nop                                     ;[86b6] 00
   nop                                     ;[86b7] 00
   nop                                     ;[86b8] 00
   nop                                     ;[86b9] 00
   nop                                     ;[86ba] 00
   nop                                     ;[86bb] 00
   nop                                     ;[86bc] 00
   nop                                     ;[86bd] 00
   nop                                     ;[86be] 00
   nop                                     ;[86bf] 00
   nop                                     ;[86c0] 00
   nop                                     ;[86c1] 00
   nop                                     ;[86c2] 00
   nop                                     ;[86c3] 00
   nop                                     ;[86c4] 00
   nop                                     ;[86c5] 00
   nop                                     ;[86c6] 00
   nop                                     ;[86c7] 00
   nop                                     ;[86c8] 00
   nop                                     ;[86c9] 00
   nop                                     ;[86ca] 00
   nop                                     ;[86cb] 00
   nop                                     ;[86cc] 00
   nop                                     ;[86cd] 00
   nop                                     ;[86ce] 00
   nop                                     ;[86cf] 00
   nop                                     ;[86d0] 00
   nop                                     ;[86d1] 00
   nop                                     ;[86d2] 00
   nop                                     ;[86d3] 00
   nop                                     ;[86d4] 00
   nop                                     ;[86d5] 00
   nop                                     ;[86d6] 00
   nop                                     ;[86d7] 00
   nop                                     ;[86d8] 00
   nop                                     ;[86d9] 00
   nop                                     ;[86da] 00
   nop                                     ;[86db] 00
   nop                                     ;[86dc] 00
   nop                                     ;[86dd] 00
   nop                                     ;[86de] 00
   nop                                     ;[86df] 00
   nop                                     ;[86e0] 00
   nop                                     ;[86e1] 00
   nop                                     ;[86e2] 00
   nop                                     ;[86e3] 00
   nop                                     ;[86e4] 00
   nop                                     ;[86e5] 00
   nop                                     ;[86e6] 00
   nop                                     ;[86e7] 00
   nop                                     ;[86e8] 00
   nop                                     ;[86e9] 00
   nop                                     ;[86ea] 00
   nop                                     ;[86eb] 00
   nop                                     ;[86ec] 00
   nop                                     ;[86ed] 00
   nop                                     ;[86ee] 00
   nop                                     ;[86ef] 00
   nop                                     ;[86f0] 00
   nop                                     ;[86f1] 00
   nop                                     ;[86f2] 00
   nop                                     ;[86f3] 00
   nop                                     ;[86f4] 00
   nop                                     ;[86f5] 00
   nop                                     ;[86f6] 00
   nop                                     ;[86f7] 00
   nop                                     ;[86f8] 00
   nop                                     ;[86f9] 00
   nop                                     ;[86fa] 00
   nop                                     ;[86fb] 00
   nop                                     ;[86fc] 00
   nop                                     ;[86fd] 00
   nop                                     ;[86fe] 00
   nop                                     ;[86ff] 00
   nop                                     ;[8700] 00
   nop                                     ;[8701] 00
   nop                                     ;[8702] 00
   nop                                     ;[8703] 00
   nop                                     ;[8704] 00
   nop                                     ;[8705] 00
   nop                                     ;[8706] 00
   nop                                     ;[8707] 00
   nop                                     ;[8708] 00
   nop                                     ;[8709] 00
   nop                                     ;[870a] 00
   nop                                     ;[870b] 00
   nop                                     ;[870c] 00
   nop                                     ;[870d] 00
   nop                                     ;[870e] 00
   nop                                     ;[870f] 00
   nop                                     ;[8710] 00
   nop                                     ;[8711] 00
   nop                                     ;[8712] 00
   nop                                     ;[8713] 00
   nop                                     ;[8714] 00
   nop                                     ;[8715] 00
   nop                                     ;[8716] 00
   nop                                     ;[8717] 00
   nop                                     ;[8718] 00
   nop                                     ;[8719] 00
   nop                                     ;[871a] 00
   nop                                     ;[871b] 00
   nop                                     ;[871c] 00
   nop                                     ;[871d] 00
   nop                                     ;[871e] 00
   nop                                     ;[871f] 00
   nop                                     ;[8720] 00
   nop                                     ;[8721] 00
   nop                                     ;[8722] 00
   nop                                     ;[8723] 00
   nop                                     ;[8724] 00
   nop                                     ;[8725] 00
   nop                                     ;[8726] 00
   nop                                     ;[8727] 00
   nop                                     ;[8728] 00
   nop                                     ;[8729] 00
   nop                                     ;[872a] 00
   nop                                     ;[872b] 00
   nop                                     ;[872c] 00
   nop                                     ;[872d] 00
   nop                                     ;[872e] 00
   nop                                     ;[872f] 00
   nop                                     ;[8730] 00
   nop                                     ;[8731] 00
   nop                                     ;[8732] 00
   nop                                     ;[8733] 00
   nop                                     ;[8734] 00
   nop                                     ;[8735] 00
   nop                                     ;[8736] 00
   nop                                     ;[8737] 00
   nop                                     ;[8738] 00
   nop                                     ;[8739] 00
   nop                                     ;[873a] 00
   nop                                     ;[873b] 00
   nop                                     ;[873c] 00
   nop                                     ;[873d] 00
   nop                                     ;[873e] 00
   nop                                     ;[873f] 00
   nop                                     ;[8740] 00
   nop                                     ;[8741] 00
   nop                                     ;[8742] 00
   nop                                     ;[8743] 00
   nop                                     ;[8744] 00
   nop                                     ;[8745] 00
   nop                                     ;[8746] 00
   nop                                     ;[8747] 00
   nop                                     ;[8748] 00
   nop                                     ;[8749] 00
   nop                                     ;[874a] 00
   nop                                     ;[874b] 00
   nop                                     ;[874c] 00
   nop                                     ;[874d] 00
   nop                                     ;[874e] 00
   nop                                     ;[874f] 00
   nop                                     ;[8750] 00
   nop                                     ;[8751] 00
   nop                                     ;[8752] 00
   nop                                     ;[8753] 00
   nop                                     ;[8754] 00
   nop                                     ;[8755] 00
   nop                                     ;[8756] 00
   nop                                     ;[8757] 00
   nop                                     ;[8758] 00
   nop                                     ;[8759] 00
   nop                                     ;[875a] 00
   nop                                     ;[875b] 00
   nop                                     ;[875c] 00
   nop                                     ;[875d] 00
   nop                                     ;[875e] 00
   nop                                     ;[875f] 00
   nop                                     ;[8760] 00
   nop                                     ;[8761] 00
   nop                                     ;[8762] 00
   nop                                     ;[8763] 00
   nop                                     ;[8764] 00
   nop                                     ;[8765] 00
   nop                                     ;[8766] 00
   nop                                     ;[8767] 00
   nop                                     ;[8768] 00
   nop                                     ;[8769] 00
   nop                                     ;[876a] 00
   nop                                     ;[876b] 00
   nop                                     ;[876c] 00
   nop                                     ;[876d] 00
   nop                                     ;[876e] 00
   nop                                     ;[876f] 00
   nop                                     ;[8770] 00
   nop                                     ;[8771] 00
   nop                                     ;[8772] 00
   nop                                     ;[8773] 00
   nop                                     ;[8774] 00
   nop                                     ;[8775] 00
   nop                                     ;[8776] 00
   nop                                     ;[8777] 00
   nop                                     ;[8778] 00
   nop                                     ;[8779] 00
   nop                                     ;[877a] 00
   nop                                     ;[877b] 00
   nop                                     ;[877c] 00
   nop                                     ;[877d] 00
   nop                                     ;[877e] 00
   nop                                     ;[877f] 00
   nop                                     ;[8780] 00
   nop                                     ;[8781] 00
   nop                                     ;[8782] 00
   nop                                     ;[8783] 00
   nop                                     ;[8784] 00
   nop                                     ;[8785] 00
   nop                                     ;[8786] 00
   nop                                     ;[8787] 00
   nop                                     ;[8788] 00
   nop                                     ;[8789] 00
   nop                                     ;[878a] 00
   nop                                     ;[878b] 00
   nop                                     ;[878c] 00
   nop                                     ;[878d] 00
   nop                                     ;[878e] 00
   nop                                     ;[878f] 00
   nop                                     ;[8790] 00
   nop                                     ;[8791] 00
   nop                                     ;[8792] 00
   nop                                     ;[8793] 00
   nop                                     ;[8794] 00
   nop                                     ;[8795] 00
   nop                                     ;[8796] 00
   nop                                     ;[8797] 00
   nop                                     ;[8798] 00
   nop                                     ;[8799] 00
   nop                                     ;[879a] 00
   nop                                     ;[879b] 00
   nop                                     ;[879c] 00
   nop                                     ;[879d] 00
   nop                                     ;[879e] 00
   nop                                     ;[879f] 00
   nop                                     ;[87a0] 00
   nop                                     ;[87a1] 00
   nop                                     ;[87a2] 00
   nop                                     ;[87a3] 00
   nop                                     ;[87a4] 00
   nop                                     ;[87a5] 00
   nop                                     ;[87a6] 00
   nop                                     ;[87a7] 00
   nop                                     ;[87a8] 00
   nop                                     ;[87a9] 00
   nop                                     ;[87aa] 00
   nop                                     ;[87ab] 00
   nop                                     ;[87ac] 00
   nop                                     ;[87ad] 00
   nop                                     ;[87ae] 00
   nop                                     ;[87af] 00
   nop                                     ;[87b0] 00
   nop                                     ;[87b1] 00
   nop                                     ;[87b2] 00
   nop                                     ;[87b3] 00
   nop                                     ;[87b4] 00
   nop                                     ;[87b5] 00
   nop                                     ;[87b6] 00
   nop                                     ;[87b7] 00
   nop                                     ;[87b8] 00
   nop                                     ;[87b9] 00
   nop                                     ;[87ba] 00
   nop                                     ;[87bb] 00
   nop                                     ;[87bc] 00
   nop                                     ;[87bd] 00
   nop                                     ;[87be] 00
   nop                                     ;[87bf] 00
   nop                                     ;[87c0] 00
   nop                                     ;[87c1] 00
   nop                                     ;[87c2] 00
   nop                                     ;[87c3] 00
   nop                                     ;[87c4] 00
   nop                                     ;[87c5] 00
   nop                                     ;[87c6] 00
   nop                                     ;[87c7] 00
   nop                                     ;[87c8] 00
   nop                                     ;[87c9] 00
   nop                                     ;[87ca] 00
   nop                                     ;[87cb] 00
   nop                                     ;[87cc] 00
   nop                                     ;[87cd] 00
   nop                                     ;[87ce] 00
   nop                                     ;[87cf] 00
   nop                                     ;[87d0] 00
   nop                                     ;[87d1] 00
   nop                                     ;[87d2] 00
   nop                                     ;[87d3] 00
   nop                                     ;[87d4] 00
   nop                                     ;[87d5] 00
   nop                                     ;[87d6] 00
   nop                                     ;[87d7] 00
   nop                                     ;[87d8] 00
   nop                                     ;[87d9] 00
   nop                                     ;[87da] 00
   nop                                     ;[87db] 00
   nop                                     ;[87dc] 00
   nop                                     ;[87dd] 00
   nop                                     ;[87de] 00
   nop                                     ;[87df] 00
   nop                                     ;[87e0] 00
   nop                                     ;[87e1] 00
   nop                                     ;[87e2] 00
   nop                                     ;[87e3] 00
   nop                                     ;[87e4] 00
   nop                                     ;[87e5] 00
   nop                                     ;[87e6] 00
   nop                                     ;[87e7] 00
   nop                                     ;[87e8] 00
   nop                                     ;[87e9] 00
   nop                                     ;[87ea] 00
   nop                                     ;[87eb] 00
   nop                                     ;[87ec] 00
   nop                                     ;[87ed] 00
   nop                                     ;[87ee] 00
   nop                                     ;[87ef] 00
   nop                                     ;[87f0] 00
   nop                                     ;[87f1] 00
   nop                                     ;[87f2] 00
   nop                                     ;[87f3] 00
   nop                                     ;[87f4] 00
   nop                                     ;[87f5] 00
   nop                                     ;[87f6] 00
   nop                                     ;[87f7] 00
   nop                                     ;[87f8] 00
   nop                                     ;[87f9] 00
   nop                                     ;[87fa] 00
   nop                                     ;[87fb] 00
   nop                                     ;[87fc] 00
   nop                                     ;[87fd] 00
   nop                                     ;[87fe] 00
   nop                                     ;[87ff] 00
   nop                                     ;[8800] 00
   nop                                     ;[8801] 00
   nop                                     ;[8802] 00
   nop                                     ;[8803] 00
   nop                                     ;[8804] 00
   nop                                     ;[8805] 00
   nop                                     ;[8806] 00
   nop                                     ;[8807] 00
   nop                                     ;[8808] 00
   nop                                     ;[8809] 00
   nop                                     ;[880a] 00
   nop                                     ;[880b] 00
   nop                                     ;[880c] 00
   nop                                     ;[880d] 00
   nop                                     ;[880e] 00
   nop                                     ;[880f] 00
   nop                                     ;[8810] 00
   nop                                     ;[8811] 00
   nop                                     ;[8812] 00
   nop                                     ;[8813] 00
   nop                                     ;[8814] 00
   nop                                     ;[8815] 00
   nop                                     ;[8816] 00
   nop                                     ;[8817] 00
   nop                                     ;[8818] 00
   nop                                     ;[8819] 00
   nop                                     ;[881a] 00
   nop                                     ;[881b] 00
   nop                                     ;[881c] 00
   nop                                     ;[881d] 00
   nop                                     ;[881e] 00
   nop                                     ;[881f] 00
   nop                                     ;[8820] 00
   nop                                     ;[8821] 00
   nop                                     ;[8822] 00
   nop                                     ;[8823] 00
   nop                                     ;[8824] 00
   nop                                     ;[8825] 00
   nop                                     ;[8826] 00
   nop                                     ;[8827] 00
   nop                                     ;[8828] 00
   nop                                     ;[8829] 00
   nop                                     ;[882a] 00
   nop                                     ;[882b] 00
   nop                                     ;[882c] 00
   nop                                     ;[882d] 00
   nop                                     ;[882e] 00
   nop                                     ;[882f] 00
   nop                                     ;[8830] 00
   nop                                     ;[8831] 00
   nop                                     ;[8832] 00
   nop                                     ;[8833] 00
   nop                                     ;[8834] 00
   nop                                     ;[8835] 00
   nop                                     ;[8836] 00
   nop                                     ;[8837] 00
   nop                                     ;[8838] 00
   nop                                     ;[8839] 00
   nop                                     ;[883a] 00
   nop                                     ;[883b] 00
   nop                                     ;[883c] 00
   nop                                     ;[883d] 00
   nop                                     ;[883e] 00
   nop                                     ;[883f] 00
   nop                                     ;[8840] 00
   nop                                     ;[8841] 00
   nop                                     ;[8842] 00
   nop                                     ;[8843] 00
   nop                                     ;[8844] 00
   nop                                     ;[8845] 00
   nop                                     ;[8846] 00
   nop                                     ;[8847] 00
   nop                                     ;[8848] 00
   nop                                     ;[8849] 00
   nop                                     ;[884a] 00
   nop                                     ;[884b] 00
   nop                                     ;[884c] 00
   nop                                     ;[884d] 00
   nop                                     ;[884e] 00
   nop                                     ;[884f] 00
   nop                                     ;[8850] 00
   nop                                     ;[8851] 00
   nop                                     ;[8852] 00
   nop                                     ;[8853] 00
   nop                                     ;[8854] 00
   nop                                     ;[8855] 00
   nop                                     ;[8856] 00
   nop                                     ;[8857] 00
   nop                                     ;[8858] 00
   nop                                     ;[8859] 00
   nop                                     ;[885a] 00
   nop                                     ;[885b] 00
   nop                                     ;[885c] 00
   nop                                     ;[885d] 00
   nop                                     ;[885e] 00
   nop                                     ;[885f] 00
   nop                                     ;[8860] 00
   nop                                     ;[8861] 00
   nop                                     ;[8862] 00
   nop                                     ;[8863] 00
   nop                                     ;[8864] 00
   nop                                     ;[8865] 00
   nop                                     ;[8866] 00
   nop                                     ;[8867] 00
   nop                                     ;[8868] 00
   nop                                     ;[8869] 00
   nop                                     ;[886a] 00
   nop                                     ;[886b] 00
   nop                                     ;[886c] 00
   nop                                     ;[886d] 00
   nop                                     ;[886e] 00
   nop                                     ;[886f] 00
   nop                                     ;[8870] 00
   nop                                     ;[8871] 00
   nop                                     ;[8872] 00
   nop                                     ;[8873] 00
   nop                                     ;[8874] 00
   nop                                     ;[8875] 00
   nop                                     ;[8876] 00
   nop                                     ;[8877] 00
   nop                                     ;[8878] 00
   nop                                     ;[8879] 00
   nop                                     ;[887a] 00
   nop                                     ;[887b] 00
   nop                                     ;[887c] 00
   nop                                     ;[887d] 00
   nop                                     ;[887e] 00
   nop                                     ;[887f] 00
   nop                                     ;[8880] 00
   nop                                     ;[8881] 00
   nop                                     ;[8882] 00
   nop                                     ;[8883] 00
   nop                                     ;[8884] 00
   nop                                     ;[8885] 00
   nop                                     ;[8886] 00
   nop                                     ;[8887] 00
   nop                                     ;[8888] 00
   nop                                     ;[8889] 00
   nop                                     ;[888a] 00
   nop                                     ;[888b] 00
   nop                                     ;[888c] 00
   nop                                     ;[888d] 00
   nop                                     ;[888e] 00
   nop                                     ;[888f] 00
   nop                                     ;[8890] 00
   nop                                     ;[8891] 00
   nop                                     ;[8892] 00
   nop                                     ;[8893] 00
   nop                                     ;[8894] 00
   nop                                     ;[8895] 00
   nop                                     ;[8896] 00
   nop                                     ;[8897] 00
   nop                                     ;[8898] 00
   nop                                     ;[8899] 00
   nop                                     ;[889a] 00
   nop                                     ;[889b] 00
   nop                                     ;[889c] 00
   nop                                     ;[889d] 00
   nop                                     ;[889e] 00
   nop                                     ;[889f] 00
   nop                                     ;[88a0] 00
   nop                                     ;[88a1] 00
   nop                                     ;[88a2] 00
   nop                                     ;[88a3] 00
   nop                                     ;[88a4] 00
   nop                                     ;[88a5] 00
   nop                                     ;[88a6] 00
   nop                                     ;[88a7] 00
   nop                                     ;[88a8] 00
   nop                                     ;[88a9] 00
   nop                                     ;[88aa] 00
   nop                                     ;[88ab] 00
   nop                                     ;[88ac] 00
   nop                                     ;[88ad] 00
   nop                                     ;[88ae] 00
   nop                                     ;[88af] 00
   nop                                     ;[88b0] 00
   nop                                     ;[88b1] 00
   nop                                     ;[88b2] 00
   nop                                     ;[88b3] 00
   nop                                     ;[88b4] 00
   nop                                     ;[88b5] 00
   nop                                     ;[88b6] 00
   nop                                     ;[88b7] 00
   nop                                     ;[88b8] 00
   nop                                     ;[88b9] 00
   nop                                     ;[88ba] 00
   nop                                     ;[88bb] 00
   nop                                     ;[88bc] 00
   nop                                     ;[88bd] 00
   nop                                     ;[88be] 00
   nop                                     ;[88bf] 00
   nop                                     ;[88c0] 00
   nop                                     ;[88c1] 00
   nop                                     ;[88c2] 00
   nop                                     ;[88c3] 00
   nop                                     ;[88c4] 00
   nop                                     ;[88c5] 00
   nop                                     ;[88c6] 00
   nop                                     ;[88c7] 00
   nop                                     ;[88c8] 00
   nop                                     ;[88c9] 00
   nop                                     ;[88ca] 00
   nop                                     ;[88cb] 00
   nop                                     ;[88cc] 00
   nop                                     ;[88cd] 00
   nop                                     ;[88ce] 00
   nop                                     ;[88cf] 00
   nop                                     ;[88d0] 00
   nop                                     ;[88d1] 00
   nop                                     ;[88d2] 00
   nop                                     ;[88d3] 00
   nop                                     ;[88d4] 00
   nop                                     ;[88d5] 00
   nop                                     ;[88d6] 00
   nop                                     ;[88d7] 00
   nop                                     ;[88d8] 00
   nop                                     ;[88d9] 00
   nop                                     ;[88da] 00
   nop                                     ;[88db] 00
   nop                                     ;[88dc] 00
   nop                                     ;[88dd] 00
   nop                                     ;[88de] 00
   nop                                     ;[88df] 00
   nop                                     ;[88e0] 00
   nop                                     ;[88e1] 00
   nop                                     ;[88e2] 00
   nop                                     ;[88e3] 00
   nop                                     ;[88e4] 00
   nop                                     ;[88e5] 00
   nop                                     ;[88e6] 00
   nop                                     ;[88e7] 00
   nop                                     ;[88e8] 00
   nop                                     ;[88e9] 00
   nop                                     ;[88ea] 00
   nop                                     ;[88eb] 00
   nop                                     ;[88ec] 00
   nop                                     ;[88ed] 00
   nop                                     ;[88ee] 00
   nop                                     ;[88ef] 00
   nop                                     ;[88f0] 00
   nop                                     ;[88f1] 00
   nop                                     ;[88f2] 00
   nop                                     ;[88f3] 00
   nop                                     ;[88f4] 00
   nop                                     ;[88f5] 00
   nop                                     ;[88f6] 00
   nop                                     ;[88f7] 00
   nop                                     ;[88f8] 00
   nop                                     ;[88f9] 00
   nop                                     ;[88fa] 00
   nop                                     ;[88fb] 00
   nop                                     ;[88fc] 00
   nop                                     ;[88fd] 00
   nop                                     ;[88fe] 00
   nop                                     ;[88ff] 00
   nop                                     ;[8900] 00
   nop                                     ;[8901] 00
   nop                                     ;[8902] 00
   nop                                     ;[8903] 00
   nop                                     ;[8904] 00
   nop                                     ;[8905] 00
   nop                                     ;[8906] 00
   nop                                     ;[8907] 00
   nop                                     ;[8908] 00
   nop                                     ;[8909] 00
   nop                                     ;[890a] 00
   nop                                     ;[890b] 00
   nop                                     ;[890c] 00
   nop                                     ;[890d] 00
   nop                                     ;[890e] 00
   nop                                     ;[890f] 00
   nop                                     ;[8910] 00
   nop                                     ;[8911] 00
   nop                                     ;[8912] 00
   nop                                     ;[8913] 00
   nop                                     ;[8914] 00
   nop                                     ;[8915] 00
   nop                                     ;[8916] 00
   nop                                     ;[8917] 00
   nop                                     ;[8918] 00
   nop                                     ;[8919] 00
   nop                                     ;[891a] 00
   nop                                     ;[891b] 00
   nop                                     ;[891c] 00
   nop                                     ;[891d] 00
   nop                                     ;[891e] 00
   nop                                     ;[891f] 00
   nop                                     ;[8920] 00
   nop                                     ;[8921] 00
   nop                                     ;[8922] 00
   nop                                     ;[8923] 00
   nop                                     ;[8924] 00
   nop                                     ;[8925] 00
   nop                                     ;[8926] 00
   nop                                     ;[8927] 00
   nop                                     ;[8928] 00
   nop                                     ;[8929] 00
   nop                                     ;[892a] 00
   nop                                     ;[892b] 00
   nop                                     ;[892c] 00
   nop                                     ;[892d] 00
   nop                                     ;[892e] 00
   nop                                     ;[892f] 00
   nop                                     ;[8930] 00
   nop                                     ;[8931] 00
   nop                                     ;[8932] 00
   nop                                     ;[8933] 00
   nop                                     ;[8934] 00
   nop                                     ;[8935] 00
   nop                                     ;[8936] 00
   nop                                     ;[8937] 00
   nop                                     ;[8938] 00
   nop                                     ;[8939] 00
   nop                                     ;[893a] 00
   nop                                     ;[893b] 00
   nop                                     ;[893c] 00
   nop                                     ;[893d] 00
   nop                                     ;[893e] 00
   nop                                     ;[893f] 00
   nop                                     ;[8940] 00
   nop                                     ;[8941] 00
   nop                                     ;[8942] 00
   nop                                     ;[8943] 00
   nop                                     ;[8944] 00
   nop                                     ;[8945] 00
   nop                                     ;[8946] 00
   nop                                     ;[8947] 00
   nop                                     ;[8948] 00
   nop                                     ;[8949] 00
   nop                                     ;[894a] 00
   nop                                     ;[894b] 00
   nop                                     ;[894c] 00
   nop                                     ;[894d] 00
   nop                                     ;[894e] 00
   nop                                     ;[894f] 00
   nop                                     ;[8950] 00
   nop                                     ;[8951] 00
   nop                                     ;[8952] 00
   nop                                     ;[8953] 00
   nop                                     ;[8954] 00
   nop                                     ;[8955] 00
   nop                                     ;[8956] 00
   nop                                     ;[8957] 00
   nop                                     ;[8958] 00
   nop                                     ;[8959] 00
   nop                                     ;[895a] 00
   nop                                     ;[895b] 00
   nop                                     ;[895c] 00
   nop                                     ;[895d] 00
   nop                                     ;[895e] 00
   nop                                     ;[895f] 00
   nop                                     ;[8960] 00
   nop                                     ;[8961] 00
   nop                                     ;[8962] 00
   nop                                     ;[8963] 00
   nop                                     ;[8964] 00
   nop                                     ;[8965] 00
   nop                                     ;[8966] 00
   nop                                     ;[8967] 00
   nop                                     ;[8968] 00
   nop                                     ;[8969] 00
   nop                                     ;[896a] 00
   nop                                     ;[896b] 00
   nop                                     ;[896c] 00
   nop                                     ;[896d] 00
   nop                                     ;[896e] 00
   nop                                     ;[896f] 00
   nop                                     ;[8970] 00
   nop                                     ;[8971] 00
   nop                                     ;[8972] 00
   nop                                     ;[8973] 00
   nop                                     ;[8974] 00
   nop                                     ;[8975] 00
   nop                                     ;[8976] 00
   nop                                     ;[8977] 00
   nop                                     ;[8978] 00
   nop                                     ;[8979] 00
   nop                                     ;[897a] 00
   nop                                     ;[897b] 00
   nop                                     ;[897c] 00
   nop                                     ;[897d] 00
   nop                                     ;[897e] 00
   nop                                     ;[897f] 00
   nop                                     ;[8980] 00
   nop                                     ;[8981] 00
   nop                                     ;[8982] 00
   nop                                     ;[8983] 00
   nop                                     ;[8984] 00
   nop                                     ;[8985] 00
   nop                                     ;[8986] 00
   nop                                     ;[8987] 00
   nop                                     ;[8988] 00
   nop                                     ;[8989] 00
   nop                                     ;[898a] 00
   nop                                     ;[898b] 00
   nop                                     ;[898c] 00
   nop                                     ;[898d] 00
   nop                                     ;[898e] 00
   nop                                     ;[898f] 00
   nop                                     ;[8990] 00
   nop                                     ;[8991] 00
   nop                                     ;[8992] 00
   nop                                     ;[8993] 00
   nop                                     ;[8994] 00
   nop                                     ;[8995] 00
   nop                                     ;[8996] 00
   nop                                     ;[8997] 00
   nop                                     ;[8998] 00
   nop                                     ;[8999] 00
   nop                                     ;[899a] 00
   nop                                     ;[899b] 00
   nop                                     ;[899c] 00
   nop                                     ;[899d] 00
   nop                                     ;[899e] 00
   nop                                     ;[899f] 00
   nop                                     ;[89a0] 00
   nop                                     ;[89a1] 00
   nop                                     ;[89a2] 00
   nop                                     ;[89a3] 00
   nop                                     ;[89a4] 00
   nop                                     ;[89a5] 00
   nop                                     ;[89a6] 00
   nop                                     ;[89a7] 00
   nop                                     ;[89a8] 00
   nop                                     ;[89a9] 00
   nop                                     ;[89aa] 00
   nop                                     ;[89ab] 00
   nop                                     ;[89ac] 00
   nop                                     ;[89ad] 00
   nop                                     ;[89ae] 00
   nop                                     ;[89af] 00
   nop                                     ;[89b0] 00
   nop                                     ;[89b1] 00
   nop                                     ;[89b2] 00
   nop                                     ;[89b3] 00
   nop                                     ;[89b4] 00
   nop                                     ;[89b5] 00
   nop                                     ;[89b6] 00
   nop                                     ;[89b7] 00
   nop                                     ;[89b8] 00
   nop                                     ;[89b9] 00
   nop                                     ;[89ba] 00
   nop                                     ;[89bb] 00
   nop                                     ;[89bc] 00
   nop                                     ;[89bd] 00
   nop                                     ;[89be] 00
   nop                                     ;[89bf] 00
   nop                                     ;[89c0] 00
   nop                                     ;[89c1] 00
   nop                                     ;[89c2] 00
   nop                                     ;[89c3] 00
   nop                                     ;[89c4] 00
   nop                                     ;[89c5] 00
   nop                                     ;[89c6] 00
   nop                                     ;[89c7] 00
   nop                                     ;[89c8] 00
   nop                                     ;[89c9] 00
   nop                                     ;[89ca] 00
   nop                                     ;[89cb] 00
   nop                                     ;[89cc] 00
   nop                                     ;[89cd] 00
   nop                                     ;[89ce] 00
   nop                                     ;[89cf] 00
   nop                                     ;[89d0] 00
   nop                                     ;[89d1] 00
   nop                                     ;[89d2] 00
   nop                                     ;[89d3] 00
   nop                                     ;[89d4] 00
   nop                                     ;[89d5] 00
   nop                                     ;[89d6] 00
   nop                                     ;[89d7] 00
   nop                                     ;[89d8] 00
   nop                                     ;[89d9] 00
   nop                                     ;[89da] 00
   nop                                     ;[89db] 00
   nop                                     ;[89dc] 00
   nop                                     ;[89dd] 00
   nop                                     ;[89de] 00
   nop                                     ;[89df] 00
   nop                                     ;[89e0] 00
   nop                                     ;[89e1] 00
   nop                                     ;[89e2] 00
   nop                                     ;[89e3] 00
   nop                                     ;[89e4] 00
   nop                                     ;[89e5] 00
   nop                                     ;[89e6] 00
   nop                                     ;[89e7] 00
   nop                                     ;[89e8] 00
   nop                                     ;[89e9] 00
   nop                                     ;[89ea] 00
   nop                                     ;[89eb] 00
   nop                                     ;[89ec] 00
   nop                                     ;[89ed] 00
   nop                                     ;[89ee] 00
   nop                                     ;[89ef] 00
   nop                                     ;[89f0] 00
   nop                                     ;[89f1] 00
   nop                                     ;[89f2] 00
   nop                                     ;[89f3] 00
   nop                                     ;[89f4] 00
   nop                                     ;[89f5] 00
   nop                                     ;[89f6] 00
   nop                                     ;[89f7] 00
   nop                                     ;[89f8] 00
   nop                                     ;[89f9] 00
   nop                                     ;[89fa] 00
   nop                                     ;[89fb] 00
   nop                                     ;[89fc] 00
   nop                                     ;[89fd] 00
   nop                                     ;[89fe] 00
   nop                                     ;[89ff] 00
   nop                                     ;[8a00] 00
   nop                                     ;[8a01] 00
   nop                                     ;[8a02] 00
   nop                                     ;[8a03] 00
   nop                                     ;[8a04] 00
   nop                                     ;[8a05] 00
   nop                                     ;[8a06] 00
   nop                                     ;[8a07] 00
   nop                                     ;[8a08] 00
   nop                                     ;[8a09] 00
   nop                                     ;[8a0a] 00
   nop                                     ;[8a0b] 00
   nop                                     ;[8a0c] 00
   nop                                     ;[8a0d] 00
   nop                                     ;[8a0e] 00
   nop                                     ;[8a0f] 00
   nop                                     ;[8a10] 00
   nop                                     ;[8a11] 00
   nop                                     ;[8a12] 00
   nop                                     ;[8a13] 00
   nop                                     ;[8a14] 00
   nop                                     ;[8a15] 00
   nop                                     ;[8a16] 00
   nop                                     ;[8a17] 00
   nop                                     ;[8a18] 00
   nop                                     ;[8a19] 00
   nop                                     ;[8a1a] 00
   nop                                     ;[8a1b] 00
   nop                                     ;[8a1c] 00
   nop                                     ;[8a1d] 00
   nop                                     ;[8a1e] 00
   nop                                     ;[8a1f] 00
   nop                                     ;[8a20] 00
   nop                                     ;[8a21] 00
   nop                                     ;[8a22] 00
   nop                                     ;[8a23] 00
   nop                                     ;[8a24] 00
   nop                                     ;[8a25] 00
   nop                                     ;[8a26] 00
   nop                                     ;[8a27] 00
   nop                                     ;[8a28] 00
   nop                                     ;[8a29] 00
   nop                                     ;[8a2a] 00
   nop                                     ;[8a2b] 00
   nop                                     ;[8a2c] 00
   nop                                     ;[8a2d] 00
   nop                                     ;[8a2e] 00
   nop                                     ;[8a2f] 00
   nop                                     ;[8a30] 00
   nop                                     ;[8a31] 00
   nop                                     ;[8a32] 00
   nop                                     ;[8a33] 00
   nop                                     ;[8a34] 00
   nop                                     ;[8a35] 00
   nop                                     ;[8a36] 00
   nop                                     ;[8a37] 00
   nop                                     ;[8a38] 00
   nop                                     ;[8a39] 00
   nop                                     ;[8a3a] 00
   nop                                     ;[8a3b] 00
   nop                                     ;[8a3c] 00
   nop                                     ;[8a3d] 00
   nop                                     ;[8a3e] 00
   nop                                     ;[8a3f] 00
   nop                                     ;[8a40] 00
   nop                                     ;[8a41] 00
   nop                                     ;[8a42] 00
   nop                                     ;[8a43] 00
   nop                                     ;[8a44] 00
   nop                                     ;[8a45] 00
   nop                                     ;[8a46] 00
   nop                                     ;[8a47] 00
   nop                                     ;[8a48] 00
   nop                                     ;[8a49] 00
   nop                                     ;[8a4a] 00
   nop                                     ;[8a4b] 00
   nop                                     ;[8a4c] 00
   nop                                     ;[8a4d] 00
   nop                                     ;[8a4e] 00
   nop                                     ;[8a4f] 00
   nop                                     ;[8a50] 00
   nop                                     ;[8a51] 00
   nop                                     ;[8a52] 00
   nop                                     ;[8a53] 00
   nop                                     ;[8a54] 00
   nop                                     ;[8a55] 00
   nop                                     ;[8a56] 00
   nop                                     ;[8a57] 00
   nop                                     ;[8a58] 00
   nop                                     ;[8a59] 00
   nop                                     ;[8a5a] 00
   nop                                     ;[8a5b] 00
   nop                                     ;[8a5c] 00
   nop                                     ;[8a5d] 00
   nop                                     ;[8a5e] 00
   nop                                     ;[8a5f] 00
   nop                                     ;[8a60] 00
   nop                                     ;[8a61] 00
   nop                                     ;[8a62] 00
   nop                                     ;[8a63] 00
   nop                                     ;[8a64] 00
   nop                                     ;[8a65] 00
   nop                                     ;[8a66] 00
   nop                                     ;[8a67] 00
   nop                                     ;[8a68] 00
   nop                                     ;[8a69] 00
   nop                                     ;[8a6a] 00
   nop                                     ;[8a6b] 00
   nop                                     ;[8a6c] 00
   nop                                     ;[8a6d] 00
   nop                                     ;[8a6e] 00
   nop                                     ;[8a6f] 00
   nop                                     ;[8a70] 00
   nop                                     ;[8a71] 00
   nop                                     ;[8a72] 00
   nop                                     ;[8a73] 00
   nop                                     ;[8a74] 00
   nop                                     ;[8a75] 00
   nop                                     ;[8a76] 00
   nop                                     ;[8a77] 00
   nop                                     ;[8a78] 00
   nop                                     ;[8a79] 00
   nop                                     ;[8a7a] 00
   nop                                     ;[8a7b] 00
   nop                                     ;[8a7c] 00
   nop                                     ;[8a7d] 00
   nop                                     ;[8a7e] 00
   nop                                     ;[8a7f] 00
   nop                                     ;[8a80] 00
   nop                                     ;[8a81] 00
   nop                                     ;[8a82] 00
   nop                                     ;[8a83] 00
   nop                                     ;[8a84] 00
   nop                                     ;[8a85] 00
   nop                                     ;[8a86] 00
   nop                                     ;[8a87] 00
   nop                                     ;[8a88] 00
   nop                                     ;[8a89] 00
   nop                                     ;[8a8a] 00
   nop                                     ;[8a8b] 00
   nop                                     ;[8a8c] 00
   nop                                     ;[8a8d] 00
   nop                                     ;[8a8e] 00
   nop                                     ;[8a8f] 00
   nop                                     ;[8a90] 00
   nop                                     ;[8a91] 00
   nop                                     ;[8a92] 00
   nop                                     ;[8a93] 00
   nop                                     ;[8a94] 00
   nop                                     ;[8a95] 00
   nop                                     ;[8a96] 00
   nop                                     ;[8a97] 00
   nop                                     ;[8a98] 00
   nop                                     ;[8a99] 00
   nop                                     ;[8a9a] 00
   nop                                     ;[8a9b] 00
   nop                                     ;[8a9c] 00
   nop                                     ;[8a9d] 00
   nop                                     ;[8a9e] 00
   nop                                     ;[8a9f] 00
   nop                                     ;[8aa0] 00
   nop                                     ;[8aa1] 00
   nop                                     ;[8aa2] 00
   nop                                     ;[8aa3] 00
   nop                                     ;[8aa4] 00
   nop                                     ;[8aa5] 00
   nop                                     ;[8aa6] 00
   nop                                     ;[8aa7] 00
   nop                                     ;[8aa8] 00
   nop                                     ;[8aa9] 00
   nop                                     ;[8aaa] 00
   nop                                     ;[8aab] 00
   nop                                     ;[8aac] 00
   nop                                     ;[8aad] 00
   nop                                     ;[8aae] 00
   nop                                     ;[8aaf] 00
   nop                                     ;[8ab0] 00
   nop                                     ;[8ab1] 00
   nop                                     ;[8ab2] 00
   nop                                     ;[8ab3] 00
   nop                                     ;[8ab4] 00
   nop                                     ;[8ab5] 00
   nop                                     ;[8ab6] 00
   nop                                     ;[8ab7] 00
   nop                                     ;[8ab8] 00
   nop                                     ;[8ab9] 00
   nop                                     ;[8aba] 00
   nop                                     ;[8abb] 00
   nop                                     ;[8abc] 00
   nop                                     ;[8abd] 00
   nop                                     ;[8abe] 00
   nop                                     ;[8abf] 00
   nop                                     ;[8ac0] 00
   nop                                     ;[8ac1] 00
   nop                                     ;[8ac2] 00
   nop                                     ;[8ac3] 00
   nop                                     ;[8ac4] 00
   nop                                     ;[8ac5] 00
   nop                                     ;[8ac6] 00
   nop                                     ;[8ac7] 00
   nop                                     ;[8ac8] 00
   nop                                     ;[8ac9] 00
   nop                                     ;[8aca] 00
   nop                                     ;[8acb] 00
   nop                                     ;[8acc] 00
   nop                                     ;[8acd] 00
   nop                                     ;[8ace] 00
   nop                                     ;[8acf] 00
   nop                                     ;[8ad0] 00
   nop                                     ;[8ad1] 00
   nop                                     ;[8ad2] 00
   nop                                     ;[8ad3] 00
   nop                                     ;[8ad4] 00
   nop                                     ;[8ad5] 00
   nop                                     ;[8ad6] 00
   nop                                     ;[8ad7] 00
   nop                                     ;[8ad8] 00
   nop                                     ;[8ad9] 00
   nop                                     ;[8ada] 00
   nop                                     ;[8adb] 00
   nop                                     ;[8adc] 00
   nop                                     ;[8add] 00
   nop                                     ;[8ade] 00
   nop                                     ;[8adf] 00
   nop                                     ;[8ae0] 00
   nop                                     ;[8ae1] 00
   nop                                     ;[8ae2] 00
   nop                                     ;[8ae3] 00
   nop                                     ;[8ae4] 00
   nop                                     ;[8ae5] 00
   nop                                     ;[8ae6] 00
   nop                                     ;[8ae7] 00
   nop                                     ;[8ae8] 00
   nop                                     ;[8ae9] 00
   nop                                     ;[8aea] 00
   nop                                     ;[8aeb] 00
   nop                                     ;[8aec] 00
   nop                                     ;[8aed] 00
   nop                                     ;[8aee] 00
   nop                                     ;[8aef] 00
   nop                                     ;[8af0] 00
   nop                                     ;[8af1] 00
   nop                                     ;[8af2] 00
   nop                                     ;[8af3] 00
   nop                                     ;[8af4] 00
   nop                                     ;[8af5] 00
   nop                                     ;[8af6] 00
   nop                                     ;[8af7] 00
   nop                                     ;[8af8] 00
   nop                                     ;[8af9] 00
   nop                                     ;[8afa] 00
   nop                                     ;[8afb] 00
   nop                                     ;[8afc] 00
   nop                                     ;[8afd] 00
   nop                                     ;[8afe] 00
   nop                                     ;[8aff] 00
   nop                                     ;[8b00] 00
   nop                                     ;[8b01] 00
   nop                                     ;[8b02] 00
   nop                                     ;[8b03] 00
   nop                                     ;[8b04] 00
   nop                                     ;[8b05] 00
   nop                                     ;[8b06] 00
   nop                                     ;[8b07] 00
   nop                                     ;[8b08] 00
   nop                                     ;[8b09] 00
   nop                                     ;[8b0a] 00
   nop                                     ;[8b0b] 00
   nop                                     ;[8b0c] 00
   nop                                     ;[8b0d] 00
   nop                                     ;[8b0e] 00
   nop                                     ;[8b0f] 00
   nop                                     ;[8b10] 00
   nop                                     ;[8b11] 00
   nop                                     ;[8b12] 00
   nop                                     ;[8b13] 00
   nop                                     ;[8b14] 00
   nop                                     ;[8b15] 00
   nop                                     ;[8b16] 00
   nop                                     ;[8b17] 00
   nop                                     ;[8b18] 00
   nop                                     ;[8b19] 00
   nop                                     ;[8b1a] 00
   nop                                     ;[8b1b] 00
   nop                                     ;[8b1c] 00
   nop                                     ;[8b1d] 00
   nop                                     ;[8b1e] 00
   nop                                     ;[8b1f] 00
   nop                                     ;[8b20] 00
   nop                                     ;[8b21] 00
   nop                                     ;[8b22] 00
   nop                                     ;[8b23] 00
   nop                                     ;[8b24] 00
   nop                                     ;[8b25] 00
   nop                                     ;[8b26] 00
   nop                                     ;[8b27] 00
   nop                                     ;[8b28] 00
   nop                                     ;[8b29] 00
   nop                                     ;[8b2a] 00
   nop                                     ;[8b2b] 00
   nop                                     ;[8b2c] 00
   nop                                     ;[8b2d] 00
   nop                                     ;[8b2e] 00
   nop                                     ;[8b2f] 00
   nop                                     ;[8b30] 00
   nop                                     ;[8b31] 00
   nop                                     ;[8b32] 00
   nop                                     ;[8b33] 00
   nop                                     ;[8b34] 00
   nop                                     ;[8b35] 00
   nop                                     ;[8b36] 00
   nop                                     ;[8b37] 00
   nop                                     ;[8b38] 00
   nop                                     ;[8b39] 00
   nop                                     ;[8b3a] 00
   nop                                     ;[8b3b] 00
   nop                                     ;[8b3c] 00
   nop                                     ;[8b3d] 00
   nop                                     ;[8b3e] 00
   nop                                     ;[8b3f] 00
   nop                                     ;[8b40] 00
   nop                                     ;[8b41] 00
   nop                                     ;[8b42] 00
   nop                                     ;[8b43] 00
   nop                                     ;[8b44] 00
   nop                                     ;[8b45] 00
   nop                                     ;[8b46] 00
   nop                                     ;[8b47] 00
   nop                                     ;[8b48] 00
   nop                                     ;[8b49] 00
   nop                                     ;[8b4a] 00
   nop                                     ;[8b4b] 00
   nop                                     ;[8b4c] 00
   nop                                     ;[8b4d] 00
   nop                                     ;[8b4e] 00
   nop                                     ;[8b4f] 00
   nop                                     ;[8b50] 00
   nop                                     ;[8b51] 00
   nop                                     ;[8b52] 00
   nop                                     ;[8b53] 00
   nop                                     ;[8b54] 00
   nop                                     ;[8b55] 00
   nop                                     ;[8b56] 00
   nop                                     ;[8b57] 00
   nop                                     ;[8b58] 00
   nop                                     ;[8b59] 00
   nop                                     ;[8b5a] 00
   nop                                     ;[8b5b] 00
   nop                                     ;[8b5c] 00
   nop                                     ;[8b5d] 00
   nop                                     ;[8b5e] 00
   nop                                     ;[8b5f] 00
   nop                                     ;[8b60] 00
   nop                                     ;[8b61] 00
   nop                                     ;[8b62] 00
   nop                                     ;[8b63] 00
   nop                                     ;[8b64] 00
   nop                                     ;[8b65] 00
   nop                                     ;[8b66] 00
   nop                                     ;[8b67] 00
   nop                                     ;[8b68] 00
   nop                                     ;[8b69] 00
   nop                                     ;[8b6a] 00
   nop                                     ;[8b6b] 00
   nop                                     ;[8b6c] 00
   nop                                     ;[8b6d] 00
   nop                                     ;[8b6e] 00
   nop                                     ;[8b6f] 00
   nop                                     ;[8b70] 00
   nop                                     ;[8b71] 00
   nop                                     ;[8b72] 00
   nop                                     ;[8b73] 00
   nop                                     ;[8b74] 00
   nop                                     ;[8b75] 00
   nop                                     ;[8b76] 00
   nop                                     ;[8b77] 00
   nop                                     ;[8b78] 00
   nop                                     ;[8b79] 00
   nop                                     ;[8b7a] 00
   nop                                     ;[8b7b] 00
   nop                                     ;[8b7c] 00
   nop                                     ;[8b7d] 00
   nop                                     ;[8b7e] 00
   nop                                     ;[8b7f] 00
   nop                                     ;[8b80] 00
   nop                                     ;[8b81] 00
   nop                                     ;[8b82] 00
   nop                                     ;[8b83] 00
   nop                                     ;[8b84] 00
   nop                                     ;[8b85] 00
   nop                                     ;[8b86] 00
   nop                                     ;[8b87] 00
   nop                                     ;[8b88] 00
   nop                                     ;[8b89] 00
   nop                                     ;[8b8a] 00
   nop                                     ;[8b8b] 00
   nop                                     ;[8b8c] 00
   nop                                     ;[8b8d] 00
   nop                                     ;[8b8e] 00
   nop                                     ;[8b8f] 00
   nop                                     ;[8b90] 00
   nop                                     ;[8b91] 00
   nop                                     ;[8b92] 00
   nop                                     ;[8b93] 00
   nop                                     ;[8b94] 00
   nop                                     ;[8b95] 00
   nop                                     ;[8b96] 00
   nop                                     ;[8b97] 00
   nop                                     ;[8b98] 00
   nop                                     ;[8b99] 00
   nop                                     ;[8b9a] 00
   nop                                     ;[8b9b] 00
   nop                                     ;[8b9c] 00
   nop                                     ;[8b9d] 00
   nop                                     ;[8b9e] 00
   nop                                     ;[8b9f] 00
   nop                                     ;[8ba0] 00
   nop                                     ;[8ba1] 00
   nop                                     ;[8ba2] 00
   nop                                     ;[8ba3] 00
   nop                                     ;[8ba4] 00
   nop                                     ;[8ba5] 00
   nop                                     ;[8ba6] 00
   nop                                     ;[8ba7] 00
   nop                                     ;[8ba8] 00
   nop                                     ;[8ba9] 00
   nop                                     ;[8baa] 00
   nop                                     ;[8bab] 00
   nop                                     ;[8bac] 00
   nop                                     ;[8bad] 00
   nop                                     ;[8bae] 00
   nop                                     ;[8baf] 00
   nop                                     ;[8bb0] 00
   nop                                     ;[8bb1] 00
   nop                                     ;[8bb2] 00
   nop                                     ;[8bb3] 00
   nop                                     ;[8bb4] 00
   nop                                     ;[8bb5] 00
   nop                                     ;[8bb6] 00
   nop                                     ;[8bb7] 00
   nop                                     ;[8bb8] 00
   nop                                     ;[8bb9] 00
   nop                                     ;[8bba] 00
   nop                                     ;[8bbb] 00
   nop                                     ;[8bbc] 00
   nop                                     ;[8bbd] 00
   nop                                     ;[8bbe] 00
   nop                                     ;[8bbf] 00
   nop                                     ;[8bc0] 00
   nop                                     ;[8bc1] 00
   nop                                     ;[8bc2] 00
   nop                                     ;[8bc3] 00
   nop                                     ;[8bc4] 00
   nop                                     ;[8bc5] 00
   nop                                     ;[8bc6] 00
   nop                                     ;[8bc7] 00
   nop                                     ;[8bc8] 00
   nop                                     ;[8bc9] 00
   nop                                     ;[8bca] 00
   nop                                     ;[8bcb] 00
   nop                                     ;[8bcc] 00
   nop                                     ;[8bcd] 00
   nop                                     ;[8bce] 00
   nop                                     ;[8bcf] 00
   nop                                     ;[8bd0] 00
   nop                                     ;[8bd1] 00
   nop                                     ;[8bd2] 00
   nop                                     ;[8bd3] 00
   nop                                     ;[8bd4] 00
   nop                                     ;[8bd5] 00
   nop                                     ;[8bd6] 00
   nop                                     ;[8bd7] 00
   nop                                     ;[8bd8] 00
   nop                                     ;[8bd9] 00
   nop                                     ;[8bda] 00
   nop                                     ;[8bdb] 00
   nop                                     ;[8bdc] 00
   nop                                     ;[8bdd] 00
   nop                                     ;[8bde] 00
   nop                                     ;[8bdf] 00
   nop                                     ;[8be0] 00
   nop                                     ;[8be1] 00
   nop                                     ;[8be2] 00
   nop                                     ;[8be3] 00
   nop                                     ;[8be4] 00
   nop                                     ;[8be5] 00
   nop                                     ;[8be6] 00
   nop                                     ;[8be7] 00
   nop                                     ;[8be8] 00
   nop                                     ;[8be9] 00
   nop                                     ;[8bea] 00
   nop                                     ;[8beb] 00
   nop                                     ;[8bec] 00
   nop                                     ;[8bed] 00
   nop                                     ;[8bee] 00
   nop                                     ;[8bef] 00
   nop                                     ;[8bf0] 00
   nop                                     ;[8bf1] 00
   nop                                     ;[8bf2] 00
   nop                                     ;[8bf3] 00
   nop                                     ;[8bf4] 00
   nop                                     ;[8bf5] 00
   nop                                     ;[8bf6] 00
   nop                                     ;[8bf7] 00
   nop                                     ;[8bf8] 00
   nop                                     ;[8bf9] 00
   nop                                     ;[8bfa] 00
   nop                                     ;[8bfb] 00
   nop                                     ;[8bfc] 00
   nop                                     ;[8bfd] 00
   nop                                     ;[8bfe] 00
   nop                                     ;[8bff] 00
   nop                                     ;[8c00] 00
   nop                                     ;[8c01] 00
   nop                                     ;[8c02] 00
   nop                                     ;[8c03] 00
   nop                                     ;[8c04] 00
   nop                                     ;[8c05] 00
   nop                                     ;[8c06] 00
   nop                                     ;[8c07] 00
   nop                                     ;[8c08] 00
   nop                                     ;[8c09] 00
   nop                                     ;[8c0a] 00
   nop                                     ;[8c0b] 00
   nop                                     ;[8c0c] 00
   nop                                     ;[8c0d] 00
   nop                                     ;[8c0e] 00
   nop                                     ;[8c0f] 00
   nop                                     ;[8c10] 00
   nop                                     ;[8c11] 00
   nop                                     ;[8c12] 00
   nop                                     ;[8c13] 00
   nop                                     ;[8c14] 00
   nop                                     ;[8c15] 00
   nop                                     ;[8c16] 00
   nop                                     ;[8c17] 00
   nop                                     ;[8c18] 00
   nop                                     ;[8c19] 00
   nop                                     ;[8c1a] 00
   nop                                     ;[8c1b] 00
   nop                                     ;[8c1c] 00
   nop                                     ;[8c1d] 00
   nop                                     ;[8c1e] 00
   nop                                     ;[8c1f] 00
   nop                                     ;[8c20] 00
   nop                                     ;[8c21] 00
   nop                                     ;[8c22] 00
   nop                                     ;[8c23] 00
   nop                                     ;[8c24] 00
   nop                                     ;[8c25] 00
   nop                                     ;[8c26] 00
   nop                                     ;[8c27] 00
   nop                                     ;[8c28] 00
   nop                                     ;[8c29] 00
   nop                                     ;[8c2a] 00
   nop                                     ;[8c2b] 00
   nop                                     ;[8c2c] 00
   nop                                     ;[8c2d] 00
   nop                                     ;[8c2e] 00
   nop                                     ;[8c2f] 00
   nop                                     ;[8c30] 00
   nop                                     ;[8c31] 00
   nop                                     ;[8c32] 00
   nop                                     ;[8c33] 00
   nop                                     ;[8c34] 00
   nop                                     ;[8c35] 00
   nop                                     ;[8c36] 00
   nop                                     ;[8c37] 00
   nop                                     ;[8c38] 00
   nop                                     ;[8c39] 00
   nop                                     ;[8c3a] 00
   nop                                     ;[8c3b] 00
   nop                                     ;[8c3c] 00
   nop                                     ;[8c3d] 00
   nop                                     ;[8c3e] 00
   nop                                     ;[8c3f] 00
   nop                                     ;[8c40] 00
   nop                                     ;[8c41] 00
   nop                                     ;[8c42] 00
   nop                                     ;[8c43] 00
   nop                                     ;[8c44] 00
   nop                                     ;[8c45] 00
   nop                                     ;[8c46] 00
   nop                                     ;[8c47] 00
   nop                                     ;[8c48] 00
   nop                                     ;[8c49] 00
   nop                                     ;[8c4a] 00
   nop                                     ;[8c4b] 00
   nop                                     ;[8c4c] 00
   nop                                     ;[8c4d] 00
   nop                                     ;[8c4e] 00
   nop                                     ;[8c4f] 00
   nop                                     ;[8c50] 00
   nop                                     ;[8c51] 00
   nop                                     ;[8c52] 00
   nop                                     ;[8c53] 00
   nop                                     ;[8c54] 00
   nop                                     ;[8c55] 00
   nop                                     ;[8c56] 00
   nop                                     ;[8c57] 00
   nop                                     ;[8c58] 00
   nop                                     ;[8c59] 00
   nop                                     ;[8c5a] 00
   nop                                     ;[8c5b] 00
   nop                                     ;[8c5c] 00
   nop                                     ;[8c5d] 00
   nop                                     ;[8c5e] 00
   nop                                     ;[8c5f] 00
   nop                                     ;[8c60] 00
   nop                                     ;[8c61] 00
   nop                                     ;[8c62] 00
   nop                                     ;[8c63] 00
   nop                                     ;[8c64] 00
   nop                                     ;[8c65] 00
   nop                                     ;[8c66] 00
   nop                                     ;[8c67] 00
   nop                                     ;[8c68] 00
   nop                                     ;[8c69] 00
   nop                                     ;[8c6a] 00
   nop                                     ;[8c6b] 00
   nop                                     ;[8c6c] 00
   nop                                     ;[8c6d] 00
   nop                                     ;[8c6e] 00
   nop                                     ;[8c6f] 00
   nop                                     ;[8c70] 00
   nop                                     ;[8c71] 00
   nop                                     ;[8c72] 00
   nop                                     ;[8c73] 00
   nop                                     ;[8c74] 00
   nop                                     ;[8c75] 00
   nop                                     ;[8c76] 00
   nop                                     ;[8c77] 00
   nop                                     ;[8c78] 00
   nop                                     ;[8c79] 00
   nop                                     ;[8c7a] 00
   nop                                     ;[8c7b] 00
   nop                                     ;[8c7c] 00
   nop                                     ;[8c7d] 00
   nop                                     ;[8c7e] 00
   nop                                     ;[8c7f] 00
   nop                                     ;[8c80] 00
   nop                                     ;[8c81] 00
   nop                                     ;[8c82] 00
   nop                                     ;[8c83] 00
   nop                                     ;[8c84] 00
   nop                                     ;[8c85] 00
   nop                                     ;[8c86] 00
   nop                                     ;[8c87] 00
   nop                                     ;[8c88] 00
   nop                                     ;[8c89] 00
   nop                                     ;[8c8a] 00
   nop                                     ;[8c8b] 00
   nop                                     ;[8c8c] 00
   nop                                     ;[8c8d] 00
   nop                                     ;[8c8e] 00
   nop                                     ;[8c8f] 00
   nop                                     ;[8c90] 00
   nop                                     ;[8c91] 00
   nop                                     ;[8c92] 00
   nop                                     ;[8c93] 00
   nop                                     ;[8c94] 00
   nop                                     ;[8c95] 00
   nop                                     ;[8c96] 00
   nop                                     ;[8c97] 00
   nop                                     ;[8c98] 00
   nop                                     ;[8c99] 00
   nop                                     ;[8c9a] 00
   nop                                     ;[8c9b] 00
   nop                                     ;[8c9c] 00
   nop                                     ;[8c9d] 00
   nop                                     ;[8c9e] 00
   nop                                     ;[8c9f] 00
   nop                                     ;[8ca0] 00
   nop                                     ;[8ca1] 00
   nop                                     ;[8ca2] 00
   nop                                     ;[8ca3] 00
   nop                                     ;[8ca4] 00
   nop                                     ;[8ca5] 00
   nop                                     ;[8ca6] 00
   nop                                     ;[8ca7] 00
   nop                                     ;[8ca8] 00
   nop                                     ;[8ca9] 00
   nop                                     ;[8caa] 00
   nop                                     ;[8cab] 00
   nop                                     ;[8cac] 00
   nop                                     ;[8cad] 00
   nop                                     ;[8cae] 00
   nop                                     ;[8caf] 00
   nop                                     ;[8cb0] 00
   nop                                     ;[8cb1] 00
   nop                                     ;[8cb2] 00
   nop                                     ;[8cb3] 00
   nop                                     ;[8cb4] 00
   nop                                     ;[8cb5] 00
   nop                                     ;[8cb6] 00
   nop                                     ;[8cb7] 00
   nop                                     ;[8cb8] 00
   nop                                     ;[8cb9] 00
   nop                                     ;[8cba] 00
   nop                                     ;[8cbb] 00
   nop                                     ;[8cbc] 00
   nop                                     ;[8cbd] 00
   nop                                     ;[8cbe] 00
   nop                                     ;[8cbf] 00
   nop                                     ;[8cc0] 00
   nop                                     ;[8cc1] 00
   nop                                     ;[8cc2] 00
   nop                                     ;[8cc3] 00
   nop                                     ;[8cc4] 00
   nop                                     ;[8cc5] 00
   nop                                     ;[8cc6] 00
   nop                                     ;[8cc7] 00
   nop                                     ;[8cc8] 00
   nop                                     ;[8cc9] 00
   nop                                     ;[8cca] 00
   nop                                     ;[8ccb] 00
   nop                                     ;[8ccc] 00
   nop                                     ;[8ccd] 00
   nop                                     ;[8cce] 00
   nop                                     ;[8ccf] 00
   nop                                     ;[8cd0] 00
   nop                                     ;[8cd1] 00
   nop                                     ;[8cd2] 00
   nop                                     ;[8cd3] 00
   nop                                     ;[8cd4] 00
   nop                                     ;[8cd5] 00
   nop                                     ;[8cd6] 00
   nop                                     ;[8cd7] 00
   nop                                     ;[8cd8] 00
   nop                                     ;[8cd9] 00
   nop                                     ;[8cda] 00
   nop                                     ;[8cdb] 00
   nop                                     ;[8cdc] 00
   nop                                     ;[8cdd] 00
   nop                                     ;[8cde] 00
   nop                                     ;[8cdf] 00
   nop                                     ;[8ce0] 00
   nop                                     ;[8ce1] 00
   nop                                     ;[8ce2] 00
   nop                                     ;[8ce3] 00
   nop                                     ;[8ce4] 00
   nop                                     ;[8ce5] 00
   nop                                     ;[8ce6] 00
   nop                                     ;[8ce7] 00
   nop                                     ;[8ce8] 00
   nop                                     ;[8ce9] 00
   nop                                     ;[8cea] 00
   nop                                     ;[8ceb] 00
   nop                                     ;[8cec] 00
   nop                                     ;[8ced] 00
   nop                                     ;[8cee] 00
   nop                                     ;[8cef] 00
   nop                                     ;[8cf0] 00
   nop                                     ;[8cf1] 00
   nop                                     ;[8cf2] 00
   nop                                     ;[8cf3] 00
   nop                                     ;[8cf4] 00
   nop                                     ;[8cf5] 00
   nop                                     ;[8cf6] 00
   nop                                     ;[8cf7] 00
   nop                                     ;[8cf8] 00
   nop                                     ;[8cf9] 00
   nop                                     ;[8cfa] 00
   nop                                     ;[8cfb] 00
   nop                                     ;[8cfc] 00
   nop                                     ;[8cfd] 00
   nop                                     ;[8cfe] 00
   nop                                     ;[8cff] 00
