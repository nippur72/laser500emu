"use strict";

// im0: data = first byte of instruction, other bytes from mem_read?
// im1: simple: call 0038H
// im2: complex

// TODO RGB mask does not survive F11 Zoom full screen
// TODO URLSearchParams()
// TODO requestAnimationFrame ?
// TODO gamepad api
// TODO tape stereo trick https://retrocomputing.stackexchange.com/questions/773/loading-zx-spectrum-tape-audio-in-a-post-cassette-world
// TODO inverted waveform option
// TODO remove software from facebook group
// TODO contrast/luminosity
// TODO fix bug introduced with audioContext.resume
// TODO experiment with keyboard buffer sync with frames
// TODO screen writing emulation as browser support
// TODO emulate true drive @300 RPM
// TODO display drive activity in canvas
// TODO publish Jaime's disks
// TODO turbotape check T-states, finalize 
// TODO finalize throttle / end of frame hook
// TODO finalize Z80.js fuse tests
// TODO disk drive sounds
// TODO finalize pasteLine/pasteText
// TODO LPRINT command communicate with emu or via OUT 255, RST $30 
// TODO use interrupts to communicate with z80
// TODO check t-states in Z80.js
// TODO save emulator snapshots?
// TODO slow mode, skip frames
// TODO draw keyboard for mobile
// TODO save to cloud ?
// TODO almost exact cycles drawing
// TODO investigate what does NMI (cpu.interrupt(true))
// TODO javascript debugger, halt
// TODO laser 350/700
// TODO cartdriges / rom expansion slots
// TODO laser 200 family? study vzem
// TODO Z80.js: port in assemblyscript
// TODO draw in webassembly
// TODO caplock key / led ?
// TODO visual/sound display of activity
// TODO wrap in electron app
// TODO verify cassette_bit I/O range on real HW
// TODO check colors with real hardware
// TODO options window (modal)
// TODO build of CP/M ?
// TODO be able to emulate CTRL+power up
// TODO sprite routine?

// TODO make again a speed test check:
// PASS: raster test with "raster_test.c"
// PASS: "tape_monitor.c" with 397.6 Hz wave
// PASS:* 1 FOR T=1 TO 2000:NEXT:SOUND 30,1:GOTO 1 (*emu skips frames)
// PASS: "PAL_frame_counter.c" with real machine
// TODO: "highpitch.c" measure frequency
// TODO: "tstates_counter.c" (improve program)
// TODO: SOUND 20, 10 measure frequency
// TODO: CSAVE wav file compare

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
let cassette_bit_out_l;
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
let io_bit_7 = 0;
let caps_lock_bit = 0;
let io_bit_4 = 0;

let emulate_fdc = true;
let tape_monitor = true;

let cpu = new Z80({ mem_read, mem_write, io_read, io_write });

/******************/

const frameRate = 49.7; // 50 Hz PAL standard
const frameDuration = 1000/frameRate; // duration of 1 frame in msec
const cpuSpeed = 3670200 /*3672000 for 312 */ //3694700; // Z80 speed 3.6947 MHz (NEC D780c)
const cyclesPerLine = (cpuSpeed / frameRate / TOTAL_SCANLINES); // 188.5=basic OK; 196=sound OK;
const HIDDEN_LINES = 2;

let stopped = false; // allows to stop/resume the emulation

// PAL Standard: 720 x 576

// 192 righe video + 96 bordo (48 sopra e 48 sotto) = 192+96 = 288 ; x2 = 576

let frames = 0;
let nextFrameTime = 0;
let averageFrameTime = 0;
let minFrameTime = Number.MAX_VALUE;

let cycle = 0;
let cycles = 0;

let throttle = false;

let options = {
   load: undefined,
   restore: true,
   nodisk: false,
   notapemonitor: false,
   scanlines: true,
   saturation: 1.0,
   charset: "english",
   bt: undefined,
   bb: undefined,
   bh: undefined,
   rgbmaskopacity: 0.15,
   rgbmasksize: 3
};

// scanline version
function renderLines(nlines, hidden) {
   for(let t=0; t<nlines; t++) {
      // draw video
      if(!hidden) drawFrame_y();

      // run cpu
      while(true) {         
         if(debugBefore !== undefined) debugBefore();
         bus_ops = 0;
         let elapsed = cpu.run_instruction();         
         elapsed += bus_ops;
         if(debugAfter !== undefined) debugAfter(elapsed);
         cycle += elapsed;
         cycles += elapsed;
         writeAudioSamples(elapsed);
         cloadAudioSamples(elapsed); 
         if(csaving) csaveAudioSamples(elapsed);       
         
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

   nextFrame = nextFrame + (1000/frameRate); // ~50Hz  

   renderAllLines();
   frames++;   

   if(end_of_frame_hook !== undefined) end_of_frame_hook();

   const now = new Date().getTime();
   const elapsed = now - startTime;
   averageFrameTime = averageFrameTime * 0.992 + elapsed * 0.008;
   if(elapsed < minFrameTime) minFrameTime = elapsed;

   let time_out = nextFrame - now;
   if(time_out < 0 || throttle) {
      time_out = 0;
      nextFrame = undefined;      
   }
   if(!stopped) setTimeout(()=>oneFrame(), time_out);   
}

// ********************************* CPU TO AUDIO BUFFER *********************************************

const audioBufferSize = 16384; // enough to hold more than one frame time
const audioBuffer = new Float32Array(audioBufferSize);

let audioPtr = 0;                // points to the write position in the audio buffer (modulus)
let audioPtr_unclipped = 0;      // audio buffer writing absolute counter 
let downSampleCounter = 0;       // counter used to downsample from CPU speed to 48 Khz

function writeAudioSamples(n) {
   downSampleCounter += (n * sampleRate);
   if(downSampleCounter >= cpuSpeed) {
      let s = (speaker_A ? -0.5 : 0.0);
      if(tape_monitor) s += (cassette_bit_out ? 0.5 : 0.0) + (cassette_bit_in ? 0.5 : 0.0);
      downSampleCounter -= cpuSpeed;
      audioBuffer[audioPtr++] = s;
      audioPtr = audioPtr % audioBufferSize;
      audioPtr_unclipped++;
   }      
}

// ********************************* AUDIO BUFFER TO BROWSER AUDIO ************************************

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bufferSize = 2048;
const sampleRate = audioContext.sampleRate;
var speakerSound = audioContext.createScriptProcessor(bufferSize, 1, 1);

let audioPlayPtr = 0;
let audioPlayPtr_unclipped = 0;

speakerSound.onaudioprocess = function(e) {
   const output = e.outputBuffer.getChannelData(0);

   // playback gone too far, wait   
   if(audioPlayPtr_unclipped + bufferSize > audioPtr_unclipped ) {
      for(let i=0; i<bufferSize; i++) output[i];
      return;
   }
  
   // playback what is in the audio buffer
   for(let i=0; i<bufferSize; i++) {
      const audio = audioBuffer[audioPlayPtr++];
      audioPlayPtr = audioPlayPtr % audioBufferSize;
      audioPlayPtr_unclipped++;
      output[i] = audio;
    }    
    
    // write pointer should be always ahead of reading pointer
    // if(kk++%50==0) console.log(`write: ${audioPtr_unclipped} read: ${audioPlayPtr_unclipped} diff: ${audioPtr_unclipped-audioPlayPtr_unclipped}`);
}

function goAudio() {
   audioPlayPtr_unclipped = 0;
   audioPlayPtr = 0;

   audioPtr = 0;
   audioPtr_unclipped = 0;

   speakerSound.connect(audioContext.destination);
}

function stopAudio() {
   speakerSound.disconnect(audioContext.destination);
}

function audioContextResume() {   
   if(audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
         console.log('sound playback resumed successfully');
      });
   }
}

goAudio();


/*********************************************************************************** */

let tapeSampleRate = 0;
let tapeBuffer = new Float32Array(0);
let tapeLen = 0;
let tapePtr = 0;
let tapeHighPtr = 0;

function cloadAudioSamples(n) {
   if(tapePtr >= tapeLen) {
      cassette_bit_in = 1;
      return;
   }

   tapeHighPtr += (n*tapeSampleRate);
   if(tapeHighPtr >= cpuSpeed) {
      tapeHighPtr-=cpuSpeed;
      cassette_bit_in = tapeBuffer[tapePtr] > 0 ? 1 : 0;
      tapePtr++;      
   }
}

// ********************************* CPU TO CSAVE BUFFER *********************************************

const csaveBufferSize = 44100 * 5 * 60; // five minutes max

let csaveBuffer;                 // holds the tape audio for generating the WAV file
let csavePtr;                    // points to the write position in the csaveo buffer 
let csaveDownSampleCounter;      // counter used to downsample from CPU speed to 48 Khz

let csaving = false;

function csaveAudioSamples(n) {
   csaveDownSampleCounter += (n * 44100);
   if(csaveDownSampleCounter >= cpuSpeed) {
      const s = (cassette_bit_out ? 0.75 : -0.75);
      csaveDownSampleCounter -= cpuSpeed;
      csaveBuffer[csavePtr++] = s;
   }      
}

function csave() {
   csavePtr = 0;
   csaveDownSampleCounter = 0;
   csaveBuffer = new Float32Array(csaveBufferSize);
   csaving = true;
   console.log("saving audio (max 5 minutes); use cstop() to stop recording");
}

function cstop() {
   csaving = false;

   // trim silence before and after
   const start = csaveBuffer.indexOf(0.75);
   const end = csaveBuffer.lastIndexOf(0.75);   

   const audio = csaveBuffer.slice(start, end);
   const length = Math.round(audio.length / 44100);
   
   const wavData = {
      sampleRate: 44100,
      channelData: [ audio ]
   };
     
   const buffer = encodeSync(wavData, { bitDepth: 16, float: false });      
   
   let blob = new Blob([buffer], {type: "application/octet-stream"});   
   const fileName = "csaved.wav";
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}" (${length} seconds of audio)`);
}

/*********************************************************************************** */

// prints welcome message on the console
welcome();

parseQueryStringCommands();

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
