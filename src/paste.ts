import { mem_read, mem_write } from "./bus";
import { mem_read_word, bit, set_bit, reset_bit } from "./bytes";
import { keyDown, keyUp } from "./keys";
import { laser500, renderAllLines } from "./emulator";

export function evkey(pcKey: string) {
   const ev = {
      code: pcKey,
      preventDefault: () => {}
   };
   return ev;
}

/**
 * Gets the key sound / beep state from memory location 0x85FA bit 3.
 * (0 = key beep on, 1 = key beep off / muted)
 */
export function get_key_s_state(): number {
   return bit(mem_read(0x85fa), 3);
}

/**
 * Sets the key sound / beep state at memory location 0x85FA bit 3.
 * @param state 1 (or true) to set bit 3, 0 (or false) to clear bit 3
 */
export function set_key_s_state(state: number | boolean) {
   const current = mem_read(0x85fa);
   const updated = (state === 1 || state === true)
      ? set_bit(current, 3)
      : reset_bit(current, 3);
   mem_write(0x85fa, updated);
}

let currentPasteSession = 0;

/**
 * Asynchronously pastes BASIC code using the function keys memory bank (Bank 6 / Page 6)
 * and simulating the F1 keypress for each line.
 * The original contents of Bank 6 are preserved and restored upon completion or cancellation.
 */
export function pasteBasic(text: string): Promise<void> {
   const sessionId = ++currentPasteSession;
   if (!text) {
      console.log("paste stopped");
      return Promise.resolve();
   }

   // Backup the entire function keys memory bank (Bank 6 / 16KB)
   const savedBank6 = new Uint8Array(laser500.bank6);

   const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
   let lineIndex = 0;

   return new Promise((resolve) => {
      function cleanupAndFinish(logMsg?: string) {
         laser500.bank6.set(savedBank6);
         if (logMsg) console.log(logMsg);
         resolve();
      }

      function processNextLine() {
         // If a new paste session was started, restore bank 6 and abort
         if (sessionId !== currentPasteSession) {
            laser500.bank6.set(savedBank6);
            return;
         }

         if (lineIndex >= lines.length) {
            cleanupAndFinish("pasted!");
            return;
         }

         // Check if system is ready for the next line:
         // 1. Previous replay string has completed (KEY_REPLAY_STRING pointer at 0x85F7 is 0)
         // 2. System is in immediate mode with active/flashing cursor (0x85FA bit 5 is 1)
         const isReplaying = mem_read_word(0x85f7) !== 0;
         const isImmediate = bit(mem_read(0x85fa), 5) === 1;
         const isReady = !isReplaying && isImmediate;

         if (isReady) {
            const line = lines[lineIndex];
            console.log(`[${lineIndex + 1}/${lines.length}] ${line}`);

            // Max 253 characters for F1 slot (to leave room for '\r' and null terminator in 255-byte limit)
            const maxLen = 253;
            const truncated = line.length > maxLen ? line.substring(0, maxLen) : line;
            const str = truncated + "\r";

            // Write line into Bank 6 at F1 offset (0x0000)
            for (let i = 0; i < str.length; i++) {
               laser500.bank6[i] = str.charCodeAt(i);
            }
            laser500.bank6[str.length] = 0; // null terminator

            // Save and mute key sound so simulated F1 keypress is silent
            const saved_key_s = get_key_s_state();
            set_key_s_state(1);

            // Simulate pressing and releasing F1 key
            const key_f1 = evkey("F1");
            keyDown(key_f1);
            renderAllLines();
            renderAllLines();
            keyUp(key_f1);
            renderAllLines();
            renderAllLines();

            // Restore key sound state
            set_key_s_state(saved_key_s);

            lineIndex++;
         }

         // Poll every 50 ms until previous line finishes and next line is ready
         setTimeout(processNextLine, 50);
      }

      // Start processing
      setTimeout(processNextLine, 50);
   });
}

export function pasteLine(line: string): Promise<void> {
   return pasteBasic(line);
}

// publish on the global window object
(window as any).pasteBasic = pasteBasic;
(window as any).pasteLine = pasteLine;
(window as any).evkey = evkey;
(window as any).get_key_s_state = get_key_s_state;
(window as any).set_key_s_state = set_key_s_state;



