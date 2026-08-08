import { mem_write } from "./bus";
import { mem_write_word, mem_read_word } from "./bytes";
import { keyDown, keyUp } from "./keys";
import { laser500, renderAllLines } from "./emulator";

function evkey(pcKey) {
   const ev = {
      code: pcKey,
      preventDefault: ()=>{}
   };
   return ev;
}

function asciiToKey(c) {
   
   if(c === "1") return { code: "Digit1", shift: false };
   if(c === "2") return { code: "Digit2", shift: false };
   if(c === "3") return { code: "Digit3", shift: false };
   if(c === "4") return { code: "Digit4", shift: false };
   if(c === "5") return { code: "Digit5", shift: false };
   if(c === "6") return { code: "Digit6", shift: false };
   if(c === "7") return { code: "Digit7", shift: false };
   if(c === "8") return { code: "Digit8", shift: false };
   if(c === "9") return { code: "Digit9", shift: false };
   if(c === "0") return { code: "Digit0", shift: false };

   if(c === "!") return { code: "Digit1", shift: true };
   if(c === "@") return { code: "Digit2", shift: true };
   if(c === "#") return { code: "Digit3", shift: true };
   if(c === "$") return { code: "Digit4", shift: true };
   if(c === "%") return { code: "Digit5", shift: true };
   if(c === "^") return { code: "Digit6", shift: true };
   if(c === "&") return { code: "Digit7", shift: true };
   if(c === "*") return { code: "Digit8", shift: true };
   if(c === "(") return { code: "Digit9", shift: true };
   if(c === ")") return { code: "Digit0", shift: true };

   if(c === "-") return { code: "Minus", shift: false };
   if(c === "=") return { code: "Equal", shift: false };
   if(c === "_") return { code: "Minus", shift: true  };
   if(c === "+") return { code: "Equal", shift: true  };

   if(c === "`") return { code: "Backquote", shift: false};
   if(c === "~") return { code: "Backquote", shift: true};

   if(c === "[") return { code: "BracketLeft",  shift: false};
   if(c === "]") return { code: "BracketRight", shift: false};
   if(c === "{") return { code: "BracketLeft",  shift: true};
   if(c === "}") return { code: "BracketRight", shift: true};

   if(c === ";") return { code: "Semicolon", shift: false };
   if(c === ":") return { code: "Semicolon", shift: true  };

   if(c === '"') return { code: "Quote", shift: true};
   if(c === "'") return { code: "Quote", shift: false};

   if(c === "<") return { code: "Comma",  shift: true};
   if(c === ">") return { code: "Period", shift: true};
   if(c === ",") return { code: "Comma",  shift: false};
   if(c === ".") return { code: "Period", shift: false};
   
   if(c === "/") return { code: "Slash", shift: false};   
   if(c === "?") return { code: "Slash", shift: true };
   
   if(c === "£") return { code: "PageUp", shift: true};      

   if(c === "|") return { code: "Backslash", shift: true};
   if(c === "\\") return { code: "Backslash", shift: false};

   if(c === "a") return { code: "KeyA", shift: false};
   if(c === "b") return { code: "KeyB", shift: false};
   if(c === "c") return { code: "KeyC", shift: false};
   if(c === "d") return { code: "KeyD", shift: false};
   if(c === "e") return { code: "KeyE", shift: false};
   if(c === "f") return { code: "KeyF", shift: false};
   if(c === "g") return { code: "KeyG", shift: false};
   if(c === "h") return { code: "KeyH", shift: false};
   if(c === "i") return { code: "KeyI", shift: false};
   if(c === "j") return { code: "KeyJ", shift: false};
   if(c === "k") return { code: "KeyK", shift: false};
   if(c === "l") return { code: "KeyL", shift: false};
   if(c === "m") return { code: "KeyM", shift: false};
   if(c === "n") return { code: "KeyN", shift: false};
   if(c === "o") return { code: "KeyO", shift: false};
   if(c === "p") return { code: "KeyP", shift: false};
   if(c === "q") return { code: "KeyQ", shift: false};
   if(c === "r") return { code: "KeyR", shift: false};
   if(c === "s") return { code: "KeyS", shift: false};
   if(c === "t") return { code: "KeyT", shift: false};
   if(c === "u") return { code: "KeyU", shift: false};
   if(c === "v") return { code: "KeyV", shift: false};
   if(c === "w") return { code: "KeyW", shift: false};
   if(c === "x") return { code: "KeyX", shift: false};
   if(c === "y") return { code: "KeyY", shift: false};
   if(c === "z") return { code: "KeyZ", shift: false};
   
   if(c === "A") return { code: "KeyA", shift: true };
   if(c === "B") return { code: "KeyB", shift: true };
   if(c === "C") return { code: "KeyC", shift: true };
   if(c === "D") return { code: "KeyD", shift: true };
   if(c === "E") return { code: "KeyE", shift: true };
   if(c === "F") return { code: "KeyF", shift: true };
   if(c === "G") return { code: "KeyG", shift: true };
   if(c === "H") return { code: "KeyH", shift: true };
   if(c === "I") return { code: "KeyI", shift: true };
   if(c === "J") return { code: "KeyJ", shift: true };
   if(c === "K") return { code: "KeyK", shift: true };
   if(c === "L") return { code: "KeyL", shift: true };
   if(c === "M") return { code: "KeyM", shift: true };
   if(c === "N") return { code: "KeyN", shift: true };
   if(c === "O") return { code: "KeyO", shift: true };
   if(c === "P") return { code: "KeyP", shift: true };
   if(c === "Q") return { code: "KeyQ", shift: true };
   if(c === "R") return { code: "KeyR", shift: true };
   if(c === "S") return { code: "KeyS", shift: true };
   if(c === "T") return { code: "KeyT", shift: true };
   if(c === "U") return { code: "KeyU", shift: true };
   if(c === "V") return { code: "KeyV", shift: true };
   if(c === "W") return { code: "KeyW", shift: true };
   if(c === "X") return { code: "KeyX", shift: true };
   if(c === "Y") return { code: "KeyY", shift: true };
   if(c === "Z") return { code: "KeyZ", shift: true };

   if(c === " ") return { code: "Space", shift: false };

   if(c === "\n") return { code: "Enter", shift: false };
   
   return undefined;
}

function pasteBasicLine(line) {
   for(let t=0; t<line.length; t++) {
      let char = line.charAt(t);
      if(char === "§") char = "`";  // § is alias for ` to ease pasting from console
      pasteBasicChar(char);
   }
   pasteBasicChar("\n");
}

function pasteBasicChar(char) {
   const old_cursor_pos = mem_read_word(0x85e2);
   const code = asciiToKey(char);
   if(code === undefined) {
      console.warn(`char ${char} not recognized`);
      return;
   }   
   
   if(code.shift) keyDown(evkey("ShiftLeft"));
   keyDown(evkey(code.code));     

   renderAllLines();
   renderAllLines();

   keyUp(evkey(code.code));
   if(code.shift) keyUp(evkey("ShiftLeft"));

   renderAllLines();
   renderAllLines();
}

export function pasteLine(text) {
   // keyboard buffer: 8289-838b  
   // key repeat address: 85F7
   
   for(let t=0;t<text.length;t++) {
      const v = text.charCodeAt(t);
      mem_write(0x8289 + t, v);
   }
   mem_write_word(0x85f7, 0x8289);
   //simulateKey("End");
   laser500.cpu.reset();
}

function pasteLong(str) {
   function pasteQueue(lines) {
      if(lines.length == 0) return;
      let firstline = lines[0];
      lines = lines.slice(1);
      pasteBasicLine(firstline+"\r\n");
      setTimeout(()=>pasteQueue(lines), 500);
   }

   let lines = str.split("\n");
   //lines.forEach(line=>paste(line+"\r\n"));
   pasteQueue(lines);
}

export function pasteBasic(text) {
   const lines = text.split("\n");   
   for(let t=0; t<lines.length; t++) {
      const linea = lines[t];
      console.log(linea);
      pasteBasicLine(linea);      
   }
   console.log("pasted!");   
}
