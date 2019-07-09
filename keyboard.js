const keyboard_matrix = new Uint8Array(13); 

function keyPress(row, col) {   
   keyboard_matrix[row] |= col;
}

function keyRelease(row, col) {
   keyboard_matrix[row] &= (~col);
}

function pckey_to_laserkey(pckey) {
   let laser_key;   
   
   if(pckey === "F1")  laser_key = KEY_F1 ; 
   if(pckey === "F2")  laser_key = KEY_F2 ; 
   if(pckey === "F3")  laser_key = KEY_F3 ; 
   if(pckey === "F4")  laser_key = KEY_F4 ; 
   if(pckey === "F5")  laser_key = KEY_F5 ; 
   if(pckey === "F6")  laser_key = KEY_F6 ; 
   if(pckey === "F7")  laser_key = KEY_F7 ; 
   if(pckey === "F8")  laser_key = KEY_F8 ; 
   if(pckey === "F9")  laser_key = KEY_F9 ; 
   if(pckey === "F10") laser_key = KEY_F10; 

   if(pckey === "Insert") laser_key = KEY_INS; 
   if(pckey === "Delete") laser_key = KEY_DEL; 
   if(pckey === "Escape") laser_key = KEY_ESC; 

   if(pckey === "Digit1") laser_key = KEY_1; 
   if(pckey === "Digit2") laser_key = KEY_2; 
   if(pckey === "Digit3") laser_key = KEY_3; 
   if(pckey === "Digit4") laser_key = KEY_4; 
   if(pckey === "Digit5") laser_key = KEY_5; 
   if(pckey === "Digit6") laser_key = KEY_6; 
   if(pckey === "Digit7") laser_key = KEY_7; 
   if(pckey === "Digit8") laser_key = KEY_8; 
   if(pckey === "Digit9") laser_key = KEY_9; 
   if(pckey === "Digit0") laser_key = KEY_0; 

   if(pckey === "Minus")     laser_key = KEY_MINUS; 
   if(pckey === "Equal")     laser_key = KEY_EQUAL; 
   if(pckey === "Backspace") laser_key = KEY_BS;    

   if(pckey === "End")  laser_key = KEY_DEL_LINE; 
   if(pckey === "Home") laser_key = KEY_CLS_HOME; 
   if(pckey === "Tab")  laser_key = KEY_TAB; 

   if(pckey === "KeyQ") laser_key = KEY_Q; 
   if(pckey === "KeyW") laser_key = KEY_W; 
   if(pckey === "KeyE") laser_key = KEY_E; 
   if(pckey === "KeyR") laser_key = KEY_R; 
   if(pckey === "KeyT") laser_key = KEY_T; 
   if(pckey === "KeyY") laser_key = KEY_Y; 
   if(pckey === "KeyU") laser_key = KEY_U; 
   if(pckey === "KeyI") laser_key = KEY_I; 
   if(pckey === "KeyO") laser_key = KEY_O; 
   if(pckey === "KeyP") laser_key = KEY_P; 

   if(pckey === "BracketLeft")  laser_key = KEY_OPEN_BRACKET; 
   if(pckey === "BracketRight") laser_key = KEY_CLOSE_BRACKET; 
   if(pckey === "Enter")        laser_key = KEY_RETURN; 
   if(pckey === "NumpadEnter")        laser_key = KEY_RETURN; 
   if(pckey === "ControlLeft")  laser_key = KEY_CONTROL; 
   if(pckey === "ControlRight") laser_key = KEY_CONTROL; 

   if(pckey === "KeyA") laser_key = KEY_A; 
   if(pckey === "KeyS") laser_key = KEY_S; 
   if(pckey === "KeyD") laser_key = KEY_D; 
   if(pckey === "KeyF") laser_key = KEY_F; 
   if(pckey === "KeyG") laser_key = KEY_G; 
   if(pckey === "KeyH") laser_key = KEY_H; 
   if(pckey === "KeyJ") laser_key = KEY_J; 
   if(pckey === "KeyK") laser_key = KEY_K; 
   if(pckey === "KeyL") laser_key = KEY_L; 

   if(pckey === "Semicolon") laser_key = KEY_SEMICOLON; 
   if(pckey === "Quote")     laser_key = KEY_QUOTE; 
   if(pckey === "Backquote") laser_key = KEY_BACK_QUOTE; 
   if(pckey === "Backslash") laser_key = KEY_BACKSLASH; 
   
   if(pckey === "ArrowUp") laser_key = KEY_UP; 
   if(pckey === "ShiftLeft")  laser_key = KEY_SHIFT; 
   if(pckey === "ShiftRight") laser_key = KEY_SHIFT; 

   if(pckey === "KeyZ") laser_key = KEY_Z;
   if(pckey === "KeyX") laser_key = KEY_X;
   if(pckey === "KeyC") laser_key = KEY_C;
   if(pckey === "KeyV") laser_key = KEY_V;
   if(pckey === "KeyB") laser_key = KEY_B;
   if(pckey === "KeyN") laser_key = KEY_N;
   if(pckey === "KeyM") laser_key = KEY_M;

   if(pckey === "Comma")  laser_key = KEY_COMMA; 
   if(pckey === "Period") laser_key = KEY_DOT;   
   if(pckey === "Slash")  laser_key = KEY_SLASH; 

   if(pckey === "PageUp")   laser_key = KEY_MU; 
   if(pckey === "PageDown") laser_key = KEY_GRAPH;

   if(pckey === "ArrowLeft")  laser_key = KEY_LEFT; 
   if(pckey === "ArrowRight") laser_key = KEY_RIGHT; 
   if(pckey === "CapsLock")   laser_key = KEY_CAP_LOCK; 
   if(pckey === "Space")      laser_key = KEY_SPACE; 
   if(pckey === "ArrowDown")  laser_key = KEY_DOWN; 

   if(laser_key === undefined) {
      //console.log(pckey);
      return undefined;
   }
   
   return keys[laser_key];
}

function keyDown(e) { 

   // from Chrome 71 audio is suspended by default and must resume within an user-generated event
   audioContextResume();   

   // disable auto repeat, as it is handled on the Laser
   if(e.repeat) {
      e.preventDefault(); 
      return;
   }   

   // *** special (non characters) keys ***   

   // RESET key is mapped as ALT+R or CTRL+Break or Pause
   if(e.key=="Cancel" || e.key=="Pause" || (e.code == "KeyR" && e.altKey)) {
      cpu.reset();      
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

   /*
   // disabled feature: sync laser caps lock state with PC caps lock state
   if(e.code === "Capslock") return;
   else 
   {
      const pc_capslock = event.getModifierState("CapsLock");
      const laser_capslock = (mem_read(0x85FB) & 8) > 0;
      //console.log(`pc=${pc_capslock} laser=${laser_capslock}`);
      if(pc_capslock != laser_capslock) {
         let loc = mem_read(0x85FB) & (255-8);
         mem_write(0x85FB, loc | (pc_capslock ? 8 : 0));
      }
   }
   */
   
   
   // remap shift+home into Cls
   const laser_key = pckey_to_laserkey(e.code);   
   
   // unhandled keys
   if(laser_key === undefined) {       
      // if(key !== "Shift" && key !== "AltGraph" && key !== "Alt") {
      //    console.warn(`unhandled key '${key}'`);
      // }
      return;
   }

   // do the keypress on the laser keyboard matrix
   keyPress(laser_key.row, laser_key.col);   

   e.preventDefault();         
}

function keyUp(e) { 

   // numpad + 0 emulates joystick   
   if(handleJoyStick(e.code, false)) {
      e.preventDefault();
      return;
   }

   const laser_key = pckey_to_laserkey(e.code);

   if(laser_key === undefined) return;

   keyRelease(laser_key.row, laser_key.col); 
         
   e.preventDefault();
}

// connect DOM events
const element = document; 
element.onkeydown = keyDown;
element.onkeyup = keyUp;

/*

***** OLD CODE FOR NATURAL ITALIAN KEYBOARD (BUGGED) *****

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

   console.log(e);

   // RESET key is mapped as ALT+R or CTRL+Break or Pause
   if(key=="Cancel" || key=="Pause" || (e.code == "KeyR" && e.altKey)) {
      cpu.reset();      
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
   console.log(key);
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
        if(shift === true) keyPress(ROW0, 0x40);      
   else if(shift === false) keyRelease(ROW0, 0x40);      

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
      keyRelease(ROW0, 0x40);                   // always release shift      
   }
         
   e.preventDefault();
}

const element = document; //.getElementById("canvas");

element.onkeydown = keyDown;
element.onkeyup = keyUp;
*/
