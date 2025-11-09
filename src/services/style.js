/**
 * @file services/style.js
 *
 */

import { extractNumbers, replaceNumbers } from '../utils/helper'
import Transform from './transform'

/**
 * Handles all the funcationality related to keyframe styles.
 *
 * @param {Object} animJson
 */
export default class {
  constructor(animJson) {
    this.animJson = animJson
    this.Tranform = new Transform(animJson)
  }

  /**
   * Retrieves the style based on the data clump.
   *
   * @param {number} index
   * @returns {Object}
   */
  getData(index = 0) {
    let { clipPath, opacity } = this.animJson
    let transform = this.Tranform.getDataClump()

    if (this.#shouldOscillate(index)) {
      transform = this.Tranform.getDataClump((prop) => {
        this.#oscillateProp(prop)
      })

      clipPath = this.#oscillatePath(clipPath)
    }

    return this.#filterStyle({
      transform,
      clipPath,
      opacity
    })
  }

  /**
   * Retrieves the style based on the default clump.
   *
   * @returns {Object}
   */
  getDefault() {
    const transform = this.Tranform.getDefaultClump()
    const clipPath = 'inset(0 0 0 0)'
    const opacity = 0

    return this.#filterStyle({
      transform,
      clipPath,
      opacity
    })
  }

  /**
   * Retrieves the style given an element.
   *
   * @param {Node} el
   * @returns {Object}
   */
  getNode(el) {
    const transform = this.Tranform.getNodeClump(el)
    const clipPath = getComputedStyle(el)['clipPath']
    const opacity = getComputedStyle(el)['opacity']

    return this.#filterStyle({
      transform,
      clipPath,
      opacity
    })
  }

  /**
   * Retrieves the style based on the reset clump.
   *
   * @returns {Object}
   */
  getReset() {
    const transform = this.Tranform.getResetClump()
    const clipPath = 'inset(0 0 0 0)'
    const opacity = 1

    return {
      transform,
      clipPath,
      opacity
    }
  }

  /**
   * Filters the style by removing falsy.
   *
   * @param {Object} clump
   * @returns {Object}
   */
  #filterStyle(clump) {
    const { clipPath, opacity } = this.animJson

    if (!clump.transform) {
      delete clump.transform
    }

    if (clipPath == null || clipPath == undefined) {
      delete clump.clipPath
    }

    if (opacity == null || opacity == undefined) {
      delete clump.opacity
    }

    return clump
  }

  /**
   * Filters the property for oscillation.
   *
   * @param {Object} prop
   * @returns {string}
   */
  #oscillateProp(prop) {
    const filteredArr = []
    const val = this.animJson[prop]
    let extractedArr = extractNumbers(val)

    extractedArr.forEach((extracted) => {
      extracted = parseFloat(extracted)

      if (['scale', 'scaleX', 'scaleY'].includes(prop)) {
        const adjust = Math.abs(1 - extracted)
        extracted = extracted > 1 ? 1 - adjust : 1 + adjust
      } else {
        extracted = -extracted
      }

      filteredArr.push(extracted)
    })

    return replaceNumbers(val, filteredArr)
  }

  /**
   * Filters the clippath for oscillation.
   *
   * @param {string} clipPath
   * @returns {string}
   */
  #oscillatePath(clipPath) {
    let extractedArr = extractNumbers(clipPath)

    const r = extractedArr
    let r2 = [r[1], r[0]]

    if (r.length == 4) {
      r2 = [r[2], r[3], r[0], r[1]]
    }

    return replaceNumbers(clipPath, r2)
  }

  /**
   * Filters the clippath for oscillation.
   *
   * @param {number} index
   * @returns {boolean}
   */
  #shouldOscillate(index) {
    const isOdd = Math.abs(index % 2) == 1
    const hasCascade = this.animJson.cascadeOsc

    return isOdd && hasCascade
  }
}
