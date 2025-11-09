/**
 * @file visprit.js
 *
 */

import { strxToJson } from './utils/helper'
import Glance from './triggers/glance'
import Scroll from './triggers/scroll'

/**
 * Initializes all elements with Visprit animation.
 *
 * @param {string} type
 * @param {Object} Feature
 * @param {function} listener
 */
const startVisprit = (type, Feature, listener) => {
  const Instances = []

  document.querySelectorAll('[' + type + ']').forEach((el) => {
    const animJson = dissolveAttr(el, type)
    const instance = new Feature(animJson, el)
    Instances.push(instance)
  })

  listener(Instances)
}

/**
 * Retrieves a json from an element given an attr and deletes it.
 *
 * @param {Node} el
 * @param {Object} attr
 * @returns {Object}
 */
const dissolveAttr = (el, attr) => {
  let json = null

  if (el.getAttribute(attr)) {
    json = strxToJson(el.getAttribute(attr))
  }

  el.setAttribute(attr, 1)

  return json
}

/**
 * Listens for peeking to trigger the glance animations.
 *
 */
const startVsGlance = () => {
  startVisprit('vs-glance', Glance, (Glances) => {
    window._swglanceAborter = new AbortController()
    let started = 0

    window.addEventListener(
      'scroll',
      () => {
        if (Glances.length === started) {
          return window._swglanceAborter.abort()
        }

        Glances.forEach((glance) => {
          if (glance.start()) {
            started++
          }
        })
      },
      { signal: window._swglanceAborter.signal }
    )
  })
}

/**
 * Listens for scrolling to trigger the scroll animations.
 *
 */
const startVsScroll = () => {
  startVisprit('vs-scroll', Scroll, (Scrolls) => {
    let lastScrollY = 0

    window.addEventListener('scroll', () => {
      Scrolls.forEach((scroll) => {
        scroll.start(lastScrollY)
      })

      lastScrollY = window.scrollY
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  startVsGlance()
  startVsScroll()
})

/* -------------------------------------------------------------------------- */
/* Global APIs                                                                */
/* -------------------------------------------------------------------------- */

export { startVsGlance, startVsScroll }
