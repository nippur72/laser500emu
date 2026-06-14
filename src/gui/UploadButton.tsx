import React, { useRef } from "react";
import { DefaultButton } from '@fluentui/react';
import { FileInfo, readFiles } from "./readfile";

/*
<input type="file" id="input" onChange={()=>console.log("changed")}></input>
                <!--
                <div>This is a counter: {this.state.count}</div>
                <button onClick={()=>this.click()}>Click me</button>
                -->
accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*">
*/

interface UploaderProps {
   accept: string;
   value?: string;
   onUpload(files: FileList): void;
   children?: React.ReactNode;
}

function Uploader(props: UploaderProps) {
   const inputElementRef = useRef<HTMLInputElement>(null);

   function onChange() {
      const files = inputElementRef.current?.files;
      if(!files) return;
      if(props.onUpload) props.onUpload(files);
      if(inputElementRef.current) {
         inputElementRef.current.value = "";
      }
   }

   function showDialog() {
      inputElementRef.current?.click();
   }

   return (
      <span>
         <input
            type="file"
            ref={inputElementRef}
            style={{display: "none"}}
            onChange={onChange}
            accept={props.accept}
         ></input>
         {props.children ? (
            <span onClick={showDialog} style={{ display: 'inline-block' }}>
               {props.children}
            </span>
         ) : (
            <DefaultButton onClick={showDialog}>{props.value}</DefaultButton>
         )}
      </span>
   );
}

interface UploaderSingleProps {
   accept: string;
   value?: string;
   onUpload(files: FileInfo): void;
   children?: React.ReactNode;
}

async function get_first_file(files: FileList) {
   const wav_files = await readFiles(files);
   if (wav_files.length !== 1) return undefined;
   const { name, buffer } = wav_files[0];
   return { name, buffer}   
}

function UploaderSingle(props: UploaderSingleProps) {
   return <Uploader 
      accept={props.accept} 
      value={props.value} 
      onUpload={async fl=>{
         const singleFile = await get_first_file(fl);
         if(!singleFile) return;
         props.onUpload(singleFile);
      }}>         
      {props.children}
   </Uploader>
}

export { Uploader, UploaderSingle };