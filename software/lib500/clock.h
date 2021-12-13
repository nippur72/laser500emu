// timer
#define CLOCKS_PER_SEC 50
typedef unsigned long clock_t;

void install_timer_irq();
clock_t clock();
void wait_interrupt();

