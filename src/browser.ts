/* browser.ts */
// handles interaction between browser and emulation

import { getFileExtension, uint8ToString } from "./bytes";
import { video, buildPalette, calculateGeometry } from "./video";
import { pasteBasic, pasteLine } from "./paste";
import { fetchFile } from "./externalLoad";
import { loadBytes } from "./files";
import { Drive } from "./floppy";
import { laser500, audio, oneFrame, saveState, wait_for_cursor } from "./emulator";

// **** canvas aspect ratio ****

let aspect = 1.55;

export function onResize() {
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
      console.log("WAV file dropped");

      laser500.tape.load_wav_file(droppedFileName, bytes.buffer);

      // CRUN run only if in immediate mode
      if(laser500.isImmediateMode()) pasteLine("CRUN\r\n");
            
      return;
   }

   if(ext === ".nic") {
      console.log("floppy disk (.nic file) dropped");
      // mount directly, same as the GUI does
      laser500.drives[0] = new Drive(bytes, droppedFileName);
      return;
   }

   if(ext === ".bin") {
      // load raw bytes directly into RAM (BASIC start 0x8995) and run
      loadBytes(Array.from(bytes), undefined, droppedFileName);
      laser500.cpu.reset();
      pasteLine("RUN\r\n");
      return;
   }

   if(ext === ".bas") {
      pasteBasic(uint8ToString(bytes));
      return;
   }
}

// **** charset ****

export type CharsetOption = "english" | "german" | "french" | "bincode";

export function setCharset(charset: CharsetOption | string) {
   if (charset === "english") laser500.charset_offset = 0;
   else if (charset === "bincode") laser500.charset_offset = 2048;
   else if (charset === "german") laser500.charset_offset = 4096;
   else if (charset === "french") laser500.charset_offset = 6144;
   else console.warn(`option charset=${charset} not recognized`);
}

export function getCharset(): CharsetOption {
   if (laser500.charset_offset === 4096) return "german";
   if (laser500.charset_offset === 6144) return "french";
   if (laser500.charset_offset === 2048) return "bincode";
   return "english";
}

// **** tape controls ****

export function rewind_tape() {   
   laser500.tape.tapePtr = 0;
   laser500.tape.tapeHighPtr = 0;
}

export function stop_tape() {   
   laser500.tape.tapePtr = laser500.tape.tapeLen;   
}

// **** query string options ****

interface QueryStringOptions {
   load?: string;          // program to load and run at startup (URL or software/ path)
   nic?: string;           // disk image (.nic) to mount at startup (URL)
   fd1?: string;           // disk image (.nic) to mount on drive 1 (URL or software/ path)
   fd2?: string;           // disk image (.nic) to mount on drive 2 (URL or software/ path)
   nodisk?: boolean;       // start with the floppy disk controller detached
   notapemonitor?: boolean;// start with tape monitor audio disabled
   nodrivesound?: boolean;  // start with drive head sound disabled
   scanlines?: boolean,    // (parsed but currently unused) scanline effect
   saturation?: number,    // color saturation 0..1 (1 = full color)
   charset?: "english"|"bincode"|"german"|"french", // character ROM variant
   bt?: number,            // border top scanlines (0..65)
   bb?: number,            // border bottom scanlines (0..56)
   bh?: number,            // border horizontal width (0..40)
   keyboard_ITA?: boolean, // Italian keyboard layout (unused)
   aspect?: number         // canvas aspect ratio override
}

let options: QueryStringOptions = {
   load: undefined,
   nodisk: false,
   notapemonitor: false,
   nodrivesound: false,
   scanlines: false,
   saturation: 1.0,
   charset: "english",
   bt: undefined,
   bb: undefined,
   bh: undefined,
   keyboard_ITA: false
};

function getQueryStringObject(options) {
   const params = new URLSearchParams(window.location.search);
   for (const [key, value] of params) {
      if (value === "true") options[key] = true;
      else if (value === "false") options[key] = false;
      else options[key] = value;
   }
   return options;
}

export async function parseQueryStringCommands() {
   options = getQueryStringObject(options);

   const name = options.load;
   if(name !== undefined) {      
      setTimeout(async ()=>{
         wait_for_cursor();
         const bytes = await fetchFile(name);
         if(bytes !== undefined) {
            await droppedFile(name, bytes);
         }
      }, 500);
   }

    if (options.nic === undefined && options.fd1 === undefined) {
       options.nic = "disks/vt-dos-11-dd.nic";
    }

    if(options.nic !== undefined) {
       // ?nic=http://github.com/nippur72/laser500emu/blob/gh-pages/software/disks/vt-dos.nic
       const name = options.nic;
       const nic = await fetchFile(name);
       if(nic !== undefined) {
          await droppedFile(name, nic);
       }
    }

    if(options.fd1 !== undefined) {
       const name = options.fd1;
       const nic = await fetchFile(name);
       if(nic !== undefined) {
          laser500.drives[0] = new Drive(nic, name);
       }
    }

   if(options.fd2 !== undefined) {
      const name = options.fd2;
      const nic = await fetchFile(name);
      if(nic !== undefined) {
         laser500.drives[1] = new Drive(nic, name);
      }
   }

   if(options.nodisk === true) {
      laser500.emulate_fdc = false;      
   }

   if(options.notapemonitor === true) {
      laser500.tape_monitor = false;      
   }

   if(options.nodrivesound === true) {
      laser500.drive_sound = false;
   }

   if(options.saturation !== undefined) {
           if(options.saturation < 0) video.saturation = 0;
      else if(options.saturation > 1) video.saturation = 1;
      else                            video.saturation = options.saturation;   
      buildPalette();   
   }

   if(options.charset !== undefined) {
      setCharset(options.charset);
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
}

// **** resize and fullscreen events ****

window.addEventListener("resize", onResize);
window.addEventListener("dblclick", goFullScreen);

onResize();
