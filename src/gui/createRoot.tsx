import React from "react";
import { createRoot } from 'react-dom/client';
import { EmulatorGUI } from './GUI';

export function createReactRoot() {
   const container = document.getElementById('mountnode');
   if(container) {
      const root = createRoot(container); 
      root.render(<EmulatorGUI />); 
   }
}