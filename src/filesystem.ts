import * as idbKeyval from "idb-keyval";
import { saveAs } from "./save-file";

export class BrowserStorage
{
   STORAGE_KEY: string;
   idb: typeof idbKeyval;
   store: any;

   constructor(key) {
      this.STORAGE_KEY = key;
      this.idb = idbKeyval;
      this.store = new this.idb.Store(this.STORAGE_KEY, this.STORAGE_KEY);
   }

   // ===================== private methods ============================================

   async readFile(fileName: string): Promise<any> {
      const bytes = await this.idb.get(fileName, this.store);
      return bytes;
   }

   async writeFile(fileName: string, bytes: any): Promise<void> {
      await this.idb.set(fileName, bytes, this.store);
   }

   async removeFile(fileName: string): Promise<void> {
      await this.idb.del(fileName, this.store);
   }

   async fileExists(fileName: string): Promise<boolean> {
      return await this.idb.get(fileName, this.store) !== undefined;
   }

   // ===================== command line commands ======================================

   async dir(): Promise<void> {
      const fileNames = await this.idb.keys(this.store);
      fileNames.forEach(async fn=>{
         const file = await this.readFile(fn as string);
         const length = file.length;
         console.log(`${fn} (${length} bytes)`);
      });
   }

   async remove(filename: string): Promise<void> {
      if(await this.fileExists(filename)) {
         await this.removeFile(filename);
         console.log(`removed "${filename}"`);
      }
      else {
         console.log(`file "${filename}" not found`);
      }
   }

   async download(fileName: string): Promise<void> {
      if(!await this.fileExists(fileName)) {
         console.log(`file "${fileName}" not found`);
         return;
      }
      const bytes = await this.readFile(fileName);
      let blob = new Blob([bytes], {type: "application/octet-stream"});
      saveAs(blob, fileName);
      console.log(`downloaded "${fileName}"`);
   }

   async upload(fileName: string): Promise<void> {
      throw "not impemented";
   }
}
