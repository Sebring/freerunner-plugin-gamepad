Gamepad plugin for the [Freerunner](https://github.com/Sebring/freerunner) game engine.

Defines a `system` that will listen to connection-events of gamepads as well as life cycle events of `Gamepad`-components (or rather entities including the component).

The system will check gamepad inputs before each frame update (`EnterFrame`-event) and notify the components attached to the gamepad. The gamepads will only forward events if the state has changed since last event.

The plugin includes different gamepad components for different needs. One component listen to d-pad, another listens to the A/B/X/Y-buttons. This way one can compose entities with the features needed and reduce the chatter of events (and button checks) from all axis and buttons unless needed.

## Install
```
npm i -S freerunner-plugin-gamepad
```

## Usage
```javascript
import gamepadPlugin from 'gamepadPlugin'

// assuming F as initialized Freerunner instance

F.loadPlugin(gamepadPlugin)
```

## Milestones

### 0.1.0
Support:  
 [x] 1 gamepad
 [x] Connected event
 [ ] Disconnected event
 [x] General gamepad support
 [x] Component for D-pad
 [x] Component for A/B/X/Y
 [ ] Multiple components to one controller
 [ ] Demo of features

### 0.2.0
 [ ] Component for directional Axis
 [ ] Component for start/select
 [ ] Demo of features

### 1.0.0
 [ ] Multiple gamepads
 [ ] Tested on most common gamepads
 [ ] All buttons supported
 [ ] Documentation