# Laser 350/500/700 (Video Technology) emulator

The Laser 350/500/700 is a family of home computers based on the Z80 CPU
made by Video Technology in 1985. `laser500emu` emulates such computers in 
a web browser. 

To run the emulator, simply open to the link: [nippur72.github.io/laser500emu](https://nippur72.github.io/laser500emu/)

This repo serves also as a container for Laser 500 software and documentation, have a look at:

- [software](https://github.com/nippur72/laser500emu/tree/gh-pages/software)
- [docs](https://github.com/nippur72/laser500emu/tree/gh-pages/docs)

Other resources about the Laser computers are a dedicated [Facebook group](https://www.facebook.com/groups/263150584310074) and 
an old forum thread on [AtariAge](http://atariage.com/forums/topic/187667-any-info-on-video-technology-laser-500-computer/page-1).

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
