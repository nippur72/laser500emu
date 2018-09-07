const BORDER_V =  32*2;  // 1 carattere di bordo
const BORDER_H =  16*2;    // 1 carattere di bordo
const SCREEN_W = 640   + BORDER_H * 2;
const SCREEN_H = 192*2 + BORDER_V * 2;

const palette = new Uint32Array(16);
const halfpalette = new Uint32Array(16);

function setPalette(i,r,g,b) { 
   palette[i] = 0xFF000000 | r | g << 8 | b << 16; 
   halfpalette[i] = 0xFF000000 | ((r/1.5)|0) | ((g/1.5)|0) << 8 | ((b/1.5)|0) << 16; 
}

setPalette( 0, 0x00, 0x00, 0x00);  /* black */
setPalette( 1, 0x00, 0x00, 0x7f);  /* blue */
setPalette( 2, 0x00, 0x7f, 0x00);  /* green */
setPalette( 3, 0x00, 0x7f, 0x7f);  /* cyan */
setPalette( 4, 0x7f, 0x00, 0x00);  /* red */
setPalette( 5, 0x7f, 0x00, 0x7f);  /* magenta */
setPalette( 6, 0x7f, 0x7f, 0x00);  /* yellow */
setPalette( 7, 0xa0, 0xa0, 0xa0);  /* bright grey */
setPalette( 8, 0x7f, 0x7f, 0x7f);  /* dark grey */
setPalette( 9, 0x70, 0x70, 0xff);  /* bright blue */
setPalette(10, 0x00, 0xff, 0x00);  /* bright green */
setPalette(11, 0x00, 0xff, 0xff);  /* bright cyan */
setPalette(12, 0xff, 0x00, 0x00);  /* bright red */
setPalette(13, 0xff, 0x00, 0xff);  /* bright magenta */
setPalette(14, 0xff, 0xff, 0x00);  /* bright yellow */
setPalette(15, 0xff, 0xff, 0xff);  /* white */

// canvas is the outer canvas where the aspect ratio is corrected
const canvas = document.getElementById("canvas");
canvas.width = SCREEN_W * 2.0;
canvas.height = SCREEN_H * 2.0;
const canvasContext = canvas.getContext('2d');

// screen is the inner canvas that contains the emulated PAL screen
const screenCanvas = document.createElement("canvas");
//screenCanvas.width = SCREEN_W;
//screenCanvas.height = SCREEN_H;
const screenContext = screenCanvas.getContext('2d');

const imageData = screenContext.getImageData(0, 0, SCREEN_W, SCREEN_H);

const bmp2 = imageData.data.buffer;
const bmp = new Uint32Array(bmp2);

let ptr = 0;
for(let y=0;y<SCREEN_H;y++) {
   for(let x=0;x<SCREEN_W/2;x++) {
      setPixel(x, y, 9);
   }
}

function drawFrame() {
   
   // text modes 
   if(vdc_text80_enabled)
   {
      /*
      // 80 columns text mode 
      for(let y=0; y<24; y++)
      {
         const offs = ((y & 7) << 8) + ((y >> 3) * 80);
         for(let x=0; x<80; x++, offs++)
         {
            const color = m_laser_two_color;
            const sy = BORDER_V/2 + y * 8;
            const sx = BORDER_H/2 + x * 8;
            const code = videoram[0x3800+offs];
            //m_gfxdecode->gfx(0)->opaque(bitmap,cliprect,code,color,0,0,sx,sy);
         }
      }
      */
   }
   else
   {
      // 40 columns text mode 
      for(let y=0; y<24; y++)
      {
         let offs = ((y & 7) << 8) + ((y >> 3) * 80);
         for(let x=0; x<40; x++, offs+=2)
         {
            //const sy = BORDER_V/2 + y * 8;
            //const sx = BORDER_H/2 + x * 16;
            
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
                  /*
                  setPixel((x*8+xx)*2+0,(y*8+yy)*2,c);
                  setPixel((x*8+xx)*2+1,(y*8+yy)*2,c);
                  setPixel((x*8+xx)*2+0,(y*8+yy)*2+1,c1);
                  setPixel((x*8+xx)*2+1,(y*8+yy)*2+1,c1);
                  */
                  setPixel(BORDER_H/2 + x*8+xx, BORDER_V/2 + y*8+yy, pixel_color);
               }
            }                        
         }
      }
   }

   canvasContext.putImageData(imageData, 0, 0);
	canvasContext.drawImage(screenCanvas, 0, 0, canvas.width, canvas.height);
}

/*
function setPixel(x,y,c) {
   const ptr = y * SCREEN_W + x;
   bmp[ptr] = c;
}
*/

// 2x2
function setPixel(x,y, color) {
   bmp[ (y * 2 + 0) * SCREEN_W + (x*2)+0 ] = palette[color];
   bmp[ (y * 2 + 0) * SCREEN_W + (x*2)+1 ] = palette[color];
   bmp[ (y * 2 + 1) * SCREEN_W + (x*2)+0 ] = halfpalette[color];
   bmp[ (y * 2 + 1) * SCREEN_W + (x*2)+1 ] = halfpalette[color];   
}

