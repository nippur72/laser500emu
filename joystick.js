class Joystick {
   constructor() {
      this.left  = 0;
      this.right = 0;
      this.up    = 0;
      this.down  = 0;
      this.fire  = 0;
      this.arm   = 0;
   }
}

function handleJoyStick(key, press) 
{
   let joystick_key = true;
   if(press) 
   {
           if(key === "Numpad8")       { joy1.up    = 1; }
      else if(key === "Numpad2")       { joy1.down  = 1; }
      else if(key === "Numpad4")       { joy1.left  = 1; }
      else if(key === "Numpad6")       { joy1.right = 1; }
      else if(key === "Numpad0")       { joy1.fire  = 1; }
      else if(key === "ControlRight")  { joy1.arm   = 1; }
      else if(key === "Numpad9")       { joy1.right = 1; joy1.up   = 1; }
      else if(key === "Numpad3")       { joy1.right = 1; joy1.down = 1; }
      else if(key === "Numpad1")       { joy1.left  = 1; joy1.down = 1; }
      else if(key === "Numpad7")       { joy1.left  = 1; joy1.up   = 1; }
      else joystick_key = false;
   }
   else
   {
           if(key === "Numpad8")       { joy1.up    = 0; }
      else if(key === "Numpad2")       { joy1.down  = 0; }
      else if(key === "Numpad4")       { joy1.left  = 0; }
      else if(key === "Numpad6")       { joy1.right = 0; }
      else if(key === "Numpad0")       { joy1.fire  = 0; }
      else if(key === "ControlRight")  { joy1.arm   = 0; }
      else if(key === "Numpad9")       { joy1.right = 0; joy1.up   = 0; }
      else if(key === "Numpad3")       { joy1.right = 0; joy1.down = 0; }
      else if(key === "Numpad1")       { joy1.left  = 0; joy1.down = 0; }
      else if(key === "Numpad7")       { joy1.left  = 0; joy1.up   = 0; }
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

   if(gamepad.axes[0] < -0.5) joy1.left  = 1; else joy1.left  = 0;
   if(gamepad.axes[0] >  0.5) joy1.right = 1; else joy1.right = 0;
   if(gamepad.axes[1] < -0.5) joy1.up    = 1; else joy1.up    = 0;
   if(gamepad.axes[1] >  0.5) joy1.down  = 1; else joy1.down  = 0;

   if(gamepad.buttons[0].pressed) joy1.fire  = 1; else joy1.fire  = 0;
   if(gamepad.buttons[1].pressed) joy1.fire  = 1; else joy1.fire  = 0;
}

/*
Joystick 1:

up    = ~(inp(&h2b) &  1)
down  = ~(inp(&h2b) &  2)
left  = ~(inp(&h2b) &  4)
right = ~(inp(&h2b) &  8)
fire  = ~(inp(&h2b) & 16)
arm   = ~(inp(&h27) & 16)

Remarks: bits are with negated logic, 0 when button in pressed.
         Direction and first fire are on port &h2b, the
         other fire button is on port &h27.
         Basic provides the JOY(n) function,
         JOY(0) = direction 1,2,3,4,5,6,8 starting from up and then clockwise
         JOY(1) = 1 fire  button
         JOY(2) = 1 arm   button
*/
