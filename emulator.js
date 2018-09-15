"use strict";

// TODO javascript debugger, halt
// TODO laser 350/700
// TODO rename ram1, ram2 to page
// TODO laser 200 family?
// TODO Z80js, port in ES6 then webassembly
// TODO draw in webassembly
// TODO Z80 and video in WebAssembly
// TODO save state does not save Z80 state
// TODO caplock key / led ?
// TODO sound
// TODO cassette
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

/*
const Z80SampleRate = cyclesPerLine * TOTAL_SCANLINES * frameRate;
let Z80SoundPtr = 0;
let audioSoundPtr = 0;
*/

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

   // hidden lines at top
   for(let t=0;t<HIDDEN_SCANLINES_TOP;t++) {
      // run cpu
      while(true) {
         const elapsed = cpu.run_instruction();
         cycle += elapsed;
         //for(let j=0;j<elapsed;j++) depositAudio(0);
         if(cycle>=cyclesPerLine) {
            cycle-=cyclesPerLine;
            break;            
         }
      } 
   }

   for(let t=0;t<SCREEN_H;t++) {
      // draw video
      drawFrame_y();

      // run cpu
      while(true) {
         const elapsed = cpu.run_instruction();
         cycle += elapsed;
         //for(let j=0;j<elapsed;j++) depositAudio(0);
         if(cycle>=cyclesPerLine)
         {
            cycle-=cyclesPerLine;
            break;            
         }
      } 
   }

   // hidden lines at bottom
   for(let t=0;t<=HIDDEN_SCANLINES_BOTTOM;t++) {
      // run cpu
      while(true) {
         const elapsed = cpu.run_instruction();
         cycle += elapsed;
         //for(let j=0;j<elapsed;j++) depositAudio(0);
         if(cycle>=cyclesPerLine) {
            cycle-=cyclesPerLine;
            break;            
         }
      } 
   }

   // generate VDC interrupt
   cpu.interrupt(false, 0);

   // draw the PAL hidden scanlines at the end of frame
   for(let t=0;t<=PAL_HIDDEN_LINES_VERY_BOTTOM;t++) {
      // run cpu
      while(true) {
         const elapsed = cpu.run_instruction();
         cycle += elapsed;
         //for(let j=0;j<elapsed;j++) depositAudio(0);
         if(cycle>=cyclesPerLine) {
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
console.info("    crun(name)");
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
console.info("Reset key is Ctrl+Break or Alt+R");
console.info("Power on/off Ctrl+Break or Alt+P");
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
*/

/*
let depositPtr = 0;
function depositAudio(sample) {
   Z80SoundPtr++;
   if(Z80SoundPtr > sampleRate) {
      Z80SoundPtr -= sampleRate; 
      audioSoundPtr++;      
   }
}

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bufferSize = 16384;
const sampleRate = audioContext.sampleRate;
var speakerSound = audioContext.createScriptProcessor(bufferSize, 1, 1);

let zzz = 0;
speakerSound.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);
    for(let i=0; i<bufferSize; i++) {
        zzz++;        
        output[i] = Math.sin(30*zzz*2*6.14/48000);                        
    }
    audioSoundPtr += bufferSize;
    console.log(Z80SoundPtr, audioSoundPtr, Z80SoundPtr-audioSoundPtr);
}

speakerSound.connect(audioContext.destination);

function ss() {
   speakerSound.disconnect(audioContext.destination);
}
*/
//

window.addEventListener("resize", onResize);
window.addEventListener("dblclick", goFullScreen);
onResize();

function onResize(e) {
   const canvas = document.getElementById("canvas");
   const aspect = 1.4;
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
}

function goFullScreen() {
   canvas.webkitRequestFullscreen()	|| canvas.mozRequestFullScreen();   
   onResize();
}

// laser_drive_init();

restoreState();

// starts drawing frames
oneFrame();
