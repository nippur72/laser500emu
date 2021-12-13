// ====== TIMER ROUTINES ====

clock_t ticks;
byte irq_trigger = 0;

void timer_irq_function()
{
   ++ticks;
   irq_trigger = 1;
}

void install_timer_irq() {
   ticks = 0;   
   install_interrupt(timer_irq_function);
}

clock_t clock() {
   return ticks;
}

// waits for the interrupt to trigger
void wait_interrupt() {
   __asm   
   ld hl, _irq_trigger
   xor a
   ld (hl), a
   wait_interrupt_here:
   ld a, (hl)
   cp 0
   jr z, wait_interrupt_here
   __endasm;
}

