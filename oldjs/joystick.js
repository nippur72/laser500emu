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

let swap_joystick = true;

function handleJoyStick(key, press) 
{
   let joystick_key = true;

   let joy = swap_joystick ? joy_left : joy_right;

   if(press) 
   {
           if(key === "Numpad8")       { joy.up    = 1; }
      else if(key === "Numpad2")       { joy.down  = 1; }
      else if(key === "Numpad4")       { joy.left  = 1; }
      else if(key === "Numpad6")       { joy.right = 1; }
      else if(key === "Numpad0")       { joy.fire  = 1; }
      else if(key === "ControlRight")  { joy.arm   = 1; }
      else if(key === "Numpad9")       { joy.right = 1; joy.up   = 1; }
      else if(key === "Numpad3")       { joy.right = 1; joy.down = 1; }
      else if(key === "Numpad1")       { joy.left  = 1; joy.down = 1; }
      else if(key === "Numpad7")       { joy.left  = 1; joy.up   = 1; }
      else joystick_key = false;
   }
   else
   {
           if(key === "Numpad8")       { joy.up    = 0; }
      else if(key === "Numpad2")       { joy.down  = 0; }
      else if(key === "Numpad4")       { joy.left  = 0; }
      else if(key === "Numpad6")       { joy.right = 0; }
      else if(key === "Numpad0")       { joy.fire  = 0; }
      else if(key === "ControlRight")  { joy.arm   = 0; }
      else if(key === "Numpad9")       { joy.right = 0; joy.up   = 0; }
      else if(key === "Numpad3")       { joy.right = 0; joy.down = 0; }
      else if(key === "Numpad1")       { joy.left  = 0; joy.down = 0; }
      else if(key === "Numpad7")       { joy.left  = 0; joy.up   = 0; }
      else joystick_key = false;
   }
   return joystick_key;
}

function updateGamePad() {
   let gamepads = navigator.getGamepads();
   if(gamepads.length < 1) return;

   // joy 0
   let joy = swap_joystick ? joy_left : joy_right;
   let gamepad = gamepads[0];
   if(gamepad === null) return;

   if(gamepad.axes[0] < -0.5) joy.left  = 1; else joy.left  = 0;
   if(gamepad.axes[0] >  0.5) joy.right = 1; else joy.right = 0;
   if(gamepad.axes[1] < -0.5) joy.up    = 1; else joy.up    = 0;
   if(gamepad.axes[1] >  0.5) joy.down  = 1; else joy.down  = 0;

   if(gamepad.buttons[0].pressed) joy.arm   = 1; else joy.arm   = 0;
   if(gamepad.buttons[1].pressed) joy.fire  = 1; else joy.fire  = 0;

   // joy 1
   joy = swap_joystick ? joy_right : joy_left;
   gamepad = gamepads[1];
   if(gamepad === null) return;

   if(gamepad.axes[0] < -0.5) joy.left  = 1; else joy.left  = 0;
   if(gamepad.axes[0] >  0.5) joy.right = 1; else joy.right = 0;
   if(gamepad.axes[1] < -0.5) joy.up    = 1; else joy.up    = 0;
   if(gamepad.axes[1] >  0.5) joy.down  = 1; else joy.down  = 0;

   if(gamepad.buttons[0].pressed) joy.arm   = 1; else joy.arm   = 0;
   if(gamepad.buttons[1].pressed) joy.fire  = 1; else joy.fire  = 0;
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

/*
port &h20: joy 1 dirs/fire,joy 1 arm,joy 2 dirs/fire,joy 2 arm
port &h21: joy 1 arm,joy 2 dirs/fire,joy 2 arm
port &h22: joy 1 dirs/fire,joy 2 dirs/fire,joy 2 arm
port &h23: joy 2 dirs/fire,joy 2 arm
port &h24: joy 1 dirs/fire,joy 1 arm,joy 2 arm
port &h25: joy 1 arm,joy 2 arm
port &h26: joy 1 dirs/fire,joy 2 arm
port &h27: joy 2 arm
port &h28: joy 1 dirs/fire,joy 1 arm,joy 2 dirs/fire
port &h29: joy 1 arm,joy 2 dirs/fire
port &h2a: joy 1 dirs/fire,joy 2 dirs/fire
port &h2b: joy 2 dirs/fire
port &h2c: joy 1 dirs/fire,joy 1 arm
port &h2d: joy 1 arm
port &h2e: joy 1 dirs/fire
port &h2f: 
*/