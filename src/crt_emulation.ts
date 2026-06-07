// the original shader was taken from https://www.shadertoy.com/view/XsjSzR
// and improved better RGB mask and PAL colour bleed simulation

let gl: WebGLRenderingContext | null = null;
let glProgramPassThrough: WebGLProgram | null = null;
let glProgramCRT: WebGLProgram | null = null;
let glVertexBuffer: WebGLBuffer | null = null;
let glTex: WebGLTexture | null = null;
export let useWebGL = false;

function toGLSLFloat(x: number): string {
   const s = x.toString();
   return s.includes('.') || s.includes('e') ? s : s + '.0';
}

export function fsCRTSource(
   hardScan = -8.0,    // -8.0 = soft, -16.0 = medium, -20.0 = sharp retro
   hardPix = -2.0,     // -2.0 = soft, -4.0 = hard
   warp = 0.04,        // 0.0 = normal >0 warped
   maskDark = 0.5,     // 0.5
   maskLight = 1.0,    // 1.5
   maskScale = 1.25,   // 1.0 = fine, 2.0 = medium, 3.0 = coarse
   chromaBleed = 1.0,  // 0.0 = none, 1.0 = normal PAL bleed, 2.0 = strong PAL bleed
   maskWidth = 3.0,    // horizontal period of the triad
   maskHeight = 6.0,   // vertical height of the RGB triad element
   gapWidth = 0.25,     // vertical dark column gap width
   gapHeight = 0.5     // horizontal dark row gap height
): string {
   return `
      #extension GL_OES_standard_derivatives : enable
      precision highp float;
      varying vec2 vTexCoord;
      uniform sampler2D uSampler;
      uniform vec2 uResolution;
      uniform vec2 uTextureResolution;

      // Hardness of scanline.
      //  -8.0 = soft
      // -16.0 = medium
      float hardScan = ${toGLSLFloat(hardScan)};

      // Hardness of pixels in scanline.
      // -2.0 = soft
      // -4.0 = hard
      float hardPix = ${toGLSLFloat(hardPix)};

      // Display warp.
      // 0.0 = none
      // 1.0/8.0 = extreme
      vec2 warp = vec2(${toGLSLFloat(warp)}, ${toGLSLFloat(warp)}); 

      // Amount of shadow mask.
      float maskDark = ${toGLSLFloat(maskDark)};
      float maskLight = ${toGLSLFloat(maskLight)};

      //------------------------------------------------------------------------

      // sRGB to Linear.
      // Assuing using sRGB typed textures this should not be needed.
      float ToLinear1(float c) {
         return (c <= 0.04045) ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4);
      }
      vec3 ToLinear(vec3 c) {
         return vec3(ToLinear1(c.r), ToLinear1(c.g), ToLinear1(c.b));
      }

      // Linear to sRGB.
      // Assuing using sRGB typed textures this should not be needed.
      float ToSrgb1(float c) {
         return (c < 0.0031308 ? c * 12.92 : 1.055 * pow(c, 0.41666) - 0.055);
      }
      vec3 ToSrgb(vec3 c) {
         return vec3(ToSrgb1(c.r), ToSrgb1(c.g), ToSrgb1(c.b));
      }

      // RGB to YUV conversion (Composite PAL/NTSC signal simulation)
      vec3 RGBtoYUV(vec3 rgb) {
         float y = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
         float u = -0.14713 * rgb.r - 0.28886 * rgb.g + 0.436 * rgb.b;
         float v = 0.615 * rgb.r - 0.51499 * rgb.g - 0.10001 * rgb.b;
         return vec3(y, u, v);
      }

      // YUV to RGB conversion
      vec3 YUVtoRGB(vec3 yuv) {
         float r = yuv.x + 1.13983 * yuv.z;
         float g = yuv.x - 0.39465 * yuv.y - 0.58060 * yuv.z;
         float b = yuv.x + 2.03211 * yuv.y;
         return vec3(r, g, b);
      }

      // Nearest emulated sample given floating point position and texel offset.
      // Also zero's off screen.
      vec3 Fetch(vec2 pos, vec2 off) {
         vec2 texCoord = (floor(pos * uTextureResolution + off) + vec2(0.5)) / uTextureResolution;
         if (max(abs(texCoord.x - 0.5), abs(texCoord.y - 0.5)) > 0.5) return vec3(0.0, 0.0, 0.0);
         
         vec3 rgbCenter = ToLinear(texture2D(uSampler, texCoord).rgb);
         if (${toGLSLFloat(chromaBleed)} <= 0.0) return rgbCenter;
         
         vec2 texCoordLeft = (floor(pos * uTextureResolution + off + vec2(-${toGLSLFloat(chromaBleed)}, 0.0)) + vec2(0.5)) / uTextureResolution;
         vec2 texCoordRight = (floor(pos * uTextureResolution + off + vec2(${toGLSLFloat(chromaBleed)}, 0.0)) + vec2(0.5)) / uTextureResolution;
         
         vec3 rgbLeft = ToLinear(texture2D(uSampler, texCoordLeft).rgb);
         vec3 rgbRight = ToLinear(texture2D(uSampler, texCoordRight).rgb);
         
         vec3 yuvCenter = RGBtoYUV(rgbCenter);
         vec3 yuvLeft = RGBtoYUV(rgbLeft);
         vec3 yuvRight = RGBtoYUV(rgbRight);
         
         float avgU = (yuvLeft.y + yuvCenter.y + yuvRight.y) / 3.0;
         float avgV = (yuvLeft.z + yuvCenter.z + yuvRight.z) / 3.0;
         
         return YUVtoRGB(vec3(yuvCenter.x, avgU, avgV));
      }

      // Distance in emulated pixels to nearest texel.
      vec2 Dist(vec2 pos) {
         pos = pos * uTextureResolution;
         return -((pos - floor(pos)) - vec2(0.5));
      }
          
      // 1D Gaussian.
      float Gaus(float pos, float scale) {
         return exp2(scale * pos * pos);
      }

      // 3-tap Gaussian filter along horz line.
      vec3 Horz3(vec2 pos, float off) {
         vec3 b = Fetch(pos, vec2(-1.0, off));
         vec3 c = Fetch(pos, vec2( 0.0, off));
         vec3 d = Fetch(pos, vec2( 1.0, off));
         float dst = Dist(pos).x;
         // Convert distance to weight.
         float scale = hardPix;
         float wb = Gaus(dst - 1.0, scale);
         float wc = Gaus(dst + 0.0, scale);
         float wd = Gaus(dst + 1.0, scale);
         // Return filtered sample.
         return (b * wb + c * wc + d * wd) / (wb + wc + wd);
      }

      // 5-tap Gaussian filter along horz line.
      vec3 Horz5(vec2 pos, float off) {
         vec3 a = Fetch(pos, vec2(-2.0, off));
         vec3 b = Fetch(pos, vec2(-1.0, off));
         vec3 c = Fetch(pos, vec2( 0.0, off));
         vec3 d = Fetch(pos, vec2( 1.0, off));
         vec3 e = Fetch(pos, vec2( 2.0, off));
         float dst = Dist(pos).x;
         // Convert distance to weight.
         float scale = hardPix;
         float wa = Gaus(dst - 2.0, scale);
         float wb = Gaus(dst - 1.0, scale);
         float wc = Gaus(dst + 0.0, scale);
         float wd = Gaus(dst + 1.0, scale);
         float we = Gaus(dst + 2.0, scale);
         // Return filtered sample.
         return (a * wa + b * wb + c * wc + d * wd + e * we) / (wa + wb + wc + wd + we);
      }

      // Return scanline weight.
      float Scan(vec2 pos, float off) {
         float dst = Dist(pos).y;
         return Gaus(dst + off, hardScan);
      }

      // Allow nearest three lines to effect pixel.
      vec3 Tri(vec2 pos) {
         vec3 a = Horz3(pos, -1.0);
         vec3 b = Horz5(pos,  0.0);
         vec3 c = Horz3(pos,  1.0);
         float wa = Scan(pos, -1.0);
         float wb = Scan(pos,  0.0);
         float wc = Scan(pos,  1.0);
         return a * wa + b * wb + c * wc;
      }

      // Distortion of scanlines, and end of screen alpha.
      vec2 Warp(vec2 pos) {
         pos = pos * 2.0 - 1.0;    
         pos *= vec2(1.0 + (pos.y * pos.y) * warp.x, 1.0 + (pos.x * pos.x) * warp.y);
         return pos * 0.5 + 0.5;
      }

      // Shadow mask.
      vec3 Mask(vec2 pos) {
         pos = pos / ${toGLSLFloat(maskScale)};
         
         // Derivative-based moire detection
         vec2 d = fwidth(pos);
         float maxD = max(d.x / ${toGLSLFloat(maskWidth)}, d.y / ${toGLSLFloat(maskHeight)});
         float blend = smoothstep(0.3, 0.8, maxD);
         
         // Calculate average mask color
         float activeArea = (${toGLSLFloat(maskWidth)} - ${toGLSLFloat(gapWidth)}) * (${toGLSLFloat(maskHeight)} - ${toGLSLFloat(gapHeight)}) / (${toGLSLFloat(maskWidth)} * ${toGLSLFloat(maskHeight)});
         vec3 maskAvg = activeArea * vec3((maskLight + 2.0 * maskDark) / 3.0) + (1.0 - activeArea) * vec3(maskDark);
         
         float col = floor(pos.x / ${toGLSLFloat(maskWidth)});
         float y = pos.y + mod(col, 2.0) * (${toGLSLFloat(maskHeight)} / 2.0);
         
         // Horizontal dark row gap (modulus check)
         float yMod = mod(y, ${toGLSLFloat(maskHeight)});
         if (yMod >= (${toGLSLFloat(maskHeight)} - ${toGLSLFloat(gapHeight)})) {
            return mix(vec3(maskDark, maskDark, maskDark), maskAvg, blend);
         }
         
         // Vertical dark column gap (modulus check)
         float xMod = mod(pos.x, ${toGLSLFloat(maskWidth)});
         if (xMod >= (${toGLSLFloat(maskWidth)} - ${toGLSLFloat(gapWidth)})) {
            return mix(vec3(maskDark, maskDark, maskDark), maskAvg, blend);
         }
         
         // Active triad subpixel calculation
         float activeWidth = ${toGLSLFloat(maskWidth)} - ${toGLSLFloat(gapWidth)};
         float subpixelWidth = activeWidth / 3.0;
         
         vec3 mask = vec3(maskDark, maskDark, maskDark);
         if (xMod < subpixelWidth) {
            mask.r = maskLight;
         } else if (xMod < 2.0 * subpixelWidth) {
            mask.g = maskLight;
         } else {
            mask.b = maskLight;
         }
         return mix(mask, maskAvg, blend);
      }    

      void main(void) {
         vec2 pos = Warp(vTexCoord);
         vec3 color = Tri(pos) * Mask(pos * uResolution);
         gl_FragColor = vec4(ToSrgb(color), 1.0);
      }
   `;
}

export function initWebGL(canvas: HTMLCanvasElement): boolean {
   if (!canvas) return false;
   try {
      gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
      if (!gl) {
         console.warn("WebGL not supported, falling back to 2D context");
         return false;
      }

      // Enable standard derivatives extension for fwidth in WebGL 1.0 fragment shaders
      gl.getExtension('OES_standard_derivatives');

      // Compile Shaders
      const vsSource = `
         attribute vec2 aPosition;
         attribute vec2 aTexCoord;
         varying vec2 vTexCoord;
         void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
            vTexCoord = aTexCoord;
         }
      `;

      const fsPassThroughSource = `
         precision mediump float;
         varying vec2 vTexCoord;
         uniform sampler2D uSampler;
         void main(void) {
            gl_FragColor = texture2D(uSampler, vTexCoord);
         }
      `;

      const loadShader = (type: number, source: string): WebGLShader | null => {
         const shader = gl!.createShader(type);
         if (!shader) return null;
         gl!.shaderSource(shader, source);
         gl!.compileShader(shader);
         if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
            console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
            gl!.deleteShader(shader);
            return null;
         }
         return shader;
      };

      const vs = loadShader(gl.VERTEX_SHADER, vsSource);
      const fsPass = loadShader(gl.FRAGMENT_SHADER, fsPassThroughSource);
      const fsCRT = loadShader(gl.FRAGMENT_SHADER, fsCRTSource());

      if (!vs || !fsPass || !fsCRT) return false;

      const createProgram = (vsShader: WebGLShader, fsShader: WebGLShader): WebGLProgram | null => {
         const program = gl!.createProgram();
         if (!program) return null;
         gl!.attachShader(program, vsShader);
         gl!.attachShader(program, fsShader);
         gl!.linkProgram(program);
         if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
            console.error("Program link error:", gl!.getProgramInfoLog(program));
            gl!.deleteProgram(program);
            return null;
         }
         return program;
      };

      glProgramPassThrough = createProgram(vs, fsPass);
      glProgramCRT = createProgram(vs, fsCRT);

      if (!glProgramPassThrough || !glProgramCRT) return false;

      // Setup vertices quad
      const vertices = new Float32Array([
         -1.0, -1.0,   0.0, 0.0,
          1.0, -1.0,   1.0, 0.0,
         -1.0,  1.0,   0.0, 1.0,
         -1.0,  1.0,   0.0, 1.0,
          1.0, -1.0,   1.0, 0.0,
          1.0,  1.0,   1.0, 1.0
      ]);

      glVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, glVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      // Create texture
      glTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      useWebGL = true;
      return true;
   } catch (e) {
      console.error("Failed to initialize WebGL:", e);
      useWebGL = false;
      return false;
   }
}

export function renderWebGL(
   canvas: HTMLCanvasElement,
   emulate_CRT: boolean,
   SCREEN_W: number,
   SCREEN_H: number,
   DOUBLE_SCANLINES: boolean,
   imageData: ImageData
): void {
   if (!useWebGL || !gl) return;

   gl.viewport(0, 0, canvas.width, canvas.height);
   gl.clearColor(0, 0, 0, 1);
   gl.clear(gl.COLOR_BUFFER_BIT);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, glTex);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SCREEN_W, SCREEN_H * (DOUBLE_SCANLINES ? 2 : 1), 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);

   const program = emulate_CRT ? glProgramCRT : glProgramPassThrough;
   if (program) {
      gl.useProgram(program);

      const uSamplerLoc = gl.getUniformLocation(program, "uSampler");
      gl.uniform1i(uSamplerLoc, 0);

      if (emulate_CRT) {
         const uResolutionLoc = gl.getUniformLocation(program, "uResolution");
         gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);

         const uTextureResolutionLoc = gl.getUniformLocation(program, "uTextureResolution");
         gl.uniform2f(uTextureResolutionLoc, SCREEN_W, SCREEN_H);
      }

      const aPositionLoc = gl.getAttribLocation(program, "aPosition");
      const aTexCoordLoc = gl.getAttribLocation(program, "aTexCoord");

      gl.enableVertexAttribArray(aPositionLoc);
      gl.enableVertexAttribArray(aTexCoordLoc);

      gl.bindBuffer(gl.ARRAY_BUFFER, glVertexBuffer);
      gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, false, 16, 8);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }
}
