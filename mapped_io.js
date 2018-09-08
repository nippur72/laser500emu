let re = [], wr = [];
let v = 100;

// TODO joystick, caps lock, port 13 OUT(13),AA ?

function mapped_io_read(address) {
   if(!re[address]) console.log(`reading mapped i/o ${hex(address+0x4000,4)},${hex(address,4)} ${address.toString(2)}`);
   re[address] = true;
   
   // TODO rewrite in negated logic?

   const base = (~address) & 0b1111111111111111;
   let sum = 0;
   for(let t=0;t<0x0F;t++) {
      if((base & (1<<t)) > 0 ) sum |= keyboard_matrix[t];      
   }
   
   const outp = cassette_bit | (~sum & 0b01111111);

   // if(address == 0x2bff /*&& browser_keys_state['ì']==true*/) return 0x08;
   // if(address == 0x2bff && outp!=127) console.log(outp);
   
   return outp;
}

/*
emulator.js:37 reading mapped i/o 4000,0000 0

emulator.js:37 reading mapped i/o 6bff,2bff 10101111111111  100 ROWD
emulator.js:37 reading mapped i/o 6aff,2aff 10101011111111  101
emulator.js:37 reading mapped i/o 69ff,29ff 10100111111111  110
emulator.js:37 reading mapped i/o 68ff,28ff 10100011111111  111
emulator.js:37 reading mapped i/o 6f7f,2f7f 10111101111111
emulator.js:37 reading mapped i/o 6fbf,2fbf 10111110111111
emulator.js:37 reading mapped i/o 6fdf,2fdf 10111111011111
emulator.js:37 reading mapped i/o 6fef,2fef 10111111101111
emulator.js:37 reading mapped i/o 6ff7,2ff7 10111111110111
emulator.js:37 reading mapped i/o 6ffb,2ffb 10111111111011
emulator.js:37 reading mapped i/o 6ffd,2ffd 10111111111101
emulator.js:37 reading mapped i/o 6ffe,2ffe 10111111111110
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
   if(!wr[address]) console.log(`writing mapped i/o ${hex(address,4)} v=${hex(value)} ${address.toString(2)}`);
   wr[address] = true;

   //console.log(`writing mapped i/o ${hex(address,4)} v=${hex(value)} ${address.toString(2)}`);

   if(DEBUG) console.log(`writing mapped i/o ${hex(address,4)} value=${value}`);
   if(address>=0x2800 && address<=0x2FFF) {
      speaker_B = (value & (1 << 5)) >> 5;
      speaker_A = (value & (1 << 0)) >> 0;
      vdc_graphic_mode_enabled = (value & (1<<3)) >> 3;
      cassette_bit = (value & (1<<2)) >> 2;  // LSB is ignored
   }
}
