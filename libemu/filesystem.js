class BrowserStorage
{
   constructor(key) {
      this.STORAGE_KEY = key;
      this.idb = idbKeyval;
      this.store = new this.idb.Store(this.STORAGE_KEY, this.STORAGE_KEY);

      window.dir      = ()   => this.dir();
      window.remove   = (fn) => this.remove(fn);
      window.download = (fn) => this.download(fn);
      window.upload   = (fn) => this.upload(fn);
   }

   // ===================== private methods ============================================

   async readFile(fileName) {
      const bytes = await this.idb.get(fileName, this.store);
      return bytes;
   }

   async writeFile(fileName, bytes) {
      await this.idb.set(fileName, bytes, this.store);
   }

   async removeFile(fileName) {
      await this.idb.del(fileName, this.store);
   }

   async fileExists(fileName) {
      return await this.idb.get(fileName, this.store) !== undefined;
   }

   // ===================== command line commands ======================================

   async dir() {
      const fileNames = await this.idb.keys(this.store);
      fileNames.forEach(async fn=>{
         const file = await this.readFile(fn);
         const length = file.length;
         console.log(`${fn} (${length} bytes)`);
      });
   }

   async remove(filename) {
      if(await this.fileExists(filename)) {
         await this.removeFile(filename);
         console.log(`removed "${filename}"`);
      }
      else {
         console.log(`file "${filename}" not found`);
      }
   }

   async download(fileName) {
      if(!await this.fileExists(fileName)) {
         console.log(`file "${fileName}" not found`);
         return;
      }
      const bytes = await this.readFile(fileName);
      let blob = new Blob([bytes], {type: "application/octet-stream"});
      saveAs(blob, fileName);
      console.log(`downloaded "${fileName}"`);
   }

   async upload(fileName) {
      throw "not impemented";
   }
}
