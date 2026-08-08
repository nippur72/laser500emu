import { bit, downloadBytes, hex, mem_read_word, mem_write_word, reset_bit, set_bit } from "./bytes";

import { drawFrame_y } from "./video";

// **** machine-specific utility functions ****

function cpu_status() {
   const state = laser500.cpu.getState();
   return `A=${hex(state.a)} BC=${hex(state.b)}${hex(state.c)} DE=${hex(state.d)}${hex(state.e)} HL=${hex(state.h)}${hex(state.l)} IX=${hex(state.ix,4)} IY=${hex(state.iy,4)} SP=${hex(state.sp,4)} PC=${hex(state.pc,4)} S=${state.flags.S}, Z=${state.flags.Z}, Y=${state.flags.Y}, H=${state.flags.H}, X=${state.flags.X}, P=${state.flags.P}, N=${state.flags.N}, C=${state.flags.C}`;   
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

export function saveState() {
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

function dumpStack() {
   const sp = laser500.cpu.getState().sp;

   for(let t=sp;t<=0xffff;t+=2) {
      const word = mem_read_word(t);
      console.log(`${hex(t,4)}: ${hex(word,4)}  (${word})`);
   }
}




import { parseQueryStringCommands } from "./browser";

/* @@@ emulator.js */
"use strict";


import { Audio } from "./audio";
import { initDriveSound, loadDriveSound } from "./drive-sound";
import { Z80 } from "z80-js";

import { updateGamePad } from "./joystick";
import { charset, rom1, rom2 } from "./roms";
import { fetchFile } from "./externalLoad";
import { Serial } from "./serial";
import { Tape } from "./tape";
import { mapped_io_read, mapped_io_write } from "./mapped_io";
import { keyDown, keyUp } from "./keys";

import { buildPalette } from "./video";
import { mem_read, mem_write, io_read, io_write, clear_bus_ops, get_bus_ops } from "./bus";
import { loadBytes } from "./files";
import { ConsolePrinter } from "./printer";

import { Drive, drives } from "./floppy";

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
   swap_joysticks: false,
   
   emulate_fdc: true,
   tape_monitor: true,
   drive_sound: true,

   cpu: Z80({ mem_read, mem_write, io_read, io_write }),

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

// publish globals
(window as any).csave    = laser500.tape.csave;
(window as any).cstop    = laser500.tape.cstop;
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

export function wait_for_cursor() {
   while(1) {
      renderAllLines();
      if((total_cycles > cpuSpeed/4) && bit(mem_read(0x85fa),5)==1) return;
   }
}

export function renderAllLines() {
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
initDriveSound(audio.audioContext);

async function main() {
   // prints welcome message on the console
   // welcome();

   await loadDriveSound('/5.25_Epson_SD-700_1.2M_80tracks_1up.wav');
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

