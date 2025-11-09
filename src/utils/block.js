/**
 * @file utils/block.js
 *
 */

/**
 * Checks if an element is a multiwrap block.
 *
 * @param {Node} el
 * @returns {boolean}
 */
export const isMultiWrap = (el) => {
  if (
    el.classList.contains('wp-block-image') ||
    el.classList.contains('wp-block-cover') ||
    el.classList.contains('wp-block-button')
  ) {
    return true
  }

  return false
}

/**
 * Retrieves the child elements for multiwrap blocks.
 *
 * @param {Node} el
 * @returns {Array}
 */
export const getMultiWrapElements = (el) => {
  let els = []

  if (el.classList.contains('wp-block-image')) {
    els = el.querySelectorAll(':scope > *')
  }

  if (el.classList.contains('wp-block-cover')) {
    els = el.querySelectorAll(
      ':scope > .wp-block-cover__inner-container, :scope > .wp-block-cover__image-background'
    )
  }

  if (el.classList.contains('wp-block-button')) {
    els = el.querySelectorAll(':scope > .wp-block-button__link')
  }

  return els
}

/**
 * Retrieves the list of text type blocks.
 *
 * @returns {Array}
 */
export const getTextBlocks = () => {
  return ['core/paragraph', 'core/heading']
}

/**
 * Retrieves the list of multi-wrap type blocks.
 *
 * @returns {Array}
 */
export const getMultiWrapBlocks = () => {
  return ['core/column', 'core/button', 'core/image', 'core/cover']
}
