import React from "react";
import { LucideIcon, LucideProps, Cpu, Monitor, CassetteTape, Gamepad2, Printer, Cable, Sliders, Info } from "lucide-react";

// Custom 5.25" Floppy Disk Icon matching Lucide line style
export function Floppy525Icon({ size = 18, color = "currentColor", strokeWidth = 2, ...props }: LucideProps) {
   return (
      <svg
         width={size}
         height={size}
         viewBox="0 0 24 24"
         fill="none"
         stroke={color}
         strokeWidth={strokeWidth}
         strokeLinecap="round"
         strokeLinejoin="round"
         {...props}
      >
         {/* 5.25" Floppy Disk Outer Jacket */}
         <rect x="3" y="3" width="18" height="18" rx="1" />
         {/* Write protect notch on right edge */}
         <path d="M21 7h-2v3h2" />
         {/* Center hub hole */}
         <circle cx="12" cy="11" r="3" />
         {/* Index hole */}
         <circle cx="12" cy="6.5" r="0.75" />
         {/* Head read/write access slot */}
         <rect x="10.5" y="15" width="3" height="4.5" rx="1.5" />
      </svg>
   );
}

export interface TabInfo {
   key: string;
   label: string;
   icon: LucideIcon | React.ComponentType<LucideProps>;
}

export const TABS: TabInfo[] = [
   {
      key: "system",
      label: "System",
      icon: Cpu,
   },
   {
      key: "video",
      label: "Video",
      icon: Monitor,
   },
   {
      key: "tape",
      label: "Tape",
      icon: CassetteTape,
   },
   {
      key: "disk",
      label: "Disk",
      icon: Floppy525Icon,
   },
   {
      key: "joysticks",
      label: "Joysticks",
      icon: Gamepad2,
   },
   {
      key: "printer",
      label: "Printer",
      icon: Printer,
   },
   {
      key: "serial",
      label: "Serial",
      icon: Cable,
   },
   {
      key: "misc",
      label: "Misc",
      icon: Sliders,
   },
   {
      key: "about",
      label: "About",
      icon: Info,
   }
];
