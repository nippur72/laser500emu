# Laser 350/500/700 emulator

A web emulator for the Video Technology Laser 350/500/700 home computers (Z80, 1985).

Try it online: [nippur72.github.io/laser500emu](https://nippur72.github.io/laser500emu/)

To run locally: clone the repo, then `npm install` and `npm run serve` (opens on port 8080).

## Keyboard

The Laser's native UK/US layout is emulated, regardless of your keyboard.

- `Pause` or `Alt`+`R` — reset
- `Ctrl`+`Alt`+`Pause` — power on/off
- `Home` / `Shift`+`Home` — HOME / CLS
- `End` — DEL LINE, `Del` — DEL
- `Page Up` — mu (µ) symbol
- `Page Down` — GRAPH key
- `Alt`+`←` — rewind tape, `Alt`+`↑`/`↓` — stop tape
- Numpad emulates a joystick (`0` fire, `Right Ctrl` fire 2); real gamepads also work
- `Ctrl`+`Alt`+`M` — settings menu (also reachable via the floating button)

## Files

Drag & drop a file onto the emulator to load it:

- `.bin` — loaded into memory at `0x8995` (runs at the BASIC prompt)
- `.bas` — typed in as BASIC source
- `.wav` — played from the simulated tape (auto-runs `CRUN` if in immediate mode)
- `.nic` — mounted as a floppy disk on drive 1

## URL options

Add query string parameters, e.g. `?nodisk=true&charset=german`:

- `load=path_or_url` — load and run a program from the `software` folder or an external URL
- `nic=path_or_url`, `fd1=path_or_url`, `fd2=path_or_url` — mount a disk image at startup
- `nodisk=true` — detach the floppy disk interface
- `notapemonitor=true` — mute tape playback audio
- `charset=english|german|french|bincode` — charset ROM variant (default `english`)
- `saturation=0..1` — color saturation (default 1)
- `bh`/`bt`/`bb` — border width in pixels
- `aspect=ratio` — canvas aspect ratio (default 1.55)

## Features

- Scanline-accurate video, all graphic modes, PAL 50 fps
- optional CRT emulation effects 
- Two floppy drives with `.nic` images (VT-DOS supported)
- Tape: play `.wav`, record to `.wav`
- Joystick interfaces via numpad or gamepad
- Memory size selectable for Laser 350/500/700
- Printer output redirected to the browser console

## Software & docs

This repo also hosts a collection of Laser 500 software, ROMs and documentation:

- [software](https://github.com/nippur72/laser500emu/tree/gh-pages/software)
- [docs](https://github.com/nippur72/laser500emu/tree/gh-pages/docs)

External resources:

- [Bonstra's laser500-doc](https://github.com/Bonstra/laser500-doc)
- [Laser 500 Facebook group](https://www.facebook.com/groups/263150584310074)
- [AtariAge thread on the Laser 500](https://atariage.com/forums/topic/187667-any-info-on-video-technology-laser-500-computer)
