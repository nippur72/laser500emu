async function externalLoad(url: string): Promise<Uint8Array | undefined> {
   try {
      // external source: fetch via CORS proxy
      const proxyUrl = 'https://vercel-cors-proxy-kappa.vercel.app/?url=' + encodeURIComponent(url);
      const response = await fetch(proxyUrl);
      if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      console.log(`loaded external "${url}" (${bytes.length} bytes)`);
      return bytes;
   }
   catch(error) {
      console.error(`error loading "${url}":`, error);
      return undefined;
   }
}

export async function fetchFile(name: string): Promise<Uint8Array | undefined> {
   if(name.startsWith("http")) return externalLoad(name);
   try {
      // local source: fetch from the repo software/ directory
      const response = await fetch(`software/${name}`);
      if(response.status === 404) return undefined;
      const bytes = new Uint8Array(await response.arrayBuffer());
      return bytes;
   }
   catch(error) {
      console.error(`error loading "${name}":`, error);
      return undefined;
   }
}
