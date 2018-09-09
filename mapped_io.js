// TODO joystick, caps lock, port 13 OUT(13),AA ?

let re = {};
let wr = {};

function mapped_io_read(address) {   
   // TODO rewrite in negated logic?
   
   /*
   if(true) {
      if(re[address] !== true) console.log(`reading mapped io ${hex(0x4000+address,4)}`);
      re[address] = true;
   }
   */

   // filtra indirizzi
   if(address<0x2800 || address>0x2fff) return 0x00;
   
   const row = address & 0x00FF;
   const hi  = (address & 0xFF00) >> 8;
  
   let sum;   

   switch(hi) 
   {
      case 0x28: sum = keyboard_rows[11]; break;
      case 0x29: sum = keyboard_rows[12]; break;
      case 0x2a: sum = keyboard_rows[10]; break;
      case 0x2b: sum = keyboard_rows[9];  break;         
   }

   for(let t=0;t<8;t++) {
      if((row & (1<<t)) == 0 ) sum |= keyboard_rows[t+1];      
   }   

   const outp = (cassette_bit_in << 7) | (~sum & 0b01111111);
   
   return outp;
}

function __mapped_io_read(address) {   
   // TODO rewrite in negated logic?
   
   /*
   if(true) {
      if(re[address] !== true) console.log(`reading mapped io ${hex(0x4000+address,4)}`);
      re[address] = true;
   }
   */

   // filtra indirizzi
   if(address<0x2800 || address>0x2fff) return 0x00;
   
   const rowselect    = address & 0x00FF;
   const extended_row = (address & 0x03FF) >> 8;
   const extended     = rowselect === 0xFF; 
   // const ioselect     = (address & 0x38FF) >> 11;
  
   let sum;
   
   //console.log(`address=${hex(0x4000+address,4)} io=${ioselect.toString(2)} row=${rowselect.toString(2)} col=${colselect.toString(2)}`);

   if(extended) 
   {
      switch(extended_row) 
      {
         case 0b00: sum = keyboard_rows[11]; break;
         case 0b01: sum = keyboard_rows[12]; break;
         case 0b10: sum = keyboard_rows[10]; break;
         case 0b11: sum = keyboard_rows[9];  break;         
      }
   }
   else
   {
      for(let t=0;t<8;t++) {
         if((rowselect & (1<<t)) == 0 ) sum |= keyboard_rows[t+1];      
      }   
   }

   //if(sum !== 0) console.log(`address=${hex(0x4000+address,4)} io=${ioselect.toString(2)} extendend=${extended} row=${extended_row.toString(2)} col=${rowselect.toString(2)} ${hex(sum)}`);

   const outp = (cassette_bit_in << 7) | (~sum & 0b01111111);
   
   return outp;
}


function old_mapped_io_read(address) {   
   // TODO rewrite in negated logic?

   
   if(re[address] !== true) {
      console.log(`${hex(0x4000+address,4)}`);
      if(address == 0) {
         console.log(`pc=${hex(cpu.pc(),4)}`);
         console.log(banks);
      }
   }
   re[address] = true;
      
   const base = (~address) & 0xFFFF;

   let high_bits = (base & 0b00011100000000) >> 8;
   let sum;
   if(high_bits > 0) 
   {
           if(high_bits == 0b100) sum = keyboard_rows[9];
      else if(high_bits == 0b101) sum = keyboard_rows[10]; // ok
      else if(high_bits == 0b110) sum = keyboard_rows[12];
      else if(high_bits == 0b111) sum = keyboard_rows[11]; 

      /*
      if(sum==undefined)
      {
         console.log(`${hex(address,4)} = ?`);
      }
      else if(sum!=0) {
         console.log(`${hex(address,4)} = ${hex(sum)}`);
      }
      */
   }
   else {
      for(let t=0;t<8;t++) {
         if((base & (1<<t)) > 0 ) sum |= keyboard_rows[t+1];      
      }   
   }

   const outp = (cassette_bit_in << 7) | (~sum & 0b01111111);
   
   return outp;
}

/*
emulator.js:37 reading mapped i/o 4000,0000 0
                                                   76543210       
emulator.js:37 reading mapped i/o 6bff,2bff 101011-11111111  100 ROWD
emulator.js:37 reading mapped i/o 6aff,2aff 101010-11111111  101
emulator.js:37 reading mapped i/o 69ff,29ff 101001-11111111  110
emulator.js:37 reading mapped i/o 68ff,28ff 101000-11111111  111

emulator.js:37 reading mapped i/o 6f7f,2f7f 101111-01111111
emulator.js:37 reading mapped i/o 6fbf,2fbf 101111-10111111
emulator.js:37 reading mapped i/o 6fdf,2fdf 101111-11011111
emulator.js:37 reading mapped i/o 6fef,2fef 101111-11101111
emulator.js:37 reading mapped i/o 6ff7,2ff7 101111-11110111
emulator.js:37 reading mapped i/o 6ffb,2ffb 101111-11111011
emulator.js:37 reading mapped i/o 6ffd,2ffd 101111-11111101
emulator.js:37 reading mapped i/o 6ffe,2ffe 101111-11111110

  BANK-76543210
       SEL
*/

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
   /*
   if(wr[address] !== true) {
      console.log(`write address ${hex(0x4000+address,4)} value = ${hex(value)}`);
   }
   wr[address] = true;
   */

   if(address>=0x2800 && address<=0x2FFF) {
      speaker_B = (value & (1 << 5)) >> 5;
      speaker_A = (value & (1 << 0)) >> 0;
      vdc_graphic_mode_enabled = (value & (1<<3)) >> 3;
      cassette_bit_out = (value & (1<<2)) >> 2;  // LSB is ignored
   }
}
