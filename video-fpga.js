// **************** hardware rendering **********************

function setPixelHardware(x, y, color) {
   const yy = y*2;
   const ptr0 = (yy+0) * SCREEN_W + x;
   const ptr1 = (yy+1) * SCREEN_W + x;
   bmp[ ptr0 ] = color;
   bmp[ ptr1 ] = color;
}

const hfp = 10;         // horizontal front porch, unused time before hsync
const hsw = 66;         // hsync width
const hbp = 70;         // horizontal back porch, unused time after hsync

const HEIGHT              = 192;  // height of active area
const TOP_BORDER_WIDTH    =  65;  // top border
const BOTTOM_BORDER_WIDTH =  56;  // bottom
const V                   = 313;  // number of lines

const WIDTH               = 640;  // width of active area
const LEFT_BORDER_WIDTH   =  72;  // left border
const RIGHT_BORDER_WIDTH  =  86;  // right border
const H                   = 798;  // width of visible area

// 14778730 / (row_length * 312) =~49.7 => row_length = 952

let hsync = 0;
let vsync = 0;

let hcnt; // horizontal counter
let vcnt; // vertical counter
let xcnt;
let ycnt;
let char;
let fgbg;
let ramDataD;
let ramData;
let ramAddress;
let charsetData;
let charsetAddress;
let charsetQ;

let _hcnt  = 0; // horizontal counter
let _vcnt  = 0; // vertical counter
let _xcnt  = 0;
let _ycnt  = 0;
let _pixel = 0;
let _char  = 0;
let _ramDataD = 0;
let _ramData = 0;
let _charsetData = 0;
let _fgbg  = 0;
let _ramAddress = 0;
let _charsetAddress = 0;
let _CGS = 0;
let _sdram_dout = 0;

const color_vsync = 0xFF8aff69;
const color_hsync = 0xFFd64de2;
const color_blank = 0xFF331e38;

//let load_column = 0;

let vdc_interrupt = 0;
let ppp=0;

// wires
let fg = 0;
let bg = 0;


function clockF14M() {

   // external ports
   sdram_dout = vdc_page_7 ? bank7[_ramAddress & 0x3FFF] : bank3[_ramAddress & 0x3FFF];

   //sdram_dout = _sdram_dout;

   charsetQ = charset[_charsetAddress];

   // simulate @posedge
   hcnt = _hcnt;
   vcnt = _vcnt;
   xcnt = _xcnt;
   ycnt = _ycnt;
   char = _char;
   ramData = _ramData;
   ramDataD = _ramDataD;
   charsetData = _charsetData;
   fgbg = _fgbg;
   ramAddress = _ramAddress;
   charsetAddress = _charsetAddress;

   // x counter
   xcnt = hcnt - (hsw+hbp+LEFT_BORDER_WIDTH);

   // ram data is not available during the CPU slot
   if((xcnt % 8) >= 4) sdram_dout = 0xFE; // junk data

   // ROM only during T=7
   if((xcnt & 7) !== 7) charsetQ = 0xFE; // junk data

   // @end posedge

   // ******** assign block
   // generate negative hsync and vsync signals
   hsync = (hcnt < hsw) ? 0 : 1;
   vsync = (vcnt <   2) ? 0 : 1;

   let xcnt1 = xcnt + 8;  // text80, gr0, gr2, gr3
   let xcnt2 = xcnt + 16; // text40 and gr4
   let xcnt3 = xcnt + 24; // gr1

   fg = (vdc_graphic_mode_enabled && (vdc_graphic_mode_number === 5 || vdc_graphic_mode_number === 2)) || (!vdc_graphic_mode_enabled && vdc_text80_enabled) ? palette[vdc_text80_foreground] : palette[fgbg >> 4];
   bg = (vdc_graphic_mode_enabled && (vdc_graphic_mode_number === 5 || vdc_graphic_mode_number === 2)) || (!vdc_graphic_mode_enabled && vdc_text80_enabled) ? palette[vdc_text80_background] : palette[fgbg & 0x0F];

   // ******** end assign block

   // simulate VGA output
        if(vsync === 0) setPixelHardware(hcnt, vcnt, color_vsync);
   else if(hsync === 0) setPixelHardware(hcnt, vcnt, color_hsync);
   else                 setPixelHardware(hcnt, vcnt, _pixel);

   // horizontal and vertical counters
   if(hcnt === hsw+hbp+H+hfp-1)
   {
      _hcnt = 0;
      if(vcnt === V-1) {
         _vcnt = 0;
         vdc_interrupt = 1;
      }
      else {
         _vcnt = vcnt + 1;
      }

      if(vcnt === TOP_BORDER_WIDTH-1) _ycnt = 0;
      else _ycnt = ycnt + 1;
   }
   else _hcnt = hcnt + 1;

   // simulate ram data
   if((xcnt & 15) === 14) {
      _sdram_dout = ((xcnt >> 4) + 35 + (ycnt >> 3)) & 0xFF;
   }
   else if((xcnt & 15) === 6) {
      _sdram_dout = 0xf1;
   }

   // draw pixel at hcnt,bcnt
   if(hcnt < hsw+hbp || vcnt < 2 || hcnt >= hsw+hbp+H) {
      _pixel = color_blank;  // blanking zone
   }
   else if( (vcnt < TOP_BORDER_WIDTH || vcnt >= TOP_BORDER_WIDTH + HEIGHT) ||
            (hcnt < hsw+hbp + LEFT_BORDER_WIDTH || hcnt >= hsw+hbp + LEFT_BORDER_WIDTH + WIDTH)) {
      _pixel = palette[vdc_border_color];  // border color
   }
   else {
      if(vdc_graphic_mode_enabled) {
         if(vdc_graphic_mode_number === 5) {
            // GR 5 640x192x1
            _pixel = (char & 1) === 1 ? fg : bg;
            _char = char >> 1;
         } else if(vdc_graphic_mode_number === 4) {
            // GR 4 320x192x2
            if((xcnt & 1) === 0) {
               _pixel = (char & 1) === 1 ? fg : bg;
               _char = char >> 1;
            }
         } else if(vdc_graphic_mode_number === 3 || vdc_graphic_mode_number === 0) {
            // GR 3 160x192x16, GR 0 160x96
            if((xcnt & 3) === 0) {
               _pixel = palette[char & 0xF];
               _char = char >> 4;
            }
         } else if(vdc_graphic_mode_number === 2) {
            // GR 2 320x196x1
            if((xcnt & 1) === 0) {
               _pixel = (char & 1) === 1 ? fg : bg;
               _char = char >> 1;
            }
         } else if(vdc_graphic_mode_number === 1) {
            // GR 1 160x192x2
            if((xcnt & 3) === 0) {
               _pixel = (char & 1) === 1 ? fg : bg;
               _char = char >> 1;
            }
         }
      }
      else if(vdc_text80_enabled) {
         // TEXT 80
         _pixel = (char & 1) === 1 ? fg : bg;
         _char = char >> 1;
      }
      else {
         // TEXT 40
         if((xcnt & 1) === 0) {
            _pixel = (char & 1) === 1 ? fg : bg;
            _char = char >> 1;
         }
      }
   }

   // T=3 read character from RAM and stores into latch, starts ROM reading
   if((xcnt & 7) === 3) {
      _ramData = sdram_dout;
      _charsetAddress = (sdram_dout << 3) | (ycnt & 0b111); // TODO eng/ger/fra
   }

   // *** NEW *** T=7 calculate RAM address

   // load start row address on the leftmost column

   if(vdc_graphic_mode_enabled) {
      if(vdc_graphic_mode_number === 5 || vdc_graphic_mode_number === 4 || vdc_graphic_mode_number === 3) {
         // GR 5, GR 4, GR 3
         _ramAddress =
            (((ycnt & (1<<2))>>2)<<13) |   // address[13] = ycnt[2]
            (((ycnt & (1<<1))>>1)<<12) |   // address[12] = ycnt[1]
            (((ycnt & (1<<0))>>0)<<11) |   // address[11] = ycnt[0]
            (((ycnt & (1<<5))>>5)<<10) |   // address[10] = ycnt[5]
            (((ycnt & (1<<4))>>4)<< 9) |   // address[ 9] = ycnt[4]
            (((ycnt & (1<<3))>>3)<< 8) |   // address[ 8] = ycnt[3]
            (((ycnt & (1<<7))>>7)<< 7) |   // address[ 7] = ycnt[7]
            (((ycnt & (1<<6))>>6)<< 6) |   // address[ 6] = ycnt[6]
            (((ycnt & (1<<7))>>7)<< 5) |   // address[ 5] = ycnt[7]
            (((ycnt & (1<<6))>>6)<< 4) ;   // address[ 4] = ycnt[6]

            if(vdc_graphic_mode_number === 5) _ramAddress = _ramAddress + (xcnt1 >> 3);
            if(vdc_graphic_mode_number === 4) _ramAddress = _ramAddress + (xcnt2 >> 3);
            if(vdc_graphic_mode_number === 3) _ramAddress = _ramAddress + (xcnt1 >> 3);

      } else if(vdc_graphic_mode_number === 2 || vdc_graphic_mode_number === 1) {
         // GR 2 e GR 1
         _ramAddress =
            (1<<13) +
            (((ycnt & (1<<2))>>2)<<12) |   // address[12] <= ycnt[2]
            (((ycnt & (1<<1))>>1)<<11) |   // address[11] <= ycnt[1]
            (((ycnt & (1<<5))>>5)<<10) |   // address[10] <= ycnt[5]
            (((ycnt & (1<<4))>>4)<< 9) |   // address[ 9] <= ycnt[4]
            (((ycnt & (1<<3))>>3)<< 8) |   // address[ 8] <= ycnt[3]
            (((ycnt & (1<<0))>>0)<< 7) |   // address[ 7] <= ycnt[0]
            (((ycnt & (1<<7))>>7)<< 6) |   // address[ 6] <= ycnt[7]
            (((ycnt & (1<<6))>>6)<< 5) |   // address[ 5] <= ycnt[6]
            (((ycnt & (1<<7))>>7)<< 4) |   // address[ 4] <= ycnt[7]
            (((ycnt & (1<<6))>>6)<< 3) ;   // address[ 3] <= ycnt[6]

            if(vdc_graphic_mode_number === 2) _ramAddress = _ramAddress + (xcnt1 >> 4);
            if(vdc_graphic_mode_number === 1) _ramAddress = _ramAddress + (xcnt3 >> 4);

      } else if(vdc_graphic_mode_number === 0) {
         // GR 0
         _ramAddress = (1<<13) +
            (((ycnt & (1<<2))>>2)<<12) |   // address[12] = ycnt[2]
            (((ycnt & (1<<1))>>1)<<11) |   // address[11] = ycnt[1]
            (((ycnt & (1<<5))>>5)<<10) |   // address[10] = ycnt[5]
            (((ycnt & (1<<4))>>4)<< 9) |   // address[ 9] = ycnt[4]
            (((ycnt & (1<<3))>>3)<< 8) |   // address[ 8] = ycnt[3]
            (((ycnt & (1<<7))>>7)<< 7) |   // address[ 7] = ycnt[7]
            (((ycnt & (1<<6))>>6)<< 6) |   // address[ 6] = ycnt[6]
            (((ycnt & (1<<7))>>7)<< 5) |   // address[ 5] = ycnt[7]
            (((ycnt & (1<<6))>>6)<< 4) ;   // address[ 4] = ycnt[6]

            _ramAddress = _ramAddress + (xcnt1 >> 3);
      }
   }
   else if(vdc_text80_enabled) {
      // TEXT 80
      const by = ycnt >> 3;
      let offs = ((by & 7) << 8) + ((by >> 3) << 6) + ((by >> 3) << 4);
      _ramAddress = 0x3800+offs;

      _ramAddress = 0x3800+
         (((ycnt & (1<<5))>>5)<<10) |   // address[10] = ycnt[5]
         (((ycnt & (1<<4))>>4)<< 9) |   // address[ 9] = ycnt[4]
         (((ycnt & (1<<3))>>3)<< 8) |   // address[ 8] = ycnt[3]
         (((ycnt & (1<<7))>>7)<< 7) |   // address[ 7] = ycnt[7]
         (((ycnt & (1<<6))>>6)<< 6) |   // address[ 6] = ycnt[6]
         (((ycnt & (1<<7))>>7)<< 5) |   // address[ 5] = ycnt[7]
         (((ycnt & (1<<6))>>6)<< 4) ;   // address[ 4] = ycnt[6]

      _ramAddress = _ramAddress + (xcnt1 >> 3);
   } else {
      // TEXT 40
      const by = ycnt >> 3;
      let offs = ((by & 7) << 8) + ((by >> 3) << 6) + ((by >> 3) << 4);
      _ramAddress = 0x3800+offs;

      _ramAddress = 0x3800+
         (((ycnt & (1<<5))>>5)<<10) |   // address[10] = ycnt[5]
         (((ycnt & (1<<4))>>4)<< 9) |   // address[ 9] = ycnt[4]
         (((ycnt & (1<<3))>>3)<< 8) |   // address[ 8] = ycnt[3]
         (((ycnt & (1<<7))>>7)<< 7) |   // address[ 7] = ycnt[7]
         (((ycnt & (1<<6))>>6)<< 6) |   // address[ 6] = ycnt[6]
         (((ycnt & (1<<7))>>7)<< 5) |   // address[ 5] = ycnt[7]
         (((ycnt & (1<<6))>>6)<< 4) ;   // address[ 4] = ycnt[6]

      _ramAddress = _ramAddress + (xcnt2 >> 3);
   }

   // T=7 move saved latch to the pixel register
   if(vdc_graphic_mode_enabled) {
      // gr modes
      if(vdc_graphic_mode_number === 5) {
         if((xcnt & 7) === 7) {
            _char = ramData;
         }
      } else if(vdc_graphic_mode_number === 4) {
         // GR 4
         if((xcnt & 15) === 7) {
            _ramDataD = ramData;
         }
         else if((xcnt & 15) === 15) {
            _char = ramDataD;
            _fgbg = ramData;
         }
      } else if(vdc_graphic_mode_number === 3 || vdc_graphic_mode_number === 0) {
         // GR 3
         if((xcnt & 7) === 7) {
            _char = ramData;
         }
      } else if(vdc_graphic_mode_number === 2) {
         if((xcnt & 15) === 15) {
            _char = ramData;
            //_ramAddress = ramAddress + 1;
         }
      } else if(vdc_graphic_mode_number === 1) {
         if((xcnt & 31) === 15) {
            _ramDataD = ramData;
            _ramAddress = ramAddress + 1;
         }
         else if((xcnt & 31) === 31) {
            _char = ramDataD;
            _fgbg = ramData;
            //_ramAddress = ramAddress + 1;
         }
      }
   }
   else if(vdc_text80_enabled) {
      // TEXT 80
      if((xcnt & 7) === 7) {
         _char = charsetQ;
      }
   }
   else {
      // TEXT 40
      if((xcnt & 15) === 7) {
         _ramDataD = charsetQ;
      }
      else if((xcnt & 15) === 15) {
         _char = ramDataD;
         _fgbg = ramData;
      }
   }
}
