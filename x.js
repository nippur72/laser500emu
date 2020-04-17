
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

// logs when PC is passing from a specific address
(function() {
   let counter = 0;      
   debugBefore = ()=> {   
      const pc = cpu.getState().pc;
      if(pc === 0x0033) {
         console.log(counter);
         counter++;
      }
   }
})();

// count t-states in turbo tape
let ct = 0;
debugBefore = ()=> {      
   const pc = cpu.getState().pc;
   //if(pc === 0x8927) ct = total_cycles;
   //if(pc === 0x892f) console.log(`${total_cycles-ct}`);

   if(pc === 0x8969) ct = total_cycles;
   if(pc === 0x8983) console.log(`${total_cycles-ct}`);
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


// calculate offs_2 row addresses
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

   // checks if x bit of r, is same as bit y of offs_1[r]
   function checkbit(r,x,y) {
      const bitx = (r & (1<<x))>>x;
      const bity = (offs_2[r] & (1<<y))>>y;
      return bitx === bity;
   }

   function check_all_rows(x,y) {
      for(let t=0;t<192;t++)
      {
         if(!checkbit(t,x,y)) return false;
      }
      return true;
   }

   function do_the_check() {
      for(let y=15;y>=0;y--) {
         for(let x=7;x>=0;x--) {
            if(check_all_rows(x,y)) {
               //console.log(`bit offs[${y}] = r[${x}]`);
               console.log(`(((ycnt & (1<<${x}))>>${x})<<${y}) |   // address[${y}] = ycnt[${x}]`);
            }
         }
      }
   }

   do_the_check();

   let v=[];         
   for(let ycnt=0;ycnt<192;ycnt++) 
   { 
      let x = (((ycnt & (1<<2))>>2)<<12) |
              (((ycnt & (1<<1))>>1)<<11) |
              (((ycnt & (1<<5))>>5)<<10) |
              (((ycnt & (1<<4))>>4)<<9) |
              (((ycnt & (1<<3))>>3)<<8) |
              (((ycnt & (1<<0))>>0)<<7) |
              (((ycnt & (1<<7))>>7)<<6) |
              (((ycnt & (1<<6))>>6)<<5) |
              (((ycnt & (1<<7))>>7)<<4) |
              (((ycnt & (1<<6))>>6)<<3) + 0x2000;
      v.push(x);
   }
   
   v.forEach((v,i)=>{
      if(v !== offs_1[i]) console.log(`row ${i} v=${hex(v,4)} != ${hex(offs_2[i],4)}`);      
   });
})();








// calculate offs_1 row addresses
(function() {
   const offs_1 = [
      0x2000,0x2080,0x2800,0x2880,0x3000,0x3080,0x3800,0x3880,
      0x2100,0x2180,0x2900,0x2980,0x3100,0x3180,0x3900,0x3980,
      0x2200,0x2280,0x2a00,0x2a80,0x3200,0x3280,0x3a00,0x3a80,
      0x2300,0x2380,0x2b00,0x2b80,0x3300,0x3380,0x3b00,0x3b80,
      0x2400,0x2480,0x2c00,0x2c80,0x3400,0x3480,0x3c00,0x3c80,
      0x2500,0x2580,0x2d00,0x2d80,0x3500,0x3580,0x3d00,0x3d80,
      0x2600,0x2680,0x2e00,0x2e80,0x3600,0x3680,0x3e00,0x3e80,
      0x2700,0x2780,0x2f00,0x2f80,0x3700,0x3780,0x3f00,0x3f80,
      0x2028,0x20a8,0x2828,0x28a8,0x3028,0x30a8,0x3828,0x38a8,
      0x2128,0x21a8,0x2928,0x29a8,0x3128,0x31a8,0x3928,0x39a8,
      0x2228,0x22a8,0x2a28,0x2aa8,0x3228,0x32a8,0x3a28,0x3aa8,
      0x2328,0x23a8,0x2b28,0x2ba8,0x3328,0x33a8,0x3b28,0x3ba8,
      0x2428,0x24a8,0x2c28,0x2ca8,0x3428,0x34a8,0x3c28,0x3ca8,
      0x2528,0x25a8,0x2d28,0x2da8,0x3528,0x35a8,0x3d28,0x3da8,
      0x2628,0x26a8,0x2e28,0x2ea8,0x3628,0x36a8,0x3e28,0x3ea8,
      0x2728,0x27a8,0x2f28,0x2fa8,0x3728,0x37a8,0x3f28,0x3fa8,
      0x2050,0x20d0,0x2850,0x28d0,0x3050,0x30d0,0x3850,0x38d0,
      0x2150,0x21d0,0x2950,0x29d0,0x3150,0x31d0,0x3950,0x39d0,
      0x2250,0x22d0,0x2a50,0x2ad0,0x3250,0x32d0,0x3a50,0x3ad0,
      0x2350,0x23d0,0x2b50,0x2bd0,0x3350,0x33d0,0x3b50,0x3bd0,
      0x2450,0x24d0,0x2c50,0x2cd0,0x3450,0x34d0,0x3c50,0x3cd0,
      0x2550,0x25d0,0x2d50,0x2dd0,0x3550,0x35d0,0x3d50,0x3dd0,
      0x2650,0x26d0,0x2e50,0x2ed0,0x3650,0x36d0,0x3e50,0x3ed0,
      0x2750,0x27d0,0x2f50,0x2fd0,0x3750,0x37d0,0x3f50,0x3fd0
   ];

   // checks if x bit of r, is same as bit y of offs_1[r]
   function checkbit(r,x,y) {
      const bitx = (r & (1<<x))>>x;
      const bity = (offs_1[r] & (1<<y))>>y;
      return bitx === bity;
   }

   function check_all_rows(x,y) {
      for(let t=0;t<192;t++)
      {
         if(!checkbit(t,x,y)) return false;
      }
      return true;
   }

   function do_the_check() {
      for(let y=15;y>=0;y--) {
         for(let x=7;x>=0;x--) {
            if(check_all_rows(x,y)) {
               //console.log(`bit offs[${y}] = r[${x}]`);
               console.log(`(((ycnt & (1<<${x}))>>${x})<<${y}) |   // address[${y}] = ycnt[${x}]`);
            }
         }
      }
   }

   do_the_check();

   let v=[];         
   for(let ycnt=0;ycnt<192;ycnt++) 
   { 
      let x = (((ycnt & (1<<2))>>2)<<12) |
              (((ycnt & (1<<1))>>1)<<11) |
              (((ycnt & (1<<5))>>5)<<10) |
              (((ycnt & (1<<4))>>4)<<9) |
              (((ycnt & (1<<3))>>3)<<8) |
              (((ycnt & (1<<0))>>0)<<7) |
              (((ycnt & (1<<7))>>7)<<6) |
              (((ycnt & (1<<6))>>6)<<5) |
              (((ycnt & (1<<7))>>7)<<4) |
              (((ycnt & (1<<6))>>6)<<3) + 0x2000;
      v.push(x);
   }
   
   v.forEach((v,i)=>{
      if(v !== offs_1[i]) console.log(`row ${i} v=${hex(v,4)} != ${hex(offs_1[i],4)}`);      
   });
})();

function ppp(ycnt)
{
   return (
   (((ycnt & (1<<2))>>2)<<12) |
   (((ycnt & (1<<1))>>1)<<11) |
   (((ycnt & (1<<5))>>5)<<10) |
   (((ycnt & (1<<4))>>4)<<9) |
   (((ycnt & (1<<3))>>3)<<8) |
   (((ycnt & (1<<0))>>0)<<7) |
   (((ycnt & (1<<7))>>7)<<6) |
   (((ycnt & (1<<6))>>6)<<5) |
   (((ycnt & (1<<7))>>7)<<4) |
   (((ycnt & (1<<6))>>6)<<3) + 0x2000).toString(16);
}


(function() {
   s="";
   for(let ycnt=0;ycnt<192;ycnt++) {
      const by = ycnt >> 3;               
      let offs = ((by & 7) << 8) + ((by >> 3) << 6) + ((by >> 3) << 4);
      s+=`0x${hex(offs,4)},`;
   }
   console.log(s);
})();


// calculate text80/40 row addresses
(function() {
   const offs_2 = [
      0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0100,0x0100,0x0100,0x0100,0x0100,0x0100,0x0100,0x0100,0x0200,0x0200,0x0200,0x0200,0x0200,0x0200,0x0200,0x0200,0x0300,0x0300,0x0300,0x0300,0x0300,0x0300,0x0300,0x0300,0x0400,0x0400,0x0400,0x0400,0x0400,0x0400,0x0400,0x0400,0x0500,0x0500,0x0500,0x0500,0x0500,0x0500,0x0500,0x0500,0x0600,0x0600,0x0600,0x0600,0x0600,0x0600,0x0600,0x0600,0x0700,0x0700,0x0700,0x0700,0x0700,0x0700,0x0700,0x0700,0x0050,0x0050,0x0050,0x0050,0x0050,0x0050,0x0050,0x0050,0x0150,0x0150,0x0150,0x0150,0x0150,0x0150,0x0150,0x0150,0x0250,0x0250,0x0250,0x0250,0x0250,0x0250,0x0250,0x0250,0x0350,0x0350,0x0350,0x0350,0x0350,0x0350,0x0350,0x0350,0x0450,0x0450,0x0450,0x0450,0x0450,0x0450,0x0450,0x0450,0x0550,0x0550,0x0550,0x0550,0x0550,0x0550,0x0550,0x0550,0x0650,0x0650,0x0650,0x0650,0x0650,0x0650,0x0650,0x0650,0x0750,0x0750,0x0750,0x0750,0x0750,0x0750,0x0750,0x0750,0x00a0,0x00a0,0x00a0,0x00a0,0x00a0,0x00a0,0x00a0,0x00a0,0x01a0,0x01a0,0x01a0,0x01a0,0x01a0,0x01a0,0x01a0,0x01a0,0x02a0,0x02a0,0x02a0,0x02a0,0x02a0,0x02a0,0x02a0,0x02a0,0x03a0,0x03a0,0x03a0,0x03a0,0x03a0,0x03a0,0x03a0,0x03a0,0x04a0,0x04a0,0x04a0,0x04a0,0x04a0,0x04a0,0x04a0,0x04a0,0x05a0,0x05a0,0x05a0,0x05a0,0x05a0,0x05a0,0x05a0,0x05a0,0x06a0,0x06a0,0x06a0,0x06a0,0x06a0,0x06a0,0x06a0,0x06a0,0x07a0,0x07a0,0x07a0,0x07a0,0x07a0,0x07a0,0x07a0,0x07a0    
   ];

   // checks if x bit of r, is same as bit y of offs_1[r]
   function checkbit(r,x,y) {
      const bitx = (r & (1<<x))>>x;
      const bity = (offs_2[r] & (1<<y))>>y;
      return bitx === bity;
   }

   function check_all_rows(x,y) {
      for(let t=0;t<192;t++)
      {
         if(!checkbit(t,x,y)) return false;
      }
      return true;
   }

   function do_the_check() {
      for(let y=15;y>=0;y--) {
         for(let x=7;x>=0;x--) {
            if(check_all_rows(x,y)) {
               //console.log(`bit offs[${y}] = r[${x}]`);
               console.log(`(((ycnt & (1<<${x}))>>${x})<<${y}) |   // address[${y}] = ycnt[${x}]`);
            }
         }
      }
   }

   do_the_check();

   let v=[];         
   for(let ycnt=0;ycnt<192;ycnt++) 
   { 
      let x = (((ycnt & (1<<2))>>2)<<12) |
              (((ycnt & (1<<1))>>1)<<11) |
              (((ycnt & (1<<5))>>5)<<10) |
              (((ycnt & (1<<4))>>4)<<9) |
              (((ycnt & (1<<3))>>3)<<8) |
              (((ycnt & (1<<0))>>0)<<7) |
              (((ycnt & (1<<7))>>7)<<6) |
              (((ycnt & (1<<6))>>6)<<5) |
              (((ycnt & (1<<7))>>7)<<4) |
              (((ycnt & (1<<6))>>6)<<3) + 0x2000;
      v.push(x);
   }
   
   v.forEach((v,i)=>{
      if(v !== offs_1[i]) console.log(`row ${i} v=${hex(v,4)} != ${hex(offs_2[i],4)}`);      
   });
})();


// calculate offs_0 row addresses
(function() {
   const offs_0 = [
      0x2000,0x2800,0x3000,0x3800,0x2100,0x2900,0x3100,0x3900,
      0x2200,0x2a00,0x3200,0x3a00,0x2300,0x2b00,0x3300,0x3b00,
      0x2400,0x2c00,0x3400,0x3c00,0x2500,0x2d00,0x3500,0x3d00,
      0x2600,0x2e00,0x3600,0x3e00,0x2700,0x2f00,0x3700,0x3f00,
      0x2050,0x2850,0x3050,0x3850,0x2150,0x2950,0x3150,0x3950,
      0x2250,0x2a50,0x3250,0x3a50,0x2350,0x2b50,0x3350,0x3b50,
      0x2450,0x2c50,0x3450,0x3c50,0x2550,0x2d50,0x3550,0x3d50,
      0x2650,0x2e50,0x3650,0x3e50,0x2750,0x2f50,0x3750,0x3f50,
      0x20a0,0x28a0,0x30a0,0x38a0,0x21a0,0x29a0,0x31a0,0x39a0,
      0x22a0,0x2aa0,0x32a0,0x3aa0,0x23a0,0x2ba0,0x33a0,0x3ba0,
      0x24a0,0x2ca0,0x34a0,0x3ca0,0x25a0,0x2da0,0x35a0,0x3da0,
      0x26a0,0x2ea0,0x36a0,0x3ea0,0x27a0,0x2fa0,0x37a0,0x3fa0      
   ];

   // checks if x bit of r, is same as bit y of offs_1[r]
   function checkbit(r,x,y) {
      const bitx = (r & (1<<x))>>x;
      const bity = (offs_0[r>>1] & (1<<y))>>y;
      return bitx === bity;
   }

   function check_all_rows(x,y) {
      for(let t=0;t<192;t++)
      {
         if(!checkbit(t,x,y)) return false;
      }
      return true;
   }

   function do_the_check() {
      for(let y=15;y>=0;y--) {
         for(let x=7;x>=0;x--) {
            if(check_all_rows(x,y)) {
               //console.log(`bit offs[${y}] = r[${x}]`);
               console.log(`(((ycnt & (1<<${x}))>>${x})<<${y}) |   // address[${y}] = ycnt[${x}]`);
            }
         }
      }
   }

   do_the_check();
   /*
   let v=[];         
   for(let ycnt=0;ycnt<96;ycnt++) 
   { 
      let x = (((ycnt & (1<<2))>>2)<<12) |
              (((ycnt & (1<<1))>>1)<<11) |
              (((ycnt & (1<<5))>>5)<<10) |
              (((ycnt & (1<<4))>>4)<<9) |
              (((ycnt & (1<<3))>>3)<<8) |
              (((ycnt & (1<<0))>>0)<<7) |
              (((ycnt & (1<<7))>>7)<<6) |
              (((ycnt & (1<<6))>>6)<<5) |
              (((ycnt & (1<<7))>>7)<<4) |
              (((ycnt & (1<<6))>>6)<<3) + 0x2000;
      v.push(x);
   }
   
   v.forEach((v,i)=>{
      if(v !== offs_1[i]) console.log(`row ${i} v=${hex(v,4)} != ${hex(offs_1[i],4)}`);      
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
// generate random bits sync with raster
let tone = 500.78;
let duty = 0.5;
let inv = false;

(function() {
   let phase = 0;
   let freq = tone;
   let cnt = 0;
   let scnt = 0;

   speakerSound.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
         
      for(let i=0; i<bufferSize; i++) {                  
         const audio = phase <= (duty * 2 * Math.PI) ? 0.75 : -0.75;
         output[i] = inv ? audio : -audio;

         phase += (2 * Math.PI * freq / 48000);
         if(phase > 2 * Math.PI) {
            const bitm = Math.random()< 0.5 ? 1 : 4;
                 if(cnt === 0 ) freq = tone / 2;                        
            else if(cnt === 1 ) freq = tone / 2;                        
            else freq = tone;
         }
         phase = phase % (2 * Math.PI);           

         scnt++;                    
         if(scnt > 48000 / 500.78)
         {
            scnt -= 48000 / 500.78;
            cnt++;
            cnt = cnt % 10;
         }
      }          
   }
})();




//***************************************************
// generate random bits square wave with duty cycle
let tone = 500.78;
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
            const bitm = Math.random()< 0.5 ? 1 : 4;
            freq = tone * bitm;            
         }
         phase = phase % (2 * Math.PI);            
      }          
   }
})();


//***************************************************
// generate pure square wave with duty cycle
let freq = 501.25;
let duty = 0.5;
let inv = false;

(function() {
   let phase = 0;   

   speakerSound.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
         
      for(let i=0; i<bufferSize; i++) {         
         const audio = phase <= (duty * 2 * Math.PI) ? 0.75 : -0.75;
         output[i] = inv ? audio : -audio;

         phase += (2 * Math.PI * freq / 48000);
         phase = phase % (2 * Math.PI);            
      }          
   }
})();



// logs when unknown io bits are changed
(function() {
   let old_io_bit_7; 
   let old_caps_lock_bit;
   let old_io_bit_4;

   debugBefore = ()=> {      
      old_io_bit_7      = io_bit_7;
      old_caps_lock_bit = caps_lock_bit;
      old_io_bit_4      = io_bit_4;
   }
   debugAfter = ()=> {                
      let { pc } = cpu.getState();
      if(old_io_bit_7 != io_bit_7)           console.log(`bit 7 changed from ${old_io_bit_7     } to ${io_bit_7     } at ${hex(pc,4)}`);
      if(old_caps_lock_bit != caps_lock_bit) console.log(`bit 6 changed from ${old_caps_lock_bit} to ${caps_lock_bit} at ${hex(pc,4)}`);
      if(old_io_bit_4 != io_bit_4)           console.log(`bit 4 changed from ${old_io_bit_4     } to ${io_bit_4     } at ${hex(pc,4)}`);
   }
})();


//***************************************************
// VIC-20 random noise generator

let reg = 254;      // value of 36877
let noise_LFSR = 1; // 16 bit LFSR
let shr = 0;        // 8 bit shift register

function lfsr(deb) {
   let noise_zero = noise_LFSR === 0 ? (1<<1) : 0;
   let bit3  = (noise_LFSR & (1<< 3))>0 ? 1 : 0;
   let bit12 = (noise_LFSR & (1<<12))>0 ? 1 : 0;
   let bit14 = (noise_LFSR & (1<<14))>0 ? 1 : 0;
   let bit15 = (noise_LFSR & (1<<15))>0 ? 1 : 0;

   noise_LFSR = (noise_LFSR << 1);  // shift
   //noise_LFSR ^= noise_zero;        // no zero
   noise_LFSR |= bit3 ^ bit12 ^ bit14 ^ bit15;              
   noise_LFSR &= 0xffff;     
   if(deb) console.log(noise_LFSR.toString(2));
}

(function() {
   
   speakerSound.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
         
      let clock = 1108404;
      let f = 1108404/((255-reg)*(16*8));
      let size = Math.round(48000/f);
      let cnt = 0;
      
      for(let i=0; i<output.length; i++) {                  
         const square_wave = (cnt % size) < (size/2) ? 1 : 0;

         if(cnt % size === 0) {
            lfsr(false);
         }

         const lfsr_out = noise_LFSR & 1;

         const mix = square_wave ^ lfsr_out;

         const audio = mix > 0 ? 0.75 : -0.75;
         output[i] = audio;
         
         cnt = (cnt + 1) % size;
      }          
   }
})();


pasteLine("9000: 11 01 A8 CD 4B EC CD 98 EC 12 13 C3 06 01");



// phvic VIC20 audio generator
(function() {
   
   let CLK = 1108404;
   let samplerate = 48000;
   let clock = 0;
   
   let freq = 254;                // 36877 register
   let freq_counter = 126;        // counter 
   let lfsr = 0;                  // 16 bit noise lfsr
   let shift_reg = 0;             // voice 8 bit shift register
   let output = 0;                // 1 bit voice output

   let aggregated_output = [];

   function clock_tick() {
      freq_counter = (freq_counter + 1) & 127;
      if(freq_counter === 127)
      {
         if((lfsr & 1) === 1)
         {
            // noise output is '1' -> advance 8-bit shift register
            shift_reg = ((shift_reg >> 1) | ((~(shift_reg & 1) << 7) & freq)) & 0xFF;
         }      

         // update 16-bit LFSR
         let feedback = (~(((lfsr >> 3) & 1) ^ ((lfsr >> 12) & 1) ^ ((lfsr >> 14) & 1) ^ ((lfsr >> 15) & 1))) & 1;
         lfsr = ((lfsr << 1) | (feedback & (freq >> 7))) & 0xFFFF;         

         freq_counter = freq & 127;

         output = (shift_reg & 0x80) >> 7;                                       
      }                   
      
      aggregated_output.push(output);
   }

   /*
   speakerSound.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);               
      for(let i=0; i<output.length; i++) { 
         const sample = getsample();
         const audio = sample === 1 ? 0.75 : -0.75;
         output[i] = audio;
      }          
   }
   */

   for(let t=0;t<1024;t++) {
      clock_tick();
   }

   let out = aggregated_output.join("");
   console.log("bit stream");
   console.log(out);

})();

/*
if((audio_cycle & ((16 >> 3) - 1)) == 0)  // bass,alto,soprano use clock dividers 1,2,4, noise 8
{
   osc->freq_counter = (osc->freq_counter + 1) & 127;
   if(osc->freq_counter == 127)
   {
      uint16_t lfsr = vic.noise_lsfr;

      if(lfsr & 1)
      {
         // noise output is '1' -> advance 8-bit shift register
         osc->shift_reg = (osc->shift_reg >> 1) | ((!(osc->shift_reg & 1) << 7) & osc->freq);
      }

      // update 16-bit LFSR
      int feedback = !(((lfsr >> 3) & 1) ^ ((lfsr >> 12) & 1) ^ ((lfsr >> 14) & 1) ^ ((lfsr >> 15) & 1));
      vic.noise_lsfr = (vic.noise_lsfr << 1) | (feedback & (osc->freq >> 7));

      osc->freq_counter = osc->freq & 127;
   }
}

output += (osc->shift_reg & 0x80) >> 7;
*/

/*
pasteBasic(`
10 rem test graphic modes
20 color 15,0,8
30 g=5:w=640:h=192:c=0:gosub 1000
40 g=4:w=320:h=192:c=1:gosub 1000
50 g=3:w=160:h=192:c=1:gosub 1000
60 g=2:w=320:h=192:c=0:gosub 1000
70 g=1:w=160:h=192:c=1:gosub 1000
80 g=0:w=160:h= 96:c=1:gosub 1000
90 color 15:end
1000 gr g:color 15
1005 move(0,0)
1006 draw(w-1,0)
1007 draw(w-1,h-1)
1008 draw(0,h-1)
1009 draw(0,0)
1010 move(w/2,h/2)
1015 a=w/h*0.7
1020 for r=0 to 100 step 2
1030 x=w/2+sin(r)*(r*a)
1040 y=h/2+cos(r)*r
1041 if x<0 or x>=w-1 then 1070
1042 if y<0 or y>=h-1 then 1070
1045 if c=1 and rnd*10<2 then color rnd*14+1
1050 draw(x,y)
1060 next
1070 return
`)


*/


// count t-states between two addresses (included)
(function(start, end) {
   let ct = 0;
   let pc;
   debugBefore = ()=> {      
      pc = cpu.getState().pc;
      if(pc === start) ct = total_cycles;      
   };
   debugAfter = () =>{
      if(pc === end) {
         console.log(`${total_cycles-ct} CPU cycles`);
         debugBefore = undefined;
         debugAfter = undefined;
      }
   };
})(0x8e9e, 0x8eb4);

// find instruction count for raster pattern
(function() {
   for(let a=0;a<10;a++) {
      for(let b=0;b<10;b++) {     
         for(let c=0;c<10;c++) {
            let elap = 28 + 10*a + 22*b + 26*c
            if(elap === 118) console.log(a,b,c);
         }
      }
   }   
   console.log("end");
})();