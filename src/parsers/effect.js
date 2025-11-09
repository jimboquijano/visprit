/**
 * @file parsers/effect.js
 *
 */

import { getReverseMap } from '../utils/panel'

/**
 * A collection of parser functionality related to effects.
 *
 */
const Effect = {
  /**
   * Retrieves the translate object given a type and distance.
   *
   * @param {string} type
   * @param {number} data
   * @returns {Object}
   */
  translate({ type, data }) {
    const move = {
      translateX: null,
      translateY: null
    }

    switch (type) {
      case 'left':
        move.translateX = data + 'px'
        break
      case 'right':
        move.translateX = -data + 'px'
        break
      case 'top':
        move.translateY = data + 'px'
        break
      case 'bottom':
        move.translateY = -data + 'px'
        break
      case 'topleft':
        move.translateY = data + 'px'
        move.translateX = data + 'px'
        break
      case 'topright':
        move.translateY = data + 'px'
        move.translateX = -data + 'px'
        break
      case 'botleft':
        move.translateY = -data + 'px'
        move.translateX = data + 'px'
        break
      case 'botright':
        move.translateY = -data + 'px'
        move.translateX = -data + 'px'
        break
      default:
        move.translateY = -data + 'px'
        break
    }

    return cleanEffect(move)
  },

  /**
   * Retrieves the rotate object given a type and degree.
   *
   * @param {string} type
   * @param {number} data
   * @returns {Object}
   */
  rotate({ type, data }) {
    const positive = data + 'deg'
    const negative = -data + 'deg'

    const rotate = {
      rotateX: null,
      rotateY: null,
      rotate: null
    }

    switch (type) {
      case 'left':
        rotate.rotateY = positive
        break
      case 'right':
        rotate.rotateY = negative
        break
      case 'top':
        rotate.rotateX = negative
        break
      case 'bottom':
        rotate.rotateX = positive
        break
      case 'clockwise':
        rotate.rotate = negative
        break
      case 'counter':
        rotate.rotate = positive
        break
      default:
        rotate.rotateX = negative
        break
    }

    return cleanEffect(rotate)
  },

  /**
   * Retrieves the skew object given a type and degree.
   *
   * @param {string} type
   * @param {number} data
   * @returns {Object}
   */
  skew({ type, data }) {
    const positive = data + 'deg'
    const negative = -data + 'deg'

    const skew = {
      skewX: null,
      skewY: null
    }

    switch (type) {
      case 'vleft':
        skew.skewY = positive
        break
      case 'vright':
        skew.skewY = negative
        break
      case 'htop':
        skew.skewX = positive
        break
      case 'hbottom':
        skew.skewX = negative
        break
      default:
        skew.skewX = negative
        break
    }

    return cleanEffect(skew)
  },

  /**
   * Retrieves the scale given the scale type and degree.
   *
   * @param {string} type
   * @param {number} data
   * @returns {Object}
   */
  scale({ type, data }) {
    let zoom = 1 + data / 100
    let shrink = 1 - data * 0.01

    const scale = {
      scaleX: null,
      scaleY: null,
      scale: null
    }

    switch (type) {
      case 'hin':
        scale.scaleX = zoom
        break
      case 'hout':
        scale.scaleX = shrink
        break
      case 'vin':
        scale.scaleY = zoom
        break
      case 'vout':
        scale.scaleY = shrink
        break
      case 'in':
        scale.scale = zoom
        break
      case 'out':
        scale.scale = shrink
        break
      default:
        scale.scaleY = shrink
        break
    }

    return cleanEffect(scale)
  },

  /**
   * Retrieves the clip path given the clip type and path.
   *
   * @param {string} type
   * @param {number} data
   * @returns {Object}
   */
  clipPath({ type, data }) {
    let clipPath

    switch (type) {
      case 'left':
        clipPath = 'inset(0% 0% 0% ' + data + '%)'
        break
      case 'right':
        clipPath = 'inset(0% ' + data + '% 0% 0%)'
        break
      case 'top':
        clipPath = 'inset(' + data + '% 0% 0% 0%)'
        break
      case 'bottom':
        clipPath = 'inset(0% 0% ' + data + '% 0%)'
        break
      case 'hout':
        clipPath = 'inset(0% ' + data + '%)'
        break
      case 'vout':
        clipPath = 'inset(' + data + '% 0%)'
        break
      case 'vhout':
        clipPath = 'inset(' + data + '% ' + data + '%)'
        break
      default:
        clipPath = 'inset(0% 0% ' + data + '% 0%)'
        break
    }

    return {
      clipPath
    }
  },

  /**
   * Retrieves the opacity given the opacity fade.
   *
   * @param {number} data
   * @returns {Object}
   */
  opacity({ data }) {
    const opacity = (100 - data) / 100

    return {
      opacity
    }
  }
}

/**
 * Removes null and undefined properties from the object.
 *
 * @param {Object} obj
 * @returns {Object}
 */
const cleanEffect = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null))
}

/**
 * Retrieves the effect data after parsing the transition.
 *
 * @param {Object} animJson
 * @param {boolean} reverse
 * @returns {Object}
 */
export const getEffectData = (animJson, reverse = false) => {
  for (const parser in Effect) {
    let type = animJson[parser + 'Type']
    let data = animJson[parser]

    if (reverse) {
      type = getReverseMap()[type]
    }

    if (type) {
      data = Effect[parser]({
        type,
        data
      })

      delete animJson[parser]
      animJson = { ...animJson, ...data }
    }
  }

  return animJson
}

export default Effect
