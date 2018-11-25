"use strict";

// im0: data = first byte of instruction, other bytes from mem_read?
// im1: simple: call 0038H
// im2: complex

// TODO exomizer: standalone Z80 verify of decrunch
// TODO emulate true drive @300 RPM
// TODO verify CSAVE file name length
// TODO check sound buffer
// TODO change localStorage to use https://github.com/ebidel/idb.filesystem.js/
// TODO publish Jaime's disks
// TODO turbotape finalize / puchrunch, aplib, exomizer
// TODO finalize throttle / end of frame hook
// TODO disk drive sounds
// TODO finalize pasteLine/pasteText
// TODO LPRINT command communicate with emu or via OUT 255
// TODO check t-states in Z80.js
// TODO save emulator snapshots?
// TODO no double scanline (options)
// TODO slow mode, skip frames
// TODO logical keyboard vs original keyboard
// TODO draw keyboard for mobile
// TODO save to cloud ?
// TODO almost exact cycles drawing
// TODO investigate what does NMI (cpu.interrupt(true))
// TODO autoload programs for fast develop
// TODO javascript debugger, halt
// TODO use interrupts to communicate with emulator
// TODO CSAVE to WAV export
// TODO laser 350/700
// TODO cartdriges / rom expansion slots
// TODO laser 200 family? study vzem
// TODO Z80.js: port in assemblyscript
// TODO Z80.js: complete fuse tests
// TODO draw in webassembly
// TODO caplock key / led ?
// TODO visual/sound display of activity
// TODO wrap in electron app
// TODO verify cassette_bit I/O range on real HW
// TODO check colors with real hardware
// TODO options window (modal)
// TODO investigate port 13h reads, emulate floppy
// TODO build of CP/M ?
// TODO be able to emulate CTRL+power up
// TODO sprite routine?

// speed test check:
// PASS: raster test with "raster_test.c"
// PASS: "tape_monitor.c" with 397.6 Hz wave
// PASS:* 1 FOR T=1 TO 2000:NEXT:SOUND 30,1:GOTO 1 (*emu skips frames)
// PASS: "PAL_frame_counter.c" with real machine
// TODO: "highpitch.c" measure frequency
// TODO: "tstates_counter.c" (improve program)
// TODO: SOUND 20, 10 measure frequency
// TODO: CSAVE wav file compare

// *** laser 500 hardware ***

// rom1,rom2 are defined in roms.js
const bank4     = new Uint8Array(16384); // page 4
const bank5     = new Uint8Array(16384); // page 5
const bank6     = new Uint8Array(16384); // page 6
const bank7 = new Uint8Array(16384); // page 7
const banks    = new Uint8Array(4);

// page 3 only on laser 350 
const bank3    = new Uint8Array(16384);
// makes page 3 respond as 0xFF as in real hardware
bank3.forEach((e,i)=>bank3[i]=0xFF); 

const bank8    = new Uint8Array(16384); bank8.forEach((e,i)=>bank8[i]=0xFF); 
const bank9    = new Uint8Array(16384); bank9.forEach((e,i)=>bank9[i]=0xFF); 
const bankA    = new Uint8Array(16384); bankA.forEach((e,i)=>bankA[i]=0xFF); 
const bankB    = new Uint8Array(16384); bankB.forEach((e,i)=>bankB[i]=0xFF); 
const bankC    = new Uint8Array(16384); bankC.forEach((e,i)=>bankC[i]=0x7F); 
const bankD    = new Uint8Array(16384); bankD.forEach((e,i)=>bankD[i]=0x7F); 
const bankE    = new Uint8Array(16384); bankE.forEach((e,i)=>bankE[i]=0x7F); 
const bankF    = new Uint8Array(16384); bankF.forEach((e,i)=>bankF[i]=0x7F); 

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
let joy0 = 255;
let joy1 = 255;
let emulate_fdc = true;

let cpu = new Z80({ mem_read, mem_write, io_read, io_write });

/******************/

const frameRate = 49.7; // 50 Hz PAL standard
const frameDuration = 1000/frameRate; // duration of 1 frame in msec
const cpuSpeed = 3672000 /*3672000 for 312 */ //3694700; // Z80 speed 3.6947 MHz (NEC D780c)
const cyclesPerLine = (cpuSpeed / frameRate / TOTAL_SCANLINES); // 188.5=basic OK; 196=sound OK;
const HIDDEN_LINES = 2;
const cpuSampleRate = (TOTAL_SCANLINES * cyclesPerLine) * frameRate;

let stopped = false; // allows to stop/resume the emulation

// PAL Standard: 720 x 576

// 192 righe video + 96 bordo (48 sopra e 48 sotto) = 192+96 = 288 ; x2 = 576

let frames = 0;
let nextFrameTime = 0;
let averageFrameTime = 0;

let cycle = 0;
let cycles = 0;

let throttle = false;

let options = {
   load: undefined,
   restore: true,
   nodisk: false,
   scanlines: true,
   charset: "english"
};

// scanline version
function renderLines(nlines, hidden) {
   for(let t=0; t<nlines; t++) {
      // draw video
      if(!hidden) drawFrame_y();

      // run cpu
      while(true) {
         bus_ops = 0;
         if(debugBefore !== undefined) debugBefore();
         let elapsed = cpu.run_instruction();
         if(debugBefore !== undefined) debugAfter(elapsed);
         elapsed += bus_ops;
         cycle += elapsed;
         cycles += elapsed;
         writeAudioSamples(elapsed);
         playBackAudioSamples(elapsed);         
         
         if(cycle>=cyclesPerLine) {
            cycle-=cyclesPerLine;
            break;            
         }
      } 
   }
}

/*
// versione cycle exact
function renderAllLines() {   
   while(raster_y < SCREEN_H) 
   {
      const elapsed = cpu.run_instruction();
      writeAudioSamples(elapsed);
      cycle += elapsed * 720;
      while(cycle > 0) {
         drawEight();
         cycle -= 1520;
      }
      //console.log(raster_y, SCREEN_H)   ;
      //if(zz++ % 30590 === 0) break;
   }
   
   cpu.interrupt(false, 0);                  

   
   //cycle += PAL_HIDDEN_LINES_VERY_BOTTOM * cyclesPerLine;
   ////while(cycle > 0) 
   //{
   //   const elapsed = cpu.run_instruction();
   //   writeAudioSamples(elapsed);
   //   cycle -= elapsed;
   //}
      
   raster_y = 0;
}
*/

function renderAllLines() {   
   cpu.interrupt(false, 0);                         // generate VDC interrupt
   renderLines(HIDDEN_SCANLINES_TOP, true);               
   renderLines(SCREEN_H, false);                    
   renderLines(HIDDEN_SCANLINES_BOTTOM, true);               
}

let nextFrame;
let end_of_frame_hook = undefined;

function oneFrame() {   
   const startTime = new Date().getTime();      

   if(nextFrame === undefined) nextFrame = startTime;

   nextFrame = nextFrame + 20; // 20ms, 50Hz  

   renderAllLines();
   frames++;   

   if(end_of_frame_hook !== undefined) end_of_frame_hook();

   const now = new Date().getTime();
   const elapsed = now - startTime;
   averageFrameTime = averageFrameTime * 0.99 + elapsed * 0.01;

   let time_out = nextFrame - now;
   if(time_out < 0 || throttle) {
      time_out = 0;
      nextFrame = undefined;      
   }
   if(!stopped) setTimeout(()=>oneFrame(), time_out);   
}

/*********************************************************************************** */

const audioBufferSize = 16384; // enough to hold more than one frame time
const audioBuffer = new Float32Array(audioBufferSize);

let samplePtr = 0; // high speed pointer used to downsample
let audioPtr = 0;  // pointer at audio frequency
let audioPlayPtr = 0;
let audioPtr_unclipped = 0;
let audioPlayPtr_unclipped = 0;

let initialSync = false;

function writeAudioSamples(n) {
   samplePtr += (n * sampleRate);
   if(samplePtr > cpuSampleRate) {      
      const s = (speaker_A ? -0.5 : 0.0) + (cassette_bit_out ? 0.5 : 0.0) + (cassette_bit_in ? 0.5 : 0.0);
      samplePtr -= cpuSampleRate;
      audioBuffer[audioPtr++] = s;
      audioPtr = audioPtr % audioBufferSize;
      audioPtr_unclipped++;
   }      
}

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bufferSize = 2048;
const sampleRate = audioContext.sampleRate;
var speakerSound = audioContext.createScriptProcessor(bufferSize, 1, 1);

speakerSound.onaudioprocess = function(e) {
   if(audioPtr_unclipped < (audioPlayPtr_unclipped + bufferSize)) {
      // console.warn(`audio buffer not filled: ${audioPtr_unclipped} < ${audioPlayPtr_unclipped + bufferSize}, behind ${audioPtr_unclipped - (audioPlayPtr_unclipped + bufferSize)}`);
      return; 
   }   

   const output = e.outputBuffer.getChannelData(0);
   for(let i=0; i<bufferSize; i++) {
      const audio = audioBuffer[audioPlayPtr++];
      audioPlayPtr = audioPlayPtr % audioBufferSize;
      audioPlayPtr_unclipped++;
      output[i] = audio;
    }        
}

speakerSound.connect(audioContext.destination);

function ss() {
   speakerSound.disconnect(audioContext.destination);
}

/*********************************************************************************** */

let tapeSampleRate = 0;
let tapeBuffer = new Float32Array(0);
let tapeLen = 0;
let tapePtr = 0;
let tapeHighPtr = 0;

function playBackAudioSamples(n) {
   if(tapePtr >= tapeLen) return;

   tapeHighPtr += (n*tapeSampleRate);
   if(tapeHighPtr >= cpuSampleRate) {
      tapeHighPtr-=cpuSampleRate;
      cassette_bit_in = tapeBuffer[tapePtr] > 0 ? 0 : 1;
      tapePtr++;
      //if(tapePtr % 44100 === 0) console.log(tapePtr);
   }

   /*
   tapeHighPtr +=  tapeSampleRate;
   if(tapeHighPtr > cpuSampleRate) {      
      const s = (speaker_A ? -0.5 : 0.0) + (cassette_bit_out ? 0.5 : 0.0);
      samplePtr -= cpuSampleRate;

      audioBuffer[audioPtr++] = s;
      audioPtr = audioPtr % audioBufferSize;
      audioPtr_unclipped++;
   } 
   */     
}

/*********************************************************************************** */

// prints welcome message on the console
welcome();

parseQueryStringCommands();

// starts drawing frames
oneFrame();

