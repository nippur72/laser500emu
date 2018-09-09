"use strict";

// TODO caplock key / led ?
// TODO reset key bug report in MAME
// TODO lprint

/*
interface Z80 
{
   reset();                       // Resets the processor. This need not be called at power-up, but it can be.
   run_instruction(): number;     // Runs the instruction and return elapsed cycles 
   interrupt(non_maskable, data); // Triggers an interrupt.
}
*/

// *** laser 500 hardware ***

// rom1,rom2 are defined in roms.js
const ram1     = new Uint8Array(16384);
const ram2     = new Uint8Array(16384);
const videoram = new Uint8Array(16384);
const banks    = new Uint8Array(4);

let cassette_bit_in = 1; 
let cassette_bit_out = 0; 
let vdc_graphic_mode_enabled = 0;
let vdc_graphic_mode_number = 0;
let vdc_page_7 = 0;
let vdc_text80_enabled = 0;
let vdc_text80_foreground = 0;
let vdc_text80_background = 0;
let vdc_border_color = 0;
let speaker_A = 0;
let speaker_B = 0;

let cpu = new Z80({ mem_read, mem_write, io_read, io_write });

//console.log(hexDump(videoram, 0x3800, 0x3FFF, 16));

/******************/

const frameRate = 50; // 50 Hz PAL standard
const frameDuration = 1000/frameRate; // duration of 1 frame in msec
const cpuSpeed = 3694700; // Z80 speed 3.6947 MHz (NEC D780c)
const cyclesPerFrame = (cpuSpeed / frameDuration) / 3.08; // 

let stopped = false; // allows to stop/resume the emulation

// PAL Standard: 720 x 576

// 192 righe video + 96 bordo (48 sopra e 48 sotto) = 192+96 = 288 ; x2 = 576

let nextFrameTime = 0;
function oneFrame() {
   const startTime = new Date().getTime();
   
   // execute cpu for all video frames
   for(let cycle=0; cycle<cyclesPerFrame; cycle += cpu.run_instruction());         
   
   drawFrame();

   cpu.interrupt(false, 0);

   /*
   this.oneFrameTimeSum += new Date().getTime()-startTime;
   if(this.timeloop--==0) {
         if(Config.updateFrame!==undefined) {
            Config.updateFrame((this.oneFrameTimeSum/100) + " ms");
         }

         this.oneFrameTimeSum = 0;
         this.timeloop = 100;
      }
   }
   */

   // Wait until next frame
   const now = new Date().getTime();
   let timeWaitUntilNextFrame = nextFrameTime - now;
   if (timeWaitUntilNextFrame < 0) {
      timeWaitUntilNextFrame = 0;
      nextFrameTime = now + frameDuration;
   } else {
      nextFrameTime += frameDuration;
   }

   if(!stopped) setTimeout(()=>oneFrame(), timeWaitUntilNextFrame);   
}

// starts drawing frames
oneFrame();

console.info("Welcome to the Video Technology Laser 500 emulator");
console.info("To load files into the emulator, drag & drop a file over the screen");
console.info("From the console you can use the following functions:");
console.info("");
console.info("    csave(name[,start,end])");
console.info("    cload(name)");
console.info("    cdir()");
console.info("    cdel(name)");
console.info("");
console.info("Loaded and saved files are also stored permanently on the browser memory");
console.info("Printer is emulated by printing on the JavaScript console (here)");
console.info("Reset key is Ctrl+Break");
console.info("");
console.info("Emulation is still in development");
console.info("");
console.info("");

