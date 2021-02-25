"use strict";

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

// *** laser 500 hardware ***

// bank switching slots, done in the custom chip
const banks = new Uint8Array(4);

// 32K ROM
// rom1,rom2 are defined in roms.js

// 64K RAM
const bank4 = new Uint8Array(16384); // page 4
const bank5 = new Uint8Array(16384); // page 5
const bank6 = new Uint8Array(16384); // page 6
const bank7 = new Uint8Array(16384); // page 7

// bank 3 only on laser 350, makes it respond as 0xFF as in real hardware
const bank3 = new Uint8Array(16384).fill(0xFF);

// unused banks
const bank8 = new Uint8Array(16384).fill(0xFF); 
const bank9 = new Uint8Array(16384).fill(0xFF); 
const bankA = new Uint8Array(16384).fill(0xFF); 
const bankB = new Uint8Array(16384).fill(0xFF); 
const bankC = new Uint8Array(16384).fill(0x7F); 
const bankD = new Uint8Array(16384).fill(0x7F); 
const bankE = new Uint8Array(16384).fill(0x7F); 
const bankF = new Uint8Array(16384).fill(0x7F); 

let cassette_bit_in; 
let cassette_bit_out; 
let vdc_graphic_mode_enabled = 0;
let vdc_graphic_mode_number = 0;
let vdc_page_7 = 0;
let vdc_text80_enabled = 0;
let vdc_text80_foreground = 0;
let vdc_text80_background = 0;
let vdc_border_color = 0;
let speaker_A = 0;
let speaker_B = 0;
let joy0 = 255;
let joy1 = 255;
let caps_lock_bit = 0;

let emulate_fdc = true;
let tape_monitor = true;

let USE_WASM = false;

let cpu = new Z80({ mem_read, mem_write, io_read, io_write });

/******************/

const F14M = 14778730*(944/950);  // takes into account the 6 cycles lost in the HSYNC circuit
const cpuSpeed = F14M / 4; 
const frameRate = F14M / (944*312);  // ~49.7 Hz
const frameDuration = 1000/frameRate;    // duration of 1 frame in msec
const cyclesPerLine = 944/4; 
const HIDDEN_LINES = 2;

let stopped = false; // allows to stop/resume the emulation

let frames = 0;
let averageFrameTime = 0;

let cycle = 0;
let total_cycles = 0;

let keyboard_ITA = false;

let options = {
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
      if(debugBefore !== undefined) debugBefore();
      bus_ops = 0;
      let elapsed = cpu.run_instruction();
      elapsed += bus_ops;
      if(debugAfter !== undefined) debugAfter(elapsed);
      cycle += elapsed;
      total_cycles += elapsed;
      count += elapsed;

      writeAudioSamples(elapsed);
      cloadAudioSamples(elapsed);
      if(csaving) csaveAudioSamples(elapsed);

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
function oneFrame(timestamp) {
   let stamp = timestamp == undefined ? last_timestamp : timestamp;
   let msec = stamp - last_timestamp;
   let ncycles = cpuSpeed * msec / 1000;
   last_timestamp = stamp;

   if(msec > frameRate*2) ncycles = cpuSpeed * (frameRate*2 / 1000);

   system_tick(ncycles);

   averageFrameTime = averageFrameTime * 0.992 + msec * 0.008;

   if(!stopped) requestAnimationFrame(oneFrame);
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
      let s = (speaker_A ? -0.5 : 0.0);
      if(tape_monitor) s += (cassette_bit_out ? 0.5 : 0.0) + (cassette_bit_in ? 0.0 : 0.5);

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

let audio = new Audio(4096);
audio.start();

let storage = new BrowserStorage("laser500");

async function init() {
   cpu = await z80_bundle();
   if(USE_WASM) cpu.init();
   main();
}

async function main() {
   // prints welcome message on the console
   // welcome();

   await parseQueryStringCommands();
   
   // starts drawing frames
   oneFrame();
   
   // autoload program and run it
   if(autoload !== undefined) {
      zap();
      cpu.reset();
      
      setTimeout(()=>{
         loadBytes(autoload);
         pasteLine("RUN\r\n");
      }, 200);
   }
}

if(USE_WASM) init();
else main();
