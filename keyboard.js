const nrows = 0x0F;
const ncols = 0x06;
const keyboard_matrix = new Uint8Array(nrows);

let browser_keys_state = { };

function keyPress(row, col) {      
   keyboard_matrix[row] |= col;
}

function keyRelease(row, col) {
   keyboard_matrix[row] &= (~col);
}

const element = document; //.getElementById("canvas");

element.onkeydown = function keyDown(e) {   
   if(e.key=="Tab") e.preventDefault();
   const k = translation[e.key];
   if(k !== undefined) {
      if(browser_keys_state[e.key] == 'down') return;
      console.log("keydown", e);   
      browser_keys_state[e.key] = 'down';
      keyPress(k.row, k.col);
      if(k.shift) keyPress(0, 0x40);
      console.log(keyboard_matrix);
      e.preventDefault();
   }
}

element.onkeyup = function keyUp(e) {   
   const k = translation[e.key];
   console.log("keyup", e);
   if(k !== undefined) {      
      browser_keys_state[e.key] = 'up';
      keyRelease(k.row, k.col);
      if(k.shift) keyRelease(0, 0x40);
      console.log(keyboard_matrix);
      e.preventDefault();
   }
}

const translation = { };

function mappa(key, row, col, shift) {
   translation[key] = { row, col, shift: shift?true:false };
}

mappa('ShifLeft', 0, 0x40);
mappa('z', 0, 0x20);
mappa('x', 0, 0x10);
mappa('c', 0, 0x08);
mappa('v', 0, 0x04);
mappa('b', 0, 0x02);
mappa('n', 0, 0x01);

mappa('Control', 1, 0x40);
mappa('a', 1, 0x20);
mappa('s', 1, 0x10);
mappa('d', 1, 0x08);
mappa('f', 1, 0x04);
mappa('g', 1, 0x02);
mappa('h', 1, 0x01);

mappa('Tab', 2, 0x40);
mappa('q', 2, 0x20);
mappa('w', 2, 0x10);
mappa('e', 2, 0x08);
mappa('r', 2, 0x04);
mappa('t', 2, 0x02);
mappa('y', 2, 0x01);

mappa('Escape', 3, 0x40);
mappa('1', 3, 0x20); mappa('!', 3, 0x20, true);
mappa('2', 3, 0x10); mappa('@', 3, 0x10, true); 
mappa('3', 3, 0x08); mappa('#', 3, 0x08, true); 
mappa('4', 3, 0x04); mappa('$', 3, 0x04, true); 
mappa('5', 3, 0x02); mappa('%', 3, 0x02, true); 
mappa('6', 3, 0x01); mappa('^', 3, 0x01, true); 

// mappa('', 4, 0x40); // apparently unused
mappa('=', 4, 0x20); mappa('+', 4, 0x20, true);
mappa('-', 4, 0x10); mappa('_', 4, 0x10, true);
mappa('0', 4, 0x08); mappa(')', 4, 0x08, true);
mappa('9', 4, 0x04); mappa('(', 4, 0x04, true);
mappa('8', 4, 0x02); mappa('*', 4, 0x02, true);
mappa('7', 4, 0x01); mappa('&', 4, 0x01, true);

mappa('Backspace', 5, 0x40); 
// mappa('', 5, 0x20); apparently unused
// mappa('', 5, 0x10); apparently unused
mappa('p', 5, 0x08);
mappa('o', 5, 0x04);
mappa('i', 5, 0x02);
mappa('u', 5, 0x01);

mappa('Enter', 6, 0x40); 
// mappa('', 6, 0x20); apparently unused
mappa("'", 6, 0x10); mappa('"', 6, 0x10, true);
mappa(';', 6, 0x08); mappa(':', 6, 0x08, true);  
mappa('l', 6, 0x04);
mappa('k', 6, 0x02);
mappa('j', 6, 0x01);

mappa('§', 7, 0x40); // Graph key
mappa('`', 7, 0x20); mappa('~', 7, 0x20, true); /* alternates: */ mappa('°', 7, 0x20); mappa('ç', 7, 0x20, true); 
mappa(' ', 7, 0x10);
mappa('/', 7, 0x08); mappa('?', 7, 0x08, true);
mappa('.', 7, 0x04); mappa('>', 7, 0x04, true);
mappa(',', 7, 0x02); mappa('<', 7, 0x02, true);
mappa('m', 7, 0x01);

// mappa('', 8, 0x40); apparently unused
mappa('End', 8, 0x20); // del line
mappa('Home', 8, 0x10); 
mappa('ArrowUp', 8, 0x08); 
mappa('ArrowLeft', 8, 0x04); 
mappa('ArrowRight', 8, 0x02); 
mappa('ArrowDown' , 8, 0x01); 

// row 9,10 not connected

/*
mappa('1', 15, 0x40); 
mappa('2', 15, 0x20); 
mappa('3', 15, 0x10); 
mappa('4', 15, 0x08); 
mappa('5', 15, 0x04); 
mappa('6', 15, 0x02); 
mappa('7', 15, 0x01); 
*/

/*
mappa('[', 5, 0x20); mappa('{', 5, 0x20, true);
mappa(']', 5, 0x10); mappa('}', 5, 0x10, true);
*/
/* 

PORT_START("ROWB") /* KEY ROW B 
PORT_BIT(0x80, IP_ACTIVE_LOW, IPT_UNUSED)
PORT_BIT(0x40, IP_ACTIVE_LOW, IPT_UNUSED)
PORT_BIT(0x20, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_F10)          PORT_CHAR(UCHAR_MAMEKEY(F10))
PORT_BIT(0x10, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_F9)           PORT_CHAR(UCHAR_MAMEKEY(F9))
PORT_BIT(0x08, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_F8)           PORT_CHAR(UCHAR_MAMEKEY(F8))
PORT_BIT(0x04, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_F7)           PORT_CHAR(UCHAR_MAMEKEY(F7))
PORT_BIT(0x02, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_F6)           PORT_CHAR(UCHAR_MAMEKEY(F6))
PORT_BIT(0x01, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_F5)           PORT_CHAR(UCHAR_MAMEKEY(F5))

PORT_START("ROWC") /* KEY ROW C 
PORT_BIT(0x80, IP_ACTIVE_LOW, IPT_UNUSED)
PORT_BIT(0x40, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_NAME("Cap Lock") PORT_CODE(KEYCODE_CAPSLOCK)   PORT_CHAR(UCHAR_MAMEKEY(CAPSLOCK))
PORT_BIT(0x20, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_NAME("Del Line") PORT_CODE(KEYCODE_PGUP)       PORT_CHAR(UCHAR_MAMEKEY(F12))
PORT_BIT(0x10, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_HOME)         PORT_CHAR(UCHAR_MAMEKEY(HOME))
PORT_BIT(0x08, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_UP)           PORT_CHAR(UCHAR_MAMEKEY(UP))
PORT_BIT(0x04, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_LEFT)         PORT_CHAR(UCHAR_MAMEKEY(LEFT))
PORT_BIT(0x02, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_RIGHT)        PORT_CHAR(UCHAR_MAMEKEY(RIGHT))
PORT_BIT(0x01, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_DOWN)         PORT_CHAR(UCHAR_MAMEKEY(DOWN))

PORT_START("ROWD") /* KEY ROW D 
PORT_BIT(0x80, IP_ACTIVE_LOW, IPT_UNUSED)
PORT_BIT(0x40, IP_ACTIVE_LOW, IPT_UNUSED)
PORT_BIT(0x20, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_BACKSLASH2)   PORT_CHAR('\\') PORT_CHAR('|')
PORT_BIT(0x10, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_CLOSEBRACE)   PORT_CHAR(']') PORT_CHAR('}')
PORT_BIT(0x08, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_CODE(KEYCODE_OPENBRACE)    PORT_CHAR('[') PORT_CHAR('{')
PORT_BIT(0x04, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_NAME("Mu  \xC2\xA3") PORT_CODE(KEYCODE_TILDE) PORT_CHAR(0xA3)
PORT_BIT(0x02, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_NAME("Del") PORT_CODE(KEYCODE_DEL)             PORT_CHAR(UCHAR_MAMEKEY(DEL))
PORT_BIT(0x01, IP_ACTIVE_LOW, IPT_KEYBOARD) PORT_NAME("Ins") PORT_CODE(KEYCODE_INSERT)          PORT_CHAR(UCHAR_MAMEKEY(INSERT))

*/
// 2fff = niente
// 2ffe = row0
// 2ffd = row1
// 2ffb = row2
