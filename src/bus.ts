import { laser500 } from "./emulator";
import { rom1, rom2 } from "./roms";
import { mapped_io_read, mapped_io_write } from "./mapped_io";
import { joy_left, joy_right } from "./joystick";
import { hex } from "./bytes";
import { FDC_io_read, FDC_io_write } from "./floppy";

let bus_ops = 0;  // counts memory accesses to emulate CPU wait states

export function clear_bus_ops() {
   bus_ops = 0;
}

export function get_bus_ops() {
   return bus_ops;
}

export function mem_read(address: number): number {
   bus_ops++;
   const bank = laser500.banks[(address & 0xC000) >> 14];
   const base = address & 0x3FFF;
   switch(bank) {
      case  0: return rom1[base];
      case  1: return rom2[base];
      case  2: return mapped_io_read(base);      
      case  3: return laser500.bank3[base]; // page 3 is video for Laser 350 only
      case  4: return laser500.bank4[base];
      case  5: return laser500.bank5[base];      
      case  6: return laser500.bank6[base];      
      case  7: return laser500.bank7[base];
      case  8: return laser500.bank8[base];
      case  9: return laser500.bank9[base];
      case 10: return laser500.bankA[base];
      case 11: return laser500.bankB[base];
      case 12: return laser500.bankC[base];
      case 13: return laser500.bankD[base];
      case 14: return laser500.bankE[base];
      case 15: return laser500.bankF[base];
      default: throw "invalid bank configuration";
   }
}

export function mem_write(address: number, value: number): void {
   bus_ops++;
   const bank = laser500.banks[(address & 0xF000) >> 14];   
   const base = address & 0x3FFF;
   switch(bank) {
      case  0: break; // writing in rom
      case  1: break; // writing in rom
      case  2: mapped_io_write(base, value); break;

      case  3: if(laser500.isLaser350) laser500.bank3[base] = value; break; 

      case  4: if(!laser500.isLaser350) laser500.bank4[base] = value; break;
      case  5: if(!laser500.isLaser350) laser500.bank5[base] = value; break;
      case  6: if(!laser500.isLaser350) laser500.bank6[base] = value; break;
      case  7: if(!laser500.isLaser350) laser500.bank7[base] = value; break;

      case  8: if(laser500.isLaser700) laser500.bank8[base] = value; break; 
      case  9: if(laser500.isLaser700) laser500.bank9[base] = value; break; 
      case 10: if(laser500.isLaser700) laser500.bankA[base] = value; break; 
      case 11: if(laser500.isLaser700) laser500.bankB[base] = value; break; 

      case 12: break; // TODO expansion slots
      case 13: break; // TODO expansion slots
      case 14: break; // TODO expansion slots
      case 15: break; // TODO expansion slots
   }
}

export function io_read(ioport) {  
   const port = ioport & 0xFF;

   if(laser500.joystick_connected && ((port & 0xF0) == 0x20)) {
      // joysticks
      let data = 0x1F; // only 5 bits
      if(((port & 1) == 0) && joy_right.up   ) data &=  ~1;
      if(((port & 1) == 0) && joy_right.down ) data &=  ~2;
      if(((port & 1) == 0) && joy_right.left ) data &=  ~4;
      if(((port & 1) == 0) && joy_right.right) data &=  ~8;
      if(((port & 1) == 0) && joy_right.fire ) data &= ~16;
      if(((port & 2) == 0) && joy_right.arm  ) data &= ~16;

      if(((port & 4) == 0) && joy_left.up   ) data &=  ~1;
      if(((port & 4) == 0) && joy_left.down ) data &=  ~2;
      if(((port & 4) == 0) && joy_left.left ) data &=  ~4;
      if(((port & 4) == 0) && joy_left.right) data &=  ~8;
      if(((port & 4) == 0) && joy_left.fire ) data &= ~16;
      if(((port & 8) == 0) && joy_left.arm  ) data &= ~16;
      return data;
   }
   else if(port <= 0x0F && (port & 1) === 0) {
      // printer busy line (00h-0Fh even)
      return laser500.printer.printerReady;
   }
   else if(port >= 0x10 && port <= 0x14 && laser500.emulate_fdc) {
      // floppy disk controller
      return FDC_io_read(port);
   }
   else if(port == 0x50) return laser500.serial.read_status_register(); // serial device: status register
   else if(port == 0x51) return laser500.serial.read_data_register();   // serial device: data register   
   else {
      console.warn(`read from unknown port ${hex(port)}h`);
   }
   return port | 1; // this is the value returned from unused ports on a real Laser 500
}

export function io_write(port, value) { 
   switch(port & 0xFF) {
      case 0x40: laser500.banks[0] = value & 0xF; break;
      case 0x41: laser500.banks[1] = value & 0xF; break;
      case 0x42: laser500.banks[2] = value & 0xF; break;
      case 0x43: laser500.banks[3] = value & 0xF; break;
      case 0x44:
         laser500.vdc_page_7 = ((value & 0b1000) >> 3) === 0;
         laser500.vdc_text80_enabled = value & 1; 
         laser500.vdc_border_color = (value & 0xF0) >> 4
              if((value & 0b110) === 0b000) laser500.vdc_graphic_mode_number = 5;              
         else if((value & 0b111) === 0b010) laser500.vdc_graphic_mode_number = 4;
         else if((value & 0b111) === 0b011) laser500.vdc_graphic_mode_number = 3;
         else if((value & 0b111) === 0b110) laser500.vdc_graphic_mode_number = 2;
         else if((value & 0b111) === 0b111) laser500.vdc_graphic_mode_number = 1;
         else if((value & 0b110) === 0b100) laser500.vdc_graphic_mode_number = 0;
         //console.log(`=== io write ${hex(port & 0xFF)} ${hex(value)}`)
         //console.log(`vdc_page_7 = ${vdc_page_7}`);
         //console.log(`vdc_text80_enabled = ${vdc_text80_enabled}`);
         //console.log(`vdc_border_color = ${vdc_border_color}`);
         //console.log(`vdc_graphic_mode_number = ${vdc_graphic_mode_number}`);
         break;
      case 0x45:
         laser500.vdc_text80_foreground = (value & 0xF0) >> 4;
         laser500.vdc_text80_background = value & 0x0F;
         //console.log(`=== io write ${hex(port & 0xFF)} ${hex(value)}`)
         //console.log(`vdc_text80_foreground = ${vdc_text80_foreground}`);
         //console.log(`vdc_text80_background = ${vdc_text80_background}`);
         break;

      // Centronics printer interface: 00h-0Fh
      // Write even: 8 bit data to printer
      case 0x00:
      case 0x02:
      case 0x04:
      case 0x06:
      case 0x08:
      case 0x0a:
      case 0x0c:
      case 0x0e:
         laser500.printer.setData(value);
         return;

      // Write odd: printer strobe
      case 0x01:
      case 0x03:
      case 0x05:
      case 0x07:
      case 0x09:
      case 0x0b:
      case 0x0d:
      case 0x0f:
         laser500.printer.strobe();
         return;

      case 0x10:
      case 0x11:
      case 0x12:
      case 0x13:
      case 0x14:
         if(laser500.emulate_fdc) FDC_io_write(port & 0xFF, value);
         return;
      
      case 0x50: // serial status register is read-only
         return;

      case 0x51: // serial data register 
         laser500.serial.write_data_register(value);
         return;

      default:
         console.warn(`write on unknown port ${hex(port)}h value ${hex(value)}h`);
   }   
}
