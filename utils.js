/**** utility functions ****/

function dumpMem(start, end, rows) {
   if(rows==undefined) rows=16;
   let s="\r\n";
   for(let r=start;r<=end;r+=rows) {
      s+= hex(r, 4) + ": ";      
      for(let c=0;c<rows && (r+c)<=end;c++) {
         const byte = mem_read(r+c);
         s+= hex(byte)+" ";
      }
      for(let c=0;c<rows && (r+c)<=end;c++) {
         const byte = mem_read(r+c);
         s+= (byte>32 && byte<127) ? String.fromCharCode(byte) : '.' ;
      }
      s+="\n";
   }
   console.log(s);
}

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

function bin(value, size) {
   if(size === undefined) size = 8;
   let s = "00000000" + value.toString(2);
   return s.substr(s.length - size);
}

function cpu_status() {
   const state = cpu.getState();
   return `A=${hex(state.a)} BC=${hex(state.b)}${hex(state.c)} DE=${hex(state.d)}${hex(state.e)} HL=${hex(state.h)}${hex(state.l)} IX=${hex(state.ix,4)} IY=${hex(state.iy,4)} SP=${hex(state.sp,4)} PC=${hex(state.pc,4)} S=${state.flags.S}, Z=${state.flags.Z}, Y=${state.flags.Y}, H=${state.flags.H}, X=${state.flags.X}, P=${state.flags.P}, N=${state.flags.N}, C=${state.flags.C}`;   
}

function mem_write_word(address, word) {
   mem_write(address + 0, word & 0xFF);
   mem_write(address + 1, (word & 0xFF00) >> 8);
}

function mem_read_word(address) {
   const lo = mem_read(address + 0);
   const hi = mem_read(address + 1);
   return lo+hi*256;
}

async function crun(filename) {
   load(filename);
   //await print_string("\nrun:\n");
   pasteLine("RUN\r\n");
}

function drag_drop_disk(diskname, bytes) {
   console.log(`dropped disk "${diskname}"`);
   writeFile(diskname, bytes);
}

function pasteLine(text) {
   // keyboard buffer: 8289-838b  
   // key repeat address: 85F7
   
   for(let t=0;t<text.length;t++) {
      const v = text.charCodeAt(t);
      mem_write(0x8289 + t, v);
   }
   mem_write_word(0x85f7, 0x8289);
   //simulateKey("End");
   cpu.reset();
}

let is_pasting_text = false;
async function print_string(str) {   
   is_pasting_text = true;
   for(let t=0;t<str.length;t++) {
      let c = str.charAt(t).toLowerCase();
      if(c=='\n') c = "Enter";
      await simulateKey(c);
      if(!is_pasting_text) break;
   }   
   is_pasting_text = false;
}

async function wait_cursor_move_or_timeout(oldpos, maxtime, oldframe) {
   let time_counter = 0;
   const tick = 5;

   function check(resolve) {
      if(frames !== oldframe) {
         if(mem_read_word(0x85e2)!==oldpos) resolve();
         time_counter += tick;
         if(time_counter > maxtime) resolve();
      }
      setTimeout(()=>check(resolve), tick);
   }

   return new Promise((resolve,reject)=> {      
      setTimeout(()=>check(resolve), tick);
   });
}

async function skip_frame(oldframe) {
   const tick = 5;
   function check(resolve) {
      if(frames !== oldframe) resolve();
      setTimeout(()=>check(resolve), tick);
   }

   return new Promise((resolve,reject)=> {      
      setTimeout(()=>check(resolve), tick);
   });
}

async function pause(time) {
   return new Promise((resolve,reject)=> {
      setTimeout(()=>resolve(), time);
   });
}

async function simulateKey(pckey) {
   await singleKey(pckey);
}

async function singleKey(pckey) {
   const old_cursor_pos = mem_read_word(0x85e2);
   const old_frames = frames;
   keyDown(evkey(pckey));    
   await wait_cursor_move_or_timeout(old_cursor_pos, 5*1000, old_frames); 
   keyUp(evkey(pckey));
   //await pause(25); 
   await skip_frame(frames); 
}

function evkey(pcKey) {
   const ev = {
      key: pcKey,
      preventDefault: ()=>{}
   };
   return ev;
}

function zap() {      
   bank4.forEach((e,i)=>bank4[i]=i % 4 === 0 ? 0 : 0xFF);
   bank5.forEach((e,i)=>bank5[i]=i % 4 === 0 ? 0 : 0xFF);
   bank6.forEach((e,i)=>bank5[i]=i % 4 === 0 ? 0 : 0xFF);
   bank7.forEach((e,i)=>bank7[i]=i % 4 === 0 ? 0 : 0);
   banks.forEach((e,i)=>banks[i]=0);
   vdc_border_color = 0;
   vdc_text80_background = 0;
   let state = cpu.getState();
   state.halted = true;
   cpu.setState(state);
   is_pasting_text = false;
}

function power() {      
   zap();
   setTimeout(()=>cpu.reset(),200);
}

function stop() {   
   stopped = true;
   console.log("emulation stopped");
}

function go() {
   stopped = false;
   oneFrame();
   console.log("emulation resumed");
}

function info() { 
   const average = averageFrameTime; /* oneFrameTimeSum/frames; */
   console.log(`frame rendering: ${Math.round(average*10,2)/10} ms, load=${Math.round(average/frameDuration*100*10,2)/10} %`);   
}

function set(value, bitmask) {
   return value | bitmask; 
}

function reset(value, bitmask) {
   return value & (0xFF ^ bitmask);
}

function saveState() {
   const saveObject = {
      bank4: Array.from(bank4),
      bank5: Array.from(bank5),
      bank6: Array.from(bank6),
      bank7: Array.from(bank7),
      banks: Array.from(banks),
      cassette_bit_in, 
      cassette_bit_out, 
      vdc_graphic_mode_enabled,
      vdc_graphic_mode_number,
      vdc_page_7,
      vdc_text80_enabled,
      vdc_text80_foreground,
      vdc_text80_background,
      vdc_border_color,
      speaker_A,
      speaker_B,
      joy0,
      joy1,
      emulate_fdc, 
      cpu: cpu.getState()  
   };   

   window.localStorage.setItem(`laser500emu_state`, JSON.stringify(saveObject));
}

function restoreState() {   
   try
   {
      let s = window.localStorage.getItem(`laser500emu_state`);

      if(s === null) return;   

      s = JSON.parse(s);      
      
      copyArray( s.bank4, bank4);
      copyArray( s.bank5, bank5);
      copyArray( s.bank6, bank6);
      copyArray( s.bank7, bank7);
      copyArray( s.banks, banks);         

      cassette_bit_in         = s.cassette_bit_in;
      cassette_bit_out        = s.cassette_bit_out;
      vdc_graphic_mode_enabled= s.vdc_graphic_mode_enabled;
      vdc_graphic_mode_number = s.vdc_graphic_mode_number;
      vdc_page_7              = s.vdc_page_7;
      vdc_text80_enabled      = s.vdc_text80_enabled;
      vdc_text80_foreground   = s.vdc_text80_foreground;
      vdc_text80_background   = s.vdc_text80_background;
      vdc_border_color        = s.vdc_border_color;
      speaker_A               = s.speaker_A;
      speaker_B               = s.speaker_B;
      joy0                    = s.joy0;
      joy1                    = s.joy1;  
      emulate_fdc             = s.emulate_fdc; 
      cpu.setState(s.cpu);
   }
   catch(error)
   {

   }
}

function dumpPointers() {
   console.log(`
   +------------------------+ <- TOPMEM (0x803d) ${hex(mem_read_word(0x803d),4)}
   |      Stack space       |
   +------------------------+ <- MEMSIZ (0x839d) ${hex(mem_read_word(0x839d),4)}
   |        Strings         |
   +------------------------+ <- FRETOP (0x83c2) ${hex(mem_read_word(0x83c2),4)}
   |       Free space       |
   +------------------------+ <- STREND (0x83ed) ${hex(mem_read_word(0x83ed),4)}
   |     Array variables    |
   +------------------------+ <- ARYTAB (0x83eb) ${hex(mem_read_word(0x83eb),4)}
   |    Simple variables    |
   +------------------------+ <- VARTAB (0x83e9) ${hex(mem_read_word(0x83e9),4)}
   |     BASIC program      |
   +------------------------+ <- TXTTAB (0x8041) ${hex(mem_read_word(0x8041),4)}
   |    System variables    |
   +------------------------+ 0x8000
`);
}

let debugBefore = undefined;
let debugAfter = undefined;

function bit(b,n) {
   return (b & (1<<n))>0 ? 1 : 0;
} 

function not_bit(b,n) {
   return (b & (1<<n))>0 ? 0 : 1;
} 

function dumpStack() {
   const sp = cpu.getState().sp;

   for(let t=sp;t<=0xffff;t+=2) {
      const word = mem_read_word(t);
      console.log(`${hex(t,4)}: ${hex(word,4)}  (${word})`);
   }
}

function endsWith(s, value) {
   return s.substr(-value.length) === value;
}

function copyArray(source, dest) {
   source.forEach((e,i)=>dest[i] = e);
}