const STORAGE_KEY = "laser500";

const idb = idbKeyval;
const store = new idb.Store(STORAGE_KEY, STORAGE_KEY);

async function dir() {
   const keys = await idb.keys(store);
   console.log(keys);   
   keys.forEach(async fn=>{
      const file = await readFile(fn);
      const length = file.length;
      console.log(`${fn} (${length} bytes)`);
   });
}

async function fileExists(filename) {
   return await idb.get(filename, store) !== undefined;
}

async function readFile(fileName) {
   const bytes = await idb.get(fileName, store);   
   return bytes;
}

async function writeFile(fileName, bytes) {  
   await idb.set(fileName, bytes, store);   
}

async function removeFile(fileName) {
   await idb.del(fileName, store);   
}

// *******************************************************************************************

/*
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
*/

async function load(filename, p) {   
   if(!await fileExists(filename)) {
      console.log(`file "${filename}" not found`);
      return;
   }
   
   const ext = filename.substr(-4).toLowerCase();

        if(ext === ".bin") await load_file(filename, p);
   else if(ext === ".dsk") await load_disk(filename, p);
   else if(ext === ".nic") await load_disk(filename, p);
   else if(ext === ".emu") await load_state(filename);
   else console.log("give filename .bin, .dsk or .emu extension");
}

async function save(filename, p1, p2) {
   const ext = filename.substr(-4).toLowerCase();

        if(ext == ".bin") await save_file(filename, p1, p2);
   else if(ext == ".dsk") await save_disk(filename, p1);
   else if(ext == ".nic") await save_disk(filename, p1);
   else if(ext == ".emu") await save_state(filename);
   else console.log("give filename .bin, .dsk or .emu extension");
}

function loadBytes(bytes, address, fileName) {
   const startAddress = (address === undefined) ? 0x8995 : address;
   const end = startAddress + bytes.length - 1;

   for(let i=0,t=startAddress;t<=end;i++,t++) {
      mem_write(t, bytes[i]);
   }

   // modify end of basic program pointer   
   if(startAddress === 0x8995) mem_write_word(0x83E9, end+1);   

   if(fileName === undefined) fileName = "autoload";
   console.log(`loaded "${fileName}" ${bytes.length} bytes from ${hex(startAddress,4)}h to ${hex(end,4)}h`);
}

async function load_file(fileName, address) {   
   const bytes = await readFile(fileName);
   loadBytes(bytes, address, fileName);   
   cpu.reset();   
}

async function save_file(filename, start, end) {
   if(start === undefined) start = mem_read_word(0x8041);
   if(end === undefined) end = mem_read_word(0x83E9)-1;

   const prg = [];
   for(let i=0,t=start; t<=end; i++,t++) {
      prg.push(mem_read(t));
   }
   const bytes = new Uint8Array(prg);
   
   await writeFile(filename, bytes);

   console.log(`saved "${filename}" ${bytes.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
   cpu.reset();
}

async function save_disk(diskname, drive) {      
   if(drive === undefined) drive = 1;
   if(drive < 1 || drive >2) {
      console.log("wrong drive number");
      return;
   }
   const bytes = drives[drive-1].floppy;
   await writeFile(diskname, bytes);
   console.log(`disk in drive ${drive} saved as "${diskname}" (${bytes.length} bytes)`);
   cpu.reset();
}

async function load_disk(diskname, drive) {   
   if(drive === undefined) drive = 1;
   if(drive < 1 || drive >2) {
      console.log("wrong drive number");
      return;
   }
   const bytes = await readFile(diskname);
   drives[drive-1].floppy = bytes;   
   console.log(`disk in drive ${drive} has been loaded with "${diskname}" (${bytes.length} bytes)`);
   cpu.reset();
}

async function remove(filename) {   
   if(await fileExists(filename)) {
      await removeFile(filename);
      console.log(`removed "${filename}"`);
   }
   else {
      console.log(`file "${filename}" not found`);
   }
}

async function download(fileName) {   
   if(!await fileExists(fileName)) {
      console.log(`file "${fileName}" not found`);
      return;
   }
   const bytes = await readFile(fileName);
   let blob = new Blob([bytes], {type: "application/octet-stream"});   
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}"`);
}

function upload(fileName) {
   throw "not impemented";
}
