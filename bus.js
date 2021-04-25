let bus_ops = 0;

function mem_read(address) {
   bus_ops++;
   const bank = banks[(address & 0xC000) >> 14];
   const base = address & 0x3FFF;
   switch(bank) {
      case  0: return rom1[base];
      case  1: return rom2[base];
      case  2: return mapped_io_read(base);      
      case  3: return bank3[base]; // page 3 is video for Laser 350 only
      case  4: return bank4[base];
      case  5: return bank5[base];      
      case  6: return bank6[base];      
      case  7: return bank7[base];
      case  8: return bank8[base];
      case  9: return bank9[base];
      case 10: return bankA[base];
      case 11: return bankB[base];
      case 12: return bankC[base];
      case 13: return bankD[base];
      case 14: return bankE[base];
      case 15: return bankF[base];
   }
}

function mem_write(address, value) {
   bus_ops++;
   const bank = banks[(address & 0xF000) >> 14];   
   const base = address & 0x3FFF;
   switch(bank) {
      case  0: break; // writing in rom
      case  1: break; // writing in rom
      case  2: mapped_io_write(base, value); break;

      /*
      // laser 350
      case  3: bank3[base] = value; break;
      case  4: break;
      case  5: break;
      case  6: break;
      case  7: break;
      */

      // laser 500
      case  3: break; // page 3 is disabled as works only in Laser 350      
      case  4: bank4[base] = value; break;
      case  5: bank5[base] = value; break;
      case  6: bank6[base] = value; break;
      case  7: bank7[base] = value; break;


      case  8: break; // TODO expansion slots
      case  9: break; // TODO expansion slots
      case 10: break; // TODO expansion slots
      case 11: break; // TODO expansion slots
      case 12: break; // TODO expansion slots
      case 13: break; // TODO expansion slots
      case 14: break; // TODO expansion slots
      case 15: break; // TODO expansion slots
   }
}

function io_read(ioport) {  
   /*
   const hi = (port & 0xFF00) >> 8;
   const p = port & 0xFF;
   if(hi>0 && (p>=0x10 && p<=0x1f)) {
      console.log(`port read ${hex(port & 0xFF)} hi byte set to ${hex(hi)}`);
   }
   */
   const port = ioport & 0xFF;
   switch(port) {
      case 0x2b: return joy0; // joy0;  // joystick left, 8 directions
      case 0x27: return joy1; // joy1;  // joystick left, fire buttons
      case 0x00: return printerReady;
      case 0x2d: return 0xff; // joy1;  // joystick right, fire buttons (not emulated)
      case 0x2e: return 0xff; // joy0;  // joystick right, 8 directions (not emulated)
      case 0x10:
      case 0x11:
      case 0x12:
      case 0x13:
      case 0x14:
         return emulate_fdc ? FDC_io_read(port) : (port | 1);

      // fictional serial device
      case 0x78:
         // serial data read
         return serial.cpu_read_data();

      case 0x7a:
         // serial status, always ready
         return serial.cpu_read_status();

   }
   console.warn(`read from unknown port ${hex(port)}h`);
   return port | 1; // this is the value returned from unused ports
}

function io_write(port, value) { 
   /*
   const hi = (port & 0xFF00) >> 8;
   const p = port & 0xFF;
   if(hi>0 && (p>=0x10 && p<=0x1f)) {
      console.log(`port write ${hex(port & 0xFF)} hi byte set to ${hex(hi)}, value=${hex(value)}`);
   }
   */   
   // console.log(`io write ${hex(port)} ${hex(value)}`)  
   switch(port & 0xFF) {
      case 0x40: banks[0] = value & 0xF; break;
      case 0x41: banks[1] = value & 0xF; break;
      case 0x42: banks[2] = value & 0xF; break;
      case 0x43: banks[3] = value & 0xF; break;
      case 0x44:          
         vdc_page_7 = ((value & 0b1000) >> 3) === 0;
         vdc_text80_enabled = value & 1; 
         vdc_border_color = (value & 0xF0) >> 4
              if((value & 0b110) === 0b000) vdc_graphic_mode_number = 5;              
         else if((value & 0b111) === 0b010) vdc_graphic_mode_number = 4;
         else if((value & 0b111) === 0b011) vdc_graphic_mode_number = 3;
         else if((value & 0b111) === 0b110) vdc_graphic_mode_number = 2;
         else if((value & 0b111) === 0b111) vdc_graphic_mode_number = 1;
         else if((value & 0b110) === 0b100) vdc_graphic_mode_number = 0;                  
         break;
      case 0x45: 
         vdc_text80_foreground = (value & 0xF0) >> 4;
         vdc_text80_background = value & 0x0F;         
         break;
      case 0x0d:
         printerWrite(value);
      case 0x0e:
         // printer port duplicated here
         return;                           
      case 0x10:
      case 0x11:
      case 0x12:
      case 0x13:
      case 0x14:
         if(emulate_fdc) FDC_io_write(port & 0xFF, value);
         return;

      // fictional serial device
      case 0x78:
         // serial data
         serial.cpu_write_data(value);
         return;

      case 0x7a:
         // serial command, ignored
         serial.cpu_write_command(value);
         return;

      default:
         console.warn(`write on unknown port ${hex(port)}h value ${hex(value)}h`);
   }   
}
