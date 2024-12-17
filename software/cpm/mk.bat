@rem
@rem Compiles the C test program and
@rem automatically loads it into the emulator
@rem

call asmproc -i bios_CONOUT.lm -o bios_CONOUT.asm --target z80asm
call asmproc -i bios_CONIN.lm  -o bios_CONIN.asm  --target z80asm

zcc +laser500 ..\lib500\lib500.c bios_CONIN.asm bios_CONOUT.asm read_keyboard.c test_bios.c -O2 -create-app -Cz--audio -o test_bios.bin -I..\lib500
copy test_bios.bin ..\..\autoload.bin
cd ..\..
node makeautoload.js
cd software\cpm
