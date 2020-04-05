// TODO joystick, caps lock, port 13 OUT(13),AA ?

function mapped_io_read(address) {   
   // KA and KD are lines coming from keyboard 
   // mapped respectively on address and data bus      
   if(address>=0x2800 && address<=0x2FFF) {
      let DO = 0x7f;
      if(address === KA) DO = KD;
      return (cassette_bit_in << 7) | DO;   
   }
   return 0x7f;
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
