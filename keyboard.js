const nrows = 13;
const ncols = 0x06;
const keyboard_rows = new Uint8Array(nrows+1); // the hardware key matrix 6x13 rows // 1-based TODO fix
const keys = new Array(75); // hardware keys row and col info
const assign_table = { };   // conversion table from PC key to Laser key

let browser_keys_state = { }; // holds track of press state to avoid key repeat, as repeat is handled in Laser

function keyPress(row, col) {   
   keyboard_rows[row] |= col;
}

function keyRelease(row, col) {
   keyboard_rows[row] &= (~col);
}

function needsShift(pckey) {
   const keyinfo = assign_table[pckey];
   if(keyinfo === undefined) return undefined;
   return keyinfo.shift;
}

function pckey_to_laserkey(pckey) {
   const keyinfo = assign_table[pckey];
   if(keyinfo === undefined) return undefined;
   const laserkey = keys[keyinfo.key];
   return laserkey;
}

function map(key, row, col) {
   keys[key] = { row, col };
}

function assignKey(pckey, laserkey, lasershift) {
   assign_table[pckey] = { key: laserkey, shift: lasershift };
}

const element = document; //.getElementById("canvas");

function keyDown(e) {   
   let key = e.key;
   if(key=="Tab") e.preventDefault(); // TOD fix browser keys

   if(key=="Cancel") {
      cpu.reset();
      e.preventDefault(); // TOD fix browser keys
      return;
   }
   
   // remap shift+home into Cls
   if(key==="Home" && e.shiftKey === true) key = "Cls";

   const k = pckey_to_laserkey(key);   
   if(k !== undefined) {
      if(browser_keys_state[key] == 'down') return;      
      browser_keys_state[key] = 'down';
      const shift = needsShift(key);
      keyPress(k.row, k.col);
           if(shift === true)  keyPress(1, 0x40);      
      else if(shift === false) keyRelease(1, 0x40);
      e.preventDefault();
      // debugKeyboard("press", key);
   }
   else {
      if(key !== "Shift" && key !== "AltGraph" && key !== "Alt") {
         console.log(`unknown key ${key}`);
      }
   }
}

function keyUp(e) {   
   let key = e.key;

   // remap shift+home into Cls
   if(key==="Home" && e.shiftKey === true) key = "Cls";

   const k = pckey_to_laserkey(key);
   if(k !== undefined) {      
      browser_keys_state[key] = 'up';
      const shift = needsShift(key);
      keyRelease(k.row, k.col);
           if(shift === true) keyRelease(1, 0x40);   
      else if(shift === false) keyRelease(1, 0x40);   
      e.preventDefault();
      // debugKeyboard("relea", key);
   }   
}

element.onkeydown = keyDown;
element.onkeyup = keyUp;

const KEY_RESET = 0; // not mapped on I/O but directly on /RES CPU
const KEY_F1  = 1;
const KEY_F2  = 2;
const KEY_F3  = 3;
const KEY_F4  = 4;
const KEY_F5  = 5;
const KEY_F6  = 6;
const KEY_F7  = 7;
const KEY_F8  = 8;
const KEY_F9  = 9;
const KEY_F10 = 10;
const KEY_INS = 11;
const KEY_DEL = 12;
const KEY_ESC = 13;
const KEY_1 = 14;
const KEY_2 = 15;
const KEY_3 = 16;
const KEY_4 = 17;
const KEY_5 = 18;
const KEY_6 = 19;
const KEY_7 = 20;
const KEY_8 = 21;
const KEY_9 = 22;
const KEY_0 = 23;
const KEY_MINUS = 24;
const KEY_EQUAL = 25;
const KEY_BACKSLASH = 26;
const KEY_BS = 27;
const KEY_DEL_LINE = 28;
const KEY_CLS_HOME = 29;
const KEY_TAB = 30;
const KEY_Q = 31;
const KEY_W = 32;
const KEY_E = 33;
const KEY_R = 34;
const KEY_T = 35;
const KEY_Y = 36;
const KEY_U = 37;
const KEY_I = 38;
const KEY_O = 39;
const KEY_P = 40;
const KEY_OPEN_BRACKET = 41;
const KEY_CLOSE_BRACKET = 42;
const KEY_RETURN = 43;
const KEY_CONTROL = 44;
const KEY_A = 45;
const KEY_S = 46;
const KEY_D = 47;
const KEY_F = 48;
const KEY_G = 49;
const KEY_H = 50;
const KEY_J = 51;
const KEY_K = 52;
const KEY_L = 53;
const KEY_SEMICOLON = 54;
const KEY_QUOTE = 55;
const KEY_BACK_QUOTE = 56;
const KEY_GRAPH = 57;
const KEY_UP = 58;
const KEY_SHIFT = 59;
const KEY_Z = 60;
const KEY_X = 61;
const KEY_C = 62;
const KEY_V = 63;
const KEY_B = 64;
const KEY_N = 65;
const KEY_M = 66;
const KEY_COMMA = 67;
const KEY_DOT = 68;
const KEY_SLASH = 69;
const KEY_MU = 70;
const KEY_LEFT = 71;
const KEY_RIGHT = 72;
const KEY_CAP_LOCK = 73;
const KEY_SPACE = 74;
const KEY_DOWN = 75;

map(KEY_SHIFT, 1, 0x40);
map(KEY_Z    , 1, 0x20); 
map(KEY_X    , 1, 0x10); 
map(KEY_C    , 1, 0x08); 
map(KEY_V    , 1, 0x04); 
map(KEY_B    , 1, 0x02); 
map(KEY_N    , 1, 0x01); 

map(KEY_CONTROL, 2, 0x40);
map(KEY_A,       2, 0x20);   
map(KEY_S,       2, 0x10);   
map(KEY_D,       2, 0x08);   
map(KEY_F,       2, 0x04);   
map(KEY_G,       2, 0x02);   
map(KEY_H,       2, 0x01);   

map(KEY_TAB, 3, 0x40);
map(KEY_Q,   3, 0x20);      
map(KEY_W,   3, 0x10);      
map(KEY_E,   3, 0x08);      
map(KEY_R,   3, 0x04);      
map(KEY_T,   3, 0x02);      
map(KEY_Y,   3, 0x01);      

map(KEY_ESC, 4, 0x40);
map(KEY_1,   4, 0x20); 
map(KEY_2,   4, 0x10); 
map(KEY_3,   4, 0x08); 
map(KEY_4,   4, 0x04); 
map(KEY_5,   4, 0x02); 
map(KEY_6,   4, 0x01); 

map(KEY_EQUAL, 5, 0x20); 
map(KEY_MINUS, 5, 0x10); 
map(KEY_0    , 5, 0x08); 
map(KEY_9    , 5, 0x04); 
map(KEY_8    , 5, 0x02); 
map(KEY_7    , 5, 0x01); 

map(KEY_BS, 6, 0x40); 
map(KEY_P , 6, 0x08); 
map(KEY_O , 6, 0x04); 
map(KEY_I , 6, 0x02); 
map(KEY_U , 6, 0x01); 

map(KEY_RETURN   , 7, 0x40);                        
map(KEY_QUOTE    , 7, 0x10);
map(KEY_SEMICOLON, 7, 0x08);
map(KEY_L        , 7, 0x04);
map(KEY_K        , 7, 0x02);
map(KEY_J        , 7, 0x01);
                                                       
map(KEY_GRAPH     , 8, 0x40); 
map(KEY_BACK_QUOTE, 8, 0x20); 
map(KEY_SPACE     , 8, 0x10);
map(KEY_SLASH     , 8, 0x08); 
map(KEY_DOT       , 8, 0x04); 
map(KEY_COMMA     , 8, 0x02); 
map(KEY_M         , 8, 0x01); 

//map(KEY_INS          , 9, 0x40);
map(KEY_BACKSLASH    , 9, 0x20); 
map(KEY_CLOSE_BRACKET, 9, 0x10); 
map(KEY_OPEN_BRACKET , 9, 0x08); 
map(KEY_MU           , 9, 0x04); 
map(KEY_DEL          , 9, 0x02); 
map(KEY_INS          , 9, 0x01);  

map(KEY_CAP_LOCK   , 10, 0x40); 
map(KEY_DEL_LINE   , 10, 0x20); 
map(KEY_CLS_HOME   , 10, 0x10); 
map(KEY_UP         , 10, 0x08); 
map(KEY_LEFT       , 10, 0x04); 
map(KEY_RIGHT      , 10, 0x02); 
map(KEY_DOWN       , 10, 0x01); 

map(KEY_F4, 11, 0b000100); 
map(KEY_F3, 11, 0b001000); 
map(KEY_F2, 11, 0b010000); 
map(KEY_F1, 11, 0b100000); 

map(KEY_F10, 12, 0x10);   
map(KEY_F9 , 12, 0x08);   
map(KEY_F8 , 12, 0x04);   
map(KEY_F7 , 12, 0x01); 
map(KEY_F6 , 12, 0x02); 
map(KEY_F5 , 12, 0x01);

// do not map shift because shift is simulated in each key
// assignKey('Shift', KEY_SHIFT);
assignKey('z'    , KEY_Z);   //assignKey('Z'    , 0b1, 0x20, true);
assignKey('x'    , KEY_X); //assignKey('X'    , 0b1, 0x10, true);
assignKey('c'    , KEY_C); //assignKey('C'    , 0b1, 0x08, true);
assignKey('v'    , KEY_V); //assignKey('V'    , 0b1, 0x04, true);
assignKey('b'    , KEY_B); //assignKey('B'    , 0b1, 0x02, true);
assignKey('n'    , KEY_N); //assignKey('N'    , 0b1, 0x01, true);

assignKey('Control', KEY_CONTROL);
assignKey('a',       KEY_A);   //assignKey('A',       0b10, 0x20, true); 
assignKey('s',       KEY_S);   //assignKey('S',       0b10, 0x10, true); 
assignKey('d',       KEY_D);   //assignKey('D',       0b10, 0x08, true); 
assignKey('f',       KEY_F);   //assignKey('F',       0b10, 0x04, true); 
assignKey('g',       KEY_G);   //assignKey('G',       0b10, 0x02, true); 
assignKey('h',       KEY_H);   //assignKey('H',       0b10, 0x01, true); 

assignKey('Tab', KEY_TAB);
assignKey('q',   KEY_Q);      //assignKey('Q',   0b100, 0x20, true);
assignKey('w',   KEY_W);      //assignKey('W',   0b100, 0x10, true);
assignKey('e',   KEY_E);      //assignKey('E',   0b100, 0x08, true);
assignKey('r',   KEY_R);      //assignKey('R',   0b100, 0x04, true);
assignKey('t',   KEY_T);      //assignKey('T',   0b100, 0x02, true);
assignKey('y',   KEY_Y);      //assignKey('Y',   0b100, 0x01, true);

assignKey('Escape', KEY_ESC);
assignKey('1',      KEY_1); assignKey('!', KEY_1, true);
assignKey('2',      KEY_2); assignKey('@', KEY_2, true); 
assignKey('3',      KEY_3); assignKey('#', KEY_3, true); 
assignKey('4',      KEY_4); assignKey('$', KEY_4, true); 
assignKey('5',      KEY_5); assignKey('%', KEY_5, true); 
assignKey('6',      KEY_6); assignKey('^', KEY_6, true); 

assignKey('=', KEY_EQUAL); assignKey('+', KEY_EQUAL, true);
assignKey('-', KEY_MINUS); assignKey('_', KEY_MINUS, true);
assignKey('0', KEY_0);     assignKey(')', KEY_0    , true);
assignKey('9', KEY_9);     assignKey('(', KEY_9    , true);
assignKey('8', KEY_8);     assignKey('*', KEY_8    , true);
assignKey('7', KEY_7);     assignKey('&', KEY_7    , true);

assignKey('Backspace', KEY_BS); 
assignKey('p', KEY_P);    //assignKey('P', 0b100000, 0x08, true);
assignKey('o', KEY_O);    //assignKey('O', 0b100000, 0x04, true);
assignKey('i', KEY_I);    //assignKey('I', 0b100000, 0x02, true);
assignKey('u', KEY_U);    //assignKey('U', 0b100000, 0x01, true);

assignKey('Enter', KEY_RETURN);                        
assignKey("'"    , KEY_QUOTE);     assignKey('"', KEY_QUOTE, true);
assignKey(';'    , KEY_SEMICOLON); assignKey(':', KEY_SEMICOLON, true);  
assignKey('l'    , KEY_L); //assignKey('l', 0b1000000, 0x04, true);
assignKey('k'    , KEY_K); //assignKey('k', 0b1000000, 0x02, true);
assignKey('j'    , KEY_J); //assignKey('j', 0b1000000, 0x01, true);
                                                       
assignKey('§', KEY_GRAPH); 
assignKey('`', KEY_BACK_QUOTE); 
assignKey('~', KEY_BACK_QUOTE, true); 
assignKey('°', KEY_BACK_QUOTE); 
assignKey('ç', KEY_BACK_QUOTE, true); 
assignKey(' ', KEY_SPACE);
assignKey('/', KEY_SLASH); assignKey('?', KEY_SLASH, true);
assignKey('.', KEY_DOT);   assignKey('>', KEY_DOT  , true);
assignKey(',', KEY_COMMA); assignKey('<', KEY_COMMA, true);
assignKey('m', KEY_M); //assignKey('M', 0b10000000, 0x01, true);

assignKey('\\'     , KEY_BACKSLASH);     assignKey('|'      , KEY_BACKSLASH, true); 
assignKey('['      , KEY_OPEN_BRACKET);  assignKey('{'      , KEY_OPEN_BRACKET, true); 
assignKey(']'      , KEY_CLOSE_BRACKET); assignKey('}'      , KEY_CLOSE_BRACKET, true); 
assignKey('ù'      , KEY_MU);            assignKey('£'      , KEY_MU, true); 
assignKey('Insert' , KEY_INS); 
assignKey('Delete' , KEY_DEL); 

assignKey('CapsLock'   , KEY_CAP_LOCK); 
assignKey('End'        , KEY_DEL_LINE); 
assignKey('Home'       , KEY_CLS_HOME); assignKey('Cls'       , KEY_CLS_HOME, true);
assignKey('ArrowUp'    , KEY_UP); 
assignKey('ArrowLeft'  , KEY_LEFT); 
assignKey('ArrowRight' , KEY_RIGHT); 
assignKey('ArrowDown'  , KEY_DOWN); 

assignKey('F10', KEY_F10);   
assignKey('F9' , KEY_F9);   
assignKey('F8' , KEY_F8);   
assignKey('F7' , KEY_F7); 
assignKey('F6' , KEY_F6); 
assignKey('F5' , KEY_F5); 

assignKey('F4', KEY_F4); 
assignKey('F3', KEY_F3); 
assignKey('F2', KEY_F2); 
assignKey('F1', KEY_F1); 

