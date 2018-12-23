
// find call addresses
let calls = {};
debugBefore = ()=> {      
   const pc = cpu.getState().pc;
   if(mem_read(pc) == 0xCD) {
      // it's call
      const address = mem_read_word(pc+1);

      if(calls[address] === undefined) {
         console.log(`${hex(pc,4)} CALL ${hex(address,4)}`);
         calls[address] = true;
      }
   }
}

// count t-states in turbo tape
let ct = 0;
debugBefore = ()=> {      
   const pc = cpu.getState().pc;
   //if(pc === 0x8927) ct = cycles;
   //if(pc === 0x892f) console.log(`${cycles-ct}`);

   if(pc === 0x8969) ct = cycles;
   if(pc === 0x8983) console.log(`${cycles-ct}`);
}


// measure turbo tape bit length and threshold
(function() {
   let hits = {};
   let hv = [];
   let counter = 0;
   let values = [];
   let record = false;
   debugBefore = ()=> {      
      const { a, pc } = cpu.getState();
      
      // start recording after returning from "CALL sync_tape"
      if(pc === 0x8917) record = true;

      // log the value in A register before "CP THRESHOLD"
      if(pc === 0x8971) {
         if(record) {
            counter++;      
            values[counter] = a;
            const index = `L${a}`;
            hits[index] = (hits[index] || 0) + 1;            
            hv[a] = (hv[a] || 0) + 1;
            // if(counter % 512 === 0) console.log(hits);
         }      
      }

      // final print after loading file, before "ld (0x83e9), de"
      if(pc === 0x8956) {
         hv.forEach((e,i)=>{ console.log(`${i}: ${Math.round((e/counter)*100)}`)});
         record = false;
         hv = [];
         counter = 0;
      }
   }
   let print = function() {
      console.log(values.join("\n"));
   };
   return print;
})();

// turbo tape sync header
let _counter = 0;
debugBefore = ()=> {      
   const { pc, d, e, a } = cpu.getState();   
   if(pc === 0x8971) {
      _counter++;
      const de = e+d*256;
      if(_counter < 1024) console.log(`${hex(de,4)} (${_counter})`);
      //if(_counter < 1024) console.log(`${bin(de,16)} (${_counter})`);      
      //if(_counter < 1024) console.log(`${hex(a)} ${_counter}`);
   }
}


// logs when writing in mem at specific address
function hooked_mem_write(address, value) {
   mem_write(address, value);
   if(address === 0x4000) {
      console.log(`writing in mem ${hex(address,4)}: ${hex(value)} from pc=${hex(cpu.getState().pc,4)}`);
   }
}
cpu = new Z80({ mem_read, mem_write: hooked_mem_write, io_read, io_write });


// calculate gr3 row addresses
(function() {
   const offs_2 = [
      0x0000,0x0800,0x1000,0x1800,0x2000,0x2800,0x3000,0x3800,
      0x0100,0x0900,0x1100,0x1900,0x2100,0x2900,0x3100,0x3900,
      0x0200,0x0a00,0x1200,0x1a00,0x2200,0x2a00,0x3200,0x3a00,
      0x0300,0x0b00,0x1300,0x1b00,0x2300,0x2b00,0x3300,0x3b00,
      0x0400,0x0c00,0x1400,0x1c00,0x2400,0x2c00,0x3400,0x3c00,
      0x0500,0x0d00,0x1500,0x1d00,0x2500,0x2d00,0x3500,0x3d00,
      0x0600,0x0e00,0x1600,0x1e00,0x2600,0x2e00,0x3600,0x3e00,
      0x0700,0x0f00,0x1700,0x1f00,0x2700,0x2f00,0x3700,0x3f00,
      0x0050,0x0850,0x1050,0x1850,0x2050,0x2850,0x3050,0x3850,
      0x0150,0x0950,0x1150,0x1950,0x2150,0x2950,0x3150,0x3950,
      0x0250,0x0a50,0x1250,0x1a50,0x2250,0x2a50,0x3250,0x3a50,
      0x0350,0x0b50,0x1350,0x1b50,0x2350,0x2b50,0x3350,0x3b50,
      0x0450,0x0c50,0x1450,0x1c50,0x2450,0x2c50,0x3450,0x3c50,
      0x0550,0x0d50,0x1550,0x1d50,0x2550,0x2d50,0x3550,0x3d50,
      0x0650,0x0e50,0x1650,0x1e50,0x2650,0x2e50,0x3650,0x3e50,
      0x0750,0x0f50,0x1750,0x1f50,0x2750,0x2f50,0x3750,0x3f50,
      0x00a0,0x08a0,0x10a0,0x18a0,0x20a0,0x28a0,0x30a0,0x38a0,
      0x01a0,0x09a0,0x11a0,0x19a0,0x21a0,0x29a0,0x31a0,0x39a0,
      0x02a0,0x0aa0,0x12a0,0x1aa0,0x22a0,0x2aa0,0x32a0,0x3aa0,
      0x03a0,0x0ba0,0x13a0,0x1ba0,0x23a0,0x2ba0,0x33a0,0x3ba0,
      0x04a0,0x0ca0,0x14a0,0x1ca0,0x24a0,0x2ca0,0x34a0,0x3ca0,
      0x05a0,0x0da0,0x15a0,0x1da0,0x25a0,0x2da0,0x35a0,0x3da0,
      0x06a0,0x0ea0,0x16a0,0x1ea0,0x26a0,0x2ea0,0x36a0,0x3ea0,
      0x07a0,0x0fa0,0x17a0,0x1fa0,0x27a0,0x2fa0,0x37a0,0x3fa0
   ];

   let v=[];
   let hh=[]; 
   let s="    ";
   for(let r=0;r<192;r++) 
   { 
      /* correct formula
      let x = (r & 0b111) << 11;      
      x += ((r & 0b111000) << 5);       
      x +=  r & 0b11000000;
      x += (r & 0b11000000)>>2;
      */

      let h=0,l=0,d,e,a,hl=0,x=0;      
      
      a = r;
      a = a & 0b11000000;
      l = a;
      x += r & 0b11000000; // ***
      
      a = a >> 2;
      a = a + l; 
      l = a;  
      x += (r & 0b11000000)>>2; // ***

      a = r;
      a = a & 0b111000;
      a = a >> 3;
      h = a;       
      x += ((r & 0b111000 ) << 5); // ***

      a = r;
      a = a & 0b111;
      a = a << 3;
      a = a + h;
      h = a;       
      x += (r & 0b111) << 11; // ***

      hl = l+h*256;

      if(x !== hl) console.log(`${x} ${hl} ${x-hl} ${h} ${l}`);

      v.push(x);
      hh.push(hl);

      if(r % 8 == 0) s+="\n     ";
      s+=`0x${hex(x,4)}`+",";      
   }
   console.log(s);

   /*
   v.forEach((v,i)=>{
      if(v !== offs_2[i]) console.log(`v  ${hex(v,4)} != ${hex(offs_2[i],4)}`);
      if(hh[i] !== offs_2[i]) console.log(`hh ${hex(hh[i],4)} != ${hex(offs_2[i],4)}`);
   });
   */
})();


// logs when RST 30 is called
debugBefore = (function() {
   let lastpc = 0;
   return function() {         
      if(lastpc === 0x800f) {
         // there was a call to RST 30
         console.log(cpu_status());
      }
      lastpc = cpu.getState().pc;
   };
})();


// measure time private members
(function() {
   function zzzz() {
      let z = 1;
      function inc() { z++; }
      return inc;
   }
   let inc = zzzz();
   time1 = new Date();
   for(let t=0;t<1000000000;t++) inc(); 
   time2 = new Date();
   console.log(time2-time1);
})();


// measure time class memmbers
class zzzz {
   constructor() { this.z = 1; }
   inc() { this.z++; }
}
(function() {
   let inc = new zzzz();
   time1 = new Date();
   for(let t=0;t<1000000000;t++) inc.inc(); 
   time2 = new Date();
   console.log(time2-time1);
})();


// generate tone burst vsync

//let tone = 49.62 * 60;  
let tone = 49.556 * 80

let freq = tone;
let duty = 0.5;
let seq = [1, 1, 0, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

(function() {
   let phase = 0;
   let silent = false;
   let seqp = 0;

   speakerSound.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
   
      // playback what is in the audio buffer
      for(let i=0; i<bufferSize; i++) {
         //const audio = Math.sin(phase) * 0.75;
         const audio = phase <= (duty * 2 * Math.PI) ? 0.75 : -0.75;
         output[i] = silent ? -0.75 : audio;

         phase += (2 * Math.PI * freq / 48000);
         if(phase > 2 * Math.PI) {
            //const bitm = Math.random()< 0.5 ? 1 : 2;
            const b = seq[(seqp++)% seq.length];
                 if(b === 0)  { silent = false; freq = tone; }
            else if(b === 1)  { silent = false; freq = tone * 2; }
            else if(b === -1) { silent = true; freq = tone*2; }
         }
         phase = phase % (2 * Math.PI);            
      }          
   }
})();




//***************************************************
// generate random bits square wave with duty cycle
let tone = 44100 / 10;
let duty = 0.5;
let inv = false;

(function() {
   let phase = 0;
   let freq = tone;

   speakerSound.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
         
      for(let i=0; i<bufferSize; i++) {         
         const audio = phase <= (duty * 2 * Math.PI) ? 0.75 : -0.75;
         output[i] = inv ? audio : -audio;

         phase += (2 * Math.PI * freq / 48000);
         if(phase > 2 * Math.PI) {
            const bitm = Math.random()< 0.5 ? 1 : 2;
            freq = tone * bitm;            
         }
         phase = phase % (2 * Math.PI);            
      }          
   }
})();
