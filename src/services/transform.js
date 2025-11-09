/**
 * @file services/transform.js
 *
 */

import { replaceNumbers } from '../utils/helper'
import { getTransforms } from '../utils/panel'

/**
 * Handles all the funcationality related to transform data.
 *
 * @param {Object} animJson
 */
export default class {
  constructor(animJson) {
    this.animJson = animJson
    this.defaults = getTransforms()
  }

  /**
   * Retrieves the data transform clump from the animJson.
   *
   * @param {function} callback
   * @returns {Array}
   */
  getDataClump(callback) {
    const transformArr = []

    for (const prop in this.defaults) {
      if (this.animJson[prop]) {
        const val = callback ? callback(prop) : this.animJson[prop]
        transformArr.push(prop + '(' + val + ')')
      }
    }

    if (transformArr.length) {
      return transformArr.join(' ')
    }

    return null
  }

  /**
   * Retrieves the default transform clump from the animJson.
   *
   * @returns {Object}
   */
  getDefaultClump() {
    const transformArr = []

    for (const prop in this.defaults) {
      if (this.animJson[prop]) {
        transformArr.push(prop + '(' + this.defaults[prop] + ')')
      }
    }

    if (transformArr.length) {
      return transformArr.join(' ')
    }

    return null
  }

  /**
   * Retrieves the elements' transform clump from the animJson.
   *
   * @param {Node} el
   * @returns {Object}
   */
  getNodeClump(el) {
    const transformArr = []

    for (const prop in this.defaults) {
      if (this.animJson[prop]) {
        transformArr.push(prop + '(' + this.#getTransform(el, prop) + ')')
      }
    }

    if (transformArr.length) {
      return transformArr.join(' ')
    }

    return null
  }

  /**
   * Retrieves the reset transform clump.
   *
   * @returns {Object}
   */
  getResetClump() {
    const transformArr = []

    for (const prop in this.defaults) {
      transformArr.push(prop + '(' + this.defaults[prop] + ')')
    }

    if (transformArr.length) {
      return transformArr.join(' ')
    }

    return null
  }

  /**
   * Retrieves the transform of an element given a prop.
   *
   * @param {Node} el
   * @param {string} prop
   * @returns {string}
   */
  #getTransform(el, prop) {
    const matrix = getComputedStyle(el).transform
    let decomposed

    if (matrix !== 'none') {
      if (matrix.indexOf('matrix(') >= 0) {
        decomposed = this.#decomposeMatrix(matrix)
      } else {
        decomposed = this.#decomposeMatrix3d(matrix)
      }
    }

    if (decomposed) {
      const currentTransform = Number(decomposed[prop])
      return replaceNumbers(this.defaults[prop], [currentTransform])
    }

    return this.defaults[prop]
  }

  /**
   * Decompose a matrix transform string.
   *
   * @param {string} matrix
   * @returns {Object}
   */
  #decomposeMatrix(matrix) {
    const values = matrix.split('(')[1].split(')')[0].split(',')

    const a = values[0]
    const b = values[1]
    const rotate = Math.round(Math.atan2(b, a) * (180 / Math.PI))

    return {
      translateX: values[4],
      translateY: values[5],
      scale: values[0],
      scaleX: values[0],
      scaleY: values[3],
      rotate: rotate,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      skewX: values[2],
      skewY: values[1]
    }
  }

  /**
   * Decompose a matrix3d transform string.
   *
   * @param {string} matrix
   * @returns {Object}
   */
  #decomposeMatrix3d(matrix) {
    const values = matrix.split('(')[1].split(')')[0].split(',')

    const sinB = parseFloat(values[8])
    const rotateY = Math.round((Math.asin(sinB) * 180) / Math.PI)

    const cosB = Math.cos((rotateY * Math.PI) / 180)
    const matrixVal10 = parseFloat(values[9])
    const rotateX = Math.round((Math.asin(-matrixVal10 / cosB) * 180) / Math.PI)

    const matrixVal1 = parseFloat(values[0])
    const rotateZ = Math.round((Math.acos(matrixVal1 / cosB) * 180) / Math.PI)

    return {
      rotateX: rotateX,
      rotateY: rotateY,
      rotateZ: rotateZ
    }
  }
}
