let keyboard_buffer = [];

function pckey_to_laserkey_ITA(code, key, e) {
   // console.log(code, key, e);

   let laser_keys = [];

   if(e.ctrlKey) laser_keys.push( KEY_CONTROL );

   if(key === "1")             laser_keys.push( KEY_1  );
   if(key === "2")             laser_keys.push( KEY_2  );
   if(key === "3")             laser_keys.push( KEY_3  );
   if(key === "4")             laser_keys.push( KEY_4  );
   if(key === "5")             laser_keys.push( KEY_5  );
   if(key === "6")             laser_keys.push( KEY_6  );
   if(key === "7")             laser_keys.push( KEY_7  );
   if(key === "8")             laser_keys.push( KEY_8  );
   if(key === "9")             laser_keys.push( KEY_9  );
   if(key === "0")             laser_keys.push( KEY_0  );

   if(e.shiftKey) {
      if(code === "KeyQ")         laser_keys.push( KEY_SHIFT, KEY_Q  );
      if(code === "KeyW")         laser_keys.push( KEY_SHIFT, KEY_W  );
      if(code === "KeyE")         laser_keys.push( KEY_SHIFT, KEY_E  );
      if(code === "KeyR")         laser_keys.push( KEY_SHIFT, KEY_R  );
      if(code === "KeyT")         laser_keys.push( KEY_SHIFT, KEY_T  );
      if(code === "KeyY")         laser_keys.push( KEY_SHIFT, KEY_Y  );
      if(code === "KeyU")         laser_keys.push( KEY_SHIFT, KEY_U  );
      if(code === "KeyI")         laser_keys.push( KEY_SHIFT, KEY_I  );
      if(code === "KeyO")         laser_keys.push( KEY_SHIFT, KEY_O  );
      if(code === "KeyP")         laser_keys.push( KEY_SHIFT, KEY_P  );
      if(code === "KeyA")         laser_keys.push( KEY_SHIFT, KEY_A  );
      if(code === "KeyS")         laser_keys.push( KEY_SHIFT, KEY_S  );
      if(code === "KeyD")         laser_keys.push( KEY_SHIFT, KEY_D  );
      if(code === "KeyF")         laser_keys.push( KEY_SHIFT, KEY_F  );
      if(code === "KeyG")         laser_keys.push( KEY_SHIFT, KEY_G  );
      if(code === "KeyH")         laser_keys.push( KEY_SHIFT, KEY_H  );
      if(code === "KeyJ")         laser_keys.push( KEY_SHIFT, KEY_J  );
      if(code === "KeyK")         laser_keys.push( KEY_SHIFT, KEY_K  );
      if(code === "KeyL")         laser_keys.push( KEY_SHIFT, KEY_L  );
      if(code === "KeyZ")         laser_keys.push( KEY_SHIFT, KEY_Z  );
      if(code === "KeyX")         laser_keys.push( KEY_SHIFT, KEY_X  );
      if(code === "KeyC")         laser_keys.push( KEY_SHIFT, KEY_C  );
      if(code === "KeyV")         laser_keys.push( KEY_SHIFT, KEY_V  );
      if(code === "KeyB")         laser_keys.push( KEY_SHIFT, KEY_B  );
      if(code === "KeyN")         laser_keys.push( KEY_SHIFT, KEY_N  );
      if(code === "KeyM")         laser_keys.push( KEY_SHIFT, KEY_M  );
   }
   else {
      if(code === "KeyQ")         laser_keys.push( KEY_Q  );
      if(code === "KeyW")         laser_keys.push( KEY_W  );
      if(code === "KeyE")         laser_keys.push( KEY_E  );
      if(code === "KeyR")         laser_keys.push( KEY_R  );
      if(code === "KeyT")         laser_keys.push( KEY_T  );
      if(code === "KeyY")         laser_keys.push( KEY_Y  );
      if(code === "KeyU")         laser_keys.push( KEY_U  );
      if(code === "KeyI")         laser_keys.push( KEY_I  );
      if(code === "KeyO")         laser_keys.push( KEY_O  );
      if(code === "KeyP")         laser_keys.push( KEY_P  );
      if(code === "KeyA")         laser_keys.push( KEY_A  );
      if(code === "KeyS")         laser_keys.push( KEY_S  );
      if(code === "KeyD")         laser_keys.push( KEY_D  );
      if(code === "KeyF")         laser_keys.push( KEY_F  );
      if(code === "KeyG")         laser_keys.push( KEY_G  );
      if(code === "KeyH")         laser_keys.push( KEY_H  );
      if(code === "KeyJ")         laser_keys.push( KEY_J  );
      if(code === "KeyK")         laser_keys.push( KEY_K  );
      if(code === "KeyL")         laser_keys.push( KEY_L  );
      if(code === "KeyZ")         laser_keys.push( KEY_Z  );
      if(code === "KeyX")         laser_keys.push( KEY_X  );
      if(code === "KeyC")         laser_keys.push( KEY_C  );
      if(code === "KeyV")         laser_keys.push( KEY_V  );
      if(code === "KeyB")         laser_keys.push( KEY_B  );
      if(code === "KeyN")         laser_keys.push( KEY_N  );
      if(code === "KeyM")         laser_keys.push( KEY_M  );
   }

   if(key === "\\")            laser_keys.push( KEY_BACKSLASH  );
   if(key === "|")             laser_keys.push( KEY_SHIFT, KEY_BACKSLASH  );
   if(key === "!")             laser_keys.push( KEY_SHIFT, KEY_1  );
   if(key === '"')             laser_keys.push( KEY_SHIFT, KEY_QUOTE  );
   if(key === "£")             laser_keys.push( KEY_SHIFT, KEY_MU  );
   if(key === "$")             laser_keys.push( KEY_SHIFT, KEY_4  );
   if(key === "%")             laser_keys.push( KEY_SHIFT, KEY_5  );
   if(key === "&")             laser_keys.push( KEY_SHIFT, KEY_7  );
   if(key === "/")             laser_keys.push( KEY_SLASH  );
   if(key === "(")             laser_keys.push( KEY_SHIFT, KEY_9  );
   if(key === ")")             laser_keys.push( KEY_SHIFT, KEY_0  );
   if(key === "=")             laser_keys.push( KEY_EQUAL  );
   if(key === "'")             laser_keys.push( KEY_QUOTE  );
   if(key === "?")             laser_keys.push( KEY_SHIFT, KEY_SLASH  );
   if(key === "^")             laser_keys.push( KEY_SHIFT, KEY_6  );
   if(key === "[")             laser_keys.push( KEY_OPEN_BRACKET  );
   if(key === "]")             laser_keys.push( KEY_CLOSE_BRACKET  );
   if(key === "{")             laser_keys.push( KEY_SHIFT, KEY_OPEN_BRACKET  );
   if(key === "}")             laser_keys.push( KEY_SHIFT, KEY_CLOSE_BRACKET  );
   if(key === "+")             laser_keys.push( KEY_SHIFT, KEY_EQUAL  );
   if(key === "*")             laser_keys.push( KEY_SHIFT, KEY_8  );
   if(key === "@")             laser_keys.push( KEY_SHIFT, KEY_2  );
   if(key === "#")             laser_keys.push( KEY_SHIFT, KEY_3  );
   if(key === "<")             laser_keys.push( KEY_SHIFT, KEY_COMMA  );
   if(key === ">")             laser_keys.push( KEY_SHIFT, KEY_DOT  );
   if(key === ",")             laser_keys.push( KEY_COMMA  );
   if(key === ";")             laser_keys.push( KEY_SEMICOLON  );
   if(key === ".")             laser_keys.push( KEY_DOT  );
   if(key === ":")             laser_keys.push( KEY_SHIFT, KEY_SEMICOLON  );
   if(key === "-")             laser_keys.push( KEY_MINUS  );
   if(key === "_")             laser_keys.push( KEY_SHIFT, KEY_MINUS  );
   if(code === "F1")           laser_keys.push( KEY_F1  );
   if(code === "F2")           laser_keys.push( KEY_F2  );
   if(code === "F3")           laser_keys.push( KEY_F3  );
   if(code === "F4")           laser_keys.push( KEY_F4  );
   if(code === "F5")           laser_keys.push( KEY_F5  );
   if(code === "F6")           laser_keys.push( KEY_F6  );
   if(code === "F7")           laser_keys.push( KEY_F7  );
   if(code === "F8")           laser_keys.push( KEY_F8  );
   if(code === "F9")           laser_keys.push( KEY_F9  );
   if(code === "F10")          laser_keys.push( KEY_F10  );
   if(code === "Insert")       laser_keys.push( KEY_INS  );
   if(code === "Delete")       laser_keys.push( KEY_DEL  );
   if(code === "Escape")       laser_keys.push( KEY_ESC  );
   if(code === "Backspace")    laser_keys.push( KEY_BS  );
   if(code === "End")          laser_keys.push( KEY_DEL_LINE  );
   if(code === "Home")         laser_keys.push( KEY_CLS_HOME  );
   if(code === "Tab")          laser_keys.push( KEY_TAB  );
   if(code === "Enter")        laser_keys.push( KEY_RETURN  );
   if(code === "NumpadEnter")  laser_keys.push( KEY_RETURN  );
   if(code === "ControlLeft")  laser_keys.push( KEY_CONTROL  );
   if(code === "ControlRight") laser_keys.push( KEY_CONTROL  );
   if(code === "ArrowUp")      laser_keys.push( KEY_UP  );
   if(code === "PageUp")       laser_keys.push( KEY_MU  );
   if(code === "PageDown")     laser_keys.push( KEY_GRAPH  );
   if(code === "ArrowLeft")    laser_keys.push( KEY_LEFT  );
   if(code === "ArrowRight")   laser_keys.push( KEY_RIGHT  );
   if(code === "Space")        laser_keys.push( KEY_SPACE  );
   if(code === "ArrowDown")    laser_keys.push( KEY_DOWN  );
   if(code === "CapsLock")     laser_keys.push( KEY_CAP_LOCK );

   return laser_keys;
}


