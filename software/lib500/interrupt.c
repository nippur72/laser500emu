
#pragma save
#pragma disable_warning 85
void install_interrupt(void *handler) FASTNAKED
{
   __asm
      di
      ld (INTERRUPT_EXIT+1),hl   ; 0x8012 contains the user interrupt routine
      ld a,0xc3                  ; opcode for JP
      ld (INTERRUPT_EXIT),a      ; 8012: C3 ?? ?? JP interrupt
      ei
      ret
   __endasm;
}
#pragma restore

void uinstall_interrupt()
{
   __asm
      di
      ld a,0xc9               ; opcode for RET
      ld (INTERRUPT_EXIT), a  ; 8012: C9 ?? ?? RET
      ei
   __endasm;
}
