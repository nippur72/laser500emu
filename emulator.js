"use strict";

// TODO page3/page7 OUT 44, 3 verificare real hardware
// TODO save state does not save Z80 state

// TODO caplock key / led ?
// TODO exact cyles
// TODO sound
// TODO cassette
// TODO floppy?
// TODO visual/sound display of activity
// TODO wrap in electron app
// TODO Z80 and video in WebAssembly
// TODO save to cloud / fetch()
// TODO verificare range indirizzi di cassette_bit 
// TODO rename ram1, ram2 to page
// TODO some way of pasting text
// TODO drag & drop autorun

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
const cyclesPerFrame = (cpuSpeed / frameDuration) / 3.08; // 
const cyclesPerLine = cyclesPerFrame / SCREEN_H;  

let stopped = false; // allows to stop/resume the emulation

// PAL Standard: 720 x 576

// 192 righe video + 96 bordo (48 sopra e 48 sotto) = 192+96 = 288 ; x2 = 576

let frames = 0;
let oneFrameTimeSum = 0;
let nextFrameTime = 0;

let soundCycle = 0;
let cycle = 0;

function oneFrame() {
   const startTime = new Date().getTime();

   for(let t=0;t<SCREEN_H;t++) {
      // draw video
      drawFrame_y();

      // run cpu
      while(true) {
         const elapsed = cpu.run_instruction();
         cycle += elapsed;
         if(cycle>=cyclesPerLine)
         {
            cycle-=cyclesPerLine;
            break;            
         }
      } 
   }

   /*
   // execute cpu for all video frames
   for(let cycle=0; cycle<cyclesPerFrame;)
   {
      const elapsed = cpu.run_instruction();
      cycle += elapsed;
      
      //soundCycle += elapsed;
      //if(soundCycle>80) {
      //   writeAudio(cassette_bit_out-0.5);
      //   soundCycle-=80;
      //}
      
   }      
   drawFrame();
   */

   frames++;

   cpu.interrupt(false, 0);

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


console.info("Welcome to the Video Technology Laser 500 emulator");
console.info("To load files into the emulator, drag & drop a file over the screen");
console.info("From the console you can use the following functions:");
console.info("");
console.info("    csave(name[,start,end])");
console.info("    cload(name)");
console.info("    cdir()");
console.info("    cdel(name)");
console.info("    info()");
console.info("    stop()");
console.info("    go()");
console.info("    power()");
console.info("");
console.info("Loaded and saved files are also stored permanently on the browser memory");
console.info("Printer is emulated by printing on the JavaScript console (here)");
console.info("Reset key is Ctrl+Break");
console.info("Currently only italian keyboard is mapped.");
console.info("");
console.info("Emulation is still in development");
console.info("");
console.info("");

/*
// Offset into sndData for next sound sample. 
var sndCount = 0;
var sndReadCount = 0;
var cs = 0;

// Buffer for sound event messages.
var renderingBufferSize = 8192;
var mask = renderingBufferSize-1;
var renderingBuffer;
var vicSoundRenderRate = 80000;

var sampleRate;
sampleRate = this.audioContext.sampleRate;
cs += sampleRate;
if (cs>=vicSoundRenderRate) {
   cs-=vicSoundRenderRate;
   var plus1 = (sndCount+1)&mask;
   if (plus1!=sndReadCount) {
      renderingBuffer[sndCount] = sound;
      sndCount=plus1;
   }
}
*/

/*
const renderingBufferSize = 2048;
const mask = renderingBufferSize - 1;
const renderingBuffer = new Float32Array(renderingBufferSize);
let renderingPtr = 0;

function writeAudio(sample) {
   renderingBuffer[renderingPtr] = sample;
   renderingPtr = (renderingPtr + 1) & mask;   
} 

for(let t=0;t<renderingBufferSize;t++) writeAudio(Math.sin(t/20));

//

let bufferSize = 2048;
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var speakerSound = audioContext.createScriptProcessor(bufferSize, 1, 1);

speakerSound.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);
    for(let i=0,j=renderingPtr; i<bufferSize; i++, j=((j+1) & mask)) {
        output[i] = renderingBuffer[j];                
        renderingBuffer[j] = 0;
    }
}

speakerSound.connect(audioContext.destination);

function ss() {
   speakerSound.disconnect(audioContext.destination);
}


//

*/

restoreState();

// starts drawing frames
oneFrame();
