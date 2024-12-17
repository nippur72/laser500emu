// a simplified line printer that prints to the 
// JavaScript console and that's always ready

export class ConsolePrinter {
   printerBuffer: string = "";
   printerReady = 0x00;   
   printerTimeLastReceived = new Date();
   
   // this version prints the whole buffer into one console line, allowing copy & paste
   // print is done if nothing is received from the computer within 2 seconds
   checkPrinterBuffer() {
      const d = (new Date()).valueOf() - this.printerTimeLastReceived.valueOf();
      if(d > 2000 && this.printerBuffer !== "") {
         console.log(this.printerBuffer);
         this.printerBuffer = "";
         return;
      }
      setTimeout(()=>this.checkPrinterBuffer(), 2000);
   }
   
   printerWrite(byte: number) {
      this.printerBuffer += String.fromCharCode(byte & 0xFF);
      this.printerTimeLastReceived = new Date();
      this.checkPrinterBuffer();
   }   
}
