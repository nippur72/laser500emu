export class Audio {
   AUDIO_BUFSIZE: number;
   playing: boolean;
   buffers: Float32Array[];
   audioContext: AudioContext;
   sampleRate: number;
   speakerSound: ScriptProcessorNode;

   constructor(bufsize: number) {
      this.AUDIO_BUFSIZE = bufsize;  // must match psg.c
      this.playing = false;
      this.buffers = [];
      this.audioContext = new window.AudioContext({ latencyHint: 'interactive' });
      this.sampleRate = this.audioContext.sampleRate;
      this.speakerSound = this.audioContext.createScriptProcessor(this.AUDIO_BUFSIZE, 1, 1);

      this.speakerSound.onaudioprocess = (e) => {
         const output = e.outputBuffer.getChannelData(0);

         if(this.buffers.length === 0) {
            output.fill(0);
            return;
         }
         else if(this.buffers.length > 3) {
            // Keep only the most recent buffer to minimize latency
            this.buffers = this.buffers.slice(-1);
         }

         const buffer = this.buffers[0];
         this.buffers = this.buffers.slice(1);

         for(let i=0; i<this.AUDIO_BUFSIZE; i++) {
            output[i] = buffer[i];
         }
      }
   }

   playBuffer(buffer: Float32Array) {
      if(!this.playing) return;
      const clone = new Float32Array(buffer); // push a cloned copy
      this.buffers.push(clone);  
   }

   start() {
      this.speakerSound.connect(this.audioContext.destination);
      this.playing = true;
      this.buffers = [];
   }

   stop() {
      this.speakerSound.disconnect(this.audioContext.destination);
      this.playing = false;
   }

   resume() {
      if(this.audioContext.state === 'suspended') {
         this.audioContext.resume().then(() => {
            this.buffers = [];
            // console.log('sound playback resumed successfully');
         });
      }
   }
}
