/*
const BORDER_V =  32*2;    // 48 righe sopra e 48 sotto
const BORDER_H =  16*2;    // 1 carattere di bordo
const SCREEN_W = 640   + BORDER_H * 2;
const SCREEN_H = 192*2 + BORDER_V * 2;
*/

const BORDER_V =  32;    // 48 righe sopra e 48 sotto
const BORDER_H =  16;    // 1 carattere di bordo

const TEXT_W = 640; 
const TEXT_H = 192;

const SCREEN_W = BORDER_H + TEXT_W + BORDER_H;
const SCREEN_H = BORDER_V + TEXT_H + BORDER_V;

const palette = new Uint32Array(16);
const halfpalette = new Uint32Array(16);

function setPalette(i,r,g,b) { 
   palette[i] = 0xFF000000 | r | g << 8 | b << 16; 
   halfpalette[i] = 0xFF000000 | ((r/1.2)|0) | ((g/1.2)|0) << 8 | ((b/1.2)|0) << 16; 
}

setPalette( 0, 0x00, 0x00, 0x00);  /* black */
setPalette( 1, 0x00, 0x00, 0xa0);  /* blue */
setPalette( 2, 0x00, 0xa0, 0x00);  /* green */
setPalette( 3, 0x00, 0xa0, 0xa0);  /* cyan */
setPalette( 4, 0xa0, 0x00, 0x00);  /* red */
setPalette( 5, 0xa0, 0x00, 0xa0);  /* magenta */
setPalette( 6, 0xa0, 0xa0, 0x00);  /* yellow */
setPalette( 7, 0xa0, 0xa0, 0xa0);  /* bright grey */
setPalette( 8, 0x5f, 0x5f, 0x5f);  /* dark grey */
setPalette( 9, 0x70, 0x70, 0xff);  /* bright blue */
setPalette(10, 0x70, 0xff, 0x70);  /* bright green */
setPalette(11, 0x70, 0xff, 0xff);  /* bright cyan */
setPalette(12, 0xff, 0x70, 0x70);  /* bright red */
setPalette(13, 0xff, 0x70, 0xff);  /* bright magenta */
setPalette(14, 0xff, 0xff, 0x70);  /* bright yellow */
setPalette(15, 0xff, 0xff, 0xff);  /* white */

// canvas is the outer canvas where the aspect ratio is corrected
const canvas = document.getElementById("canvas");
canvas.width = SCREEN_W;
canvas.height = SCREEN_H;
const canvasContext = canvas.getContext('2d');

// screen is the inner canvas that contains the emulated PAL screen
const screenCanvas = document.createElement("canvas");
screenCanvas.width = SCREEN_W;
screenCanvas.height = SCREEN_H;
const screenContext = screenCanvas.getContext('2d');

const imageData = screenContext.getImageData(0, 0, SCREEN_W, SCREEN_H);

const bmp2 = imageData.data.buffer;
const bmp = new Uint32Array(bmp2);

/*
let ptr = 0;
for(let y=0;y<SCREEN_H;y++) {
   for(let x=0;x<SCREEN_W/2;x++) {
      setPixel(x, y, 9);
   }
}
*/

function drawFrame() 
{  
   if(vdc_graphic_mode_enabled) 
   {
      switch(vdc_graphic_mode_number) 
      {
         case 5: // GR 5 640x192 1bpp
            for(let y=0; y<192; y++) {
               offs = offs_2[y];
               for(let x=0; x<80; x++, offs++) {
                  const row = videoram[offs]; 
                  for(let xx=0;xx<8;xx++) {                     
                     const pixel_color = (row & (1<<xx)) > 0 ? vdc_text80_foreground : vdc_text80_background;                                                   
                     setPixel640(x*8+xx, y, pixel_color);
                  }
               }
            }
            break;
         case 4: // GR 4 320x192 2 colors per 8 pixels
            for(let y=0; y<192; y++) {
               offs = offs_2[y];
               for(let x=0; x<40; x++, offs += 2) {
                  const row = videoram[offs];
                  const fg = (videoram[offs+1] & 0xF0) >> 4;
                  const bg = (videoram[offs+1] & 0x0F);
                  for(let xx=0;xx<8;xx++) {                     
                     const pixel_color = (row & (1<<xx)) > 0 ? fg : bg;                                                   
                     setPixel320(x*8+xx, y, pixel_color);
                  }
               }
            }
            break;
         case 3: // GR 3 160x192 4bpp			
            for(let y=0; y<192; y++) {
               let offs = offs_2[y];
               for(let x=0; x<80; x++, offs++) {
                  const code = videoram[offs];
                  const left_pixel_color = (code & 0x0F);
                  const right_pixel_color = (code & 0xF0) >> 4;
                  setPixel160(x*2+0, y, left_pixel_color);
                  setPixel160(x*2+1, y, right_pixel_color);
               }
            }
            break;      
         case 2: // GR 2 320x192 1bpp
            for(let y=0; y<192; y++) {
               offs = offs_1[y];
               for(let x=0; x<40; x++, offs++) {                  
                  const row = videoram[offs];
                  for(let xx=0;xx<8;xx++) {                     
                     const pixel_color = (row & (1<<xx)) > 0 ? vdc_text80_foreground : vdc_text80_background;                                                   
                     setPixel320(x*8+xx, y, pixel_color);
                  }
               }
            }
            break;
         case 1: // GR 1 160x192 1bpp with two colors per 8 pixels			
            for(let y=0; y<192; y++) {
               offs = offs_1[y];
               for(let x=0; x<20; x++, offs += 2) {
                  const code = videoram[offs];
                  const color = videoram[offs+1];
                  const fg = (color & 0xF0) >> 4;
                  const bg = (color & 0x0F);
                  for(let xx=0;xx<8;xx++) {                     
                     const pixel_color = (code & (1<<xx)) > 0 ? fg : bg;                                                   
                     setPixel160(x*8+xx, y, pixel_color);
                  }                  
               }
            }
            break;
         case 0: // GR 0 160x96 4bpp 
            for(let y=0; y<96; y++) {            
               let offs = offs_0[y];
               for(let x=0; x<80; x++, offs++) {                  
                  const code = videoram[offs];
                  const left_pixel_color = (code & 0x0F);
                  const right_pixel_color = (code & 0xF0) >> 4;
                  setPixel96(x*2+0, y, left_pixel_color);
                  setPixel96(x*2+1, y, right_pixel_color);
               }
            }
            break;
      }
   }
   // text modes 
   else if(vdc_text80_enabled)
   {      
      // 80 columns text mode 
      for(let y=0; y<24; y++)
      {
         let offs = ((y & 7) << 8) + ((y >> 3) * 80);
         for(let x=0; x<80; x++, offs++)
         {
            const code = videoram[0x3800+offs];  
            
            const startchar = code*8;
            
            for(let yy=0;yy<8;yy++) {
               const row  = charset[startchar+yy];
               for(let xx=0;xx<8;xx++) {
                  const bb = 7-xx;
                  const pixel_color = (row & (1<<bb)) > 0 ? vdc_text80_foreground : vdc_text80_background;                                                   
                  setPixel640(x*8+xx, y*8+yy, pixel_color);
               }
            }                        
         }
      }      
   }
   else
   {
      // 40 columns text mode 
      for(let y=0; y<24; y++)
      {
         let offs = ((y & 7) << 8) + ((y >> 3) * 80);
         for(let x=0; x<40; x++, offs+=2)
         {
            const code = videoram[0x3800+offs];
            const color = videoram[0x3801+offs];
            
            const bg = color & 0xF;
            const fg = color >> 4;
  
            const startchar = code*8;
            
            for(let yy=0;yy<8;yy++) {
               const row  = charset[startchar+yy];
               for(let xx=0;xx<8;xx++) {
                  const bb = 7-xx;
                  const pixel_color = (row & (1<<bb)) > 0 ? fg : bg;                  
                  const c = palette[pixel_color]; 
                  const c1 = halfpalette[pixel_color];                   
                  setPixel320(x*8+xx, y*8+yy, pixel_color);
               }
            }                        
         }
      }
   }

   // draw borders
   for(let y=0; y<SCREEN_H; y++) {
      for(let x=0; x<SCREEN_W; x++) {
         const inside = y>=BORDER_V && y<(BORDER_V+TEXT_H) && x>=BORDER_H && x<BORDER_H+TEXT_W;
         if(!inside)
         {
            setPixelBorder(x,y, vdc_border_color);
         }
      }
   }

   canvasContext.putImageData(imageData, 0, 0);
	canvasContext.drawImage(screenCanvas, 0, 0, canvas.width, canvas.height);
}

function setPixel640(x,y, color) {
   const xx = x + BORDER_H;
   const yy = y + BORDER_V;
   bmp[ yy * SCREEN_W + xx ] = palette[color];
}

function setPixel320(x,y, color) {   
   const yy = y + BORDER_V;

   let ptr = yy * SCREEN_W + x*2 + BORDER_H;
   const col = palette[color];
   bmp[ ptr++ ] = col;
   bmp[ ptr   ] = col;
}

function setPixel160(x,y, color) {   
   const yy = y + BORDER_V;

   let ptr = yy * SCREEN_W + x*4 + BORDER_H;
   const col = palette[color];
   bmp[ ptr++ ] = col;
   bmp[ ptr++ ] = col;
   bmp[ ptr++ ] = col;
   bmp[ ptr   ] = col;
}

function setPixel96(x,y, color) {   
   setPixel160(x,y*2+0,color);
   setPixel160(x,y*2+1,color);
}

function setPixelBorder(x,y, color) {   
   let ptr = y * SCREEN_W + x;
   const col = palette[color];   
   bmp[ ptr   ] = col;
}

// 2x2
function _setPixel(x,y, color) {
   bmp[ (y * 2 + 0) * SCREEN_W + (x*2)+0 ] = palette[color];
   bmp[ (y * 2 + 0) * SCREEN_W + (x*2)+1 ] = palette[color];
   bmp[ (y * 2 + 1) * SCREEN_W + (x*2)+0 ] = halfpalette[color];
   bmp[ (y * 2 + 1) * SCREEN_W + (x*2)+1 ] = halfpalette[color];   
}

/*
function setPixel640(x,y, color) {   
   bmp[ (y * 2 + 0) * SCREEN_W + (x*1)+0 ] = palette[color];
   //bmp[ (y * 2 + 0) * SCREEN_W + (x*2)+1 ] = palette[color];
   bmp[ (y * 2 + 1) * SCREEN_W + (x*1)+0 ] = halfpalette[color];
   //bmp[ (y * 2 + 1) * SCREEN_W + (x*2)+1 ] = halfpalette[color];   
}
*/

// advances by 
let raster_y;
let raster_x;

function video_chip_cycle() {

}

const offs_2 = new Uint16Array([
	0x0000,0x0800,0x1000,0x1800,0x2000,0x2800,0x3000,0x3800,
	0x0100,0x0900,0x1100,0x1900,0x2100,0x2900,0x3100,0x3900,
	0x0200,0x0a00,0x1200,0x1a00,0x2200,0x2a00,0x3200,0x3a00,
	0x0300,0x0b00,0x1300,0x1b00,0x2300,0x2b00,0x3300,0x3b00,
	0x0400,0x0c00,0x1400,0x1c00,0x2400,0x2c00,0x3400,0x3c00,
	0x0500,0x0d00,0x1500,0x1d00,0x2500,0x2d00,0x3500,0x3d00,
	0x0600,0x0e00,0x1600,0x1e00,0x2600,0x2e00,0x3600,0x3e00,
	0x0700,0x0f00,0x1700,0x1f00,0x2700,0x2f00,0x3700,0x3f00,
	0x0050,0x0850,0x1050,0x1850,0x2050,0x2850,0x3050,0x3850,
	0x0150,0x0950,0x1150,0x1950,0x2150,0x2950,0x3150,0x3950,
	0x0250,0x0a50,0x1250,0x1a50,0x2250,0x2a50,0x3250,0x3a50,
	0x0350,0x0b50,0x1350,0x1b50,0x2350,0x2b50,0x3350,0x3b50,
	0x0450,0x0c50,0x1450,0x1c50,0x2450,0x2c50,0x3450,0x3c50,
	0x0550,0x0d50,0x1550,0x1d50,0x2550,0x2d50,0x3550,0x3d50,
	0x0650,0x0e50,0x1650,0x1e50,0x2650,0x2e50,0x3650,0x3e50,
	0x0750,0x0f50,0x1750,0x1f50,0x2750,0x2f50,0x3750,0x3f50,
	0x00a0,0x08a0,0x10a0,0x18a0,0x20a0,0x28a0,0x30a0,0x38a0,
	0x01a0,0x09a0,0x11a0,0x19a0,0x21a0,0x29a0,0x31a0,0x39a0,
	0x02a0,0x0aa0,0x12a0,0x1aa0,0x22a0,0x2aa0,0x32a0,0x3aa0,
	0x03a0,0x0ba0,0x13a0,0x1ba0,0x23a0,0x2ba0,0x33a0,0x3ba0,
	0x04a0,0x0ca0,0x14a0,0x1ca0,0x24a0,0x2ca0,0x34a0,0x3ca0,
	0x05a0,0x0da0,0x15a0,0x1da0,0x25a0,0x2da0,0x35a0,0x3da0,
	0x06a0,0x0ea0,0x16a0,0x1ea0,0x26a0,0x2ea0,0x36a0,0x3ea0,
	0x07a0,0x0fa0,0x17a0,0x1fa0,0x27a0,0x2fa0,0x37a0,0x3fa0
]);

const offs_1 = new Uint16Array([
	0x2000,0x2080,0x2800,0x2880,0x3000,0x3080,0x3800,0x3880,
	0x2100,0x2180,0x2900,0x2980,0x3100,0x3180,0x3900,0x3980,
	0x2200,0x2280,0x2a00,0x2a80,0x3200,0x3280,0x3a00,0x3a80,
	0x2300,0x2380,0x2b00,0x2b80,0x3300,0x3380,0x3b00,0x3b80,
	0x2400,0x2480,0x2c00,0x2c80,0x3400,0x3480,0x3c00,0x3c80,
	0x2500,0x2580,0x2d00,0x2d80,0x3500,0x3580,0x3d00,0x3d80,
	0x2600,0x2680,0x2e00,0x2e80,0x3600,0x3680,0x3e00,0x3e80,
	0x2700,0x2780,0x2f00,0x2f80,0x3700,0x3780,0x3f00,0x3f80,
	0x2028,0x20a8,0x2828,0x28a8,0x3028,0x30a8,0x3828,0x38a8,
	0x2128,0x21a8,0x2928,0x29a8,0x3128,0x31a8,0x3928,0x39a8,
	0x2228,0x22a8,0x2a28,0x2aa8,0x3228,0x32a8,0x3a28,0x3aa8,
	0x2328,0x23a8,0x2b28,0x2ba8,0x3328,0x33a8,0x3b28,0x3ba8,
	0x2428,0x24a8,0x2c28,0x2ca8,0x3428,0x34a8,0x3c28,0x3ca8,
	0x2528,0x25a8,0x2d28,0x2da8,0x3528,0x35a8,0x3d28,0x3da8,
	0x2628,0x26a8,0x2e28,0x2ea8,0x3628,0x36a8,0x3e28,0x3ea8,
	0x2728,0x27a8,0x2f28,0x2fa8,0x3728,0x37a8,0x3f28,0x3fa8,
	0x2050,0x20d0,0x2850,0x28d0,0x3050,0x30d0,0x3850,0x38d0,
	0x2150,0x21d0,0x2950,0x29d0,0x3150,0x31d0,0x3950,0x39d0,
	0x2250,0x22d0,0x2a50,0x2ad0,0x3250,0x32d0,0x3a50,0x3ad0,
	0x2350,0x23d0,0x2b50,0x2bd0,0x3350,0x33d0,0x3b50,0x3bd0,
	0x2450,0x24d0,0x2c50,0x2cd0,0x3450,0x34d0,0x3c50,0x3cd0,
	0x2550,0x25d0,0x2d50,0x2dd0,0x3550,0x35d0,0x3d50,0x3dd0,
	0x2650,0x26d0,0x2e50,0x2ed0,0x3650,0x36d0,0x3e50,0x3ed0,
	0x2750,0x27d0,0x2f50,0x2fd0,0x3750,0x37d0,0x3f50,0x3fd0
]);

const offs_0 = new Uint16Array([
	0x2000,0x2800,0x3000,0x3800,0x2100,0x2900,0x3100,0x3900,
	0x2200,0x2a00,0x3200,0x3a00,0x2300,0x2b00,0x3300,0x3b00,
	0x2400,0x2c00,0x3400,0x3c00,0x2500,0x2d00,0x3500,0x3d00,
	0x2600,0x2e00,0x3600,0x3e00,0x2700,0x2f00,0x3700,0x3f00,
	0x2050,0x2850,0x3050,0x3850,0x2150,0x2950,0x3150,0x3950,
	0x2250,0x2a50,0x3250,0x3a50,0x2350,0x2b50,0x3350,0x3b50,
	0x2450,0x2c50,0x3450,0x3c50,0x2550,0x2d50,0x3550,0x3d50,
	0x2650,0x2e50,0x3650,0x3e50,0x2750,0x2f50,0x3750,0x3f50,
	0x20a0,0x28a0,0x30a0,0x38a0,0x21a0,0x29a0,0x31a0,0x39a0,
	0x22a0,0x2aa0,0x32a0,0x3aa0,0x23a0,0x2ba0,0x33a0,0x3ba0,
	0x24a0,0x2ca0,0x34a0,0x3ca0,0x25a0,0x2da0,0x35a0,0x3da0,
	0x26a0,0x2ea0,0x36a0,0x3ea0,0x27a0,0x2fa0,0x37a0,0x3fa0
]);
