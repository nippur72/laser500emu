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
   irq_trigger = 0;
   install_interrupt(timer_irq_function);
}

clock_t clock() {
   return ticks;
}
