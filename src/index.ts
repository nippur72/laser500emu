import { createReactRoot } from "./gui/createRoot";

// starts the emulator on the canvas 
import "./emulator";

// publishes the global bbs() helper that bridges serial <-> WebSocket
import "./bbs";

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
