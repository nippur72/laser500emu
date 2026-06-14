import { saveAs as fileSaverSaveAs } from "file-saver";

/**
 * Saves a Blob to a file, prompting the user with a native system "Save As" file dialog if supported.
 * Falls back to file-saver if unsupported or on failure (except when cancelled by the user).
 */
export async function saveAs(blob: Blob, suggestedName: string) {
   if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
      try {
         const extension = suggestedName.includes(".") ? "." + suggestedName.split(".").pop()!.toLowerCase() : "";
         let mimeType = blob.type;

         // Standardize MIME type to avoid browser rejection of showSaveFilePicker options
         if (extension === ".wav") {
            mimeType = "audio/wav";
         } else if (extension === ".txt" || extension === ".bas") {
            mimeType = "text/plain";
         } else if (!mimeType) {
            mimeType = "application/octet-stream";
         }

         const options: any = {
            suggestedName: suggestedName,
         };

         if (extension) {
            options.types = [
               {
                  description: `${extension.toUpperCase().slice(1)} File`,
                  accept: {
                     [mimeType]: [extension],
                  },
               },
            ];
         }

         const handle = await (window as any).showSaveFilePicker(options);
         const writable = await handle.createWritable();
         await writable.write(blob);
         await writable.close();
         return;
      } catch (err: any) {
         // If user aborted / cancelled, do not save or fall back
         if (err.name === "AbortError") {
            console.log("Save operation cancelled by user");
            return;
         }
         console.warn("showSaveFilePicker failed, falling back to file-saver", err);
      }
   }

   // Fallback to file-saver
   fileSaverSaveAs(blob, suggestedName);
}
