// drive-sound.ts
// Plays the floppy drive head step sound using the Web Audio API.
// This module is intentionally kept dependency-free to avoid circular imports
// between floppy.ts and emulator.ts.

let _buffer: AudioBuffer | null = null;
let _ctx: AudioContext | null = null;
let _enabled = true;
let _currentSrc: AudioBufferSourceNode | null = null;

export function initDriveSound(ctx: AudioContext) {
   _ctx = ctx;
}

export async function loadDriveSound(url: string) {
   if (!_ctx) return;
   try {
      const res = await fetch(url);
      const ab = await res.arrayBuffer();
      _buffer = await _ctx.decodeAudioData(ab);
   } catch(e) {
      console.warn(`drive-sound: could not load ${url}`, e);
   }
}

export function playDriveSound() {
   if (!_enabled || !_buffer || !_ctx) return;
   if (_ctx.state !== 'running') return;  // drop sound if context is suspended (browser policy)

   // stop the previous sound if still playing
   if (_currentSrc) {
      try { _currentSrc.stop(); } catch(_) {}
      _currentSrc = null;
   }

   const src = _ctx.createBufferSource();
   src.buffer = _buffer;
   src.connect(_ctx.destination);
   src.onended = () => { if (_currentSrc === src) _currentSrc = null; };
   src.start();
   _currentSrc = src;
}

export function setDriveSoundEnabled(enabled: boolean) {
   _enabled = enabled;
}

export function isDriveSoundEnabled() {
   return _enabled;
}
