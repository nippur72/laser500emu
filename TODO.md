# TODO

## joysticks
- add options for loading "test_joysticks.bin"
- verificare a che serve test_z88dk_soysticks
- option for numpad emulation
- joysticks ports like in laser 310 (also fpga ?)
- gamepad api

## serial and parallel
- serial: reconcile BBS serial port with CP/M serial port
- capture printer in gui

## tape
- inverted waveform option
- turbotape check T-states, finalize
- make turbotape on the gui, on-the-fly
- verify cassette_bit I/O range on real HW
- check turbotape mariel wavs

## audio
- audio: mute option
- audio: save with tape?
- fix bug introduced with audioContext.resume

## video
- 1x1 pixel rendering
- crt emulation: colour fringe emulation
- contrast/luminosity/saturation controls?
- monochrome control?
- almost exact cycles drawing

## disk drive
- restore IN(0x13)=0xFF, IN(0x12)=0x13 when no drive selected (@Bonstra test)
- emulate true drive @300 RPM
- track/head r/w status bar indicator (display drive activity)
- disk drive sounds

## keyboard
- caplock key / led ?
- be able to emulate CTRL+power up

## cpm 
- clean CP/M attempt
- organize/document chinese disk collection

## misc
- load/save memory block/basic program
- type basic text, paste
- replace .bin with VZ ?
- cartridge load
- adopt bank/page termonology as in the user manual
- gui keydown, make single handler
- add a machine reset (FDC ecc..)
- modularize, avoid global variables
- stop() resumes after browser tab reactivates
- ??fix page refresh when in laser 350 mode
- URLSearchParams()
- remove software from facebook group
- screen writing emulation as browser support
- publish Jaime's disks
- z88dk, change header of .bin files use "B:" type
- finalize throttle / end of frame hook
- finalize Z80.js fuse tests
- finalize pasteLine/pasteText
- draw keyboard for mobile
- javascript debugger, halt
- cartdriges / rom expansion slots
- sprite routine?
- reorganize/finalize lib500
- check tetris 

## Inline notes

- `keyboard_ITA?: boolean` — Italian keyboard layout (TODO, unused) in the query string options
- `options.keyboard === "ITA"` — commented-out option parsing block (see emulator.ts, ~line 608)
