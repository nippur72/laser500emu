@echo off

REM compile
yaza tapedos.asm

REM compress with exomizer byte cruncher
SET EXO=..\..\..\laser500-exomizer\exomizer.exe
%EXO% raw -P0 tapedos.bin -o tapedos.exo
call exolaser -i tapedos.exo -u tapedos.bin -o tapedos.exo.bin
del tapedos.exo

REM create WAV files
call laser500wav -i tapedos.exo.bin -o tapedos.turbo.off -n "TAPE DOS V1.1"
call laser500wav -i tapedos.exo.bin -o tapedos.turbo.1 -n "TAPE DOS V1.1" -x --turbo-speed 1
call laser500wav -i tapedos.exo.bin -o tapedos.turbo.2 -n "TAPE DOS V1.1" -x --turbo-speed 2
call laser500wav -i tapedos.exo.bin -o tapedos.turbo.3 -n "TAPE DOS V1.1" -x --turbo-speed 3
call laser500wav -i tapedos.exo.bin -o tapedos.turbo.4 -n "TAPE DOS V1.1" -x --turbo-speed 4






