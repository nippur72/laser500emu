// Italian keyboard layout

assignKey('Control', KEY_CONTROL);
assignKey(' '      , KEY_SPACE);

// assignKey('Shift', KEY_SHIFT);
assignKey('>'       , KEY_DOT   , true);
assignKey('<'       , KEY_COMMA , true);
assignKey('z'       , KEY_Z);              assignKey('Z'    , KEY_Z         , true); 
assignKey('x'       , KEY_X);              assignKey('X'    , KEY_X         , true); 
assignKey('c'       , KEY_C);              assignKey('C'    , KEY_C         , true); 
assignKey('v'       , KEY_V);              assignKey('V'    , KEY_V         , true); 
assignKey('b'       , KEY_B);              assignKey('B'    , KEY_B         , true); 
assignKey('n'       , KEY_N);              assignKey('N'    , KEY_N         , true); 
assignKey('m'       , KEY_M);              assignKey('M'    , KEY_M         , true);
assignKey(','       , KEY_COMMA);          assignKey(';'    , KEY_SEMICOLON       );
assignKey('.'       , KEY_DOT);            assignKey(':'    , KEY_SEMICOLON , true);  
assignKey('-'       , KEY_MINUS);          assignKey('_'    , KEY_MINUS     , true);

//assignKey('CapsLock'   , KEY_CAP_LOCK); 
assignKey('a'      , KEY_A);       assignKey('A'    , KEY_A, true); 
assignKey('s'      , KEY_S);       assignKey('S'    , KEY_S, true); 
assignKey('d'      , KEY_D);       assignKey('D'    , KEY_D, true); 
assignKey('f'      , KEY_F);       assignKey('F'    , KEY_F, true); 
assignKey('g'      , KEY_G);       assignKey('G'    , KEY_G, true); 
assignKey('h'      , KEY_H);       assignKey('H'    , KEY_H, true); 
assignKey('j'      , KEY_J);       assignKey('J'    , KEY_J, true);
assignKey('k'      , KEY_K);       assignKey('K'    , KEY_K, true);
assignKey('l'      , KEY_L);       assignKey('L'    , KEY_L, true);
assignKey('ò'      , KEY_2, true); assignKey('ç'    , KEY_BACK_QUOTE, true); assignKey('@' , KEY_2, true); 
assignKey('à'      , KEY_3, true); assignKey('°'    , KEY_BACK_QUOTE);       assignKey('#' , KEY_3, true); 
assignKey('ù'      , KEY_MU);      assignKey('§'    , KEY_GRAPH); 

assignKey('Tab'    , KEY_TAB);
assignKey('q'      , KEY_Q);   assignKey('Q'    , KEY_Q, true);
assignKey('w'      , KEY_W);   assignKey('W'    , KEY_W, true);
assignKey('e'      , KEY_E);   assignKey('E'    , KEY_E, true);
assignKey('r'      , KEY_R);   assignKey('R'    , KEY_R, true);
assignKey('t'      , KEY_T);   assignKey('T'    , KEY_T, true);
assignKey('y'      , KEY_Y);   assignKey('Y'    , KEY_Y, true);
assignKey('u'      , KEY_U);   assignKey('U'    , KEY_U, true);
assignKey('i'      , KEY_I);   assignKey('I'    , KEY_I, true);
assignKey('o'      , KEY_O);   assignKey('O'    , KEY_O, true);
assignKey('p'      , KEY_P);   assignKey('P'    , KEY_P, true);
assignKey('è'      , KEY_OPEN_BRACKET , true); 
assignKey('é'      , KEY_CLOSE_BRACKET, true); 
assignKey('+'      , KEY_EQUAL        , true);   assignKey('*'   , KEY_8            , true);
assignKey('['      , KEY_OPEN_BRACKET);         
assignKey(']'      , KEY_CLOSE_BRACKET);        
assignKey('Enter'  , KEY_RETURN);                        

assignKey('\\'       , KEY_BACKSLASH);     assignKey('|'    , KEY_BACKSLASH, true); 
assignKey('1'        , KEY_1);             assignKey('!'    , KEY_1        , true);
assignKey('2'        , KEY_2);             assignKey('"'    , KEY_QUOTE    , true);      
assignKey('3'        , KEY_3);             assignKey('£'    , KEY_MU       , true); 
assignKey('4'        , KEY_4);             assignKey('$'    , KEY_4        , true); 
assignKey('5'        , KEY_5);             assignKey('%'    , KEY_5        , true); 
assignKey('6'        , KEY_6);             assignKey('&'    , KEY_7        , true);
assignKey('7'        , KEY_7);             assignKey('/'    , KEY_SLASH          );
assignKey('8'        , KEY_8);             assignKey('('    , KEY_9        , true); 
assignKey('9'        , KEY_9);             assignKey(')'    , KEY_0        , true);
assignKey('0'        , KEY_0);             assignKey('='    , KEY_EQUAL          ); 
assignKey("'"        , KEY_QUOTE);         assignKey('?'    , KEY_SLASH    , true);
assignKey('^'        , KEY_6      , true); assignKey('ì'    , KEY_6        , true); 
assignKey('Backspace', KEY_BS); 

assignKey('Escape', KEY_ESC);
assignKey('F1'    , KEY_F1 ); 
assignKey('F2'    , KEY_F2 ); 
assignKey('F3'    , KEY_F3 ); 
assignKey('F4'    , KEY_F4 ); 
assignKey('F5'    , KEY_F5 ); 
assignKey('F6'    , KEY_F6 ); 
assignKey('F7'    , KEY_F7 ); 
assignKey('F8'    , KEY_F8 );   
assignKey('F9'    , KEY_F9 );   
assignKey('F10'   , KEY_F10);   

// keys not available on the IT layout
assignKey('`' , KEY_BACK_QUOTE         ); 
assignKey('~' , KEY_BACK_QUOTE   , true); 
assignKey('{' , KEY_OPEN_BRACKET , true);  
assignKey('}' , KEY_CLOSE_BRACKET, true); 
 
assignKey('Insert' , KEY_INS); 
assignKey('Delete' , KEY_DEL); 
assignKey('End'    , KEY_DEL_LINE); 
assignKey('Home'   , KEY_CLS_HOME); assignKey('Cls' , KEY_CLS_HOME, true);

assignKey('ArrowUp'    , KEY_UP); 
assignKey('ArrowLeft'  , KEY_LEFT); 
assignKey('ArrowRight' , KEY_RIGHT); 
assignKey('ArrowDown'  , KEY_DOWN); 
