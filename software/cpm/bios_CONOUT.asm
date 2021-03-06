








EXTERN _CONOUT

VIDEO EQU $7800
NCOLS EQU 80
NROWS EQU 24

CURSOR_COL: DEFB 43
CURSOR_ROW: DEFB 22

_CONOUT:
CONOUT:
    DI
    LD   A,L
    CALL HANDLE_CHARS
    EI
    RET

HANDLE_CHARS:
    
	CP 8
	JR Z,CHAR_BACKSPACE
	CP 10
	JR Z,CHAR_LF
	CP 13
	JR Z,CHAR_CR
	CP 28
	JR Z,CHAR_HOME
	CP 31
	JR Z,CHAR_CLS

    
    
    
    
    
    
    
    

NORMAL_CHARACTER:
    PUSH AF
    CALL VBANK_ON
    CALL CALC_CURSOR_ADDR
    POP  AF
    LD   (HL),A            
    CALL CURSOR_RIGHT      
    CALL CURSOR_TOGGLE     
    CALL VBANK_OFF
    RET

CHAR_BACKSPACE:
    RET

CHAR_LF:
    RET

CHAR_CR:
    RET

CHAR_HOME:
    CALL CURSOR_TOGGLE     
CHAR_HOME_AFTERTOGGLE:
    XOR  A                 
    LD   (CURSOR_COL),A    
    LD   (CURSOR_ROW),A    
    CALL CURSOR_TOGGLE     
    RET

CHAR_CLS:
    LD HL,VIDEO
    LD DE,VIDEO+1
    LD BC,80*24
    LD A,32                
    LD (HL),A
    LDIR
    JP CHAR_HOME_AFTERTOGGLE










CALC_CURSOR_ADDR:
    PUSH DE
    LD   A,(CURSOR_ROW)
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
    LD   A,(CURSOR_COL)
    LD   E,A
    ADD  HL,DE
    POP  DE
    RET





CURSOR_TOGGLE:
    CALL CALC_CURSOR_ADDR
    LD   A,(HL)
    XOR  128
    LD   (HL),A
    RET





CURSOR_RIGHT:
    LD A,(CURSOR_COL)
IF_125_START:
	CP NCOLS-1
	JR NZ,IF_125_ELSE
       XOR A
       LD (CURSOR_COL),A
       LD A,(CURSOR_ROW)
IF_129_START:
	CP NROWS-1
	JR NZ,IF_129_ELSE
          CALL SCROLL_UP
	JR IF_129_END
IF_129_ELSE:
          INC A
          LD (CURSOR_ROW),A
IF_129_END:
	JR IF_125_END
IF_125_ELSE:
       INC A
       LD (CURSOR_COL),A
IF_125_END:
    RET





COUNTER:
    DEFB 0

SCROLL_UP:
    PUSH BC
    PUSH DE
    PUSH HL

    
    LD A,(CURSOR_COL) 
    LD L,A
    LD A,(CURSOR_ROW) 
    LD H,A
    PUSH HL

    LD A,0
    LD (COUNTER),A
    LD (CURSOR_COL),A
DO_163_START:
        
        LD A,(COUNTER)
        LD (CURSOR_ROW),A
        CALL CALC_CURSOR_ADDR
        LD E,L
        LD D,H

        
        LD A,(COUNTER)
        INC A
        LD (CURSOR_ROW),A
        CALL CALC_CURSOR_ADDR

        
        LD BC,80

        
        LDIR

        
        LD   A,(COUNTER)
        INC  A
        LD   (COUNTER),A
	CP 23
	JR NZ,DO_163_START
DO_163_END:


    LD A,32       
    LD HL,32672   
    LD DE,32672+1 
    LD (HL),A     
    LD BC,80      
    LDIR          

    
    POP HL
    LD A,L 
    LD (CURSOR_COL),A
    LD A,H 
    LD (CURSOR_ROW),A

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



