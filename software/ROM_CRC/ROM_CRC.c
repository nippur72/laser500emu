#include <stdio.h>

// #region this was taken from http://home.thep.lu.se/~bjorn/crc/

/* Simple public domain implementation of the standard CRC32 checksum.
 * Outputs the checksum for each file given as a command line argument.
 * Invalid file names and files that cause errors are silently skipped.
 * The program reads from stdin if it is called with no arguments. */

unsigned long int crc32_for_byte(unsigned long int r) {
  for(int j = 0; j < 8; ++j)
    r = (r & 1? 0: (unsigned long int)0xEDB88320L) ^ r >> 1;
  return r ^ (unsigned long int)0xFF000000L;
}

void crc32(const void *data, unsigned long int n_bytes, unsigned long int* crc) {
  static unsigned long int table[0x100];
  if(!*table)
    for(size_t i = 0; i < 0x100; ++i)
      table[i] = crc32_for_byte(i);
  for(size_t i = 0; i < n_bytes; ++i)
    *crc = table[(unsigned char)*crc ^ ((unsigned char*)data)[i]] ^ *crc >> 8;
}

// #endregion 

int main() {   
   printf("CALCULATING 32K ROM CRC32...\n\n");   
   unsigned long int crc = 0;
   crc32(0,0x8000, &crc);   
   printf("CRC: %08lx\n", crc);

   if(crc == 0x9bed01f7) {
      printf("\nROM IS OK, IT'S THE STANDARD ONE!\n");
   }
   else {
      printf("\nROM IS DIFFERENT\n");
   }
}
