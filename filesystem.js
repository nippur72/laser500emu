const STORAGE_KEY = "laser500";

function getStore() {
   const store = window.localStorage.getItem(STORAGE_KEY);
   if(store === undefined || store === null) return {};
   let ob = {};
   try 
   {
      ob = JSON.parse(store);
   }
   catch(ex) 
   {
   }
   return ob;
}

function setStore(store) {
   window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function load(filename, p) {   
   if(!fileExists(filename)) {
      console.log(`file "${filename}" not found`);
      return;
   }

        if(endsWith(filename,".bin")) load_file(filename, p);
   else if(endsWith(filename,".dsk")) load_disk(filename, p);
   else if(endsWith(filename,".emu")) load_state(filename);
}

function save(filename, p1, p2) {
        if(endsWith(filename,".bin")) save_file(filename, p1, p2);
   else if(endsWith(filename,".dsk")) save_disk(filename, p1);
   else if(endsWith(filename,".emu")) save_state(filename);
   else console.log("give filename .bin, .dsk or .emu extension");
}

function load_file(filename, address) {   
   const bytes = readFile(filename);

   const startAddress = (address === undefined) ? 0x8995 : address;
   const end = startAddress + bytes.length - 1;

   for(let i=0,t=startAddress;t<=end;i++,t++) {
      mem_write(t, bytes[i]);
   }

   // modify end of basic program pointer   
   if(startAddress === 0x8995) mem_write_word(0x83E9, end+1);   

   console.log(`loaded "${filename}" ${bytes.length} bytes from ${hex(startAddress,4)}h to ${hex(end,4)}h`);
   cpu.reset();   
}

function save_file(filename, start, end) {
   if(start === undefined) start = mem_read_word(0x8041);
   if(end === undefined) end = mem_read_word(0x83E9)-1;

   const prg = [];
   for(let i=0,t=start; t<=end; i++,t++) {
      prg.push(mem_read(t));
   }
   const bytes = new Uint8Array(prg);
   
   writeFile(filename, bytes);

   console.log(`saved "${filename}" ${bytes.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
   cpu.reset();
}

function save_disk(diskname, drive) {   
   if(drive === undefined) drive = 1;
   const bytes = drives[drive-1].floppy;
   writeFile(diskname, bytes);
   console.log(`disk in drive ${drive} saved as "${diskname}" (${bytes.length} bytes)`);
   cpu.reset();
}

function load_disk(diskname, drive) {   
   if(drive === undefined) drive = 1;
   const bytes = readFile(diskname);
   console.log(bytes);
   drives[drive-1].floppy = bytes;   
   console.log(`disk in drive ${drive} has been loaded with "${diskname}" (${bytes.length} bytes)`);
   cpu.reset();
}

function remove(filename) {   
   if(fileExists(filename)) {
      removeFile(filename);
      console.log(`removed "${filename}"`);
   }
   else {
      console.log(`file "${filename}" not found`);
   }
}

function dir() {
   const keys = Object.keys(getStore());   
   keys.forEach(fn=>console.log(`${fn} (${readFile(fn).length} bytes)`));
}

function download(fileName) {   
   if(!fileExists(fileName)) {
      console.log(`file "${filename}" not found`);
      return;
   }
   const bytes = readFile(fileName);
   let blob = new Blob([bytes], {type: "application/octet-stream"});   
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}"`);
}

function upload(fileName) {
   throw "not impemented";
}

function fileExists(filename) {
   const ob = getStore();
   return ob[filename] !== undefined;
}

function readFile(fileName) {
   const program = getStore()[fileName];   
   const size = program.length / 2;
   const bytes = new Uint8Array(size);

   for(let t=0,j=0;t<program.length;t+=2,j++) {
      const hexcode = program.substr(t,2);
      bytes[j] = parseInt(hexcode, 16);
   }
   return bytes;
}

function writeFile(fileName, bytes) {  
   let s = "";
   for(let t=0;t<bytes.length;t++) {
      s+=hex(bytes[t]);
   }
   const store = getStore();
   store[fileName] = s;
   setStore(store);
}

function removeFile(fileName) {
   const store = getStore();
   delete store[fileName];
   setStore(store);
}
