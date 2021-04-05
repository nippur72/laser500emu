//
// functions originally copied from https://www.mdawson.net/vic20chrome/vic20.php
// and adapted for this emulator
//
                                                               
function binToArray(data) {
   let bincodes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.!";
   var v=0,cnt=0,out=[],ii=0;
   for(var i=0;i<data.length;i++) {
      v+=bincodes.indexOf(data[i])<<cnt;
      cnt+=6;
      if(cnt>=8) {
         out[ii++]=(v&255);
         cnt-=8;
         v>>=8;
      }
   }
   return out;
}

let externalLoad_array = undefined;

function externalLoad(cmd,url,format,subfile) {
   externalLoad_array = undefined;

	console.log("externalLoad cmd="+cmd+" url="+url+" format="+format+" subfile="+subfile);
	var head= document.getElementsByTagName('head')[0];
	var script= document.createElement('script');
	script.type= 'text/javascript';	
	script.src= 'https://www.mdawson.net/vic20chrome/vic20/prgtojsloader.php?cmd='+cmd+'&prgurl='+url+'&subfile='+subfile;
	head.appendChild(script);
   return new Promise((resolve,reject)=>{
      function check() {
         if(externalLoad_array != undefined) resolve(externalLoad_array);
         else setTimeout(()=>check(), 500);
      }
      check();
   });
}

function loadPrg(src) {   
   if(src.length !== 1) return;
   externalLoad_array = binToArray(src[0]);
}
