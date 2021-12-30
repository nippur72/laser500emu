SET COMPILER=SDCC

@IF %COMPILER%==ZCC  zcc +laser500 tetris500.c -o tetris500.bin -I..\lib500 -create-app -Cz--audio --list -m -s -DZCC
@IF %COMPILER%==SDCC zcc +laser500 tetris500.c -o tetris500.bin -I..\lib500 -create-app -Cz--audio --list -m -s -DSDCC -compiler sdcc -SO3

@copy tetris500.bin ..\..\autoload.bin
@cd ..
@cd ..
@call node makeautoload
@cd software\tetris

