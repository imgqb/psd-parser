/**
 * Created by Edward Chu <crazyzyt@gmail.com>
 * 
 * Copyright (c) 2017-present, JD.com, Inc.
 * All rights reserved.
 */

const LayerEffects = require('../constants/LayerEffects')
const BlendMode = require('../constants/BlendMode')

function getBlendMode (file) {
  let blendModeSig = file.readString(4)
  let blendModeKey = file.readString(4)
  return BlendMode[blendModeKey]
}

function getColorWithSpace (file) {
  file.readShort() // space
  return [
      -file.readShort(),
      -file.readShort(),
      -file.readShort(),
      -file.readShort()
  ].reverse()
}

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
            let visible = file.readByte() > 0
            let unused = file.readShort() > 0
            effects.push({
              type: LayerEffects[effectSig],
              visible,
              unused
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
            let color = getColorWithSpace(file)
            let blendMode = getBlendMode(file)
            let enabled = file.readByte() > 0
            let isUseAngleInaAllEffects = file.readByte() > 0
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
            let color = getColorWithSpace(file)
            let blendMode = getBlendMode(file)
            let enabled = file.readByte() > 0
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
            let color = getColorWithSpace(file)
            let blendMode = getBlendMode(file)
            let enabled = file.readByte() > 0
            let opacity = file.readByte()
            let invert = file.readByte() > 0
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
            let highlightBlendMode = getBlendMode(file)
            let shadowBlendMode = getBlendMode(file)
            let highlightColor = getColorWithSpace(file)
            let shadowColor = getColorWithSpace(file)
            let bevel = file.readByte()
            let highlightOpacity = file.readByte()
            let shadowOpacity = file.readByte()
            let enabled = file.readByte() > 0
            let isUseAngleInaAllEffects = file.readByte() > 0
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
            let blendMode = getBlendMode(file)
            let color = getColorWithSpace(file)
            let opacity = file.readByte()
            let enabled = file.readByte() > 0
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