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
      case 0x28: sum = keyboard_matrix[11]; break;
      case 0x29: sum = keyboard_matrix[12]; break;
      case 0x2a: sum = keyboard_matrix[10]; break;
      case 0x2b: sum = keyboard_matrix[9];  break;         
   }

   for(let t=0;t<8;t++) {
      if((row & (1<<t)) == 0 ) sum |= keyboard_matrix[t+1];      
   }      
   
   return (cassette_bit_in << 7) | (~sum & 0b01111111);
}

/* on write 
* 7    ?? not assigned
* 6    caps lock state
* 5    speaker B
* 4    ???
* 3    mode: 1 graphics, 0 text
* 2    cassette out (MSB)
* 1    cassette out (LSB)
* 0    speaker A
*/
function mapped_io_write(address, value) {
   if(address>=0x2800 && address<=0x2FFF) {
      io_bit_7                 = bit(value,7);
      caps_lock_bit            = bit(value,6);
      speaker_B                = bit(value,5);
      io_bit_4                 = bit(value,4);
      vdc_graphic_mode_enabled = bit(value,3);
      cassette_bit_out         = bit(value,2);  
      cassette_bit_out_l       = bit(value,1); // this is ignored 
      speaker_A                = bit(value,0);
   }
}
