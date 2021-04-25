zcc +laser500 ..\lib500\lib500.c ..\cpm\bios_CONOUT.asm ..\cpm\read_keyboard.c term.c -o term.bin -I..\lib500 -I..\cpm -create-app -Cz--audio -pragma-define:CLIB_LASER500_SCAN_EXTRA_ROWS=1
@del *.cas
