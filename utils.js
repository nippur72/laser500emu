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

function cpu_status() {
   const state = cpu.getState();
   return `A=${hex(state.a)} BC=${hex(state.b)}${hex(state.c)} DE=${hex(state.d)}${hex(state.e)} HL=${hex(state.h)}${hex(state.l)} IX=${hex(state.ix,4)} IY=${hex(state.iy,4)} SP=${hex(state.sp,4)} PC=${hex(state.pc,4)} S=${state.flags.S}, Z=${state.flags.Z}, Y=${state.flags.Y}, H=${state.flags.H}, X=${state.flags.X}, P=${state.flags.P}, N=${state.flags.N}, C=${state.flags.C}`;   
}

function mem_write_word(address, word) {
   mem_write(address + 0, word & 0xFF);
   mem_write(address + 1, (word & 0xFF00) >> 8);
}

function mem_read_word(address, word) {
   const lo = mem_read(address + 0);
   const hi = mem_read(address + 1);
   return lo+hi*256;
}

async function crun(filename) {
   cload(filename);
   await print_string("\nrun:\n");
}

function cload(filename) {
   const stored = window.localStorage.getItem(`laser500/${filename}`);

   if(stored === undefined || stored === null) {         
      console.log(`file "${filename}" not found`);            
      return;
   }

   const program = JSON.parse(stored);

   const { bytes, start, type } = program;
   const end = start + bytes.length;

   for(let i=0,t=start;t<=end;i++,t++) {
      mem_write(t, bytes[i]);
   }

   // modify end of basic program pointer   
   mem_write_word(0x83E9, end+1);   

   console.log(`loaded "${filename}" ${bytes.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
   cpu.reset();   
}

function csave(filename, start, end) {
   const basType = (start === undefined && end === undefined);

   if(start === undefined) start = mem_read_word(0x8041);
   if(end === undefined) end = mem_read_word(0x83E9)-1;

   const prg = [];
   for(let i=0,t=start; t<=end; i++,t++) {
      prg.push(mem_read(t));
   }

   const bytes = new Uint8Array(prg);

   let blob = new Blob([bytes], {type: "application/octet-stream"});
   const ext = basType ? "bas" : "bin";   
   saveAs(blob, filename);

   console.log(`saved "${filename}" ${bytes.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);

   const saveObject = {
      name: filename,
      bytes: Array.from(bytes),
      start: start,
      type: ext
   };

   window.localStorage.setItem(`laser500/${filename}`, JSON.stringify(saveObject));
   cpu.reset();
}

function cdir() {
   const keys = Object.keys(window.localStorage);
   const laser500 = keys.filter(f => f.startsWith("laser500/"));   
   laser500.forEach(fn=>console.log(fn.substr("laser500/".length)));
}

function cdel(fname) {
   const key = `laser500/${fname}`;
   const exist = window.localStorage.getItem(key) !== null;

   if(exist) {
      window.localStorage.removeItem(key);
      console.log(`removed "${fname}"`);
   }
   else {
      console.log(`file "${fname}" not found`);
   }
}

async function print_string(str) {
   for(let t=0;t<str.length;t++) {
      let c = str.charAt(t).toLowerCase();
      if(c=='\n') c = "Enter";
      await simulateKey(c);
   }
}

async function pause() {
   return new Promise((resolve,reject)=> {
      setTimeout(()=>resolve(), 100);
   });
}

async function simulateKey(pckey) {
   await singleKey(pckey);
}

async function singleKey(pckey) {
   keyDown(evkey(pckey)); 
   await pause(); 
   keyUp(evkey(pckey));
   await pause(); 
}

function evkey(pcKey) {
   const ev = {
      key: pcKey,
      preventDefault: ()=>{}
   };
   return ev;
}

function power() {      
   ram1.forEach((e,i)=>ram1[i]=i % 4 === 0 ? 0 : 0xFF);
   ram2.forEach((e,i)=>ram2[i]=i % 4 === 0 ? 0 : 0xFF);
   ram3.forEach((e,i)=>ram2[i]=i % 4 === 0 ? 0 : 0xFF);
   videoram.forEach((e,i)=>videoram[i]=i % 4 === 0 ? 0 : 0);
   banks.forEach((e,i)=>banks[i]=0);
   vdc_border_color = 0;
   vdc_text80_background = 0;
   let state = cpu.getState();
   state.halted = true;
   cpu.setState(state);
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
      ram1: Array.from(ram1),
      ram2: Array.from(ram2),
      ram3: Array.from(ram3),
      videoram: Array.from(videoram),
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
      
         s.ram1.forEach((e,i)=>{ram1[i]=e;});
         s.ram2.forEach((e,i)=>{ram2[i]=e;});
         s.ram3.forEach((e,i)=>{ram3[i]=e;});
      s.videoram.forEach((e,i)=>{videoram[i]=e;});
         s.banks.forEach((e,i)=>{banks[i]=e;});

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
      cpu.setState(s.cpu);
   }
   catch(error)
   {

   }
}