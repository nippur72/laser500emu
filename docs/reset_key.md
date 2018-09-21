THE RESET KEY IN LASER 500
==========================

The reset key is not like any other key in Laser 500,
instead of being part of the keyboard matrix, it is
directly connected to the CPU reset pin (hence the name 
"reset").

That's why the key is able to bring the user back to
the "Ready" prompt in almost any situation. It gets 
out of any loop the CPU is stucked by simply resetting it.

Resetting the Z80 means the CPU clears all its internal 
registers and begins to execute instructions from 
location $0000 (in the ROM address space). That's what happens
also when you turn on the computer.

But yet pressing the "reset" key does not initializes 
the machine, the BASIC program is not erased, only the 
prompt is brought back. How is that?

The ROM kernel has a trick for knowing whether it's a warm boot
or a cold one.

When initializing, it checks the 16-bit pointer contained in RAM at 
$861D, which should contain the "warm reset" routine. If the bytes 
from this pointer added together plus the constant $E1 matches 
the content of $861F then it's warm reset, and the CPU continues
just from $861D. 

Otherwise, it's assumed the bytes in the pointer are just uninitialized 
RAM random values and thus it's a "cold" start. The constant $E1 is added 
in the sum to avoid zero values of a uninitialized RAM give a false match. 

Part of the "cold" start involves writing the right values in 
the $861D pointer and $861F check byte, so that any successive 
reset will be a "warm" one.

Normally the pointer is initialized with the value $66C8 which is the
actual warm reset routine in the ROM.

To see that:
```
MON
<MON>
861D,861FM

861D: C8  ; $66C8 points to warm reset in ROM
861E: 66  ;
861F: 11  ; calulated as: $66 + $C8 + $E1 = $11 (low byte only)
```

change any of these, press "reset" and the machine will do a cold start.
