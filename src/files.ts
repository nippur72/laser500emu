import { mem_write } from "./bus";
import { hex, mem_write_word } from "./bytes";

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
