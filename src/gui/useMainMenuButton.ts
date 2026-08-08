import { useState, useEffect } from "react";

/**
 * Custom React hook that controls the visibility of the main menu toggle button.
 * 
 * Behavior:
 * - Hides the menu button when the modal menu is open (`menuOpen = true`).
 * - Listens for mouse movements, mouse entrance, or touch interactions over the target element
 *   (defaulting to `#canvas-container`).
 * - Shows the button on user activity and automatically fades/hides it after a period of inactivity
 *   (default 1500ms).
 * 
 * @param menuOpen - Boolean state indicating whether the menu modal is currently open.
 * @param targetId - The DOM element ID to attach mouse/touch activity listeners to (default: "canvas-container").
 * @param hideDelayMs - Delay in milliseconds before automatically hiding the button after inactivity (default: 1500).
 * @returns `boolean` indicating whether the menu button should be visible.
 */
export function useMainMenuButton(
   menuOpen: boolean,
   targetId = "canvas-container",
   hideDelayMs = 1500
) {
   const [menuButtonVisible, setMenuButtonVisible] = useState(false);

   useEffect(() => {
      if (menuOpen) {
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
         resetTimer(hideDelayMs);
      };

      const canvasContainer = document.getElementById(targetId);
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
   }, [menuOpen, targetId, hideDelayMs]);

   return menuButtonVisible;
}
