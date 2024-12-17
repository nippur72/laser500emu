import { cpuSpeed, laser500 } from "./emulator";

const csaveBufferSize = 44100 * 5 * 60; // five minutes max

export class Tape {
   tapeFileName = "";
   tapeSampleRate = 0;
   tapeBuffer = new Float32Array(0);
   tapeLen = 0;
   tapePtr = 0;
   tapeHighPtr = 0;   

   csaveBuffer = new Float32Array(0);   // holds the tape audio for generating the WAV file
   csavePtr = 0;                        // points to the write position in the csaveo buffer
   csaveDownSampleCounter = 0;          // counter used to downsample from CPU speed to 48 Khz

   isPlaying() {
      return this.tapePtr < this.tapeLen && this.tapeLen !== 0;
   }

   stopPlay() {
      this.tapeSampleRate = 0;
      this.tapeBuffer = new Float32Array(0);
      this.tapeLen = 0;
      this.tapePtr = 0;
      this.tapeHighPtr = 0;
   }

   reset() {
      this.stopPlay();

      this.csaveBuffer = new Float32Array(0);
      this.csavePtr = 0;
      this.csaveDownSampleCounter = 0;
  }
   
   cloadAudioSamples(n: number) {
      if(this.tapePtr >= this.tapeLen) {
         laser500.cassette_bit_in = 1;
         return;
      }

      this.tapeHighPtr += (n*this.tapeSampleRate);
      if(this.tapeHighPtr >= cpuSpeed) {
         this.tapeHighPtr-=cpuSpeed;
         laser500.cassette_bit_in = this.tapeBuffer[this.tapePtr] > 0 ? 1 : 0;
         this.tapePtr++;
      }
   }

   csaveAudioSamples(n: number) {
      this.csaveDownSampleCounter += (n * 44100);
      if(this.csaveDownSampleCounter >= cpuSpeed) {
         const s = (laser500.cassette_bit_out ? 0.75 : -0.75);
         this.csaveDownSampleCounter -= cpuSpeed;
         this.csaveBuffer[this.csavePtr++] = s;
      }
   }

   csave() {
      this.csavePtr = 0;
      this.csaveDownSampleCounter = 0;
      this.csaveBuffer = new Float32Array(csaveBufferSize);
      laser500.csaving = true;
      console.log("saving audio (max 5 minutes); use cstop() to stop recording");
   }

   cstop() {
      laser500.csaving = false;

      // trim silence before and after
      const start = this.csaveBuffer.indexOf(0.75);
      const end = this.csaveBuffer.lastIndexOf(0.75);

      const audio = this.csaveBuffer.slice(start, end);
      const length = Math.round(audio.length / 44100);

      const wavData = {
         sampleRate: 44100,
         channelData: [ audio ]
      };

      const buffer = encodeSync(wavData, { bitDepth: 16, float: false });

      let blob = new Blob([buffer], {type: "application/octet-stream"});
      const fileName = "tape_recording.wav";
      saveAs(blob, fileName);
      console.log(`downloaded "${fileName}" (${length} seconds of audio)`);
   }

   load_wav_file(fileName: string, bytes: ArrayBuffer) {
      const info = decodeSync(bytes);
      const sampleRate = info.sampleRate;
      const buffer = info.channelData[0];

      this.tapeFileName = fileName;
      this.tapeSampleRate = sampleRate;      
      this.tapeBuffer = buffer;
      this.tapeLen = buffer.length;
      this.tapePtr = 0;
      this.tapeHighPtr = 0;      
      console.log(`loaded "${fileName}" (${this.tapeLen} samples)`);
   }
}

