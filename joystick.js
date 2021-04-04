/*
Joystick 1:

up    = ~(inp(&h2b) &  1)
down  = ~(inp(&h2b) &  2)
left  = ~(inp(&h2b) &  4)
right = ~(inp(&h2b) &  8)
fire  = ~(inp(&h2b) & 16)
fire2 = ~(inp(&h27) & 16)

Remarks: bits are with negated logic, 0 when button in pressed. 
         Direction and first fire are on port &h2b, the
         other fire button is on port &h27.
         Basic provides the JOY(n) function,
         JOY(0) = direction 1,2,3,4,5,6,8 starting from up and then clockwise
         JOY(1) = 1 fire1 button 
         JOY(2) = 1 fire2 button
*/

const JOY_UP    = 1;
const JOY_DOWN  = 2;
const JOY_LEFT  = 4;
const JOY_RIGHT = 8;
const JOY_FIRE1 = 16;
const JOY_FIRE2 = 16;

function handleJoyStick(key, press) 
{
   let joystick_key = true;
   if(press) 
   {
           if(key === "Numpad8")       joy0 = reset(joy0, JOY_UP);
      else if(key === "Numpad9")       joy0 = reset(joy0, JOY_UP | JOY_RIGHT);
      else if(key === "Numpad6")       joy0 = reset(joy0, JOY_RIGHT);
      else if(key === "Numpad3")       joy0 = reset(joy0, JOY_RIGHT | JOY_DOWN);
      else if(key === "Numpad2")       joy0 = reset(joy0, JOY_DOWN);
      else if(key === "Numpad1")       joy0 = reset(joy0, JOY_DOWN | JOY_LEFT);
      else if(key === "Numpad4")       joy0 = reset(joy0, JOY_LEFT);
      else if(key === "Numpad7")       joy0 = reset(joy0, JOY_UP | JOY_LEFT);
      else if(key === "Numpad0")       joy1 = reset(joy1, JOY_FIRE1);
      else if(key === "ControlRight")  joy0 = reset(joy0, JOY_FIRE2);
      else joystick_key = false;
   }
   else
   {
           if(key === "Numpad8")       joy0 = set(joy0, JOY_UP);
      else if(key === "Numpad9")       joy0 = set(joy0, JOY_UP | JOY_RIGHT);
      else if(key === "Numpad6")       joy0 = set(joy0, JOY_RIGHT);
      else if(key === "Numpad3")       joy0 = set(joy0, JOY_RIGHT | JOY_DOWN);
      else if(key === "Numpad2")       joy0 = set(joy0, JOY_DOWN);
      else if(key === "Numpad1")       joy0 = set(joy0, JOY_DOWN | JOY_LEFT);
      else if(key === "Numpad4")       joy0 = set(joy0, JOY_LEFT);
      else if(key === "Numpad7")       joy0 = set(joy0, JOY_UP | JOY_LEFT);
      else if(key === "Numpad0")       joy1 = set(joy1, JOY_FIRE1);
      else if(key === "ControlRight")  joy0 = set(joy0, JOY_FIRE2);
      else joystick_key = false;
   }
   return joystick_key;
}

function updateGamePad() {
   let gamepads = navigator.getGamepads();
   if(gamepads.length < 1) return;

   // joy 0
   let gamepad = gamepads[0];
   if(gamepad === null) return;

   if(gamepad.axes[0] < -0.5) joy0 = reset(joy0, JOY_LEFT);   else joy0 = set(joy0, JOY_LEFT);
   if(gamepad.axes[0] >  0.5) joy0 = reset(joy0, JOY_RIGHT);  else joy0 = set(joy0, JOY_RIGHT);
   if(gamepad.axes[1] < -0.5) joy0 = reset(joy0, JOY_UP);     else joy0 = set(joy0, JOY_UP);
   if(gamepad.axes[1] >  0.5) joy0 = reset(joy0, JOY_DOWN);   else joy0 = set(joy0, JOY_DOWN);

   if(gamepad.buttons[0].pressed) joy0 = reset(joy0, JOY_FIRE1);   else joy0 = set(joy0, JOY_FIRE1);
   if(gamepad.buttons[1].pressed) joy1 = reset(joy1, JOY_FIRE1);   else joy1 = set(joy1, JOY_FIRE1);
}


