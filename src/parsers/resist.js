/**
 * @file parsers/resist.js
 *
 */

import { getTransforms } from '../utils/panel'
import Effect from './effect'

/**
 * A collection of parser functionality related to resistance.
 *
 */
const Resist = {
  /**
   * Retrieves the translate data given the bearing.
   *
   * @param {string} bearing
   * @param {number} data
   * @returns {Object}
   */
  translate({ bearing, data }) {
    return parseTransform(bearing, data, 'translateX')
  },

  /**
   * Retrieves the rotate data given the bearing.
   *
   * @param {string} bearing
   * @param {number} data
   * @returns {Object}
   */
  rotate({ bearing, data }) {
    return parseTransform(bearing, data, 'rotate')
  },

  /**
   * Retrieves the skew data given the bearing.
   *
   * @param {string} bearing
   * @param {number} data
   * @returns {Object}
   */
  skew({ bearing, data }) {
    return parseTransform(bearing, data, 'skewX')
  },

  /**
   * Retrieves the scale data given the bearing.
   *
   * @param {string} bearing
   * @param {number} data
   * @returns {Object}
   */
  scale({ bearing, data }) {
    return parseTransform(bearing, data, 'scale')
  },

  /**
   * Retrieves the rotate data given the bearing.
   *
   * @param {string} bearing
   * @param {number} data
   * @returns {Object}
   */
  clipPath({ bearing, data }) {
    if (bearing == 'damper-up') {
      return Math.min(data, 0)
    } else if (bearing == 'damper-down') {
      return Math.max(data, 0)
    }

    return data
  },

  /**
   * Retrieves the skew data given the bearing.
   *
   * @param {string} bearing
   * @param {number} data
   * @returns {Object}
   */
  opacity({ bearing, data }) {
    if (bearing == 'damper-up') {
      return -data
    } else if (bearing == 'return') {
      return Math.abs(data)
    }

    return data
  }
}

/**
 * Retrieves the transform data given the bearing and prop.
 *
 * @param {string} bearing
 * @param {number} data
 * @param {string} prop
 * @returns {Object}
 */
export const parseTransform = (bearing, data, prop) => {
  const transforms = getTransforms()
  const def = transforms[prop]

  const parsedDef = parseFloat(def)
  const parsedData = parseFloat(data)

  if (bearing == 'damper-up' && parsedData > parsedDef) {
    return parsedDef
  } else if (bearing == 'damper-down' && parsedData < parsedDef) {
    return parsedDef
  } else if (bearing == 'return-down') {
    return Math.abs(parsedData)
  } else if (bearing == 'return-up') {
    return -Math.abs(parsedData)
  }

  return parsedData
}

/**
 * Retrieves the resist data after parsing the resist and transition.
 *
 * @param {Object} animJson
 * @param {string} data
 * @returns {Object}
 */
export const getResistData = (animJson, data) => {
  for (const parser in Effect) {
    const type = animJson[parser + 'Type']
    const bearing = animJson.bearing

    if (type) {
      data = Resist[parser]({
        bearing,
        data
      })

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

export default Resist
