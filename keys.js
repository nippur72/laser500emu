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
const KA0 =  0;
const KA1 =  1;
const KA2 =  2;
const KA3 =  3;
const KA4 =  4;
const KA5 =  5;
const KA6 =  6;
const KA7 =  7;
const KA_xA = 8;  
const KA_xB = 9;  
const KA_xC = 10; 
const KA_xD = 11; 

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

mapKey(KEY_SHIFT        , KA0, KD6);
mapKey(KEY_Z            , KA0, KD5); 
mapKey(KEY_X            , KA0, KD4); 
mapKey(KEY_C            , KA0, KD3); 
mapKey(KEY_V            , KA0, KD2); 
mapKey(KEY_B            , KA0, KD1); 
mapKey(KEY_N            , KA0, KD0); 
mapKey(KEY_CONTROL      , KA1, KD6);
mapKey(KEY_A            , KA1, KD5);   
mapKey(KEY_S            , KA1, KD4);   
mapKey(KEY_D            , KA1, KD3);   
mapKey(KEY_F            , KA1, KD2);   
mapKey(KEY_G            , KA1, KD1);   
mapKey(KEY_H            , KA1, KD0);   
mapKey(KEY_TAB          , KA2, KD6);
mapKey(KEY_Q            , KA2, KD5);      
mapKey(KEY_W            , KA2, KD4);      
mapKey(KEY_E            , KA2, KD3);      
mapKey(KEY_R            , KA2, KD2);      
mapKey(KEY_T            , KA2, KD1);      
mapKey(KEY_Y            , KA2, KD0);      
mapKey(KEY_ESC          , KA3, KD6);
mapKey(KEY_1            , KA3, KD5); 
mapKey(KEY_2            , KA3, KD4); 
mapKey(KEY_3            , KA3, KD3); 
mapKey(KEY_4            , KA3, KD2); 
mapKey(KEY_5            , KA3, KD1); 
mapKey(KEY_6            , KA3, KD0); 
mapKey(KEY_EQUAL        , KA4, KD5); 
mapKey(KEY_MINUS        , KA4, KD4); 
mapKey(KEY_0            , KA4, KD3); 
mapKey(KEY_9            , KA4, KD2); 
mapKey(KEY_8            , KA4, KD1); 
mapKey(KEY_7            , KA4, KD0); 
mapKey(KEY_BS           , KA5, KD6); 
mapKey(KEY_P            , KA5, KD3); 
mapKey(KEY_O            , KA5, KD2); 
mapKey(KEY_I            , KA5, KD1); 
mapKey(KEY_U            , KA5, KD0); 
mapKey(KEY_RETURN       , KA6, KD6);                        
mapKey(KEY_QUOTE        , KA6, KD4);
mapKey(KEY_SEMICOLON    , KA6, KD3);
mapKey(KEY_L            , KA6, KD2);
mapKey(KEY_K            , KA6, KD1);
mapKey(KEY_J            , KA6, KD0);                                                       
mapKey(KEY_GRAPH        , KA7, KD6); 
mapKey(KEY_BACK_QUOTE   , KA7, KD5); 
mapKey(KEY_SPACE        , KA7, KD4);
mapKey(KEY_SLASH        , KA7, KD3); 
mapKey(KEY_DOT          , KA7, KD2); 
mapKey(KEY_COMMA        , KA7, KD1); 
mapKey(KEY_M            , KA7, KD0); 
mapKey(KEY_BACKSLASH    , KA_xD, KD5); 
mapKey(KEY_CLOSE_BRACKET, KA_xD, KD4); 
mapKey(KEY_OPEN_BRACKET , KA_xD, KD3); 
mapKey(KEY_MU           , KA_xD, KD2); 
mapKey(KEY_DEL          , KA_xD, KD1); 
mapKey(KEY_INS          , KA_xD, KD0);  
mapKey(KEY_CAP_LOCK     , KA_xC, KD6); 
mapKey(KEY_DEL_LINE     , KA_xC, KD5); 
mapKey(KEY_CLS_HOME     , KA_xC, KD4); 
mapKey(KEY_UP           , KA_xC, KD3); 
mapKey(KEY_LEFT         , KA_xC, KD2); 
mapKey(KEY_RIGHT        , KA_xC, KD1); 
mapKey(KEY_DOWN         , KA_xC, KD0); 
mapKey(KEY_F1           , KA_xA, KD5); 
mapKey(KEY_F2           , KA_xA, KD4); 
mapKey(KEY_F3           , KA_xA, KD3); 
mapKey(KEY_F4           , KA_xA, KD2);    
mapKey(KEY_F10          , KA_xB, KD5);   
mapKey(KEY_F9           , KA_xB, KD4);   
mapKey(KEY_F8           , KA_xB, KD3);   
mapKey(KEY_F7           , KA_xB, KD2); 
mapKey(KEY_F6           , KA_xB, KD1); 
mapKey(KEY_F5           , KA_xB, KD0);

// keyboard matrix
const KM = [];
for(let t=0;t<=KA_xD;t++) KM[t] = [ 1,1,1,1,1,1,1 ];

function keyPress(laserkey) {   
   const { row, col } = key_row_col[laserkey];
   KM[row][col] = 0;    
   update_lines();
}

function keyRelease(laserkey) {
   const { row, col } = key_row_col[laserkey];
   KM[row][col] = 1;
   update_lines();
}

let KA = 0b111111111111;
let KD = 0b1111111;

function update_lines() {
   // sum all 7 KD lines
   KD = 0b1111111;
   for(let row=0; row<=KA_xD; row++) {
      KD = KD & ( 
         (KM[row][KD0]<<0) + 
         (KM[row][KD1]<<1) + 
         (KM[row][KD2]<<2) + 
         (KM[row][KD3]<<3) + 
         (KM[row][KD4]<<4) + 
         (KM[row][KD5]<<5) + 
         (KM[row][KD6]<<6)
      );   
   }   
          
   // sum all 12 KA lines
   KA = 0b111111111111;
   for(let col=0; col<=6; col++) {
      KA = KA & ( 
         (KM[KA0  ][col]<< 0) + 
         (KM[KA1  ][col]<< 1) + 
         (KM[KA2  ][col]<< 2) + 
         (KM[KA3  ][col]<< 3) + 
         (KM[KA4  ][col]<< 4) + 
         (KM[KA5  ][col]<< 5) + 
         (KM[KA6  ][col]<< 6) +
         (KM[KA7  ][col]<< 7) + 
         (KM[KA_xA][col]<< 8) + 
         (KM[KA_xB][col]<< 9) + 
         (KM[KA_xC][col]<<10) + 
         (KM[KA_xD][col]<<11)
      );   
   } 

   // reduce 12 KA' lines into 11 KA lines via LS138 multiplexer
                   
   let ABCD = (KA & 0b111100000000) >> 8;
   let KA8_10 = 0b0101000 | 0b111;
   let prefix = 0b0101 << 11;
   
        if(ABCD === 0b1110) KA8_10 = 0b000;
   else if(ABCD === 0b1101) KA8_10 = 0b001;
   else if(ABCD === 0b1011) KA8_10 = 0b010;
   else if(ABCD === 0b0111) KA8_10 = 0b011;   

   KA = prefix | (KA & 0b11111111) | (KA8_10 << 8);

   // console.log(`ABCD=${bin(ABCD,4)} KA8_11=${bin(KA8_10,3)} KA=${bin(KA,11)} KD=${bin(KD,7)} hex=${hex(KA,4)}`);
}
