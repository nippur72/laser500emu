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