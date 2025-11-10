/**
 * @file resolvers/unprep.js
 *
 */

import { getDisplayType } from '../utils/helper'
import { isMultiWrap } from '../utils/block'

/**
 * A collection of resolver functionality related to unpreparing elements.
 *
 */
export default {
  /**
   * Unprepares the elements with cascade.
   *
   * @param {Object} animJson
   * @param {Node} els
   */
  cascade({ animJson, els }) {
    els.forEach((el) => {
      if (animJson.hasCascade) {
        el.removeAttribute('vs-cascade')
        el.parentElement.style.perspective = null
      }
    })
  },

  /**
   * Unprepares the elements with multi wrap.
   *
   * @param {Node} el
   */
  multiWrap({ el }) {
    if (isMultiWrap(el)) {
      el.style.perspective = null
    }
  },

  /**
   * Unprepares the elements with mask.
   *
   * @param {Object} animJson
   * @param {Node} el
   */
  hasMask({ animJson, el }) {
    if (animJson.hasMask) {
      el.removeAttribute('vs-mask')
    }
  },

  /**
   * Unprepares the elements with inline display.
   *
   * @param {Node} els
   */
  inline({ els }) {
    els.forEach((el) => {
      if (getDisplayType(el) == 'inline-block') {
        el.style.display = 'inline'
      }
    })
  },

  /**
   * Unprepares the elements with block column.
   *
   * @param {Node} els
   */
  column({ els }) {
    els.forEach((el) => {
      if (el.classList.contains('wp-block-column')) {
        el.parentElement.style.perspective = null
      }
    })
  }
}
