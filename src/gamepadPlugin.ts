import { NamedComponent, Component, Entity, FPlugin } from 'freerunner'

export interface GamepadSystem {
  _gamepadComponents: Array<Array<any>>
  init(): void
  _gamepadCheck(): void
  events: any
  addGamepad(gamepad: Gamepad): void
  addGamepadComponent(componentId: number, index?: number): number
}

export interface E_Gamepad extends Entity {
  gamepad(index?: number): this
}

interface C_Gamepad extends Component {
  _gamepadIndex: number
  gamepad(index?: number): this
}

const GamepadPlugin: FPlugin = {
  name: 'GamepadPlugin',
  load(F) {

    F.s<GamepadSystem>('GamepadSystem', {
      _gamepadComponents : [] as Array<Array<number>>,
      init(this:GamepadSystem) {
        this._gamepadComponents = [] as Array<Array<number>>
      },
      _gamepadCheck() {
        let gamepads = navigator.getGamepads()
        console.log(gamepads)
      },
      addGamepad(gamepad: Gamepad) {
        console.log('System - addGamepad', gamepad)
        F.trigger('GamepadConnected', gamepad)    
      },
      addGamepadComponent(componentId: number, index?: number) {
        console.log('System - add component ', componentId)
        index = index === undefined ? this._gamepadComponents.length : index
        this._gamepadComponents[index] = this._gamepadComponents[index] ? [...this._gamepadComponents[index], componentId] : [componentId]
        console.log('gamepadComponents', this._gamepadComponents, index)
        return index
      },
      events: {
        'UpdateFrame': function(this: GamepadSystem) {
          let gamepads = navigator.getGamepads()
          if (!gamepads) return
          for (const gamepad of gamepads) {
            if (!gamepad) continue
            const components = this._gamepadComponents[gamepad.index]
            if (!components) continue
            for (const component of components)
              (<any>F(component)).trigger('GamepadUpdate', gamepad)
          }
            
        }
      }
    })

    F.c<C_Gamepad>('Gamepad', {
      _gamepadIndex: 0,
      required: '',
      init() {
        
        return this
      },
      gamepad(index) {
          this._gamepadIndex = F.s<GamepadSystem>('GamepadSystem').addGamepadComponent(this[0], index)
          return this
      },
      /*
      events: {
        'GamepadUpdate': function(gamepad: Gamepad) {
        }
      }
      */
    })

    window.addEventListener("gamepadconnected", (event) => {
      console.log("Window: A gamepad connected:", event.gamepad.index);
      // console.log(event.gamepad);
      F.s<GamepadSystem>('GamepadSystem').addGamepad(event.gamepad)
    
    }, {once: false})
  }
}

export const DirectionalGamepad: NamedComponent = {
  name: 'DirectionalGamepad',
  required: 'Gamepad, Color',
  init() {
      this._lastDirectionalState = '00'
  },
  events: {
      'GamepadUpdate': function(this: Entity, gamepad: Gamepad) {
          const btns = gamepad.buttons
          let x = btns[14].pressed ? -1 : btns[15].pressed ? 1 : 0
          let y = btns[12].pressed ? -1 : btns[13].pressed ? 1 : 0
          const state = `${x}${y}`
          if (state !== this._lastDirectionalState) {
              this._lastDirectionalState = state
              this.trigger('GamepadDirection', [x,y])
              
          }
      }
  }
}

export const ABXYGamepad: NamedComponent = {
  name:'ABXYGamepad',
  required: 'Gamepad',
  init() {
      this._lastABXYState = ''
  },
  events: {
      'GamepadUpdate': function(this: Entity, gamepad: Gamepad) {
          const btns = gamepad.buttons
          const state = { A:btns[0].pressed, B: btns[1].pressed, X: btns[2].pressed, Y: btns[3].pressed }
          let toString = `${state.A?'A':''}${state.B?'B':''}${state.X?'X':''}${state.Y?'Y':''}`
          if (toString !== this._lastABXYState) {
              this._lastABXYState = toString
              this.trigger('GamepadABXY', state)
          }
      }
  }
}

export default GamepadPlugin
