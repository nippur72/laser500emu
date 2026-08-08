Hi,

Please kindly accept this as an anonymous contribution for the Laser 500 community. A few weeks ago, a friend of mine 
came across a listing for a batch of floppy disks on a Chinese second-hand market website(xianyu). To his surprise, the 
labels on these disks indicated they were for the Laser 500 system, contains software like CP/M, Logo, Z80, VT DOS, 
Fortran, and DBASE. Excited by this discovery, he informed me, made the purchase, and together, we began brainstorming 
ways to dump the contents of these disks.

After studying KryoFlux and the  "Preserving Floppy Disks via Logic Analyzer," he quickly built a prototype circuit using 
an Arduino and an inexpensive logic analyzer. There you go, using a python script, all 17 disks are dumped and decoded 
into NIC files successfully. All Checksum values of every sectors on the 17 disks collection are validated.

I hope you enjoy these vintage software and the long lost history of Laser 500.

Cheers,

------

To load a disk, simply drag and drop the NIC file into the Laser 500 Emulator window, or load it using the Browser Developer Console.

If you need to boot from a disk, replace the dos_disk.js file in the root folder with the fdxxx.js file, then restart the emulator.


The files fd004.nic and fd007.nic are duplicates; they are identical. When you load this disk, DOS will automatically run the DIR 
command. To return to the BASIC prompt, simply press the space key.

Some CP/M disks are bootable but unable to return to command line prompt, but reported BDOS error. The software/file on these disks 
fine. To read a disk with a BDOS error, boot from fd004.nic, then drag and drop the NIC file into the emulator window and run the DIR 
command.

--------
fd004.nic LASER500 SYSTEM (bootable CP/M 56K 2.20, with essential commands)
fd005.nic LASER500 DOS1.1 (bootable VT Dos 1.1 with many Basic programs)
fd007.nic LASER500 SYSTEM (Duplicate of fd004)

fd008.nic LASER500 Z-80 (bootable CP/M 56k 2.20 disk, error: Bdos Err On A: Bad Sector, many CP/M commands)

fd009.nic LASER500 CP_M  56K V2.2 (bootable CP/M MBasic error: Bdos Err On A: Bad Sector, remaining CP/M commands)
fd010.nic LASER 500 VT-DOS 1.1 (Same as fd005)
fd011.nic LASER500 CP_M MP40 (bootable CP/M 56k 2.20 disk, error: Bdos Err On A: Bad Sector)
fd012.nic LASER500 CP_M MP40 HLP (bootable CP/M 56k 2.20 disk, error: Bdos Err On A: Bad Sector)

fd013.nic LASER500 CP_M 56K 2.2 (Same as fd004, boot with Bdos error.)

fd014.nic LASER500 M80 L80

fd015.nic LASER500 Z80 (CP/M Z80 dev tools, boot with Bdos error on A: Bad Sector.)

fd016.nic LASER500 DBASE (CP/M formatted disk, DBASE program and DBF files, no DBASE software)

fd017.nic LASER500 LOGO (LOGO SYSTEM Vers 2.1.0)
fd018.nic LASER500 CP_M WORD STAR (MicroPro WordStar release 3.00, boot with Bdos error)
fd019.nic LASER500 ZH_L500万用模块CCDOS (Requires ZH_L500 Chinese Language Card, bootable)

fd020.nic LASER500 FORTRAN (CP/M Fortran program disk, PI.FOR: Calculates Pi using polynomial, Fortran compiler: F80)

fd021.nic LASER500 汉字CP_M 系统盘 (Chinese CP/M 2.2 system disk, bootable, non standard CP/M disk format)
fd022.nic LASER500 汉字CP_M 字库盘 (Chinese CP/M 2.2 font disk, untested, non standard CP/M format)
