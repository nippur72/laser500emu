// handles interaction between browser and emulation 

function onResize(e) {
   const canvas = document.getElementById("canvas");   
   const mask   = document.getElementById("rgbmask");

   if(window.innerWidth > (window.innerHeight*aspect))
   {
      canvas.style.width  = `${aspect*100}vmin`;
      canvas.style.height = "100vmin";
      mask.style.width  = `${aspect*100}vmin`;
      mask.style.height = "100vmin";
   }
   else if(window.innerWidth > window.innerHeight)
   {
      canvas.style.width  = "100vmax";
      canvas.style.height = `${(1/aspect)*100}vmax`;
      mask.style.width  = "100vmax";
      mask.style.height = `${(1/aspect)*100}vmax`;
   }
   else
   {
      canvas.style.width  = "100vmin";
      canvas.style.height = `${(1/aspect)*100}vmin`;
      mask.style.width  = "100vmin";
      mask.style.height = `${(1/aspect)*100}vmin`;
   }   

   /*
   mask.style.background = `repeating-linear-gradient(90deg, rgba(255,0,0,${rgbmask_opacity}),  rgba(0,255,0,${rgbmask_opacity}), rgba(0,0,255,${rgbmask_opacity}))`;
   mask.style.backgroundSize = `${rgbmask_size}px`;
   */

   const trueHeight = canvas.offsetHeight
   hide_scanlines = (trueHeight < 512);
   buildPalette();
}

function goFullScreen() 
{
        if(canvas.webkitRequestFullscreen !== undefined) canvas.webkitRequestFullscreen();
   else if(canvas.mozRequestFullScreen !== undefined) canvas.mozRequestFullScreen();      
   onResize();
}

window.addEventListener("resize", onResize);
window.addEventListener("dblclick", goFullScreen);

onResize();

// **** save state on close ****

window.onbeforeunload = function(e) {
   saveState();   
 };

// **** visibility change ****

window.addEventListener("visibilitychange", function() {
   if(document.visibilityState === "hidden")
   {
      stopped = true;
      audio.stop();
   }
   else if(document.visibilityState === "visible")
   {
      stopped = false;
      oneFrame();
      audio.start();
   }
});

// **** drag & drop ****

const dropZone = document.getElementById('screen');

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
   e.stopPropagation();
   e.preventDefault();
   e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', e => {
   audio.resume();

   e.stopPropagation();
   e.preventDefault();
   const files = e.dataTransfer.files; // Array of all files

   for(let i=0, file; file=files[i]; i++) {                   
      const reader = new FileReader();      
      reader.onload = e2 => droppedFile(file.name, new Uint8Array(e2.target.result));
      reader.readAsArrayBuffer(file); 
   }
});

function droppedFile(outName, bytes) {   

   const wav = /\.wav$/i;
   if(wav.test(outName)) {
      // WAV files
      //console.log("WAV file dropped");
      const info = decodeSync(bytes.buffer);
      tapeSampleRate = info.sampleRate;
      //console.log(info.channelData);
      tapeBuffer = info.channelData[0];
      tapeLen = tapeBuffer.length;
      tapePtr = 0;
      tapeHighPtr = 0;      

      // CRUN run only if in immediate mode
      if(mem_read_word(0x803f) === 0xffff) pasteLine("CRUN\r\n");
            
      return;
   }

   const dsk = /\.nic$/i;
   if(dsk.test(outName)) {
      drag_drop_disk(outName, bytes);
      load(outName, 1);
      pasteLine("DIR\r\n");
      return;
   }

   const bin = /\.bin$/i;
   if(bin.test(outName)) {     
      writeFile(outName, bytes)
      crun(outName);         
   }
}

// **** welcome message ****

function welcome() {
   console.info(
`Welcome to the Video Technology Laser 500 emulator
Please read the instructions at https://github.com/nippur72/laser500emu`);   
}

function getQueryStringObject(options) {
   let a = window.location.search.split("&");
   let o = a.reduce((o, v) =>{
      var kv = v.split("=");
      const key = kv[0].replace("?", "");
      let value = kv[1];
           if(value === "true") value = true;
      else if(value === "false") value = false;
      o[key] = value;
      return o;
   }, options);
   return o;
}

async function parseQueryStringCommands() {
   options = getQueryStringObject(options);

   if(options.restore !== false) {
      // try to restore previous state, if any
      restoreState();
   }

   /*
   // old version
   if(options.load !== undefined) {
      const name = options.load;      
      fetchProgramAll(name);            
   }
   */

   if(options.load !== undefined) {
      const name = options.load;
      setTimeout(async ()=>{
         if(name.startsWith("http")) {
            // external load
            externalLoad("loadPrg", name);
            pasteLine("RUN\r\n");
         }
         else {
            // internal load
            await fetchProgram(name);
         }
      }, 4000);
   }

   if(options.nodisk === true) {
      emulate_fdc = false;      
   }

   if(options.notapemonitor === true) {
      tape_monitor = false;      
   }

   if(options.keyboard === "ITA") {
      keyboard_ITA = true;
   }   

   if(options.saturation !== undefined) {
           if(options.saturation < 0) saturation = 0;
      else if(options.saturation > 1) saturation = 1;
      else saturation = options.saturation;   
      buildPalette();   
   }

   if(options.charset !== undefined) {
      if(options.charset == "english") charset_offset = 0;
      else if(options.charset == "bincode") charset_offset = 2048;
      else if(options.charset == "german") charset_offset = 4096;
      else if(options.charset == "french") charset_offset = 6144;
      else console.warn(`option charset=${options.charset} not recognized`);
   }

   if(options.bt !== undefined || 
      options.bb !== undefined || 
      options.bh !== undefined || 
      options.aspect !== undefined
   ) {
      if(options.bt     !== undefined) border_top    = Number(options.bt); 
      if(options.bb     !== undefined) border_bottom = Number(options.bb);
      if(options.bh     !== undefined) border_h      = Number(options.bh);
      if(options.aspect !== undefined) aspect        = Number(options.aspect);
      calculateGeometry();
      onResize();
   }

   if(options.rgbmaskopacity !== undefined || options.rgbmasksize !== undefined) {
      if(options.rgbmaskopacity !== undefined) rgbmask_opacity = Number(options.rgbmaskopacity);
      if(options.rgbmasksize    !== undefined) rgbmask_size    = Number(options.rgbmasksize);
      calculateGeometry();
      onResize();
   }
}

/*
async function fetchProgramAll(name) {
   const candidates = [
      name,
      `${name}.bin`,
      `${name}/${name}`,
      `${name}/${name}.bin`,      
      `bin/${name}`,
      `bin/${name}.bin`,
      `bin/${name}/${name}`,
      `bin/${name}/${name}.bin`      
   ];

   for(let t=0;t<candidates.length;t++) {
      if(await fetchProgram(candidates[t])) return;   
   }

   console.log(`cannot load "${name}"`);
}
*/

async function fetchProgram(name)
{
   //console.log(`wanting to load ${name}`);
   try
   {
      const response = await fetch(`software/${name}`);
      if(response.status === 404) return false;
      const bytes = new Uint8Array(await response.arrayBuffer());
      droppedFile(name, bytes);
      return true;
   }
   catch(err)
   {
      return false;      
   }
}

function rewind_tape() {   
   tapePtr = 0;
   tapeHighPtr = 0;
}

function stop_tape() {   
   tapePtr = tapeLen;   
}
