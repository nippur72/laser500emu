import { createReactRoot } from "./gui/createRoot";

// starts the emulator on the canvas 
import "./emulator";

/*
import { createTheme, Customizations } from '@fluentui/react';

const appTheme = createTheme({
  defaultFontStyle: { fontFamily: 'Times New Roman' },
  fonts: {
    small: {
      fontSize: '11px',
    },
    medium: {
      fontSize: '13px',
    },
    large: {
      fontSize: '20px',
      fontWeight: 'semibold',
    },
    xLarge: {
      fontSize: '22px',
      fontWeight: 'semibold',
    },
  },
});

Customizations.applySettings({ appTheme });
*/

// starts the GUI
createReactRoot();
