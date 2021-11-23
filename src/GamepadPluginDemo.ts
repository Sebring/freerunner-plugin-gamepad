import { Component, Entity, FPlugin } from 'freerunner'
import GamepadPlugin, { E_Gamepad,  ABXYGamepad, DirectionalGamepad } from './GamepadPlugin'

const GamepadPluginDemo: FPlugin = {
  name: 'GamepadPluginDemo',
  load(F) {
    F.viewport.width = 600
    F.viewport.height = 300

    F.loadPlugin(GamepadPlugin)

		F.init(500, 500, 'game').background('powderblue')

    F.createComponent(DirectionalGamepad)
    F.createComponent(ABXYGamepad)

    F.c<Component>('DemoGamepad', {
      required: 'DirectionalGamepad, Motion, DOM, WiredMBR',
      events: {
        'GamepadConnected': function(this: Entity) {
          this.addComponent('SolidMBR')
        },
        'GamepadDirection': function(this: Entity, state: number[]) {
          this.vx = 100 * state[0]
          this.vy = 100 * state[1]
        }
      }
    })

    F.c<Component>('DebugText', {
      required: 'Text, DOM, 2D, WiredMBR',
      _label: 'Debug:',
      _value: 'X',
      init() {
        this.w = 600
        this.textFont( { size: '16px' })
      },
      value(text:string) {
        this._value = text
        this.text(`${this._label} ${this._value}`)
        return this
      },
      label(text:string) {
        this._label = text
        this.text(`${this._label} ${this._value}`)
        return this
      }
    })


    F.e<Entity>('GamepadsConnectedText, DebugText')
      .attr({x: 10, y: 10})
      .label('Connected gamepads:').value('0')
      .bind('GamepadConnected', function(this: Entity) {
        let gamepads = navigator.getGamepads()
        let count = 0
        for (let i=0, N=gamepads.length; i<N; i++) {
          if (gamepads[i] !== null) count++
        }
        this.value(count)
      })

    F.e<E_Gamepad>('ButtonText, ABXYGamepad, DebugText')
      .attr({x: 10, y: 30})
      .gamepad()
      .label('Gamepad 1:').value('[]')
      .bind('GamepadABXY', function(this: Entity, state: any) {
        console.log('ABXY')
        this.value(`[${state.A?'A':''}${state.B?'B':''}${state.X?'X':''}${state.Y?'Y':''}]`)
      })

    let p = F.e<E_Gamepad>('DemoGamepad')
      .attr({x: 90, y: 90, w: 20, h: 20})
      .gamepad(0)
  }
}

export default GamepadPluginDemo
