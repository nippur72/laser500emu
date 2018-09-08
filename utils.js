/**** utility functions ****/

function hexDump(memory, start, end, rows) {
   let s="";
   for(let r=start;r<end;r+=rows) {
      s+= hex(r, 4) + ": ";      
      for(let c=0;c<rows;c++) {
         const byte = memory[r+c];
         s+= hex(byte)+" ";
      }
      for(let c=0;c<rows;c++) {
         const byte = memory[r+c];
         s+= (byte>32 && byte<127) ? String.fromCharCode(byte) : '.' ;
      }
      s+="\n";
   }
   return s;
}

function hex(value, size) {
   if(size === undefined) size = 2;
   let s = "0000" + value.toString(16);
   return s.substr(s.length - size);
}

function cpu_status(cpu) {
   return `A=${hex(cpu.a())} BC=${hex(cpu.b())}${hex(cpu.c())} DE=${hex(cpu.d())}${hex(cpu.e())} HL=${hex(cpu.h())}${hex(cpu.l())} IX=${hex(cpu.ix(),4)} IY=${hex(cpu.iy(),4)} SP=${hex(cpu.sp(),4)} PC=${hex(cpu.pc(),4)} S=${cpu.flags().S}, Z=${cpu.flags().Z}, Y=${cpu.flags().Y}, H=${cpu.flags().H}, X=${cpu.flags().X}, P=${cpu.flags().P}, N=${cpu.flags().N}, C=${cpu.flags().C}`;   
}

function debugKeyboard(key, state) {
   const m = Array.from(keyboard_matrix).map(k=>`0x${hex(k)}`).join(",");   
   let s = `${state} key='${key}' matrix=[${m}]`;
   console.log(s);
}
