/**
 * @file resolvers/anim.js
 *
 */

import { isMultiWrap, getMultiWrapElements } from '../utils/block'

/**
 * A collection of resolver functionality related to retrieving elements.
 *
 */
export default {
  /**
   * Retrieves the elements direct executeEl children.
   *
   * @param {Object} animJson
   * @param {Node} el
   * @returns {Array}
   */
  children({ animJson, el }) {
    if (animJson.execute == 'children' && animJson.executeEl) {
      return el.querySelectorAll(':scope > ' + animJson.executeEl)
    }

    return false
  },

  /**
   * Retrieves the elements closest executeEl ancestors.
   *
   * @param {Object} animJson
   * @param {Node} el
   * @returns {Array}
   */
  ancestor({ animJson, el }) {
    if (animJson.execute == 'ancestor' && animJson.executeEl) {
      const closest = el.closest(animJson.executeEl)

      if (closest) {
        return [closest]
      }
    }

    return false
  },

  /**
   * Retrieves the elements direct cascadeEl children.
   *
   * @param {Object} animJson
   * @param {Node} el
   * @returns {Array}
   */
  cascade({ animJson, el }) {
    if (animJson.hasCascade) {
      return el.querySelectorAll(':scope > ' + animJson.cascadeEl)
    }

    return false
  },

  /**
   * Retrieves the elements multiwrap children elements.
   *
   * @param {Node} el
   * @returns {Array}
   */
  multiWrap({ el }) {
    if (isMultiWrap(el)) {
      const els = getMultiWrapElements(el)
      return els.length ? els : [el]
    }

    return false
  },

  /**
   * Retrieves the elements direct children elements.
   *
   * @param {Object} animJson
   * @param {Node} el
   * @returns {Array}
   */
  hasMask({ animJson, el }) {
    if (animJson.hasMask) {
      const els = el.querySelectorAll(':scope > *')
      return els.length ? els : [el]
    }

    return false
  }
}
