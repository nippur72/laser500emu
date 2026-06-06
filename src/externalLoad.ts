import { loadBytes } from "./files";

export async function externalLoad(url: string): Promise<Uint8Array | undefined> {
   console.log("externalLoad url=" + url);
   try {
      const proxyUrl = 'https://vercel-cors-proxy-kappa.vercel.app/?url=' + encodeURIComponent(url);
      const response = await fetch(proxyUrl);
      if (!response.ok) {
         let errorBody = "";
         try {
            errorBody = await response.text();
         } catch (_) {}
         throw new Error(`HTTP error! status: ${response.status}. Body: ${errorBody}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      loadBytes(Array.from(bytes));
      
      console.log("Successfully loaded external program via Vercel Proxy.");
      return bytes;
   } catch (error) {
      console.error("Error loading external program:", error);
      return undefined;
   }
}
