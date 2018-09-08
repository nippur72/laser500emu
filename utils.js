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
         console.log(e2)
         loadIntoRam(new Uint8Array(e2.target.result), 0x8995);
         cpu.reset();
      };

      reader.readAsArrayBuffer(file); 
   }
});

function loadIntoRam(prog, address) {
   console.log(`loading ${prog.length} bytes at address ${hex(address,4)}`);
   let z = address - 0x8000;
   for(let t=0;t<prog.length;t++) {
      if(t < 16384 ) ram1[t+z] = prog[t];
      else           ram2[t%16384+z] = prog[t];
   }
   console.log("program loaded");
}