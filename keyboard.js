const keyboard_matrix = new Uint8Array(13+1); // the hardware key matrix 6x13 rows // 1-based TODO fix
const assign_table = { };                     // conversion table from PC key to Laser key
let browser_keys_state = { };                 // keep track of which PC key was pressed to safe release it

function clearKeyboardMatrix() {
   // temporary hack attemping to solve the shift + key problem when 
   // shift is released before the key
   //console.log(keyboard_matrix);
   keyboard_matrix.forEach((e,i)=>keyboard_matrix[i]=0);   
   //console.log("keyboard cleared");
}

function isPressed(row, col) {
   return ((keyboard_matrix[row] ) & col) === col;
}

function keyPress(row, col) {   
   keyboard_matrix[row] |= col;
}

function keyRelease(row, col) {
   keyboard_matrix[row] &= (~col);
}

function needsShift(pckey) {
   const keyinfo = assign_table[pckey];
   if(keyinfo === undefined) return undefined;
   return keyinfo.shift;
}

function pckey_to_laserkey(pckey) {
   const keyinfo = assign_table[pckey];
   if(keyinfo === undefined) return undefined;
   const laserkey = keys[keyinfo.key];
   return laserkey;
}

function assignKey(pckey, laserkey, lasershift) {
   assign_table[pckey] = { key: laserkey, shift: lasershift };
}

function keyDown(e) { 

   // from Chrome 71 audio is suspended by default and must resume within an user-generated event
   audioContextResume();

   let key = e.key;

   // disable auto repeat, as it is handled on the Laser
   if(e.repeat) {
      e.preventDefault(); 
      return;
   }   

   // *** special (non characters) keys ***

   // RESET key is mapped as ALT+R or CTRL+Break or Pause
   if(key=="Cancel" || key=="Pause" || (e.code == "KeyR" && e.altKey)) {
      cpu.reset();
      is_pasting_text = false;
      e.preventDefault(); 
      return;
   }

   // ALT+P is power OFF/ON
   if(e.code == "KeyP" && e.altKey) {
      power();
      e.preventDefault();
      return;
   }   

   // ALT+Left is rewind tape
   if(e.code == "ArrowLeft" && e.altKey) {
      rewind_tape();
      e.preventDefault(); 
      return;
   }   

   // ALT+Up or ALT+Down is stop tape
   if((e.code == "ArrowUp" && e.altKey) || (e.code == "ArrowDown" && e.altKey)) {
      stop_tape();
      e.preventDefault(); 
      return;
   }   

   // numpad + 0 emulates joystick   
   if(handleJoyStick(e.code, true)) {
      e.preventDefault();
      return;
   }
   
   // remap shift+home into Cls
   if(key==="Home" && e.shiftKey === true) key = "Cls";
   
   const laser_key = pckey_to_laserkey(key);   
   
   // console.log("down",e);

   // unhandled keys
   if(laser_key === undefined) {       
      // if(key !== "Shift" && key !== "AltGraph" && key !== "Alt") {
      //    console.warn(`unhandled key '${key}'`);
      // }
      return;
   }

   // remember PC key pressed              
   browser_keys_state[e.code] = key;
   keyPress(laser_key.row, laser_key.col);

   // does laser key needs shift pressed or unpressed?
   const shift = needsShift(key);      
         if(shift === true)  keyPress(1, 0x40);      
   else if(shift === false) keyRelease(1, 0x40);      

   e.preventDefault();         
}

function keyUp(e) { 
   let key = e.key;

   // remap shift+home into Cls
   if(key==="Home" && e.shiftKey === true) key = "Cls";

   // numpad + 0 emulates joystick   
   if(handleJoyStick(e.code, false)) {
      e.preventDefault();
      return;
   }
   
   // console.log("up",e);

   // browser bug: AltGr + è,ò,à,+ causes Up event different key from Down event
   // but that is handled in this routine as a side effect, so no need to worry about it

   let laser_key = pckey_to_laserkey(key);

   if(laser_key === undefined) return;

   // remembers the key that was originally pressed
   let pressedKey = browser_keys_state[e.code];
   browser_keys_state[e.code] = undefined; // mark it as unpressed

   laser_key = pckey_to_laserkey(pressedKey);
   if(laser_key !== undefined) {
      keyRelease(laser_key.row, laser_key.col); // release key  
      keyRelease(1, 0x40);                      // always release shift
   }
         
   e.preventDefault();
}

const element = document; //.getElementById("canvas");

element.onkeydown = keyDown;
element.onkeyup = keyUp;
