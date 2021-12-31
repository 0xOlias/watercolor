import 'p5/global'

import { randInt, randGaussian } from './random'
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

// blot color params
const SATURATION = randInt(MIN_SATURATION, MAX_SATURATION)
const LIGHTNESS = randInt(MIN_LIGHTNESS, MAX_LIGHTNESS)
const LAYER_ALPHA = 1 / LAYER_COUNT

// background color params
const HUE_BG = randInt(0, 360)
const SATURATION_BG = randInt(25, 35)
const LIGHTNESS_BG = 123 - SATURATION_BG

// layers to be drawn
const blotLayers: { layerHue: number; vertices: number[][] }[][] = []
const dots: number[][] = []

export function setup() {
  createCanvas(WIDTH, HEIGHT)
  noStroke()

  background(color(`hsla(${HUE_BG}, ${SATURATION_BG}%, ${LIGHTNESS_BG}%, 1)`))

  // // RING //
  // const ringCount = 2

  // for (let c = 0; c < ringCount; c++) {
  //   const clusterHue = randInt(0, 360)

  //   const ringRadius = randInt(100, 350)
  //   const blotCount = Math.floor(ringRadius / 10)
  //   const ringCenterX = randInt(PADDING, WIDTH - PADDING)
  //   const ringCenterY = randInt(PADDING, HEIGHT - PADDING)

  //   const positionDeviation = 30

  //   for (let n = 0; n < blotCount; n++) {
  //     const blotHue = clusterHue + 25 * (0.5 - randGaussian())

  //     const sides = randInt(3, 5)
  //     const radius = randInt(5, 10)

  //     let xCenter = ringCenterX + ringRadius * Math.cos((2 * Math.PI * n) / blotCount)
  //     let yCenter = ringCenterY + ringRadius * Math.sin((2 * Math.PI * n) / blotCount)

  //     xCenter += positionDeviation * (0.5 - randGaussian())
  //     yCenter += positionDeviation * (0.5 - randGaussian())

  //     const layers = generateBlotLayers({
  //       blotHue,
  //       sides,
  //       radius,
  //       xCenter,
  //       yCenter,
  //     })

  //     blotLayers.push(layers)
  //   }
  // }

  // GRID //
  const rowCount = 3 // randInt(2, 8)
  const columnCount = 3 // randInt(2, 8)
  const positionDeviation = 10

  for (let i = 0; i < rowCount; i++) {
    const clusterHue = randInt(0, 360)

    for (let j = 0; j < columnCount; j++) {
      const blotHue = clusterHue + 25 * (0.5 - randGaussian())

      const sides = randInt(3, 5)
      const radius = randInt(80, 120)

      let xCenter = j * ((WIDTH - 2 * PADDING) / (columnCount - 1)) + PADDING
      let yCenter = i * ((HEIGHT - 2 * PADDING) / (rowCount - 1)) + PADDING

      xCenter += positionDeviation * (0.5 - randGaussian())
      yCenter += positionDeviation * (0.5 - randGaussian())

      const layers = generateBlotLayers({ blotHue, sides, radius, xCenter, yCenter })

      blotLayers.push(layers)
      dots.push([xCenter, yCenter])
    }
  }
}

let currentLayer = 0

export function draw() {
  blotLayers.forEach((blotLayer) => {
    const { layerHue, vertices } = blotLayer[currentLayer]
    const colorString = `hsla(${layerHue},${SATURATION}%,${LIGHTNESS}%,${LAYER_ALPHA})`
    drawPolygon(vertices, colorString)
  })

  // if (currentLayer === 0) {
  // noFill()
  // stroke(color('black'))
  // strokeWeight(2)
  // square(PADDING, PADDING, WIDTH - 2 * PADDING)
  // noStroke()
  // }

  // if (currentLayer === 0) {
  // dots.forEach((dot) => {
  //   const [x, y] = dot
  //   const colorString = 'black'
  //   drawPoint(x, y, colorString)
  // })
  // }

  currentLayer += 1

  if (currentLayer === LAYER_COUNT) {
    noLoop()
  }
}
