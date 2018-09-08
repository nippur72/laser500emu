const nrows = 13;
const ncols = 0x06;
const keyboard_rows = new Uint8Array(nrows+1); // 1-based TODO fix

let browser_keys_state = { };

function keyPress(row, col) {   
   keyboard_rows[row] |= col;
}

function keyRelease(row, col) {
   keyboard_rows[row] &= (~col);
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

mappa('Shift', 1, 0x40);
mappa('z'    , 1, 0x20); //mappa('Z'    , 0b1, 0x20, true);
mappa('x'    , 1, 0x10); //mappa('X'    , 0b1, 0x10, true);
mappa('c'    , 1, 0x08); //mappa('C'    , 0b1, 0x08, true);
mappa('v'    , 1, 0x04); //mappa('V'    , 0b1, 0x04, true);
mappa('b'    , 1, 0x02); //mappa('B'    , 0b1, 0x02, true);
mappa('n'    , 1, 0x01); //mappa('N'    , 0b1, 0x01, true);

mappa('Control', 2, 0x40);
mappa('a',       2, 0x20);   //mappa('A',       0b10, 0x20, true); 
mappa('s',       2, 0x10);   //mappa('S',       0b10, 0x10, true); 
mappa('d',       2, 0x08);   //mappa('D',       0b10, 0x08, true); 
mappa('f',       2, 0x04);   //mappa('F',       0b10, 0x04, true); 
mappa('g',       2, 0x02);   //mappa('G',       0b10, 0x02, true); 
mappa('h',       2, 0x01);   //mappa('H',       0b10, 0x01, true); 

mappa('Tab', 3, 0x40);
mappa('q',   3, 0x20);      //mappa('Q',   0b100, 0x20, true);
mappa('w',   3, 0x10);      //mappa('W',   0b100, 0x10, true);
mappa('e',   3, 0x08);      //mappa('E',   0b100, 0x08, true);
mappa('r',   3, 0x04);      //mappa('R',   0b100, 0x04, true);
mappa('t',   3, 0x02);      //mappa('T',   0b100, 0x02, true);
mappa('y',   3, 0x01);      //mappa('Y',   0b100, 0x01, true);

mappa('Escape', 4, 0x40);
mappa('1',      4, 0x20); mappa('!', 4, 0x20, true);
mappa('2',      4, 0x10); mappa('@', 4, 0x10, true); 
mappa('3',      4, 0x08); mappa('#', 4, 0x08, true); 
mappa('4',      4, 0x04); mappa('$', 4, 0x04, true); 
mappa('5',      4, 0x02); mappa('%', 4, 0x02, true); 
mappa('6',      4, 0x01); mappa('^', 4, 0x01, true); 

// mappa('', 4, 0x40); // apparently unused
mappa('=', 5, 0x20); mappa('+', 5, 0x20, true);
mappa('-', 5, 0x10); mappa('_', 5, 0x10, true);
mappa('0', 5, 0x08); mappa(')', 5, 0x08, true);
mappa('9', 5, 0x04); mappa('(', 5, 0x04, true);
mappa('8', 5, 0x02); mappa('*', 5, 0x02, true);
mappa('7', 5, 0x01); mappa('&', 5, 0x01, true);

mappa('Backspace', 6, 0x40); 
// mappa('', 5, 0x20); apparently unused
// mappa('', 5, 0x10); apparently unused
mappa('p', 6, 0x08);    //mappa('P', 0b100000, 0x08, true);
mappa('o', 6, 0x04);    //mappa('O', 0b100000, 0x04, true);
mappa('i', 6, 0x02);    //mappa('I', 0b100000, 0x02, true);
mappa('u', 6, 0x01);    //mappa('U', 0b100000, 0x01, true);

mappa('Enter', 7, 0x40);                        
// mappa('', 6, 0x20); apparently unused
mappa("'", 7, 0x10); mappa('"', 7, 0x10, true);
mappa(';', 7, 0x08); mappa(':', 7, 0x08, true);  
mappa('l', 7, 0x04); //mappa('l', 0b1000000, 0x04, true);
mappa('k', 7, 0x02); //mappa('k', 0b1000000, 0x02, true);
mappa('j', 7, 0x01); //mappa('j', 0b1000000, 0x01, true);
                                                       
mappa('§', 8, 0x40); // Graph key             
mappa('`', 8, 0x20); mappa('~', 8, 0x20, true); /* alternates: */ mappa('°', 8, 0x20); mappa('ç', 8, 0x20, true); 
mappa(' ', 8, 0x10);
mappa('/', 8, 0x08); mappa('?', 8, 0x08, true);
mappa('.', 8, 0x04); mappa('>', 8, 0x04, true);
mappa(',', 8, 0x02); mappa('<', 8, 0x02, true);
mappa('m', 8, 0x01); //mappa('M', 0b10000000, 0x01, true);

// 6bff
mappa('\\'     , 9, 0x40); mappa('|'      , 9, 0x40, true); 
mappa('['      , 9, 0x20); mappa('{'      , 9, 0x20, true); 
mappa(']'      , 9, 0x10); mappa('}'      , 9, 0x10, true); 
mappa('ù'      , 9, 0x08); mappa('£'      , 9, 0x08, true); 
mappa('Insert' , 9, 0x04); 
mappa('Delete' , 9, 0x02); 
mappa('Insert' , 9, 0x01); 

// 6aff
// caps lock
mappa('CapsLock'   , 10, 0x40); 
mappa('End'        , 10, 0x20); // del line
mappa('Home'       , 10, 0x10); 
mappa('ArrowUp'    , 10, 0x08); 
mappa('ArrowLeft'  , 10, 0x04); 
mappa('ArrowRight' , 10, 0x02); 
mappa('ArrowDown'  , 10, 0x01); 

// 69ff
//mappa('\\' , 0b10100000000, 0x20); 
mappa('F10', 11, 0x10);   
mappa('F9' , 11, 0x08);   
mappa('F8' , 11, 0x04);   
mappa('F7' , 11, 0x01); 
mappa('F6' , 11, 0x02); 
mappa('F5' , 11, 0x01); 

// 68ff
mappa('F4', 12, 0x20); 
mappa('F3', 12, 0x10); 
mappa('F2', 12, 0x08); 
mappa('F1', 12, 0x04); 
