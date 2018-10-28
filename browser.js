// handles interaction between browser and emulation 

function onResize(e) {
   const canvas = document.getElementById("canvas");
   const aspect = 1.55;
   if(window.innerWidth > (window.innerHeight*aspect))
   {
      canvas.style.width  = `${aspect*100}vmin`;
      canvas.style.height = "100vmin";
   }
   else if(window.innerWidth > window.innerHeight)
   {
      canvas.style.width  = "100vmax";
      canvas.style.height = `${(1/aspect)*100}vmax`;
   }
   else
   {
      canvas.style.width  = "100vmin";
      canvas.style.height = `${(1/aspect)*100}vmin`;
   }   
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

// **** drag & drop ****

const dropZone = document.getElementById('canvas');

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
   e.stopPropagation();
   e.preventDefault();
   e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', e => {
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
      console.log("WAV file dropped");
      const info = decodeSync(bytes.buffer);
      tapeSampleRate = info.sampleRate;
      console.log(info.channelData);
      tapeBuffer = info.channelData[0];
      tapeLen = tapeBuffer.length;
      tapePtr = 0;
      tapeHighPtr = 0;
      return;
   }

   const dsk = /\.nic$/i;
   if(dsk.test(outName)) {
      drag_drop_disk(outName, bytes);
      load(outName, 1);
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
   console.info("***********************************************************************");   
   console.info("Welcome to the Video Technology Laser 500 emulator");   
   console.info("Please read the instructions at https://github.com/nippur72/laser500emu");
   console.info("***********************************************************************");   
}

function getQueryStringObject() {
   let a = window.location.search.split("&");
   let o = a.reduce((o, v) =>{
      var kv = v.split("=");
      kv[0] = kv[0].replace("?", "");
      o[kv[0]] = kv[1];
      return o;
      },{}
   );
   return o;
}

function parseQueryStringCommands() {
   const cmd = getQueryStringObject();

   if(cmd.load !== undefined) {
      name = cmd.load;      
      fetchProgramAll(name);            
   }
}

async function fetchProgramAll(name) {
   if(await fetchProgram(name)) return;
   if(await fetchProgram(name+".bin")) return;
   if(await fetchProgram(name+"/"+name)) return;
   if(await fetchProgram(name+"/"+name+".bin")) return;

   console.log(`cannot load "${name}": `, err);
}

async function fetchProgram(name)
{
   console.log(`wanting to load ${name}`);
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