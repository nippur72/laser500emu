// **** machine-specific utility functions ****

function cpu_status() {
   const state = cpu.getState();
   return `A=${hex(state.a)} BC=${hex(state.b)}${hex(state.c)} DE=${hex(state.d)}${hex(state.e)} HL=${hex(state.h)}${hex(state.l)} IX=${hex(state.ix,4)} IY=${hex(state.iy,4)} SP=${hex(state.sp,4)} PC=${hex(state.pc,4)} S=${state.flags.S}, Z=${state.flags.Z}, Y=${state.flags.Y}, H=${state.flags.H}, X=${state.flags.X}, P=${state.flags.P}, N=${state.flags.N}, C=${state.flags.C}`;   
}

async function crun(filename) {
   load(filename);
   //await print_string("\nrun:\n");
   pasteLine("RUN\r\n");
}

async function drag_drop_disk(diskname, bytes) {
   console.log(`dropped disk "${diskname}"`);
   await storage.writeFile(diskname, bytes);
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

function pasteLong(str) {
   function pasteQueue(lines) {
      if(lines.length == 0) return;
      let firstline = lines[0];
      lines = lines.slice(1);
      pasteBasicLine(firstline+"\r\n");
      setTimeout(()=>pasteQueue(lines), 500);
   }

   let lines = str.split("\n");
   //lines.forEach(line=>paste(line+"\r\n"));
   pasteQueue(lines);
}

function pasteBasic(text) {
   const lines = text.split("\n");   
   for(let t=0; t<lines.length; t++) {
      const linea = lines[t];
      console.log(linea);
      pasteBasicLine(linea);      
   }
   console.log("pasted!");   
}

function pasteBasicLine(line) {
   for(let t=0; t<line.length; t++) {
      let char = line.charAt(t);
      if(char === "§") char = "`";  // § is alias for ` to ease pasting from console
      pasteBasicChar(char);
   }
   pasteBasicChar("\n");
}

function pasteBasicChar(char) {
   const old_cursor_pos = mem_read_word(0x85e2);
   const code = asciiToKey(char);
   if(code === undefined) {
      console.warn(`char ${char} not recognized`);
      return;
   }   
   
   if(code.shift) keyDown(evkey("ShiftLeft"));
   keyDown(evkey(code.code));     

   /*
   for(let t=1; mem_read_word(0x85e2) === old_cursor_pos; t++) {
      renderAllLines();
      if(t>5000) {
         console.warn("paste fail");
         break;
      }      
   }*/

   renderAllLines();
   renderAllLines();

   keyUp(evkey(code.code));
   if(code.shift) keyUp(evkey("ShiftLeft"));

   renderAllLines();
   renderAllLines();
}

function wait_for_cursor() {
   while(1) {
      renderAllLines();
      if((total_cycles > cpuSpeed/4) && bit(mem_read(0x85fa),5)==1) return;
   }
}

function evkey(pcKey) {
   const ev = {
      code: pcKey,
      preventDefault: ()=>{}
   };
   return ev;
}

function asciiToKey(c) {
   
   if(c === "1") return { code: "Digit1", shift: false };
   if(c === "2") return { code: "Digit2", shift: false };
   if(c === "3") return { code: "Digit3", shift: false };
   if(c === "4") return { code: "Digit4", shift: false };
   if(c === "5") return { code: "Digit5", shift: false };
   if(c === "6") return { code: "Digit6", shift: false };
   if(c === "7") return { code: "Digit7", shift: false };
   if(c === "8") return { code: "Digit8", shift: false };
   if(c === "9") return { code: "Digit9", shift: false };
   if(c === "0") return { code: "Digit0", shift: false };

   if(c === "!") return { code: "Digit1", shift: true };
   if(c === "@") return { code: "Digit2", shift: true };
   if(c === "#") return { code: "Digit3", shift: true };
   if(c === "$") return { code: "Digit4", shift: true };
   if(c === "%") return { code: "Digit5", shift: true };
   if(c === "^") return { code: "Digit6", shift: true };
   if(c === "&") return { code: "Digit7", shift: true };
   if(c === "*") return { code: "Digit8", shift: true };
   if(c === "(") return { code: "Digit9", shift: true };
   if(c === ")") return { code: "Digit0", shift: true };

   if(c === "-") return { code: "Minus", shift: false };
   if(c === "=") return { code: "Equal", shift: false };
   if(c === "_") return { code: "Minus", shift: true  };
   if(c === "+") return { code: "Equal", shift: true  };

   if(c === "`") return { code: "Backquote", shift: false};
   if(c === "~") return { code: "Backquote", shift: true};

   if(c === "[") return { code: "BracketLeft",  shift: false};
   if(c === "]") return { code: "BracketRight", shift: false};
   if(c === "{") return { code: "BracketLeft",  shift: true};
   if(c === "}") return { code: "BracketRight", shift: true};

   if(c === ";") return { code: "Semicolon", shift: false };
   if(c === ":") return { code: "Semicolon", shift: true  };

   if(c === '"') return { code: "Quote", shift: true};
   if(c === "'") return { code: "Quote", shift: false};

   if(c === "<") return { code: "Comma",  shift: true};
   if(c === ">") return { code: "Period", shift: true};
   if(c === ",") return { code: "Comma",  shift: false};
   if(c === ".") return { code: "Period", shift: false};
   
   if(c === "/") return { code: "Slash", shift: false};   
   if(c === "?") return { code: "Slash", shift: true };
   
   if(c === "£") return { code: "PageUp", shift: true};      

   if(c === "|") return { code: "Backslash", shift: true};
   if(c === "\\") return { code: "Backslash", shift: false};

   if(c === "a") return { code: "KeyA", shift: false};
   if(c === "b") return { code: "KeyB", shift: false};
   if(c === "c") return { code: "KeyC", shift: false};
   if(c === "d") return { code: "KeyD", shift: false};
   if(c === "e") return { code: "KeyE", shift: false};
   if(c === "f") return { code: "KeyF", shift: false};
   if(c === "g") return { code: "KeyG", shift: false};
   if(c === "h") return { code: "KeyH", shift: false};
   if(c === "i") return { code: "KeyI", shift: false};
   if(c === "j") return { code: "KeyJ", shift: false};
   if(c === "k") return { code: "KeyK", shift: false};
   if(c === "l") return { code: "KeyL", shift: false};
   if(c === "m") return { code: "KeyM", shift: false};
   if(c === "n") return { code: "KeyN", shift: false};
   if(c === "o") return { code: "KeyO", shift: false};
   if(c === "p") return { code: "KeyP", shift: false};
   if(c === "q") return { code: "KeyQ", shift: false};
   if(c === "r") return { code: "KeyR", shift: false};
   if(c === "s") return { code: "KeyS", shift: false};
   if(c === "t") return { code: "KeyT", shift: false};
   if(c === "u") return { code: "KeyU", shift: false};
   if(c === "v") return { code: "KeyV", shift: false};
   if(c === "w") return { code: "KeyW", shift: false};
   if(c === "x") return { code: "KeyX", shift: false};
   if(c === "y") return { code: "KeyY", shift: false};
   if(c === "z") return { code: "KeyZ", shift: false};
   
   if(c === "A") return { code: "KeyA", shift: true };
   if(c === "B") return { code: "KeyB", shift: true };
   if(c === "C") return { code: "KeyC", shift: true };
   if(c === "D") return { code: "KeyD", shift: true };
   if(c === "E") return { code: "KeyE", shift: true };
   if(c === "F") return { code: "KeyF", shift: true };
   if(c === "G") return { code: "KeyG", shift: true };
   if(c === "H") return { code: "KeyH", shift: true };
   if(c === "I") return { code: "KeyI", shift: true };
   if(c === "J") return { code: "KeyJ", shift: true };
   if(c === "K") return { code: "KeyK", shift: true };
   if(c === "L") return { code: "KeyL", shift: true };
   if(c === "M") return { code: "KeyM", shift: true };
   if(c === "N") return { code: "KeyN", shift: true };
   if(c === "O") return { code: "KeyO", shift: true };
   if(c === "P") return { code: "KeyP", shift: true };
   if(c === "Q") return { code: "KeyQ", shift: true };
   if(c === "R") return { code: "KeyR", shift: true };
   if(c === "S") return { code: "KeyS", shift: true };
   if(c === "T") return { code: "KeyT", shift: true };
   if(c === "U") return { code: "KeyU", shift: true };
   if(c === "V") return { code: "KeyV", shift: true };
   if(c === "W") return { code: "KeyW", shift: true };
   if(c === "X") return { code: "KeyX", shift: true };
   if(c === "Y") return { code: "KeyY", shift: true };
   if(c === "Z") return { code: "KeyZ", shift: true };

   if(c === " ") return { code: "Space", shift: false };

   if(c === "\n") return { code: "Enter", shift: false };
   
   return undefined;
}

function zap() {      
   bank3.forEach((e,i)=>bank4[i]=i % 4 === 0 ? 0 : 0xFF);
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
}

function power() {      
   zap();
   setTimeout(()=>cpu.reset(),200);
}

function saveState() {
   const saveObject = {
      bank4: Array.from(bank4),
      bank5: Array.from(bank5),
      bank6: Array.from(bank6),
      bank7: Array.from(bank7),
      banks: Array.from(banks),
      vdc_graphic_mode_enabled,
      vdc_graphic_mode_number,
      vdc_page_7,
      vdc_text80_enabled,
      vdc_text80_foreground,
      vdc_text80_background,
      vdc_border_color,
      caps_lock_bit,
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

      vdc_graphic_mode_enabled= s.vdc_graphic_mode_enabled;
      vdc_graphic_mode_number = s.vdc_graphic_mode_number;
      vdc_page_7              = s.vdc_page_7;
      vdc_text80_enabled      = s.vdc_text80_enabled;
      vdc_text80_foreground   = s.vdc_text80_foreground;
      vdc_text80_background   = s.vdc_text80_background;
      vdc_border_color        = s.vdc_border_color;
      caps_lock_bit           = s.caps_lock_bit,
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

function dumpStack() {
   const sp = cpu.getState().sp;

   for(let t=sp;t<=0xffff;t+=2) {
      const word = mem_read_word(t);
      console.log(`${hex(t,4)}: ${hex(word,4)}  (${word})`);
   }
}


// *************************************************************************************
// connects to bbs.sblendorio.eu
// requires TERM.COM
async function bbs() {
   let modem = new BBS();
   modem.debug = false;

   modem.onreceive = (data) => data.forEach(e=>serial.receive_from_external(e));
   serial.on_send_to_external = (data) => modem.send([data]);

   try {
      await modem.connect("wss://bbs.sblendorio.eu:8082","bbs");
   }
   catch(err) {
      console.log("BBS: websocket connection failed");
   }   
}
