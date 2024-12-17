export class Serial
{
   recbuf: number[] = [];
   on_send_to_external: (byte: number)=>void = ()=>{};

   cpu_read_data(): number {
      if(this.recbuf.length > 0) {
         let ch = this.recbuf[0];
         this.recbuf = this.recbuf.slice(1);
         return ch;
      } else {
         return 0x00; // receive buffer empty
      }
   }

   cpu_read_status(): number {
      if(this.recbuf.length > 0) {
         return 8+1;
      }
      else {
         return 8;
      }
   }

   cpu_write_data(data: number): void {
      if(this.on_send_to_external !== undefined) {
         this.on_send_to_external(data);
      }
   }

   cpu_write_command(command) {
      // ignored
   }

   receive_from_external(data: number): void {
      this.recbuf.push(data);
   }
}

