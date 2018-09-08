"use strict";

// TODO caplock key / led ?
// TODO non maskeable interrupt
// TODO reset key=

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
const banks    = new Uint8Array([0,1,4,5]);

let cassette_bit = 0; 
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

console.log("emulator started");

let DEBUG = false;
let maxdebug = 2000;
DEBUG = false;

//console.log(hexDump(videoram, 0x3800, 0x3FFF, 16));

/******************/

const frameRate = 50; // 50 Hz PAL standard
const frameDuration = 1000/frameRate; // duration of 1 frame in msec
const cpuSpeed = 3694700; // Z80 speed 3.6947 MHz (NEC D780c)
const cyclesPerFrame = cpuSpeed / frameDuration; // 184735 but it's just an estimation

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

   setTimeout(()=>oneFrame(), timeWaitUntilNextFrame);   
}

// starts drawing frames
oneFrame();

