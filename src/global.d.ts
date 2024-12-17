declare global {
   function saveAs(blob, name, no_auto_bom?);
   function decodeSync(buffer, opts?);
   let Z80: any;
   var idbKeyval: any;
   function encodeSync(audioData, opts);
}

export {};