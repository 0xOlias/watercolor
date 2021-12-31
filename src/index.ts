import 'p5/global'

import { randInt, randGaussian } from './rand'
import { generateBlotLayers } from './blot'
import { drawPolygon, drawPoint } from './drawUtils'
import {
  HEIGHT,
  WIDTH,
  PADDING,
  LAYER_COUNT,
  MIN_SATURATION,
  MAX_SATURATION,
  MIN_LIGHTNESS,
  MAX_LIGHTNESS,
} from './params'

import type { IBlotData } from './types'

// blot color params
const SATURATION = randInt(MIN_SATURATION, MAX_SATURATION)
const LIGHTNESS = randInt(MIN_LIGHTNESS, MAX_LIGHTNESS)
const LAYER_ALPHA = 1 / LAYER_COUNT

// background color params
const HUE_BG = 1
const SATURATION_BG = 20
const LIGHTNESS_BG = 95

const blots: IBlotData[] = []
const dots: number[][] = []

export function setup() {
  createCanvas(WIDTH, HEIGHT)
  noStroke()

  background(color(`hsla(${HUE_BG}, ${SATURATION_BG}%, ${LIGHTNESS_BG}%, 1)`))

  // SINGLE BLOT //
  const blotHue = randInt(0, 360)
  const sides = randInt(3, 5)
  const radius = 100

  const xCenter = WIDTH / 2
  const yCenter = HEIGHT / 2

  const layers = generateBlotLayers({ blotHue, sides, radius, xCenter, yCenter })
  const blotData = { layers: layers }

  blots.push(blotData)

  // // RING //
  // const ringCount = 2
  // const positionDeviation = 30

  // for (let c = 0; c < ringCount; c++) {
  //   const clusterHue = randInt(0, 360)

  //   const ringRadius = randInt(100, 350)
  //   const blotCount = Math.floor(ringRadius / 10)
  //   const ringCenterX = randInt(PADDING, WIDTH - PADDING)
  //   const ringCenterY = randInt(PADDING, HEIGHT - PADDING)

  //   for (let n = 0; n < blotCount; n++) {
  //     const blotHue = clusterHue + 25 * (0.5 - randGaussian())

  //     const sides = randInt(3, 5)
  //     const radius = randInt(5, 10)

  //     let xCenter = ringCenterX + ringRadius * Math.cos((2 * Math.PI * n) / blotCount)
  //     let yCenter = ringCenterY + ringRadius * Math.sin((2 * Math.PI * n) / blotCount)

  //     xCenter += positionDeviation * (0.5 - randGaussian())
  //     yCenter += positionDeviation * (0.5 - randGaussian())

  // const layers = generateBlotLayers({ blotHue, sides, radius, xCenter, yCenter })
  // const blotData = { layers: layers }

  //     blots.push(blotData)
  //   }
  // }

  // // GRID //
  // const rowCount = randInt(1, 1)
  // const columnCount = randInt(1, 1)
  // const positionDeviation = 10

  // for (let i = 0; i < rowCount; i++) {
  //   const clusterHue = randInt(0, 360)

  //   for (let j = 0; j < columnCount; j++) {
  //     const blotHue = clusterHue + 25 * (0.5 - randGaussian())

  //     const sides = randInt(3, 5)
  //     const radius = randInt(200, 300) / (rowCount * columnCount)

  //     let xCenter = j * ((WIDTH - 2 * PADDING) / (columnCount - 1)) + PADDING
  //     let yCenter = i * ((HEIGHT - 2 * PADDING) / (rowCount - 1)) + PADDING

  //     xCenter += positionDeviation * (0.5 - randGaussian())
  //     yCenter += positionDeviation * (0.5 - randGaussian())

  //     const layers = generateBlotLayers({ blotHue, sides, radius, xCenter, yCenter })
  //     const blotData = { layers: layers }

  //     blots.push(blotData)
  //     dots.push([xCenter, yCenter])
  //   }
  // }
}

let currentLayer = 0

export function draw() {
  blots.forEach((blotData) => {
    const { layerHue, vertices } = blotData.layers[currentLayer]
    const colorString = `hsla(${layerHue},${SATURATION}%,${LIGHTNESS}%,${LAYER_ALPHA})`

    fill(color(colorString))
    drawPolygon(vertices)

    if (currentLayer === 0) {
      noFill()
      stroke(color('black'))
      strokeWeight(2)
      drawPolygon(vertices)
      noStroke()
    }
  })

  // if (currentLayer === 0) {
  //   dots.forEach((dot) => {
  //     stroke(color('black'))
  //     strokeWeight(3)
  //     drawPoint(dot)
  //   })
  // }

  currentLayer += 1

  if (currentLayer === LAYER_COUNT) {
    noLoop()
  }
}
