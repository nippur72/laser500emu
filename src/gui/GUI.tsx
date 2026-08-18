import React from "react";
import { createPortal } from "react-dom";

import { Modal } from "@fluentui/react";
import { useState, useEffect, useReducer, useRef } from "react";
import { laser500 } from "../emulator";
import { setCharset, getCharset, CharsetOption } from "../browser";
import { Uploader, UploaderSingle } from "./UploadButton";
import { FileInfo, readFiles } from "./readfile"
import { Drive, EmptyDisk } from "../floppy";
import { emulate_CRT, setEmulateCRT, crtOptions, setCrtOption, resetCrtOptions } from "../video";
import type { CRTEmulatorOptions } from "@nippur72/crt-emulator";
import { TabInfo, TABS } from "./TabInfo";
import { useMainMenuButton } from "./useMainMenuButton";
import { Menu } from "lucide-react";
import cssText from "./GUI.css?inline";
import { pasteBasic, pasteLine } from "../paste";
import { uint8ToString } from "../bytes";
import { fetchFile } from "../externalLoad";
import { loadBytes } from "../files";
import { connectToBBS } from "../bbs";
import { saveAs } from "../save-file";



interface GUIState {
   menuOpen: boolean;
   selectedPivot: string|undefined;

   tapeMonitor: boolean;
   emulate_fdc: boolean;
   isTapePlaying: boolean;
   tapeFileName: string;
   csaving: boolean;

   drive1_write_protected: boolean;
   drive1_image_name: string;
   drive2_write_protected: boolean;
   drive2_image_name: string;

   memoryConfig: "L350"|"L500"|"L700";
   charset: CharsetOption;
   emulateCRT: boolean;
   crtOptions: Required<CRTEmulatorOptions>;
   joystickConnected: boolean;
   swapJoysticks: boolean;
   driveSound: boolean;
}

const initialState: GUIState = {
   menuOpen: false,
   selectedPivot: undefined,

   ...freshState()
}

function freshState() {
   return {      
      tapeMonitor: laser500.tape_monitor,
      emulate_fdc: laser500.emulate_fdc,
      isTapePlaying: laser500.tape.isPlaying(),
      tapeFileName: laser500.tape.tapeFileName,
      csaving: laser500.csaving,
      drive1_write_protected: laser500.drives[0].write_protected === 1,
      drive2_write_protected: laser500.drives[1].write_protected === 1,
      drive1_image_name: laser500.drives[0].fileName,
      drive2_image_name: laser500.drives[1].fileName,
      memoryConfig: laser500.isLaser700 ? "L700": laser500.isLaser500 ? "L500" : "L350" as GUIState["memoryConfig"], 
      charset: getCharset(),
      emulateCRT: emulate_CRT,
      crtOptions: { ...crtOptions },
      joystickConnected: laser500.joystick_connected,
      swapJoysticks: laser500.swap_joysticks,
      driveSound: laser500.drive_sound,
   };
}

type Action = 
   | { type: 'PIVOT_SET', itemKey: string|undefined }  // used to set the menu tab (called "Pivot")
   | { type: 'TOGGLE_MENU' } 
   | { type: 'TOGGLE_TAPE_MONITOR' } 
   | { type: 'TOGGLE_EMULATE_FDC' } 
   | { type: 'TOGGLE_DRIVE_WPROT', drive: number } 
   | { type: 'STOP_TAPE' }
   | { type: 'REBOOT' }
   | { type: 'RESET' }
   | { type: 'UPLOAD_WAV', fileInfo: FileInfo}
   | { type: 'DISK_IMAGE', fileInfo: FileInfo, drive: number }
   | { type: 'EMPTY_DISK', drive: number }
   | { type: 'EJECT_DISK', drive: number }
   | { type: 'SAVE_DISK', drive: number }
   | { type: 'RECORD_TAPE' }
   | { type: 'STOP_RECORD_TAPE' }
   | { type: 'SET_MEMCONFIG', config: string | number | undefined }
   | { type: 'SET_CHARSET', charset: CharsetOption }
   | { type: 'TOGGLE_CRT_EMULATION' }
   | { type: 'SET_CRT_OPTION', key: keyof CRTEmulatorOptions, value: number }
   | { type: 'RESET_CRT_OPTIONS' }
   | { type: 'UPDATE_TAPE_STATUS' }
   | { type: 'TOGGLE_JOYSTICK_CONNECTED' }
   | { type: 'TOGGLE_SWAP_JOYSTICK' }
   | { type: 'TOGGLE_DRIVE_SOUND' }
;

function reducer(state: GUIState, action: Action): GUIState {
   switch (action.type) {
      case 'PIVOT_SET':
         return { ...state, selectedPivot: action.itemKey };

      case 'TOGGLE_MENU':
         return { ...state, menuOpen: !state.menuOpen, ...freshState() };

      // ************* tape pivot actions *************

      case 'TOGGLE_TAPE_MONITOR': {
         laser500.tape_monitor = !laser500.tape_monitor;
         return { ...state, ...freshState() };
      }

      case 'TOGGLE_DRIVE_SOUND': {
         laser500.drive_sound = !laser500.drive_sound;
         return { ...state, ...freshState() };
      }

      case 'STOP_TAPE': {
         laser500.tape.stopPlay();
         return { ...state, ...freshState() };
      }

      case 'UPLOAD_WAV': {
         const fi = action.fileInfo;
         laser500.tape.load_wav_file(fi.name, fi.buffer);         
         return { ...state, ...freshState() };
      }

      case 'STOP_RECORD_TAPE': {
         laser500.tape.cstop();
         return { ...state, ...freshState() };
      }

      case 'RECORD_TAPE': {
         laser500.tape.csave();
         return { ...state, ...freshState() };
      }

      // **************** disk pivot actions ***************  

      case 'TOGGLE_DRIVE_WPROT': {
         const drive = action.drive-1;
         laser500.drives[drive].write_protected = laser500.drives[drive].write_protected ? 0 : 1;
         return { ...state, ...freshState() };
      }

      case 'TOGGLE_EMULATE_FDC':
         laser500.emulate_fdc = !laser500.emulate_fdc;
         return { ...state, ...freshState() };

      case 'TOGGLE_JOYSTICK_CONNECTED':
         laser500.joystick_connected = !laser500.joystick_connected;
         return { ...state, ...freshState() };

      case 'TOGGLE_SWAP_JOYSTICK':
         laser500.swap_joysticks = !laser500.swap_joysticks;
         return { ...state, ...freshState() };

      case 'DISK_IMAGE': {
         const fi = action.fileInfo;
         const drive = action.drive-1;
         laser500.drives[drive] = new Drive(new Uint8Array(fi.buffer), fi.name);         
         return { ...state, ...freshState() };
      }

      case 'EMPTY_DISK': {         
         const drive = action.drive-1;
         laser500.drives[drive] = new Drive(EmptyDisk(2), "EMPTY.NIC");         
         return { ...state, ...freshState() };
      }

      case 'EJECT_DISK': {         
         const drive = action.drive-1;
         laser500.drives[drive] = new Drive(new Uint8Array(0), "NO DISK");         
         return { ...state, ...freshState() };
      }

      case 'SAVE_DISK': {         
         const drive = action.drive-1;
         laser500.drives[drive].save_image_to_file();
         return { ...state, ...freshState() };
      }

      // ************* machine pivot actions *************

      case 'SET_MEMCONFIG': {         
         const conf = action.config;
         laser500.isLaser350 = conf === "L350";
         laser500.isLaser500 = conf === "L500";
         laser500.isLaser700 = conf === "L700";
         return { ...state, ...freshState() };
      }

      case 'SET_CHARSET':
         setCharset(action.charset);
         return { ...state, ...freshState() };

      // ********* video pivot actions ********
      
      case 'TOGGLE_CRT_EMULATION':
         setEmulateCRT(!emulate_CRT);
         return { ...state, ...freshState() };

      case 'SET_CRT_OPTION':
         setCrtOption(action.key, action.value);
         return { ...state, ...freshState() };

      case 'RESET_CRT_OPTIONS':
         resetCrtOptions();
         return { ...state, ...freshState() };

      // ******* other actions *********
         
      case 'REBOOT':
         laser500.power ();
         return { ...state, menuOpen: false, ...freshState() };

      case 'RESET':
         laser500.cpu.reset();
         return { ...state, menuOpen: false, ...freshState() };

      case 'UPDATE_TAPE_STATUS': {
         const isPlaying = laser500.tape.isPlaying();
         if (isPlaying !== state.isTapePlaying) {
            return { ...state, isTapePlaying: isPlaying };
         }
         return state;
      }

      default:
         throw 'unknown action';         
   }
}

const memoryOptions = [
   { key: "L350", label: "Laser 350 (16K RAM)" },
   { key: "L500", label: "Laser 500 (64K RAM)" },
   { key: "L700", label: "Laser 700 (128K RAM)" },
];

const charsetOptions: { key: CharsetOption; label: string }[] = [
   { key: "english", label: "English" },
   { key: "german", label: "German" },
   { key: "french", label: "French" },
   { key: "bincode", label: "unused (bitmap)" },
];

function RetroCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
   return (
      <label className="retro-checkbox">
         <input type="checkbox" checked={checked} onChange={onChange} />
         <span className="checkmark"></span>
         <span>{label}</span>
      </label>
   );
}

function EjectIcon({ size = 14 }: { size?: number }) {
   return (
      <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
         <polygon points="12 3 4 13 20 13 12 3" />
         <line x1="4" y1="17" x2="20" y2="17" />
      </svg>
   );
}

interface CRTSliderConfig {
   key: keyof CRTEmulatorOptions;
   label: string;
   min: number;
   max: number;
   step: number;
   format?: (val: number) => string;
}

const CRT_SLIDERS: CRTSliderConfig[] = [
   { key: "hardScan", label: "Scanline Sharpness (Hard Scan)", min: -20, max: 0, step: 0.5 },
   { key: "hardPix", label: "Pixel Sharpness (Hard Pix)", min: -10, max: 0, step: 0.1 },
   { key: "warp", label: "Screen Curvature (Warp)", min: 0, max: 0.2, step: 0.005, format: v => v.toFixed(3) },
   { key: "chromaBleed", label: "Chroma Bleed", min: 0, max: 3, step: 0.1 },
   { key: "chromaPhase", label: "Chroma Phase", min: 0, max: 1, step: 0.025, format: v => v.toFixed(3) },
   { key: "chromaCrosstalk", label: "Chroma Crosstalk", min: 0, max: 1, step: 0.05 },
   { key: "maskDark", label: "Mask Dark", min: 0, max: 1, step: 0.05 },
   { key: "maskLight", label: "Mask Light", min: 0, max: 2, step: 0.05 },
   { key: "maskScale", label: "Mask Scale", min: 0.25, max: 3, step: 0.05 },
   { key: "maskFade", label: "Mask Luminance Fade", min: 0, max: 1, step: 0.05 },
   { key: "maskWidth", label: "Mask Triad Width", min: 1, max: 10, step: 0.5 },
   { key: "maskHeight", label: "Mask Triad Height", min: 1, max: 20, step: 0.5 },
   { key: "gapWidth", label: "Mask Gap Width", min: 0, max: 1, step: 0.05 },
   { key: "gapHeight", label: "Mask Gap Height", min: 0, max: 2, step: 0.05 },
];

export function EmulatorGUI() {
   const [state, dispatch] = useReducer(reducer, initialState);
   const [bbsUrl, setBbsUrl] = useState("ws://bbs.retrocampus.com:8080?protocol=bbs");
   const [printerText, setPrinterText] = useState(laser500.printer.getText());
   const printerTextareaRef = useRef<HTMLTextAreaElement>(null);
   const menuButtonVisible = useMainMenuButton(state.menuOpen);

   useEffect(() => {
      setPrinterText(laser500.printer.getText());
      laser500.printer.on_text_callback = () => {
         setPrinterText(laser500.printer.getText());
      };
      return () => {
         laser500.printer.on_text_callback = undefined;
      };
   }, []);

   async function handleSavePrinterOutput() {
      const blob = new Blob([laser500.printer.getText()], { type: "text/plain;charset=utf-8" });
      await saveAs(blob, "printer_output.txt");
   }

   function handleClearPrinterOutput() {
      laser500.printer.clear();
      setPrinterText("");
   }

   async function handleConnectBBS() {
      dispatch({ type: 'TOGGLE_MENU' });

      let rawUrl = bbsUrl.trim();
      if (!rawUrl.startsWith("ws://") && !rawUrl.startsWith("wss://")) {
         rawUrl = "ws://" + rawUrl;
      }

      let wsUrl = rawUrl;
      let protocol: string | undefined = undefined;

      try {
         const parsed = new URL(rawUrl);
         const protoParam = parsed.searchParams.get("protocol");
         if (protoParam) {
            protocol = protoParam;
         }
         parsed.searchParams.delete("protocol");
         if (parsed.pathname === "/" && !parsed.search && !parsed.hash) {
            wsUrl = `${parsed.protocol}//${parsed.host}`;
         } else {
            wsUrl = parsed.toString();
         }
      } catch (e) {
         console.warn("Invalid BBS URL:", e);
      }

      const bytes = await fetchFile("term/term.bin");
      if (bytes !== undefined) {
         loadBytes(Array.from(bytes), undefined, "term.bin");
         laser500.cpu.reset();
         pasteLine("RUN\r\n");
      }

      await connectToBBS(wsUrl, protocol);
   }

   function tasto_premuto(ev) {
      if(ev.code === "KeyM" && ev.altKey && ev.ctrlKey) {
         ev.preventDefault();
         dispatch({ type: 'TOGGLE_MENU' });         
         return;
      }      
   }

   useEffect(() => {
      document.addEventListener('keydown', tasto_premuto);
      return () => document.removeEventListener('keydown', tasto_premuto);
   }, []);    

   useEffect(() => {
      if (!state.menuOpen || !state.isTapePlaying) return;

      const interval = setInterval(() => {
         if (!laser500.tape.isPlaying()) {
            dispatch({ type: 'UPDATE_TAPE_STATUS' });
         }
      }, 1000);

      return () => clearInterval(interval);
   }, [state.menuOpen, state.isTapePlaying]);

   const activeKey = state.selectedPivot || "system";
   const overlayNode = document.getElementById("overlay-node");
   const drive1_is_modified = laser500.drives[0].is_modified();
   const drive2_is_modified = laser500.drives[1].is_modified();

   useEffect(() => {
      if (activeKey === "printer" && printerTextareaRef.current) {
         printerTextareaRef.current.scrollTop = printerTextareaRef.current.scrollHeight;
      }
   }, [printerText, activeKey]);

   return (
      <>
         <style>{cssText}</style>

         <Modal 
            isOpen={state.menuOpen}
            onDismiss={() => dispatch({ type: 'TOGGLE_MENU' })}
            isBlocking={false}
            firstFocusableSelector="sidebar-menu-item.active"
            overlay={{ styles: { root: { background: 'transparent' } } }}
         >
            <div className="modern-settings-container">
               {/* Left Sidebar */}
               <div className="modern-sidebar">
                  <div className="sidebar-header">
                     <div className="sidebar-title">Laser 500</div>
                     <div className="sidebar-subtitle">Emulator Panel</div>
                  </div>

                  <div className="sidebar-menu">
                     {TABS.map((tab) => {
                        const isActive = activeKey === tab.key;
                        const IconComponent = tab.icon;
                        return (
                           <button
                              key={tab.key}
                              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
                              onClick={() => dispatch({ type: 'PIVOT_SET', itemKey: tab.key })}
                           >
                              <IconComponent size={18} />
                              <span>{tab.label}</span>
                           </button>
                        );
                     })}
                  </div>

                  <div className="sidebar-footer">
                     <button className="retro-btn full-width" onClick={() => dispatch({ type: 'RESET' })}>Reset CPU</button>
                     <button className="retro-btn full-width" onClick={() => dispatch({ type: 'REBOOT' })}>Reboot</button>
                  </div>
               </div>

               {/* Right Content Area */}
               <div className="modern-content-panel">
                  <div className="content-header">
                     <h2 className="content-title">{TABS.find(t => t.key === activeKey)?.label} Settings</h2>
                     <button className="close-x-btn" onClick={() => dispatch({ type: 'TOGGLE_MENU' })} title="Close Settings">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                           <line x1="18" y1="6" x2="6" y2="18"></line>
                           <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                     </button>
                  </div>

                  <div className="content-body">
                     {activeKey === "system" && (
                        <div>
                           <div className="retro-label">Memory Size</div>
                           <div className="retro-radio-group">
                              {memoryOptions.map(opt => (
                                 <label key={opt.key} className="retro-radio">
                                    <input 
                                       type="radio" 
                                       name="memoryConfig" 
                                       checked={state.memoryConfig === opt.key}
                                       onChange={() => dispatch({ type: 'SET_MEMCONFIG', config: opt.key })}
                                    />
                                    <span className="radio-dot"></span>
                                    <span>{opt.label}</span>
                                 </label>
                              ))}
                           </div>

                           <div className="section-gap">
                              <div className="retro-label">Character set ROM switch</div>
                              <div className="retro-radio-group">
                                 {charsetOptions.map(opt => (
                                    <label key={opt.key} className="retro-radio">
                                       <input 
                                          type="radio" 
                                          name="charset" 
                                          checked={state.charset === opt.key}
                                          onChange={() => dispatch({ type: 'SET_CHARSET', charset: opt.key })}
                                       />
                                       <span className="radio-dot"></span>
                                       <span>{opt.label}</span>
                                    </label>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}

                     {activeKey === "video" && (
                        <RetroCheckbox 
                           label="CRT emulation"
                           checked={state.emulateCRT} 
                           onChange={()=>dispatch({ type: 'TOGGLE_CRT_EMULATION' })} 
                        />
                     )}

                     {activeKey === "tape" && (
                        <>
                           {/* STATUS DISPLAY */}
                           <div className="tape-status-display">
                              <span style={{ 
                                 width: '8px', 
                                 height: '8px', 
                                 borderRadius: '50%', 
                                 backgroundColor: state.csaving ? '#e81123' : state.isTapePlaying ? '#107c41' : '#a19f9d',
                                 marginRight: '10px',
                                 display: 'inline-block',
                                 boxShadow: state.csaving ? '0 0 4px #e81123' : state.isTapePlaying ? '0 0 4px #107c41' : 'none',
                              }}></span>
                              <span>
                                 {state.csaving ? (
                                    <span><strong>[RECORDING]</strong> tape_recording.wav</span>
                                 ) : state.isTapePlaying ? (
                                    <span><strong>[PLAYING]</strong> {state.tapeFileName}</span>
                                 ) : (
                                    <span><strong>[STOPPED]</strong> No active tape</span>
                                 )}
                              </span>
                           </div>
      
                           <div style={{ display: 'flex', alignItems: 'center' }}>
                              {/* REC BUTTON */}
                              <button
                                 type="button"
                                 title="Record (max 5 mins)"
                                 onClick={() => {
                                    if (!state.csaving) {
                                       dispatch({ type: 'RECORD_TAPE' });
                                    }
                                 }}
                                 disabled={state.isTapePlaying}
                                 className={`tape-deck-btn ${state.csaving ? 'btn-active-rec' : ''}`}
                              >
                                 <svg viewBox="0 0 24 24" width="22" height="22">
                                    <circle cx="12" cy="12" r="7" fill={state.csaving ? '#e81123' : '#a80000'} />
                                 </svg>
                              </button>
      
                              {/* PLAY BUTTON */}
                              <UploaderSingle 
                                 accept=".wav" 
                                 onUpload={fileInfo => dispatch({ type: 'UPLOAD_WAV', fileInfo })}
                              >
                                 <button
                                    type="button"
                                    title="Play .WAV file"
                                    disabled={state.csaving || state.isTapePlaying}
                                    className={`tape-deck-btn ${state.isTapePlaying ? 'btn-active-play' : ''}`}
                                 >
                                    <svg viewBox="0 0 24 24" width="22" height="22">
                                       <path d="M8 5v14l11-7z" fill={state.isTapePlaying ? '#107c41' : '#605e5c'} />
                                    </svg>
                                 </button>
                              </UploaderSingle>
      
                              {/* STOP BUTTON */}
                              <button
                                 type="button"
                                 title="Stop playing or recording"
                                 onClick={() => {
                                    if (state.isTapePlaying) {
                                       dispatch({ type: 'STOP_TAPE' });
                                    } else if (state.csaving) {
                                       dispatch({ type: 'STOP_RECORD_TAPE' });
                                    }
                                 }}
                                 className="tape-deck-btn"
                              >
                                 <svg viewBox="0 0 24 24" width="22" height="22">
                                    <rect x="6" y="6" width="12" height="12" fill="#605e5c" />
                                 </svg>
                              </button>
                           </div>
      
                           <div className="section-gap">
                              <RetroCheckbox 
                                 label="Audible tape sounds (tape monitor)"
                                 checked={state.tapeMonitor} 
                                 onChange={()=>dispatch({ type: 'TOGGLE_TAPE_MONITOR' })} 
                              />
                           </div>
      
                           <div className="section-gap retro-hint">
                              BASIC commands for tape are: CLOAD, CRUN, CSAVE and CVERIFY.
                           </div>
                        </>
                     )}

                     {activeKey === "disk" && (
                        <>
                            <RetroCheckbox 
                               label="Disk drive interface attached"
                               checked={state.emulate_fdc} 
                               onChange={()=>dispatch({ type: 'TOGGLE_EMULATE_FDC' })} 
                            />

                            <RetroCheckbox
                               label="Audible drive head sounds"
                               checked={state.driveSound}
                               onChange={()=>dispatch({ type: 'TOGGLE_DRIVE_SOUND' })}
                            />

                            <div className="drive-grid section-gap">
                               {/* DRIVE 1 */}
                               <div className="drive-card">
                                  <div className="drive-card-title">Drive 1:</div>
                                  <div className="drive-card-info">
                                     Mounted image file: <br />
                                     <span className="monospace-text">{state.drive1_image_name}</span> {drive1_is_modified ? '(*modified)' : ''}
                                  </div>
                                  <div className="drive-card-actions">
                                     <UploaderSingle 
                                        value="Select disk image" 
                                        onUpload={fileInfo=>dispatch({ type: 'DISK_IMAGE', drive: 1, fileInfo })} 
                                        accept=".nic" 
                                     />
                                     <button className="retro-btn" onClick={()=>dispatch({type: 'EMPTY_DISK', drive: 1})}>Insert empty disk</button>
                                     <button className="retro-btn" onClick={()=>dispatch({type: 'EJECT_DISK', drive: 1})}><EjectIcon size={14} /> Eject disk</button>
                                     <button className="retro-btn" onClick={()=>dispatch({type: 'SAVE_DISK',  drive: 1})}>Save image to file</button>
                                  </div>
                                  <div className="drive-card-wprot">
                                     <RetroCheckbox 
                                        label="Write protected"
                                        checked={state.drive1_write_protected} 
                                        onChange={()=>dispatch({ type: 'TOGGLE_DRIVE_WPROT', drive: 1 })} 
                                     />
                                  </div>
                               </div>

                               {/* DRIVE 2 */}
                               <div className="drive-card">
                                  <div className="drive-card-title">Drive 2:</div>
                                  <div className="drive-card-info">
                                     Mounted image file: <br />
                                     <span className="monospace-text">{state.drive2_image_name}</span> {drive2_is_modified ? '(*modified)' : ''}
                                  </div>
                                  <div className="drive-card-actions">
                                     <UploaderSingle 
                                        value="Select disk image" 
                                        onUpload={fileInfo=>dispatch({ type: 'DISK_IMAGE', drive: 2, fileInfo })} 
                                        accept=".nic" 
                                     />
                                     <button className="retro-btn" onClick={()=>dispatch({type: 'EMPTY_DISK', drive: 2})}>Insert empty disk</button>
                                     <button className="retro-btn" onClick={()=>dispatch({type: 'EJECT_DISK', drive: 2})}><EjectIcon size={14} /> Eject disk</button>
                                     <button className="retro-btn" onClick={()=>dispatch({type: 'SAVE_DISK',  drive: 2})}>Save image to file</button>
                                  </div>
                                  <div className="drive-card-wprot">
                                     <RetroCheckbox 
                                        label="Write protected"
                                        checked={state.drive2_write_protected} 
                                        onChange={()=>dispatch({ type: 'TOGGLE_DRIVE_WPROT', drive: 2 })} 
                                     />
                                  </div>
                               </div>
                            </div>
                        </>
                     )}

                     {activeKey === "joysticks" && (
                        <div className="settings-group">
                           <RetroCheckbox 
                              label="Joystick interface connected" 
                              checked={state.joystickConnected} 
                              onChange={() => dispatch({ type: 'TOGGLE_JOYSTICK_CONNECTED' })} 
                           />
                           <RetroCheckbox 
                              label="Swap joysticks" 
                              checked={state.swapJoysticks} 
                              onChange={() => dispatch({ type: 'TOGGLE_SWAP_JOYSTICK' })} 
                           />
                        </div>
                     )}

                     {activeKey === "printer" && (
                        <div className="printer-panel">
                           <div className="retro-label">Printer Output</div>
                           <textarea
                              ref={printerTextareaRef}
                              className="printer-textarea"
                              value={printerText}
                              readOnly
                              placeholder="No printer output yet..."
                              wrap="off"
                           />
                           <div className="printer-actions">
                              <button 
                                 type="button" 
                                 className="retro-btn"
                                 onClick={handleSavePrinterOutput}
                              >
                                 Save printer output
                              </button>
                              <button 
                                 type="button" 
                                 className="retro-btn"
                                 onClick={handleClearPrinterOutput}
                              >
                                 Clear
                              </button>
                           </div>
                           <div className="retro-hint">
                              The Laser 500 includes a Centronics-compatible parallel printer interface mapped to I/O port <strong>00h</strong> (Status / Ready) and port <strong>0Dh</strong> (8-bit Data).<br />
                              Output generated by BASIC commands like <code>LPRINT</code> and <code>LLIST</code> is captured in this buffer in real-time.
                           </div>
                        </div>
                     )}

                     {activeKey === "serial" && (
                        <div className="settings-group">
                           <div className="retro-label">Connect to BBS</div>
                           <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input 
                                 type="text"
                                 className="retro-input"
                                 value={bbsUrl}
                                 onChange={e => setBbsUrl(e.target.value)}
                                 onKeyDown={e => {
                                    if (e.key === "Enter") {
                                       handleConnectBBS();
                                    }
                                 }}
                                 placeholder="ws://bbs.retrocampus.com:8080?protocol=bbs"
                              />
                              <button 
                                 type="button" 
                                 className="retro-btn"
                                 onClick={handleConnectBBS}
                              >
                                 Connect
                              </button>
                           </div>
                           <div className="section-gap retro-hint">
                              The serial port is mapped into I/O ports <strong>50h</strong> (Status) and <strong>51h</strong> (Data), and was almost exclusively used in CP/M.<br /><br />
                              The WebSocket bridge button above loads a terminal program on the Laser 500 and connects to a remote server over WebSockets. To connect to a TCP/IP server, you can use a proxy like the <code>npm</code> utility <code>websocket-to-tcp</code>.
                           </div>
                        </div>
                     )}

                     {activeKey === "misc" && (
                        <div className="settings-group">
                           <div className="retro-label">Paste text / BASIC</div>
                           <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <UploaderSingle 
                                 accept=".bas,.txt" 
                                 onUpload={fileInfo => {
                                    const text = uint8ToString(new Uint8Array(fileInfo.buffer));
                                    dispatch({ type: 'TOGGLE_MENU' });
                                    pasteBasic(text);
                                 }}
                              >
                                 <button type="button" className="retro-btn">Paste text file</button>
                              </UploaderSingle>
                              <button 
                                 type="button"
                                 className="retro-btn" 
                                 onClick={async () => {
                                    try {
                                       const text = await navigator.clipboard.readText();
                                       if (text) {
                                          dispatch({ type: 'TOGGLE_MENU' });
                                          pasteBasic(text);
                                       }
                                    } catch (err) {
                                       console.error("Failed to read clipboard:", err);
                                    }
                                 }}
                              >
                                 Paste clipboard
                              </button>
                              <button 
                                 type="button"
                                 className="retro-btn" 
                                 onClick={() => {
                                    dispatch({ type: 'TOGGLE_MENU' });
                                    pasteBasic("");
                                 }}
                              >
                                 Stop paste
                              </button>
                           </div>
                           <div className="section-gap retro-hint">
                              "Paste text file" opens .bas and .txt files and pastes them into the system.<br />
                              "Paste clipboard" pastes the current clipboard contents.<br />
                              "Stop paste" stops any ongoing paste operation.
                           </div>
                        </div>
                     )}

                     {activeKey === "about" && (
                        <div className="about-links">
                           <span className="retro-label">Laser 500 emulator, written by Antonino Porcino (nino.porcino@gmail.com)</span>
                           <a className="retro-link" href="https://nippur72.github.io/laser500emu" target="_blank" rel="noopener noreferrer">Online emulator</a>
                           <a className="retro-link" href="https://github.com/nippur72/laser500emu/" target="_blank" rel="noopener noreferrer">Github repo</a>
                           <a className="retro-link" href="https://www.facebook.com/groups/263150584310074" target="_blank" rel="noopener noreferrer">Facebook group</a>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </Modal>
      {!state.menuOpen && overlayNode && createPortal(
         <button 
            className={`menu-btn ${menuButtonVisible ? 'visible' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
            title="Open Menu (Ctrl+Alt+M)"
            aria-label="Open Menu"
         >
            <Menu size={20} />
         </button>,
         overlayNode
      )}
      </>
   );
}

