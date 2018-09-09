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
   const m = Array.from(keyboard_rows).map(k=>`0x${hex(k)}`).join(",");   
   let s = `${state} key='${key}' matrix=[${m}]`;
   console.log(s);
}


async function loadFile(fileName) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (theFile) => {
         resolve(theFile.result);
      };
      
      reader.readAsArrayBuffer(fileName);
    });
}

async function load(fileName) {
   console.log("loading file...");
   const file = await loadFile(fileName);
   console.log("loaded");
}

/**** drag prgrams **** */

const dropZone = document.getElementById('canvas');

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
   e.stopPropagation();
   e.preventDefault();
   e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', e => {
   e.stopPropagation();
   e.preventDefault();
   const files = e.dataTransfer.files; // Array of all files

   for(let i=0, file; file=files[i]; i++) {                   
      const reader = new FileReader();

      reader.onload = e2 => {
         // finished reading file data.
         const outName = file.name;         

         const saveObject = {
            name: outName,
            bytes: Array.from(new Uint8Array(e2.target.result)),
            start: 0x8995,
            type: "bin"
         };
                  
         window.localStorage.setItem(`laser500/${outName}`, JSON.stringify(saveObject));
               
         cload(outName);         
      };

      reader.readAsArrayBuffer(file); 
   }
});

/*
function loadIntoRam(prog, address) {
   console.log(`loading ${prog.length} bytes at address ${hex(address,4)}`);
   
   for(let t=0;t<prog.length;t++) {
      mem_write(address + t, prog[t]);
   }
   // modify end of basic program pointer
   const endaddress = address + prog.length;
   mem_write_word(0x83E9, endaddress);   
   console.log("program loaded");
}
*/

function mem_write_word(address, word) {
   mem_write(address + 0, word & 0xFF);
   mem_write(address + 1, (word & 0xFF00) >> 8);
}

function mem_read_word(address, word) {
   const lo = mem_read(address + 0);
   const hi = mem_read(address + 1);
   return lo+hi*256;
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

   console.log(`cloaded "${filename}" ${bytes.length} bytes from ${hex(start,4)} to ${hex(end,4)}`);
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

   console.log(`csaved "${filename}" ${bytes.length} bytes from ${hex(start,4)} to ${hex(end,4)}`);

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

/*
async function print_string(str) {
   for(let t=0;t<str.length;t++) {
      let c = str.charAt(t).toLowerCase();
      if(c=='\n') c = "Enter";
      await simulateKey(c);
   }
}

async function pause() {
   return new Promise((resolve,reject)=> {
      setTimeout(()=>resolve(), 20);
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
*/
