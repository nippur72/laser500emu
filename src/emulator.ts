// TODO serial: reconcile BBS serial port with CP/M serial port
// TODO tape: separate button for downloading 
// TODO eradicate rgbmasksize, rgbmaskopacity
// TODO capture printer
// TODO joystick: on gui
// TODO audio: mute option
// TODO audio: save with tape?
// TODO misc: load/save memory block/basic program
// TODO misc: type basic text, paste
// TODO replace .bin with VZ ?
// TODO misc: cartridge load
// TODO adopt bank/page termonology as in the user manual
// TODO gui keydown, make single handler

// *** OLD TODOs ***

// TODO gamepads and numpad emulation DO NOT coexist
// TODO joysticks ports like in laser 310 (also fpga ?)
// TODO restore IN(0x13)=0xFF, IN(0x12)=0x13 when no drive selected (@Bonstra test)
// TODO add a machine reset (FDC ecc..)
// TODO build of CP/M ?
// TODO modularize, avoid global variables
// TODO stop() resumes after browser tab reactivates
// TODO fix page refresh when in laser 350 mode
// TODO save/load state does not save banks?
// TODO 1x1 pixel rendering
// TODO URLSearchParams()
// TODO gamepad api
// TODO tape stereo trick https://retrocomputing.stackexchange.com/questions/773/loading-zx-spectrum-tape-audio-in-a-post-cassette-world
// TODO inverted waveform option
// TODO remove software from facebook group
// TODO contrast/luminosity
// TODO fix bug introduced with audioContext.resume
// TODO screen writing emulation as browser support
// TODO emulate true drive @300 RPM
// TODO display drive activity in canvas
// TODO publish Jaime's disks
// TODO turbotape check T-states, finalize 
// TODO finalize throttle / end of frame hook
// TODO finalize Z80.js fuse tests
// TODO disk drive sounds
// TODO finalize pasteLine/pasteText
// TODO save emulator snapshots?
// TODO draw keyboard for mobile
// TODO save to cloud ?
// TODO almost exact cycles drawing
// TODO javascript debugger, halt
// TODO laser 350/700
// TODO cartdriges / rom expansion slots
// TODO laser 200 family? study vzem
// TODO draw in webassembly
// TODO caplock key / led ?
// TODO visual/sound display of activity
// TODO wrap in electron app
// TODO verify cassette_bit I/O range on real HW
// TODO options window (modal)
// TODO be able to emulate CTRL+power up
// TODO sprite routine?

import { bit, downloadBytes, getFileExtension, hex, mem_read_word, mem_write_word, reset_bit, set_bit } from "./bytes";

import { video, drawFrame_y, calculateGeometry } from "./video";

const autoload = undefined;

/* @@@ utils.js */  
// **** machine-specific utility functions ****

function cpu_status() {
   const state = laser500.cpu.getState();
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
   laser500.cpu.reset();
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

export function pasteBasic(text) {
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
   laser500.bank3.forEach((e,i)=>laser500.bank4[i]=i % 4 === 0 ? 0 : 0xFF);
   laser500.bank4.forEach((e,i)=>laser500.bank4[i]=i % 4 === 0 ? 0 : 0xFF);
   laser500.bank5.forEach((e,i)=>laser500.bank5[i]=i % 4 === 0 ? 0 : 0xFF);
   laser500.bank6.forEach((e,i)=>laser500.bank5[i]=i % 4 === 0 ? 0 : 0xFF);
   laser500.bank7.forEach((e,i)=>laser500.bank7[i]=i % 4 === 0 ? 0 : 0);
   laser500.banks.forEach((e,i)=>laser500.banks[i]=0);
   laser500.vdc_border_color = 0;
   laser500.vdc_text80_background = 0;
   let state = laser500.cpu.getState();
   state.halted = true;
   laser500.cpu.setState(state);   
}

function saveState() {
   const saveObject = {
      bank4: Array.from(laser500.bank4),
      bank5: Array.from(laser500.bank5),
      bank6: Array.from(laser500.bank6),
      bank7: Array.from(laser500.bank7),
      banks: Array.from(laser500.banks),
      vdc_graphic_mode_enabled: laser500.vdc_graphic_mode_enabled,
      vdc_graphic_mode_number: laser500.vdc_graphic_mode_number,
      vdc_page_7: laser500.vdc_page_7,
      vdc_text80_enabled: laser500.vdc_text80_enabled,
      vdc_text80_foreground: laser500.vdc_text80_foreground,
      vdc_text80_background: laser500.vdc_text80_background,
      vdc_border_color: laser500.vdc_border_color,
      caps_lock_bit: laser500.caps_lock_bit,
      emulate_fdc: laser500.emulate_fdc, 
      cpu: laser500.cpu.getState()  
   };   

   window.localStorage.setItem(`laser500emu_state`, JSON.stringify(saveObject));
}

interface EmulatorState 
{
   bank4: number[];
   bank5: number[];
   bank6: number[];
   bank7: number[];
   banks: number[];
}

function restoreState() {   
   throw "not implemented, TODO";
   /*
   try
   {
      let ss = window.localStorage.getItem(`laser500emu_state`);

      if(ss === null) return;   

      const s = JSON.parse(ss) as EmulatorState;      
      
      laser500.bank4 = new Uint8Array([ ... s.bank4 ]);
      laser500.bank5 = new Uint8Array([ ... s.bank5 ]);
      laser500.bank6 = new Uint8Array([ ... s.bank6 ]);
      laser500.bank7 = new Uint8Array([ ... s.bank7 ]);
      laser500.banks = new Uint8Array([ ... s.banks ]);         

      laser500.vdc_graphic_mode_enabled= s.vdc_graphic_mode_enabled;
      laser500.vdc_graphic_mode_number = s.vdc_graphic_mode_number;
      laser500.vdc_page_7              = s.vdc_page_7;
      laser500.vdc_text80_enabled      = s.vdc_text80_enabled;
      laser500.vdc_text80_foreground   = s.vdc_text80_foreground;
      laser500.vdc_text80_background   = s.vdc_text80_background;
      laser500.vdc_border_color        = s.vdc_border_color;
      laser500.caps_lock_bit           = s.caps_lock_bit,
      laser500.emulate_fdc             = s.emulate_fdc; 

      laser500.cpu.setState(s.cpu);
   }
   catch(error)
   {

   }
   */
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
   const sp = laser500.cpu.getState().sp;

   for(let t=sp;t<=0xffff;t+=2) {
      const word = mem_read_word(t);
      console.log(`${hex(t,4)}: ${hex(word,4)}  (${word})`);
   }
}

// *************************************************************************************
// connects to bbs.sblendorio.eu
// requires TERM.COM

import { BBS } from "./bbs";

async function bbs() {
   let modem = new BBS();
   modem.debug = false;

   modem.onreceive = (data) => data.forEach(e=>laser500.serial.receive_from_external(e));
   laser500.serial.on_send_to_external = (data) => modem.send([data]);

   try {
      await modem.connect("wss://bbs.sblendorio.eu:8082","bbs");
   }
   catch(err) {
      console.log("BBS: websocket connection failed");
   }   
}



/* @@@ browser.js */  
// handles interaction between browser and emulation 

let aspect = 1.55;

function onResize() {
   const canvas = document.getElementById("canvas"); 
   if(canvas === null) return;

   if(window.innerWidth > (window.innerHeight*aspect))
   {
      canvas.style.width  = `${aspect*100}vmin`;
      canvas.style.height = "100vmin";
   }
   else if(window.innerWidth > window.innerHeight)
   {
      canvas.style.width  = "100vmax";
      canvas.style.height = `${(1/aspect)*100}vmax`;
   }
   else
   {
      canvas.style.width  = "100vmin";
      canvas.style.height = `${(1/aspect)*100}vmin`;
   }

   const trueHeight = canvas.offsetHeight
   video.hide_scanlines = (trueHeight < 512);
   buildPalette();
}

function goFullScreen() 
{
   const canvas = document.getElementById("canvas"); 
   if(canvas === null) return;
   onResize();
}

// **** save state on close ****

window.onbeforeunload = function(e) {
   saveState();   
 };

// **** visibility change ****

window.addEventListener("visibilitychange", function() {
   if(document.visibilityState === "hidden")
   {
      laser500.stopped = true;
      audio.stop();
   }
   else if(document.visibilityState === "visible")
   {
      laser500.stopped = false;
      oneFrame(undefined);
      audio.start();
   }
});

// **** drag & drop ****

const dropZone = document.getElementById('screen');

if(dropZone !== null) {
   // Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
   dropZone.addEventListener('dragover', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if(e.dataTransfer) {
         e.dataTransfer.dropEffect = 'copy';
      }
   });

   // Get file data on drop
   dropZone.addEventListener('drop', e => {
      audio.resume();

      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer?.files; // Array of all files
      if(files === undefined) return;

      for(let i=0, file; file=files[i]; i++) {                   
         const reader = new FileReader();      
         reader.onload = e2 => {
            const result = e2.target?.result;
            if(result && typeof result !== 'string') {               
               droppedFile(file.name, new Uint8Array(result));
            }
         };
         reader.readAsArrayBuffer(file); 
      }
   });
}

async function droppedFile(droppedFileName: string, bytes: Uint8Array) {

   const ext = getFileExtension(droppedFileName);

   if(ext === ".wav") {
      // WAV files
      //console.log("WAV file dropped");

      laser500.tape.load_wav_file(droppedFileName, bytes.buffer);

      // CRUN run only if in immediate mode
      if(laser500.isImmediateMode()) pasteLine("CRUN\r\n");
            
      return;
   }

   if(ext === ".nic") {
      await drag_drop_disk(droppedFileName, bytes);
      await load(droppedFileName, 1);
      // pasteLine("DIR\r\n");
      return;
   }

   if(ext === ".bin") {
      await storage.writeFile(droppedFileName, bytes)
      crun(droppedFileName);
      return;
   }

   if(ext === ".bas") {
      await storage.writeFile(droppedFileName, bytes)
      load(droppedFileName);
      return;
   }
}

// **** welcome message ****

function welcome() {
   console.info(
`Welcome to the Video Technology Laser 500 emulator
Please read the instructions at https://github.com/nippur72/laser500emu`);   
}

function getQueryStringObject(options) {
   let a = window.location.search.split("&");
   let o = a.reduce((o, v) =>{
      var kv = v.split("=");
      const key = kv[0].replace("?", "");
      let value: boolean|string = kv[1];
           if(value === "true") value = true;
      else if(value === "false") value = false;
      o[key] = value;
      return o;
   }, options);
   return o;
}

interface QueryStringOptions {
   restore?: boolean;
   load?: string;
   nic?: string;
   nodisk?: boolean;   
   notapemonitor?: boolean,
   scanlines?: boolean,
   saturation?: number,
   charset?: "english"|"bincode"|"german"|"french",
   bt?: number,
   bb?: number,
   bh?: number,
   rgbmaskopacity?: number,
   rgbmasksize?: number,
   keyboard_ITA?: boolean,
   aspect?: number
}

async function parseQueryStringCommands() {
   options = getQueryStringObject(options);

   if(options.restore !== false) {
      // try to restore previous state, if any
      restoreState();
   }

   const name = options.load;
   if(name !== undefined) {      
      setTimeout(async ()=>{
         wait_for_cursor();
         if(name.startsWith("http")) {
            // external load
            let bin = await externalLoad(name) as number[];
            loadBytes(bin);
            pasteLine("RUN\r\n");
         }
         else {
            // internal load
            await fetchProgram(name);
         }
      }, 500);
   }

   if(options.nic !== undefined) {
      // ?load=http://github.com/nippur72/laser500emu/blob/gh-pages/software/disks/vt-dos.nic
      const name = options.nic;
      if(name.startsWith("http")) {            
         const nic = await externalLoad(name) as Uint8Array; // TODO check
         await droppedFile(name, nic);
      }      
   }

   if(options.nodisk === true) {
      laser500.emulate_fdc = false;      
   }

   if(options.notapemonitor === true) {
      laser500.tape_monitor = false;      
   }

   /* TODO
   if(options.keyboard === "ITA") {
      keyboard_ITA = true;
   }   
   */

   if(options.saturation !== undefined) {
           if(options.saturation < 0) video.saturation = 0;
      else if(options.saturation > 1) video.saturation = 1;
      else                            video.saturation = options.saturation;   
      buildPalette();   
   }

   if(options.charset !== undefined) {
           if(options.charset == "english") laser500.charset_offset = 0;
      else if(options.charset == "bincode") laser500.charset_offset = 2048;
      else if(options.charset == "german")  laser500.charset_offset = 4096;
      else if(options.charset == "french")  laser500.charset_offset = 6144;
      else console.warn(`option charset=${options.charset} not recognized`);
   }

   if(options.bt !== undefined || 
      options.bb !== undefined || 
      options.bh !== undefined || 
      options.aspect !== undefined
   ) {
      if(options.bt     !== undefined) video.border_top    = Number(options.bt); 
      if(options.bb     !== undefined) video.border_bottom = Number(options.bb);
      if(options.bh     !== undefined) video.border_h      = Number(options.bh);
      if(options.aspect !== undefined) aspect              = Number(options.aspect);
      calculateGeometry();
      onResize();
   }

   if(options.rgbmaskopacity !== undefined || options.rgbmasksize !== undefined) {
      if(options.rgbmaskopacity !== undefined) video.rgbmask_opacity = Number(options.rgbmaskopacity);
      if(options.rgbmasksize    !== undefined) video.rgbmask_size    = Number(options.rgbmasksize);
      calculateGeometry();
      onResize();
   }
}

/*
async function fetchProgramAll(name) {
   const candidates = [
      name,
      `${name}.bin`,
      `${name}/${name}`,
      `${name}/${name}.bin`,      
      `bin/${name}`,
      `bin/${name}.bin`,
      `bin/${name}/${name}`,
      `bin/${name}/${name}.bin`      
   ];

   for(let t=0;t<candidates.length;t++) {
      if(await fetchProgram(candidates[t])) return;   
   }

   console.log(`cannot load "${name}"`);
}
*/

async function fetchProgram(name)
{
   //console.log(`wanting to load ${name}`);
   try
   {
      const response = await fetch(`software/${name}`);
      if(response.status === 404) return false;
      const bytes = new Uint8Array(await response.arrayBuffer());
      droppedFile(name, bytes);
      return true;
   }
   catch(err)
   {
      return false;      
   }
}

export function rewind_tape() {   
   laser500.tape.tapePtr = 0;
   laser500.tape.tapeHighPtr = 0;
}

export function stop_tape() {   
   laser500.tape.tapePtr = laser500.tape.tapeLen;   
}

/*
function downloadBytes(fileName, buffer) {
   let blob = new Blob([buffer], {type: "application/octet-stream"});
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}"`);
}
*/

function downloadRam(start, end) {
   const ram: number[] = [];
   for(let t=start; t<=end; t++) {
      ram.push(mem_read(t));            
   }
   downloadBytes(`ram.${hex(start,4)}-${hex(end,4)}.bin`, new Uint8Array(ram));
}

/* @@@ emulator.js */  
"use strict";


import { Audio } from "./audio";
import { BrowserStorage} from "./filesystem";
import { updateGamePad } from "./joystick";
import { charset, rom1, rom2 } from "./roms";
import { externalLoad } from "./mdawson";
import { Serial } from "./serial";
import { Tape } from "./tape";
import { mapped_io_read, mapped_io_write } from "./mapped_io";
import { keyDown, keyUp } from "./keys";

import { buildPalette } from "./video";
import { mem_read, mem_write, io_read, io_write, clear_bus_ops, get_bus_ops } from "./bus";
import { load, loadBytes } from "./files";
import { ConsolePrinter } from "./printer";

import { drives } from "./floppy";

//import { printer } from "./printer.mjs";

//import { z80_bundle } from "./z80_bundle.mjs";


// connect DOM events
document.onkeydown = keyDown;
document.onkeyup = keyUp;

// *** laser 500 hardware ***

export const laser500 = {
   // hardware registers
   cassette_bit_in: 0, 
   cassette_bit_out: 0,
   caps_lock_bit: 0,   
   speaker_A: 0,
   vdc_graphic_mode_enabled: 0,
   vdc_page_7: false,
   charset_offset: 0,
   
   banks: new Uint8Array(4),    // bank switching slots, done in the custom chip

   // 32K ROM
   // rom1,rom2 are defined in roms.js

   // bank 3 only on laser 350, makes it respond as 0xFF as in real hardware
   bank3: new Uint8Array(16384).fill(0xFF),

   // 64K RAM
   bank4: new Uint8Array(16384), // page 4
   bank5: new Uint8Array(16384), // page 5
   bank6: new Uint8Array(16384), // page 6
   bank7: new Uint8Array(16384), // page 7

   // Laser 700 additional 64K RAM
   bank8: new Uint8Array(16384).fill(0xFF),
   bank9: new Uint8Array(16384).fill(0xFF),
   bankA: new Uint8Array(16384).fill(0xFF),
   bankB: new Uint8Array(16384).fill(0xFF),

   // unused (cartridge)
   bankC: new Uint8Array(16384).fill(0x7F),
   bankD: new Uint8Array(16384).fill(0x7F),
   bankE: new Uint8Array(16384).fill(0x7F),
   bankF: new Uint8Array(16384).fill(0x7F),

   vdc_graphic_mode_number: 0,
   vdc_text80_enabled: 0,
   vdc_text80_foreground: 0,
   vdc_text80_background: 0,
   vdc_border_color: 0,
   
   speaker_B: 0,
   
   joystick_connected: true,
   
   emulate_fdc: true,
   tape_monitor: true,

   cpu: new Z80({ mem_read, mem_write, io_read, io_write }),

   printer: new ConsolePrinter(),
   tape: new Tape(),

   serial: new Serial(),

   csaving: false,   

   stopped: false, // allows to stop/resume the emulation

   drives: drives,

   isLaser350: false,
   isLaser500: true,
   isLaser700: false,

   power: function() {      
      zap();      
      setTimeout(()=>{
         laser500.cpu.reset()
         laser500.tape.reset();
      },200);
   },

   isImmediateMode: function () {
      return mem_read_word(0x803f) === 0xffff
   }   
};

export let storage = new BrowserStorage("laser500");

// publish globals
(window as any).csave    = laser500.tape.csave;
(window as any).cstop    = laser500.tape.cstop;
(window as any).dir      = ()   => storage.dir();
(window as any).remove   = (fn) => storage.remove(fn);
(window as any).download = (fn) => storage.download(fn);
(window as any).upload   = (fn) => storage.upload(fn);
(window as any).laser500 = laser500;

/******************/

const F14M = 14778730*(944/950);  // takes into account the 6 cycles lost in the HSYNC circuit
export const cpuSpeed = F14M / 4; 
const frameRate = F14M / (944*312);  // ~49.7 Hz
const frameDuration = 1000/frameRate;    // duration of 1 frame in msec
const cyclesPerLine = 944/4; 
const HIDDEN_LINES = 2;

let averageFrameTime = 0;
export function getAverageFrameTime() {
   return averageFrameTime;
}

let cycle = 0;
let total_cycles = 0;

let options: QueryStringOptions = {
   load: undefined,
   restore: false,
   nodisk: false,
   notapemonitor: false,
   scanlines: false,
   saturation: 1.0,
   charset: "english",
   bt: undefined,
   bb: undefined,
   bh: undefined,
   rgbmaskopacity: 0,
   rgbmasksize: 3,
   keyboard_ITA: false
};

/*
function cpuCycle() {
   if(debugBefore !== undefined) debugBefore();
   bus_ops = 0;
   let elapsed = cpu.run_instruction();         
   elapsed += bus_ops;
   if(debugAfter !== undefined) debugAfter(elapsed);
   cycle += elapsed;
   total_cycles += elapsed;
   writeAudioSamples(elapsed);
   cloadAudioSamples(elapsed); 
   if(csaving) csaveAudioSamples(elapsed);       
   return elapsed;
}
*/

function system_tick(nticks) {
   let count = 0;
   while(count<nticks) {
      if((window as any).debugBefore !== undefined) (window as any).debugBefore();
      clear_bus_ops();
      let elapsed = laser500.cpu.run_instruction();
      elapsed += get_bus_ops();
      if((window as any).debugAfter !== undefined) (window as any).debugAfter(elapsed);
      cycle += elapsed;
      total_cycles += elapsed;
      count += elapsed;

      writeAudioSamples(elapsed);
      laser500.tape.cloadAudioSamples(elapsed);
      if(laser500.csaving) laser500.tape.csaveAudioSamples(elapsed);

      if(cycle>=cyclesPerLine) {
         cycle-=cyclesPerLine;
         drawFrame_y();
         updateGamePad();
      }
   }
}

function renderAllLines() {
   system_tick(cyclesPerLine * 312);
}

/*
function renderAllLines() {
   if(hardware_screen) 
   {
      for(;;)
      {
         let elapsed = cpuCycle() * 4;
         for(let t=0;t<elapsed;t++) clockF14M();

         if(vdc_interrupt === 1) 
         {
            vdc_interrupt = 0;
            cpu.interrupt(false, 0);                   
            updateCanvas();
            break;
         }
      }
   }
   else
   {
      renderLines(HIDDEN_SCANLINES_TOP, true);               
      renderLines(SCREEN_H, false);                    
      renderLines(HIDDEN_SCANLINES_BOTTOM, true);               
   }
}
*/

let end_of_frame_hook = undefined;

let last_timestamp = 0;
export function oneFrame(timestamp) {
   let stamp = timestamp == undefined ? last_timestamp : timestamp;
   let msec = stamp - last_timestamp;
   let ncycles = cpuSpeed * msec / 1000;
   last_timestamp = stamp;

   if(msec > frameRate*2) ncycles = cpuSpeed * (frameRate*2 / 1000);

   system_tick(ncycles);

   averageFrameTime = averageFrameTime * 0.992 + msec * 0.008;

   if(!laser500.stopped) requestAnimationFrame(oneFrame);
}

// ****************************** CPU TO AUDIO BUFFER **********************************

const audioBufferSize = 4096; // enough to hold more than one frame time
const audioBuffer = new Float32Array(audioBufferSize);

let audioPtr = 0;                // points to the write position in the audio buffer (modulus)
let downSampleCounter = 0;       // counter used to downsample from CPU speed to 48 Khz

function writeAudioSamples(cpuCycles) {
   downSampleCounter += (cpuCycles * audio.sampleRate);
   if(downSampleCounter > cpuSpeed) {
      downSampleCounter -= cpuSpeed;

      // calculate sample
      let s = (laser500.speaker_A ? -0.5 : 0.0);
      if(laser500.tape_monitor) s += (laser500.cassette_bit_out ? 0.5 : 0.0) + (laser500.cassette_bit_in ? 0.0 : 0.5);

      // put sample in buffer
      audioBuffer[audioPtr++] = s;

      // if buffer is full, play it
      if(audioPtr >= audioBufferSize) {
         audio.playBuffer(audioBuffer);
         audioPtr = 0;
      }
   }
}

// *************************************************************************************

export let audio = new Audio(4096);
audio.start();

async function main() {
   // prints welcome message on the console
   // welcome();

   await parseQueryStringCommands();
   
   // starts drawing frames
   oneFrame(undefined);
   
   /*
   // autoload program and run it
   if(autoload !== undefined) {
      zap();
      laser500.cpu.reset();
      
      setTimeout(()=>{
         loadBytes(autoload);
         pasteLine("RUN\r\n");
      }, 200);
   }
   */
}

export function stop() {
   audio.stop();
   laser500.stopped = true;
   console.log("emulation stopped");
}

export function go() {
   laser500.stopped = false;
   oneFrame(undefined);
   console.log("emulation resumed");
}

let show_info = false;
export function info() {
   show_info = true;
   const average = getAverageFrameTime();
   // console.log(`frame rate: ${Math.round(average*10)/10} ms (${Math.round(1000/average)} Hz) CPU load: ${Math.round(averageLoad*10)/10}`);
   console.log(`frame rate: ${Math.round(average*10)/10} ms (${Math.round(1000/average)} Hz)`);
}

main();

import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { initializeIcons } from "@fluentui/react";

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons();

/*
import { EmulatorGUI } from "./GUI.mts";

const mountNode = document.getElementById("mountnode");
const root = createRoot(mountNode!);
root.render(createElement(EmulatorGUI));
*/

window.addEventListener("resize", onResize);
window.addEventListener("dblclick", goFullScreen);

onResize();
