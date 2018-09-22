function floppy_read_port(port) {
   console.log(`FDC read port ${hex(port)}h, pc=${hex(cpu.getState().pc,4)}h`);
   return 0x00;
}

function floppy_write_port(port, value) {
   console.log(`FDC write port ${hex(port)}h value ${hex(value)}h, pc=${hex(cpu.getState().pc,4)}h`);   
}
