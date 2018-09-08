const nrows = 0x0F;
const ncols = 0x06;
const keyboard_matrix = new Uint8Array(nrows);

let browser_keys_state = { };

function keyPress(row, col) {   
   for(let t=0;t<15;t++) {
      if(row & (1<<t)) { 
         keyboard_matrix[t] |= col;
      }
   }            
}

function keyRelease(row, col) {
   for(let t=0;t<15;t++) {
      if(row & (1<<t)) { 
         keyboard_matrix[t] &= (~col);
      }
   }   
}

const element = document; //.getElementById("canvas");

element.onkeydown = function keyDown(e) {   
   const key = e.key;
   if(key=="Tab") e.preventDefault(); // TOD fix browser keys

   if(key=="Cancel") {
      cpu.reset();
      e.preventDefault(); // TOD fix browser keys
      return;
   }
   
   const k = translation[key];
   if(k !== undefined) {
      if(browser_keys_state[key] == 'down') return;      
      browser_keys_state[key] = 'down';
      keyPress(k.row, k.col);
      if(k.shift) keyPress(0b1, 0x40);      
      e.preventDefault();
      debugKeyboard("press", key);
   }
   else console.log(key);
}

element.onkeyup = function keyUp(e) {   
   const key = e.key;
   const k = translation[key];   
   if(k !== undefined) {      
      browser_keys_state[key] = 'up';
      keyRelease(k.row, k.col);
      if(k.shift) keyRelease(0b1, 0x40);      
      e.preventDefault();
      debugKeyboard("relea", key);
   }
   else console.log(key);
}

const translation = { };

function mappa(key, row, col, shift) {
   translation[key] = { row, col, shift: shift?true:false };
}

mappa('Shift', 0b1, 0x40);
mappa('z'    , 0b1, 0x20); //mappa('Z'    , 0b1, 0x20, true);
mappa('x'    , 0b1, 0x10); //mappa('X'    , 0b1, 0x10, true);
mappa('c'    , 0b1, 0x08); //mappa('C'    , 0b1, 0x08, true);
mappa('v'    , 0b1, 0x04); //mappa('V'    , 0b1, 0x04, true);
mappa('b'    , 0b1, 0x02); //mappa('B'    , 0b1, 0x02, true);
mappa('n'    , 0b1, 0x01); //mappa('N'    , 0b1, 0x01, true);

mappa('Control', 0b10, 0x40);
mappa('a',       0b10, 0x20);   //mappa('A',       0b10, 0x20, true); 
mappa('s',       0b10, 0x10);   //mappa('S',       0b10, 0x10, true); 
mappa('d',       0b10, 0x08);   //mappa('D',       0b10, 0x08, true); 
mappa('f',       0b10, 0x04);   //mappa('F',       0b10, 0x04, true); 
mappa('g',       0b10, 0x02);   //mappa('G',       0b10, 0x02, true); 
mappa('h',       0b10, 0x01);   //mappa('H',       0b10, 0x01, true); 

mappa('Tab', 0b100, 0x40);
mappa('q',   0b100, 0x20);      //mappa('Q',   0b100, 0x20, true);
mappa('w',   0b100, 0x10);      //mappa('W',   0b100, 0x10, true);
mappa('e',   0b100, 0x08);      //mappa('E',   0b100, 0x08, true);
mappa('r',   0b100, 0x04);      //mappa('R',   0b100, 0x04, true);
mappa('t',   0b100, 0x02);      //mappa('T',   0b100, 0x02, true);
mappa('y',   0b100, 0x01);      //mappa('Y',   0b100, 0x01, true);

mappa('Escape', 0b1000, 0x40);
mappa('1',      0b1000, 0x20); mappa('!', 0b1000, 0x20, true);
mappa('2',      0b1000, 0x10); mappa('@', 0b1000, 0x10, true); 
mappa('3',      0b1000, 0x08); mappa('#', 0b1000, 0x08, true); 
mappa('4',      0b1000, 0x04); mappa('$', 0b1000, 0x04, true); 
mappa('5',      0b1000, 0x02); mappa('%', 0b1000, 0x02, true); 
mappa('6',      0b1000, 0x01); mappa('^', 0b1000, 0x01, true); 

// mappa('', 4, 0x40); // apparently unused
mappa('=', 0b10000, 0x20); mappa('+', 0b10000, 0x20, true);
mappa('-', 0b10000, 0x10); mappa('_', 0b10000, 0x10, true);
mappa('0', 0b10000, 0x08); mappa(')', 0b10000, 0x08, true);
mappa('9', 0b10000, 0x04); mappa('(', 0b10000, 0x04, true);
mappa('8', 0b10000, 0x02); mappa('*', 0b10000, 0x02, true);
mappa('7', 0b10000, 0x01); mappa('&', 0b10000, 0x01, true);

mappa('Backspace', 0b100000, 0x40); 
// mappa('', 5, 0x20); apparently unused
// mappa('', 5, 0x10); apparently unused
mappa('p', 0b100000, 0x08);    //mappa('P', 0b100000, 0x08, true);
mappa('o', 0b100000, 0x04);    //mappa('O', 0b100000, 0x04, true);
mappa('i', 0b100000, 0x02);    //mappa('I', 0b100000, 0x02, true);
mappa('u', 0b100000, 0x01);    //mappa('U', 0b100000, 0x01, true);

mappa('Enter', 0b1000000, 0x40);                        
// mappa('', 6, 0x20); apparently unused
mappa("'", 0b1000000, 0x10); mappa('"', 0b1000000, 0x10, true);
mappa(';', 0b1000000, 0x08); mappa(':', 0b1000000, 0x08, true);  
mappa('l', 0b1000000, 0x04); //mappa('l', 0b1000000, 0x04, true);
mappa('k', 0b1000000, 0x02); //mappa('k', 0b1000000, 0x02, true);
mappa('j', 0b1000000, 0x01); //mappa('j', 0b1000000, 0x01, true);
                                                       
mappa('§', 0b10000000, 0x40); // Graph key             
mappa('`', 0b10000000, 0x20); mappa('~', 0b10000000, 0x20, true); /* alternates: */ mappa('°', 0b10000000, 0x20); mappa('ç', 0b10000000, 0x20, true); 
mappa(' ', 0b10000000, 0x10);
mappa('/', 0b10000000, 0x08); mappa('?', 0b10000000, 0x08, true);
mappa('.', 0b10000000, 0x04); mappa('>', 0b10000000, 0x04, true);
mappa(',', 0b10000000, 0x02); mappa('<', 0b10000000, 0x02, true);
mappa('m', 0b10000000, 0x01); //mappa('M', 0b10000000, 0x01, true);

// 6bff
mappa('\\'     , 0b10000000000, 0x40); mappa('|'      , 0b10000000000, 0x40, true); 
mappa('['      , 0b10000000000, 0x20); mappa('{'      , 0b10000000000, 0x20, true); 
mappa('['      , 0b10000000000, 0x10); mappa('{'      , 0b10000000000, 0x10, true); 
mappa('ù'      , 0b10000000000, 0x08); mappa('£'      , 0b10000000000, 0x08, true); 
mappa('Insert' , 0b10000000000, 0x04); 
mappa('Delete' , 0b10000000000, 0x02); 
mappa('Insert' , 0b10000000000, 0x01); 

// 6aff
// caps lock
mappa('CapsLock'   , 0b10100000000, 0x40); 
mappa('End'        , 0b10100000000, 0x20); // del line
mappa('Home'       , 0b10100000000, 0x10); 
mappa('ArrowUp'    , 0b10100000000, 0x08); 
mappa('ArrowLeft'  , 0b10100000000, 0x04); 
mappa('ArrowRight' , 0b10100000000, 0x02); 
mappa('ArrowDown'  , 0b10100000000, 0x01); 

// 69ff
//mappa('\\' , 0b10100000000, 0x20); 
mappa('F10', 0b11000000000, 0x10);   
mappa('F9' , 0b11000000000, 0x08);   
mappa('F8' , 0b11000000000, 0x04);   
mappa('F7' , 0b11000000000, 0x01); 
mappa('F6' , 0b11000000000, 0x02); 
mappa('F5' , 0b11000000000, 0x01); 

// 68ff
mappa('F4', 0b11100000000, 0x20); 
mappa('F3', 0b11100000000, 0x10); 
mappa('F2', 0b11100000000, 0x08); 
mappa('F1', 0b11100000000, 0x04); 
