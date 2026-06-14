import React from "react";
import { createPortal } from "react-dom";

import { PrimaryButton, DefaultButton, Dropdown, IDropdownOption, Pivot, PivotItem, Label, Stack, IStackTokens, MessageBar, Link } from '@fluentui/react';
import { Modal } from "@fluentui/react";
import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react";
import { Checkbox } from "@fluentui/react";
import { useState, useEffect, useReducer } from "react";
import { laser500 } from "../emulator";
import { Uploader, UploaderSingle } from "./UploadButton";
import { FileInfo, readFiles } from "./readfile"
import { Drive, EmptyDisk } from "../floppy";
import { emulate_CRT, setEmulateCRT } from "../video";

const numericalSpacingStackTokens: IStackTokens = {
   childrenGap: 10,
   padding: 10,
};

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
   emulateCRT: boolean;
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
      emulateCRT: emulate_CRT,
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
   | { type: 'TOGGLE_CRT_EMULATION' }
   | { type: 'UPDATE_TAPE_STATUS' }
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

      case 'DISK_IMAGE': {
         const fi = action.fileInfo;
         const drive = action.drive-1;
         laser500.drives[drive] = new Drive(new Uint8Array(fi.buffer), fi.name);         
         return { ...state, ...freshState() };
      }

      case 'EMPTY_DISK': {         
         const drive = action.drive-1;
         laser500.drives[drive] = new Drive(EmptyDisk(1), "EMPTY.NIC");         
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

      // ********* video pivot actions ********
      
      case 'TOGGLE_CRT_EMULATION':
         setEmulateCRT(!emulate_CRT);
         return { ...state, ...freshState() };

      // ******* other actions *********
         
      case 'REBOOT':
         laser500.power ();
         return { ...state, ...freshState() };

      case 'RESET':
         laser500.cpu.reset();
         return { ...state, ...freshState() };

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

const memoryOptions: IChoiceGroupOption[] = [
   { key: "L350", text: "Laser 350 (16K RAM)" },
   { key: "L500", text: "Laser 500 (64K RAM)" },
   { key: "L700", text: "Laser 700 (128K RAM)" },
];

// TODO: video: saturation, palette, scanlines, mono/color

export function EmulatorGUI() {
   const [state, dispatch] = useReducer(reducer, initialState);

   const [menuButtonVisible, setMenuButtonVisible] = useState(false);

   useEffect(() => {
      if (state.menuOpen) {
         setMenuButtonVisible(false);
         return;
      }

      let timer: number;

      const resetTimer = (delay: number) => {
         clearTimeout(timer);
         timer = window.setTimeout(() => {
            setMenuButtonVisible(false);
         }, delay);
      };

      const handleMouseMove = () => {
         setMenuButtonVisible(true);
         resetTimer(1500);
      };

      const canvasContainer = document.getElementById("canvas-container");
      if (canvasContainer) {
         canvasContainer.addEventListener("mousemove", handleMouseMove);
         canvasContainer.addEventListener("mouseenter", handleMouseMove);
         canvasContainer.addEventListener("touchstart", handleMouseMove);
      }

      return () => {
         clearTimeout(timer);
         if (canvasContainer) {
            canvasContainer.removeEventListener("mousemove", handleMouseMove);
            canvasContainer.removeEventListener("mouseenter", handleMouseMove);
            canvasContainer.removeEventListener("touchstart", handleMouseMove);
         }
      };
   }, [state.menuOpen]);

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

   const drive1_is_modified = laser500.drives[0].is_modified();
   const drive2_is_modified = laser500.drives[1].is_modified();

   const overlayNode = document.getElementById("overlay-node");

   return (
      <>
         <style dangerouslySetInnerHTML={{__html: `
            .menu-btn {
               position: absolute;
               top: 15px;
               left: 15px;
               width: 40px;
               height: 40px;
               border-radius: 50%;
               background: rgba(0, 0, 0, 0.6);
               border: 1px solid rgba(255, 255, 255, 0.3);
               color: rgba(255, 255, 255, 0.85);
               display: flex;
               align-items: center;
               justify-content: center;
               cursor: pointer;
               z-index: 1000;
               transition: opacity 0.5s ease-in-out, background-color 0.2s, border-color 0.2s, transform 0.1s;
               outline: none;
               box-shadow: 0 2px 6px rgba(0,0,0,0.4);
               opacity: 0;
               pointer-events: none;
            }
            .menu-btn.visible {
               opacity: 1;
               pointer-events: auto;
            }
            .menu-btn:hover {
               opacity: 1;
               pointer-events: auto;
               background: rgba(30, 30, 30, 0.9);
               border-color: rgba(255, 255, 255, 0.6);
               color: #ffffff;
            }
            .menu-btn:active {
               transform: scale(0.92);
            }
         `}} />
         <Modal isOpen={state.menuOpen}>
         <div style={{ padding: '2em' }}>
               <Pivot style={{ height: '500px', minWidth: '768px' }} selectedKey={state.selectedPivot} onLinkClick={(item)=>dispatch({ type: 'PIVOT_SET', itemKey: item?.props.itemKey })}>

                  <PivotItem headerText="Memory" itemKey="memory">
                     <ChoiceGroup 
                        label="Memory" 
                        options={memoryOptions} 
                        selectedKey={state.memoryConfig} 
                        onChange={(e,option)=>dispatch({ type: 'SET_MEMCONFIG', config: option?.key })} />
                  </PivotItem>

                  <PivotItem headerText="Video" itemKey="video">
                     <br />
                     <Checkbox label="CRT emulation"
                        checked={state.emulateCRT} 
                        onChange={()=>dispatch({ type: 'TOGGLE_CRT_EMULATION' })} 
                     />
                     <br />
                     <div>Brighness contrast saturation</div>
                     <div>Monochrome output</div>
                     <div>Take snapshot</div>
                  </PivotItem>

                  <PivotItem headerText="Tape" itemKey="tape">
                     <style dangerouslySetInnerHTML={{__html: `
                        .tape-deck-btn {
                           width: 50px;
                           height: 50px;
                           min-width: 50px;
                           display: inline-flex;
                           align-items: center;
                           justify-content: center;
                           border: 1px solid #c8c6c4;
                           border-radius: 6px;
                           cursor: pointer;
                           margin-right: 12px;
                           transition: all 0.15s ease-in-out;
                           background: linear-gradient(180deg, #ffffff 0%, #f3f2f1 100%);
                           box-shadow: 0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12);
                           color: #605e5c;
                           outline: none;
                           padding: 0;
                        }
                        .tape-deck-btn:hover:not(:disabled) {
                           background: #f3f2f1;
                           border-color: #a19f9d;
                           box-shadow: 0 4px 8px rgba(0,0,0,0.12);
                           transform: translateY(-1px);
                        }
                        .tape-deck-btn:active:not(:disabled) {
                           transform: translateY(2px);
                           box-shadow: inset 0 3px 6px rgba(0,0,0,0.2);
                        }
                        .tape-deck-btn:disabled {
                           opacity: 0.4;
                           cursor: not-allowed;
                        }
                        .tape-deck-btn.btn-active-rec {
                           background: #fde7e9 !important;
                           border-color: #f1707b !important;
                           box-shadow: inset 0 3px 6px rgba(0,0,0,0.2) !important;
                           transform: translateY(2px) !important;
                        }
                        .tape-deck-btn.btn-active-play {
                           background: #dff6dd !important;
                           border-color: #8cbd18 !important;
                           box-shadow: inset 0 3px 6px rgba(0,0,0,0.2) !important;
                           transform: translateY(2px) !important;
                        }
                        .tape-deck-btn.btn-active-play:disabled {
                           opacity: 1 !important;
                           cursor: not-allowed;
                        }
                        .tape-status-display {
                           background-color: #faf9f8;
                           border: 1px solid #edebe9;
                           border-radius: 6px;
                           padding: 10px 14px;
                           font-family: Consolas, Monaco, monospace;
                           font-size: 13px;
                           color: #323130;
                           margin-top: 15px;
                           margin-bottom: 20px;
                           display: flex;
                           align-items: center;
                           box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
                        }
                     `}} />
                     <br />
                      <br />

                      {/* STATUS DISPLAY */}
                      <div className="tape-status-display" style={{ marginTop: '0px', marginBottom: '15px' }}>
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
                               <rect x="6" y="6" width="12" height="12" fill="#323130" />
                            </svg>
                         </button>
                      </div>

                      <br />
                      <br />
                      <Checkbox label="Audible tape sounds (tape monitor)"
                         checked={state.tapeMonitor} 
                         onChange={()=>dispatch({ type: 'TOGGLE_TAPE_MONITOR' })} 
                      />
                      <br />
                      <br />
 
                      <MessageBar delayedRender={false} role="none">
                         BASIC commands for tape are: CLOAD, CRUN, CSAVE and CVERIFY.
                      </MessageBar>
                  </PivotItem>                  

                  <PivotItem headerText="Disk" itemKey="disk">
                     <br />
                     <Checkbox label="Disk drive interface attached"
                        checked={state.emulate_fdc} 
                        onChange={()=>dispatch({ type: 'TOGGLE_EMULATE_FDC' })} 
                     />

                     <br />
                     drive 1: <br /> 
                     Mounted image file: {state.drive1_image_name} {drive1_is_modified ? '(*modified)' : ''}<br /> 
                     <UploaderSingle 
                        value="Select disk image" 
                        onUpload={fileInfo=>dispatch({ type: 'DISK_IMAGE', drive: 1, fileInfo })} 
                        accept=".nic" 
                     /> &nbsp;
                     <DefaultButton onClick={()=>dispatch({type: 'EMPTY_DISK', drive: 1})}>Insert an empty disk</DefaultButton> &nbsp;
                     <DefaultButton onClick={()=>dispatch({type: 'EJECT_DISK', drive: 1})}>Eject disk</DefaultButton> &nbsp;
                     <DefaultButton onClick={()=>dispatch({type: 'SAVE_DISK',  drive: 1})}>Save image to file</DefaultButton> &nbsp;                     
                     <br />
                     <Checkbox label="write protected"
                        checked={state.drive1_write_protected} 
                        onChange={()=>dispatch({ type: 'TOGGLE_DRIVE_WPROT', drive: 1 })} 
                     />

                     <br />
                     drive 2: <br />
                     Mounted image file: {state.drive2_image_name} {drive2_is_modified ? '(*modified)' : ''}<br />   
                     <UploaderSingle 
                        value="Select disk image" 
                        onUpload={fileInfo=>dispatch({ type: 'DISK_IMAGE', drive: 2, fileInfo })} 
                        accept=".nic" 
                     /> &nbsp;
                     <DefaultButton onClick={()=>dispatch({type: 'EMPTY_DISK', drive: 2})}>Insert an empty disk</DefaultButton> &nbsp;
                     <DefaultButton onClick={()=>dispatch({type: 'EJECT_DISK', drive: 2})}>Eject disk</DefaultButton> &nbsp;
                     <DefaultButton onClick={()=>dispatch({type: 'SAVE_DISK',  drive: 2})}>Save image to file</DefaultButton> &nbsp;                     
                     <br />
                     <Checkbox label="write protected"
                        checked={state.drive2_write_protected} 
                        onChange={()=>dispatch({ type: 'TOGGLE_DRIVE_WPROT', drive: 2 })} 
                     />
                     
                  </PivotItem>

                  <PivotItem headerText="Joysticks" itemKey="joysticks"></PivotItem>
                  <PivotItem headerText="Printer" itemKey="printer"></PivotItem>
                  <PivotItem headerText="Serial" itemKey="serial"></PivotItem>                  
                  <PivotItem headerText="Misc" itemKey="misc"></PivotItem>                  

                  <PivotItem headerText="About" itemKey="about">
                     <Label>Laser 500 emulator, written by Antonino Porcino (nino.porcino@gmail.com)</Label><br />
                     <Link href="https://nippur72.github.io/laser500emu" target="_blank">Online emulator</Link><br />
                     <Link href="https://github.com/nippur72/laser500emu/" target="_blank">Github repo</Link><br />
                     <Link href="https://www.facebook.com/groups/263150584310074" target="_blank">Facebook group</Link><br />                     
                  </PivotItem>

               </Pivot>

               <Stack horizontal horizontalAlign="space-between">
                  <DefaultButton onClick={() => dispatch({ type: 'RESET' })}>Reset</DefaultButton>
                  <DefaultButton onClick={() => dispatch({ type: 'REBOOT' })}>Reboot</DefaultButton>
                  <PrimaryButton onClick={() => dispatch({ type: 'TOGGLE_MENU' })}>Close</PrimaryButton>
               </Stack>
         </div>
      </Modal>
      {!state.menuOpen && overlayNode && createPortal(
         <button 
            className={`menu-btn ${menuButtonVisible ? 'visible' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
            title="Open Menu (Ctrl+Alt+M)"
            aria-label="Open Menu"
         >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
               <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
         </button>,
         overlayNode
      )}
      </>
   );
}

/*
import { getLaser310 } from "./index";
import { Uploader } from "./UploadButton";
import { readFiles } from "./browser";
import { VZ_to_WAV } from "laser500-wav/dist/tape_creator";
*/

/*

let joystickOptions: IChoiceGroupOption[] = [
   { key: 'A', text: 'Option A' },
   { key: 'B', text: 'Option B' },
   { key: 'C', text: 'Option C', disabled: true },
   { key: 'D', text: 'Option D' },
];

function _onChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option?: IChoiceGroupOption | undefined): void {
   console.dir(option);
}

const numericalSpacingStackTokens: IStackTokens = {
   childrenGap: 10,
   padding: 10,
};

interface State {
   machine: string;
   memory: string;
   joystick_connected: boolean;
   showPreferences: boolean;
}
*/

/*
export class EmulatorGUI extends Component<State> {

   state: State = {
      machine: "vz300pal",
      memory: "18K",
      joystick_connected: true,
      showPreferences: false
   };

   componentDidMount() {
      document.addEventListener('keydown', (e)=>this.handleKeyDown(e));
   }

   handleKeyDown(e: any) {
      let showPreferences = this.state.showPreferences;

      if(e.code == "F10") {
         // F10 toggle preferences window
         this.setState({ showPreferences: !showPreferences });
      }
      else if(e.code == "Escape") {
         // close preferences window if open
         if(showPreferences) this.close();
      }
      else {
         // console.log(e.code);
      }
   }

   close() {
      this.setState({ showPreferences: false });
   }

   powerOffOn() {
      getLaser310().cpu_reset();
      this.close();
   }

   buttonCloseClick() {
      this.close();
   }

   async uploadVZFile(files: FileList) {
      let vzfiles = await readFiles(files);
      if(vzfiles.length > 0) {
         let vzfile = vzfiles[0];
         getLaser310().load_vz_bytes(new Uint8Array(vzfile), true);
         this.close();
      }            
   }

   async saveVZBasicProgram() {
      await getLaser310().save_vz_bytes("PROGRAM.VZ");
   }

   async upload_wav_file(files: FileList) {
      let wav_files = await readFiles(files);      
      if(wav_files.length !== 1) return;
      let wavfile = wav_files[0];
      getLaser310().load_wav_file(wavfile);
      this.close();                  
   }

   saveturbotape() {
      
   }

   handleUploadText(files: FileList) {
      getLaser310().droppedFiles(files);
      this.close();
   }

   handleChangeMachine(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption|undefined) {
      if(item===undefined) return;
      let machineType = String(item.key);
      this.setState({machine: machineType});
      getLaser310().setMachineType(machineType);
   }

   handleChangeMemory(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption|undefined) {
      if(item===undefined) return;
      let memory = String(item.key);
      this.setState({memory: memory});
      getLaser310().setMemory(memory);
   }

   handleChangeJoystickConnected(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, isChecked?: boolean) {
      let joyconn = isChecked==true;
      this.setState({joystick_connected: joyconn});
      getLaser310().connectJoystick(joyconn);
   }

   render() {
      let state = this.state;
      return (
      <Modal isOpen={state.showPreferences}>
         <div onKeyDown={(e)=>this.handleKeyDown(e)} style={{padding: '2em'}}>
            <Pivot style={{height: '500px'}}>

               <PivotItem headerText="Files" headerButtonProps={{'data-order': 1}}>
                  <Label>Programs</Label>
                  <Stack horizontal horizontalAlign="start" tokens={numericalSpacingStackTokens}>
                     <Uploader value="Load VZ file" onUpload={(e)=>this.uploadVZFile(e)} accept=".vz" />
                     <DefaultButton onClick={()=>this.saveVZBasicProgram()}>Save Basic program</DefaultButton>
                  </Stack>
                  {/*
                  <DefaultButton onClick={()=>{}} disabled={true}>Download BINARY memory area</DefaultButton>
                  <UploadButton value="Load cart" onUpload={this.handleUpload} accept=".bin" />
                  <div>Remove cart</div>
                  <div>Load ROM</div>
                  * /}
               </PivotItem>

               <PivotItem headerText="CPU" headerButtonProps={{'data-order': 2}}>
                  <Dropdown label="CPU" options={machineOptions} selectedKey={state.machine} onChange={(e,i)=>this.handleChangeMachine(e,i)} />
                  <Dropdown label="Memory" options={memoryOptions} selectedKey={state.memory} onChange={(e,i)=>this.handleChangeMemory(e,i)} />
                  <div>MC6847 snow: on/off</div>
               </PivotItem>

               <PivotItem headerText="Joysticks" headerButtonProps={{'data-order': 2}}>
                  <Checkbox label="Joystick interface connected" checked={state.joystick_connected} onChange={(e)=>this.handleChangeJoystickConnected(e)} />
                  <ChoiceGroup defaultSelectedKey="B" options={joystickOptions} onChange={_onChange} label="Pick one" required={true} />;
               </PivotItem>

               <PivotItem headerText="Tape" headerButtonProps={{'data-order': 3}}>
                  <Uploader value="Load .WAV" onUpload={(f)=>this.upload_wav_file(f)} accept=".wav" />
                  <DefaultButton onClick={()=>getLaser310().record_wav()}>Record</DefaultButton>
                  <DefaultButton onClick={()=>getLaser310().stop_record_wav()}>Stop recording</DefaultButton>
                  <div>cassette audio: on/off</div>
               </PivotItem>

               <PivotItem headerText="Disk" headerButtonProps={{'data-order': 4}}>
                  <div>Disk drive interface on/off</div>
                  <div>Load disk in drive 1</div>
                  <div>Load disk in drive 2</div>
                  <div>Download disk in drive 1</div>
                  <div>Download disk in drive 2</div>
                  <div>Unmount disk in drive 1</div>
                  <div>Unmount disk in drive 2</div>
               </PivotItem>

               <PivotItem headerText="Printer" headerButtonProps={{'data-order': 5}}>
                  <div>Save printer output</div>
               </PivotItem>


               <PivotItem headerText="Text files" headerButtonProps={{'data-order': 7}}>
                  <Uploader value="Load text file" onUpload={(e)=>this.handleUploadText(e)} accept=".txt,.bas" />
                  {/* paste clipboard * /}
               </PivotItem>

*/


