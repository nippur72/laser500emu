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

function handleJoyStick(key, press) 
{
   let joystick_key = true;
   if(press) 
   {
           if(key === "Numpad8")       joy0 = reset(joy0, 1);
      else if(key === "Numpad9")       joy0 = reset(joy0, 1+8);
      else if(key === "Numpad6")       joy0 = reset(joy0, 8);
      else if(key === "Numpad3")       joy0 = reset(joy0, 8+2); 
      else if(key === "Numpad2")       joy0 = reset(joy0, 2);
      else if(key === "Numpad1")       joy0 = reset(joy0, 2+4);
      else if(key === "Numpad4")       joy0 = reset(joy0, 4);
      else if(key === "Numpad7")       joy0 = reset(joy0, 4+1);
      else if(key === "Numpad0")       joy1 = reset(joy1, 16);
      else if(key === "ControlRight")  joy0 = reset(joy0, 16);
      else joystick_key = false;
   }
   else
   {
           if(key === "Numpad8")       joy0 = set(joy0, 1);
      else if(key === "Numpad9")       joy0 = set(joy0, 1+8);
      else if(key === "Numpad6")       joy0 = set(joy0, 8);
      else if(key === "Numpad3")       joy0 = set(joy0, 8+2); 
      else if(key === "Numpad2")       joy0 = set(joy0, 2);
      else if(key === "Numpad1")       joy0 = set(joy0, 2+4);
      else if(key === "Numpad4")       joy0 = set(joy0, 4);
      else if(key === "Numpad7")       joy0 = set(joy0, 4+1);
      else if(key === "Numpad0")       joy1 = set(joy1, 16);
      else if(key === "ControlRight")  joy0 = set(joy0, 16);
      else joystick_key = false;
   }
   return joystick_key;
}
