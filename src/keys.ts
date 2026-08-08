// all 76 keys on the real LASER 500

import { audio, laser500 } from "./emulator";
import { rewind_tape, stop_tape } from "./browser";

const KEY_RESET = 0; // not mapped on the I/O but directly on the /RES line to the CPU
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

// circuit lines that map on the address bus
const KA_0 =  0;
const KA_1 =  1;
const KA_2 =  2;
const KA_3 =  3;
const KA_4 =  4;
const KA_5 =  5;
const KA_6 =  6;
const KA_7 =  7;
const KA_A = 8;  
const KA_B = 9;  
const KA_C = 10; 
const KA_D = 11; 

// circuit lines that map on the data bus
const KD0 = 0; 
const KD1 = 1; 
const KD2 = 2; 
const KD3 = 3; 
const KD4 = 4; 
const KD5 = 5; 
const KD6 = 6; 

const key_row_col = new Array(75); // hardware keys row and col info

function mapKey(key, row, col) {
   key_row_col[key] = { row, col };
}

mapKey(KEY_SHIFT        , KA_0, KD6);
mapKey(KEY_Z            , KA_0, KD5); 
mapKey(KEY_X            , KA_0, KD4); 
mapKey(KEY_C            , KA_0, KD3); 
mapKey(KEY_V            , KA_0, KD2); 
mapKey(KEY_B            , KA_0, KD1); 
mapKey(KEY_N            , KA_0, KD0); 
mapKey(KEY_CONTROL      , KA_1, KD6);
mapKey(KEY_A            , KA_1, KD5);   
mapKey(KEY_S            , KA_1, KD4);   
mapKey(KEY_D            , KA_1, KD3);   
mapKey(KEY_F            , KA_1, KD2);   
mapKey(KEY_G            , KA_1, KD1);   
mapKey(KEY_H            , KA_1, KD0);   
mapKey(KEY_TAB          , KA_2, KD6);
mapKey(KEY_Q            , KA_2, KD5);      
mapKey(KEY_W            , KA_2, KD4);      
mapKey(KEY_E            , KA_2, KD3);      
mapKey(KEY_R            , KA_2, KD2);      
mapKey(KEY_T            , KA_2, KD1);      
mapKey(KEY_Y            , KA_2, KD0);      
mapKey(KEY_ESC          , KA_3, KD6);
mapKey(KEY_1            , KA_3, KD5); 
mapKey(KEY_2            , KA_3, KD4); 
mapKey(KEY_3            , KA_3, KD3); 
mapKey(KEY_4            , KA_3, KD2); 
mapKey(KEY_5            , KA_3, KD1); 
mapKey(KEY_6            , KA_3, KD0); 
mapKey(KEY_EQUAL        , KA_4, KD5); 
mapKey(KEY_MINUS        , KA_4, KD4); 
mapKey(KEY_0            , KA_4, KD3); 
mapKey(KEY_9            , KA_4, KD2); 
mapKey(KEY_8            , KA_4, KD1); 
mapKey(KEY_7            , KA_4, KD0); 
mapKey(KEY_BS           , KA_5, KD6); 
mapKey(KEY_P            , KA_5, KD3); 
mapKey(KEY_O            , KA_5, KD2); 
mapKey(KEY_I            , KA_5, KD1); 
mapKey(KEY_U            , KA_5, KD0); 
mapKey(KEY_RETURN       , KA_6, KD6);                        
mapKey(KEY_QUOTE        , KA_6, KD4);
mapKey(KEY_SEMICOLON    , KA_6, KD3);
mapKey(KEY_L            , KA_6, KD2);
mapKey(KEY_K            , KA_6, KD1);
mapKey(KEY_J            , KA_6, KD0);                                                       
mapKey(KEY_GRAPH        , KA_7, KD6); 
mapKey(KEY_BACK_QUOTE   , KA_7, KD5); 
mapKey(KEY_SPACE        , KA_7, KD4);
mapKey(KEY_SLASH        , KA_7, KD3); 
mapKey(KEY_DOT          , KA_7, KD2); 
mapKey(KEY_COMMA        , KA_7, KD1); 
mapKey(KEY_M            , KA_7, KD0); 
mapKey(KEY_BACKSLASH    , KA_D, KD5); 
mapKey(KEY_CLOSE_BRACKET, KA_D, KD4); 
mapKey(KEY_OPEN_BRACKET , KA_D, KD3); 
mapKey(KEY_MU           , KA_D, KD2); 
mapKey(KEY_DEL          , KA_D, KD1); 
mapKey(KEY_INS          , KA_D, KD0);  
mapKey(KEY_CAP_LOCK     , KA_C, KD6); 
mapKey(KEY_DEL_LINE     , KA_C, KD5); 
mapKey(KEY_CLS_HOME     , KA_C, KD4); 
mapKey(KEY_UP           , KA_C, KD3); 
mapKey(KEY_LEFT         , KA_C, KD2); 
mapKey(KEY_RIGHT        , KA_C, KD1); 
mapKey(KEY_DOWN         , KA_C, KD0); 
mapKey(KEY_F1           , KA_A, KD5); 
mapKey(KEY_F2           , KA_A, KD4); 
mapKey(KEY_F3           , KA_A, KD3); 
mapKey(KEY_F4           , KA_A, KD2);    
mapKey(KEY_F10          , KA_B, KD5);   
mapKey(KEY_F9           , KA_B, KD4);   
mapKey(KEY_F8           , KA_B, KD3);   
mapKey(KEY_F7           , KA_B, KD2); 
mapKey(KEY_F6           , KA_B, KD1); 
mapKey(KEY_F5           , KA_B, KD0);

// keyboard matrix (12 rows x 7 columns)
let KAX = new Uint8Array(12).fill(0b1111111);

function keyboardReset() {
   KAX = new Uint8Array(12).fill(0b1111111);
}

function keyPress(laserkey) {
   const { row, col } = key_row_col[laserkey];   
   KAX[row] = reset_bit(KAX[row], col);
}

function keyRelease(laserkey) {
   const { row, col } = key_row_col[laserkey];   
   KAX[row] = set_bit(KAX[row], col);
}

// the CPU feeds an address on A0-A10 and the keyboard
// matrix puts the KD0-6 on the data bus
export function keyboard_poll(address) 
{
   // decodes A[10:8] into ABCD (LS138 demux)
   let KA8_10 = (address >> 8) & 0b111;

   let ABCD = 0b1111;

        if(KA8_10 === 0b000) ABCD = 0b1110;
   else if(KA8_10 === 0b001) ABCD = 0b1101;
   else if(KA8_10 === 0b010) ABCD = 0b1011;
   else if(KA8_10 === 0b011) ABCD = 0b0111;   

   const KA = (ABCD<<8) | (address & 0xFF); 
   
   let KD = 0b1111111;
   for(let row=0; row<=KA_D; row++) {
      if((KA & (1<<row)) === 0) {
        KD = KD & KAX[row];
      }
   }   
         
   return KD;
}

function pckey_to_laserkey_ITA(code, key, e) {
   // console.log(code, key, e);

   let laser_keys: number[] = [];

   if(e.ctrlKey) laser_keys.push( KEY_CONTROL );

   if(key === "1")             laser_keys.push( KEY_1  );
   if(key === "2")             laser_keys.push( KEY_2  );
   if(key === "3")             laser_keys.push( KEY_3  );
   if(key === "4")             laser_keys.push( KEY_4  );
   if(key === "5")             laser_keys.push( KEY_5  );
   if(key === "6")             laser_keys.push( KEY_6  );
   if(key === "7")             laser_keys.push( KEY_7  );
   if(key === "8")             laser_keys.push( KEY_8  );
   if(key === "9")             laser_keys.push( KEY_9  );
   if(key === "0")             laser_keys.push( KEY_0  );

   if(e.shiftKey) {
      if(code === "KeyQ")         laser_keys.push( KEY_SHIFT, KEY_Q  );
      if(code === "KeyW")         laser_keys.push( KEY_SHIFT, KEY_W  );
      if(code === "KeyE")         laser_keys.push( KEY_SHIFT, KEY_E  );
      if(code === "KeyR")         laser_keys.push( KEY_SHIFT, KEY_R  );
      if(code === "KeyT")         laser_keys.push( KEY_SHIFT, KEY_T  );
      if(code === "KeyY")         laser_keys.push( KEY_SHIFT, KEY_Y  );
      if(code === "KeyU")         laser_keys.push( KEY_SHIFT, KEY_U  );
      if(code === "KeyI")         laser_keys.push( KEY_SHIFT, KEY_I  );
      if(code === "KeyO")         laser_keys.push( KEY_SHIFT, KEY_O  );
      if(code === "KeyP")         laser_keys.push( KEY_SHIFT, KEY_P  );
      if(code === "KeyA")         laser_keys.push( KEY_SHIFT, KEY_A  );
      if(code === "KeyS")         laser_keys.push( KEY_SHIFT, KEY_S  );
      if(code === "KeyD")         laser_keys.push( KEY_SHIFT, KEY_D  );
      if(code === "KeyF")         laser_keys.push( KEY_SHIFT, KEY_F  );
      if(code === "KeyG")         laser_keys.push( KEY_SHIFT, KEY_G  );
      if(code === "KeyH")         laser_keys.push( KEY_SHIFT, KEY_H  );
      if(code === "KeyJ")         laser_keys.push( KEY_SHIFT, KEY_J  );
      if(code === "KeyK")         laser_keys.push( KEY_SHIFT, KEY_K  );
      if(code === "KeyL")         laser_keys.push( KEY_SHIFT, KEY_L  );
      if(code === "KeyZ")         laser_keys.push( KEY_SHIFT, KEY_Z  );
      if(code === "KeyX")         laser_keys.push( KEY_SHIFT, KEY_X  );
      if(code === "KeyC")         laser_keys.push( KEY_SHIFT, KEY_C  );
      if(code === "KeyV")         laser_keys.push( KEY_SHIFT, KEY_V  );
      if(code === "KeyB")         laser_keys.push( KEY_SHIFT, KEY_B  );
      if(code === "KeyN")         laser_keys.push( KEY_SHIFT, KEY_N  );
      if(code === "KeyM")         laser_keys.push( KEY_SHIFT, KEY_M  );
   }
   else {
      if(code === "KeyQ")         laser_keys.push( KEY_Q  );
      if(code === "KeyW")         laser_keys.push( KEY_W  );
      if(code === "KeyE")         laser_keys.push( KEY_E  );
      if(code === "KeyR")         laser_keys.push( KEY_R  );
      if(code === "KeyT")         laser_keys.push( KEY_T  );
      if(code === "KeyY")         laser_keys.push( KEY_Y  );
      if(code === "KeyU")         laser_keys.push( KEY_U  );
      if(code === "KeyI")         laser_keys.push( KEY_I  );
      if(code === "KeyO")         laser_keys.push( KEY_O  );
      if(code === "KeyP")         laser_keys.push( KEY_P  );
      if(code === "KeyA")         laser_keys.push( KEY_A  );
      if(code === "KeyS")         laser_keys.push( KEY_S  );
      if(code === "KeyD")         laser_keys.push( KEY_D  );
      if(code === "KeyF")         laser_keys.push( KEY_F  );
      if(code === "KeyG")         laser_keys.push( KEY_G  );
      if(code === "KeyH")         laser_keys.push( KEY_H  );
      if(code === "KeyJ")         laser_keys.push( KEY_J  );
      if(code === "KeyK")         laser_keys.push( KEY_K  );
      if(code === "KeyL")         laser_keys.push( KEY_L  );
      if(code === "KeyZ")         laser_keys.push( KEY_Z  );
      if(code === "KeyX")         laser_keys.push( KEY_X  );
      if(code === "KeyC")         laser_keys.push( KEY_C  );
      if(code === "KeyV")         laser_keys.push( KEY_V  );
      if(code === "KeyB")         laser_keys.push( KEY_B  );
      if(code === "KeyN")         laser_keys.push( KEY_N  );
      if(code === "KeyM")         laser_keys.push( KEY_M  );
   }

   if(key === "\\")            laser_keys.push( KEY_BACKSLASH  );
   if(key === "|")             laser_keys.push( KEY_SHIFT, KEY_BACKSLASH  );
   if(key === "!")             laser_keys.push( KEY_SHIFT, KEY_1  );
   if(key === '"')             laser_keys.push( KEY_SHIFT, KEY_QUOTE  );
   if(key === "£")             laser_keys.push( KEY_SHIFT, KEY_MU  );
   if(key === "$")             laser_keys.push( KEY_SHIFT, KEY_4  );
   if(key === "%")             laser_keys.push( KEY_SHIFT, KEY_5  );
   if(key === "&")             laser_keys.push( KEY_SHIFT, KEY_7  );
   if(key === "/")             laser_keys.push( KEY_SLASH  );
   if(key === "(")             laser_keys.push( KEY_SHIFT, KEY_9  );
   if(key === ")")             laser_keys.push( KEY_SHIFT, KEY_0  );
   if(key === "=")             laser_keys.push( KEY_EQUAL  );
   if(key === "'")             laser_keys.push( KEY_QUOTE  );
   if(key === "?")             laser_keys.push( KEY_SHIFT, KEY_SLASH  );
   if(key === "^")             laser_keys.push( KEY_SHIFT, KEY_6  );
   if(key === "[")             laser_keys.push( KEY_OPEN_BRACKET  );
   if(key === "]")             laser_keys.push( KEY_CLOSE_BRACKET  );
   if(key === "{")             laser_keys.push( KEY_SHIFT, KEY_OPEN_BRACKET  );
   if(key === "}")             laser_keys.push( KEY_SHIFT, KEY_CLOSE_BRACKET  );
   if(key === "+")             laser_keys.push( KEY_SHIFT, KEY_EQUAL  );
   if(key === "*")             laser_keys.push( KEY_SHIFT, KEY_8  );
   if(key === "@")             laser_keys.push( KEY_SHIFT, KEY_2  );
   if(key === "#")             laser_keys.push( KEY_SHIFT, KEY_3  );
   if(key === "<")             laser_keys.push( KEY_SHIFT, KEY_COMMA  );
   if(key === ">")             laser_keys.push( KEY_SHIFT, KEY_DOT  );
   if(key === ",")             laser_keys.push( KEY_COMMA  );
   if(key === ";")             laser_keys.push( KEY_SEMICOLON  );
   if(key === ".")             laser_keys.push( KEY_DOT  );
   if(key === ":")             laser_keys.push( KEY_SHIFT, KEY_SEMICOLON  );
   if(key === "-")             laser_keys.push( KEY_MINUS  );
   if(key === "_")             laser_keys.push( KEY_SHIFT, KEY_MINUS  );
   if(code === "F1")           laser_keys.push( KEY_F1  );
   if(code === "F2")           laser_keys.push( KEY_F2  );
   if(code === "F3")           laser_keys.push( KEY_F3  );
   if(code === "F4")           laser_keys.push( KEY_F4  );
   if(code === "F5")           laser_keys.push( KEY_F5  );
   if(code === "F6")           laser_keys.push( KEY_F6  );
   if(code === "F7")           laser_keys.push( KEY_F7  );
   if(code === "F8")           laser_keys.push( KEY_F8  );
   if(code === "F9")           laser_keys.push( KEY_F9  );
   if(code === "F10")          laser_keys.push( KEY_F10  );
   if(code === "Insert")       laser_keys.push( KEY_INS  );
   if(code === "Delete")       laser_keys.push( KEY_DEL  );
   if(code === "Escape")       laser_keys.push( KEY_ESC  );
   if(code === "Backspace")    laser_keys.push( KEY_BS  );
   if(code === "End")          laser_keys.push( KEY_DEL_LINE  );
   if(code === "Home")         laser_keys.push( KEY_CLS_HOME  );
   if(code === "Tab")          laser_keys.push( KEY_TAB  );
   if(code === "Enter")        laser_keys.push( KEY_RETURN  );
   if(code === "NumpadEnter")  laser_keys.push( KEY_RETURN  );
   if(code === "ControlLeft")  laser_keys.push( KEY_CONTROL  );
   if(code === "ControlRight") laser_keys.push( KEY_CONTROL  );
   if(code === "ArrowUp")      laser_keys.push( KEY_UP  );
   if(code === "PageUp")       laser_keys.push( KEY_MU  );
   if(code === "PageDown")     laser_keys.push( KEY_GRAPH  );
   if(code === "ArrowLeft")    laser_keys.push( KEY_LEFT  );
   if(code === "ArrowRight")   laser_keys.push( KEY_RIGHT  );
   if(code === "Space")        laser_keys.push( KEY_SPACE  );
   if(code === "ArrowDown")    laser_keys.push( KEY_DOWN  );
   if(code === "CapsLock")     laser_keys.push( KEY_CAP_LOCK );

   return laser_keys;
}


import { numpad_to_joystick } from "./joystick";
import { reset_bit, set_bit } from "./bytes";

let keyboard_ITA = false;

// this is the original keyboard mapping
function pckey_to_laserkey_EN(code, key) {
   let laser_keys: number[] = [];
   
   if(code === "F1")           laser_keys.push( KEY_F1 );
   if(code === "F2")           laser_keys.push( KEY_F2 );
   if(code === "F3")           laser_keys.push( KEY_F3 );
   if(code === "F4")           laser_keys.push( KEY_F4 );
   if(code === "F5")           laser_keys.push( KEY_F5 );
   if(code === "F6")           laser_keys.push( KEY_F6 );
   if(code === "F7")           laser_keys.push( KEY_F7 );
   if(code === "F8")           laser_keys.push( KEY_F8 );
   if(code === "F9")           laser_keys.push( KEY_F9 );
   if(code === "F10")          laser_keys.push( KEY_F10 );
   if(code === "Insert")       laser_keys.push( KEY_INS );
   if(code === "Delete")       laser_keys.push( KEY_DEL );
   if(code === "Escape")       laser_keys.push( KEY_ESC );
   if(code === "Digit1")       laser_keys.push( KEY_1 );
   if(code === "Digit2")       laser_keys.push( KEY_2 );
   if(code === "Digit3")       laser_keys.push( KEY_3 );
   if(code === "Digit4")       laser_keys.push( KEY_4 );
   if(code === "Digit5")       laser_keys.push( KEY_5 );
   if(code === "Digit6")       laser_keys.push( KEY_6 );
   if(code === "Digit7")       laser_keys.push( KEY_7 );
   if(code === "Digit8")       laser_keys.push( KEY_8 );
   if(code === "Digit9")       laser_keys.push( KEY_9 );
   if(code === "Digit0")       laser_keys.push( KEY_0 );
   if(code === "Minus")        laser_keys.push( KEY_MINUS );
   if(code === "Equal")        laser_keys.push( KEY_EQUAL );
   if(code === "Backspace")    laser_keys.push( KEY_BS );
   if(code === "End")          laser_keys.push( KEY_DEL_LINE );
   if(code === "Home")         laser_keys.push( KEY_CLS_HOME );
   if(code === "Tab")          laser_keys.push( KEY_TAB );
   if(code === "KeyQ")         laser_keys.push( KEY_Q );
   if(code === "KeyW")         laser_keys.push( KEY_W );
   if(code === "KeyE")         laser_keys.push( KEY_E );
   if(code === "KeyR")         laser_keys.push( KEY_R );
   if(code === "KeyT")         laser_keys.push( KEY_T );
   if(code === "KeyY")         laser_keys.push( KEY_Y );
   if(code === "KeyU")         laser_keys.push( KEY_U );
   if(code === "KeyI")         laser_keys.push( KEY_I );
   if(code === "KeyO")         laser_keys.push( KEY_O );
   if(code === "KeyP")         laser_keys.push( KEY_P );
   if(code === "BracketLeft")  laser_keys.push( KEY_OPEN_BRACKET );
   if(code === "BracketRight") laser_keys.push( KEY_CLOSE_BRACKET );
   if(code === "Enter")        laser_keys.push( KEY_RETURN );
   if(code === "NumpadEnter")  laser_keys.push( KEY_RETURN );
   if(code === "ControlLeft")  laser_keys.push( KEY_CONTROL );
   if(code === "ControlRight") laser_keys.push( KEY_CONTROL );
   if(code === "KeyA")         laser_keys.push( KEY_A );
   if(code === "KeyS")         laser_keys.push( KEY_S );
   if(code === "KeyD")         laser_keys.push( KEY_D );
   if(code === "KeyF")         laser_keys.push( KEY_F );
   if(code === "KeyG")         laser_keys.push( KEY_G );
   if(code === "KeyH")         laser_keys.push( KEY_H );
   if(code === "KeyJ")         laser_keys.push( KEY_J );
   if(code === "KeyK")         laser_keys.push( KEY_K );
   if(code === "KeyL")         laser_keys.push( KEY_L );
   if(code === "Semicolon")    laser_keys.push( KEY_SEMICOLON );
   if(code === "Quote")        laser_keys.push( KEY_QUOTE );
   if(code === "Backquote")    laser_keys.push( KEY_BACK_QUOTE );
   if(code === "Backslash")    laser_keys.push( KEY_BACKSLASH );
   if(code === "ArrowUp")      laser_keys.push( KEY_UP );
   if(code === "ShiftLeft")    laser_keys.push( KEY_SHIFT );
   if(code === "ShiftRight")   laser_keys.push( KEY_SHIFT );
   if(code === "KeyZ")         laser_keys.push( KEY_Z );
   if(code === "KeyX")         laser_keys.push( KEY_X );
   if(code === "KeyC")         laser_keys.push( KEY_C );
   if(code === "KeyV")         laser_keys.push( KEY_V );
   if(code === "KeyB")         laser_keys.push( KEY_B );
   if(code === "KeyN")         laser_keys.push( KEY_N );
   if(code === "KeyM")         laser_keys.push( KEY_M );
   if(code === "Comma")        laser_keys.push( KEY_COMMA );
   if(code === "Period")       laser_keys.push( KEY_DOT );
   if(code === "Slash")        laser_keys.push( KEY_SLASH );
   if(code === "PageUp")       laser_keys.push( KEY_MU );
   if(code === "PageDown")     laser_keys.push( KEY_GRAPH );
   if(code === "ArrowLeft")    laser_keys.push( KEY_LEFT );
   if(code === "ArrowRight")   laser_keys.push( KEY_RIGHT );
   if(code === "CapsLock")     laser_keys.push( KEY_CAP_LOCK );
   if(code === "Space")        laser_keys.push( KEY_SPACE );
   if(code === "ArrowDown")    laser_keys.push( KEY_DOWN );

   return laser_keys;
}

export function keyDown(e) {    

   // from Chrome 71 audio is suspended by default and must resume within an user-generated event
   audio.resume();

   // disable auto repeat, as it is handled on the Laser
   if(e.repeat) {
      e.preventDefault(); 
      return;
   }   

   // *** special (non characters) keys ***   

   // CTRL+ALT+M is menu, handle elsewhere
   if(e.code=="KeyM" && e.altKey && e.ctrlKey) {
      e.preventDefault();      
      keyRelease(KEY_CONTROL); // avoid CTRL rest in hold state
      return;
   }

   // CTRL+ALT+BREAK or CTRL+ALT+P is power OFF/ON
   if((e.key=="Cancel" && e.altKey && e.ctrlKey) || (e.code=="KeyP" && e.altKey && e.ctrlKey)) {
      laser500.power();
      e.preventDefault();
      return;
   }

   // RESET key is mapped as ALT+R, CTRL+Break or Pause
   if(e.key=="Cancel" || e.key=="Pause" || (e.code == "KeyR" && e.altKey)) {
      laser500.cpu.reset();      
      e.preventDefault(); 
      return;
   }

   // ALT+Left is rewind tape
   if(e.code == "ArrowLeft" && e.altKey) {
      rewind_tape();
      e.preventDefault(); 
      return;
   }   

   // ALT+Up or ALT+Down is stop tape
   if((e.code == "ArrowUp" && e.altKey) || (e.code == "ArrowDown" && e.altKey)) {
      stop_tape();
      e.preventDefault(); 
      return;
   }   

   // numpad + 0 emulates joystick   
   if(numpad_to_joystick(e.code, true)) {
      e.preventDefault();
      return;
   }

   if(!keyboard_ITA) {
      const laser_keys = pckey_to_laserkey_EN(e.code, e.key);
      if(laser_keys.length  === 0) return;
      laser_keys.forEach((k) => keyPress(k));
      e.preventDefault();
   }
   else {
      const laser_keys = pckey_to_laserkey_ITA(e.code, e.key, e);
      if(laser_keys.length === 0) return;
      keyboardReset();
      laser_keys.forEach((k) => keyPress(k));
      e.preventDefault();
   }
}

export function keyUp(e) { 

   // numpad + 0 emulates joystick   
   if(numpad_to_joystick(e.code, false)) {
      e.preventDefault();
      return;
   }

   // do the keypress on the laser keyboard matrix
   if(!keyboard_ITA) {
      const laser_keys = pckey_to_laserkey_EN(e.code, e.key);
      if(laser_keys.length === 0) return;
      laser_keys.forEach((k) => keyRelease(k));
      e.preventDefault();
   } else {
      const laser_keys = pckey_to_laserkey_ITA(e.code, e.key, e);
      if(laser_keys.length === 0) return;
      keyboardReset();
      //laser_keys.forEach((k) => keyRelease(k));
      e.preventDefault();
   }
}


