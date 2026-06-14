import * as wavDecoder from "wav-decoder";
import * as wavEncoder from "wav-encoder";

// @ts-ignore
const decodeSync = wavDecoder.decodeSync || wavDecoder.decode?.sync || (wavDecoder.default && (wavDecoder.default.decodeSync || wavDecoder.default.decode?.sync));
// @ts-ignore
const encodeSync = wavEncoder.encodeSync || wavEncoder.encode?.sync || (wavEncoder.default && (wavEncoder.default.encodeSync || wavEncoder.default.encode?.sync));

export function decodeWav(bytes: ArrayBuffer): any {
   return decodeSync(bytes);
}

export function encodeWav(audioData: any, opts?: any): ArrayBuffer {
   const defaultOpts = { bitDepth: 16, float: false };
   return encodeSync(audioData, { ...defaultOpts, ...opts });
}
