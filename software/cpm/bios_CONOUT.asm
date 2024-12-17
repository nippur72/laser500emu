








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









EXTERN CAPSLOCK       

PUBLIC _CCOL          
PUBLIC _CROW          
PUBLIC _CONOUT        

_CCOL   EQU CCOL      
_CROW   EQU CROW      
_CONOUT EQU CONOUT    

CCOL: DEFB 0         
CROW: DEFB 0         

CONOUT:
    DI
    CALL VBANK_ON
    CALL CURSOR_TOGGLE
    CALL HANDLE_CHARS
    CALL CURSOR_TOGGLE
    CALL VBANK_OFF
    EI
    RET

HANDLE_CHARS:
    
	CP 6
	JR Z,CHAR_CAPSLOCK
	CP 8
	JR Z,CHAR_BACKSPACE
	CP 9
	JR Z,CHAR_TAB
	CP 10
	JR Z,CHAR_LF
	CP 12
	JR Z,CHAR_FF
	CP 13
	JR Z,CHAR_CR
   
	CP 14
	JR Z,CHAR_RIGHT
	CP 15
	JR Z,CHAR_UP
   

NORMAL_CHARACTER:
    PUSH AF                
    CALL CALC_CURSOR_ADDR  
    POP  AF                
    LD   (HL),A            
    CALL CURSOR_RIGHT      
    RET

CHAR_CAPSLOCK:
    LD   A,(CAPSLOCK)
    CPL
    LD   (CAPSLOCK),A
    
    RET

CHAR_BACKSPACE:
    CALL  CURSOR_LEFT      
    RET

CHAR_RIGHT:
    CALL CURSOR_RIGHT
    RET

CHAR_UP:
    CALL CURSOR_UP
    RET

CHAR_TAB:
    CALL CURSOR_RIGHT
    LD   A,(CCOL)
    AND  0X07               
    RET  Z
    JR   CHAR_TAB

CHAR_LF:
    CALL  CURSOR_DOWN
    RET

CHAR_CR:
    XOR   A           
    LD    (CCOL),A    
    RET

CHAR_FF:
    LD HL,VIDEO
    LD DE,VIDEO+1
    LD BC, 2031      
    LD A,32          
    LD (HL),A
    LDIR
    XOR  A           
    LD   (CCOL),A    
    LD   (CROW),A    
    RET





CALC_CURSOR_ADDR:
    PUSH DE
    LD   A,(CROW)
    SLA  A
    LD   L,A
    LD   H,0
    LD   DE,ROWTABLE
    ADD  HL,DE
    LD   E,(HL)
    INC  HL
    LD   D,(HL)
    PUSH DE
    POP  HL
    LD   D, 0
    LD   A,(CCOL)
    LD   E,A
    ADD  HL,DE
    POP  DE
    RET





CURSOR_TOGGLE:
    PUSH AF
    CALL CALC_CURSOR_ADDR
    LD   A,(HL)
    XOR  128
    LD   (HL),A
    POP  AF
    RET





CURSOR_DOWN:
    LD A,(CROW)
IF_168_START:
	CP NROWS-1
	JR NZ,IF_168_ELSE
       CALL SCROLL_UP
	JR IF_168_END
IF_168_ELSE:
       INC A
       LD (CROW),A
IF_168_END:
    RET





CURSOR_UP:
    LD A,(CROW)
IF_182_START:
	CP 0
	JR NZ,IF_182_ELSE
 RET 
IF_182_ELSE:
IF_182_END:
 
    DEC A
    LD (CROW),A
    RET





CURSOR_RIGHT:
    LD A,(CCOL)
IF_196_START:
	CP NCOLS-1
	JR NZ,IF_196_ELSE
       XOR A
       LD (CCOL),A
       LD A,(CROW)
IF_200_START:
	CP NROWS-1
	JR NZ,IF_200_ELSE
          CALL SCROLL_UP
	JR IF_200_END
IF_200_ELSE:
          INC A
          LD (CROW),A
IF_200_END:
	JR IF_196_END
IF_196_ELSE:
       INC A
       LD (CCOL),A
IF_196_END:
    RET





CURSOR_LEFT:
    LD A,(CCOL)
    DEC A
    LD (CCOL),A
IF_220_START:
	CP -1
	JR NZ,IF_220_ELSE
       LD A,NCOLS-1
       LD (CCOL),A
       LD A,(CROW)
       DEC A
       LD (CROW),A
IF_226_START:
	CP -1
	JR NZ,IF_226_ELSE
          XOR A
          LD (CCOL),A
          LD (CROW),A
IF_226_ELSE:
IF_226_END:
IF_220_ELSE:
IF_220_END:
    RET





COUNTER:
    DEFB 0

SCROLL_UP:
    PUSH BC
    PUSH DE
    PUSH HL

    
    LD A,(CCOL) 
    LD L,A
    LD A,(CROW) 
    LD H,A
    PUSH HL

    LD A,0
    LD (COUNTER),A
    LD (CCOL),A
DO_253_START:
        
        LD A,(COUNTER)
        LD (CROW),A
        CALL CALC_CURSOR_ADDR
        LD E,L
        LD D,H

        
        LD A,(COUNTER)
        INC A
        LD (CROW),A
        CALL CALC_CURSOR_ADDR

        
        LD BC,80

        
        LDIR

        
        LD   A,(COUNTER)
        INC  A
        LD   (COUNTER),A
	CP 23
	JR NZ,DO_253_START
DO_253_END:


    LD A,32       
    LD HL,32672   
    LD DE,32672+1 
    LD (HL),A     
    LD BC,80      
    LDIR          

    
    POP HL
    LD A,L 
    LD (CCOL),A
    LD A,H 
    LD (CROW),A

    POP HL
    POP DE
    POP BC
    RET

VBANK_ON:
    PUSH AF
    LD   A, VIDEO_PAGE
    OUT  (BANK1),A
    POP  AF
    RET

VBANK_OFF:
    PUSH AF
    LD   A,ROM1_PAGE
    OUT  (BANK1),A
    POP  AF
    RET

ROWTABLE:
    DEFW 30720
    DEFW 30976
    DEFW 31232
    DEFW 31488
    DEFW 31744
    DEFW 32000
    DEFW 32256
    DEFW 32512
    DEFW 30800
    DEFW 31056
    DEFW 31312
    DEFW 31568
    DEFW 31824
    DEFW 32080
    DEFW 32336
    DEFW 32592
    DEFW 30880
    DEFW 31136
    DEFW 31392
    DEFW 31648
    DEFW 31904
    DEFW 32160
    DEFW 32416
    DEFW 32672

