"use strict";

// TODO load WAV from cassette or mic
// TODO javascript debugger, halt
// TODO laser 350
// TODO laser 700
// TODO rename ram1, ram2 to page
// TODO laser 200 family?
// TODO Z80js, port in ES6 then webassembly
// TODO draw in webassembly
// TODO Z80 and video in WebAssembly
// TODO caplock key / led ?
// TODO visual/sound display of activity
// TODO wrap in electron app
// TODO save to cloud / fetch()
// TODO verificare range indirizzi di cassette_bit 
// TODO some way of pasting text
// TODO interrupt routine test
// TODO check colors with real hardware
// TODO options window (modal)
// TODO options from URL &parameters
// TODO investigate port 13h reads
// TODO emulate floppy
// TODO build of CP/M ?

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
const ram1     = new Uint8Array(16384); // page 4
const ram2     = new Uint8Array(16384); // page 5
const ram3     = new Uint8Array(16384); // page 6
const videoram = new Uint8Array(16384); // page 7
const banks    = new Uint8Array(4);

// page 3 only on laser 350 
const page3    = new Uint8Array(16384);

// makes page 3 respond as 0xFF as in real hardware
page3.forEach((e,i)=>page3[i]=0xFF); 

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

let cpu = new Z80({ mem_read, mem_write, io_read, io_write });

/******************/

const frameRate = 50; // 50 Hz PAL standard
const frameDuration = 1000/frameRate; // duration of 1 frame in msec
const cpuSpeed = 3694700; // Z80 speed 3.6947 MHz (NEC D780c)
const cyclesPerFrame = (cpuSpeed / frameDuration) / 3.5; // 
const cyclesPerLine = 190;
const cpuSampleRate = cyclesPerLine * TOTAL_SCANLINES * frameRate;

let stopped = false; // allows to stop/resume the emulation

// PAL Standard: 720 x 576

// 192 righe video + 96 bordo (48 sopra e 48 sotto) = 192+96 = 288 ; x2 = 576

let frames = 0;
let oneFrameTimeSum = 0;
let nextFrameTime = 0;

let cycle = 0;

function renderLines(nlines, hidden) {
   for(let t=0; t<nlines; t++) {
      // draw video
      if(!hidden) drawFrame_y();

      // run cpu
      while(true) {
         const elapsed = cpu.run_instruction();
         cycle += elapsed;
         writeAudioSample(elapsed);
         
         if(cycle>=cyclesPerLine) {
            cycle-=cyclesPerLine;
            break;            
         }
      } 
   }
}

function oneFrame() {
   const startTime = new Date().getTime();      

   renderLines(HIDDEN_SCANLINES_TOP, true);         // hidden lines at top
   renderLines(SCREEN_H, false);                    // screen
   renderLines(HIDDEN_SCANLINES_BOTTOM, true);      // hidden lines at bottom   
   cpu.interrupt(false, 0);                         // generate VDC interrupt
   renderLines(PAL_HIDDEN_LINES_VERY_BOTTOM, true); // hidden lines at bottom

   frames++;   

   // Wait until next frame
   const now = new Date().getTime();
   let timeWaitUntilNextFrame = nextFrameTime - now;
   if (timeWaitUntilNextFrame < 0) {
      timeWaitUntilNextFrame = 0;
      nextFrameTime = now + frameDuration;
   } else {
      nextFrameTime += frameDuration;
   }
   
   oneFrameTimeSum += now - startTime;

   if(!stopped) setTimeout(()=>oneFrame(), timeWaitUntilNextFrame);   
}

/*********************************************************************************** */

const audioBufferSize = 16384; // enough to hold more than one frame time
const audioBuffer = new Uint8Array(audioBufferSize);

let samplePtr = 0; // high speed pointer used to downsample
let audioPtr = 0;  // pointer at audio frequency
let audioPlayPtr = 0;
let audioPtr_unclipped = 0;
let audioPlayPtr_unclipped = 0;

let initialSync = false;

function writeAudioSample(n) {
   samplePtr += (n * sampleRate);
   if(samplePtr > cpuSampleRate) {
      const s = (speaker_A ? 0.5 : -0.5) + (cassette_bit_out ? 0.5 : -0.5);
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

let maxBufferUnderruns = 15;

speakerSound.onaudioprocess = function(e) {
   if(initialSync === false) {      
      if(audioPtr < (audioPlayPtr + bufferSize)) return; // buffer still not filled      
      initialSync = true;
   }

   const output = e.outputBuffer.getChannelData(0);
   for(let i=0; i<bufferSize; i++) {
      const audio = audioBuffer[audioPlayPtr++];
      audioPlayPtr = audioPlayPtr % audioBufferSize;
      audioPlayPtr_unclipped++;
      output[i] = audio;
      if(audioPlayPtr_unclipped >= audioPtr_unclipped) {
         //console.log(`audio buffer underrun ${maxBufferUnderruns}`);
         initialSync = false;
         audioPlayPtr = 0;
         audioPlayPtr = 0;
         maxBufferUnderruns--;
         if(maxBufferUnderruns === 0) {
            // if too many under runs disable audio altogether
            console.warn("too many audio buffer underrun, audio will be disabled");
            speakerSound.disconnect(audioContext.destination);
         }
         return;
      }
    }        
}

speakerSound.connect(audioContext.destination);

function ss() {
   speakerSound.disconnect(audioContext.destination);
}

/*********************************************************************************** */


// laser_drive_init();

welcome();

restoreState();

// starts drawing frames
oneFrame();

