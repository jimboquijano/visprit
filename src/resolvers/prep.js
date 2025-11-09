/**
 * @file resolvers/prep.js
 *
 */

import { getDisplayType, getBestPerspective } from '../utils/helper'
import { isMultiWrap } from '../utils/block'

/**
 * A collection of resolver functionality related to preparing elements.
 *
 */
export default {
  /**
   * Prepares the elements with cascade.
   *
   * @param {Object} animJson
   * @param {Node} el
   * @param {Node} els
   */
  cascade({ animJson, el, els }) {
    const perspective = getBestPerspective(el)

    if (animJson.hasCascade) {
      els.forEach((el) => {
        el.setAttribute('data-swcascade', 1)
        el.parentElement.style.perspective = perspective
      })
    }
  },

  /**
   * Prepares the elements with multi wrap.
   *
   * @param {Node} el
   */
  multiWrap({ el }) {
    const perspective = getBestPerspective(el)

    if (isMultiWrap(el)) {
      el.style.perspective = perspective
    }
  },

  /**
   * Prepares the elements with mask.
   *
   * @param {Object} animJson
   * @param {Node} el
   */
  hasMask({ animJson, el }) {
    if (animJson.hasMask) {
      el.setAttribute('data-swmask', 1)
    }
  },

  /**
   * Prepares the elements with inline display.
   *
   * @param {Node} els
   */
  inline({ els }) {
    els.forEach((el) => {
      if (getDisplayType(el) == 'inline') {
        el.style.display = 'inline-block'
      }
    })
  },

  /**
   * Prepares the elements with block column.
   *
   * @param {Node} el
   * @param {Node} els
   */
  column({ el, els }) {
    const perspective = getBestPerspective(el)

    els.forEach((el) => {
      if (el.classList.contains('wp-block-column')) {
        el.parentElement.style.perspective = perspective
      }
    })
  }
}
