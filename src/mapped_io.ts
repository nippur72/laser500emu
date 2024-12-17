/* @@@ mapped_io.js */  
// TODO joystick, caps lock, port 13 OUT(13),AA ?

import { laser500 } from "./emulator";
import { keyboard_poll } from "./keys";
import { bit } from "./bytes";

export function mapped_io_read(address: number): number {   
   // KA and KD are lines coming from keyboard 
   // mapped respectively on address and data bus      
   if(address>=0x2800 && address<=0x2FFF) {
      //console.log(`=== mappeed io read ${hex(address,4)}`);
      return (laser500.cassette_bit_in << 7) | keyboard_poll(address);   
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
export function mapped_io_write(address: number, value: number): void {
   if(address>=0x2800 && address<=0x2FFF) {
      laser500.caps_lock_bit            = bit(value,6);
      laser500.vdc_graphic_mode_enabled = bit(value,3);
      laser500.cassette_bit_out         = bit(value,2);  
      laser500.speaker_A                = bit(value,0);
      //console.log(`=== mappeed io write ${hex(address,4)} ${hex(value)}`);
      //console.log(`caps_lock_bit            = ${caps_lock_bit           }`);
      //console.log(`vdc_graphic_mode_enabled = ${vdc_graphic_mode_enabled}`);
      //console.log(`cassette_bit_out         = ${cassette_bit_out        }`);
      //console.log(`speaker_A                = ${speaker_A               }`);
   }
}
