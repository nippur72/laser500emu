"use strict";

/*
interface Z80 
{
   reset();                       // Resets the processor. This need not be called at power-up, but it can be.
   run_instruction(): number;     // Runs the instruction and return elapsed cycles 
   interrupt(non_maskable, data); // Triggers an interrupt.
}
*/

// *** laser 500 hardware ***

// rom defined in roms.js
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

// TODO joystick, caps lock, port 13 OUT(13),AA ?

let re = [];
let v = 100;

function mapped_io_read(address) {
   if(!re[address]) console.log(`reading mapped i/o ${hex(address,4)} ${address.toString(2)}`);
   re[address] = true;
   
   // TODO rewrite in negated logic?

   const base = (~address) & 0b1111111111111111;
   let sum = 0;
   for(let t=0;t<0x0F;t++) {
      if((base & (1<<t)) > 0 ) sum |= keyboard_matrix[t];      
   }
   
   const outp = cassette_bit | (~sum & 0b01111111);
   
   return outp;
}

/* on write 
* 7-6  not assigned
* 5    speaker B
* 4    ???
* 3    mode: 1 graphics, 0 text
* 2    cassette out (MSB)
* 1    cassette out (LSB)
* 0    speaker A
*/
function mapped_io_write(address, value) {
   if(DEBUG) console.log(`writing mapped i/o ${hex(address,4)} value=${value}`);
   if(address>=0x2800 && address<=0x2FFF) {
      speaker_B = (value & (1 << 5)) >> 5;
      speaker_A = (value & (1 << 0)) >> 0;
      vdc_graphic_mode_enabled = (value & (1<<3)) >> 3;
      cassette_bit = (value & (1<<2)) >> 2;  // LSB is ignored
   }
}

function mem_read(address) {
   //if(DEBUG) console.log(`reading mem ${hex(address,4)}`);
   const bank = banks[(address & 0xF000) >> 14];
   const base = address & 0x3FFF;
   switch(bank) {
      case 0: return rom1[base];
      case 1: return rom2[base];
      case 2: return mapped_io_read(base);
      case 4: return ram1[base];
      case 5: return ram2[base];
      case 7: return videoram[base];
      default: return 0x00;
   }
}

function mem_write(address, value) {
   if(DEBUG) {
      console.log(`writing mem ${hex(address,4)}`);
      console.log(banks);
   }
   const bank = banks[(address & 0xF000) >> 14];   
   const base = address & 0x3FFF;
   switch(bank) {
      case 2: mapped_io_write(base, value); break;
      case 4: ram1[base] = value;           break;
      case 5: ram2[base] = value;           break;
      case 7: videoram[base] = value;       break;
   }
}

function io_read(port) { 
   if(DEBUG) console.log(`read i/o port ${hex(port)}`);
   switch(port & 0xFF) {
      case 0x40: return banks[0];
      case 0x41: return banks[1];
      case 0x42: return banks[2];
      case 0x43: return banks[3];
   }
   return 0x00;
}

function io_write(port, value) {
   if(DEBUG) {
      console.warn(`write i/o port ${hex(port)} value ${hex(value)}`);
      console.log(banks);
   }
   switch(port & 0xFF) {
      case 0x40: banks[0] = value; break;
      case 0x41: banks[1] = value; break;
      case 0x42: banks[2] = value; break;
      case 0x43: banks[3] = value; break;
      case 0x44: 
         vdc_page_7 = (value & 0b100) >> 3;
         vdc_text80_enabled = value & 1; 
              if(value & 0b011 == 0b000) vdc_graphic_mode_number = 5;
         else if(value & 0b111 == 0b010) vdc_graphic_mode_number = 4;
         else if(value & 0b111 == 0b011) vdc_graphic_mode_number = 3;
         else if(value & 0b111 == 0b110) vdc_graphic_mode_number = 2;
         else if(value & 0b111 == 0b111) vdc_graphic_mode_number = 1;
         else if(value & 0b110 == 0b100) vdc_graphic_mode_number = 1;
         break;
      case 0x45: 
         vdc_text80_foreground = value & 0xF0 >> 4;
         vdc_text80_background = value & 0x0F;
         break;
   }
   if(DEBUG) {      
      console.log(banks);
   }
}

let cpu = new Z80({ mem_read, mem_write, io_read, io_write });

console.log("emulator started");

let DEBUG = false;

let maxdebug = 2000;

DEBUG = false;

//console.log(hexDump(videoram, 0x3800, 0x3FFF, 16));


/******************/

let cycle = 0;
const cyclesPerFrame = 1000000;
let nextFrameTime = 0;
const frameRate = 60;

function oneFrame() {
   const startTime = new Date().getTime();
   
   while(true) {
      cycle += cpu.run_instruction();
      if(cycle > cyclesPerFrame) break;
   }

   cycle -= cyclesPerFrame;         
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
      nextFrameTime = now + (1000/frameRate);
   } else {
      nextFrameTime += (1000/frameRate);
   }

   setTimeout(()=>oneFrame(), timeWaitUntilNextFrame);   
}

oneFrame();

