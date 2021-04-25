# COMPILING FOR LASER 500 WITH Z88DK

Flags:

- `+laser500` targets Laser 500 (obvious)

- `-create-app -Cz--audio` creates `.bin` and `.wav` that can be loaded on the emulator
  Wav files can be also loaded on a real Laser 500.

- `-pragma-define:CLIB_LASER500_SCAN_EXTRA_ROWS=1` needed only if <= v17436 (20210203)
  makes the keyboard read functions read the 500/700 extended keys (cursors etc)
  Removed in the new Z88DK versions.

- `-pragma-define:JOYSTICK_inkey=0` make joystick revert to keyboard: JOY0 will
  be keys QAOP, JOY1 keys 8246

- `-pragma-define:JOYSTICK_inkey=1`
