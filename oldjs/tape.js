let tapeSampleRate = 0;
let tapeBuffer = new Float32Array(0);
let tapeLen = 0;
let tapePtr = 0;
let tapeHighPtr = 0;

function cloadAudioSamples(n) {
   if(tapePtr >= tapeLen) {
      cassette_bit_in = 1;
      return;
   }

   tapeHighPtr += (n*tapeSampleRate);
   if(tapeHighPtr >= cpuSpeed) {
      tapeHighPtr-=cpuSpeed;
      cassette_bit_in = tapeBuffer[tapePtr] > 0 ? 1 : 0;
      tapePtr++;
   }
}

// ********************************* CPU TO CSAVE BUFFER *********************************************

const csaveBufferSize = 44100 * 5 * 60; // five minutes max

let csaveBuffer;                 // holds the tape audio for generating the WAV file
let csavePtr;                    // points to the write position in the csaveo buffer
let csaveDownSampleCounter;      // counter used to downsample from CPU speed to 48 Khz

let csaving = false;

function csaveAudioSamples(n) {
   csaveDownSampleCounter += (n * 44100);
   if(csaveDownSampleCounter >= cpuSpeed) {
      const s = (cassette_bit_out ? 0.75 : -0.75);
      csaveDownSampleCounter -= cpuSpeed;
      csaveBuffer[csavePtr++] = s;
   }
}

function csave() {
   csavePtr = 0;
   csaveDownSampleCounter = 0;
   csaveBuffer = new Float32Array(csaveBufferSize);
   csaving = true;
   console.log("saving audio (max 5 minutes); use cstop() to stop recording");
}

function cstop() {
   csaving = false;

   // trim silence before and after
   const start = csaveBuffer.indexOf(0.75);
   const end = csaveBuffer.lastIndexOf(0.75);

   const audio = csaveBuffer.slice(start, end);
   const length = Math.round(audio.length / 44100);

   const wavData = {
      sampleRate: 44100,
      channelData: [ audio ]
   };

   const buffer = encodeSync(wavData, { bitDepth: 16, float: false });

   let blob = new Blob([buffer], {type: "application/octet-stream"});
   const fileName = "csaved.wav";
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}" (${length} seconds of audio)`);
}
