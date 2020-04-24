# Laser 350/500/700 (Video Technology) emulator

The Laser 350/500/700 is a family of home computers based on the Z80 CPU
made by Video Technology in 1985. `laser500emu` emulates these computers in 
a web browser. 

HOW TO USE
==========

To run the emulator, simply open to the link: 
[nippur72.github.io/laser500emu](https://nippur72.github.io/laser500emu/). 

You can also clone the repo and run locally, just open the file `index.html`.

The emulator is written in JavaScript and runs fine in Chrome and FireFox. 

KEYBOARD
========
Laser native UK/US keyboard is emulated, regardless of the actual keyboard layout.

Special keys:
- `Pause`: Laser's Reset key (it acts like a more powerful CTRL+Break)
- `Alt`+`R`: alternate for Reset key
- `Alt`+`P`: power on/off the machine
- `Home`: HOME key
- `Shift`+`Home`: CLS key (clear screen)
- `End`: DEL LINE key
- `Del`: DEL key 
- `Page Up`: GRAPH key 
- `Page Down`: mu/£ key 
- `Alt`+`Cursor Left`: rewinds and plays the tape
- `Alt`+`Cursor Up`: stops the tape
- Joystick: numeric keypad; `0` is fire 1, `Right Ctrl` is fire 2

EMULATION SPEED
===============

If emulation is slower than expected you can check how much CPU load 
the emulator is consuming. Open the JavaScript console (`F12`) and type `info()`
```
> info()
frame rendering: 2.9 ms, load=14.5 %
```
Frame rendering should be less than 20 ms which is the PAL framerate 
it is being emulated.

AUTOSAVE
========
The machine state will be automatically saved and restored when you 
close and reopen the browser, taking you back where you left it.

If you want to start from scratch, press `ALT+P` to simulate power on/off.

LOADING AND SAVING FILES
========================
There are three types of files you can work with:

- binary files (`.bin`), plain files that are loaded in memory as-is
- floppy disk images (`.nic` or `.dsk`), created with `dsk2nic` or saved from the emulator
- audio files (`.wav`), tape audio files created on the real hardware

Dragging & dropping a file on the emulator's window causes the file to be loaded.

- Binaries are loaded at the standard memory address 0x8995. 
- Disk images are mounted on the drive #1. 
- Audio files are played back and loaded from simulated tape (`CRUN` command is launched 
automatically). To control playback, use `Alt+Left` (rewind tape) or `Alt+Up`/`Alt+Down` (stop tape).

Once a file is loaded, it's also stored on the browser cache so that you don't have
to drag&drop it again; you can use the `load()` function from the JavaScript console.

These are the commands you can type from the JavaScript console (F12 key):

- `load("file.bin" [,start])` loads a binary file at the specified address
- `load("disk.dsk" [,drive])` loads a disk image on the specified drive (1,2)
- `save("file.bin" [,start, end])` saves a binary file 
- `save("disk.dsk" [,drive])` create a disk image from the specified drive (1,2)
- `download("file_or_image")` gets the file as a browser download
- `remove("file_or_image")` remove file or image from browser's cache
- `dir()` lists files on browser's cache
- `csave()` starts recording to WAV (max 5 minutes); use before typing "CSAVE" on the emulator
- `cstop()` stops recording and downloads in the browser the resulting WAV file. Silence before and after is trimmed out.
- `pasteBasic(text)` paste a string of text (e.g. containing a BASIC program)

OPTIONS
=======
Options can be given in the form of query string commands on the URL of the emulator,
e.g. `https://nippur72.github.io/laser500emu?scanlines=true&nodisk=true`

- `restore=false` do not restore previous emulator state, start fresh (default is restore)
- `load=programName` load and run the specified program from the `software` directory of the emulator GitHub repo. If no relative path is specified, `programName` will be searched in all subdirectories. 
- `nodisk=true` disconnect emulated disk drive interface (default is attached)
- `notapemonitor=true` disables audio playback from tape (tape monitor)
- `charset=english|german|french` modify the hardware switches used to address the charset ROM (default is english).  
- `scanlines=true` turn on the scanlines effect (default is off)
- `saturation=value` set color saturation between 0 (B/W) and 1 (full color)
- `bh=value` horizontal border width in pixels (0-40)
- `bt=value` vertical top border height in pixels (0-65)
- `bb=value` vertical bottom border border height in pixels (0-55)
- `aspect=value` aspect ratio (default 1.55)
- `rgbmaskopacity=value` opacity of RGB mask effect (default is 0, no effect)
- `rgbmasksize=value` size in pixel of RGB mask effect (default 3)
- `keyboard=value` use real PC keyboard layout (only `keyboard=ITA` supported at the moment)

DEBUGGER
========
You can plug your own Javascript debug functions by defining 
`debugBefore()` and `debugAfter(elapsed)` in the JavaScript console.

`debugBefore` is executed before any Z80 instruction; `debugAfter` is executed
after the istruction and the number of occurred T-states is passed in the `elapsed` argument.

Within the debug functions you can access all the emulator variables, most likely 
you'll want to read the Z80 state with `cpu.getState()` or the memory content 
with `mem_read()` and `mem_write()`.

AUTOLOADING
=================
The emulator can be used in cross-development allowing to automate the process of 
loading and executing the program being developed. This will save lot of annoying drag&drops. 

To enable "autoload":
- clone the emulator on your local machine (it won't work in the online-version because of browser restrictions)
- in your compile chain (`make` etc..), copy the binary you want to execute in the emulator directory naming it `autoload.bin`
- execute `node makeautoload`, this will turn `autoload.bin` into JavaScript code (`autoload.js`).
- refresh the browser, the program will be loaded in memory and make it RUN

When you no longer want the file to be autoloaded, delete `autoload.bin` and run again `node makeautoload`.

EMULATOR FEATURES
=================
- accurate to the scanline level (changing video mode will reflect next scanline)
- all graphic modes are emulated 
- sound is accurate but lags due to browser latency
- old CRT look (simulated scanlines), 50 fps as in PAL standard
- cassette output is redirected to PC speakers (can be recorded and played back on a real machine)
- printer is emulated by redirecting it to the JavaScript console (F12 on the browser)
- ROM Basic 3.0 
- Joystick 1 emulated as NUMPAD + RIGHT CTRL (fire1) + NUMPAD0 (fire2)
- Floppy Disk Drive NOT emulated (we miss the ROM DOS Basic 1.0, if you have it please contact me)
- Keyboard not perfect yet, and with italian layout only
- ALT+R or CTRL+BREAK is reset key, ALT+P is power on button
- Drag & drop binary files to load them on the emulator
- automatically saves and restores the state of the emulator

There are also a bunch of commands that you can run from the JavaScript console (F12)
to load or save programs. Saved programs are seen as a downloaded file in the browser.

Programs are also stored on the internal browser storage (HTML5 `localStorage`), simulating
a sort of disk drive.

RESOURCES
=========

The `laser500emu` repo serves also as a container for Laser 500 software 
and documentation that I have collected along the way, make sure to have a look at:

- [software](https://github.com/nippur72/laser500emu/tree/gh-pages/software)
- [docs](https://github.com/nippur72/laser500emu/tree/gh-pages/docs)

Other resources about the Laser 350/500/700 computers are:

- Bonstra's GitHub repo [laser500-doc](https://github.com/Bonstra/laser500-doc) by 
- a dedicated [Facebook group](https://www.facebook.com/groups/263150584310074) 
- a forum thread on [AtariAge](http://atariage.com/forums/topic/187667-any-info-on-video-technology-laser-500-computer/page-1).
