class Serial
{
   constructor() {
      this.recbuf = [];
      this.on_send_to_external = undefined;
   }

   cpu_read_data() {
      if(this.recbuf.length > 0) {
         let ch = this.recbuf[0];
         this.recbuf = this.recbuf.slice(1);
         return ch;
      } else {
         return 0x00; // receive buffer empty
      }
   }

   cpu_read_status() {
      if(this.recbuf.length > 0) {
         return 8+1;
      }
      else {
         return 8;
      }
   }

   cpu_write_data(data) {
      if(this.on_send_to_external !== undefined) {
         this.on_send_to_external(data);
      }
   }

   cpu_write_command(command) {
      // ignored
   }

   receive_from_external(data) {
      this.recbuf.push(data);
   }
}

serial = new Serial();
