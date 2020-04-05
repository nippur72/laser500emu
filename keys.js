// all 76 keys on the real LASER 500

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

// keyboard matri (12 rows x 7 columns)
KAX = new Uint8Array(12).fill(0b1111111);

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
function keyboard_poll(address) 
{
   // decodes A[10:8] into ABCD (LS138 demux)
   let KA8_10 = (address >> 8) & 0b111;

   let ABCD = 0b1111;

        if(KA8_10 === 0b000) ABCD = 0b1110;
   else if(KA8_10 === 0b001) ABCD = 0b1101;
   else if(KA8_10 === 0b010) ABCD = 0b1011;
   else if(KA8_10 === 0b011) ABCD = 0b0111;   

   KA = (ABCD<<8) | (address & 0xFF); 
   
   let KD = 0b1111111;
   for(let row=0; row<=KA_D; row++) {
      if((KA & (1<<row)) === 0) {
        KD = KD & KAX[row];
      }
   }   
         
   return KD;
}
