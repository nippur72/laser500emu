









VIDEO     EQU $7800            
NCOLS     EQU 80               
NROWS     EQU 24               


ROM0_PAGE  EQU 0
ROM1_PAGE  EQU 1
IO_PAGE    EQU 2
RAM4_PAGE  EQU 4
RAM5_PAGE  EQU 5
RAM6_PAGE  EQU 6
VIDEO_PAGE EQU 7


BANK0      EQU $40
BANK1      EQU $41
BANK2      EQU $42
BANK3      EQU $43






PUBLIC _CAPSLOCK         
PUBLIC CAPSLOCK          
PUBLIC _CONIN            

_CAPSLOCK EQU CAPSLOCK
_CONIN    EQU CAPSLOCK


CAPSLOCK: DEFB 0       

CONIN:
    LD      A,64
    RET

  
                                            
                           
                                                                                   
                                                                                     
  
  

PUBLIC _KEYBOARD_ROWS

_KEYBOARD_ROWS EQU KEYBOARD_ROWS

KEYBOARD_ROWS:
    DEFW $68FE, $68FD, $68FB, $68F7, $68EF, $68DF, $68BF, $687F   
    DEFW $6BFF, $6AFF, $69FF, $68FF                               

  
                   
                             
                                                          
                                                         
                                                        
                                                        
                                                       
                                                         
                                                             
                                                           
                                                           
                                                                             
                                                              
                                                             
  

                 
                            
                                                          
                                                          
                                                           
                                                        
                                                       
                                                         
                                                             
                                                           
                                                           
                                                                             
                                                              
                                                             
  

                 
                              
                                                        
                                                        
                                                       
                                                      
                                                     
                                                       
                                                           
                                                         
                                                         
                                                                           
                                                            
                                                          
  
  

PUBLIC _SCANCODES_NORMAL
PUBLIC _SCANCODES_SHIFT
PUBLIC _SCANCODES_CONTROL

_SCANCODES_NORMAL   EQU SCANCODES_NORMAL
_SCANCODES_SHIFT    EQU SCANCODES_SHIFT
_SCANCODES_CONTROL  EQU SCANCODES_CONTROL


SCANCODES_NORMAL:
   DB   255, 'Z', 'X', 'C', 'V', 'B', 'N'    
   DB   255, 'A', 'S', 'D', 'F', 'G', 'H'    
   DB   '\T','Q', 'W', 'E', 'R', 'T', 'Y'    
   DB    27, '1', '2', '3', '4', '5', '6'    
   DB   255, '=', '-', '0', '9', '8', '7'    
   DB     8, 255, 255, 'P', 'O', 'I', 'U'    
   DB    13, 255,  39,  58, 'L', 'K', 'J'    
   DB   255, '`', ' ', '/', '.', ',', 'M'    
   DB   255,'\\', ']', '[', '~', 127, 141    
   DB     6, 138, 139,  15,   8,  14,  10    
   DB   255, 137, 136, 135, 134, 133, 132    
   DB   255, 128, 129, 130, 131, 255, 255    


SCANCODES_SHIFT:
   DB 255, 'Z', 'X', 'C', 'V', 'B', 'N'    
   DB 255, 'A', 'S', 'D', 'F', 'G', 'H'    
   DB '\T','Q', 'W', 'E', 'R', 'T', 'Y'    
   DB  27, '!', '@', '#', '$', '%', '^'    
   DB 255, '+', '_', ')', '(', '*', '&'    
   DB   8, 255, 255, 'P', 'O', 'I', 'U'    
   DB  13, 255,  34,  59, 'L', 'K', 'J'    
   DB 255, '`', ' ', '?', '>', '<', 'M'    
   DB 255,'\\', '}', '{', '~', 127, 141    
   DB   6, 138,  12,  15,   8,  14,  10    
   DB 255, 137, 136, 135, 134, 133, 132    
   DB 255, 128, 129, 130, 131, 255, 255    


SCANCODES_CONTROL:
   DB 255,  26,  24,   3,  22,   2,  14    
   DB 255,   1,  19,   4,   6,   7,   8    
   DB '\T', 17,  23,   5,   18,  20, 25   
   DB  27, '1', '2', '3', '4', '5', '6'    
   DB 255, '=', '-', '0', '9', '8', '7'    
   DB   8, 255, 255,  16,  15,   9,  21    
   DB  13, 255,  39,  58,  12,  11,  10    
   DB 255, '`', ' ', '/', '.', ',',  13    
   DB 255,'\\', ']', '[', '~', 127, 141    
   DB   6, 138, 139,  15,   8,  14,  10    
   DB 255, 137, 136, 135, 134, 133, 132    
   DB 255, 128, 129, 130, 131, 255, 255   

