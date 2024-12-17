export interface FileInfo {
   name: string;
   buffer: ArrayBuffer
}

function readFile(file: File): Promise<FileInfo> {   
   return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = e => {
         if(e.target!== null && e.target.result !== null && e.target.result instanceof ArrayBuffer) {
            resolve({
               name: file.name,
               buffer: e.target.result,
            });            
         }
      }
      reader.readAsArrayBuffer(file);   
   });
}

export async function readFiles(files: FileList): Promise<FileInfo[]> {
   let result: FileInfo[] = [];
   for(let i=0; i<files.length; i++) {
      result.push(await readFile(files[i]));
   }
   return result;
}
