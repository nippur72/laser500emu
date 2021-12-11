// interrupt exit point defined by the ROM (jumps there)
#define INTERRUPT_EXIT 0x8012

void install_interrupt(void *handler) FASTNAKED;
void uinstall_interrupt();

