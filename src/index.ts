import 'p5/global'

import { randInt, randGaussian } from './rand'
import { generateBlotLayers } from './blot'
import { drawPolygon, rotate, drawPoint } from './utils'
import {
  HEIGHT,
  WIDTH,
  PADDING,
  LAYER_COUNT,
  BLOT_SATURATION,
  BLOT_LIGHTNESS,
  BG_HUE,
  BG_SATURATION,
  BG_LIGHTNESS,
} from './params'

import type { Blot } from './types'

const origin = [WIDTH / 2, HEIGHT / 2]

const blots: Blot[] = []
const dots: number[][] = []

export function setup() {
  createCanvas(WIDTH, HEIGHT)
  noStroke()

  background(color(`hsla(${BG_HUE}, ${BG_SATURATION}%, ${BG_LIGHTNESS}%, 1)`))

  // // SINGLE BLOT //
  // const blotHue = randInt(0, 360)
  // const sides = randInt(3, 5)
  // const radius = 100

  // const xCenter = WIDTH / 2
  // const yCenter = HEIGHT / 2
  // const center = [xCenter, yCenter]

  // const layers = generateBlotLayers({ blotHue, sides, radius, center })

  // blots.push({ layers: layers, startAngle: 0 })

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

  //     const layers = generateBlotLayers({ blotHue, sides, radius, xCenter, yCenter })

  //     blots.push({ layers: layers })
  //   }
  // }

  // GRID //
  const rowCount = randInt(2, 5)
  const columnCount = randInt(2, 5)

  const positionDeviation = 30

  for (let i = 0; i < rowCount; i++) {
    const clusterHue = randInt(0, 359)

    for (let j = 0; j < columnCount; j++) {
      const blotHue = clusterHue + 10 * (0.5 - randGaussian())

      const sides = randInt(3, 5)
      const radius = randInt(400, 500) / (rowCount * columnCount)

      let xCenter = j * ((WIDTH - 2 * PADDING) / (columnCount - 1)) + PADDING
      let yCenter = i * ((HEIGHT - 2 * PADDING) / (rowCount - 1)) + PADDING

      xCenter += positionDeviation * (0.5 - randGaussian())
      yCenter += positionDeviation * (0.5 - randGaussian())

      const center = [xCenter, yCenter]

      const layers = generateBlotLayers({ blotHue, sides, radius, center })

      const startAngle = randInt(0, 359)

      blots.push({ layers: layers, startAngle: startAngle })
      dots.push([xCenter, yCenter])
    }
  }
}

let currentLayer = 0

const ROTATION_ARC_LENGTH = randInt(10, 50)
const ROTATION_PER_LAYER = ROTATION_ARC_LENGTH / LAYER_COUNT

export function draw() {
  blots.forEach((blot) => {
    const { startAngle } = blot
    const { hue, vertices } = blot.layers[currentLayer]
    const colorString = `hsla(${hue},${BLOT_SATURATION}%,${BLOT_LIGHTNESS}%,${1 / LAYER_COUNT})`

    fill(color(colorString))

    // const finalVertices = vertices
    const finalVertices = vertices.map((vertex) =>
      rotate(vertex, origin, startAngle + currentLayer * ROTATION_PER_LAYER)
    )

    drawPolygon(finalVertices)

    // if (currentLayer === 0) {
    //   noFill()
    //   stroke(color('black'))
    //   strokeWeight(2)
    //   drawPolygon(vertices)
    //   noStroke()
    // }
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
