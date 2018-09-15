int main() {
   #asm

   di   

loop:   
   ld a, $02     ; switch to I/O page 2 in bank 1
   out ($41), a  ;

   ld a, ($6800)  ; read tape bit 80h = on, 0=0ff
   bit 7, a   
   jp z, isone
  
iszero:
   ld a, $11
   out ($44), a
   ld a, $01
   out ($45), a
   ld a, 0
   ld ($6800), a 
   jp loop

isone:
   ld a, $C1
   out ($44), a
   ld a, $0C
   out ($45), a
   ld a, 1
   ld ($6800), a 
   jp loop

   #endasm   
}
