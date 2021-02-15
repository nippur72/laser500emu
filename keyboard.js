
// this is the original keyboard mapping
function pckey_to_laserkey_EN(code, key) {
   let laser_keys = [];
   
   if(code === "F1")           laser_keys.push( KEY_F1 );
   if(code === "F2")           laser_keys.push( KEY_F2 );
   if(code === "F3")           laser_keys.push( KEY_F3 );
   if(code === "F4")           laser_keys.push( KEY_F4 );
   if(code === "F5")           laser_keys.push( KEY_F5 );
   if(code === "F6")           laser_keys.push( KEY_F6 );
   if(code === "F7")           laser_keys.push( KEY_F7 );
   if(code === "F8")           laser_keys.push( KEY_F8 );
   if(code === "F9")           laser_keys.push( KEY_F9 );
   if(code === "F10")          laser_keys.push( KEY_F10 );
   if(code === "Insert")       laser_keys.push( KEY_INS );
   if(code === "Delete")       laser_keys.push( KEY_DEL );
   if(code === "Escape")       laser_keys.push( KEY_ESC );
   if(code === "Digit1")       laser_keys.push( KEY_1 );
   if(code === "Digit2")       laser_keys.push( KEY_2 );
   if(code === "Digit3")       laser_keys.push( KEY_3 );
   if(code === "Digit4")       laser_keys.push( KEY_4 );
   if(code === "Digit5")       laser_keys.push( KEY_5 );
   if(code === "Digit6")       laser_keys.push( KEY_6 );
   if(code === "Digit7")       laser_keys.push( KEY_7 );
   if(code === "Digit8")       laser_keys.push( KEY_8 );
   if(code === "Digit9")       laser_keys.push( KEY_9 );
   if(code === "Digit0")       laser_keys.push( KEY_0 );
   if(code === "Minus")        laser_keys.push( KEY_MINUS );
   if(code === "Equal")        laser_keys.push( KEY_EQUAL );
   if(code === "Backspace")    laser_keys.push( KEY_BS );
   if(code === "End")          laser_keys.push( KEY_DEL_LINE );
   if(code === "Home")         laser_keys.push( KEY_CLS_HOME );
   if(code === "Tab")          laser_keys.push( KEY_TAB );
   if(code === "KeyQ")         laser_keys.push( KEY_Q );
   if(code === "KeyW")         laser_keys.push( KEY_W );
   if(code === "KeyE")         laser_keys.push( KEY_E );
   if(code === "KeyR")         laser_keys.push( KEY_R );
   if(code === "KeyT")         laser_keys.push( KEY_T );
   if(code === "KeyY")         laser_keys.push( KEY_Y );
   if(code === "KeyU")         laser_keys.push( KEY_U );
   if(code === "KeyI")         laser_keys.push( KEY_I );
   if(code === "KeyO")         laser_keys.push( KEY_O );
   if(code === "KeyP")         laser_keys.push( KEY_P );
   if(code === "BracketLeft")  laser_keys.push( KEY_OPEN_BRACKET );
   if(code === "BracketRight") laser_keys.push( KEY_CLOSE_BRACKET );
   if(code === "Enter")        laser_keys.push( KEY_RETURN );
   if(code === "NumpadEnter")  laser_keys.push( KEY_RETURN );
   if(code === "ControlLeft")  laser_keys.push( KEY_CONTROL );
   if(code === "ControlRight") laser_keys.push( KEY_CONTROL );
   if(code === "KeyA")         laser_keys.push( KEY_A );
   if(code === "KeyS")         laser_keys.push( KEY_S );
   if(code === "KeyD")         laser_keys.push( KEY_D );
   if(code === "KeyF")         laser_keys.push( KEY_F );
   if(code === "KeyG")         laser_keys.push( KEY_G );
   if(code === "KeyH")         laser_keys.push( KEY_H );
   if(code === "KeyJ")         laser_keys.push( KEY_J );
   if(code === "KeyK")         laser_keys.push( KEY_K );
   if(code === "KeyL")         laser_keys.push( KEY_L );
   if(code === "Semicolon")    laser_keys.push( KEY_SEMICOLON );
   if(code === "Quote")        laser_keys.push( KEY_QUOTE );
   if(code === "Backquote")    laser_keys.push( KEY_BACK_QUOTE );
   if(code === "Backslash")    laser_keys.push( KEY_BACKSLASH );
   if(code === "ArrowUp")      laser_keys.push( KEY_UP );
   if(code === "ShiftLeft")    laser_keys.push( KEY_SHIFT );
   if(code === "ShiftRight")   laser_keys.push( KEY_SHIFT );
   if(code === "KeyZ")         laser_keys.push( KEY_Z );
   if(code === "KeyX")         laser_keys.push( KEY_X );
   if(code === "KeyC")         laser_keys.push( KEY_C );
   if(code === "KeyV")         laser_keys.push( KEY_V );
   if(code === "KeyB")         laser_keys.push( KEY_B );
   if(code === "KeyN")         laser_keys.push( KEY_N );
   if(code === "KeyM")         laser_keys.push( KEY_M );
   if(code === "Comma")        laser_keys.push( KEY_COMMA );
   if(code === "Period")       laser_keys.push( KEY_DOT );
   if(code === "Slash")        laser_keys.push( KEY_SLASH );
   if(code === "PageUp")       laser_keys.push( KEY_MU );
   if(code === "PageDown")     laser_keys.push( KEY_GRAPH );
   if(code === "ArrowLeft")    laser_keys.push( KEY_LEFT );
   if(code === "ArrowRight")   laser_keys.push( KEY_RIGHT );
   if(code === "CapsLock")     laser_keys.push( KEY_CAP_LOCK );
   if(code === "Space")        laser_keys.push( KEY_SPACE );
   if(code === "ArrowDown")    laser_keys.push( KEY_DOWN );

   return laser_keys;
}

function keyDown(e) { 

   // from Chrome 71 audio is suspended by default and must resume within an user-generated event
   audio.resume();

   // disable auto repeat, as it is handled on the Laser
   if(e.repeat) {
      e.preventDefault(); 
      return;
   }   

   // *** special (non characters) keys ***   

   // RESET key is mapped as ALT+R, CTRL+Break or Pause
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

   if(!keyboard_ITA) {
      const laser_keys = pckey_to_laserkey_EN(e.code, e.key);
      if(laser_keys.length  === 0) return;
      laser_keys.forEach((k) => keyPress(k));
      e.preventDefault();
   }
   else {
      const laser_keys = pckey_to_laserkey_ITA(e.code, e.key, e);
      if(laser_keys.length === 0) return;
      keyboardReset();
      laser_keys.forEach((k) => keyPress(k));
      e.preventDefault();
   }
}

function keyUp(e) { 

   // numpad + 0 emulates joystick   
   if(handleJoyStick(e.code, false)) {
      e.preventDefault();
      return;
   }

   // do the keypress on the laser keyboard matrix
   if(!keyboard_ITA) {
      const laser_keys = pckey_to_laserkey_EN(e.code, e.key);
      if(laser_keys.length === 0) return;
      laser_keys.forEach((k) => keyRelease(k));
      e.preventDefault();
   } else {
      const laser_keys = pckey_to_laserkey_ITA(e.code, e.key, e);
      if(laser_keys.length === 0) return;
      keyboardReset();
      //laser_keys.forEach((k) => keyRelease(k));
      e.preventDefault();
   }
}

// connect DOM events
const element = document; 
element.onkeydown = keyDown;
element.onkeyup = keyUp;

