// TODO gr3_rowaddress avoid init phase

#ifndef LIB500_H
#define LIB500_H

typedef unsigned char byte;
typedef unsigned int  word;

#define FASTCALL __z88dk_fastcall
#define FASTNAKED __z88dk_fastcall __naked
#define NAKED __naked

// zcc does not support the "inline" keyword
#ifdef SDCC
#define INLINE inline
#else
#define INLINE
#endif

#include "disk.h"
#include "interrupt.h"
#include "clock.h"
#include "keyboard.h"
#include "conio_rom.h"
#include "system.h"
#include "grall.h"
#include "gr3.h"
#include "gr4.h"

#include "disk.c"
#include "interrupt.c"
#include "clock.c"
#include "keyboard.c"
#include "conio_rom.c"
#include "system.c"
#include "grall.c"
#include "gr3.c"
#include "gr4.c"

#endif
