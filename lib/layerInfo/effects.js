/**
 * Created by Edward Chu <crazyzyt@gmail.com>
 * 
 * Copyright (c) 2017-present, JD.com, Inc.
 * All rights reserved.
 */

const LayerEffects = require('../constants/LayerEffects')

module.exports = {
    id: 'lrFX',
    parse: function(file){
        let version = file.readShort(),
            effectsCount = file.readShort()

        let effects = []

        while (true) {
          let sig = file.readString(4),
              effectSig = file.readString(4)

          if (sig !== '8BIM') {
            break
          }

          let endPos

          // common state info
          if (effectSig === 'cmnS') {
            let len = file.readInt()
            let version = file.readInt()
            let visible = file.readBoolean()
            file.seek(2) // visible
            effects.push({
              type: LayerEffects[effectSig],
              visible
            })
          }

          // drop shadow
          else if (effectSig === 'dsdw' || effectSig === 'isdw') {
            let size = file.readInt()
            endPos = file.now() + size
            let version = file.readInt()
            let blurValue = file.readInt()
            let intensity = file.readInt()
            let angle = file.readInt()
            let distance = file.readInt()
            let color = file.readSpaceColor()
            let blendMode = file.readBlendMode()
            let enabled = file.readBoolean()
            let isUseAngleInaAllEffects = file.readBoolean()
            let opacity = file.readByte()

            effects.push({
              type: LayerEffects[effectSig],
              blendMode,
              blurValue,
              intensity,
              angle,
              distance,
              color,
              enabled
            })
          }

          // outer glow
          else if (effectSig === 'oglw') {
            let size = file.readInt()
            endPos = file.now() + size
            let version = file.readInt()
            let blurValue = file.readInt()
            let intensity = file.readInt()
            let color = file.readSpaceColor()
            let blendMode = file.readBlendMode()
            let enabled = file.readBoolean()
            let opacity = file.readByte()
            
            effects.push({
              type: LayerEffects[effectSig],
              blendMode,
              blurValue,
              intensity,
              color,
              enabled
            })
          }

          // inner glow
          else if (effectSig === 'iglw') {
            let size = file.readInt()
            endPos = file.now() + size
            let version = file.readInt()
            let blurValue = file.readInt()
            let intensity = file.readInt()
            let color = file.readSpaceColor()
            let blendMode = file.readBlendMode()
            let enabled = file.readBoolean()
            let opacity = file.readByte()
            let invert = file.readBoolean()

            effects.push({
              type: LayerEffects[effectSig],
              blendMode,
              blurValue,
              intensity,
              color,
              enabled,
              invert
            })
          }

          // bevel info
          else if (effectSig === 'bevl') {
            let size = file.readInt()
            endPos = file.now() + size
            let version = file.readInt()
            let angle = file.readInt()
            let strength = file.readInt()
            let blurValue = file.readInt()
            let highlightBlendMode = file.readBlendMode()
            let shadowBlendMode = file.readBlendMode()
            let highlightColor = file.readSpaceColor()
            let shadowColor = file.readSpaceColor()
            let bevel = file.readByte()
            let highlightOpacity = file.readByte()
            let shadowOpacity = file.readByte()
            let enabled = file.readBoolean()
            let isUseAngleInaAllEffects = file.readBoolean()
            let upOrDown = file.readByte()

            effects.push({
              type: LayerEffects[effectSig],
              angle,
              strength,
              blurValue,
              highlightBlendMode,
              shadowBlendMode,
              highlightColor,
              shadowColor,
              bevel,
              highlightOpacity,
              shadowOpacity,
              enabled,
              isUseAngleInaAllEffects,
              upOrDown
            })
          }

          // solid fill
          else if (effectSig === 'sofi') {
            let size = file.readInt()
            endPos = file.now() + size
            let version = file.readInt()
            let blendMode = file.readBlendMode()
            let color = file.readSpaceColor()
            let opacity = file.readByte()
            let enabled = file.readBoolean()
            
            effects.push({
              type: LayerEffects[effectSig],
              blendMode,
              color,
              opacity,
              enabled
            })
          }

          if (endPos) {
            file.seek(endPos - file.now())
            endPos = null
          }
        }

        return effects
    }
};