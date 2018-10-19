// TODO joystick, caps lock, port 13 OUT(13),AA ?

function mapped_io_read(address) {   
   // TODO rewrite in negated logic?
   
   // filtra indirizzi
   if(address<0x2800 || address>0x2fff) return 0x7f;
   
   const row = address & 0x00FF;
   const hi  = (address & 0xFF00) >> 8;
  
   let sum = 0;   

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
   
   return (cassette_bit_in << 7) | (~sum & 0b01111111);
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
   if(address>=0x2800 && address<=0x2FFF) {
      speaker_B = (value & (1 << 5)) >> 5;
      speaker_A = (value & (1 << 0)) >> 0;
      vdc_graphic_mode_enabled = (value & (1<<3)) >> 3;
      cassette_bit_out = (value & (1<<2)) >> 2;  // LSB is ignored
   }
}
