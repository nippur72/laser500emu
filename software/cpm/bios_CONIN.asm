;***************************************************************************************
;
;CONIN (function 3)
;Wait until the keyboard is ready to provide a character, and return it in A.
;
;***************************************************************************************

; TODO consider IOBYTE

EXTERN _CONIN

_CONIN:
CONIN:
    ld      a,64
    ret

