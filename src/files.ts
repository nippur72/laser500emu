import { mem_read, mem_write } from "./bus";
import { hex, mem_read_word, mem_write_word, uint8ToString } from "./bytes";
import { drives } from "./floppy";
import { laser500, pasteBasic, storage } from "./emulator";

export async function load(filename: string, p?) {
    if(!await storage.fileExists(filename)) {
       console.log(`file "${filename}" not found`);
       return;
    }

    const ext = filename.substr(-4).toLowerCase();

         if(ext === ".bin") await load_bin(filename, p);
    else if(ext === ".nic") await load_disk(filename, p);
    else if(ext === ".bas") await load_bas(filename);    
    else console.log("allowed extensions are: .bin, .nic, .bas");
}

/*
async function save(filename, p1, p2) {
    const ext = filename.substr(-4).toLowerCase();

         if(ext == ".bin") await save_file(filename, p1, p2);    
    else if(ext == ".nic") await save_disk(filename, p1);    
    else console.log("allowed extensions are: .bin, .nic");
}
*/

export function loadBytes(bytes: number[], address?: number, fileName?: string) {
    const startAddress = (address === undefined) ? 0x8995 : address;
    const endAddress = startAddress + bytes.length - 1;

    for(let i=0,t=startAddress;t<=endAddress;i++,t++) {
       mem_write(t, bytes[i]);
    }

    // modify end of basic program pointer
    if(startAddress === 0x8995) mem_write_word(0x83E9, endAddress+1);

    if(fileName === undefined) fileName = "autoload";
    console.log(`loaded "${fileName}" ${bytes.length} bytes from ${hex(startAddress,4)}h to ${hex(endAddress,4)}h`);
}

async function load_bin(fileName, address) {
    const bytes = await storage.readFile(fileName);
    loadBytes(bytes, address, fileName);
    laser500.cpu.reset();
}

async function save_file(filename, start, end) {
    if(start === undefined) start = mem_read_word(0x8041);
    if(end === undefined) end = mem_read_word(0x83E9)-1;

    const prg: number[] = [];
    for(let i=0,t=start; t<=end; i++,t++) {
       prg.push(mem_read(t));
    }
    const bytes = new Uint8Array(prg);

    await storage.writeFile(filename, bytes);

    console.log(`saved "${filename}" ${bytes.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
    laser500.cpu.reset();
}

async function save_disk(diskname, drive) {
    if(drive === undefined) drive = 1;
    if(drive < 1 || drive >2) {
       console.log("wrong drive number");
       return;
    }
    const bytes = drives[drive-1].floppy;
    await storage.writeFile(diskname, bytes);
    console.log(`disk in drive ${drive} saved as "${diskname}" (${bytes.length} bytes)`);
    laser500.cpu.reset();
}

async function load_disk(diskname, drive) {
    if(drive === undefined) drive = 1;
    if(drive < 1 || drive >2) {
       console.log("wrong drive number");
       return;
    }
    const bytes = await storage.readFile(diskname);
    drives[drive-1].floppy = bytes;
    console.log(`disk in drive ${drive} has been loaded with "${diskname}" (${bytes.length} bytes)`);
    laser500.cpu.reset();
}

async function load_bas(fileName: string) {
    const bytes = await storage.readFile(fileName);
    const text = uint8ToString(bytes);
    pasteBasic(text);
}
