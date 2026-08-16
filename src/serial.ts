export class Serial
{
   recbuf: number[] = [];

   // callback installed by the remote host to receive the bytes   
   on_send_callback: (byte: number)=>void = ()=>{};

   read_data_register(): number {
      if(this.recbuf.length > 0) {
         let ch = this.recbuf[0];
         this.recbuf = this.recbuf.slice(1);
         return ch;
      } else {
         return 0x00; // receive buffer empty
      }
   }

   read_status_register(): number {
      let status = 0b10;  // bit 1: transmit ready
      if(this.recbuf.length > 0) {
         status |= 0b01;  // bit 0: receive data ready
      }
      return status;
   }

   write_data_register(data: number): void {
      if(this.on_send_callback !== undefined) {
         this.on_send_callback(data);
      }
   }

   // called by the host (e.g. the BBS bridge) to deliver the incoming
   // bytes from the remote side to the emulated serial port
   receive_from_external(data: number): void {
      this.recbuf.push(data);
   }
}
