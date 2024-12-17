import React from "react";

import { PrimaryButton, DefaultButton, Dropdown, IDropdownOption, Pivot, PivotItem, Label, Stack, IStackTokens, MessageBar } from '@fluentui/react';
import { Modal } from "@fluentui/react";
import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react";
import { Checkbox } from "@fluentui/react";
import { useState, useEffect, useReducer } from "react";
import { laser500 } from "../emulator";
import { Uploader, UploaderSingle } from "./UploadButton";
import { FileInfo, readFiles } from "./readfile"
import { Drive, EmptyDisk } from "../floppy";

const numericalSpacingStackTokens: IStackTokens = {
   childrenGap: 10,
   padding: 10,
};

interface GUISTate {
   menuOpen: boolean;
   tapeMonitor: boolean;
   emulate_fdc: boolean;
   isTapePlaying: boolean;
   tapeFileName: string;
   csaving: boolean;

   drive1_write_protected: boolean;
   drive1_image_name: string;
   drive2_write_protected: boolean;
   drive2_image_name: string;
}

const initialState: GUISTate = {
   menuOpen: false,
   ...freshState()
}

function freshState() {
   return {      
      tapeMonitor: laser500.tape_monitor,
      emulate_fdc: laser500.emulate_fdc,
      isTapePlaying: laser500.tape.isPlaying(),
      tapeFileName: laser500.tape.tapeFileName,
      csaving: laser500.csaving,
      drive1_write_protected: laser500.drives[0].write_enabled === 1 ? false : true,
      drive2_write_protected: laser500.drives[1].write_enabled === 1 ? false : true,
      drive1_image_name: laser500.drives[0].fileName,
      drive2_image_name: laser500.drives[1].fileName 
   };
}

type Action = 
     { type: 'TOGGLE_MENU' } 
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
;

function reducer(state: GUISTate, action: Action): GUISTate {
   switch (action.type) {
      case 'TOGGLE_MENU':
         return { ...state, menuOpen: !state.menuOpen };

      case 'TOGGLE_TAPE_MONITOR':
         laser500.tape_monitor = !laser500.tape_monitor;
         return { ...state, ...freshState() };

      case 'TOGGLE_DRIVE_WPROT': {
         const drive = action.drive-1;
         laser500.drives[drive].write_enabled = laser500.drives[drive].write_enabled ? 0 : 1;
         return { ...state, ...freshState() };
      }

      case 'TOGGLE_EMULATE_FDC':
         laser500.emulate_fdc = !laser500.emulate_fdc;
         return { ...state, ...freshState() };

      case 'STOP_TAPE':
         laser500.tape.stopPlay();
         return { ...state, ...freshState() };

      case 'REBOOT':
         laser500.power ();
         return { ...state, ...freshState() };

      case 'RESET':
         laser500.cpu.reset();
         return { ...state, ...freshState() };

      case 'UPLOAD_WAV': {
         const fi = action.fileInfo;
         laser500.tape.load_wav_file(fi.name, fi.buffer);         
         return { ...state, ...freshState() };
      }

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

      case 'STOP_RECORD_TAPE':
         laser500.tape.cstop();
         return { ...state, ...freshState() };
   
      case 'RECORD_TAPE':
         laser500.tape.csave();
         return { ...state, ...freshState() };

      default:
         throw 'unknown action';         
   }
}

export function EmulatorGUI() {
   const [state, dispatch] = useReducer(reducer, initialState);

   function tasto_premuto(ev) {
      if(ev.code === "KeyM" && ev.altKey && ev.ctrlKey) {
         dispatch({ type: 'TOGGLE_MENU' });
      }
   }

   useEffect(() => {
      document.addEventListener('keydown', tasto_premuto);
      return () => document.removeEventListener('keydown', tasto_premuto);
   }, []);    

   return (
      <Modal isOpen={state.menuOpen}>
         <div style={{ padding: '2em' }}>
               <Pivot style={{ height: '500px', minWidth: '768px' }}>
                  <PivotItem headerText="Tape">
                     <br />
                     <Checkbox label="Audible tape sounds (tape monitor)"
                        checked={state.tapeMonitor} 
                        onChange={()=>dispatch({ type: 'TOGGLE_TAPE_MONITOR' })} 
                     />
                     <br />
                     { state.isTapePlaying 
                        ? <DefaultButton onClick={()=>dispatch({ type: 'STOP_TAPE' })}>Stop tape ({state.tapeFileName})</DefaultButton> 
                        : <UploaderSingle value="Play .WAV file" onUpload={fileInfo=>dispatch({ type: 'UPLOAD_WAV', fileInfo })} accept=".wav" /> 
                     }
                     <br />
                     <br />

                     {
                        state.csaving 
                        ? <DefaultButton onClick={()=>dispatch({ type: 'STOP_RECORD_TAPE' })}>Stop recording</DefaultButton> 
                        : <DefaultButton onClick={()=>dispatch({ type: 'RECORD_TAPE' })}>Record (max 5 mins)</DefaultButton> 
                     }

                     <br />
                     <br />

                     <MessageBar delayedRender={false} role="none">
                        BASIC commands for tape are: CLOAD, CRUN, CSAVE and CVERIFY.
                     </MessageBar>
                  </PivotItem>                  

                  <PivotItem headerText="Disk">
                     <br />
                     <Checkbox label="Disk drive interface attached"
                        checked={state.emulate_fdc} 
                        onChange={()=>dispatch({ type: 'TOGGLE_EMULATE_FDC' })} 
                     />

                     <br />
                     drive 1: <br /> 
                     Mounted image file: {state.drive1_image_name} <br /> 
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
                     Mounted image file: {state.drive2_image_name}  <br />   
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

               </Pivot>

               <Stack horizontal horizontalAlign="space-between">
                  <DefaultButton onClick={() => dispatch({ type: 'RESET' })}>Reset</DefaultButton>
                  <DefaultButton onClick={() => dispatch({ type: 'REBOOT' })}>Reboot</DefaultButton>
                  <PrimaryButton onClick={() => dispatch({ type: 'TOGGLE_MENU' })}>Close</PrimaryButton>
               </Stack>
         </div>
      </Modal>
   );
}

/*
import { getLaser310 } from "./index";
import { Uploader } from "./UploadButton";
import { readFiles } from "./browser";
import { VZ_to_WAV } from "laser500-wav/dist/tape_creator";
*/

/*
let machineOptions: IDropdownOption<any>[] = [
   { key: "vz200pal" , text: "VZ200 (Laser 210) PAL"  },
   { key: "vz300pal" , text: "VZ300 (Laser 310) PAL"  },
   { key: "vz200ntsc", text: "VZ200 (Laser 210) NTSC" },
   { key: "vz300ntsc", text: "VZ300 (Laser 310) NTSC" }
];

let memoryOptions: IDropdownOption<any>[] = [
   { key: "8K"  , text: "8K RAM"  },
   { key: "18K" , text: "18K RAM" },
   { key: "24K" , text: "24K RAM" },
   { key: "34K" , text: "34K RAM" }
];

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

               <PivotItem headerText="Video" headerButtonProps={{'data-order': 6}}>
                  <div>Brighness contrast saturation</div>
                  <div>Monochrome output</div>
                  <div>Take snapshot</div>
               </PivotItem>

               <PivotItem headerText="Text files" headerButtonProps={{'data-order': 7}}>
                  <Uploader value="Load text file" onUpload={(e)=>this.handleUploadText(e)} accept=".txt,.bas" />
                  {/* paste clipboard * /}
               </PivotItem>

               <PivotItem headerText="About" headerButtonProps={{'data-order': 8}}>
                  <Label>Laser 310 emulator, (C) 2021 Antonino Porcino</Label>
               </PivotItem>

            </Pivot>

            <Stack horizontal horizontalAlign="space-between">
               <DefaultButton onClick={()=>this.powerOffOn()}>Reset</DefaultButton>
               <PrimaryButton onClick={()=>this.buttonCloseClick()}>Close</PrimaryButton>
            </Stack>

         </div>
      </Modal>
      );
   }
}
*/


