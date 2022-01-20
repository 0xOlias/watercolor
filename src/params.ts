// dimension params

import { randNum } from './rand'

const WINDOW_WIDTH = window.innerWidth
const WINDOW_HEIGHT = window.innerHeight

const HEIGHT = WINDOW_HEIGHT
const WIDTH = HEIGHT // * 0.6;

const PADDING = WIDTH * randNum(0.05, 0.2)

// blot primitive params
const TIERS = 3
const SECONDARY_ITERATIONS = 3

const LAYER_COUNT = 50

const SIDE_MAGNITUDE_MIN = 0.6
const SIDE_MAGNITUDE_MAX = 1.7

// blot color params
const MIN_SATURATION = 85
const MAX_SATURATION = 95

const MIN_LIGHTNESS = 40
const MAX_LIGHTNESS = 50

const LAYER_HUE_DEVIATION_MAGNITUDE = 100

export {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  HEIGHT,
  WIDTH,
  PADDING,
  TIERS,
  SECONDARY_ITERATIONS,
  LAYER_COUNT,
  SIDE_MAGNITUDE_MIN,
  SIDE_MAGNITUDE_MAX,
  MIN_SATURATION,
  MAX_SATURATION,
  MIN_LIGHTNESS,
  MAX_LIGHTNESS,
  LAYER_HUE_DEVIATION_MAGNITUDE,
}
